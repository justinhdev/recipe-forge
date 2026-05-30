import request from "supertest";
import { app } from "../../app";

type RegisterAndLoginOptions = {
  name?: string;
  email?: string;
  password?: string;
};

export async function registerAndLogin(options: RegisterAndLoginOptions = {}) {
  const name = options.name ?? "Test User";
  const email = options.email ?? "test@example.com";
  const password = options.password ?? "supersecret";

  const registerResponse = await request(app).post("/api/auth/register").send({
    name,
    email,
    password,
  });

  return {
    token: registerResponse.body.token as string,
    userEmail: email,
  };
}
