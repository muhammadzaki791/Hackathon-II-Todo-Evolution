# Frontend UI - Quickstart Guide

## Prerequisites

- Backend API running (Feature 004: Task CRUD API implemented)
- Valid JWT token from authentication
- Node.js 18+ and npm/yarn installed

## Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Update API URL in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Running the Application

```bash
npm run dev
```

Application will start at http://localhost:3000

## Key Components

### Authentication
- **Login Page**: `/app/login/page.tsx` - Login form with Better Auth integration
- **Signup Page**: `/app/signup/page.tsx` - Registration form with Better Auth integration
- **Protected Routes**: `components/ProtectedRoute.tsx` - Ensures user is authenticated

### Task Management
- **Dashboard**: `/app/dashboard/page.tsx` - Main task management page
- **Task Card**: `components/TaskCard.tsx` - Displays individual task with completion toggle
- **Task Form**: `components/TaskForm.tsx` - Form for creating and updating tasks

### API Client
- **API Service**: `lib/api.ts` - Centralized API client with JWT auto-attachment
- **Hooks**: `hooks/useTasks.ts`, `hooks/useAuth.ts` - Custom React hooks for data management

## Testing

Run component tests:
```bash
npm run test
```

Run E2E tests:
```bash
npm run test:e2e
```

## Dependencies

This feature depends on:
- **Feature 002**: Authentication (Better Auth backend service)
- **Feature 004**: Task CRUD API endpoints
- **Constitution**: Frontend technology stack requirements