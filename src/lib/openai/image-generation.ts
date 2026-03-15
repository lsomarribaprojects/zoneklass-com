import { GoogleGenAI } from '@google/genai'
import { z } from 'zod'

export const imageGenerationSchema = z.object({
  prompt: z.string().min(10).max(4000),
})

export type ImageGenerationInput = z.infer<typeof imageGenerationSchema>

export interface ImageGenerationResult {
  imageBase64: string
  revisedPrompt: string
}

export async function generateImage(
  input: ImageGenerationInput
): Promise<ImageGenerationResult> {
  const apiKey = process.env.GOOGLE_AI_API_KEY
  if (!apiKey) throw new Error('GOOGLE_AI_API_KEY is not configured')

  const validated = imageGenerationSchema.parse(input)

  const ai = new GoogleGenAI({ apiKey })

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-preview-image-generation',
    contents: [
      {
        role: 'user',
        parts: [{ text: validated.prompt }],
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
        revisedPrompt: validated.prompt,
      }
    }
  }

  throw new Error('Nano Banana 2: No image data in response')
}
