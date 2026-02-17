# Quick Start: Task Organization & Usability Enhancements

**Feature**: 006-task-organization
**Date**: 2026-02-08
**For**: Developers implementing this feature

## Overview

This guide helps you quickly understand and implement the task organization features (priority, tags, search, filters, sorting) for the Todo application.

## Prerequisites

**Existing System** (must be functional):
- ✅ Backend running on http://localhost:8000
- ✅ Frontend running on http://localhost:3000 or 3001
- ✅ Database: Neon PostgreSQL connected
- ✅ Authentication: Better Auth + JWT working
- ✅ Task CRUD: Create, read, update, delete tasks functional

**Required Knowledge**:
- Python FastAPI + SQLModel
- Next.js 16+ (App Router) + TypeScript
- PostgreSQL JSON operators
- React hooks and state management

---

## Implementation Overview

### What's Being Added

**Backend** (3 files modified):
1. `backend/models.py`: Add `priority` (string) and `tags` (JSON array) fields to Task model
2. `backend/schemas.py`: Add priority/tags to TaskCreate, TaskUpdate, TaskResponse; add TaskQueryParams
3. `backend/routes/tasks.py`: Modify GET /tasks endpoint to handle query parameters

**Frontend** (8 files modified, 5 new components):
1. `frontend/types/Task.ts`: Add priority and tags to Task interface
2. `frontend/lib/api.ts`: Update getTasks() to accept query params
3. `frontend/hooks/useTasks.ts`: Add search/filter/sort state
4. `frontend/components/TaskCard/TaskCard.tsx`: Display priority badge + tag chips
5. `frontend/components/TaskForm/TaskForm.tsx`: Add priority dropdown + tag input
6. `frontend/app/dashboard/page.tsx`: Add search/filter/sort UI controls
7. **NEW**: `frontend/components/SearchBar/SearchBar.tsx`
8. **NEW**: `frontend/components/FilterPanel/FilterPanel.tsx`
9. **NEW**: `frontend/components/SortSelector/SortSelector.tsx`
10. **NEW**: `frontend/components/PriorityBadge/PriorityBadge.tsx`
11. **NEW**: `frontend/components/TagChip/TagChip.tsx`

**Database**: Automatic migration via SQLModel (2 new columns with defaults)

**Tests**: Backend integration tests, frontend component tests, E2E tests

---

## Step-by-Step Implementation

### Phase 1: Backend - Database Model (15 min)

**File**: `backend/models.py`

**Add to Task model**:
```python
from sqlalchemy import Column, JSON
from typing import List

class Task(SQLModel, table=True):
    # ... existing fields ...

    # NEW FIELDS:
    priority: str = Field(
        default="medium",
        max_length=10,
        sa_column_kwargs={"server_default": "medium"}
    )
    tags: List[str] = Field(
        default_factory=list,
        sa_column=Column(JSON, server_default="[]")
    )
```

**Test**: Restart backend → Check logs for "Creating database tables" → No errors

---

### Phase 2: Backend - Request/Response Schemas (10 min)

**File**: `backend/schemas.py`

**Update TaskCreate**:
```python
class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    priority: str = Field(default="medium", pattern="^(high|medium|low)$")
    tags: List[str] = Field(default_factory=list, max_length=20)
```

**Update TaskUpdate**:
```python
class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    completed: Optional[bool] = None
    priority: Optional[str] = Field(None, pattern="^(high|medium|low)$")
    tags: Optional[List[str]] = Field(None, max_length=20)
```

**Update TaskResponse**: (should automatically include new fields via `from_attributes=True`)

**Add TaskQueryParams**:
```python
from typing import Literal

class TaskQueryParams(BaseModel):
    search: Optional[str] = Field(None, max_length=100)
    status: Optional[Literal["pending", "completed"]] = None
    priority: Optional[Literal["high", "medium", "low"]] = None
    tags: Optional[str] = None
    sort: Literal["date", "alpha", "priority"] = "date"
```

---

### Phase 3: Backend - Query Parameter Handling (30 min)

**File**: `backend/routes/tasks.py`

