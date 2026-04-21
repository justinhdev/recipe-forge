import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../app";
import prisma from "../prisma";

describe("Auth routes", () => {
  it("registers a user and returns a token", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "Justin",
      email: "justin@example.com",
      password: "supersecret",
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toEqual(expect.any(String));

    const user = await prisma.user.findUnique({
      where: { email: "justin@example.com" },
    });

    expect(user).not.toBeNull();
    expect(user?.name).toBe("Justin");
    expect(user?.password).not.toBe("supersecret");
  });

  it("logs in an existing user", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Justin",
      email: "justin@example.com",
      password: "supersecret",
    });

    const response = await request(app).post("/api/auth/login").send({
      email: "justin@example.com",
      password: "supersecret",
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toEqual(expect.any(String));
  });

  it("rejects duplicate emails", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Justin",
      email: "justin@example.com",
      password: "supersecret",
    });

    const response = await request(app).post("/api/auth/register").send({
      name: "Another Justin",
      email: "justin@example.com",
      password: "supersecret",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Email already in use" });
  });

  it("rejects a bad password", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Justin",
      email: "justin@example.com",
      password: "supersecret",
    });

    const response = await request(app).post("/api/auth/login").send({
      email: "justin@example.com",
      password: "wrong-password",
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Invalid credentials" });
  });
});
