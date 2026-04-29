import request from "supertest";
import { GenerationStatus } from "@prisma/client";
import { describe, expect, it } from "vitest";
import { app } from "../app";
import prisma from "../prisma";
import { registerAndLogin } from "./helpers/auth";

describe("Admin stats routes", () => {
  it("requires authentication", async () => {
    const response = await request(app).get("/api/admin/stats");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Not authorized" });
  });

  it("returns generation metrics for authenticated users", async () => {
    const { token } = await registerAndLogin();

    await prisma.recipeGeneration.createMany({
      data: [
        {
          inputHash: "success-input",
          promptVersion: "recipe-v1",
          model: "gpt-4o-2024-08-06",
          status: GenerationStatus.SUCCESS,
          latencyMs: 1200,
          promptTokens: 100,
          completionTokens: 200,
          totalTokens: 300,
          estimatedCostUsd: 0.00225,
        },
        {
          inputHash: "failure-input",
          promptVersion: "recipe-v1",
          model: "gpt-4o-2024-08-06",
          status: GenerationStatus.FAILURE,
          latencyMs: 2400,
          failureReason: "validation_failed",
        },
      ],
    });

    const response = await request(app)
      .get("/api/admin/stats")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      totalGenerations: 2,
      successfulGenerations: 1,
      failedGenerations: 1,
      successRate: 0.5,
      p50LatencyMs: 1200,
      p95LatencyMs: 2400,
      totalEstimatedCostUsd: 0.00225,
      statusCounts: {
        SUCCESS: 1,
        FAILURE: 1,
      },
      failureReasons: {
        validation_failed: 1,
      },
    });
    expect(response.body.recentGenerations).toHaveLength(2);
  });
});
