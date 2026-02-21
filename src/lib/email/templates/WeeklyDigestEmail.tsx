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

interface WeeklyDigestEmailProps {
  userName: string
  coursesInProgress: number
  lessonsCompleted: number
  xpEarned: number
  streakDays: number
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zoneklass.com'

export function WeeklyDigestEmail({
  userName,
  coursesInProgress,
  lessonsCompleted,
  xpEarned,
  streakDays,
}: WeeklyDigestEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Tu resumen semanal en ZoneKlass</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logo}>ZoneKlass</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Heading style={heading}>
              Tu resumen semanal
            </Heading>
            <Text style={text}>
              Hola {userName}, aqui esta tu progreso de esta semana:
            </Text>

            {/* Stats Grid */}
            <Section style={statsGrid}>
              <Section style={statCard}>
                <Text style={statEmoji}>📚</Text>
                <Text style={statValue}>{coursesInProgress}</Text>
                <Text style={statLabel}>Cursos en Progreso</Text>
              </Section>
              <Section style={statCard}>
                <Text style={statEmoji}>✅</Text>
                <Text style={statValue}>{lessonsCompleted}</Text>
                <Text style={statLabel}>Lecciones Completadas</Text>
              </Section>
              <Section style={statCard}>
                <Text style={statEmoji}>⚡</Text>
                <Text style={statValue}>+{xpEarned}</Text>
                <Text style={statLabel}>XP Ganado</Text>
              </Section>
              <Section style={statCard}>
                <Text style={statEmoji}>🔥</Text>
                <Text style={statValue}>{streakDays}</Text>
                <Text style={statLabel}>Dias de Racha</Text>
              </Section>
            </Section>

            {lessonsCompleted > 0 ? (
              <Text style={text}>
                Excelente progreso! Sigue asi para mantener tu racha y escalar en la tabla de posiciones.
              </Text>
            ) : (
              <Text style={text}>
                Esta semana fue tranquila. Dedica unos minutos a continuar donde lo dejaste, cada leccion cuenta!
              </Text>
            )}

            {/* CTA */}
            <Section style={ctaSection}>
              <Link href={`${baseUrl}/dashboard`} style={ctaButton}>
                Seguir Aprendiendo
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

const heading = {
  fontSize: '24px',
  fontWeight: '700' as const,
  color: '#1a1a2e',
  margin: '0 0 16px',
  lineHeight: '1.3',
}

const text = {
  fontSize: '15px',
  color: '#4a4a68',
  lineHeight: '1.6',
  margin: '0 0 12px',
}

const statsGrid = {
  margin: '24px 0',
}

const statCard = {
  display: 'inline-block' as const,
  width: '50%',
  textAlign: 'center' as const,
  padding: '16px 8px',
  verticalAlign: 'top' as const,
}

const statEmoji = {
  fontSize: '24px',
  margin: '0 0 4px',
}

const statValue = {
  fontSize: '24px',
  fontWeight: '700' as const,
  color: '#7C3AED',
  margin: '0',
}

const statLabel = {
  fontSize: '12px',
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
