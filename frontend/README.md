# Todo App - Frontend

A modern Next.js 16 frontend for the Todo Full-Stack Web Application, featuring responsive UI, theme support, and comprehensive task management.

## 🚀 Features

- **Modern UI**: Clean, responsive design built with Next.js 16 and Tailwind CSS
- **Theme Support**: Professional dark/light mode toggle using next-themes
- **Task Management**: Create, edit, and manage tasks with advanced features
- **Search & Filter**: Advanced search, filtering by status/priority/tags
- **Sorting**: Sort tasks by date, alphabetically, or by priority
- **Priority System**: Visual priority indicators for tasks
- **Tag System**: Categorize tasks with customizable tags
- **Authentication**: Secure login/signup with JWT token management

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: React 19, TypeScript
- **Styling**: Tailwind CSS v4 with CSS variables
- **Icons**: Lucide React
- **Authentication**: Better Auth
- **Theming**: next-themes
- **Utilities**: class-variance-authority, clsx, tailwind-merge

## 📋 Prerequisites

- **Node.js** (v18.17+ recommended)
- **npm** or **yarn** package manager

## 🚀 Quick Start

### Installation
```bash
cd frontend
npm install
```

### Environment Variables

Create `.env.local` with:
```env
BETTER_AUTH_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Development
```bash
npm run dev
```

Visit `http://localhost:3000` to access the application.

### Production
```bash
npm run build
npm run start
```

## ⚙️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint for code quality |

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with theme provider
│   ├── page.tsx           # Public homepage
│   ├── login/page.tsx     # Login page
│   ├── signup/page.tsx    # Signup page
│   └── dashboard/page.tsx # Main dashboard
├── components/            # React components
│   ├── LoginForm/        # Login form component
│   ├── SignupForm/       # Signup form component
│   ├── TaskCard/         # Task display component
│   ├── TaskForm/         # Task creation/editing form
│   ├── SearchBar/        # Search functionality
│   ├── FilterPanel/      # Filtering controls
│   ├── SortSelector/     # Sorting options
│   ├── PriorityBadge/    # Priority visualization
│   ├── TagChip/          # Tag display component
│   ├── ThemeToggle/      # Theme switching component
│   └── ui/              # ShadCN-style UI components
├── hooks/                 # Custom React hooks
│   ├── useAuth/          # Authentication logic
│   └── useTasks/         # Task management logic
├── lib/                   # Utility functions
│   ├── api.ts            # API client
│   ├── auth.ts           # Authentication utilities
│   └── utils.ts          # Helper functions
├── contexts/              # React contexts
│   └── ThemeContext.tsx  # Theme management
├── types/                 # TypeScript type definitions
│   └── Task.ts           # Task-related types
├── styles/                # Global styles
│   └── globals.css       # Global CSS variables
├── public/                # Static assets
├── package.json          # Dependencies and scripts
└── next.config.ts        # Next.js configuration
```

## 🌐 API Integration

The frontend communicates with the backend API at `${NEXT_PUBLIC_API_URL}/api/{user_id}/`:
- All authenticated requests include `Authorization: Bearer <token>` header
- JWT tokens are stored in localStorage
- Automatic token refresh and error handling
- Comprehensive loading and error states

## 🎨 Theming

The application supports both light and dark themes:
- Theme preference is saved locally using localStorage
- System preference is used by default
- Smooth transitions between themes
- CSS variables ensure consistent theming across components
- next-themes manages theme state and class switching

## 🔐 Authentication Flow

1. User signs up/login via Better Auth
2. JWT token is stored in localStorage
3. Token is retrieved for authenticated API calls
4. Session management with automatic refresh
5. Protected routes with redirect to login when unauthenticated

## 🏗️ Architecture

The frontend follows React best practices:
- **Components**: Modular, reusable React components
- **Hooks**: Custom hooks for authentication and data management
- **Context**: Theme management context
- **Lib**: API client and utility functions
- **Types**: Strong TypeScript typing throughout
- **Styles**: Consistent Tailwind CSS with theme variables

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

Copyright © 2026-present

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## 🤝 Contributing

For contributing to the frontend, please see the main project documentation in the root [README.md](../README.md).

## 🐛 Bug Reports

Frontend-specific issues can be reported in the main repository issue tracker.
