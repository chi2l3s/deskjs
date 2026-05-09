import type { ReactNode } from "react";
import { FocusProvider } from "@deskjs/focus";
import { RouterProvider, type RouteManifest } from "@deskjs/router";
import { ThemeProvider, type Theme } from "@deskjs/theme";

export { Link, RouterProvider, useParams, useRouter } from "@deskjs/router";
export { FocusProvider, FocusScope, useFocusable, useFocusManager } from "@deskjs/focus";
export { ThemeProvider, useTheme, type Theme } from "@deskjs/theme";
export * from "@deskjs/ui";
export {
  defineConfig,
  resolveConfig,
  configSchema,
  type DeskConfig,
  type ResolvedConfig
} from "./config";

export interface DeskRootProps {
  children?: ReactNode;
  defaultTheme?: Theme;
  manifest?: RouteManifest;
}

export function DeskRoot({ children, defaultTheme = "dark", manifest }: DeskRootProps) {
  return (
    <ThemeProvider defaultTheme={defaultTheme}>
      <FocusProvider>
        {manifest ? <RouterProvider manifest={manifest}>{children}</RouterProvider> : children}
      </FocusProvider>
    </ThemeProvider>
  );
}
