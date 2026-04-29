import { afterAll, beforeAll, beforeEach } from "vitest";
import { execSync } from "node:child_process";
import "./test-env";
import prisma from "../prisma";
import { resetRateLimitersForTest } from "../middleware/rateLimit.middleware";

let databaseReady = false;

beforeAll(async () => {
  if (!databaseReady) {
    execSync("npx prisma db push --skip-generate", {
      cwd: process.cwd(),
      env: {
        ...process.env,
        DATABASE_URL: process.env.TEST_DATABASE_URL,
      },
      stdio: "ignore",
    });
    databaseReady = true;
  }
});

beforeEach(async () => {
  if (!databaseReady) return;
  resetRateLimitersForTest();
  await prisma.recipe.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  if (!databaseReady) return;
  await prisma.recipe.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});
