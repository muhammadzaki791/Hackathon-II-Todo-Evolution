# Frontend Development Guidelines - Todo Full-Stack Web App

## Technology Stack
- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Better Auth with JWT
- **State Management**: React Server Components + Client Components as needed

## Project Structure
```
frontend/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   ├── login/                    # Auth pages
│   ├── dashboard/                # Protected dashboard
│   └── api/                      # API routes (Better Auth)
├── components/                   # Reusable UI components
│   ├── ui/                       # Base UI components
│   ├── tasks/                    # Task-related components
│   └── auth/                     # Auth-related components
├── lib/                          # Utilities and helpers
│   ├── api.ts                    # Centralized API client
│   ├── auth.ts                   # Better Auth configuration
│   └── utils.ts                  # Helper functions
├── hooks/                        # Custom React hooks
├── types/                        # TypeScript type definitions
├── public/                       # Static assets
├── .env.local                    # Environment variables
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS configuration
└── package.json
```

## Architectural Patterns

### Server Components vs Client Components
- **Default to Server Components** for better performance
- Use **Client Components** only when needed:
  - Interactive event handlers (onClick, onChange)
  - Browser-only APIs (localStorage, window)
  - React hooks (useState, useEffect, useContext)
- Mark client components with `'use client'` directive at top of file

### Example Pattern
```typescript
// Server Component (default) - No directive needed
export default async function TasksPage() {
  const tasks = await api.getTasks(); // Can fetch directly
  return <TaskList tasks={tasks} />;
}

// Client Component - Needs 'use client'
'use client';
export function TaskForm() {
  const [title, setTitle] = useState('');
  return <form>...</form>;
}
```

## API Client Pattern

### Centralized API Client (`lib/api.ts`)
**CRITICAL**: All backend API calls MUST go through the centralized API client. This ensures:
- JWT tokens are automatically attached to every request
- Consistent error handling
- Type safety across the application

```typescript
// lib/api.ts
import { getSession } from './auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function getAuthHeaders() {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error('No authentication token');
  }
  return {
    'Authorization': `Bearer ${session.accessToken}`,
    'Content-Type': 'application/json',
  };
}

export const api = {
  async getTasks(userId: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}/api/${userId}/tasks`, { headers });
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return res.json();
  },

  async createTask(userId: string, data: CreateTaskInput) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}/api/${userId}/tasks`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create task');
    return res.json();
  },

  // ... other API methods
};
```

### Usage in Components
```typescript
// ✅ CORRECT - Use centralized API client
import { api } from '@/lib/api';

async function TasksPage() {
  const tasks = await api.getTasks(userId);
  return <TaskList tasks={tasks} />;
}

// ❌ WRONG - Don't make raw fetch calls
async function TasksPage() {
  const res = await fetch('/api/tasks'); // Missing JWT token!
  const tasks = await res.json();
  return <TaskList tasks={tasks} />;
}
```

## Better Auth Integration

### Configuration (`lib/auth.ts`)
```typescript
import { betterAuth } from 'better-auth';

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  database: {
    // Database configuration
  },
  jwt: {
    enabled: true,
    expiresIn: '7d',
  },
});

export const getSession = async () => {
  // Get current session with JWT token
  return auth.api.getSession();
};
```

### Protected Routes Pattern
```typescript
// app/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return <Dashboard userId={session.user.id} />;
}
```

## Styling Guidelines

### Tailwind CSS Best Practices
- Use utility classes directly in JSX
- No inline styles (`style={{}}`)
- Follow existing component patterns for consistency
- Use Tailwind's responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`

### Example Component
```typescript
export function TaskCard({ task }: { task: Task }) {
  return (
    <div className="rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-gray-900">
        {task.title}
      </h3>
      <p className="mt-2 text-sm text-gray-600">
        {task.description}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${
          task.completed
            ? 'bg-green-100 text-green-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {task.completed ? 'Completed' : 'Pending'}
        </span>
      </div>
    </div>
  );
}
```

## TypeScript Guidelines

### Type Definitions (`types/index.ts`)
```typescript
export interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
}
```

### Use Types Consistently
- Always define types for props, API responses, and state
- Avoid `any` type - use `unknown` if type is truly unknown
- Export types from `types/index.ts` for reuse

## Error Handling

### API Error Handling Pattern
```typescript
'use client';
import { useState } from 'react';
import { api } from '@/lib/api';

export function TaskForm({ userId }: { userId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      await api.createTask(userId, {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
      });
      // Handle success (redirect, show toast, etc.)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}
      {/* Form fields */}
    </form>
  );
}
```

## File Naming Conventions
- Components: PascalCase (e.g., `TaskCard.tsx`, `TaskForm.tsx`)
- Utilities: camelCase (e.g., `api.ts`, `utils.ts`)
- Pages: kebab-case (e.g., `task-details/page.tsx`)
- Types: PascalCase interfaces/types in `types/index.ts`

## Spec-Driven Development

### Before Writing Code
1. **Read the spec**: `@specs/features/[feature].md`
2. **Check UI spec**: `@specs/ui/components.md` or `@specs/ui/pages.md`
3. **Understand API contract**: `@specs/api/rest-endpoints.md`
4. **Review acceptance criteria**: Ensure implementation matches requirements

### Component Development Process
1. Define TypeScript types for props and data
2. Create component structure (Server vs Client)
3. Implement UI with Tailwind CSS
4. Add API calls via centralized client
5. Handle loading and error states
6. Test against acceptance criteria

## Security Checklist
- ✅ All API calls use centralized `api` client with JWT tokens
- ✅ Protected routes check for valid session
- ✅ User ID in API calls matches authenticated user
- ✅ No sensitive data in client-side code or console logs
- ✅ Environment variables never exposed to client (use `NEXT_PUBLIC_` prefix only for public vars)
- ✅ Input validation on forms before API submission
- ✅ XSS protection through React's automatic escaping

## Common Patterns

### Loading States
```typescript
export default async function TasksPage() {
  return (
    <Suspense fallback={<TasksSkeleton />}>
      <TasksList />
    </Suspense>
  );
}
```

### Form Submissions
```typescript
'use client';
export function TaskForm() {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await api.createTask(userId, {
        title: formData.get('title') as string
      });
      // Revalidate and redirect
    });
  }

  return <form action={handleSubmit}>...</form>;
}
```

## Performance Optimization
- Use Server Components for data fetching (reduces client bundle)
- Lazy load client components with `dynamic` import when appropriate
- Optimize images with Next.js `<Image>` component
- Use `loading.tsx` and `error.tsx` for better UX
- Implement proper caching strategies with Next.js fetch options

## Testing Guidelines
- Unit tests for utility functions
- Component tests for UI components
- Integration tests for API client
- E2E tests for critical user flows (login, task CRUD)

## Development Workflow
1. Start backend: `cd ../backend && uvicorn main:app --reload --port 8000`
2. Start frontend: `npm run dev`
3. Access app: http://localhost:3000
4. Backend API docs: http://localhost:8000/docs

## Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Better Auth Documentation](https://better-auth.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- Specs: `@specs/features/`, `@specs/ui/`, `@specs/api/`
