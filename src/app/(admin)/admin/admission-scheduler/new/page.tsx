import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import AdmissionPageEditor from "@/components/admin/AdmissionPageEditor";

export const dynamic = "force-dynamic";

export default async function NewAdmissionPagePage() {
  const session = await auth();
  if (!session?.user?.id || !["admin", "staff"].includes(session.user.role ?? "")) {
    redirect("/sign-in");
  }

  return <AdmissionPageEditor />;
}
