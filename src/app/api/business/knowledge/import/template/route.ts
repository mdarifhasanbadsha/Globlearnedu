import { NextResponse } from "next/server";
import { requireBusinessUser } from "@/lib/business/guard";

export const dynamic = "force-dynamic";

/**
 * A working example file the owner can copy and edit.
 * Two universities rather than a bare schema, because a filled example is
 * far easier to imitate than an empty one.
 */
export async function GET() {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  const template = {
    universities: [
      {
        name: "Example University of Technology",
        city: "Wuhan",
        province: "Hubei",
        ranking: "World Ranking 801-900",
        programs: [
          {
            level: "bachelor",
            teaching_language: "English",
            duration_years: 4,
            intake: "March 2027",
            age_limit: "18-28",
            tuition: "RMB 10,400 per year",
            hostel: "RMB 1,200-3,000 per year",
            scholarship: "Type B: tuition free, hostel paid by student",
            majors: [
              "Artificial Intelligence",
              "Computer Science and Technology",
              "Business Administration",
            ],
            requirements: [
              "Passport",
              "HSC certificate and transcript (English translation)",
              "English proficiency certificate",
              "Physical examination form",
              "Bank statement",
            ],
            notes: "3-minute English self-introduction video required.",
          },
        ],
      },
      {
        name: "Example Medical University",
        city: "Jinan",
        province: "Shandong",
        ranking: null,
        programs: [
          {
            level: "language",
            teaching_language: "Chinese and English",
            duration_years: 1,
            intake: "March 2027",
            age_limit: "17-25",
            tuition: "RMB 8,000 per year",
            hostel: "RMB 800 per month",
            scholarship: null,
            majors: ["Chinese Language"],
            requirements: ["Passport", "Photo", "Highest certificate"],
            notes: "Students can progress to a Bachelor after passing HSK 4.",
          },
        ],
      },
    ],
  };

  return new NextResponse(JSON.stringify(template, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": 'attachment; filename="gl-education-universities-template.json"',
    },
  });
}
