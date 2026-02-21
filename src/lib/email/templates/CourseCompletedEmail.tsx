import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface CourseCompletedEmailProps {
  userName: string
  courseTitle: string
  lessonsCompleted: number
  xpEarned: number
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zoneklass.com'

export function CourseCompletedEmail({ userName, courseTitle, lessonsCompleted, xpEarned }: CourseCompletedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Felicidades! Completaste {courseTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logo}>ZoneKlass</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            {/* Celebration */}
            <Text style={celebration}>🎉</Text>
            <Heading style={heading}>
              Felicidades, {userName}!
            </Heading>
            <Text style={textLarge}>
              Completaste el curso:
            </Text>

            {/* Course Card */}
            <Section style={courseCard}>
              <Text style={courseTitle_}>{courseTitle}</Text>
            </Section>

            {/* Stats */}
            <Section style={statsContainer}>
              <Section style={statBox}>
                <Text style={statValue}>{lessonsCompleted}</Text>
                <Text style={statLabel}>Lecciones</Text>
              </Section>
              <Section style={statBox}>
                <Text style={statValue}>+{xpEarned}</Text>
                <Text style={statLabel}>XP Ganado</Text>
              </Section>
            </Section>

            <Text style={text}>
              Tu dedicacion esta dando frutos. Sigue aprendiendo y desbloqueando
              nuevos logros en tu camino de aprendizaje.
            </Text>

            {/* CTA */}
            <Section style={ctaSection}>
              <Link href={`${baseUrl}/dashboard`} style={ctaButton}>
                Ver tu Perfil
              </Link>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>Hanna de ZoneKlass</Text>
            <Hr style={hr} />
            <Link href={`${baseUrl}/settings`} style={footerLink}>
              Gestionar preferencias de email
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f4f4f7',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '560px',
}

const header = {
  textAlign: 'center' as const,
  padding: '24px 0',
}

const logo = {
  fontSize: '28px',
  fontWeight: '700' as const,
  color: '#7C3AED',
  margin: '0',
}

const content = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '40px 32px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
}

const celebration = {
  fontSize: '48px',
  textAlign: 'center' as const,
  margin: '0 0 8px',
}

const heading = {
  fontSize: '24px',
  fontWeight: '700' as const,
  color: '#1a1a2e',
  margin: '0 0 8px',
  textAlign: 'center' as const,
  lineHeight: '1.3',
}

const textLarge = {
  fontSize: '16px',
  color: '#4a4a68',
  textAlign: 'center' as const,
  margin: '0 0 16px',
}

const text = {
  fontSize: '15px',
  color: '#4a4a68',
  lineHeight: '1.6',
  margin: '0 0 12px',
}

const courseCard = {
  backgroundColor: '#f8f5ff',
  border: '1px solid #e9dfff',
  borderRadius: '10px',
  padding: '20px 24px',
  margin: '0 0 24px',
  textAlign: 'center' as const,
}

const courseTitle_ = {
  fontSize: '18px',
  fontWeight: '600' as const,
  color: '#7C3AED',
  margin: '0',
}

const statsContainer = {
  display: 'flex' as const,
  textAlign: 'center' as const,
  margin: '0 0 24px',
}

const statBox = {
  display: 'inline-block' as const,
  width: '50%',
  textAlign: 'center' as const,
  padding: '16px 0',
}

const statValue = {
  fontSize: '28px',
  fontWeight: '700' as const,
  color: '#7C3AED',
  margin: '0',
}

const statLabel = {
  fontSize: '13px',
  color: '#8898aa',
  margin: '4px 0 0',
}

const ctaSection = {
  textAlign: 'center' as const,
  margin: '32px 0 8px',
}

const ctaButton = {
  backgroundColor: '#7C3AED',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600' as const,
  textDecoration: 'none',
  borderRadius: '8px',
  padding: '14px 32px',
  display: 'inline-block' as const,
}

const footer = {
  textAlign: 'center' as const,
  padding: '24px 0',
}

const footerText = {
  fontSize: '13px',
  color: '#8898aa',
  margin: '0 0 8px',
}

const hr = {
  borderColor: '#e2e8f0',
  margin: '12px 0',
}

const footerLink = {
  fontSize: '12px',
  color: '#7C3AED',
  textDecoration: 'underline',
}
