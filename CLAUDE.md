# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- `npm run dev` - Start development server on port 3001
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checks
- `npm run postbuild` - Generate sitemap (runs automatically after build)

### Package Management
- Uses `yarn@4.7.0` as package manager (configured in package.json)
- `npm install` works but yarn is preferred for consistency

## Project Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **React**: v19 
- **TypeScript**: Strict mode disabled but types are enforced
- **Styling**: Tailwind CSS v4 + custom CSS modules
- **State Management**: React Context (AuthContext, CartContext)
- **HTTP Client**: Custom httpClient with retry logic and interceptors
- **Authentication**: JWT tokens stored in cookies
- **Images**: Cloudinary integration with Next.js Image optimization disabled
- **Animations**: Framer Motion

### Directory Structure
```
src/
├── app/                    # Next.js App Router pages
├── components/             # Reusable components
│   ├── features/          # Feature-specific components
│   ├── layout/            # Layout components (Header, Footer)
│   └── ui/                # Base UI components
├── contexts/              # React Context providers
├── lib/                   # Services and utilities
│   ├── services/api/      # API service layer
│   ├── hooks/             # Custom React hooks
│   └── utils/             # Utility functions
├── config/                # Configuration files
├── types/                 # TypeScript type definitions
└── styles/                # CSS files
```

### Key Architecture Patterns

#### API Layer
- **httpClient**: Centralized HTTP client with auth interceptors at `src/lib/services/api/httpClient.ts`
- **Services**: Feature-specific services (authService, productService, lookbookService)
- **Environment**: API base URL configured via `NEXT_PUBLIC_API_BASE_URL` env var
- **Error Handling**: Automatic retry logic with exponential backoff

#### Authentication System
- **AuthContext**: Centralized auth state management
- **JWT Tokens**: Stored in HTTP-only cookies with expiration checking
- **Route Protection**: HOCs `withAuth` and `withAdminAuth` for client-side protection
- **Auto-refresh**: Token validation on app initialization

#### State Management
- **AuthContext**: User authentication and session management
- **CartContext**: Shopping cart state (referenced in components)
- **React Query**: Used with @tanstack/react-query for server state

#### Image Handling
- **Cloudinary**: External image optimization and CDN
- **Next.js Images**: Optimization disabled (`unoptimized: true`) since Cloudinary handles it
- **Responsive**: Configured device sizes and image sizes for responsive loading

### Configuration Files

#### TypeScript
- **Strict mode**: Disabled (`"strict": false`) but types are still enforced
- **Path aliases**: `@/*` maps to `./src/*`, `@/public/*` maps to `./public/*`
- **Target**: ES2017 for broad browser compatibility

#### Next.js
- **Port**: Development server runs on port 3001
- **API Rewrites**: `/api/*` routes proxy to backend API
- **Security Headers**: CSP, XSS protection, frame options configured
- **Image Domains**: Cloudinary domains whitelisted

#### Tailwind
- **Version**: v4 with extended height utilities and custom colors
- **Content**: Scans all relevant directories for classes

## Important Notes

### Development Workflow
1. Always run linting after making changes: `npm run lint`
2. TypeScript errors may exist but builds are allowed (temporary config)
3. Test locally on port 3001 to avoid conflicts

### Authentication Flow
- Login sets JWT token in cookies and redirects to `/?skipIntro=true`
- All API requests automatically include auth headers via httpClient
- Admin routes require both authentication and admin role

### API Integration
- Backend API URL configurable via environment variables
- Default local API: `http://localhost:3000`
- All API calls go through the centralized httpClient
- Automatic error handling with toast notifications

### Known Issues
- Some TypeScript errors exist but are not blocking builds
- `react-toastify` dependency referenced in docs as pending
- Backend "Forgot Password" endpoint not implemented yet

### Code Conventions
- React 19 features are available (concurrent features, new hooks)
- Functional components with hooks preferred
- TypeScript interfaces defined in `src/types/`
- CSS modules used alongside Tailwind for component-specific styles
- Error boundaries not yet implemented (noted as future enhancement)