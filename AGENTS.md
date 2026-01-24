# AGENTS

## Repository Overview
- Angular 20 standalone app (`EC-Frontend`) using Angular CLI.
- Source root: `src/` with feature folders under `src/app/features/`.
- Core cross-cutting code in `src/app/core/` (services, guards, interceptors, models).
- Layout shells in `src/app/layouts/` and shared UI in `src/app/shared/`.
- Routing is centralized in `src/app/app.routes.ts` using `loadComponent`.

## Quick Commands
- Install deps: `npm install`
- Dev server: `npm run start` (alias: `ng serve`)
- Build (prod): `npm run build`
- Build (dev watch): `npm run watch`
- Unit tests (Karma): `npm run test`
- Single test file: `ng test --include "src/app/path/to/file.spec.ts"`
- Single spec pattern: `ng test --include "**/feature-name/**/*.spec.ts"`
- Test in headless Chrome: `ng test --browsers ChromeHeadless`
- Linting: not configured (no ESLint/TSLint scripts found).
- Formatting: Prettier config lives in `package.json`.

## Tooling Notes
- Angular CLI version is pinned in `package.json` devDependencies.
- TypeScript is `strict` (see `tsconfig.json`).
- Standalone components are used; no NgModules.
- Karma is the configured test runner; e2e not set up.

## Cursor/Copilot Rules
- No `.cursor/rules/`, `.cursorrules`, or `.github/copilot-instructions.md` found.

## Role And Collaboration
- Role: Frontend Angular developer for the e-commerce web app (Angular + Bootstrap).
- Backend owner: user handles ASP.NET Core APIs and SQL Server; do not change backend code.
- Ask for clarification when needed; do not assume backend behavior or contracts.
- You may suggest best practices or performance improvements, but get approval before applying.
- If an API response or contract change is needed, ask first and wait for confirmation.
- Acknowledge these collaboration rules at the start of the conversation.

## Mandatory Workflow
- Phase 1 (design-only analysis): analyze layout/UX, implement with dummy data only.
- No API calls, services, or logic in Phase 1; focus on design and consistent styling.
- Phase 2 (integration): after design approval, add services, types, state, and logic.
- Follow Angular best practices, strict typing, and existing project patterns.
- If you see a better technical approach, explain it and wait for approval before applying.

## Execution Boundaries
- Implement only what is explicitly requested.
- Do not add features, refactor unrelated code, or improve items unless requested.
- You may propose next steps, but do not execute them without confirmation.
- Keep code clean: no unused imports, redundant code, or duplicate logic.

## Browser Usage
- Use the browser only when analyzing an existing UI or flow.
- Ask for credentials before accessing protected areas.
- For tasks without browsing, assume the user will validate after completion.

## Project Structure Conventions
- Features are grouped by domain: `features/auth`, `features/shop`, `features/admin`, `features/static`.
- Shared reusable UI lives in `shared/components` (header/footer/product-card).
- Layout shells live in `layouts/main-layout` and `layouts/admin-layout`.
- Core business types in `core/models` and `core/types`.
- Cross-cutting services in `core/services` and barrel-exported from `core/services/index.ts`.
- Guards/interceptors are in `core/guards` and `core/interceptors`.
- Utilities are in `src/app/utils` (e.g., `checkToken.ts`).

## TypeScript Style
- Use `strict` typing and explicit interfaces for API DTOs.
- Prefer `readonly` for injected dependencies and constants.
- Prefer `const`/`let` over `var`; avoid reassigning function parameters.
- Use `signal<T>` for component/service state when appropriate.
- Return `Observable<T>` from services; keep components subscribing.
- Use `Omit<>`, `Record<>`, and union types for DTOs as in models.
- Keep `private` fields before public methods.
- Use `this.` for all instance fields; avoid free variables in classes.
- Keep method return types explicit when non-void or non-inferable.

