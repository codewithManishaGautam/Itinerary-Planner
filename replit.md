# TripPlanner AI

## Overview

TripPlanner AI is an AI-powered travel itinerary planning website. Users can explore destinations, sign up, log in, and generate personalized trip itineraries based on their preferences including destination, travel dates, budget, and number of travelers. The application features a public home page showcasing destinations, hotels, flights, and railways, with protected features requiring authentication.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Dual Frontend Setup**: The project has two frontend approaches:
  1. **Static HTML/CSS/JS** (`client/*.html`, `client/css/`, `client/js/`): Vanilla JavaScript pages for login, signup, dashboard, and home functionality
  2. **React SPA** (`client/src/`): React with TypeScript using Vite as the build tool, shadcn/ui components, and TanStack Query for data fetching

- **UI Components**: Uses shadcn/ui component library with Radix UI primitives, styled with Tailwind CSS
- **Routing**: React Router via `wouter` for client-side navigation
- **State Management**: TanStack React Query for server state management
- **Styling**: Tailwind CSS with custom CSS variables for theming, supporting light/dark modes

### Backend Architecture
- **Framework**: Express.js 5.x running on Node.js
- **API Pattern**: RESTful JSON APIs under `/api/*` prefix
- **Authentication**: Token-based authentication using simple bearer tokens stored in memory (tokens Map)
  - Protected routes use `requireAuth` middleware that validates Authorization header
  - Tokens are generated on login and stored with associated user IDs

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` contains database table definitions
- **Current Storage**: In-memory storage implementation (`MemStorage` class) for users
- **Database Ready**: Configured for PostgreSQL via `DATABASE_URL` environment variable

### Key Design Patterns
- **Shared Schema**: Database schemas and validation defined in `shared/` directory, accessible by both frontend and backend
- **Zod Validation**: Request validation using Zod schemas derived from Drizzle table definitions
- **Path Aliases**: TypeScript path aliases (`@/`, `@shared/`, `@assets/`) for clean imports

### Build System
- **Development**: Vite dev server with HMR, proxied through Express
- **Production**: Vite builds static assets to `dist/public`, esbuild bundles server to `dist/index.cjs`
- **Scripts**: `npm run dev` for development, `npm run build` for production build, `npm run db:push` for database migrations

## External Dependencies

### Database
- **PostgreSQL**: Primary database (requires `DATABASE_URL` environment variable)
- **Drizzle Kit**: Database migrations and schema management

### Frontend Libraries
- **Leaflet**: Interactive maps for destination display
- **React Day Picker**: Date selection in calendar components
- **Embla Carousel**: Carousel/slider functionality
- **Recharts**: Charting library for data visualization

### Backend Libraries
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- **express-session**: Session management
- **express-rate-limit**: API rate limiting
- **multer**: File upload handling

### Potential AI Integration
- Build script references `@google/generative-ai` and `openai` packages, suggesting planned AI-powered itinerary generation
- Current implementation uses rule-based or mock AI logic

### Development Tools
- **Replit Plugins**: Vite plugins for Replit integration (error overlay, cartographer, dev banner)
- **TypeScript**: Full TypeScript support across frontend and backend