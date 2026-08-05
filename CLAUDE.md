# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `bun install` — install dependencies (bun is the required package manager; see `packageManager` in `package.json`)
- `bun dev` — start the dev server (Turbopack) at http://localhost:3000. Runs `predev` first (see "Local developer bootstrap" below).
- `bun run build` — production build (also runs the TypeScript type check)
- `bun run start` — serve the production build
- `bun run lint` — run ESLint (flat config: `eslint-config-next` core-web-vitals + typescript rules)
- `bun run create-prototype -- --name "..." [--description "..."]` — scaffold a new prototype for the current developer (see "Creating a new prototype")
- `bun run setup-local` — re-run the local bootstrap manually (normally runs automatically via `predev`)

There is no test suite configured in this repo.

## What this is

"Prototype Playground" — a shared Next.js app where every person on the codeplain team gets their own top-level folder to build and host prototypes. The homepage (`/`) aggregates every registered person's prototypes into one browsable, date-grouped list.

## Tech stack & dependencies

- **Framework**: Next.js (App Router) + React.
- **Styling**: Tailwind CSS only — no CSS Modules, styled-components, or other CSS-in-JS.
- **Language**: TypeScript throughout, including scripts (`scripts/*.ts` run directly via `bun`, no separate build step).
- **Single package.json**: this is not a monorepo/workspaces setup — every dependency, for every person's prototype, lives in the root `package.json`. Don't add nested `package.json` files under `src/app/<name>/`.
- When adding a package, split it by purpose:
  - `dependencies` — anything shipped to the browser or needed at runtime: Next.js, React, UI/component libraries, utility libraries (e.g. date/formatting helpers), AI SDKs, etc.
  - `devDependencies` — build and dev tooling only: TypeScript, ESLint, Prettier (if added), Tailwind and its PostCSS plugin, type packages (`@types/*`).
- Currently installed: `dependencies` = `next`, `react`, `react-dom`. `devDependencies` = `typescript`, `eslint` + `eslint-config-next`, `tailwindcss` + `@tailwindcss/postcss`, `@types/*`. There is no Prettier config yet — if you add one, it's a devDependency per the rule above.

## Project architecture

Source lives under `src/`, with the `@/*` path alias resolving to `src/*` (see `tsconfig.json`).

```
src/
  app/
    layout.tsx              # root layout (html/body, fonts, metadata)
    globals.css             # Tailwind import + shared CSS vars (--ease-out, --ease-in-out)
    registry.ts             # aggregates every developer's prototypes.ts into one list for the homepage
    (root)/                 # route group: homepage chrome, doesn't affect the URL
      layout.tsx            #   renders <NavBar /> + fades in page content
      page.tsx              #   "/" — the aggregated prototype list
    (nds)/                  # route group: design system section
      layout.tsx            #   renders <NavBar />
      design-system/
        page.tsx            #   "/design-system"
    (templates)/            # route group: templates section
      layout.tsx            #   renders <NavBar />
      templates/
        page.tsx            #   "/templates"
    api/
      prototypes/route.ts   # POST handler backing the "+ New" button; calls scripts/create-prototype.ts
    kaja/                    # one plain top-level folder per developer (this one is kaja's)
      prototypes.ts          #   manifest: [{ slug, title, description?, date }, ...]
      example-prototype/
        page.tsx             #   one real route per prototype
  components/
    NavBar.tsx               # title + Prototypes/Templates/Design System tabs with animated indicator
    NewPrototypeButton.tsx   # dev-only "+ New" button + modal
  icons/
    FlaskIcon.tsx            # the title icon (solid black, currentColor-based)
scripts/
  create-prototype.ts        # shared scaffolding logic — CLI + library, used by both creation paths
  setup-local.ts             # bootstraps the local developer's namespace + regenerates CLAUDE.local.md
  username.ts                # resolves the current developer's username (git config, falls back to OS user)
```

### Per-developer folders + the registry

- Each team member owns a **plain** top-level folder at `src/app/<name>/` (a sibling of `src/app/api/` and the three route groups below — not wrapped in parentheses) containing:
  - `prototypes.ts` — a manifest array (`{ slug, title, description?, date }`) describing that person's prototypes. This is the source of truth for what appears on the homepage; nothing scans the filesystem.
  - One real route folder per prototype, `src/app/<name>/<slug>/page.tsx` — an ordinary Next.js page the person builds their prototype in.
