import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

import { type Mailer, type MailerPayload } from '@/lib/smtp/mailer';
import { nodeMailerOptions } from '@/lib/smtp/mailer/node-mailer/node-mailer-options';

export class NodeMailer implements Mailer {
  public async sendEmail(
    payload: MailerPayload
  ): Promise<SMTPTransport.SentMessageInfo> {
    try {
      // Log transport details safely based on type
      if (typeof nodeMailerOptions.transport === 'string') {
        console.log('[NODEMAILER] Creating transport with connection string (details hidden)');
      } else {
        // Only log non-sensitive parts of the transport configuration
        console.log('[NODEMAILER] Creating transport with options:', {
          host: (nodeMailerOptions.transport as any).host,
          port: (nodeMailerOptions.transport as any).port,
          secure: (nodeMailerOptions.transport as any).secure,
          // Don't log auth details, even with password masked
          auth: 'credentials-hidden'
        });
      }
      
      const transporter = nodemailer.createTransport(nodeMailerOptions.transport);
      
      // Verify SMTP connection configuration
      console.log('[NODEMAILER] Verifying SMTP connection...');
      await transporter.verify().catch(error => {
        console.error('[NODEMAILER ERROR] SMTP verification failed:', error);
        throw error; // Re-throw to ensure calling function knows verification failed
      });
      console.log('[NODEMAILER] SMTP connection verified successfully');
      
      console.log(`[NODEMAILER] Sending email to: ${payload.recipient}`);
      const result = await transporter.sendMail({
        from: nodeMailerOptions.from,
        to: payload.recipient,
        subject: payload.subject,
        html: payload.html,
        text: payload.text
      });
      
      console.log(`[NODEMAILER] Email sent successfully to: ${payload.recipient}, messageId: ${result.messageId}`);
      return result;
    } catch (error) {
      console.error(`[NODEMAILER ERROR] Failed to send email to ${payload.recipient}:`, error);
      throw error; // Re-throw to ensure calling function knows the email failed
    }
  }
}
