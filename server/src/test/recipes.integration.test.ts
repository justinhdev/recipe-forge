import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../app";
import { registerAndLogin } from "./helpers/auth";

const recipePayload = {
  title: "Garlic Pasta",
  ingredients: ["8 oz pasta", "2 cloves garlic", "1 tbsp olive oil"],
  instructions: "Step 1. Boil the pasta. Step 2. Saute the garlic. Step 3. Toss together.",
  calories: 450,
  protein: 12,
  fat: 14,
  carbs: 58,
};

describe("Recipe routes", () => {
  it("creates a recipe for an authenticated user", async () => {
    const { token } = await registerAndLogin();

    const response = await request(app)
      .post("/api/recipes")
      .set("Authorization", `Bearer ${token}`)
      .send(recipePayload);

    expect(response.status).toBe(201);
    expect(response.body.title).toBe(recipePayload.title);
    expect(response.body.ingredients).toEqual(recipePayload.ingredients);
  });

  it("lists a user's saved recipes", async () => {
    const { token } = await registerAndLogin();

    await request(app)
      .post("/api/recipes")
      .set("Authorization", `Bearer ${token}`)
      .send(recipePayload);

    const response = await request(app)
      .get("/api/recipes")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].title).toBe(recipePayload.title);
  });

  it("deletes a saved recipe", async () => {
    const { token } = await registerAndLogin();

    const createResponse = await request(app)
      .post("/api/recipes")
      .set("Authorization", `Bearer ${token}`)
      .send(recipePayload);

    const deleteResponse = await request(app)
      .delete(`/api/recipes/${createResponse.body.id}`)
      .set("Authorization", `Bearer ${token}`);

    const listResponse = await request(app)
      .get("/api/recipes")
      .set("Authorization", `Bearer ${token}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toEqual({
      message: "Recipe deleted successfully",
    });
    expect(listResponse.body).toHaveLength(0);
  });

  it("blocks unauthorized access", async () => {
    const createResponse = await request(app).post("/api/recipes").send(recipePayload);
    const listResponse = await request(app).get("/api/recipes");
    const deleteResponse = await request(app).delete("/api/recipes/1");

    expect(createResponse.status).toBe(401);
    expect(listResponse.status).toBe(401);
    expect(deleteResponse.status).toBe(401);
  });
});
