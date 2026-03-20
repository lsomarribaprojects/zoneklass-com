/**
 * Batch Image Generator for ZoneKlass Courses
 *
 * Generates all images for a course: course cover, lesson covers, and content images.
 * Uses Google Gemini (Nano Banana 2) for generation and Supabase Storage for hosting.
 *
 * Usage:
 *   node scripts/batch-generate-images.mjs <course-slug> [--type all|cover|lessons|content|summaries] [--delay 4000]
 *
 * Examples:
 *   node scripts/batch-generate-images.mjs ia-para-marketing-y-negocios
 *   node scripts/batch-generate-images.mjs ia-para-marketing-y-negocios --type lessons
 *   node scripts/batch-generate-images.mjs ia-para-marketing-y-negocios --type content --delay 5000
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

// ─────────────────────────────────────────────────────────────
// ENV LOADING
// ─────────────────────────────────────────────────────────────

function loadEnv() {
  try {
    const envPath = resolve(process.cwd(), '.env.local')
    const content = readFileSync(envPath, 'utf-8')
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx === -1) continue
      const key = trimmed.slice(0, eqIdx).trim()
      const val = trimmed.slice(eqIdx + 1).trim()
      if (!process.env[key]) process.env[key] = val
    }
  } catch { /* .env.local not found, rely on existing env */ }
}
loadEnv()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const GOOGLE_AI_KEY = process.env.GOOGLE_AI_API_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}
if (!GOOGLE_AI_KEY) {
  console.error('Missing GOOGLE_AI_API_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ─────────────────────────────────────────────────────────────
// CLI ARGS
// ─────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const courseSlug = args[0]
if (!courseSlug) {
  console.error('Usage: node scripts/batch-generate-images.mjs <course-slug> [--type all|cover|lessons|content|summaries] [--delay ms]')
  process.exit(1)
}

const typeIdx = args.indexOf('--type')
const genType = typeIdx !== -1 ? args[typeIdx + 1] || 'all' : 'all'
const delayIdx = args.indexOf('--delay')
const DELAY_MS = delayIdx !== -1 ? parseInt(args[delayIdx + 1] || '4000') : 4000

// ─────────────────────────────────────────────────────────────
// MODULE PALETTES
// ─────────────────────────────────────────────────────────────

const MODULE_PALETTES = {
  0: { colors: 'indigo and sky blue', accent: 'electric blue' },
  1: { colors: 'emerald green and teal', accent: 'mint green' },
  2: { colors: 'coral and warm orange', accent: 'golden yellow' },
  3: { colors: 'violet and magenta', accent: 'pink' },
  4: { colors: 'amber and burnt orange', accent: 'warm gold' },
  5: { colors: 'crimson red and rose', accent: 'soft pink' },
  6: { colors: 'deep teal and cyan', accent: 'aquamarine' },
  7: { colors: 'slate blue and lavender', accent: 'periwinkle' },
  8: { colors: 'forest green and lime', accent: 'chartreuse' },
  9: { colors: 'royal purple and deep blue', accent: 'neon purple' },
}

const SINSAJO_BRANDING = `
BRANDING (bottom-right corner, small and subtle):
- A small turquoise-to-cyan gradient hummingbird silhouette (elegant, side profile facing right with wings spread upward in flight)
- Below the hummingbird: "sinsajo creators" in small dark navy blue serif text
- Keep it small and unobtrusive

FOOTER (bottom center, small neat text):
- "www.sinsajocreators.com"
`

const SINSAJO_WATERMARK = `
WATERMARK (bottom-right corner, very small and semi-transparent):
- A tiny turquoise hummingbird silhouette (side profile, wings spread upward)
- Semi-transparent, subtle
`

// ─────────────────────────────────────────────────────────────
// IMAGE GENERATION (Gemini / Nano Banana 2)
// ─────────────────────────────────────────────────────────────

let aiClient = null

async function getAiClient() {
  if (!aiClient) {
    const { GoogleGenAI } = await import('@google/genai')
    aiClient = new GoogleGenAI({ apiKey: GOOGLE_AI_KEY })
  }
  return aiClient
}

async function generateImage(prompt, maxRetries = 3) {
  const ai = await getAiClient()

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { responseModalities: ['image', 'text'] },
      })

      const candidate = response.candidates?.[0]
      if (!candidate?.content?.parts) {
        const reason = candidate?.finishReason || 'unknown'
        throw new Error(`No response parts (finishReason: ${reason})`)
      }

      for (const part of candidate.content.parts) {
        if (part.inlineData?.data) {
          return part.inlineData.data // base64
        }
      }
      throw new Error('No image data in response parts')
    } catch (err) {
      const isRateLimit = err.message?.includes('429') || err.message?.includes('RESOURCE_EXHAUSTED') || err.message?.includes('quota')
      const isRetryable = isRateLimit || err.message?.includes('No response parts') || err.message?.includes('500') || err.message?.includes('502') || err.message?.includes('503')

      if (attempt < maxRetries && isRetryable) {
        const backoff = isRateLimit ? 15000 * attempt : 8000 * attempt
        console.log(`      Retry ${attempt}/${maxRetries} in ${backoff / 1000}s (${err.message})`)
        await sleep(backoff)
        continue
      }
      throw err
    }
  }
}

