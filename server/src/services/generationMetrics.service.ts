import crypto from "crypto";
import { GenerationStatus, Prisma } from "@prisma/client";
import prisma from "../prisma";
import { logger } from "../logger";
import { GenerateRecipeBody } from "../schemas/openai.schema";

type TokenUsage = {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
};

type GenerationMetricInput = {
  requestId?: string;
  inputHash: string;
  promptVersion: string;
  model: string;
  status: GenerationStatus;
  latencyMs: number;
  userId?: number | null;
  tokenUsage?: TokenUsage;
  failureReason?: string;
  validationFailures?: Prisma.InputJsonValue;
};

const numberFromEnv = (key: string, fallback: number) => {
  const value = Number(process.env[key]);
  return Number.isFinite(value) ? value : fallback;
};

export const estimateOpenAICostUsd = (usage?: TokenUsage): number | null => {
  if (!usage?.promptTokens && !usage?.completionTokens) return null;

  const inputCostPer1M = numberFromEnv("OPENAI_INPUT_COST_PER_1M", 2.5);
  const outputCostPer1M = numberFromEnv("OPENAI_OUTPUT_COST_PER_1M", 10);
  const inputCost = ((usage.promptTokens ?? 0) / 1_000_000) * inputCostPer1M;
  const outputCost =
    ((usage.completionTokens ?? 0) / 1_000_000) * outputCostPer1M;

  return Number((inputCost + outputCost).toFixed(6));
};

export const createGenerationInputHash = (
  options: GenerateRecipeBody
): string => {
  const canonicalPayload = {
    ingredients: [...options.ingredients]
      .map((ingredient) => ingredient.trim().toLowerCase())
      .sort(),
    servings: options.servings ?? 2,
    diet: (options.diet ?? "none").trim().toLowerCase(),
    cuisine: (options.cuisine ?? "none").trim().toLowerCase(),
    mealType: (options.mealType ?? "none").trim().toLowerCase(),
    bravery: options.bravery ?? 0.7,
    macroPreference: (options.macroPreference ?? "none").trim().toLowerCase(),
  };

  return crypto
    .createHash("sha256")
    .update(JSON.stringify(canonicalPayload))
    .digest("hex");
};

export const recordGenerationMetric = async (metric: GenerationMetricInput) => {
  try {
    await prisma.recipeGeneration.create({
      data: {
        requestId: metric.requestId,
        inputHash: metric.inputHash,
        promptVersion: metric.promptVersion,
        model: metric.model,
        status: metric.status,
        latencyMs: metric.latencyMs,
        promptTokens: metric.tokenUsage?.promptTokens,
        completionTokens: metric.tokenUsage?.completionTokens,
        totalTokens: metric.tokenUsage?.totalTokens,
        estimatedCostUsd: estimateOpenAICostUsd(metric.tokenUsage),
        failureReason: metric.failureReason,
        validationFailures: metric.validationFailures,
        userId: metric.userId ?? undefined,
      },
    });
  } catch (error) {
    logger.warn({
      event: "generation_metric_write_failed",
      requestId: metric.requestId,
      error,
    });
  }
};

const percentile = (values: number[], target: number): number | null => {
  if (values.length === 0) return null;

  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((target / 100) * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(index, sorted.length - 1))];
};

export const getGenerationStats = async () => {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const [
    total,
    statusGroups,
    modelGroups,
    promptVersionGroups,
    failureReasonGroups,
    last24hGenerations,
    aggregate,
    generations,
  ] = await Promise.all([
    prisma.recipeGeneration.count(),
    prisma.recipeGeneration.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    prisma.recipeGeneration.groupBy({
      by: ["model"],
      _count: { _all: true },
    }),
    prisma.recipeGeneration.groupBy({
      by: ["promptVersion"],
      _count: { _all: true },
    }),
    prisma.recipeGeneration.groupBy({
      by: ["failureReason"],
      where: { failureReason: { not: null } },
      _count: { _all: true },
    }),
    prisma.recipeGeneration.count({
      where: { createdAt: { gte: oneDayAgo } },
    }),
    prisma.recipeGeneration.aggregate({
      _avg: { latencyMs: true },
      _sum: { estimatedCostUsd: true },
    }),
    prisma.recipeGeneration.findMany({
      orderBy: { createdAt: "desc" },
      take: 5000,
      select: {
        id: true,
        status: true,
        latencyMs: true,
        estimatedCostUsd: true,
        failureReason: true,
        model: true,
        promptVersion: true,
        totalTokens: true,
        createdAt: true,
      },
    }),
  ]);

  const statusCounts = Object.fromEntries(
    statusGroups.map((group) => [group.status, group._count._all])
  );
  const modelCounts = Object.fromEntries(
    modelGroups.map((group) => [group.model, group._count._all])
  );
  const promptVersionCounts = Object.fromEntries(
    promptVersionGroups.map((group) => [
      group.promptVersion,
      group._count._all,
    ])
  );
  const failureReasons = Object.fromEntries(
    failureReasonGroups.map((group) => [
      group.failureReason ?? "unknown",
      group._count._all,
    ])
  );

  const successes = statusCounts[GenerationStatus.SUCCESS] ?? 0;
  const failures = total - successes;
  const latencies = generations.map((generation) => generation.latencyMs);

  return {
    totalGenerations: total,
    sampleSize: generations.length,
    successfulGenerations: successes,
    failedGenerations: failures,
    successRate: total > 0 ? successes / total : 0,
    averageLatencyMs:
      aggregate._avg.latencyMs === null
        ? null
        : Math.round(aggregate._avg.latencyMs),
    p50LatencyMs: percentile(latencies, 50),
    p95LatencyMs: percentile(latencies, 95),
    totalEstimatedCostUsd: Number(
      (aggregate._sum.estimatedCostUsd ?? 0).toFixed(6)
    ),
    last24hGenerations,
    statusCounts,
    modelCounts,
    promptVersionCounts,
    failureReasons,
    recentGenerations: generations.slice(0, 10),
  };
};
