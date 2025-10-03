# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**PharmaManage** is a pharmacy management system built with React, TypeScript, Vite, and shadcn/ui components. The application features role-based access (Admin/Cashier), inventory management, billing, and dashboard analytics.

## Commands

### Development
```bash
npm run dev          # Start Vite dev server
npm run build        # TypeScript check + production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Build Process
- TypeScript compilation: `tsc -b` (uses incremental builds with tsbuildinfo)
- Output directory: `dist/public`
- Build includes type checking before bundling

## Architecture

### Application Structure

**Frontend-Only Application**: Currently a client-side React SPA. No backend server, shared schemas, or database layer exists yet (references in configs are legacy/placeholder).

**Entry Point**: `src/main.tsx` → renders `src/App.tsx`

**Routing**: Uses `wouter` for client-side routing
- Routes defined in `App.tsx` Router component
- Main routes: `/` (Dashboard), `/inventory`, `/billing`, `/settings`

**State Management**:
- React Query (`@tanstack/react-query`) for data fetching/caching
- Query client configured in `src/lib/queryClient.ts` with custom fetch wrapper
- Local state with React hooks (e.g., authentication in App.tsx)

**Authentication**:
- Simplified client-side state (`isAuthenticated`, `userRole`)
- Login component (`src/pages/Login.tsx`) controls access
- No real auth backend integration yet

### Component Organization

**Pages** (`src/pages/`): Top-level route components
- `Dashboard.tsx` - Main dashboard with metrics and alerts
- `Inventory.tsx` - Medicine inventory management
- `Billing.tsx` - POS billing interface
- `Settings.tsx` - Application settings
- `Login.tsx` - Login page

**Feature Components** (`src/components/`):
- `AppSidebar.tsx` - Main navigation sidebar
- `DashboardCard.tsx` - Metric display cards
- `AlertCard.tsx` - Status alert cards
- `MedicineTable.tsx` - Inventory table with actions
- `AddMedicineDialog.tsx` - Medicine creation/edit dialog
- `BillingCart.tsx` - Shopping cart for billing
- `ProductSearch.tsx` - Medicine search for billing
- `ThemeProvider.tsx` / `ThemeToggle.tsx` - Dark mode support

**UI Components** (`src/components/ui/`): shadcn/ui primitives (40+ components)
- Built on Radix UI primitives
- Styled with Tailwind CSS
- Configured via `components.json` (New York style, neutral base color)

**Examples** (`src/components/examples/`): Reference implementations

**Hooks** (`src/hooks/`):
- `use-mobile.tsx` - Responsive breakpoint detection
- `use-toast.ts` - Toast notification hook

**Utilities** (`src/lib/`):
- `queryClient.ts` - React Query configuration with custom fetch handling
- `utils.ts` - Tailwind class merging utilities

### Styling System

**Framework**: Tailwind CSS v3 + shadcn/ui
- Config: `tailwind.config.ts`
- CSS Variables for theming (light/dark mode)
- Design system documented in `design_guidelines.md`

**Design Principles** (from design_guidelines.md):
- Material Design-inspired for healthcare/utility context
- Color palette: Medical blue primary (219 95% 50%), status colors (green/amber/red)
- Typography: Inter font, tabular numerals for data
- Spacing: Consistent 2-8-16 scale
- Components: Elevated cards, zebra tables, toast notifications
- Responsive: Desktop sidebar → tablet collapsible → mobile bottom nav

### Path Aliases

Configured in `vite.config.ts` and `tsconfig.json`:
- `@/*` → `src/*`
- `@shared/*` → `shared/*` (placeholder, directory doesn't exist)
- `@assets/*` → `attached_assets/*`

### Theme System

- `next-themes` for dark mode
- CSS variables in `src/index.css` for color tokens
- ThemeProvider wraps entire app
- ThemeToggle in header for user control

### Data Fetching Pattern

```typescript
// Standard pattern from queryClient.ts
const { data } = useQuery({
  queryKey: ['/api/endpoint'],
  // queryFn automatically constructs fetch from queryKey
});

// Custom fetch wrapper with credentials
apiRequest('POST', '/api/endpoint', { data });
```

## Important Notes

- **No Backend**: Despite references to `server/`, `shared/`, and `drizzle.config.ts` in some files, these directories don't exist. The app is currently frontend-only.
- **Git Status**: Large number of deleted files in working tree from previous structure - likely migrating from client/server monorepo to frontend-only.
- **shadcn/ui**: When adding new shadcn components, they go in `src/components/ui/` following New York style.
- **Role-Based UI**: Components should respect `userRole` for conditional rendering (admin vs cashier views).
- **Design System**: Refer to `design_guidelines.md` for color palette, typography, spacing, and component patterns.
