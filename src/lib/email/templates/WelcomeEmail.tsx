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

interface WelcomeEmailProps {
  userName: string
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zoneklass.com'

export function WelcomeEmail({ userName }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Bienvenido a ZoneKlass, {userName}!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logo}>ZoneKlass</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Heading style={heading}>
              Bienvenido a ZoneKlass, {userName}!
            </Heading>
            <Text style={text}>
              Nos alegra tenerte en la plataforma. ZoneKlass es tu espacio para aprender,
              crecer y conectar con una comunidad de estudiantes apasionados.
            </Text>
            <Text style={text}>
              Esto es lo que puedes hacer:
            </Text>
            <Text style={listItem}>
              Explorar cursos de programacion, IA, diseno y mas
            </Text>
            <Text style={listItem}>
              Ganar XP y badges mientras aprendes
            </Text>
            <Text style={listItem}>
              Chatear con Hanna, tu tutora de IA personal
            </Text>
            <Text style={listItem}>
              Unirte a la comunidad y compartir tu progreso
            </Text>

            {/* CTA */}
            <Section style={ctaSection}>
              <Link href={`${baseUrl}/cursos`} style={ctaButton}>
                Explorar Cursos
              </Link>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Hanna de ZoneKlass
            </Text>
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

// Styles
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

const listItem = {
  fontSize: '15px',
  color: '#4a4a68',
  lineHeight: '1.6',
  margin: '0 0 8px',
  paddingLeft: '16px',
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
