/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, it } from "vitest";
import {
  clearStoredAuth,
  getValidStoredToken,
  hasValidStoredToken,
  isTokenExpired,
  storeAuth,
} from "./auth";
import { makeTestJwt } from "../test/auth";

describe("auth storage helpers", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("treats a future JWT as authenticated", () => {
    const token = makeTestJwt();

    storeAuth({ token, name: "Avery" });

    expect(hasValidStoredToken()).toBe(true);
    expect(getValidStoredToken()).toBe(token);
    expect(localStorage.getItem("name")).toBe("Avery");
  });

  it("clears expired auth before returning a token", () => {
    storeAuth({ token: makeTestJwt(-60), name: "Avery" });

    expect(getValidStoredToken()).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("name")).toBeNull();
  });

  it("treats malformed tokens as expired", () => {
    expect(isTokenExpired("not-a-jwt")).toBe(true);
  });

  it("clears stored auth values together", () => {
    storeAuth({ token: makeTestJwt(), name: "Avery" });

    clearStoredAuth();

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("name")).toBeNull();
  });
});
