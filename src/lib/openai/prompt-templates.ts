export function buildCoverPrompt(params: {
  lessonTitle: string
  moduleTitle: string
  courseTitle: string
  lessonIndex: number
  moduleIndex: number
}): string {
  const { lessonTitle, moduleTitle, lessonIndex, moduleIndex } = params

  return `Create a professional, modern cover image for an online course lesson.

Module ${moduleIndex + 1}: "${moduleTitle}"
Lesson ${lessonIndex + 1}: "${lessonTitle}"

Style requirements:
- Modern, clean design with a tech/AI aesthetic
- Dark gradient background (deep blue to purple tones)
- Central visual element that represents the lesson topic
- Subtle geometric patterns or neural network motifs
- Professional lighting with glowing accents
- NO text or letters in the image
- 16:10 landscape orientation
- High contrast, vibrant colors
- Suitable as a lesson thumbnail/hero image

The image should visually communicate the specific topic of this lesson while maintaining a cohesive look with other lessons in an AI mastery course.`
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
