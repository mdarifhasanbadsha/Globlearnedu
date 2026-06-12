"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

interface Props {
  label?: string;
  className?: string;
  program?: string;
}

export default function ApplyButton({
  label = "Apply Now — Affordable Cost",
  className = "inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-[#C8102E] hover:bg-[#A50D25] rounded-lg transition-colors",
  program,
}: Props) {
  const { data: session } = useSession();
  const href = session?.user
    ? program ? `/dashboard/apply?program=${program}` : "/dashboard/apply"
    : "/sign-up";
  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}
