import { db } from "@/lib/db";
import { applications } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

/**
 * Returns the next 3-digit serial for the given date prefix (e.g. "MD20260611").
 * Counts existing application numbers with that prefix and adds 1.
 * The UNIQUE constraint on applicationNumber is the safety net for rare races.
 */
export async function getNextSerial(prefix: string): Promise<number> {
  const [row] = await db
    .select({ count: sql<number>`COUNT(*)::int` })
    .from(applications)
    .where(sql`${applications.applicationNumber} LIKE ${prefix + "%"}`);
  return (row?.count ?? 0) + 1;
}
