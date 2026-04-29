import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../app";

describe("Rate limiting", () => {
  it("limits repeated authentication attempts", async () => {
    for (let i = 0; i < 50; i += 1) {
      const response = await request(app).post("/api/auth/login").send({
        email: "not-a-user@example.com",
        password: "wrong-password",
      });

      expect(response.status).toBe(401);
    }

    const response = await request(app).post("/api/auth/login").send({
      email: "not-a-user@example.com",
      password: "wrong-password",
    });

    expect(response.status).toBe(429);
    expect(response.body).toEqual({
      message: "Too many authentication attempts. Please try again later.",
    });
    expect(response.headers["retry-after"]).toEqual(expect.any(String));
  });

  it("limits repeated AI recipe generation requests before validation", async () => {
    for (let i = 0; i < 30; i += 1) {
      const response = await request(app).post("/api/ai/generate").send({});

      expect(response.status).toBe(400);
    }

    const response = await request(app).post("/api/ai/generate").send({});

    expect(response.status).toBe(429);
    expect(response.body).toEqual({
      message: "Too many recipe generation requests. Please try again later.",
    });
    expect(response.headers["retry-after"]).toEqual(expect.any(String));
  });
});
