import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const baseDatabaseUrl = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;

if (!baseDatabaseUrl) {
  throw new Error("DATABASE_URL or TEST_DATABASE_URL must be set for tests");
}

const testDatabaseUrl = new URL(baseDatabaseUrl.replace(/^"|"$/g, ""));
testDatabaseUrl.searchParams.set("schema", "test");

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";
process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || "test-openai-key";
process.env.DATABASE_URL = testDatabaseUrl.toString();
process.env.TEST_DATABASE_URL = testDatabaseUrl.toString();
