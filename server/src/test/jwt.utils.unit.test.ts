import jwt from "jsonwebtoken";
import { describe, expect, it } from "vitest";
import { generateToken } from "../utils/generateToken";
import { getUserIdFromToken } from "../utils/getUserIdFromToken";

describe("JWT helpers", () => {
  it("generates a token that includes the user id", () => {
    const token = generateToken(42);
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: number;
    };

    expect(decoded.userId).toBe(42);
  });

  it("extracts a user id from a bearer token", () => {
    const token = generateToken(7);

    const userId = getUserIdFromToken({
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(userId).toBe(7);
  });
});
