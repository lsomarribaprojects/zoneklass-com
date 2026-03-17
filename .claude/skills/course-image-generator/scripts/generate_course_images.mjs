#!/usr/bin/env node

/**
 * Course Image Generator - Standalone Script
 *
 * Generates all images for a ZoneKlass course using Google Gemini AI (Nano Banana 2)
 *
 * Usage:
 *   node generate_course_images.mjs <course-slug> [--type <type>]
 *
 * Examples:
 *   node generate_course_images.mjs ia-para-marketing-y-negocios
 *   node generate_course_images.mjs domina-la-ia --type summaries
 *   node generate_course_images.mjs crypto-trading --type content
 *
 * Types:
 *   all        - Generate all image types (default)
 *   cover      - Lesson cover images only
 *   lessons    - Alias for 'cover'
 *   content    - Content images (PENDIENTE_IMG_* replacements)
 *   summaries  - Summary filminas only
 */

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'
import { GoogleGenAI } from '@google/genai'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// ===========================
// Configuration
// ===========================

const CONFIG = {
  RATE_LIMIT_DELAY: 3000, // 3s between requests (free tier ~15 RPM)
  ERROR_RETRY_DELAY: 5000, // 5s on error
  BUCKET_NAME: 'lesson-images',
}

// Module color palettes
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

const SUMMARY_STYLES = [
  'chalkboard',
  'modern-infographic',
  'isometric',
  'watercolor',
  'comic',
  'neon-dark',
  'vintage-notebook',
  '3d-render',
]

const SINSAJO_BRANDING = `
BRANDING (bottom-right corner, small and subtle):
- A small turquoise/teal hummingbird silhouette (simple, elegant, side profile with wings spread upward)
- Below the hummingbird: "sinsajo creators" in small text
- Use turquoise color for the hummingbird

FOOTER (bottom center, small neat text):
- "www.sinsajocreators.com"
`

const SUMMARY_RULES = `
CRITICAL RULES:
- ALL text MUST be clearly readable - TOP PRIORITY
- Use 16:9 landscape aspect ratio
- Include visual metaphors and icons related to the lesson topic
- The image must feel educational, attractive, and professional
`

// ===========================
// Environment Setup
// ===========================

function loadEnv() {
  try {
    const envPath = join(process.cwd(), '.env.local')
    const envContent = readFileSync(envPath, 'utf-8')
    const env = {}

    envContent.split('\n').forEach(line => {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        if (key && valueParts.length > 0) {
          env[key.trim()] = valueParts.join('=').trim()
        }
      }
    })

    return env
  } catch (error) {
    console.error('Error: Could not read .env.local file')
    console.error('Make sure you are running this script from the project root')
    process.exit(1)
  }
}

