# Todo App - Backend

A robust FastAPI backend for the Todo Full-Stack Web Application, featuring secure authentication, comprehensive task management, and PostgreSQL integration.

## 🚀 Features

- **RESTful API**: Well-designed API endpoints for task management
- **JWT Authentication**: Secure token-based authentication with PyJWT
- **Database Integration**: PostgreSQL with SQLModel ORM
- **Task Management**: Full CRUD operations with advanced filtering
- **Priority System**: High, medium, and low priority levels
- **Tag System**: Categorize tasks with customizable tags
- **Search & Filter**: Advanced search and filtering capabilities
- **API Documentation**: Built-in Swagger UI and ReDoc

## 🛠️ Tech Stack

- **Framework**: FastAPI 0.110+
- **ORM**: SQLModel (combining SQLAlchemy + Pydantic)
- **Database**: PostgreSQL (Neon Serverless compatible)
- **Authentication**: PyJWT for token verification
- **Validation**: Pydantic v2 for request/response validation
- **Configuration**: python-dotenv for environment management
- **Testing**: pytest and httpx for testing

## 📋 Prerequisites

- **Python** (v3.12+ recommended)
- **pip** package manager
- **PostgreSQL** database (local or cloud)

## 🚀 Quick Start

### Installation
```bash
cd backend
pip install -r requirements.txt
```

### Environment Variables

Create `.env` with:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/todo_db
BETTER_AUTH_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_ALGORITHM=HS256
```

### Development
```bash
uvicorn main:app --reload --port 8000
```

Visit `http://localhost:8000/docs` to access the interactive API documentation.

### Production
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## ⚙️ Available Commands

| Command | Description |
|--------|-------------|
| `uvicorn main:app --reload --port 8000` | Start development server with auto-reload |
| `pytest` | Run tests |
| `python migrate_add_priority_tags.py` | Run database migrations |
| `uvicorn main:app --workers 4` | Start production server with multiple workers |

## 📁 Project Structure

```
backend/
├── main.py                    # FastAPI entry point and app configuration
├── models.py                  # SQLModel database models
├── schemas.py                 # Pydantic schemas for request/response validation
├── auth.py                    # JWT verification middleware
├── routes/                    # API route handlers
│   └── tasks.py              # Task-related endpoints
├── middleware/                # Custom middleware (if any)
├── tests/                     # Test suite
├── requirements.txt          # Python dependencies
├── pyproject.toml            # Python project configuration
├── .env                      # Environment variables (not committed)
├── .python-version           # Python version specification
└── migrate_add_priority_tags.py # Database migration script
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

## 🔐 Authentication

The backend implements JWT-based authentication:
1. Frontend sends JWT in `Authorization: Bearer <token>` header
2. Middleware verifies JWT using shared secret
3. User ID is extracted from token payload
4. All database queries are filtered by authenticated user ID
5. Requests without valid token receive 401 Unauthorized

## 🏗️ Architecture

The backend follows FastAPI best practices:
- **Models**: SQLModel classes defining database schema
- **Schemas**: Pydantic classes for request/response validation
- **Routes**: API endpoints with proper error handling
- **Middleware**: Authentication and logging middleware
- **Services**: Business logic separation (in route handlers)
- **Database**: Connection pooling and transaction management

## 🗃️ Database Schema

### Task Model
- `id`: Integer (Primary Key, Auto-generated)
- `user_id`: String (Foreign Key to User, indexed)
- `title`: String (Required, max 200 characters)
- `description`: String (Optional, max 1000 characters)
- `completed`: Boolean (Default: False)
- `priority`: String (Default: 'medium', values: 'high', 'medium', 'low')
- `tags`: JSONB (Array of strings, default: [])
- `created_at`: DateTime (Auto-generated)
- `updated_at`: DateTime (Auto-generated, updates on change)

## 🧪 Testing

The backend includes comprehensive testing:
- Unit tests for individual functions
- Integration tests for API endpoints
- Authentication tests
- Database interaction tests
- Run with `pytest` command

## 🚀 Deployment

### Environment Setup
- Set up PostgreSQL database
- Configure environment variables
- Run database migrations

### Production Deployment
- Use a WSGI/ASGI server like Gunicorn/Uvicorn
- Set up reverse proxy (nginx)
- Configure SSL certificates
- Set up monitoring and logging

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

For contributing to the backend, please see the main project documentation in the root [README.md](../README.md).

## 🐛 Bug Reports

Backend-specific issues can be reported in the main repository issue tracker.