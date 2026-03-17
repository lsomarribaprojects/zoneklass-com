// Each module gets a unique color palette for visual variety
const MODULE_PALETTES: Record<number, { colors: string; accent: string }> = {
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

// Sinsajo branding description based on actual logo (turquoise-to-cyan gradient hummingbird)
const SINSAJO_BRANDING = `
BRANDING (bottom-right corner, small and subtle):
- A small turquoise-to-cyan gradient hummingbird silhouette (elegant, side profile facing right with wings spread upward in flight, smooth curves, no details just a clean silhouette shape)
- The hummingbird transitions from teal/turquoise at the wings to sky blue at the tail
- Below the hummingbird: "sinsajo creators" in small dark navy blue serif text
- Keep it small and unobtrusive — it's a watermark, not the focus

FOOTER (bottom center, small neat text):
- "www.sinsajocreators.com"
`

// Subtle branding for covers and content images (less text, just the bird)
const SINSAJO_WATERMARK = `
WATERMARK (bottom-right corner, very small and semi-transparent):
- A tiny turquoise hummingbird silhouette (side profile, wings spread upward)
- Semi-transparent, subtle — should NOT distract from the main illustration
- No text needed, just the bird shape
`

// ─────────────────────────────────────────────────────────────
// COURSE COVER PROMPT
// ─────────────────────────────────────────────────────────────

export function buildCourseCoverPrompt(params: {
  courseTitle: string
  courseDescription: string
  moduleCount: number
}): string {
  const { courseTitle, courseDescription, moduleCount } = params

  return `Create a stunning, premium hero banner for an online course about AI and marketing for women entrepreneurs.

COURSE: "${courseTitle}"
DESCRIPTION: ${courseDescription}
SCOPE: ${moduleCount} modules covering AI tools, marketing, content creation, images, video, automation, and AI agents

COMPOSITION:
- A dynamic, inspiring scene that represents the fusion of artificial intelligence and business/marketing
- Central visual: A confident woman entrepreneur surrounded by floating holographic screens, AI interfaces, and creative tools
- Visual elements radiating outward: social media icons, charts going up, camera/video, paintbrush/design, megaphone, robot assistant, gears/automation
- The scene should feel empowering, modern, and full of possibility
- Turquoise/teal and navy blue as primary colors with warm gold and coral accents
- Soft gradient background from deep navy to teal

STYLE:
- Premium digital illustration, NOT stock photo style
- Semi-realistic with subtle glow effects and depth
- 16:9 landscape aspect ratio, suitable as course banner
- Rich, vibrant colors with professional polish
- NO text, NO letters, NO words anywhere in the image
- The image should make someone WANT to take this course
- Inspired by premium Udemy/Coursera course thumbnails but without text
${SINSAJO_BRANDING}

CRITICAL: Make the image feel aspirational and professional. This is the MAIN image students see when discovering the course.`
}

// ─────────────────────────────────────────────────────────────
// LESSON COVER PROMPT
// ─────────────────────────────────────────────────────────────

export function buildCoverPrompt(params: {
  lessonTitle: string
  moduleTitle: string
  courseTitle: string
  lessonIndex: number
  moduleIndex: number
}): string {
  const { lessonTitle, moduleTitle, lessonIndex, moduleIndex } = params
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
${SINSAJO_WATERMARK}
Create a unique composition that specifically represents "${lessonTitle}" - avoid generic AI imagery. Use concrete visual metaphors related to the specific topic.`
}

// ─────────────────────────────────────────────────────────────
// CONTENT IMAGE PROMPT (varied styles)
// ─────────────────────────────────────────────────────────────

// 6 visual styles that rotate for content images within lessons
const CONTENT_STYLES = [
  'flat-illustration',
  'icon-diagram',
  'isometric-scene',
  'infographic-card',
  'step-by-step',
  'dashboard-mockup',
] as const

function buildContentStylePrompt(
  style: string,
  altText: string,
  lessonTitle: string,
  palette: { colors: string; accent: string },
): string {
  switch (style) {
    case 'flat-illustration':
      return `Create a clean flat illustration for an online course.

Concept: ${altText}
Lesson context: "${lessonTitle}"

STYLE:
- Flat 2D illustration, Dribbble/Behance aesthetic
- Clean geometric shapes with solid color fills
- Color palette: ${palette.colors} with ${palette.accent} accents
- White/light background for readability in article content
- Modern tech/SaaS illustration style
- Educational and clear visual metaphors
- NO text, NO letters, NO words`

    case 'icon-diagram':
      return `Create an icon-based diagram illustration for an online course.

Concept: ${altText}
Lesson context: "${lessonTitle}"

STYLE:
- Clean icon grid or connected icon diagram
- Flat, rounded icons with consistent style (like Google Material icons)
- Color palette: ${palette.colors} with ${palette.accent} accents
- White background with subtle connecting lines or arrows between icons
- Each icon represents a key concept or step
- Professional and modern, like a tech company's feature page
- NO text, NO letters, NO words`

    case 'isometric-scene':
      return `Create an isometric 3D scene illustration for an online course.

Concept: ${altText}
Lesson context: "${lessonTitle}"

STYLE:
- Isometric perspective (30-degree angle)
- Cute, stylized 3D objects and mini-scenes
- Color palette: ${palette.colors} with ${palette.accent} accents
- Light background with soft shadows
- Objects floating or on platforms
- Modern, playful, tech-inspired
- NO text, NO letters, NO words`

    case 'infographic-card':
      return `Create a visual infographic card for an online course.

Concept: ${altText}
Lesson context: "${lessonTitle}"

STYLE:
- Clean data visualization / infographic aesthetic
- Minimal charts, progress bars, pie charts, or flow diagrams
- Color palette: ${palette.colors} with ${palette.accent} accents
- White card with subtle rounded corners and shadow
- Professional business/analytics aesthetic
- Visual hierarchy with clear sections
- NO text, NO letters, NO words — use visual indicators only`

    case 'step-by-step':
      return `Create a step-by-step process illustration for an online course.

Concept: ${altText}
Lesson context: "${lessonTitle}"

STYLE:
- Sequential visual showing 3-4 steps in a horizontal flow
- Each step as a distinct visual scene connected by arrows
- Color palette: ${palette.colors} with ${palette.accent} accents
- Clean, modern illustration style
- Light background for article readability
- Each step visually different but cohesive
- NO text, NO letters, NO words — purely visual storytelling`

    case 'dashboard-mockup':
      return `Create a stylized dashboard/interface mockup illustration for an online course.

Concept: ${altText}
Lesson context: "${lessonTitle}"

STYLE:
- Stylized UI mockup showing an app screen or dashboard
- Clean modern interface design with cards, panels, and data visualizations
- Color palette: ${palette.colors} with ${palette.accent} accents
- Browser frame or device frame for context
- Professional SaaS/tech product aesthetic
- Blurred/abstract content — focus on layout and visual feel
- NO readable text — use abstract wavy lines for text placeholders`

    default:
      return buildContentStylePrompt('flat-illustration', altText, lessonTitle, palette)
  }
}

export function buildContentPrompt(params: {
  altText: string
  lessonTitle: string
  moduleIndex?: number
  imageIndex?: number
}): string {
  const { altText, lessonTitle, moduleIndex = 0, imageIndex = 0 } = params
  const palette = MODULE_PALETTES[moduleIndex] || MODULE_PALETTES[0]

  const styleIdx = imageIndex % CONTENT_STYLES.length
  const style = CONTENT_STYLES[styleIdx]

  const stylePrompt = buildContentStylePrompt(style, altText, lessonTitle, palette)

  return `${stylePrompt}
${SINSAJO_WATERMARK}
CRITICAL: The image should clearly illustrate "${altText}" — avoid generic imagery. Use concrete visual metaphors. Make it educational, attractive, and professional.`
}

// ─────────────────────────────────────────────────────────────
// SUMMARY FILMINA PROMPT (8 rotating styles)
// ─────────────────────────────────────────────────────────────

const SUMMARY_STYLES = [
  'chalkboard',
  'modern-infographic',
  'isometric',
  'watercolor',
  'comic',
  'neon-dark',
  'vintage-notebook',
  '3d-render',
] as const

const SUMMARY_RULES = `
CRITICAL RULES:
- ALL text MUST be clearly readable - TOP PRIORITY
- Use 16:9 landscape aspect ratio
- Include visual metaphors and icons related to the lesson topic
- The image must feel educational, attractive, and professional
`

function buildStylePrompt(
  style: string,
  lessonTitle: string,
  moduleTitle: string,
  conceptsList: string,
  keyTermsLine: string,
  moduleIndex: number,
): string {
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

export function buildSummaryPrompt(params: {
  lessonTitle: string
  moduleTitle: string
  courseTitle: string
  moduleIndex: number
  lessonIndex: number
  keyConcepts: string[]
  keyTerms: string[]
}): string {
  const { lessonTitle, moduleTitle, moduleIndex, lessonIndex, keyConcepts, keyTerms } = params

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

// ─────────────────────────────────────────────────────────────
// PLACEHOLDER PARSING
// ─────────────────────────────────────────────────────────────

export interface PlaceholderInfo {
  fullMatch: string
  imageName: string
  altText: string
}

export function parsePendienteImgPlaceholders(html: string): PlaceholderInfo[] {
  const regex = /<img\s+[^>]*src="(PENDIENTE_IMG_[^"]+)"[^>]*alt="([^"]*)"[^>]*>/gi
  const results: PlaceholderInfo[] = []
  let match: RegExpExecArray | null

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
    const alreadyFound = results.some(r => r.imageName === match![2])
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

// ─────────────────────────────────────────────────────────────
// CONTENT IMAGE PLACEHOLDER INSERTION
// ─────────────────────────────────────────────────────────────

/**
 * Analyzes lesson HTML content and inserts PENDIENTE_IMG_ placeholders
 * after key sections (h2 headings). Skips exercise/practice sections.
 * Returns the updated HTML with placeholders added.
 */
export function insertContentImagePlaceholders(
  html: string,
  lessonTitle: string,
  maxImages: number = 3,
): string {
  // Don't insert if placeholders already exist
  if (html.includes('PENDIENTE_IMG_')) return html

  // Extract all h2 sections with their content
  const h2Regex = /<h2[^>]*>(.*?)<\/h2>/gi
  const h2Matches: { heading: string; index: number; endIndex: number }[] = []
  let match: RegExpExecArray | null

  while ((match = h2Regex.exec(html)) !== null) {
    h2Matches.push({
      heading: match[1].replace(/<[^>]*>/g, '').trim(),
      index: match.index,
      endIndex: match.index + match[0].length,
    })
  }

  if (h2Matches.length === 0) return html

  // Skip headings that are exercises, practices, or final sections
  const skipPatterns = /ejercicio|pr[aá]ctic[ao]|actividad|tarea|resumen|conclusi[oó]n|pr[oó]ximos pasos/i

  const validH2s = h2Matches.filter(h => !skipPatterns.test(h.heading))
  const toInsert = validH2s.slice(0, maxImages)

  if (toInsert.length === 0) return html

  // For each valid h2, find the end of its first paragraph and insert image after it
  let result = html
  let offset = 0

  for (let i = 0; i < toInsert.length; i++) {
    const h2 = toInsert[i]
    const afterH2 = h2.endIndex + offset

    // Find the first </p> or </ul> after this h2
    const afterContent = result.substring(afterH2)
    const endTagMatch = afterContent.match(/<\/(?:p|ul|ol)>/)

    if (!endTagMatch || endTagMatch.index === undefined) continue

    const insertPos = afterH2 + endTagMatch.index + endTagMatch[0].length

    // Create descriptive alt text based on the heading and lesson context
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
