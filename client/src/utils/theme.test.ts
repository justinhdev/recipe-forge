/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, it } from "vitest";
import { applyTheme, getInitialTheme, saveTheme } from "./theme";

describe("theme", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("defaults to dark mode when no theme has been saved", () => {
    expect(getInitialTheme()).toBe("dark");
  });

  it("uses a saved light theme", () => {
    localStorage.setItem("theme", "light");

    expect(getInitialTheme()).toBe("light");
  });

  it("applies dark mode to the document root", () => {
    applyTheme("dark");

    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("saves and applies a light theme", () => {
    document.documentElement.classList.add("dark");

    saveTheme("light");

    expect(localStorage.getItem("theme")).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});
