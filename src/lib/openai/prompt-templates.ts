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

Create a unique composition that specifically represents "${lessonTitle}" - avoid generic AI imagery. Use concrete visual metaphors related to the specific topic.`
}

// Chalk color variations per module for summary infographics
const CHALK_COLORS: Record<number, { primary: string; secondary: string; accent: string }> = {
  0: { primary: 'white chalk', secondary: 'sky blue chalk', accent: 'yellow chalk' },
  1: { primary: 'white chalk', secondary: 'mint green chalk', accent: 'yellow chalk' },
  2: { primary: 'white chalk', secondary: 'coral chalk', accent: 'golden chalk' },
  3: { primary: 'white chalk', secondary: 'pink chalk', accent: 'lavender chalk' },
  4: { primary: 'white chalk', secondary: 'amber chalk', accent: 'cream chalk' },
  5: { primary: 'white chalk', secondary: 'rose chalk', accent: 'soft pink chalk' },
  6: { primary: 'white chalk', secondary: 'teal chalk', accent: 'aqua chalk' },
  7: { primary: 'white chalk', secondary: 'lavender chalk', accent: 'periwinkle chalk' },
  8: { primary: 'white chalk', secondary: 'lime green chalk', accent: 'yellow-green chalk' },
  9: { primary: 'white chalk', secondary: 'purple chalk', accent: 'neon blue chalk' },
}

export function buildSummaryPrompt(params: {
  lessonTitle: string
  moduleTitle: string
  courseTitle: string
  moduleIndex: number
  keyConcepts: string[]
  keyTerms: string[]
}): string {
  const { lessonTitle, moduleTitle, moduleIndex, keyConcepts, keyTerms } = params
  const chalk = CHALK_COLORS[moduleIndex] || CHALK_COLORS[0]

  const conceptsList = keyConcepts.length > 0
    ? keyConcepts.map((concept, i) => `${i + 1}. "${concept}"`).join('\n')
    : `1. "${lessonTitle}"`

  const keyTermsInstruction = keyTerms.length > 0
    ? `Highlight these key terms with chalk underlines or boxes: ${keyTerms.slice(0, 3).join(', ')}`
    : ''

  return `Create a chalkboard-style educational infographic summary image.

SCENE: A realistic dark green classroom chalkboard (blackboard) with chalk-drawn elements. The board should look like what an excellent teacher would draw to summarize a lesson.

TITLE (top center, large ${chalk.primary} text): "${lessonTitle}"
SUBTITLE (smaller, below title, ${chalk.secondary}): "${moduleTitle}"

KEY CONCEPTS (drawn as numbered chalk boxes/banners across the board):
${conceptsList}

VISUAL STYLE:
- Dark green chalkboard background with realistic chalk dust texture and subtle smudges
- All text and drawings in chalk style (${chalk.primary} for main text, ${chalk.secondary} for highlights, ${chalk.accent} for accents and decorative elements)
- Hand-drawn educational icons next to each concept (lightbulb, book, laptop, brain, gear, chart, target, rocket - pick the most relevant)
- Decorative chalk borders around the edges (thin double-line frame with small chalk flourishes)
- Chalk eraser marks in corners for authenticity
- Central visual metaphor or icon related to the lesson topic drawn larger
- Clear visual hierarchy: title largest, concepts medium, details small
- Arrows and connecting lines between related concepts
${keyTermsInstruction}

BRANDING (bottom-right corner, small):
- A small turquoise/teal hummingbird silhouette drawn in chalk style (simple, elegant, side profile with wings spread upward)
- Below the hummingbird: "sinsajo creators" in small chalk cursive text
- Use turquoise chalk color for the hummingbird

FOOTER (bottom center, small neat chalk text):
- "www.sinsajocreators.com"

CRITICAL RENDERING RULES:
- ALL text MUST be clearly readable - this is the TOP PRIORITY
- Text must look like real chalk writing on a blackboard
- Use 16:9 landscape aspect ratio
- Include 3-5 small educational doodles/icons distributed around the concepts
- The overall look should feel warm, educational, and inviting - like a real classroom
- Do NOT make it look digital or computer-generated - it should feel hand-drawn with chalk`
}

export function buildContentPrompt(params: {
  altText: string
  lessonTitle: string
}): string {
  const { altText, lessonTitle } = params

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

  // Also handle src before alt or alt before src
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
