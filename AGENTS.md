# React TypeScript Project Coding Standards

## **File Structure & Organization Rules**

### Directory Structure

```
src/
├── pages/[PageName]/[PageName].tsx
├── components/[ComponentName]/[ComponentName].tsx
├── api/
├── utils/
│   ├── hooks.ts
│   ├── utils.ts
│   ├── consts.ts
│   └── types/
└── assets/
    ├── images/
    ├── icons/
    └── fonts/
```

### File Naming Rules

- **MUST** use **PascalCase** for component files: `ResultsPage.tsx`, `BigTextWithSmallText.tsx`
- **MUST** use **camelCase** for utility files: `api.ts`, `utils.ts`, `consts.ts`
- **MUST** use **kebab-case** for configuration files: `tailwind.config.js`, `postcss.config.js`
- **MUST** match directory name with main component file name

## **React & TypeScript Rules**

### Component Definition Pattern

```typescript
// ✅ REQUIRED: Use this exact pattern
const ComponentName: FC = () => {
  // Component logic here
};

export default ComponentName;
```

### Props Interface Rules

- **MUST** prefix interfaces with `I`: `interface IComponentProps`
- **MUST** use descriptive names for props
- **MUST** mark optional props with `?`
- **SHOULD** define props interface above component

```typescript
// ✅ Good
interface IBigTextWithSmallText {
  bigText: string;
  smallText: string;
  className?: string;
}

const BigTextWithSmallText: FC<IBigTextWithSmallText> = ({
  bigText,
  smallText,
  className,
}) => {
  // Component implementation
};
```

### Import Organization Rules

**MUST** follow this exact order:

1. External libraries (React, Material-UI, etc.)
2. Internal API hooks
3. Internal components
4. Assets (images, icons)
5. Utils, constants, types
6. Custom hooks

```typescript
// ✅ Example import order
import { FC } from "react";
import { useSearchParams } from "react-router-dom";
import { useFetchResultsFromUrl, useGetTechLandscape } from "@/api/api";
import BigTextWithSmallText from "@/components/BigTextWithSmallText/BigTextWithSmallText";
import Logo from "@/assets/images/BlueFootLogo-blue.png";
import { ACCESS_TOKEN_KEY, SEARCH_TERM_URL_PARAM } from "@/utils/consts";
import { cn, renderPlurals } from "@/utils/utils";
import { useApplyFilters } from "@/utils/hooks";
```

## **State Management & Data Fetching Rules**

### API Hooks Pattern

- **MUST** use `use` prefix for custom hooks: `useFetchResultsFromUrl`, `useGetTechLandscape`
- **MUST** destructure with descriptive aliasing when needed: `{ data: userProfile }`
- **SHOULD** use RTK Query generated hooks for API calls or Tanstack Query generated hooks, if you're not using Redux in the project

```typescript
// ✅ Good
const { data: userProfile } = useGetUserProfile();
const {
  data: techLandscapeData,
  isFetching,
  isLoading,
} = useGetTechLandscape();
```

### URL State Management Rules

- **MUST** use `useSearchParams` for URL state
- **MUST** decode URL parameters: `decodeURIComponent(searchTerm || "")`
- **MUST** use constants for URL parameter names

```typescript
// ✅ Required pattern
const [searchParams] = useSearchParams();
const searchTerm = searchParams.get(SEARCH_TERM_URL_PARAM);
const decodedUrlSearchTerm = decodeURIComponent(searchTerm || "");
```

### Loading States Rules

- **MUST** check multiple loading states: `isLoading`, `isFetching`, `isResultsLoading`
- **MUST** use early returns for loading states
- **MUST** provide consistent loading UI

```typescript
// ✅ Required pattern
if (isLoading || (isFetching && !data) || isResultsLoading || !resultsData) {
  return (
    <div className="flex h-[80dvh] grow cursor-wait flex-col items-center justify-center gap-10">
      <Footprint />
      <p className="body2Medium">Loading message...</p>
    </div>
  );
}
```

## **Constants & Configuration Rules**

### Constant Naming Rules