async function uploadImage(base64Data, courseSlug, lessonId, imageType, imageName) {
  const buffer = Buffer.from(base64Data, 'base64')
  const timestamp = Date.now()
  const safeName = imageName.replace(/[^a-z0-9_-]/gi, '_').slice(0, 50)
  const filePath = `${courseSlug}/${lessonId}/${imageType}_${safeName}_${timestamp}.png`

  const { data, error } = await supabase.storage
    .from('lesson-images')
    .upload(filePath, buffer, {
      contentType: 'image/png',
      cacheControl: '31536000',
      upsert: false,
    })

  if (error) throw new Error(`Upload error: ${error.message}`)

  const { data: urlData } = supabase.storage
    .from('lesson-images')
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

// ─────────────────────────────────────────────────────────────
// PROMPT BUILDERS
// ─────────────────────────────────────────────────────────────

function buildCourseCoverPrompt(course, moduleCount) {
  return `Create a stunning, premium hero banner for an online course about AI and marketing for women entrepreneurs.

COURSE: "${course.title}"
DESCRIPTION: ${course.description || 'IA para Marketing y Negocios'}
SCOPE: ${moduleCount} modules covering AI tools, marketing, content creation, images, video, automation, and AI agents

COMPOSITION:
- A dynamic, inspiring scene representing the fusion of AI and business/marketing
- Central visual: A confident woman entrepreneur surrounded by floating holographic screens, AI interfaces, and creative tools
- Visual elements: social media icons, growth charts, camera/video, paintbrush, megaphone, robot assistant, gears/automation
- Empowering, modern, full of possibility
- Turquoise/teal and navy blue primary with warm gold and coral accents
- Soft gradient background from deep navy to teal

STYLE:
- Premium digital illustration, NOT stock photo
- Semi-realistic with subtle glow effects and depth
- 16:9 landscape, suitable as course banner
- Rich, vibrant, professional
- NO text, NO letters, NO words
${SINSAJO_BRANDING}
CRITICAL: Make it aspirational and professional. This is the MAIN course discovery image.`
}

function buildLessonCoverPrompt(lesson, mod) {
  const palette = MODULE_PALETTES[mod.order_index] || MODULE_PALETTES[0]
  return `Create a flat illustration cover for an online course lesson.

Topic: "${lesson.title}" (part of "${mod.title}")

Style: FLAT DESIGN ILLUSTRATION
- Flat, minimalist 2D illustration (Dribbble/Behance aesthetic)
- Clean geometric shapes, solid color fills with subtle shadows
- Primary colors: ${palette.colors} with ${palette.accent} accents
- Light/white background with illustration centered
- Recognizable icons and visual metaphors for the topic
- NO text, NO letters, NO words
- 16:10 landscape aspect ratio
- Modern SaaS/tech illustration aesthetic
${SINSAJO_WATERMARK}
Create a unique composition that specifically represents "${lesson.title}" - avoid generic imagery. Use concrete visual metaphors.`
}

const CONTENT_STYLES = [
  'flat-illustration', 'icon-diagram', 'isometric-scene',
  'infographic-card', 'step-by-step', 'dashboard-mockup',
]

function buildContentImagePrompt(altText, lessonTitle, moduleIndex, imageIndex) {
  const palette = MODULE_PALETTES[moduleIndex] || MODULE_PALETTES[0]
  const style = CONTENT_STYLES[imageIndex % CONTENT_STYLES.length]

  const styleDescriptions = {
    'flat-illustration': `Clean flat 2D illustration, Dribbble aesthetic, solid color fills`,
    'icon-diagram': `Icon-based diagram, connected flat rounded icons like Google Material`,
    'isometric-scene': `Isometric 3D scene, cute stylized objects, floating platforms`,
    'infographic-card': `Visual infographic card, data visualization, charts and progress bars`,
    'step-by-step': `Sequential process illustration, 3-4 steps in horizontal flow with arrows`,
    'dashboard-mockup': `Stylized UI mockup, modern dashboard with cards and panels`,
  }

  return `Create a professional illustration for an online AI course.

Concept: ${altText}
Lesson: "${lessonTitle}"

STYLE: ${styleDescriptions[style]}
- Color palette: ${palette.colors} with ${palette.accent} accents
- White/light background for article readability
- Educational and informative
- NO text, NO letters, NO words
${SINSAJO_WATERMARK}
CRITICAL: Clearly illustrate "${altText}" with concrete visual metaphors. Avoid generic AI imagery.`
}

// ─────────────────────────────────────────────────────────────
// PLACEHOLDER INSERTION
// ─────────────────────────────────────────────────────────────

function insertPlaceholders(html, lessonTitle, maxImages = 3) {
  if (html.includes('PENDIENTE_IMG_')) return html
  // Don't re-insert if lesson already has real content images from Supabase
  if (html.includes('supabase.co/storage')) return html

  const h2Regex = /<h2[^>]*>(.*?)<\/h2>/gi
  const h2Matches = []
  let match

  while ((match = h2Regex.exec(html)) !== null) {
    h2Matches.push({
      heading: match[1].replace(/<[^>]*>/g, '').trim(),
      index: match.index,
      endIndex: match.index + match[0].length,
    })
  }

  if (h2Matches.length === 0) return html

  const skipPatterns = /ejercicio|pr[aá]ctic[ao]|actividad|tarea|resumen|conclusi[oó]n|pr[oó]ximos pasos/i
  const validH2s = h2Matches.filter(h => !skipPatterns.test(h.heading))
  const toInsert = validH2s.slice(0, maxImages)

  if (toInsert.length === 0) return html

  let result = html
  let offset = 0

  for (let i = 0; i < toInsert.length; i++) {
    const h2 = toInsert[i]
    const afterH2 = h2.endIndex + offset
    const afterContent = result.substring(afterH2)
    const endTagMatch = afterContent.match(/<\/(?:p|ul|ol)>/)

    if (!endTagMatch || endTagMatch.index === undefined) continue

    const insertPos = afterH2 + endTagMatch.index + endTagMatch[0].length

    const safeName = h2.heading
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '')
      .slice(0, 40)

    const altText = `Ilustracion sobre ${h2.heading} en la leccion ${lessonTitle}`
    const imgTag = `\n<img src="PENDIENTE_IMG_${safeName}" alt="${altText}" class="lesson-content-img" />\n`

    result = result.slice(0, insertPos) + imgTag + result.slice(insertPos)
    offset += imgTag.length
  }

  return result
}

