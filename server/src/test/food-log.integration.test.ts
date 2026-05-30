import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../app";
import { registerAndLogin } from "./helpers/auth";

const foodLogPayload = {
  name: "Greek Yogurt Bowl",
  calories: 320,
  protein: 28,
  carbs: 36,
  fat: 8,
  loggedAt: "2026-05-29T13:30:00.000Z",
};

describe("Food log routes", () => {
  it("creates a food log for an authenticated user", async () => {
    const { token } = await registerAndLogin();

    const response = await request(app)
      .post("/api/logs")
      .set("Authorization", `Bearer ${token}`)
      .send(foodLogPayload);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe(foodLogPayload.name);
    expect(response.body.calories).toBe(foodLogPayload.calories);
    expect(response.body.loggedAt).toBe(foodLogPayload.loggedAt);
  });

  it("lists a user's food logs for a date", async () => {
    const { token } = await registerAndLogin();

    await request(app)
      .post("/api/logs")
      .set("Authorization", `Bearer ${token}`)
      .send(foodLogPayload);

    await request(app)
      .post("/api/logs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...foodLogPayload,
        name: "Different Day Snack",
        loggedAt: "2026-05-30T13:30:00.000Z",
      });

    const response = await request(app)
      .get("/api/logs")
      .query({ date: "2026-05-29" })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].name).toBe(foodLogPayload.name);
  });

  it("deletes a user's own food log", async () => {
    const { token } = await registerAndLogin();

    const createResponse = await request(app)
      .post("/api/logs")
      .set("Authorization", `Bearer ${token}`)
      .send(foodLogPayload);

    const deleteResponse = await request(app)
      .delete(`/api/logs/${createResponse.body.id}`)
      .set("Authorization", `Bearer ${token}`);

    const listResponse = await request(app)
      .get("/api/logs")
      .query({ date: "2026-05-29" })
      .set("Authorization", `Bearer ${token}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toEqual({
      message: "Food log deleted successfully",
    });
    expect(listResponse.body).toHaveLength(0);
  });

  it("prevents deleting another user's food log", async () => {
    const owner = await registerAndLogin({ email: "owner@example.com" });
    const otherUser = await registerAndLogin({ email: "other@example.com" });

    const createResponse = await request(app)
      .post("/api/logs")
      .set("Authorization", `Bearer ${owner.token}`)
      .send(foodLogPayload);

    const deleteResponse = await request(app)
      .delete(`/api/logs/${createResponse.body.id}`)
      .set("Authorization", `Bearer ${otherUser.token}`);

    const listResponse = await request(app)
      .get("/api/logs")
      .query({ date: "2026-05-29" })
      .set("Authorization", `Bearer ${owner.token}`);

    expect(deleteResponse.status).toBe(404);
    expect(deleteResponse.body).toEqual({
      message: "Food log not found or access denied",
    });
    expect(listResponse.body).toHaveLength(1);
  });

  it("blocks unauthorized access", async () => {
    const createResponse = await request(app).post("/api/logs").send(foodLogPayload);
    const listResponse = await request(app)
      .get("/api/logs")
      .query({ date: "2026-05-29" });
    const deleteResponse = await request(app).delete("/api/logs/1");

    expect(createResponse.status).toBe(401);
    expect(listResponse.status).toBe(401);
    expect(deleteResponse.status).toBe(401);
  });
});