**Modify GET /tasks endpoint**:
```python
from sqlmodel import or_, desc, asc, case
from typing import Optional, Literal

@router.get("/{user_id}/tasks", response_model=List[TaskResponse])
async def get_tasks(
    user_id: str = Path(...),
    search: Optional[str] = Query(None, max_length=100),
    status: Optional[Literal["pending", "completed"]] = Query(None),
    priority: Optional[Literal["high", "medium", "low"]] = Query(None),
    tags: Optional[str] = Query(None),
    sort: Literal["date", "alpha", "priority"] = Query("date"),
    authenticated_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    # Verify user_id matches authenticated user
    if user_id != authenticated_user_id:
        raise HTTPException(status_code=403, detail="Access denied")

    # Base query
    query = select(Task).where(Task.user_id == authenticated_user_id)

    # Apply search filter
    if search:
        query = query.filter(
            or_(
                Task.title.ilike(f"%{search}%"),
                Task.description.ilike(f"%{search}%")
            )
        )

    # Apply status filter
    if status:
        query = query.filter(Task.completed == (status == "completed"))

    # Apply priority filter
    if priority:
        query = query.filter(Task.priority == priority)

    # Apply tag filter
    if tags:
        query = query.filter(Task.tags.op('@>')(f'["{tags}"]'))

    # Apply sorting
    if sort == "date":
        query = query.order_by(desc(Task.created_at))
    elif sort == "alpha":
        query = query.order_by(asc(Task.title))
    elif sort == "priority":
        # Sort by priority (high→medium→low), then by date
        priority_order = case(
            (Task.priority == "high", 1),
            (Task.priority == "medium", 2),
            (Task.priority == "low", 3),
        )
        query = query.order_by(priority_order, desc(Task.created_at))

    tasks = session.exec(query).all()
    return tasks
```

**Test**: Use curl to test query parameters:
```bash
curl "http://localhost:8000/api/{user_id}/tasks?search=test" -H "Authorization: Bearer {token}"
curl "http://localhost:8000/api/{user_id}/tasks?priority=high&sort=date" -H "Authorization: Bearer {token}"
```

---

### Phase 4: Frontend - TypeScript Types (5 min)

**File**: `frontend/types/Task.ts`

**Update Task interface**:
```typescript
export interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';  // NEW
  tags: string[];                       // NEW
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  title: string;
  description?: string;
  priority?: 'high' | 'medium' | 'low';  // NEW
  tags?: string[];                       // NEW
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'high' | 'medium' | 'low';  // NEW
  tags?: string[];                       // NEW
}
```

---

### Phase 5: Frontend - API Client (10 min)

**File**: `frontend/lib/api.ts`

**Update getTasks method**:
```typescript
interface TaskQueryParams {
  search?: string;
  status?: 'pending' | 'completed';
  priority?: 'high' | 'medium' | 'low';
  tags?: string;
  sort?: 'date' | 'alpha' | 'priority';
}

export const api = {
  async getTasks(userId: string, params?: TaskQueryParams) {
    const headers = getAuthHeaders();

    // Build query string
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.set('search', params.search);
    if (params?.status) queryParams.set('status', params.status);
    if (params?.priority) queryParams.set('priority', params.priority);
    if (params?.tags) queryParams.set('tags', params.tags);
    if (params?.sort) queryParams.set('sort', params.sort);

    const queryString = queryParams.toString();
    const url = `${API_BASE}/api/${userId}/tasks${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    handleApiError(response);
    return response.json();
  },

  // createTask, updateTask methods already handle priority/tags via TaskCreate/TaskUpdate
  // No changes needed (Pydantic applies defaults)
};
```

---

### Phase 6: Frontend - UI Components (60 min)

**Create 5 new components**:

1. **SearchBar** (`frontend/components/SearchBar/SearchBar.tsx`):
   - Input field with debounce (300ms)
   - Clear button when search has value
   - onChange callback to parent

2. **FilterPanel** (`frontend/components/FilterPanel/FilterPanel.tsx`):
   - Status dropdown (All, Pending, Completed)
   - Priority dropdown (All, High, Medium, Low)
   - Tag dropdown (All, [dynamic list from tasks])
   - "Clear Filters" button

3. **SortSelector** (`frontend/components/SortSelector/SortSelector.tsx`):
   - Dropdown with 3 options: Date (Newest), Alphabetical, Priority
   - onChange callback to parent

4. **PriorityBadge** (`frontend/components/PriorityBadge/PriorityBadge.tsx`):
   - Displays priority as colored badge
   - High = red, Medium = yellow, Low = blue
   - Reusable across TaskCard

5. **TagChip** (`frontend/components/TagChip/TagChip.tsx`):
   - Displays single tag as chip/badge
   - Optional remove button (for edit mode)
   - Reusable across TaskCard and TaskForm

**Modify existing components**:

6. **TaskCard**: Add PriorityBadge and TagChip display
7. **TaskForm**: Add priority dropdown and tag input field
8. **Dashboard**: Add SearchBar, FilterPanel, SortSelector

---

## Testing Guide

### Backend Tests

**File**: `backend/tests/test_tasks.py`

**Add tests**:
```python
def test_get_tasks_with_search(client, auth_headers):
    # Create tasks with different titles
    # Search for keyword
    # Verify only matching tasks returned

