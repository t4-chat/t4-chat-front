# Codebase Patterns and Conventions

This document outlines key architectural, coding, and styling patterns used throughout the repository. It serves as a reference for developers and LLMs when building or extending applications using these conventions.

---

## 1. Project Structure

- **Root directories**:
  - `src/` – application source code
  - `openapi/` – generated API client and query hooks
  - `public/` – static assets
  - `dist/` – build output
  - config files: `vite.config.mts`, `tsconfig.json`, `Dockerfile`, `docker-compose.yml`, etc.

- **`src/` organization**:
  - `components/` – reusable UI components (atomic under `ui/`, feature-specific elsewhere)
  - `pages/` – route-driven top-level pages, one folder per page (e.g. `PageName/`)
  - `contexts/` – React Context providers (e.g. `AuthContext`, `ThemeContext`)
  - `utils/` – helper functions and custom hooks
  - `assets/` – static assets like SVG icons
  - `styles/` – global CSS and theme definitions
  - `types/` – custom TypeScript type definitions (if any)
  - entrypoints: `index.tsx`, `App.tsx`, `routes.tsx`

## 2. Naming Conventions

- **Folders & files**:
  - PascalCase for component and page folders: `ComponentName/ComponentName.tsx`
  - PascalCase for React component filenames: `ComponentName.tsx`, `PageName.tsx`
  - kebab-case for config files: `tailwind.config.js`, `postcss.config.js`

### TypeScript Types & Interfaces
- Use `interface` for defining public object shapes (e.g., component props, context values).
- Name interfaces with clear suffixes like `Props` or `Type` (e.g., `ButtonProps`, `AuthContextType`).
- Use `type` aliases for unions, intersections, tuples, and mapped types.
- Keep type definitions close to their usage or in a shared `types/` directory for broader reuse.

### Exporting Preferences
- Prefer **named exports** for components, hooks, utilities, and types to maintain clear import paths.
- Restrict **default exports** to top-level entrypoints (e.g., page components, the main `App` component).
- One primary export per file: each file should export its main component or hook as the default or named export.
- Always export types and interfaces as named exports alongside their related code.

## 3. Path Aliases

- Defined in `tsconfig.json` and Vite config:
  - `@/*` → `src/*`
  - `~/*` → project root

## 4. Routing

- Uses `react-router-dom` v6 with `createBrowserRouter` in `routes.tsx`.
- Wrap top-level routes in `<AuthProvider>` and `<Layout>`.
- Define nested `children` routes for pages.
- Protect sensitive routes via a `<ProtectedRoute>` component guard.

## 5. State Management

### Contexts

- **AuthContext**:
  - Manages JWT token via `tokenService`, decodes payload for admin flag.
  - Exposes `useAuth()` hook returning `{ user, isAuthenticated, loginWithGoogle, logout, isAdmin, isLoading }`.

- **ThemeContext**:
  - Persists `light`/`dark` in `localStorage`.
  - Sets `data-theme` attribute or `.dark` class on `<body>`.
  - Provides `useTheme()` hook for toggling.

### React Query

- Initialize a single `QueryClient` in `App.tsx` with defaults:
  ```js
  const queryClient = new QueryClient({
    defaultOptions: { queries: { refetchOnWindowFocus: false, retry: false } }
  });
  ```
- Wrap application in `<QueryClientProvider>` and `<ReactQueryDevtools>`.
- Use generated hooks (`useXxxQuery`, `useXxxMutation`) from `openapi/queries/queries`.
- Use query-key helpers from `openapi/queries/common.ts` for invalidation.

### URL Query Parameters

We use `useSearchParams` from `react-router-dom` to reflect UI state in the URL, enabling deep-linking, browser history integration, and shareable/bookmarkable links without additional synchronization logic.

**Key patterns:**

- **Destructure hook:**
  ```tsx
  const [searchParams, setSearchParams] = useSearchParams();
  ```

- **Read values:**
  ```tsx
  // Single value with default
  const page = searchParams.get('page')
    ? Number(searchParams.get('page'))
    : 1;
  
  // String value with fallback
  const filter = searchParams.get('filter') || 'all';

  // List of values as comma-separated
  const selectedIds = searchParams.get('ids')
    ?.split(',')
    || [];
  ```

- **Clone & update:**
  ```tsx
  const params = new URLSearchParams(searchParams);
  params.set('page', newPage.toString());
  params.set('filter', selectedFilter);
  // Remove a param
  params.delete('view');
  setSearchParams(params);
  ```
  Or batch updates:
  ```tsx
  setSearchParams({ page: '2', filter: 'active' });
  ```

