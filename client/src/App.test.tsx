/**
 * @vitest-environment jsdom
 */
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import App from "./App";
import { makeTestJwt } from "./test/auth";

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

  it("keeps users on login when a stored token is expired", async () => {
    localStorage.setItem("token", makeTestJwt(-60));
    localStorage.setItem("name", "Avery");

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByRole("heading", { name: "Login" })).toBeTruthy();
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("name")).toBeNull();
  });

  it("redirects protected routes when a stored token is expired", async () => {
    localStorage.setItem("token", makeTestJwt(-60));

    render(
      <MemoryRouter initialEntries={["/admin/stats"]}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByRole("heading", { name: "Login" })).toBeTruthy();
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("renders protected routes when a token exists", async () => {
    localStorage.setItem("token", makeTestJwt());

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