- **MUST** use **SCREAMING_SNAKE_CASE** for constants
- **MUST** group related constants in `/src/utils/consts.ts`
- **MUST** use descriptive names

```typescript
// ✅ Required pattern
export const ACCESS_TOKEN_KEY = "access_token";
export const SEARCH_TERM_URL_PARAM = "searchTerm";
export const RESULTS_PAGE_PATH = "/results";
export const ENTITY_PAGE_SIZE = 25;
```

### Configuration Objects Rules

- **MUST** use descriptive object names
- **SHOULD** use nested structure for complex configurations
- **MUST** export as const

```typescript
// ✅ Good
export const STATIC_FILTER_PARAMS = {
  exact_ucid: "None",
  filter: {
    entity_type_filter: { buckets: [] },
    founding_year_filter: { buckets: [] },
  },
  results_per_page: ENTITY_PAGE_SIZE,
} as const;
```

## **Styling Rules**

### Tailwind CSS Rules

- **MUST** use responsive prefixes: `max-md:`, `md:`, `lg:`
- **MUST** use state modifiers: `hover:`, `focus:`, `disabled:`
- **SHOULD** follow utility-first approach
- **MUST** use custom typography classes: `.heading1`, `.body1`, etc.

### Conditional Styling Pattern

```typescript
// ✅ Required pattern using cn utility
className={cn(
  "base-classes",
  {
    "conditional-class": condition,
    "another-class": anotherCondition,
  },
  className
)}
```

### Color Palette Rules

- **MUST** use custom color variables: `text-blueFoot-lightBlue`
- **SHOULD** use semantic colors: `text-gray-500`, `border-gray1`
- **MUST** follow consistent color naming: `text-graph-blue`, `text-graph-green`

## **Event Handling & Navigation Rules**

### Navigation Pattern

```typescript
// ✅ Required pattern
const navigate = useNavigate();

const handleNavigation = () => {
  navigate({
    pathname: RESULTS_PAGE_PATH,
    search: searchParams.toString(),
  });
};
```

### Event Handler Rules

- **MUST** use descriptive names: `onFilterChange`, `onBarClick`, `onCellClick`
- **SHOULD** use consistent parameter patterns
- **MUST** handle edge cases and null checks

### Filter Application Rules

- **MUST** use URL-based state management for filters
- **MUST** debounce filter changes
- **MUST** use comma delimiter for multiple filter values
- **MUST** reset pagination when filters change

## **Data Processing & Utilities Rules**

### Utility Function Rules

- **MUST** use **camelCase** naming: `renderPlurals`, `addNumericalSuffix`
- **MUST** create pure functions for data transformation
- **SHOULD** provide type definitions for complex utilities

```typescript
// ✅ Good utility function
export const renderPlurals = (
  count: number,
  singular: string,
  plural: string,
): string => {
  return count === 1 ? singular : plural;
};
```

### Data Formatting Rules

- **MUST** use `.toLocaleString()` for number formatting
- **SHOULD** use `Intl.NumberFormat` for complex formatting
- **MUST** handle pluralization consistently

```typescript
// ✅ Required patterns
const formattedNumber = value.toLocaleString();
const pluralText = renderPlurals(count, "entity", "entities");
```

### API Response Handling Rules

- **MUST** use optional chaining: `data?.property?.nestedProperty`
- **MUST** provide fallbacks: `value || ""`
- **MUST** use early returns for null checks

```typescript
// ✅ Required pattern
const techLandscape = techLandscapeData?.tech_landscape?.tech_landscape;
if (!techLandscape) return null;
```

## **Component Patterns Rules**

### Conditional Rendering Rules

```typescript
// ✅ Preferred patterns
{condition && <Component />}
{!condition ? <LoadingComponent /> : <MainComponent />}
{items.length > 0 && (
  <div>
    {items.map(item => <Item key={item.id} {...item} />)}
  </div>
)}
```

### Loading States Rules

- **MUST** use consistent loading components: `<Footprint />`, `<LoadingOverlay />`
- **SHOULD** use skeleton loading for specific elements: `<Skeleton className="h-7 w-10" />`
- **MUST** provide meaningful loading messages