- **Custom hook abstraction:**
  Encapsulate param logic in a reusable hook, e.g.: 
  ```ts
  function useQueryParam<T>(key: string, defaultValue: T) {
    const [searchParams, setSearchParams] = useSearchParams();
    const value = searchParams.get(key) ?? defaultValue;
    const setValue = (newVal: T) => {
      const params = new URLSearchParams(searchParams);
      params.set(key, String(newVal));
      setSearchParams(params);
    };
    return [value, setValue] as const;
  }
  ```

**Benefits:**

- State is encoded in the URL—no extra context or prop drilling required.
- Native browser navigation (Back/Forward) works seamlessly.
- Enables direct sharing and bookmarking of application state.
- Simplifies synchronization across components without global stores.

## 6. API Client & Data Fetching

- **OpenAPI codegen** splits client under:
  - `openapi/requests/` – raw API service functions, types, schemas
  - `openapi/queries/` – React Query hooks, key factories, suspense/prefetch support
- HTTP calls via `CancelablePromise` and core `OpenAPI` settings.
- Custom `useMutationErrorHandler` hook for standardized toast on success/error.

## 7. Styling & Theming

- **Tailwind CSS**:
  - Imported globally in `src/styles/globals.css` via `@import "tailwindcss"`.
  - Global CSS variables defined under `:root` and overridden in `.dark` / `[data-theme="dark"]`.
  - Responsive font sizes via media queries.
- **Utility classes**:
  - Use `class-variance-authority (cva)` to define variant/style props on components.
  - `cn()` utility wraps `clsx()` + `twMerge()` to merge and dedupe Tailwind classes.

## 8. UI Components

- **Atomic UI** under `src/components/ui`:
  - `Button`, `Input`, `Select`, `Tabs`, `Checkbox`, `Switch`, `Tooltip`, `Card`, etc.
  - Each exposes variant and size props for consistency.

- **Feature & layout components**:
  - `Layout`, `ProtectedRoute`, `Portal`, `Modal`, `Sidebar`, `Header`, `Footer`, etc.
  - Compose atomic UI blocks plus business logic.

## 9. Custom Hooks & Utilities

- Located in `src/utils/hooks`:
  - `useHotkey`, `useMinimumLoading`, `useChatSender`, `useMutationErrorHandler`, etc.
- API helper in `src/utils/apiUtils`: `useFilteredAiModels`, streaming helpers, type definitions.
- General utilities in `src/utils/generalUtils.ts`: `cn()` for class merging.

## 10. Assets & Icons

- SVG icons imported as React components via `vite-plugin-svgr`.
- Custom SVG icons under `src/assets/icons/`.
- General icons via `lucide-react`.

## 11. Animation & UX

- Use `framer-motion` (`motion`, `AnimatePresence`, `LayoutGroup`) for UI transitions.
- Use `sonner` package for toast notifications (`<Toaster>`, `toast`).

## 12. File Upload & Preview

Input and file upload components may support selecting multiple files (with configurable limits) and rendering previews.
Text inputs (e.g., textareas) can auto-resize based on content and reset on submission.

## 13. Configuration & Tooling

- **Vite (`vite.config.mts`)**:
  - Plugins: `@vitejs/plugin-react`, `@tailwindcss/vite`, `vite-plugin-svgr`.
  - Path aliases, dev server configs.

- **TypeScript (`tsconfig.json`)**:
  - Strict settings, noEmit, path aliases in `compilerOptions`.

- **Lint & formatter**:
  - `biome.json` for linting rules.
  - `.npmrc`, `components.json` for workspace tooling.

- **Docker**:
  - `Dockerfile` and `docker-compose.yml` for containerization.

## 14. Environment Variables

- Prefix all client globals with `VITE_`.
- Access via `import.meta.env.VITE_<KEY>`.

## 15. Third-Party Libraries

- Core: `react`, `react-dom`, `react-router-dom`
- Data & auth: `@tanstack/react-query`, `@react-oauth/google`
- Styling: `tailwindcss`, `class-variance-authority`, `clsx`, `tailwind-merge`
- Icons & animation: `lucide-react`, `framer-motion`, `vite-plugin-svgr`
- Notifications: `sonner`

---

*Document up-to-date as of code review on branch `t4-competition`.* 