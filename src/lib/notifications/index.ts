import { db } from '~/lib/db';
import { notifications } from '~/lib/db/schema';
import { sendEmail } from '~/lib/email';

export async function sendNotification(applicationId: number, recipientType: 'student' | 'partner', recipientId: number, type: string, data: { title: string; message: string; email?: string; }) {
  await db.insert(notifications).values({
    application_id: applicationId,
    application_university_id: null,
    recipient_type: recipientType,
    recipient_id: recipientId,
    notification_type: type,
    title: data.title,
    message: data.message,
    is_read: false,
    sent_at: new Date(),
    created_at: new Date(),
  });

  if (data.email) {
    await sendEmail({
      to: data.email,
      subject: data.title,
      text: data.message,
    });
  }
}
