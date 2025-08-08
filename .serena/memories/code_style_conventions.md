# Code Style and Conventions

## TypeScript Configuration
- **Strict Mode**: Enabled (`"strict": true` in tsconfig.json)
- **Target**: ES5
- **Module**: ESNext with bundler resolution
- **JSX**: Preserve mode for Next.js
- **Path Aliases**: Use `@/*` for imports from project root

## React/Next.js Patterns
- **Framework**: Next.js 14.1.0 with App Router
- **Components**: Functional components with TypeScript interfaces/types
- **File Naming**: 
  - Components: PascalCase (e.g., `CalendarView.tsx`)
  - Pages: lowercase (e.g., `page.tsx`, `layout.tsx`)
  - Utilities: camelCase (e.g., `mockData.ts`)

## Code Organization
- **Components**: All React components in `/components` directory
- **Types**: Centralized in `/types/index.ts`
- **Contexts**: React contexts in `/contexts` directory
- **API Routes**: Under `/app/api` following Next.js App Router convention
- **Utilities**: Helper functions and mock data in `/lib` directory

## Styling
- **Tailwind CSS**: Primary styling method using utility classes
- **No CSS Modules**: Use Tailwind utilities directly
- **Custom Styles**: Minimize custom CSS, prefer Tailwind utilities

## Import Order (Recommended)
1. React/Next.js imports
2. Third-party library imports (e.g., date-fns)
3. Local component imports
4. Type imports
5. Utility/helper imports
6. Style imports

## Component Structure Pattern
```typescript
interface ComponentNameProps {
  // Props definition
}

export default function ComponentName({ prop1, prop2 }: ComponentNameProps) {
  // Component logic
  return (
    // JSX
  );
}
```

## State Management
- **Contexts**: Use React Context for global state (e.g., AuthContext)
- **Local State**: useState hooks for component-level state
- **Server Components**: Leverage Next.js server components where possible

## Best Practices
- Always define TypeScript types/interfaces for props
- Use meaningful variable and function names
- Keep components focused and single-purpose
- Prefer composition over inheritance
- Use date-fns for date manipulation
- Follow Next.js App Router conventions

## Things to Avoid
- Don't use `any` type (strict mode enforced)
- Avoid inline styles when Tailwind classes are available
- Don't mix Pages Router patterns with App Router
- Avoid direct DOM manipulation

## Future Improvements Suggested
- Add Prettier for consistent formatting
- Implement ESLint rules for code consistency
- Add pre-commit hooks with Husky
- Configure Jest for testing
- Add JSDoc comments for complex functions