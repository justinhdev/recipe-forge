/**
 * @vitest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";

describe("App routes", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("redirects protected routes to login when no token exists", async () => {
    render(
      <MemoryRouter initialEntries={["/generate"]}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByRole("heading", { name: "Login" })).toBeTruthy();
  });

  it("renders protected routes when a token exists", async () => {
    localStorage.setItem("token", "test-token");

    render(
      <MemoryRouter initialEntries={["/generate"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      await screen.findByRole("heading", { name: "Generate a Recipe" })
    ).toBeTruthy();
  });
});
