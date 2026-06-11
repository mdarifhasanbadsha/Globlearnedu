import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { emailTemplates } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import EmailTemplateEditor from "@/components/admin/EmailTemplateEditor";

export const dynamic = "force-dynamic";

export default async function EditEmailTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id || !["admin", "staff"].includes(session.user.role ?? "")) {
    redirect("/sign-in");
  }

  const { id } = await params;
  const [t] = await db
    .select()
    .from(emailTemplates)
    .where(eq(emailTemplates.id, id))
    .limit(1);

  if (!t) notFound();

  return (
    <EmailTemplateEditor
      template={{
        id: t.id,
        name: t.name,
        subject: t.subject,
        bodyHtml: t.bodyHtml ?? null,
        triggerEvent: t.triggerEvent ?? null,
        category: t.category ?? null,
        isActive: t.isActive ?? true,
        isAutoTrigger: t.isAutoTrigger ?? false,
        sendToStudent: t.sendToStudent ?? false,
        sendToPartner: t.sendToPartner ?? false,
      }}
    />
  );
}
