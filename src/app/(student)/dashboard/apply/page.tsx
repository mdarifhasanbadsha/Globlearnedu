export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import ApplicationForm from "~/components/application/ApplicationForm";
import { getPaymentConfig } from "@/lib/payments/manual";

export const metadata: Metadata = {
  title: "Apply — Globlearn Education",
  description: "Submit your application to study in China through Globlearn Education.",
};

export default async function ApplyPage() {
  const paymentConfig = await getPaymentConfig();

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#C8102E" }}>
          New Application
        </p>
        <h1 className="text-2xl font-black" style={{ color: "#1B3A6B" }}>
          Apply to a Chinese University
        </h1>
        <p className="text-sm mt-1" style={{ color: "#64748B" }}>
          Complete all 9 steps. You can save and return at any time — we'll hold your progress.
        </p>
      </div>
      <ApplicationForm paymentConfig={paymentConfig} />
    </div>
  );
}
