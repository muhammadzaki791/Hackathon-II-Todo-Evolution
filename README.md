# Todo Full-Stack Web Application

A modern full-stack todo application featuring Next.js 16 frontend with FastAPI backend, implementing comprehensive task management with authentication, search, filtering, and theme support.

## 🚀 Features

- **User Authentication**: Secure signup and login with JWT tokens
- **Task Management**: Create, read, update, and delete tasks
- **Advanced Organization**: Search, filter by status/priority/tags, sort tasks
- **Priority Levels**: High, medium, and low priority assignments
- **Tag System**: Categorize tasks with customizable tags
- **Theme Support**: Professional dark/light mode toggle
- **Responsive UI**: Mobile-friendly design across all devices
- **API Protection**: JWT-based authentication for all endpoints

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: React 19, TypeScript
- **Styling**: Tailwind CSS v4, CSS Variables
- **Icons**: Lucide React
- **Authentication**: Better Auth
- **Theming**: next-themes
- **Utilities**: class-variance-authority, clsx, tailwind-merge

### Backend
- **Framework**: FastAPI 0.110+
- **ORM**: SQLModel (SQLAlchemy + Pydantic)
- **Database**: PostgreSQL (Neon Serverless)
- **Authentication**: PyJWT for token verification
- **Validation**: Pydantic v2
- **Testing**: pytest, httpx

## 📋 Prerequisites

- **Node.js** (v18.17+ recommended)
- **Python** (v3.12+)
- **npm** or **yarn** (for frontend)
- **pip** (for backend)
- **PostgreSQL** (or Neon Serverless account)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Todo-Web-App
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```

Create `.env.local` with:
```env
BETTER_AUTH_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Backend Setup
```bash
cd ../backend
pip install -r requirements.txt
```

Create `.env` with:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/todo_db
BETTER_AUTH_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_ALGORITHM=HS256
```

### 4. Start Development Servers

Terminal 1 (Backend):
```bash
cd backend
uvicorn main:app --reload --port 8000
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` to access the application.

## 📁 Project Structure

```
Todo-Web-App/
├── backend/                 # FastAPI application
│   ├── main.py             # FastAPI entry point
│   ├── models.py           # SQLModel database models
│   ├── schemas.py          # Pydantic schemas
│   ├── auth.py             # JWT verification middleware
│   ├── routes/             # API route handlers
│   └── requirements.txt    # Python dependencies
├── frontend/               # Next.js application
│   ├── app/               # Next.js App Router
│   ├── components/        # React components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities and API client
│   ├── types/             # TypeScript types
│   ├── contexts/          # React contexts
│   └── package.json       # Node.js dependencies
├── specs/                 # Feature specifications
├── history/               # Prompt History Records
└── README.md             # This file
```

## 🌐 API Endpoints

All endpoints require JWT authentication in the `Authorization: Bearer <token>` header.

| Method | Endpoint                          | Description                    |
|--------|-----------------------------------|--------------------------------|
| GET    | `/api/{user_id}/tasks`           | List all tasks for user        |
| POST   | `/api/{user_id}/tasks`           | Create a new task              |
| GET    | `/api/{user_id}/tasks/{id}`      | Get specific task details      |
| PUT    | `/api/{user_id}/tasks/{id}`      | Update a specific task         |
| DELETE | `/api/{user_id}/tasks/{id}`      | Delete a specific task         |
| PATCH  | `/api/{user_id}/tasks/{id}/complete` | Toggle task completion status |

Query Parameters:
- `search`: Search in title/description
- `status`: Filter by status ('pending'/'completed')
- `priority`: Filter by priority ('high'/'medium'/'low')
- `tags`: Filter by tag
- `sort`: Sort order ('date'/'alpha'/'priority')

## ⚙️ Scripts and Commands

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Backend Commands
- `uvicorn main:app --reload --port 8000` - Start development server
- `pytest` - Run tests
- `python migrate_add_priority_tags.py` - Run database migrations

## 🔐 Authentication

The application uses JWT-based authentication:
1. User logs in via Better Auth
2. JWT token is stored in localStorage
3. Token is sent in `Authorization: Bearer <token>` header
4. Backend verifies JWT using shared secret
5. User ID is extracted from token for data isolation

## 🎨 Theming

The application supports both light and dark themes:
- Theme preference is saved locally
- System preference is used by default
- Theme toggle available on all pages
- CSS variables provide consistent theming across components

## 🏗️ Architecture

The application follows a clean, layered architecture:
- **Frontend**: Next.js App Router with React components and custom hooks
- **API Layer**: FastAPI with dependency injection and middleware
- **Service Layer**: Business logic separation
- **Data Layer**: SQLModel models with PostgreSQL
- **Security**: JWT-based authentication with proper token validation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

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

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 🐛 Bug Reports

If you encounter any issues, please create an issue in the repository with detailed reproduction steps.

## 📞 Support

For support, please contact the development team through the repository's issue tracker.