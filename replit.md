# Overview

CBT (Computer Business Technology) is a full-stack e-commerce web application built for an IT services company. The platform allows users to browse and purchase computer products, book IT services, manage orders, submit support tickets, and provide suggestions. The application features a comprehensive admin panel for business management and uses Replit Auth for user authentication.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Routing**: Wouter for client-side navigation
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI primitives with shadcn/ui design system
- **Styling**: Tailwind CSS for utility-first styling with custom CSS variables
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for RESTful API endpoints
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Session Management**: Express session with PostgreSQL store
- **Development**: Hot module replacement and error overlay for development

## Authentication & Authorization
- **Provider**: Replit Auth with OpenID Connect integration
- **Session Storage**: PostgreSQL-backed sessions with configurable TTL
- **User Management**: Automatic user creation/updates on login
- **Route Protection**: Middleware-based authentication for protected routes

## Database Design
- **Users**: Profile management with Replit Auth integration
- **Products & Services**: Categorized inventory with ratings and stock management
- **Orders**: Complete order lifecycle with item tracking and status management
- **Cart**: Session-based shopping cart functionality
- **Support**: SAV (Service After Sale) ticket system for customer support
- **Suggestions**: Customer feedback and suggestion collection system
- **Categories**: Hierarchical organization for products and services

## API Structure
- **RESTful Design**: Standard HTTP methods with JSON responses
- **Authentication**: Session-based auth with user context in protected routes
- **Error Handling**: Centralized error middleware with structured responses
- **Filtering**: Advanced query parameters for products and services
- **Admin Endpoints**: Dedicated routes for administrative functions

## External Dependencies
- **Database**: Neon PostgreSQL serverless database
- **Authentication**: Replit's OpenID Connect service
- **File Uploads**: Configured for attached assets (images, documents)
- **Fonts**: Google Fonts integration for typography
- **Development**: Replit-specific development tools and banners

# External Dependencies

## Core Services
- **Neon Database**: Serverless PostgreSQL database hosting
- **Replit Auth**: OpenID Connect authentication provider
- **Replit Development**: Platform-specific development tools and deployment

## Third-Party Libraries
- **UI Framework**: Radix UI for accessible component primitives
- **Data Fetching**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod schema validation
- **Date Utilities**: date-fns for date manipulation
- **CSS Framework**: Tailwind CSS with PostCSS processing
- **Icons**: Lucide React for consistent iconography

## Development Tools
- **Build System**: Vite with React plugin and TypeScript support
- **Database Management**: Drizzle Kit for schema migrations
- **Code Quality**: TypeScript for static type checking
- **Development Server**: Express with Vite middleware integration