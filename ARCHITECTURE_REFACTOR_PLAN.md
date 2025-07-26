# E-commerce Architecture Refactor Plan

## Current Problems (Root Causes)
1. **No Layout System** - Every page manually manages Header/Footer positioning
2. **CSS Architecture Failure** - Conflicting design tokens, inconsistent spacing
3. **Context Hell** - Overused contexts with mixed responsibilities  
4. **Missing Abstractions** - Copy-paste code for common patterns
5. **Type Fragmentation** - Same entities typed differently across files
6. **Business Logic in UI** - Components handling too many concerns

## Solution Architecture

### 1. **Centralized Layout System**
```
src/
├── layouts/
│   ├── RootLayout.tsx           # Main app wrapper
│   ├── PageLayout.tsx           # Standard page layout
│   ├── AuthLayout.tsx           # Auth pages layout
│   └── CheckoutLayout.tsx       # Multi-step checkout layout
```

**Pattern:**
- Every page uses ONE layout wrapper
- Layouts handle Header/Footer positioning automatically
- Consistent spacing using design tokens
- No more manual Header/Footer imports

### 2. **Design System Foundation**
```
src/
├── design-system/
│   ├── tokens/
│   │   ├── colors.ts
│   │   ├── spacing.ts
│   │   ├── typography.ts
│   │   └── breakpoints.ts
│   ├── components/
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Modal/
│   │   └── Layout/
│   └── utils/
│       ├── cn.ts              # className utility
│       └── responsive.ts     # Breakpoint utilities
```

**Benefits:**
- Single source of truth for all styling
- Consistent components across the app
- Easy theme switching/customization
- Prevents style conflicts

### 3. **Proper State Management Architecture**
```
src/
├── stores/
│   ├── auth.store.ts           # Zustand for auth state
│   ├── cart.store.ts           # Local cart management
│   └── ui.store.ts             # UI state (modals, etc.)
├── queries/
│   ├── products.queries.ts     # React Query for server state
│   ├── auth.queries.ts
│   └── orders.queries.ts
└── contexts/
    └── theme.context.tsx       # Only for theme/locale
```

**Strategy:**
- **Replace Context Hell** with Zustand for client state
- **React Query** handles ALL server state
- **Contexts only for** theme, locale, providers
- **Clear separation** between server and client state

### 4. **Component Abstraction Layers**
```
src/
├── components/
│   ├── ui/                     # Reusable UI primitives
│   │   ├── Button/
│   │   ├── Modal/
│   │   ├── Form/
│   │   └── Layout/
│   ├── features/               # Business logic components
│   │   ├── auth/
│   │   ├── cart/
│   │   ├── product/
│   │   └── checkout/
│   └── pages/                  # Page-specific compositions
│       ├── HomePage/
│       ├── ShopPage/
│       └── ProductPage/
```

### 5. **Type System Unification**
```
src/
├── types/
│   ├── entities/              # Core business entities
│   │   ├── user.types.ts
│   │   ├── product.types.ts
│   │   ├── order.types.ts
│   │   └── cart.types.ts
│   ├── api/                   # API response types
│   │   ├── auth.api.ts
│   │   └── products.api.ts
│   └── ui/                    # Component prop types
│       ├── layout.types.ts
│       └── form.types.ts
```

## Implementation Strategy (Phased Approach)

### Phase 1: Foundation (Week 1-2)
1. **Create Layout System**
   - Build PageLayout component
   - Migrate 2-3 pages to new layout
   - Fix header overlap permanently

2. **Design System Setup**
   - Extract design tokens from existing CSS
   - Create Button, Input, Modal primitives
   - Migrate key components

### Phase 2: State Management (Week 3)
1. **Replace Auth Context** with Zustand store
2. **Replace Cart Context** with Zustand store  
3. **Centralize API calls** with React Query
4. **Remove localStorage abuse**

### Phase 3: Component Architecture (Week 4)
1. **Extract reusable patterns** into ui/ components
2. **Move business logic** out of UI components
3. **Create feature-specific components**
4. **Unify type definitions**

### Phase 4: Performance & Polish (Week 5)
1. **Remove unnecessary re-renders**
2. **Optimize bundle size**
3. **Add error boundaries**
4. **Improve loading states**

## Success Metrics

### Before vs After:
- **Adding new page**: 15 minutes (copy layout pattern)
- **Styling consistency**: Single design system source
- **Header positioning**: Zero manual positioning code
- **State management**: Predictable, debuggable state flow
- **Component reuse**: 80% of UI from shared components
- **Type safety**: 100% consistent entity types
- **Developer onboarding**: 1 day to understand architecture

## Migration Strategy

### 1. **Non-Breaking Changes First**
- Add new layout system alongside existing
- Create design system components
- Set up new state stores

### 2. **Page-by-Page Migration**
```typescript
// Before (current chaos):
export default function ShopPage() {
  return (
    <div className="min-h-screen">
      <Header isHome={false} />
      <main className="pt-32">...</main>
      <Footer isHome={false} />
    </div>
  );
}

// After (clean architecture):
export default function ShopPage() {
  return (
    <PageLayout>
      <ShopContent />
    </PageLayout>
  );
}
```

### 3. **Gradual State Migration**
- Keep old contexts during transition
- Migrate one feature at a time
- Remove old patterns after verification

## Architecture Benefits

### Developer Experience:
✅ **Predictable patterns** - Every page follows same structure  
✅ **Fast development** - Reusable components for everything  
✅ **Easy debugging** - Clear state management and data flow  
✅ **Simple onboarding** - Consistent architecture across app  

### Maintainability:
✅ **DRY principle** - No more copy-paste code  
✅ **Single responsibility** - Components do one thing well  
✅ **Type safety** - Consistent types across the app  
✅ **Testability** - Separated concerns enable proper testing  

### Performance:
✅ **Reduced re-renders** - Proper state management  
✅ **Smaller bundles** - Shared components and proper code splitting  
✅ **Better UX** - Consistent loading states and error handling  

---

## Next Steps

1. **Get approval** for architectural approach
2. **Start with layout system** (immediate impact on header issues)
3. **Parallel work** on design system setup
4. **Gradual migration** of existing pages
5. **Team training** on new patterns

This architecture will transform the codebase from a maintenance nightmare into a scalable, developer-friendly platform that can grow with the business.