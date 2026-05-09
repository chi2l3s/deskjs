import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FocusProvider } from "@deskjs/focus";
import { Button } from "../src";

describe("Button", () => {
  it("renders a focusable TV button", () => {
    render(
      <FocusProvider>
        <Button>Play</Button>
      </FocusProvider>
    );
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
  });
});
