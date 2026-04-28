/**
 * @vitest-environment jsdom
 */
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, describe, expect, it } from "vitest";
import IngredientInput from "./IngredientInput";

function IngredientInputHarness() {
  const [ingredients, setIngredients] = useState<string[]>([]);

  return <IngredientInput value={ingredients} onChange={setIngredients} />;
}

describe("IngredientInput", () => {
  afterEach(() => {
    cleanup();
  });

  it("adds a custom ingredient from the visible add button", async () => {
    const user = userEvent.setup();
    render(<IngredientInputHarness />);

    await user.type(screen.getByPlaceholderText("Type an ingredient"), "zaatar");
    await user.click(
      screen.getByRole("button", { name: "Add Zaatar as an ingredient" })
    );

    expect(screen.getByRole("button", { name: "Remove Zaatar" })).toBeTruthy();
  });

  it("shows a custom ingredient option when no exact suggestion exists", async () => {
    const user = userEvent.setup();
    render(<IngredientInputHarness />);

    await user.type(
      screen.getByPlaceholderText("Type an ingredient"),
      "black garlic"
    );
    await user.click(
      screen.getByRole("button", {
        name: /Add custom ingredient: Black Garlic/,
      })
    );

    expect(
      screen.getByRole("button", { name: "Remove Black Garlic" })
    ).toBeTruthy();
  });
});
