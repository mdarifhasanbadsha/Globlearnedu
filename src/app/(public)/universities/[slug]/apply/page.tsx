import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";

export default async function UniversityApplyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect(`/sign-up?callbackUrl=/dashboard/apply?university=${slug}`);
  }

  redirect(`/dashboard/apply?university=${slug}`);
}
