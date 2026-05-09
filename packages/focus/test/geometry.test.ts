import { describe, expect, it } from "vitest";
import { findCandidate, type FocusNode } from "../src/geometry";

const nodes: FocusNode[] = [
  { id: "play", rect: { left: 0, top: 0, right: 100, bottom: 80, width: 100, height: 80 } },
  { id: "details", rect: { left: 140, top: 0, right: 240, bottom: 80, width: 100, height: 80 } },
  { id: "poster", rect: { left: 0, top: 120, right: 100, bottom: 220, width: 100, height: 100 } },
  {
    id: "disabled",
    disabled: true,
    rect: { left: 140, top: 120, right: 240, bottom: 220, width: 100, height: 100 }
  }
];

describe("findCandidate", () => {
  it("selects the closest node in the requested direction", () => {
    expect(findCandidate(nodes, "play", "right")?.id).toBe("details");
    expect(findCandidate(nodes, "play", "down")?.id).toBe("poster");
  });

  it("skips disabled nodes", () => {
    expect(findCandidate(nodes, "details", "down")?.id).toBe("poster");
  });
});
