import { describe, expect, it } from "vitest";
import { formatLocalDate } from "./date";

describe("formatLocalDate", () => {
  it("formats a date as YYYY-MM-DD", () => {
    expect(formatLocalDate(new Date(2026, 5, 10))).toBe("2026-06-10");
  });

  it("zero-pads single-digit months and days", () => {
    expect(formatLocalDate(new Date(2026, 0, 5))).toBe("2026-01-05");
  });

  it("uses the local calendar date, not UTC", () => {
    const lateEvening = new Date(2026, 11, 31, 23, 59, 59);
    expect(formatLocalDate(lateEvening)).toBe("2026-12-31");
  });
});