const env = loadEnv()

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY
const GOOGLE_AI_API_KEY = env.GOOGLE_AI_API_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !GOOGLE_AI_API_KEY) {
  console.error('Error: Missing required environment variables')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GOOGLE_AI_API_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
const ai = new GoogleGenAI({ apiKey: GOOGLE_AI_API_KEY })

// ===========================
// Prompt Builders
// ===========================

function buildCoverPrompt({ lessonTitle, moduleTitle, courseTitle, lessonIndex, moduleIndex }) {
  const palette = MODULE_PALETTES[moduleIndex] || MODULE_PALETTES[0]

  return `Create a flat illustration cover for an online course lesson.

Topic: "${lessonTitle}" (part of "${moduleTitle}")

Style: FLAT DESIGN ILLUSTRATION
- Flat, minimalist 2D illustration style (like Dribbble/Behance top shots)
- Clean geometric shapes, no gradients or 3D effects
- Solid color fills with subtle shadows only
- Primary colors: ${palette.colors} with ${palette.accent} accents
- Light/white background with the illustration centered
- Simple, recognizable icons and visual metaphors for the topic
- NO text, NO letters, NO words anywhere in the image
- 16:10 landscape aspect ratio
- Modern SaaS/tech app illustration aesthetic
- Each element should be distinct and well-separated

Create a unique composition that specifically represents "${lessonTitle}" - avoid generic AI imagery. Use concrete visual metaphors related to the specific topic.`
}

function buildContentPrompt({ altText, lessonTitle }) {
  return `Create a professional illustration for an online AI course lesson.

Lesson: "${lessonTitle}"
Image purpose: ${altText}

Style requirements:
- Clean, modern infographic/illustration style
- Professional color palette (blues, purples, teals)
- Clear visual hierarchy
- Educational and informative
- NO text or letters in the image
- Suitable for a professional online learning platform
- White or light background for readability within article content

The image should clearly illustrate the concept described above.`
}

function buildStylePrompt(style, lessonTitle, moduleTitle, conceptsList, keyTermsLine, moduleIndex) {
  const palette = MODULE_PALETTES[moduleIndex] || MODULE_PALETTES[0]

  switch (style) {
    case 'chalkboard':
      return `Create a chalkboard-style educational summary image.

SCENE: A realistic dark green classroom chalkboard with chalk-drawn elements.

TITLE (top center, large white chalk): "${lessonTitle}"
SUBTITLE (smaller, sky blue chalk): "${moduleTitle}"

KEY CONCEPTS (numbered chalk boxes):
${conceptsList}

STYLE:
- Dark green chalkboard with chalk dust texture and smudges
- White chalk for text, colored chalk for highlights (${palette.accent})
- Hand-drawn educational icons (lightbulb, book, brain, gear, chart)
- Chalk borders, eraser marks for authenticity
- Arrows connecting related concepts
${keyTermsLine}`

    case 'modern-infographic':
      return `Create a modern, clean infographic summarizing a lesson.

TOPIC: "${lessonTitle}" (from "${moduleTitle}")

KEY POINTS:
${conceptsList}

STYLE:
- Clean white/light gray background
- Flat design icons and illustrations
- Color scheme: ${palette.colors} with ${palette.accent} accents
- Numbered sections with connecting lines or flowchart layout
- Minimalist geometric shapes and clean typography
- Professional data visualization aesthetic (like Notion or Stripe)
- Small educational icons next to each concept
${keyTermsLine}`

    case 'isometric':
      return `Create an isometric 3D illustration summarizing a lesson.

TOPIC: "${lessonTitle}" (from "${moduleTitle}")

KEY CONCEPTS:
${conceptsList}

STYLE:
- Isometric perspective (30-degree angle)
- 3D blocks, platforms, and floating objects representing each concept
- Color palette: ${palette.colors} with ${palette.accent}
- Characters/figures interacting with the concepts
- Clean, modern isometric illustration like tech company landing pages
- Connected platforms with arrows showing concept flow
- Soft shadows and depth
${keyTermsLine}`

    case 'watercolor':
      return `Create a beautiful watercolor-style educational illustration.

TOPIC: "${lessonTitle}" (from "${moduleTitle}")

KEY CONCEPTS:
${conceptsList}

STYLE:
- Soft watercolor painting aesthetic with visible brush strokes and paint bleeds
- Elegant flowing colors: ${palette.colors} with ${palette.accent} splashes
- Concepts illustrated as watercolor vignettes arranged artistically
- Organic shapes and flowing connections between ideas
- Textured paper background (cream/off-white)
- Hand-lettered title in artistic watercolor calligraphy
- Educational icons painted in watercolor style
- Dreamy, inspiring, artistic mood
${keyTermsLine}`

    case 'comic':
      return `Create a comic/cartoon style educational summary.

TOPIC: "${lessonTitle}" (from "${moduleTitle}")

KEY CONCEPTS:
${conceptsList}

STYLE:
- Fun comic book / manga illustration style with speech bubbles and panels
- Colorful cartoon characters explaining or demonstrating concepts
- Bold outlines, halftone dots, action lines for energy
- Color palette: ${palette.colors} with ${palette.accent}
- Comic panels layout showing each concept as a mini-scene
- Expressive characters (a friendly teacher/robot/owl mascot)
- POW/ZAP style accent graphics for emphasis
- Educational but entertaining and engaging mood
${keyTermsLine}`

    case 'neon-dark':
      return `Create a futuristic neon-on-dark educational infographic.

TOPIC: "${lessonTitle}" (from "${moduleTitle}")

KEY CONCEPTS:
${conceptsList}

STYLE:
- Deep dark navy/black background
- Glowing neon outlines and text in ${palette.accent} and cyan/magenta
- Holographic/HUD interface aesthetic
- Floating neon icons for each concept connected by glowing lines
- Subtle grid pattern in the background
- Tech/cyberpunk inspired typography
- Glowing orbs and light particles for atmosphere
- Futuristic, high-tech, cutting-edge mood
- Color accents: ${palette.colors}
${keyTermsLine}`

    case 'vintage-notebook':
      return `Create a vintage notebook/journal style educational summary.

TOPIC: "${lessonTitle}" (from "${moduleTitle}")

KEY CONCEPTS:
${conceptsList}

STYLE:
- Aged/vintage lined notebook paper background with slightly yellowed pages
- Handwritten-style text in dark ink (fountain pen aesthetic)
- Sketched diagrams and doodles in the margins
- Sticky notes, paper clips, and washi tape elements
- Color accents with ${palette.accent} highlighter marks
- Small hand-drawn illustrations next to concepts
- Coffee ring stains and page wear for authenticity
- Nostalgic, studious, cozy mood
- Concept organization like a student's well-organized notes
${keyTermsLine}`

    case '3d-render':
      return `Create a stylized 3D render educational summary.

TOPIC: "${lessonTitle}" (from "${moduleTitle}")

KEY CONCEPTS:
${conceptsList}

STYLE:
- Clean 3D rendered scene with soft lighting and shadows
- Smooth, rounded 3D objects representing each concept (like Pixar/Nintendo style)
- Floating 3D text elements with depth and perspective
- Color scheme: ${palette.colors} with glossy ${palette.accent} accents
- Soft gradient background (light to medium tone)
- 3D icons and visual metaphors for each key concept
- Playful, modern, premium feel
- Subtle reflections and ambient occlusion
- Toy-like proportions and friendly aesthetic
${keyTermsLine}`

    default:
      return buildStylePrompt('modern-infographic', lessonTitle, moduleTitle, conceptsList, keyTermsLine, moduleIndex)
  }
}

function buildSummaryPrompt({ lessonTitle, moduleTitle, courseTitle, moduleIndex, lessonIndex, keyConcepts, keyTerms }) {
  // Use both moduleIndex and lessonIndex for better style distribution across all 8 styles
  const styleIndex = (moduleIndex + lessonIndex) % SUMMARY_STYLES.length
  const style = SUMMARY_STYLES[styleIndex]

  const conceptsList = keyConcepts.length > 0
    ? keyConcepts.map((concept, i) => `${i + 1}. "${concept}"`).join('\n')
    : `1. "${lessonTitle}"`

  const keyTermsLine = keyTerms.length > 0
    ? `\nHighlight these key terms: ${keyTerms.slice(0, 3).join(', ')}`
    : ''

  const stylePrompt = buildStylePrompt(style, lessonTitle, moduleTitle, conceptsList, keyTermsLine, moduleIndex)

  return `${stylePrompt}
${SINSAJO_BRANDING}
${SUMMARY_RULES}`
}

// ===========================
// HTML Utilities
// ===========================

function parsePendienteImgPlaceholders(html) {
  const regex = /<img\s+[^>]*src="(PENDIENTE_IMG_[^"]+)"[^>]*alt="([^"]*)"[^>]*>/gi
  const results = []
  let match

  while ((match = regex.exec(html)) !== null) {
    results.push({
      fullMatch: match[0],
      imageName: match[1],
      altText: match[2],
    })
  }

  // Also handle alt before src
  const regex2 = /<img\s+[^>]*alt="([^"]*)"[^>]*src="(PENDIENTE_IMG_[^"]+)"[^>]*>/gi
  while ((match = regex2.exec(html)) !== null) {
    const alreadyFound = results.some(r => r.imageName === match[2])
    if (!alreadyFound) {
      results.push({
        fullMatch: match[0],
        imageName: match[2],
        altText: match[1],
      })
    }
  }

  return results
}

function stripHtmlTags(html) {
  return html.replace(/<[^>]*>/g, '').trim()
}

function extractLessonConcepts(html, lessonTitle, maxConcepts = 5) {
  // Extract h2 headings
  const h2Regex = /<h2[^>]*>(.*?)<\/h2>/gi
  const h2s = []
  let match
  while ((match = h2Regex.exec(html)) !== null) {
    const text = stripHtmlTags(match[1])
    if (text.length > 0 && text.length < 100) h2s.push(text)
  }

  // Extract h3 headings
  const h3Regex = /<h3[^>]*>(.*?)<\/h3>/gi
  const h3s = []
  while ((match = h3Regex.exec(html)) !== null) {
    const text = stripHtmlTags(match[1])
    if (text.length > 0 && text.length < 100) h3s.push(text)
  }

  // Extract bold terms from list items
  const strongInLiRegex = /<li[^>]*>[^<]*<strong>(.*?)<\/strong>/gi
  const boldTerms = []
  while ((match = strongInLiRegex.exec(html)) !== null) {
    const text = stripHtmlTags(match[1])
    if (text.length > 0 && text.length < 60) boldTerms.push(text)
  }

  const mainTopic = h2s[0] || lessonTitle || 'Conceptos Clave'
  const allConcepts = [...h2s.slice(1), ...h3s]
  const uniqueConcepts = [...new Set(allConcepts)]
  const keyConcepts = uniqueConcepts.slice(0, maxConcepts)

  if (keyConcepts.length < 3 && boldTerms.length > 0) {
    const needed = Math.min(3 - keyConcepts.length, boldTerms.length)
    for (let i = 0; i < needed; i++) {
      if (!keyConcepts.includes(boldTerms[i])) {
        keyConcepts.push(boldTerms[i])
      }
    }
  }

  const uniqueTerms = [...new Set(boldTerms)]
  const keyTerms = uniqueTerms.slice(0, 5)

  return { mainTopic, keyConcepts, keyTerms }
}

// ===========================
// AI & Storage Functions
// ===========================

async function generateImage(prompt) {
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-image-preview',
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
    config: {
      responseModalities: ['image', 'text'],
    },
  })

  const parts = response.candidates?.[0]?.content?.parts
  if (!parts) {
    throw new Error('Nano Banana 2: No response parts received')
  }

  for (const part of parts) {
    if (part.inlineData?.data) {
      return {
        imageBase64: part.inlineData.data,
        revisedPrompt: prompt,
      }
    }
  }

  throw new Error('Nano Banana 2: No image data in response')
}

