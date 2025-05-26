# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Buff is an Amazon FBA optimization platform built with Next.js 15, React 19, and TypeScript. It provides AI-powered optimization tools for Amazon sellers including bid optimization, campaign management, and performance analytics.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

## Architecture & Key Patterns

### Tech Stack
- **Next.js 15.2.4** with App Router
- **React 19** with TypeScript 5
- **Supabase** for authentication and backend
- **shadcn/ui** components (Radix UI + Tailwind CSS)
- **Tailwind CSS** for styling
- **React Hook Form + Zod** for forms
- **Recharts** for data visualization

### Project Structure
- `/app` - Next.js App Router pages
- `/components` - React components organized by feature
- `/components/ui` - shadcn/ui components
- `/contexts` - React contexts (AuthContext for authentication)
- `/lib` - Utilities, API clients, and mock data
- `/hooks` - Custom React hooks

### Key Implementation Patterns

1. **Authentication Flow**
   - Supabase-based auth with AuthContext wrapper
   - Protected routes use AuthGuard component
   - Password reset flow with email recovery

2. **API Integration**
   - Mock data pattern in `/lib/mock-*.ts` for development
   - API abstraction layer in `/lib/api/` and `/lib/bid-optimizer-api.ts`
   - Supabase client configured in `/lib/supabase.ts`

3. **Component Architecture**
   - Feature-based organization (e.g., `/components/bid-optimizer/`)
   - Reusable UI components from shadcn/ui
   - Form components use React Hook Form with Zod validation

4. **Styling**
   - Tailwind CSS with custom theme extensions
   - CSS variables for theme colors in globals.css
   - Component variants using class-variance-authority

## Important Configuration

- **TypeScript**: Path alias `@/*` maps to root directory
- **Next.js**: ESLint/TypeScript errors ignored in production builds, React strict mode disabled
- **Tailwind**: Extended theme with custom colors and animations

## Current Development State

The project has uncommitted changes in:
- Bid optimizer functionality
- Campaign table components
- Performance chart fallbacks
- Filter system implementation

Note: No test framework is currently configured. Consider adding Vitest or Jest for unit testing.