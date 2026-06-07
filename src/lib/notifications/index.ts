import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { sendEmail } from "@/lib/email";

export async function sendNotification(
  userId: string,
  applicationId: string | null,
  data: { title: string; message: string; email?: string }
) {
  await db.insert(notifications).values({
    userId,
    applicationId: applicationId ?? undefined,
    title: data.title,
    message: data.message,
    channel: "in_portal",
    isRead: false,
    sentAt: new Date(),
  });

  if (data.email) {
    await sendEmail({
      to: data.email,
      subject: data.title,
      text: data.message,
    });
  }
}