### Error Boundaries & Fallbacks Rules

- **MUST** provide graceful fallbacks for missing data
- **MUST** handle empty states with descriptive messages
- **SHOULD** use consistent error UI patterns

## **Accessibility & UX Rules**

### Data Attributes Rules

- **MUST** use `data-e2e` for testing selectors
- **MUST** use semantic HTML elements
- **MUST** provide proper `alt` texts for images
- **MUST** use proper labeling for form elements

```typescript
// ✅ Required patterns
<button data-e2e="closeButton" onClick={handleClose}>
<img src={logo} alt="Company Logo" />
<label htmlFor="email">Email</label>
```

### Responsive Design Rules

- **MUST** use mobile-first responsive classes
- **MUST** test on common breakpoints: `max-md:`, `md:`, `lg:`
- **SHOULD** provide different layouts for mobile: `max-md:flex-col`

## **Asset Management Rules**

### Image Import Rules

```typescript
// ✅ Required patterns
import Logo from "@/assets/images/BlueFootLogo-blue.png";
import BlueFooted from "@/assets/images/galapagos-bird.svg";
```

### Icon Usage Rules

- **SHOULD** use Material-UI icons with descriptive imports
- **MAY** use SVG imports with React component format: `import FilterSvg from "@/assets/icons/filter.svg?react"`
- **MUST** provide consistent icon sizing

## **Type Safety & Validation Rules**

### Type Definition Rules

- **MUST** centralize types in `/src/utils/types/`
- **MUST** use `interface` prefix with `I`
- **SHOULD** use generic types where appropriate
- **MUST** avoid `any` type

### Optional Chaining Rules

- **MUST** use optional chaining extensively: `company?.profile?.name`
- **MUST** provide safe fallbacks: `value || defaultValue`
- **SHOULD** use nullish coalescing: `value ?? defaultValue`

## **Performance Optimization Rules**

### Memoization Rules

- **SHOULD** use `useCallback` for event handlers with dependencies
- **SHOULD** use `useMemo` for expensive calculations
- **MUST** include proper dependency arrays

```typescript
// ✅ Good
const handleClick = useCallback(
  (id: string) => {
    // Handler logic
  },
  [dependency],
);
```

### API Optimization Rules

- **MUST** use `skip` parameters in RTK Query hooks when appropriate
- **SHOULD** implement dependent API calls based on conditions
- **MUST** debounce frequent API calls

```typescript
// ✅ Good
const { data } = useApiHook(params, {
  skip: !condition || !requiredData,
});
```

## **Internationalization Rules**

### Text Management Rules

- **MUST** centralize text in `/src/i18n/en.ts`
- **MUST** use object-based structure: `en.applyFilters`
- **SHOULD** use descriptive keys for text values

```typescript
// ✅ Required pattern
const en = {
  applyFilters: "Apply Filters",
  entityType: "Entity Type",
  filters: "Filters",
  reset: "Clear",
};
```

## **Testing & Quality Rules**

### Data Attributes for Testing

- **MUST** add `data-e2e` attributes to interactive elements
- **MUST** use descriptive test selectors
- **SHOULD** avoid using CSS classes for testing

### Code Quality Rules

- **MUST** use TypeScript strict mode
- **MUST** follow ESLint and Prettier configurations
- **SHOULD** write meaningful commit messages
- **MUST** avoid console.log in production code

## **Documentation Rules**

### Code Comments Rules

- **SHOULD** add comments for complex business logic
- **MUST** document utility functions with JSDoc
- **SHOULD** explain non-obvious code patterns

### README Requirements

- **MUST** include setup instructions
- **MUST** document available scripts
- **SHOULD** include project structure overview
- **SHOULD** document environment variables

---

## **Enforcement**

These standards are **MANDATORY** for all new development. Existing code should be gradually refactored to follow these patterns during feature updates or bug fixes.

### Priority Levels:

- **MUST** = Required, no exceptions
- **SHOULD** = Strongly recommended, exceptions need justification
- **MAY** = Optional, use when appropriate
