/**
 * @vitest-environment jsdom
 */
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import GenerateRecipe from "./GenerateRecipe";

const { generateMock, saveMock } = vi.hoisted(() => ({
  generateMock: vi.fn(),
  saveMock: vi.fn(),
}));

vi.mock("../hooks/useRecipeActions", () => ({
  useRecipeActions: () => ({
    generate: generateMock,
    save: saveMock,
  }),
}));

const pendingRecipe = {
  title: "Test Recipe",
  ingredients: ["1 cup rice"],
  instructions: "Step 1. Cook rice.",
  calories: 200,
  protein: 4,
  fat: 1,
  carbs: 44,
};

describe("GenerateRecipe", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    generateMock.mockReset();
    saveMock.mockReset();
    localStorage.clear();
    sessionStorage.clear();
  });

  it("restores a guest recipe and sends guests to login before saving", async () => {
    sessionStorage.setItem(
      "recipe-forge:pending-recipe",
      JSON.stringify(pendingRecipe)
    );
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/generate"]}>
        <Routes>
          <Route path="/generate" element={<GenerateRecipe />} />
          <Route path="/login" element={<h1>Login Route</h1>} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText("Test Recipe")).toBeTruthy();
    expect(screen.getByText("Save this recipe after signing in.")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "Sign in to Save" }));

    expect(
      await screen.findByRole("heading", { name: "Login Route" })
    ).toBeTruthy();
    expect(sessionStorage.getItem("recipe-forge:pending-save-intent")).toBe(
      "true"
    );
  });

  it("automatically saves a guest recipe after sign in when save was requested", async () => {
    localStorage.setItem("token", "test-token");
    sessionStorage.setItem(
      "recipe-forge:pending-recipe",
      JSON.stringify(pendingRecipe)
    );
    sessionStorage.setItem("recipe-forge:pending-save-intent", "true");
    saveMock.mockResolvedValue(undefined);

    render(
      <MemoryRouter initialEntries={["/generate"]}>
        <Routes>
          <Route path="/generate" element={<GenerateRecipe />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText("Test Recipe")).toBeTruthy();

    await waitFor(() => {
      expect(saveMock).toHaveBeenCalledWith(pendingRecipe);
    });
    expect(sessionStorage.getItem("recipe-forge:pending-recipe")).toBeNull();
    expect(
      sessionStorage.getItem("recipe-forge:pending-save-intent")
    ).toBeNull();
    expect(await screen.findByRole("button", { name: "Saved" })).toBeTruthy();
  });
});
