import * as dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';
 
dotenv.config({ path: '/env'});

export default defineConfig({
  schema: './drizzle/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.SUPABASE_URL ||  '',
  },
});