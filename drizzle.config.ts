import { defineConfig } from "drizzle-kit";

// DATABASE_URL is optional - the app uses in-memory storage by default
// Only required if you want to use database migrations
if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL not set - database migrations will not be available");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgresql://localhost:5432/placeholder",
  },
});