async function uploadGeneratedImage({ base64Data, courseSlug, lessonId, imageType, imageName }) {
  const buffer = Buffer.from(base64Data, 'base64')
  const timestamp = Date.now()
  const safeName = imageName.replace(/[^a-z0-9_-]/gi, '_').slice(0, 50)
  const filePath = `${courseSlug}/${lessonId}/${imageType}_${safeName}_${timestamp}.png`

  const { data, error } = await supabase.storage
    .from(CONFIG.BUCKET_NAME)
    .upload(filePath, buffer, {
      contentType: 'image/png',
      cacheControl: '31536000',
      upsert: false,
    })

  if (error) {
    throw new Error(`Storage upload error: ${error.message}`)
  }

  const { data: urlData } = supabase.storage
    .from(CONFIG.BUCKET_NAME)
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

// ===========================
// Generation Functions
// ===========================

async function generateLessonCover(lesson, module, course) {
  console.log(`  [Cover] ${lesson.title}...`)

  try {
    const prompt = buildCoverPrompt({
      lessonTitle: lesson.title,
      moduleTitle: module.title,
      courseTitle: course.title,
      lessonIndex: lesson.order_index,
      moduleIndex: module.order_index,
    })

    const result = await generateImage(prompt)

    const publicUrl = await uploadGeneratedImage({
      base64Data: result.imageBase64,
      courseSlug: course.slug,
      lessonId: lesson.id,
      imageType: 'cover',
      imageName: 'cover',
    })

    await supabase
      .from('lessons')
      .update({ cover_image_url: publicUrl })
      .eq('id', lesson.id)

    console.log(`  [Cover] ✓ Generated`)
    return { success: true }
  } catch (error) {
    console.error(`  [Cover] ✗ Error: ${error.message}`)
    return { success: false, error: error.message }
  }
}

async function generateContentImages(lesson, course) {
  if (!lesson.content) {
    return { success: true, count: 0 }
  }

  const placeholders = parsePendienteImgPlaceholders(lesson.content)
  if (placeholders.length === 0) {
    return { success: true, count: 0 }
  }

  console.log(`  [Content] ${lesson.title} (${placeholders.length} images)...`)

  let updatedContent = lesson.content
  let successCount = 0
  const errors = []

  for (const placeholder of placeholders) {
    try {
      const prompt = buildContentPrompt({
        altText: placeholder.altText,
        lessonTitle: lesson.title,
      })

      const result = await generateImage(prompt)

      const publicUrl = await uploadGeneratedImage({
        base64Data: result.imageBase64,
        courseSlug: course.slug,
        lessonId: lesson.id,
        imageType: 'content',
        imageName: placeholder.imageName.replace('PENDIENTE_IMG_', ''),
      })

      updatedContent = updatedContent.replace(placeholder.imageName, publicUrl)
      successCount++

      await new Promise(resolve => setTimeout(resolve, 2000)) // 2s between images
    } catch (error) {
      errors.push(`${placeholder.imageName}: ${error.message}`)
    }
  }

  if (successCount > 0) {
    await supabase
      .from('lessons')
      .update({ content: updatedContent })
      .eq('id', lesson.id)
  }

  console.log(`  [Content] ✓ ${successCount}/${placeholders.length} images`)
  if (errors.length > 0) {
    errors.forEach(err => console.error(`    ✗ ${err}`))
  }

  return { success: errors.length === 0, count: successCount, errors }
}

async function generateSummaryImage(lesson, module, course) {
  if (!lesson.content) {
    return { success: false, error: 'No content to generate summary from' }
  }

  console.log(`  [Summary] ${lesson.title}...`)

  try {
    const concepts = extractLessonConcepts(lesson.content, lesson.title)

    const prompt = buildSummaryPrompt({
      lessonTitle: lesson.title,
      moduleTitle: module.title,
      courseTitle: course.title,
      moduleIndex: module.order_index,
      lessonIndex: lesson.order_index,
      keyConcepts: concepts.keyConcepts,
      keyTerms: concepts.keyTerms,
    })

    const result = await generateImage(prompt)

    const publicUrl = await uploadGeneratedImage({
      base64Data: result.imageBase64,
      courseSlug: course.slug,
      lessonId: lesson.id,
      imageType: 'summary',
      imageName: 'summary',
    })

    await supabase
      .from('lessons')
      .update({ summary_image_url: publicUrl })
      .eq('id', lesson.id)

    console.log(`  [Summary] ✓ Generated`)
    return { success: true }
  } catch (error) {
    console.error(`  [Summary] ✗ Error: ${error.message}`)
    return { success: false, error: error.message }
  }
}

// ===========================
// Main Logic
// ===========================

async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
Course Image Generator - ZoneKlass

Usage:
  node generate_course_images.mjs <course-slug> [--type <type>]

Types:
  all        - Generate all image types (default)
  cover      - Lesson cover images only
  lessons    - Alias for 'cover'
  content    - Content images (PENDIENTE_IMG_* replacements)
  summaries  - Summary filminas only

Examples:
  node generate_course_images.mjs ia-para-marketing-y-negocios
  node generate_course_images.mjs domina-la-ia --type summaries
  node generate_course_images.mjs crypto-trading --type content
`)
    process.exit(0)
  }

  const courseSlug = args[0]
  const typeIndex = args.indexOf('--type')
  const imageType = typeIndex !== -1 && args[typeIndex + 1] ? args[typeIndex + 1] : 'all'

  console.log(`\n🎨 Course Image Generator`)
  console.log(`Course: ${courseSlug}`)
  console.log(`Type: ${imageType}\n`)

  // Fetch course
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('id, slug, title')
    .eq('slug', courseSlug)
    .single()

  if (courseError || !course) {
    console.error(`Error: Course '${courseSlug}' not found`)
    process.exit(1)
  }

  console.log(`Found: ${course.title}\n`)

  // Fetch modules
  const { data: modules } = await supabase
    .from('modules')
    .select('id, title, order_index')
    .eq('course_id', course.id)
    .order('order_index')

  if (!modules || modules.length === 0) {
    console.error('Error: No modules found for this course')
    process.exit(1)
  }

  // Fetch all lessons
  const allLessons = []
  for (const module of modules) {
    const { data: lessons } = await supabase
      .from('lessons')
      .select('id, title, order_index, cover_image_url, summary_image_url, content')
      .eq('module_id', module.id)
      .order('order_index')

    if (lessons) {
      lessons.forEach(lesson => {
        allLessons.push({ ...lesson, module })
      })
    }
  }

  console.log(`Total lessons: ${allLessons.length}\n`)

  // Statistics
  const stats = {
    covers: { total: 0, success: 0, errors: 0 },
    content: { total: 0, success: 0, errors: 0 },
    summaries: { total: 0, success: 0, errors: 0 },
  }

  const startTime = Date.now()

  // Generate images
  for (let i = 0; i < allLessons.length; i++) {
    const lesson = allLessons[i]
    const module = lesson.module

    console.log(`\n[${i + 1}/${allLessons.length}] Module ${module.order_index + 1}: ${module.title}`)

    // Generate cover
    if ((imageType === 'all' || imageType === 'cover' || imageType === 'lessons') && !lesson.cover_image_url) {
      stats.covers.total++
      const result = await generateLessonCover(lesson, module, course)
      if (result.success) {
        stats.covers.success++
      } else {
        stats.covers.errors++
      }
      await new Promise(resolve => setTimeout(resolve, CONFIG.RATE_LIMIT_DELAY))
    }

    // Generate content images
    if (imageType === 'all' || imageType === 'content') {
      const placeholders = lesson.content ? parsePendienteImgPlaceholders(lesson.content) : []
      if (placeholders.length > 0) {
        stats.content.total += placeholders.length
        const result = await generateContentImages(lesson, course)
        stats.content.success += result.count
        stats.content.errors += placeholders.length - result.count
        await new Promise(resolve => setTimeout(resolve, CONFIG.RATE_LIMIT_DELAY))
      }
    }

    // Generate summary
    if ((imageType === 'all' || imageType === 'summaries') && !lesson.summary_image_url) {
      stats.summaries.total++
      const result = await generateSummaryImage(lesson, module, course)
      if (result.success) {
        stats.summaries.success++
      } else {
        stats.summaries.errors++
      }
      await new Promise(resolve => setTimeout(resolve, CONFIG.RATE_LIMIT_DELAY))
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1)

  // Final report
  console.log(`\n\n📊 Generation Complete (${elapsed} minutes)`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)

  if (imageType === 'all' || imageType === 'cover' || imageType === 'lessons') {
    console.log(`\nCovers:`)
    console.log(`  ✓ Success: ${stats.covers.success}/${stats.covers.total}`)
    if (stats.covers.errors > 0) {
      console.log(`  ✗ Errors: ${stats.covers.errors}`)
    }
  }

  if (imageType === 'all' || imageType === 'content') {
    console.log(`\nContent Images:`)
    console.log(`  ✓ Success: ${stats.content.success}/${stats.content.total}`)
    if (stats.content.errors > 0) {
      console.log(`  ✗ Errors: ${stats.content.errors}`)
    }
  }

  if (imageType === 'all' || imageType === 'summaries') {
    console.log(`\nSummaries:`)
    console.log(`  ✓ Success: ${stats.summaries.success}/${stats.summaries.total}`)
    if (stats.summaries.errors > 0) {
      console.log(`  ✗ Errors: ${stats.summaries.errors}`)
    }
  }

  const totalSuccess = stats.covers.success + stats.content.success + stats.summaries.success
  const totalErrors = stats.covers.errors + stats.content.errors + stats.summaries.errors
  const estimatedCost = (totalSuccess * 0.04).toFixed(2)

  console.log(`\nTotal: ${totalSuccess} images generated, ${totalErrors} errors`)
  console.log(`Estimated cost: $${estimatedCost}`)
  console.log(`\n✨ Done!\n`)
}

main().catch(error => {
  console.error('\n❌ Fatal Error:', error.message)
  process.exit(1)
})
