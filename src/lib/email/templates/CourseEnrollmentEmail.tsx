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

interface CourseEnrollmentEmailProps {
  userName: string
  courseTitle: string
  courseSlug: string
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zoneklass.com'

export function CourseEnrollmentEmail({ userName, courseTitle, courseSlug }: CourseEnrollmentEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Te inscribiste en {courseTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logo}>ZoneKlass</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Heading style={heading}>
              Te inscribiste en un nuevo curso!
            </Heading>
            <Text style={text}>
              Hola {userName},
            </Text>
            <Text style={text}>
              Tu inscripcion en el siguiente curso fue exitosa:
            </Text>

            {/* Course Card */}
            <Section style={courseCard}>
              <Text style={courseTitle_}>{courseTitle}</Text>
            </Section>

            <Text style={text}>
              Ya puedes comenzar a aprender. Recuerda que cada leccion completada
              te otorga XP y te acerca a ganar nuevos badges.
            </Text>

            {/* CTA */}
            <Section style={ctaSection}>
              <Link href={`${baseUrl}/cursos/${courseSlug}`} style={ctaButton}>
                Comenzar Curso
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

const courseCard = {
  backgroundColor: '#f8f5ff',
  border: '1px solid #e9dfff',
  borderRadius: '10px',
  padding: '20px 24px',
  margin: '16px 0',
}

const courseTitle_ = {
  fontSize: '18px',
  fontWeight: '600' as const,
  color: '#7C3AED',
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
