import { z } from "zod";

const theme = z
  .object({
    defaultTheme: z.enum(["dark", "light", "system"]).default("dark")
  })
  .default({ defaultTheme: "dark" });

const focus = z
  .object({
    restoreOnBack: z.boolean().default(true),
    debug: z.boolean().default(false)
  })
  .default({ restoreOnBack: true, debug: false });

const ui = z
  .object({
    overscanSafeArea: z.boolean().default(true)
  })
  .default({ overscanSafeArea: true });

const targets = z
  .object({
    web: z.boolean().default(true),
    tizen: z
      .object({
        profile: z.string().default("tv")
      })
      .optional(),
    webos: z
      .object({
        vendor: z.string().default("deskjs")
      })
      .optional(),
    android: z
      .object({
        packageName: z.string().optional(),
        minSdk: z.number().int().min(21).default(23)
      })
      .optional()
  })
  .default({ web: true });

export const configSchema = z.object({
  appId: z.string().min(1).default("com.deskjs.app"),
  name: z.string().min(1).default("deskjs app"),
  version: z.string().default("0.1.0"),
  theme,
  focus,
  ui,
  targets
});

export type DeskConfig = z.input<typeof configSchema>;
export type ResolvedConfig = z.output<typeof configSchema>;

export function defineConfig(config: DeskConfig): DeskConfig {
  return config;
}

export function resolveConfig(config: DeskConfig = {}): ResolvedConfig {
  return configSchema.parse(config);
}