- `src/app/registry.ts` aggregates every person's `prototypes.ts` into `allPrototypes` (attaching `author` and `href`) and exposes `groupByMonth` for the homepage's grouping. **To onboard a new person**, add `src/app/<name>/prototypes.ts` and register it in the `authors` array in `src/app/registry.ts`. (`bun dev`'s local bootstrap creates the folder and starter `prototypes.ts` automatically — see below — but registering in `registry.ts` is still a manual, one-time shared-file edit.)
- A manifest entry with no matching `src/app/<name>/<slug>/page.tsx` folder will 404 when clicked from the homepage — the manifest and the folder must stay in sync. The "Creating a new prototype" flow below keeps them in sync automatically.

### Route groups and shared chrome

- Three top-level route groups organize shared sections without affecting the URL: `(root)` (`/`), `(nds)` (`/design-system`), `(templates)` (`/templates`). Each has its own `layout.tsx` rendering the shared `NavBar` (title + tabs with an animated sliding indicator) — because they're siblings rather than nested under one common group, `NavBar` remounts when navigating between these three sections (the sliding-indicator animation only plays within a section, not across them).
- Individual developer prototype pages (`src/app/<name>/<slug>/page.tsx`) live outside all three route groups and render their own minimal chrome (a "Go Back" link) rather than sharing the tab nav.

### Local developer bootstrap

`bun dev` runs `predev` → `scripts/setup-local.ts` automatically, which:

1. Resolves the current developer's username via `scripts/username.ts` (`git config user.name`, slugified; falls back to the OS username).
2. Creates `src/app/<username>/` and a starter `prototypes.ts` if this is a brand-new namespace on this machine.
3. Regenerates `CLAUDE.local.md` (gitignored) with that developer's identity, their namespace path, and instructions scoping the AI to only work inside `src/app/<username>/` — never hand-edit `CLAUDE.local.md`, it's overwritten on every `bun dev`.

### Creating a new prototype

There are two entry points, and both call the exact same `scripts/create-prototype.ts` — that module is the single source of truth for what a freshly created prototype looks like:

1. **The "+ New" button** (`src/components/NewPrototypeButton.tsx`) — a dev-only modal (name + description) gated on `process.env.NODE_ENV === "development"` (tree-shaken out of production builds), which posts to `src/app/api/prototypes/route.ts` (also 403-guarded to development only).
2. **The `create-prototype` Claude Code skill** (`~/.claude/skills/create-prototype/SKILL.md`) — runs `bun scripts/create-prototype.ts --name "..." --description "..."` directly from the CLI.

`scripts/create-prototype.ts` exports `createPrototype({ name, description, username, cwd })` (username defaults to the result of `scripts/username.ts`) and also runs as a standalone CLI (`bun scripts/create-prototype.ts --name "X" [--description "Y"] [--username "Z"]`, or `bun run create-prototype -- --name "X"`). It:
  1. Resolves the target username (current developer, unless overridden) and ensures `src/app/<username>/` + `prototypes.ts` exist, bootstrapping them if this is a new namespace.
  2. Slugifies the name and ensures uniqueness by checking for an existing folder under `src/app/<username>/`.
  3. Writes a new `page.tsx` from a template (a `metadata` export, a static `data` object, and a "Go Back" / "Open in Cursor" card UI).
  4. Appends a matching entry to `prototypes.ts` via direct string manipulation, anchored on the literal `export const prototypes: Prototype[] = [` line.

Generated pages link to `cursor://file/<absolute path>` to open the file directly in Cursor; the absolute path is baked in at generation time, so it's only valid on the machine that created it.

If you need to change what a newly created prototype looks like, edit `scripts/create-prototype.ts` only — the API route and the skill both defer to it.

## Conventions

- Tailwind v4 (CSS-first config, no `tailwind.config.*` file). Dark mode uses Tailwind's default `dark:` (`prefers-color-scheme`) variant — style both light and dark for any new UI.
- Reusable easing curves live in `src/app/globals.css` as `--ease-out` / `--ease-in-out` CSS variables, consumed via Tailwind arbitrary values (e.g. `ease-[var(--ease-out)]`).
- Interactive elements use `motion-reduce:` variants to disable transforms/transitions for reduced-motion users.
- Route props use Next.js's generated `PageProps<'/route'>` / `LayoutProps<'/route'>` helpers instead of manually typing `params`/`children`. These types are generated by `next dev`, `next build`, or `next typegen` — run one of those if the generated types seem stale after moving/renaming routes.