def test_get_tasks_with_priority_filter(client, auth_headers):
    # Create tasks with different priorities
    # Filter by high priority
    # Verify only high-priority tasks returned

def test_get_tasks_with_combined_filters(client, auth_headers):
    # Create tasks with varied properties
    # Apply search + status + priority + tags + sort
    # Verify correct subset returned in correct order

def test_get_tasks_backward_compatibility(client, auth_headers):
    # Call GET /tasks without query params
    # Verify returns all tasks (existing behavior)
```

### Frontend E2E Tests

**File**: `frontend/tests/e2e/task-organization.spec.ts`

```typescript
test('search filters tasks by keyword', async ({ page }) => {
  // Create 5 tasks with different titles
  // Type "meeting" in search box
  // Verify only tasks with "meeting" in title appear
});

test('priority filter shows only high-priority tasks', async ({ page }) => {
  // Create tasks with mixed priorities
  // Select "High" from priority filter
  // Verify only high-priority tasks visible
});

test('combined filters and sort work together', async ({ page }) => {
  // Create 10 tasks with varied properties
  // Apply: status=pending, priority=high, sort=alpha
  // Verify correct tasks appear in alphabetical order
});
```

---

## Development Workflow

### Recommended Implementation Order

1. **Backend Foundation** (Day 1):
   - Update Task model with priority/tags
   - Update schemas (TaskCreate, TaskUpdate, TaskResponse, TaskQueryParams)
   - Restart backend and verify database migration

2. **Backend Query Logic** (Day 1):
   - Modify GET /tasks endpoint to accept query params
   - Implement search/filter/sort logic
   - Test with curl commands

3. **Frontend Types** (Day 2):
   - Update Task interface with priority/tags
   - Update API client getTasks() signature

4. **Frontend Components** (Day 2-3):
   - Create 5 new components (SearchBar, FilterPanel, etc.)
   - Modify TaskCard to display priority/tags
   - Modify TaskForm to input priority/tags

5. **Integration** (Day 3):
   - Wire up search/filter/sort in dashboard
   - Connect components to API client
   - Manual testing of all flows

6. **Testing** (Day 4):
   - Write backend integration tests
   - Write frontend component tests
   - Write E2E tests for critical flows

### Quick Commands

**Start Development Environment**:
```bash
# Terminal 1 - Backend
cd backend
python -m uvicorn main:app --reload --port 8000

# Terminal 2 - Frontend
cd frontend
npm run dev
```

**Test Backend API**:
```bash
# Get test token
TOKEN=$(curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}' \
  | jq -r '.token')

# Test search
curl "http://localhost:8000/api/user-{id}/tasks?search=meeting" \
  -H "Authorization: Bearer $TOKEN"

# Test filters
curl "http://localhost:8000/api/user-{id}/tasks?status=pending&priority=high&sort=priority" \
  -H "Authorization: Bearer $TOKEN"
```

**Run Tests**:
```bash
# Backend tests
cd backend
pytest tests/test_tasks.py -v

# Frontend tests
cd frontend
npm test

# E2E tests
cd frontend
npx playwright test
```

---

## Key Implementation Patterns

### Backend: Query Building Pattern

```python
# Start with base query (user isolation)
query = select(Task).where(Task.user_id == authenticated_user_id)

# Apply filters conditionally
if search:
    query = query.filter(or_(
        Task.title.ilike(f"%{search}%"),
        Task.description.ilike(f"%{search}%")
    ))

if priority:
    query = query.filter(Task.priority == priority)

# Apply sorting
if sort == "priority":
    priority_order = case(
        (Task.priority == "high", 1),
        (Task.priority == "medium", 2),
        (Task.priority == "low", 3),
    )
    query = query.order_by(priority_order, desc(Task.created_at))

# Execute
tasks = session.exec(query).all()
```

### Frontend: Filter State Pattern

```typescript
// Dashboard component
const [searchQuery, setSearchQuery] = useState('');
const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
const [tagFilter, setTagFilter] = useState<string | null>(null);
const [sortOrder, setSortOrder] = useState<'date' | 'alpha' | 'priority'>('date');

// Debounced API call
useEffect(() => {
  const timer = setTimeout(() => {
    refreshTasks();
  }, 300);
  return () => clearTimeout(timer);
}, [searchQuery, statusFilter, priorityFilter, tagFilter, sortOrder]);

// Build query params
const queryParams = {
  search: searchQuery || undefined,
  status: statusFilter !== 'all' ? statusFilter : undefined,
  priority: priorityFilter !== 'all' ? priorityFilter : undefined,
  tags: tagFilter || undefined,
  sort: sortOrder,
};

