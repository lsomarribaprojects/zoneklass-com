export interface ExtractedConcepts {
  mainTopic: string
  keyConcepts: string[]
  keyTerms: string[]
}

function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim()
}

export function extractLessonConcepts(
  html: string,
  lessonTitle?: string,
  maxConcepts: number = 5
): ExtractedConcepts {
  // Extract h2 headings
  const h2Regex = /<h2[^>]*>(.*?)<\/h2>/gi
  const h2s: string[] = []
  let match: RegExpExecArray | null
  while ((match = h2Regex.exec(html)) !== null) {
    const text = stripHtmlTags(match[1])
    if (text.length > 0 && text.length < 100) h2s.push(text)
  }

  // Extract h3 headings
  const h3Regex = /<h3[^>]*>(.*?)<\/h3>/gi
  const h3s: string[] = []
  while ((match = h3Regex.exec(html)) !== null) {
    const text = stripHtmlTags(match[1])
    if (text.length > 0 && text.length < 100) h3s.push(text)
  }

  // Extract bold terms from list items
  const strongInLiRegex = /<li[^>]*>[^<]*<strong>(.*?)<\/strong>/gi
  const boldTerms: string[] = []
  while ((match = strongInLiRegex.exec(html)) !== null) {
    const text = stripHtmlTags(match[1])
    if (text.length > 0 && text.length < 60) boldTerms.push(text)
  }

  // Main topic: first h2 or lesson title
  const mainTopic = h2s[0] || lessonTitle || 'Conceptos Clave'

  // Key concepts: remaining h2s + h3s (up to maxConcepts)
  const allConcepts = [...h2s.slice(1), ...h3s]
  const uniqueConcepts = [...new Set(allConcepts)]
  const keyConcepts = uniqueConcepts.slice(0, maxConcepts)

  // If we have fewer than 3 concepts, add some bold terms as concepts
  if (keyConcepts.length < 3 && boldTerms.length > 0) {
    const needed = Math.min(3 - keyConcepts.length, boldTerms.length)
    for (let i = 0; i < needed; i++) {
      if (!keyConcepts.includes(boldTerms[i])) {
        keyConcepts.push(boldTerms[i])
      }
    }
  }

  // Key terms: unique bold terms (up to 5)
  const uniqueTerms = [...new Set(boldTerms)]
  const keyTerms = uniqueTerms.slice(0, 5)

  return { mainTopic, keyConcepts, keyTerms }
}
