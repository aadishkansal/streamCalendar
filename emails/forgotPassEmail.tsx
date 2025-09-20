import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Container,
} from '@react-email/components';

interface forgotPassEmailProps {
  username: string;
  otp: string;
}

export default function forgotPassEmail({ username, otp }: forgotPassEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your password reset code: {otp}</Preview>
      <Container style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
        <Heading style={{ textAlign: 'center', color: '#333' }}>
          Password Reset Request
        </Heading>
        <Text style={{ fontSize: '16px', lineHeight: '1.5' }}>
          Hello {username},
        </Text>
        <Text style={{ fontSize: '16px', lineHeight: '1.5' }}>
          You requested to reset your password for your StreamCalendar account. 
          Please use the following 6-digit code to verify your identity:
        </Text>
        <Section style={{ 
          textAlign: 'center', 
          padding: '20px', 
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          margin: '20px 0'
        }}>
          <Text style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: '#007bff',
            letterSpacing: '8px',
            margin: '0'
          }}>
            {otp}
          </Text>
        </Section>
        <Text style={{ fontSize: '16px', lineHeight: '1.5' }}>
          This code will expire in 5 minutes for security reasons.
        </Text>
        <Text style={{ fontSize: '16px', lineHeight: '1.5', color: '#666' }}>
          If you didn't request this password reset, please ignore this email. 
          Your password will remain unchanged.
        </Text>
        <Text style={{ fontSize: '14px', color: '#999', marginTop: '40px' }}>
          Best regards,<br />
          The StreamCalendar Team
        </Text>
      </Container>
    </Html>
  );
}