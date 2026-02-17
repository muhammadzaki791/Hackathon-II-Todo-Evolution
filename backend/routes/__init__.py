"""
API Routes Package

This package contains all API route modules for the Todo application.

Modules:
- auth: Authentication API endpoints (Feature 002)
- tasks: Task CRUD API endpoints (Feature 004)
"""

from . import tasks, auth

__all__ = ["tasks", "auth"]
