import request from "supertest";
import { app } from "../../app";

export async function registerAndLogin() {
  const registerResponse = await request(app).post("/api/auth/register").send({
    name: "Test User",
    email: "test@example.com",
    password: "supersecret",
  });

  return {
    token: registerResponse.body.token as string,
    userEmail: "test@example.com",
  };
}
