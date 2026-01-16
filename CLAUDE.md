# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run start` - Start production server (requires build)
- `npm run lint` - Run ESLint with Next.js TypeScript config
- `npx tsc --noEmit` - Run TypeScript type checking (not in package.json)

### Testing
- No automated test runner configured
- Manual testing required for UI changes

## Architecture Overview

This is a **Sofa Style Visualizer** application that allows users to upload photos of sofas and visualize how they would look with different fabric covers using AI-powered image generation.

### Key Technologies
- **Next.js 16** with App Router and React 19
- **TypeScript** with strict mode enabled
- **Tailwind CSS v4** with CSS variables for design tokens
- **Google Gemini AI** (gemini-3-pro-image-preview) for image generation
- **Cloudinary** for image storage and delivery
- **Vercel KV** (Upstash Redis) for data persistence and rate limiting
- **NextAuth.js** for admin authentication

### Application Flow
1. **Upload**: User uploads sofa photo → uploaded to Cloudinary
2. **Selection**: User chooses from predefined fabric options stored in KV
3. **Generation**: AI combines sofa image + fabric reference → creates visualization
4. **Result**: Side-by-side comparison with save-to-gallery option

### Data Architecture
- **Fabrics**: Stored in Vercel KV with categories (cotton, velvet, linen, leather, etc.)
- **Rate Limiting**: Cookie-based user tracking with daily generation limits
- **Gallery**: Per-user saved generations with metadata
- **Admin**: Protected fabric management interface

### Key Directories
- `app/` - Next.js App Router (pages, API routes, layouts)
- `components/` - Organized by domain (ui, fabrics, gallery, visualizer, etc.)
- `hooks/` - Client-side data fetching and state management
- `lib/` - Server utilities (ai, db, storage, auth)
- `types/` - Shared TypeScript type definitions

### Critical Integrations
- **AI Generation**: `lib/ai/gemini.ts` handles Google Gemini API calls with aspect ratio detection
- **Image Storage**: `lib/storage/cloudinary.ts` manages uploads and transformations
- **Database**: `lib/db/kv.ts` provides Redis operations for fabrics, rate limits, and gallery
- **Rate Limiting**: `lib/db/rateLimit.ts` implements cookie-based user tracking

### Authentication & Security
- Admin routes protected by NextAuth.js middleware (`middleware.ts`)
- Rate limiting prevents abuse of AI generation API
- Environment variables for all API keys and secrets
- No user authentication required for main visualization flow

## Development Patterns

### Component Structure
- UI components in `components/ui/` with barrel exports
- Feature components organized by domain
- Client components marked with `"use client"`
- Use `@/` absolute imports from project root

### State Management
- React hooks for client state (`useState`, `useCallback`)
- SWR for data fetching with error handling
- Custom hooks in `hooks/` directory for reusable logic

### API Design
- REST endpoints using `NextRequest`/`NextResponse`
- Consistent JSON responses with `{ success, error }` patterns
- Proper HTTP status codes (400, 404, 429, 500)
- Input validation and error handling

### Styling Approach
- Tailwind utility classes with CSS variables (`--color-*`, `--radius-*`)
- `cn()` helper from `lib/utils/cn.ts` for conditional classes
- No component-scoped CSS files

## Important Notes

### Environment Variables Required
- `GOOGLE_GENERATIVE_AI_API_KEY` - For Gemini image generation
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` - Image storage
- `STORAGE_KV_REST_API_URL`, `STORAGE_KV_REST_API_TOKEN` - Vercel KV connection
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL` - Admin authentication

### Development Workflow
1. Always run `npm run lint` before committing
2. Use `npx tsc --noEmit` to verify types when making structural changes
3. Test the full user flow manually in browser
4. Check rate limiting and error handling paths

### Code Style
- Use TypeScript strict mode
- Prefer `interface` for component props, `type` for unions/utilities
- Import type-only with `import type`
- Use descriptive state names (`isUploading`, `selectedFabric`)
- Handle loading, error, and success states in all API calls