import { Resend } from 'resend'

let resend: Resend | null = null

function getResend(): Resend {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured')
    }
    resend = new Resend(process.env.RESEND_API_KEY)
  }
  return resend
}

const FROM_EMAIL = 'Hanna de ZoneKlass <hanna@zoneklass.com>'

interface SendEmailOptions {
  to: string
  subject: string
  react: React.ReactElement
}

export async function sendEmail({ to, subject, react }: SendEmailOptions): Promise<{ error: string | null }> {
  try {
    const { error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      react,
    })

    if (error) {
      console.error('[Email] Error sending:', error)
      return { error: error.message }
    }

    return { error: null }
  } catch (err) {
    console.error('[Email] Unexpected error:', err)
    return { error: 'Error al enviar email' }
  }
}
