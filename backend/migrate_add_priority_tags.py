"""
Database migration script for Feature 006: Task Organization & Usability Enhancements

Adds priority and tags columns to existing tasks table.

Run this script ONCE before starting the backend with the updated models.
"""

import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

def run_migration():
    """Add priority and tags columns to tasks table."""
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()

    try:
        print("Starting migration: Adding priority and tags columns...")

        # Check if columns already exist
        cursor.execute("""
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'tasks' AND column_name IN ('priority', 'tags');
        """)
        existing_columns = [row[0] for row in cursor.fetchall()]

        # Add priority column if it doesn't exist
        if 'priority' not in existing_columns:
            print("Adding priority column...")
            cursor.execute("""
                ALTER TABLE tasks
                ADD COLUMN priority VARCHAR(10) NOT NULL DEFAULT 'medium';
            """)
            print("[OK] Priority column added successfully")
        else:
            print("[OK] Priority column already exists")

        # Add tags column if it doesn't exist
        if 'tags' not in existing_columns:
            print("Adding tags column...")
            cursor.execute("""
                ALTER TABLE tasks
                ADD COLUMN tags JSONB NOT NULL DEFAULT '[]'::jsonb;
            """)
            print("[OK] Tags column added successfully")
        else:
            print("[OK] Tags column already exists")

        # Create indexes for performance
        print("Creating indexes...")

        # Index on priority for filtering and sorting
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_task_priority ON tasks(priority);
        """)
        print("[OK] Priority index created")

        # GIN index on tags for fast containment queries (requires JSONB type)
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_task_tags_gin ON tasks USING gin(tags jsonb_path_ops);
        """)
        print("[OK] Tags GIN index created")

        # Commit all changes
        conn.commit()
        print("\n[SUCCESS] Migration completed successfully!")
        print("You can now start the backend server.")

    except Exception as e:
        conn.rollback()
        print(f"\n[ERROR] Migration failed: {e}")
        raise

    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    run_migration()
