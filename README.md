# Pack - Resource Management System

A modern web application built with SvelteKit for managing resources, users, programs, and events.

## Prerequisites

- Node.js (v18.0.0 or higher)
- npm or pnpm (we recommend pnpm for faster installation)
- PostgreSQL (v14 or higher)

## Getting Started


1. Install dependencies:
```bash
pnpm install
# or if using npm
npm install
```

2. Set up your environment variables:
```bash
# Create a .env file in the root directory
cp .env.example .env

# Update the following variables in .env:
DATABASE_URL="postgresql://username:password@localhost:5432/pack_db"
```

3. Set up the database:
```bash
# Create and apply migrations
pnpm prisma migrate dev
# or
npx prisma migrate dev
```

4. Start the development server:
```bash
pnpm dev
# or
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
my-svelte-app/
├── src/
│   ├── lib/             # Shared components and utilities
│   ├── routes/          # SvelteKit routes and API endpoints
│   └── app.css         # Global styles
├── static/             # Static assets
├── prisma/            # Database schema and migrations
├── .env.example        # Example environment variables
├── .env                # Environment variables
├── package.json        # Project metadata and dependencies
└── README.md           # Project documentation
```

## Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow SvelteKit's file-based routing conventions
- Use Tailwind CSS for styling
- Implement responsive design patterns

### Database

- Use Prisma as the ORM
- Create migrations for all database changes
- Follow naming conventions for tables and columns

### API Endpoints

All API endpoints are located in `src/routes/api/` following SvelteKit's routing conventions:

- GET `/api/resources` - List all resources
- POST `/api/resources` - Create a new resource
- GET `/api/resources/[id]` - Get a specific resource

## Testing

```bash
# Run tests
pnpm test
# or
npm run test
```

## Building for Production

```bash
# Build the application
pnpm build
# or
npm run build

# Preview the production build
pnpm preview
# or
npm run preview
```

