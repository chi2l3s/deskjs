import { describe, expect, it } from "vitest";
import { resolveTheme } from "../src";

describe("resolveTheme", () => {
  it("uses explicit modes before system preference", () => {
    expect(resolveTheme("dark", "light")).toBe("dark");
    expect(resolveTheme("light", "dark")).toBe("light");
  });

  it("uses system preference for system mode", () => {
    expect(resolveTheme("system", "dark")).toBe("dark");
  });
});