// Fetch filtered tasks
const tasks = await api.getTasks(userId, queryParams);
```

### Frontend: Tag Input Pattern

```typescript
// TaskForm component
const [tags, setTags] = useState<string[]>(task?.tags || []);
const [tagInput, setTagInput] = useState('');

const addTag = (tag: string) => {
  if (tag && !tags.includes(tag) && tags.length < 20) {
    setTags([...tags, tag]);
  }
};

const removeTag = (tagToRemove: string) => {
  setTags(tags.filter(t => t !== tagToRemove));
};

return (
  <div>
    <input
      value={tagInput}
      onChange={(e) => setTagInput(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
          e.preventDefault();
          addTag(tagInput.trim());
          setTagInput('');
        }
      }}
    />
    <div className="flex flex-wrap gap-2 mt-2">
      {tags.map(tag => (
        <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded">
          {tag}
          <button onClick={() => removeTag(tag)}>×</button>
        </span>
      ))}
    </div>
  </div>
);
```

---

## Troubleshooting

### Issue: Existing tasks don't have priority/tags after migration

**Solution**: Check Task model has `server_default` values:
```python
priority: str = Field(default="medium", sa_column_kwargs={"server_default": "medium"})
tags: List[str] = Field(default_factory=list, sa_column=Column(JSON, server_default="[]"))
```

Restart backend to trigger migration.

### Issue: Search returns no results

**Check**:
1. Verify query parameter is being sent: Check browser DevTools → Network tab
2. Verify backend receives parameter: Check FastAPI logs
3. Verify ILIKE query syntax: Should be `ILIKE '%keyword%'` (with % wildcards)

### Issue: Tag filter not working

**Check**:
1. Verify tags stored as JSON array: Query database directly
2. Verify containment operator: Should be `tags @> '["tagname"]'` (JSON format)
3. Verify tag name matches exactly (case-sensitive)

### Issue: UI performance degrades with many filters

**Solution**: Verify debounce is working (300ms delay). Check that API call only happens after debounce timer, not on every keystroke.

---

## Acceptance Checklist

Before marking feature complete, verify:

- [ ] Backend: Task model has priority (default="medium") and tags (default=[])
- [ ] Backend: GET /tasks accepts search, status, priority, tags, sort query params
- [ ] Backend: Query logic correctly filters and sorts tasks
- [ ] Backend: All tests pass (pytest)
- [ ] Frontend: Task interface includes priority and tags fields
- [ ] Frontend: API client getTasks() accepts query params object
- [ ] Frontend: SearchBar component filters tasks dynamically
- [ ] Frontend: FilterPanel component applies status/priority/tag filters
- [ ] Frontend: SortSelector component changes task order
- [ ] Frontend: TaskCard displays PriorityBadge and TagChips
- [ ] Frontend: TaskForm includes priority dropdown and tag input
- [ ] Frontend: All tests pass (jest + playwright)
- [ ] Integration: End-to-end flows work (search → filter → sort → create with priority/tags)
- [ ] Backward compatibility: Existing tasks function correctly with defaults

---

## Resources

- **Spec**: [spec.md](./spec.md) - Feature requirements and user stories
- **Plan**: [plan.md](./plan.md) - Implementation strategy and research decisions
- **Data Model**: [data-model.md](./data-model.md) - Entity definitions and schema changes
- **API Contracts**: [contracts/api-endpoints.md](./contracts/api-endpoints.md) - Query parameter specifications
- **Backend Guidelines**: `/backend/CLAUDE.md` - FastAPI + SQLModel patterns
- **Frontend Guidelines**: `/frontend/CLAUDE.md` - Next.js + TypeScript patterns
- **Constitution**: `/.specify/memory/constitution.md` - Project principles and standards

---

## Estimated Effort

| Phase | Estimated Time |
|-------|----------------|
| Backend model + schemas | 30 minutes |
| Backend query logic | 45 minutes |
| Backend tests | 30 minutes |
| Frontend types + API client | 15 minutes |
| Frontend new components | 2 hours |
| Frontend modifications | 1 hour |
| Frontend tests | 1 hour |
| Integration testing | 30 minutes |
| **Total** | **~6 hours** |

**Note**: Times assume familiarity with codebase and technologies. First-time implementation may take longer.

---

## Next Steps

1. **Review this quickstart guide** - Ensure you understand the approach
2. **Run `/sp.tasks`** - Generate detailed task breakdown
3. **Run `/sp.implement`** - Execute tasks phase-by-phase
4. **Test thoroughly** - Verify all acceptance criteria
5. **Create PHR** - Document implementation session
