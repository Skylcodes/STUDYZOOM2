import { type MailerPayload } from '@/lib/smtp/mailer';
import { resolveMailer } from '@/lib/smtp/mailer/resolve-mailer';

export async function sendEmail(payload: MailerPayload): Promise<unknown> {
  try {
    console.log(`[MAILER] Resolving mailer for email to: ${payload.recipient}`);
    const mailer = await resolveMailer();
    
    console.log(`[MAILER] Using ${process.env.EMAIL_MAILER} mailer to send email`);
    const result = await mailer.sendEmail(payload);
    
    console.log(`[MAILER] Email sent successfully to: ${payload.recipient}`);
    return result;
  } catch (error) {
    console.error(`[MAILER ERROR] Failed to send email to ${payload.recipient}:`, error);
    throw error; // Re-throw to ensure calling function knows the email failed
  }
}
