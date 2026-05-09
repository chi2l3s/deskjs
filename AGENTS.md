# Code Cleanup Agent Instructions

## Goal

Refactor the entire codebase to improve readability, eliminate duplication, and remove dead weight. No new features. No behavior changes. Just clean code.

---

## Rules

### 1. Extract Repeated Logic into Functions

- If the same block of code (3+ lines) appears more than once — extract it into a named function.
- Place shared functions in a logical shared/utils file, or near the code that owns it.
- The function name must clearly describe what it does (verb + noun): `getUserById`, `formatDate`, `buildQuery`.
- Do not create a function for a one-liner unless it's used 3+ times.

### 2. Simplify Variable Names

- One word is ideal. Two words max. Three words is almost always wrong.
- Use domain language, not implementation language:
  - ❌ `userDataResponseObject`, `tempIterationCounter`, `fetchedResultsArray`
  - ✅ `user`, `count`, `results`
- Loop variables: `i`, `j` are fine for simple loops. For meaningful loops use the item name: `for (const user of users)`.
- Boolean variables must read like a question: `isLoading`, `hasError`, `canSubmit`.
- Avoid abbreviations unless they're universal (`id`, `url`, `db`, `ctx`, `err`).

### 3. Clean Up Dead Code

- Delete commented-out code blocks. Git history exists for a reason.
- Delete unused variables, unused imports, unused functions.
- Delete console.log / print / debug statements left from development.
- Delete TODO comments older than the current sprint (or flag them clearly with `// TODO(owner): description`).

### 4. Flatten Nesting

- If a function has more than 3 levels of nesting — refactor it.
- Use early returns (guard clauses) instead of deeply nested if-else:

  ```
  // ❌ bad
  if (user) {
    if (user.active) {
      doSomething()
    }
  }

  // ✅ good
  if (!user || !user.active) return
  doSomething()
  ```

### 5. One Function, One Job

- If a function does more than one thing — split it.
- Max ~30 lines per function. If it's longer, it probably does too much.
- Side effects must be isolated from pure logic.

### 6. Consistent Formatting

- Apply the project's existing formatter (Prettier, Black, gofmt, etc.) to every file you touch.
- If no formatter is configured — do not invent one. Flag it in the summary.

### 7. Always Use Latest Package Versions

- **Never hardcode version numbers from memory.** They are outdated the moment you write them.
- Before adding or updating any dependency, resolve the actual latest version via the registry:
  ```bash
  npm info <package> version          # latest stable
  npm info <package> dist-tags        # see all tags (latest, next, beta)
  ```
- Then write the resolved version into `package.json`. No `^`, no `~` unless the project already uses them consistently.
- If multiple packages are being added at once, resolve all versions first, then write `package.json` once.
- For `devDependencies` (TypeScript, ESLint, Prettier, etc.) — same rule applies. Always check.
- **Do not guess.** If you are unsure of the version — run `npm info`.

### 8. Use CLI Scaffolding, Never Write Boilerplate by Hand

- When setting up a new framework, tool, or library that has an official CLI — **use the CLI**. Do not create files manually.
- Examples:

  ```bash
  # ✅ correct
  npx create-next-app@latest my-app
  npx create-vite@latest my-app
  npx nuxi@latest init my-app
  npx @nestjs/cli new my-app
  npm create svelte@latest my-app
  npm create astro@latest my-app

  # ❌ wrong
  mkdir my-app && touch index.js package.json webpack.config.js ...
  ```

- Always use `@latest` tag in the CLI command so you get the current version, not a cached one.
- After scaffolding, if additional packages are needed — add them with `npm install <pkg>@latest`, not by editing `package.json` manually.
- If a tool does not have a CLI — note this explicitly and proceed carefully, resolving each package version via `npm info` first.

---

## Constraints

- **Do not change behavior.** If a refactor risks changing logic — leave it and add a comment `// REVIEW: possible refactor`.
- **Do not rename public API functions or exported symbols** without explicit instruction.
- **Do not add new dependencies.**
- **Do not touch generated files** (anything in `dist/`, `build/`, `__generated__/`, `.pb.go`, etc.).
- Work file by file, or module by module. Do not rewrite the whole project in one shot.

---

## Output Format

For each file you modify, provide:

```
### `path/to/file.ts`

**Changes:**
- Extracted `doX` and `doY` into shared `helpers.ts`
- Renamed `tempDataResponseObj` → `data`
- Removed 2 unused imports
- Deleted commented-out block (lines 45–60)
- Flattened nested if in `processOrder()`
```

If a file has no issues — skip it. Do not list files that required no changes.

---

## Priority Order

1. Files with the most duplication first.
2. Then files with the longest functions.
3. Then files with the most complex variable names.
4. Then dead code cleanup across the board.

---

## Done Criteria

The cleanup is complete when:

- No block of 3+ lines is copy-pasted more than once.
- No variable name exceeds two words (except established domain terms).
- No commented-out code remains.
- No unused imports or variables remain.
- All functions have a single clear responsibility.
- All package versions in `package.json` were resolved via `npm info`, not written from memory.
- No framework or tool was scaffolded by hand if a CLI exists for it.