function parsePlaceholders(html) {
  const regex = /<img\s+[^>]*src="(PENDIENTE_IMG_[^"]+)"[^>]*alt="([^"]*)"[^>]*>/gi
  const results = []
  let match

  while ((match = regex.exec(html)) !== null) {
    results.push({ fullMatch: match[0], imageName: match[1], altText: match[2] })
  }

  const regex2 = /<img\s+[^>]*alt="([^"]*)"[^>]*src="(PENDIENTE_IMG_[^"]+)"[^>]*>/gi
  while ((match = regex2.exec(html)) !== null) {
    if (!results.some(r => r.imageName === match[2])) {
      results.push({ fullMatch: match[0], imageName: match[2], altText: match[1] })
    }
  }

  return results
}

// ─────────────────────────────────────────────────────────────
// MAIN PIPELINE
// ─────────────────────────────────────────────────────────────

async function main() {
  console.log('='.repeat(60))
  console.log(`BATCH IMAGE GENERATOR - ZoneKlass`)
  console.log(`Course: ${courseSlug}`)
  console.log(`Type: ${genType} | Delay: ${DELAY_MS}ms`)
  console.log('='.repeat(60))

  // Fetch course
  const { data: course, error: courseErr } = await supabase
    .from('courses')
    .select('id, title, description, slug, thumbnail_url')
    .eq('slug', courseSlug)
    .single()

  if (courseErr || !course) {
    console.error('Course not found:', courseSlug)
    process.exit(1)
  }

  console.log(`\nCourse: ${course.title} (${course.id})`)

  // Fetch modules and lessons
  const { data: modules } = await supabase
    .from('modules')
    .select('id, title, order_index')
    .eq('course_id', course.id)
    .order('order_index')

  if (!modules?.length) {
    console.error('No modules found')
    process.exit(1)
  }

  const allLessons = []
  for (const mod of modules) {
    const { data: lessons } = await supabase
      .from('lessons')
      .select('id, title, content, order_index, cover_image_url, summary_image_url')
      .eq('module_id', mod.id)
      .order('order_index')

    if (lessons) {
      for (const l of lessons) {
        allLessons.push({ ...l, module: mod })
      }
    }
  }

  console.log(`Found ${modules.length} modules, ${allLessons.length} lessons\n`)

  const stats = { courseCover: 0, lessonCovers: 0, contentImages: 0, summaries: 0, errors: [] }

  // ─── PHASE 1: Course Cover ────────────────────────────────
  if (['all', 'cover'].includes(genType)) {
    console.log('--- PHASE 1: Course Cover ---')
    if (course.thumbnail_url) {
      console.log('  Course already has a cover. Skipping (use --force to regenerate)')
    } else {
      try {
        console.log('  Generating course cover...')
        const prompt = buildCourseCoverPrompt(course, modules.length)
        const base64 = await generateImage(prompt)
        const url = await uploadImage(base64, course.slug, 'course-cover', 'cover', 'course-cover')
        await supabase.from('courses').update({ thumbnail_url: url }).eq('id', course.id)
        console.log(`  OK: ${url.split('/').pop()}`)
        stats.courseCover = 1
        await sleep(DELAY_MS)
      } catch (err) {
        console.error(`  ERROR: ${err.message}`)
        stats.errors.push(`Course cover: ${err.message}`)
      }
    }
  }

  // ─── PHASE 2: Lesson Covers ───────────────────────────────
  if (['all', 'lessons'].includes(genType)) {
    console.log('\n--- PHASE 2: Lesson Covers ---')
    for (let i = 0; i < allLessons.length; i++) {
      const lesson = allLessons[i]
      if (lesson.cover_image_url) {
        console.log(`  [${i + 1}/${allLessons.length}] SKIP: ${lesson.title} (already has cover)`)
        continue
      }
      try {
        console.log(`  [${i + 1}/${allLessons.length}] Generating: ${lesson.title}...`)
        const prompt = buildLessonCoverPrompt(lesson, lesson.module)
        const base64 = await generateImage(prompt)
        const url = await uploadImage(base64, course.slug, lesson.id, 'cover', 'cover')
        await supabase.from('lessons').update({ cover_image_url: url }).eq('id', lesson.id)
        console.log(`    OK: ${url.split('/').pop()}`)
        stats.lessonCovers++
        await sleep(DELAY_MS)
      } catch (err) {
        console.error(`    ERROR: ${err.message}`)
        stats.errors.push(`Cover ${lesson.title}: ${err.message}`)
        await sleep(DELAY_MS) // Still wait on error for rate limiting
      }
    }
  }

  // ─── PHASE 3: Content Images ──────────────────────────────
  if (['all', 'content'].includes(genType)) {
    console.log('\n--- PHASE 3: Content Images ---')

    // First, insert placeholders into all lessons that don't have them
    console.log('  Inserting image placeholders into lesson content...')
    let placeholdersInserted = 0
    for (const lesson of allLessons) {
      if (!lesson.content) continue
      const updated = insertPlaceholders(lesson.content, lesson.title)
      if (updated !== lesson.content) {
        await supabase.from('lessons').update({ content: updated }).eq('id', lesson.id)
        lesson.content = updated
        placeholdersInserted++
      }
    }
    console.log(`  Placeholders inserted into ${placeholdersInserted} lessons\n`)

    // Now generate images for all placeholders
    for (let i = 0; i < allLessons.length; i++) {
      const lesson = allLessons[i]
      if (!lesson.content) continue

      const placeholders = parsePlaceholders(lesson.content)
      if (placeholders.length === 0) {
        console.log(`  [${i + 1}/${allLessons.length}] SKIP: ${lesson.title} (no pending images)`)
        continue
      }

      console.log(`  [${i + 1}/${allLessons.length}] ${lesson.title} (${placeholders.length} images)`)

      let updatedContent = lesson.content
      let replaced = 0

      for (let j = 0; j < placeholders.length; j++) {
        const ph = placeholders[j]
        try {
          console.log(`    [${j + 1}/${placeholders.length}] ${ph.imageName.replace('PENDIENTE_IMG_', '')}...`)
          const prompt = buildContentImagePrompt(
            ph.altText,
            lesson.title,
            lesson.module.order_index,
            j,
          )
          const base64 = await generateImage(prompt)
          const url = await uploadImage(
            base64,
            course.slug,
            lesson.id,
            'content',
            ph.imageName.replace('PENDIENTE_IMG_', ''),
          )
          updatedContent = updatedContent.replace(ph.imageName, url)
          replaced++
          stats.contentImages++
          console.log(`    OK`)
          await sleep(DELAY_MS)
        } catch (err) {
          console.error(`    ERROR: ${err.message}`)
          stats.errors.push(`Content ${lesson.title}/${ph.imageName}: ${err.message}`)
          await sleep(DELAY_MS)
        }
      }

      if (replaced > 0) {
        await supabase.from('lessons').update({ content: updatedContent }).eq('id', lesson.id)
      }
    }
  }

  // ─── PHASE 4: Summary Images ──────────────────────────────
  if (['all', 'summaries'].includes(genType)) {
    console.log('\n--- PHASE 4: Summary Images ---')
    // Summary images already exist for this course, skip if already present
    const needsSummary = allLessons.filter(l => !l.summary_image_url)
    if (needsSummary.length === 0) {
      console.log('  All lessons already have summary images. Skipping.')
    } else {
      console.log(`  ${needsSummary.length} lessons need summary images`)
      // Summary generation uses the complex prompt system from prompt-templates.ts
      // For batch generation, we'd need to replicate the extractLessonConcepts + buildSummaryPrompt logic
      // Since summaries already exist for this course, we skip for now
      console.log('  (Use admin UI for summary regeneration)')
    }
  }

  // ─── SUMMARY ──────────────────────────────────────────────
  console.log('\n' + '='.repeat(60))
  console.log('GENERATION COMPLETE')
  console.log('='.repeat(60))
  console.log(`  Course Cover: ${stats.courseCover}`)
  console.log(`  Lesson Covers: ${stats.lessonCovers}`)
  console.log(`  Content Images: ${stats.contentImages}`)
  console.log(`  Errors: ${stats.errors.length}`)

  if (stats.errors.length > 0) {
    console.log('\nErrors:')
    stats.errors.forEach((e, i) => console.log(`  ${i + 1}. ${e}`))
  }

  const total = stats.courseCover + stats.lessonCovers + stats.contentImages
  console.log(`\nTotal images generated: ${total}`)
  console.log(`Estimated cost: ~$${(total * 0.04).toFixed(2)}`)
}

main().catch(err => {
  console.error('FATAL:', err)
  process.exit(1)
})
