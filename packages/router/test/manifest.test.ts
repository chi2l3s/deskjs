import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";
import { createManifest } from "../src/manifest";
import { matchRoute } from "../src/match";

function writePage(root: string, path: string) {
  const dir = join(root, path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "page.tsx"), "export default function Page() { return null; }");
}

describe("createManifest", () => {
  it("creates static and dynamic app routes", () => {
    const root = join(tmpdir(), `desk-${Date.now()}`);
    writePage(root, "");
    writePage(root, "movies");
    writePage(root, "movies/[id]");

    const manifest = createManifest(root);
    expect(manifest.map((route) => route.path)).toEqual(["/", "/movies", "/movies/:id"]);
    expect(matchRoute(manifest, "/movies/dune")?.params).toEqual({ id: "dune" });
  });
});
