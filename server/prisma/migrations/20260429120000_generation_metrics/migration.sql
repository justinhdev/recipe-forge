-- CreateEnum
CREATE TYPE "GenerationStatus" AS ENUM ('SUCCESS', 'FAILURE');

-- CreateTable
CREATE TABLE "RecipeGeneration" (
    "id" SERIAL NOT NULL,
    "requestId" TEXT,
    "inputHash" TEXT NOT NULL,
    "promptVersion" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "status" "GenerationStatus" NOT NULL,
    "latencyMs" INTEGER NOT NULL,
    "promptTokens" INTEGER,
    "completionTokens" INTEGER,
    "totalTokens" INTEGER,
    "estimatedCostUsd" DOUBLE PRECISION,
    "failureReason" TEXT,
    "validationFailures" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,

    CONSTRAINT "RecipeGeneration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RecipeGeneration_createdAt_idx" ON "RecipeGeneration"("createdAt");

-- CreateIndex
CREATE INDEX "RecipeGeneration_inputHash_idx" ON "RecipeGeneration"("inputHash");

-- CreateIndex
CREATE INDEX "RecipeGeneration_status_idx" ON "RecipeGeneration"("status");

-- AddForeignKey
ALTER TABLE "RecipeGeneration" ADD CONSTRAINT "RecipeGeneration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
