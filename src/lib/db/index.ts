import { drizzle } from 'drizzle-orm';
import { neonHttp } from 'drizzle-orm/neon-http';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

const client = neonHttp({ url: process.env.DATABASE_URL });
export const db = drizzle(client);
