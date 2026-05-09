# deskjs

deskjs is a React and TypeScript framework for building TV applications. It gives developers a Next.js-like client-first workflow with an `app/` directory, layouts, file routes, a CLI, Vite production builds, Tailwind CSS v4.2, dark/light themes, remote-control focus navigation, and TV-oriented UI components.

The MVP focuses on a working web target first. Android, Tizen, and webOS adapters are present as package boundaries with config helpers and clear SDK integration paths.

## Quick Start

```bash
npx create-desk-app my-tv-app
cd my-tv-app
pnpm install
pnpm dev
pnpm build
```

In this monorepo, run the cinema example with:

```bash
pnpm install
pnpm --filter deskjs-cinema-example dev
pnpm --filter deskjs-cinema-example build
```

## Project Structure

```txt
app/
  layout.tsx
  page.tsx
  movies/[id]/page.tsx
styles/globals.css
desk.config.ts
```

`app/page.tsx` maps to `/`, `app/movies/page.tsx` maps to `/movies`, and `app/movies/[id]/page.tsx` maps to `/movies/:id`. `layout.tsx` files are discovered and nested in route order.

## App Router

deskjs provides a client-first router:

```tsx
import { Link, useParams, useRouter } from "desk-js";
```

The router supports client navigation, dynamic params, nested layouts, and a generated route manifest. It intentionally does not implement SSR, React Server Components, server actions, middleware, or advanced caching.

## Focus Navigation

The focus engine is designed for TV remotes and keyboard arrows:

```tsx
import { useFocusable } from "desk-js/focus";

const { ref, focused, focusSelf } = useFocusable({
  id: "play-button",
  autoFocus: true,
  onEnter: play
});
```

It tracks focusable elements, reads their bounding boxes, scores candidates by direction, distance, and alignment, skips disabled or hidden nodes, handles Enter/Space/Escape/Backspace, and remembers focus per route.

## Theme System

deskjs defaults to dark mode and supports `dark`, `light`, and `system`:

```tsx
import { ThemeProvider, useTheme } from "desk-js/theme";
```

The provider persists the selected theme, resolves system preference, and updates both `class="dark"` and `data-theme="dark|light"` on the root element. Starter styles use CSS variables so Tailwind classes work in both modes.

## Tailwind CSS v4.2

Generated apps include Tailwind CSS `4.2.4` and `@tailwindcss/vite` `4.2.4`.

```css
@import "tailwindcss";
```

No manual Tailwind setup is required for generated deskjs apps.

## UI Components

Use TV-first components from `deskjs/ui` or `@deskjs/ui`:

```tsx
import { Button, Hero, Row, Poster, Grid } from "desk-js/ui";
```

Included components: `Button`, `IconButton`, `Hero`, `Card`, `Poster`, `Row`, `Grid`, `Tabs`, `Sidebar`, `Modal`, `Dialog`, `Toast`, `Spinner`, `TextInput`, `Keyboard`, `SafeArea`, and `Page`.

## CLI

```bash
desk dev
desk build
desk build --target=web
desk build --target=tizen
desk build --target=webos
desk build --target=android
desk run --target=web
desk doctor
```

`dev` and `build` work for the web target. Other targets return useful scaffold messages until SDK packaging is implemented.

## Build Targets

The web adapter builds to `.desk/dist/web`.

Tizen is modeled as a packaged web widget with generated `config.xml`. webOS is modeled as a packaged web app with generated `appinfo.json`. Android is modeled as a WebView shell loading built web assets from `android_asset/www`.

## Backend Data

The starter and cinema example use local mock data by default. Set `VITE_API_URL` and implement `/movies` on your backend to replace the mock service:

```ts
const res = await fetch(`${import.meta.env.VITE_API_URL}/movies`);
```

## Current MVP Limitations

- Web target is the only fully working build target.
- Native packaging commands are adapter stubs.
- Routing is client-side only.
- Loading and error conventions are minimal.
- Focus scopes are present, but modal focus trapping is intentionally simple in this MVP.

## Roadmap

- Native SDK packaging for Tizen, webOS, and Android.
- Route-level loading and error boundaries.
- Stronger focus scope trapping and spatial navigation tuning.
- Playwright TV viewport verification.
- More UI primitives and accessibility affordances.
