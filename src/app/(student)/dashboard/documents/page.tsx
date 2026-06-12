export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { applications } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import DocumentsClient, { type Doc } from "./_DocumentsClient";

const DOCUMENT_TYPES: { id: string; name: string; required: boolean }[] = [
  { id: "passport",      name: "Passport data page",                   required: true  },
  { id: "photo",         name: "Passport-size photo",                  required: true  },
  { id: "certificate",   name: "Highest academic certificate",         required: true  },
  { id: "transcript",    name: "Academic transcript",                  required: true  },
  { id: "police",        name: "Police clearance certificate",         required: true  },
  { id: "medical",       name: "Physical examination report",          required: true  },
  { id: "bank",          name: "Bank statement",                       required: true  },
  { id: "english_cert",  name: "English proficiency certificate",      required: false },
  { id: "hsk_cert",      name: "Chinese proficiency certificate (HSK)",required: false },
  { id: "rec1",          name: "Recommendation letter 1",             required: false },
  { id: "rec2",          name: "Recommendation letter 2",             required: false },
  { id: "intro_video",   name: "Self-introduction video link",         required: false },
  { id: "equivalency",   name: "Equivalency / ECA report",            required: false },
  { id: "visa_copy",     name: "Current visa / residence permit copy", required: false },
  { id: "enrollment",    name: "Current enrollment letter",            required: false },
];

export default async function DocumentsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const app = await db.query.applications.findFirst({
    where: eq(applications.studentId, session.user.id),
    orderBy: [desc(applications.createdAt)],
  });

  if (!app) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-black mb-1" style={{ color: "#1B3A6B" }}>Documents</h1>
        </div>
        <div className="bg-white border rounded-2xl p-12 text-center" style={{ borderColor: "#E2E8F0" }}>
          <p className="text-base font-bold mb-2" style={{ color: "#1B3A6B" }}>No application yet</p>
          <p className="text-sm mb-6" style={{ color: "#64748B" }}>
            Start an application first — documents are uploaded as part of the application process.
          </p>
          <Link
            href="/dashboard/apply"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold"
            style={{ backgroundColor: "#C8102E" }}
          >
            Start Application <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  const storedDocs = (app.documents as Record<string, string>) ?? {};

  const docs: Doc[] = DOCUMENT_TYPES.map((dt) => {
    const url = storedDocs[dt.id];
    const hasFile = Boolean(url);
    const fileName = hasFile ? url.split("/").pop() : undefined;
    return {
      id: dt.id,
      name: dt.name,
      required: dt.required,
      status: hasFile ? "uploaded" : "missing",
      fileName,
      url: url || undefined,
    };
  });

  return <DocumentsClient initialDocs={docs} />;
}