## Angular Component Patterns
- Components are standalone with `@Component({ selector, imports, templateUrl, styleUrl })`.
- Class names are PascalCase and match folder names (e.g., `Login`, `AdminLayout`).
- Selectors use `app-` prefix.
- Template files use `.html` with matching `.css` for component styles.
- Use `loadComponent` in routes for lazy loading.
- Use `canActivate` guards at route definitions with role data when needed.
- Use dependency injection via `constructor` or `inject()` when not in class constructor.
- Keep component state grouped and labeled with comments (e.g., `//State`).

## Imports and File Layout
- Imports are grouped with comment headers:
- `//Angular Imports`
- `//Libraries`
- `//Environment`
- `//Services`
- `//Models`
- `//Types`
- `//Utils`
- Keep Angular imports first, then third-party, then local.
- Prefer relative paths within `src/app`.
- Use barrel exports where available (`core/services`, `core/models`).
- Avoid unused imports; keep sorted within sections.

## Formatting Rules
- Prettier config (`package.json`) uses:
- `printWidth: 100`
- `singleQuote: true`
- HTML uses the Angular parser.
- Indentation is 2 spaces.
- Trailing commas in multiline object/array literals.
- Keep object literals aligned with existing style (comma after last property).
- Keep short arrow functions on one line when readable.

## Naming Conventions
- Files and folders: kebab-case (`product-details`, `admin-layout`).
- Components/classes: PascalCase.
- Interfaces/types: PascalCase with `Dto`/`Request`/`Response` suffix when applicable.
- Enums/types for roles use `RoleType`.
- Observables use noun names (e.g., `user`, `refreshTokenSubject`).
- Booleans use `is/has/should` prefixes (`isRefreshing`, `hasApiError`).

## Error Handling
- Use `catchError` in RxJS pipelines for HTTP flows.
- In components, use `.subscribe({ next, error })` with UI feedback.
- Use `ngx-toastr` for user-facing messages.
- On auth failures, clear state and redirect to `/login`.
- Avoid swallowing errors; rethrow with `throwError` when needed.

## RxJS Patterns
- Favor pipeable operators (`switchMap`, `filter`, `take`) as shown in interceptors.
- Use `BehaviorSubject` for shared transient state.
- Use `take(1)` when waiting for a single emission.
- Avoid nested subscriptions unless unavoidable.

## HTML/CSS Conventions
- HTML templates are colocated next to component class.
- CSS uses class-based styling and descriptive names.
- Prefer CSS variables or theme tokens if introduced; otherwise keep palette consistent.
- Keep component styles scoped to the component file.

## Testing Guidance
- Specs live alongside features as `*.spec.ts`.
- Use Jasmine (`describe/it/expect`).
- Prefer shallow component tests; mock services as needed.
- Run `ng test --include "path/to/spec.ts"` for focused runs.

## Common Tasks
- Add a feature: create under `src/app/features/<domain>/<feature-name>/`.
- Add a route: update `src/app/app.routes.ts`.
- Add a service: place in `src/app/core/services` and export in `index.ts`.
- Add models: add to `src/app/core/models` and export in `index.ts`.
- Environment values live in `src/environments`.

## Build/Serve Notes
- Production build uses file replacements (`environment.prod.ts`).
- Assets are served from `public/` configured in `angular.json`.
- Global styles live in `src/styles.css`.
- Toastr styles are pulled from `node_modules/ngx-toastr/toastr.css`.

## Do/Do Not
- Do keep TypeScript strictness intact; avoid `any`.
- Do keep route paths consistent with existing naming (kebab or simple words).
- Do keep services side-effect free except where explicitly required (auth, cart).
- Do not introduce new global state without a clear owner.
- Do not change `app.config.ts` providers without reason.

## References
- Angular config: `angular.json`
- TS config: `tsconfig.json`, `tsconfig.app.json`, `tsconfig.spec.json`
- Prettier settings: `package.json`
- App entry: `src/main.ts`
- Routes: `src/app/app.routes.ts`

## Notes For Agents
- This repo has no lint tooling; rely on TypeScript + Prettier.
- If you add linting, update this file with the new commands.
- Keep this file updated when scripts change.
- Use ASCII only; avoid Unicode symbols.
- End of file.
