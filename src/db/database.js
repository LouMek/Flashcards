import { drizzle } from 'drizzle-orm/libsql';
import 'dotenv/config';

export const db = drizzle(process.env.DB_FILE);