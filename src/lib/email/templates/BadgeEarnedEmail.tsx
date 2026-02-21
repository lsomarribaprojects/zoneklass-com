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

interface BadgeEarnedEmailProps {
  userName: string
  badgeName: string
  badgeDescription: string
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zoneklass.com'

export function BadgeEarnedEmail({ userName, badgeName, badgeDescription }: BadgeEarnedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Ganaste el badge {badgeName}!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logo}>ZoneKlass</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={trophy}>🏆</Text>
            <Heading style={heading}>
              Ganaste un nuevo badge!
            </Heading>
            <Text style={text}>
              Hola {userName}, tu esfuerzo ha sido recompensado:
            </Text>

            {/* Badge Card */}
            <Section style={badgeCard}>
              <Text style={badgeName_}>{badgeName}</Text>
              <Text style={badgeDesc}>{badgeDescription}</Text>
            </Section>

            <Text style={text}>
              Sigue aprendiendo para desbloquear mas badges y subir en la tabla de posiciones.
            </Text>

            {/* CTA */}
            <Section style={ctaSection}>
              <Link href={`${baseUrl}/dashboard`} style={ctaButton}>
                Ver tus Badges
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

const trophy = {
  fontSize: '48px',
  textAlign: 'center' as const,
  margin: '0 0 8px',
}

const heading = {
  fontSize: '24px',
  fontWeight: '700' as const,
  color: '#1a1a2e',
  margin: '0 0 16px',
  textAlign: 'center' as const,
  lineHeight: '1.3',
}

const text = {
  fontSize: '15px',
  color: '#4a4a68',
  lineHeight: '1.6',
  margin: '0 0 12px',
}

const badgeCard = {
  backgroundColor: '#fffbeb',
  border: '1px solid #fde68a',
  borderRadius: '10px',
  padding: '24px',
  margin: '16px 0',
  textAlign: 'center' as const,
}

const badgeName_ = {
  fontSize: '20px',
  fontWeight: '700' as const,
  color: '#92400e',
  margin: '0 0 8px',
}

const badgeDesc = {
  fontSize: '14px',
  color: '#78716c',
  margin: '0',
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
