# AGENTS.md

This repo is a Next.js App Router project with Tailwind CSS and TypeScript.

## Quick Facts
- Package manager: npm (package-lock.json present)
- TypeScript strict: enabled in `tsconfig.json`
- Styling: Tailwind CSS v4 with CSS variables
- UI runtime: React 19, Next.js 16

## Commands
### Install
- `npm install`

### Dev
- `npm run dev` (starts Next dev server on :3000)

### Build
- `npm run build`

### Start (production)
- `npm run start` (requires build output)

### Lint
- `npm run lint` (eslint with next core-web-vitals + typescript)

### Typecheck (optional)
- `npx tsc --noEmit` (not a package.json script)

### Tests
- No automated test runner configured.
- There is no single-test command available yet.
- If you add tests, also add scripts in `package.json`.

## Cursor/Copilot Rules
- No `.cursorrules`, `.cursor/rules`, or `.github/copilot-instructions.md` found.

## Repo Layout
- `app/`: App Router pages, layouts, providers, and API routes.
- `app/api/`: Route handlers using NextRequest/NextResponse.
- `components/`: UI + feature components, organized by domain.
- `hooks/`: Client hooks for data fetching and UI state.
- `lib/`: Server/client utilities (ai, db, storage, auth, utils).
- `types/`: Shared TypeScript types.
- `public/`: Static assets.

## TypeScript & React Style
- Use TypeScript everywhere; keep `strict` mode passing.
- Prefer `type` imports: `import type { Foo } from ...`.
- Use `interface` for public prop shapes when it improves clarity; otherwise `type`.
- Use functional components; no class components.
- Client components must start with `"use client";`.
- Keep hooks named `useX` and colocated in `hooks/`.
- Keep React state in `useState`, and event handlers wrapped in `useCallback`.
- Return early for guard clauses to reduce nesting.
- Prefer descriptive state names (`isUploading`, `selectedFabric`).

## Imports
- Prefer absolute imports via `@/` alias from repo root.
- Order imports by groups: external, internal (`@/`), relative.
- Separate groups with a blank line.
- Keep type-only imports separate when possible.

## Formatting
- Use 2-space indentation.
- Use double quotes for strings.
- Always include semicolons.
- Wrap long JSX props/arrays into multi-line blocks.
- Use trailing commas in multi-line objects/arrays.
- Keep JSX attributes aligned and readable.

## Naming
- Components: `PascalCase` filenames + exports.
- Hooks: `useCamelCase`.
- Utilities: `camelCase` functions, `SCREAMING_SNAKE_CASE` constants.
- Types: `PascalCase` for type names.
- Files/folders: `kebab-case` or `PascalCase` consistent with existing folder.

## Styling & UI
- Tailwind utility classes are the default styling approach.
- Use design tokens via CSS variables (`--color-*`, `--radius-*`).
- Use the `cn` helper from `lib/utils/cn` to merge class names.
- Reuse shared UI components (`components/ui`) instead of duplicating styles.
- Keep class strings organized (layout → spacing → color → effects).

## Data Fetching
- Use `fetch` in client hooks for API calls.
- Always check `response.ok`; parse error JSON when non-OK.
- Throw or return descriptive errors; surface via hook state.
- Prefer JSON payloads with explicit headers.

## API Routes (app/api)
- Use `NextRequest`/`NextResponse`.
- Validate inputs and return 400s for missing/invalid fields.
- Return consistent JSON shapes with `error` or `success` flags.
- Use try/catch; log errors with `console.error` and return 500.
- Use HTTP status codes for rate limiting (429), not custom codes.
- Use cookies for per-user tracking when needed.

## Error Handling Patterns
- Client hooks set `{ status: "error", error: message }` on failures.
- Server routes return `NextResponse.json({ error }, { status })`.
- Preserve the original error message when safe; provide fallbacks.
- Avoid throwing raw non-Error values.

## Accessibility & UX
- Provide alt text for images when applicable.
- Buttons/links should have clear labels.
- Avoid disabled actions without explaining why in UI.

## State & Side Effects
- Avoid side effects in render.
- Revoke object URLs when clearing previews.
- Reset dependent state when moving between steps.

## Environment & Secrets
- Keep secrets in env vars; never hardcode credentials.
- Server-only env access in server components/routes.
- Avoid importing server-only modules into client components.

## Files to Touch Carefully
- `middleware.ts` (request handling).
- `lib/db/*` (data access).
- `lib/ai/*` and `lib/storage/*` (external integrations).

## Suggested Workflow
- Run `npm run lint` before finalizing.
- Run `npx tsc --noEmit` when changing types.
- Manual test the flow in the browser for UI changes.

## Notes for Agents
- This file has no external agent rules to include.
- Keep changes minimal and consistent with existing style.
- Do not add new tooling unless requested.

## Common Patterns
- Use `index.ts` barrel files for component exports.
- Keep component-specific styles inside the component file.
- Use `forwardRef` when passing refs through UI components.
- Prefer `readonly` props objects in function signatures when helpful.

## Adding New Components
- Place shared UI in `components/ui` and export from `components/ui/index.ts`.
- Place feature-specific components in domain folders.
- Co-locate related subcomponents next to the parent.

## Adding New Hooks
- Keep hooks in `hooks/` and export from `hooks/index.ts`.
- Keep hook return shapes stable and typed.

## Documentation
- Update `README.md` only when user-facing behavior changes.
- Avoid adding new markdown files unless requested.

## Line Count Note
- Aim to keep files readable; break up large components.
