/**
 * @vitest-environment jsdom
 */
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import App from "./App";

describe("App routes", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it("allows guests to open the generate route", async () => {
    render(
      <MemoryRouter initialEntries={["/generate"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      await screen.findByRole("heading", { name: "Generate a Recipe" })
    ).toBeTruthy();
  });

  it("redirects saved recipes to login when no token exists", async () => {
    render(
      <MemoryRouter initialEntries={["/my-recipes"]}>
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
