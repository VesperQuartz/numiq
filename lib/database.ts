import { config } from "dotenv";
import { drizzle } from "drizzle-orm/libsql";

config({ path: ".env.local" }); // or .env.local

export const db = drizzle({
  connection: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.TURSO_TOKEN!,
  },
});
