import { describe, expect, it } from "vitest";
import { resolveConfig } from "../src/config";

describe("resolveConfig", () => {
  it("applies TV-first defaults", () => {
    const config = resolveConfig({});
    expect(config.theme.defaultTheme).toBe("dark");
    expect(config.focus.restoreOnBack).toBe(true);
    expect(config.targets.web).toBe(true);
  });

  it("preserves explicit target config", () => {
    const config = resolveConfig({
      appId: "com.example.app",
      name: "Example",
      targets: {
        android: {
          packageName: "com.example.tv"
        }
      }
    });

    expect(config.targets.android?.minSdk).toBe(23);
    expect(config.targets.android?.packageName).toBe("com.example.tv");
  });
});
