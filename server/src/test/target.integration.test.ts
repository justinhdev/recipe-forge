import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../app";
import { registerAndLogin } from "./helpers/auth";

const targetPayload = {
  calories: 2200,
  protein: 160,
  carbs: 240,
  fat: 70,
};

describe("Target routes", () => {
  it("returns null before a target is configured", async () => {
    const { token } = await registerAndLogin();

    const response = await request(app)
      .get("/api/targets")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeNull();
  });

  it("upserts and returns a user's daily target", async () => {
    const { token } = await registerAndLogin();

    const updateResponse = await request(app)
      .put("/api/targets")
      .set("Authorization", `Bearer ${token}`)
      .send(targetPayload);

    const getResponse = await request(app)
      .get("/api/targets")
      .set("Authorization", `Bearer ${token}`);

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.calories).toBe(targetPayload.calories);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toMatchObject(targetPayload);
  });

  it("keeps targets scoped to the authenticated user", async () => {
    const firstUser = await registerAndLogin({ email: "first@example.com" });
    const secondUser = await registerAndLogin({ email: "second@example.com" });

    await request(app)
      .put("/api/targets")
      .set("Authorization", `Bearer ${firstUser.token}`)
      .send(targetPayload);

    const response = await request(app)
      .get("/api/targets")
      .set("Authorization", `Bearer ${secondUser.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeNull();
  });

  it("blocks unauthorized access", async () => {
    const getResponse = await request(app).get("/api/targets");
    const putResponse = await request(app).put("/api/targets").send(targetPayload);

    expect(getResponse.status).toBe(401);
    expect(putResponse.status).toBe(401);
  });
});
