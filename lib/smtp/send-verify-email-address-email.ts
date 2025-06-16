import { render } from '@react-email/render';

import {
  VerifyEmailAddressEmail,
  type VerifyEmailAddressEmailData
} from '@/emails/verify-email-address-email';
import { sendEmail } from '@/lib/smtp/mailer/send-email';

export async function sendVerifyEmailAddressEmail(
  data: VerifyEmailAddressEmailData
): Promise<void> {
  console.log(`[EMAIL] Preparing verification email for: ${data.recipient}`);
  
  try {
    const component = VerifyEmailAddressEmail(data);
    const html = await render(component);
    const text = await render(component, { plainText: true });

    console.log(`[EMAIL] Sending verification email to: ${data.recipient}`);
    await sendEmail({
      recipient: data.recipient,
      subject: 'Verify email address',
      html,
      text
    });
    console.log(`[EMAIL] Successfully sent verification email to: ${data.recipient}`);
  } catch (error) {
    console.error(`[EMAIL ERROR] Failed to send verification email to ${data.recipient}:`, error);
    // Re-throw the error to ensure the calling function knows the email failed
    throw error;
  }
}
