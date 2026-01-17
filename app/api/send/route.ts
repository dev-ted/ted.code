import { EmailTemplate } from '@/components/email-template';
import { Resend } from 'resend';
import { render } from '@react-email/render';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return Response.json(
        { error: 'Missing required fields: name, email, and message are required' },
        { status: 400 }
      );
    }

    const emailHtml = await render(EmailTemplate({ name, email, phone, message }));

    const { data, error } = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>', // Update this with your verified domain
      to: ['devted19@gmail.com'],
      subject: `New Contact Form Submission from ${name}`,
      html: emailHtml,
    });

    if (error) {
      console.error('Resend error:', error);
      return Response.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return Response.json({ success: true, data });
  } catch (error) {
    console.error('API route error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
