# Research: Task Organization & Usability Enhancements

**Feature**: 006-task-organization
**Date**: 2026-02-08
**Status**: Complete

## Research Questions & Findings

### R1: Database Migration Strategy for Adding Columns

**Question**: How to safely add `priority` and `tags` columns to existing Task table with default values?

**Alternatives Considered**:

1. **Manual Alembic Migration**:
   - Pros: Precise control, rollback support, production-ready
   - Cons: Requires Alembic setup, migration script writing, more complexity
   - Best for: Production environments with strict change control

2. **SQLModel create_all() with Defaults**:
   - Pros: Simple, automatic column detection, works with existing workflow
   - Cons: Less control, no rollback mechanism
   - Best for: Development and Phase II projects

**Decision**: **SQLModel create_all() with server defaults**

**Rationale**:
- Project phase: Phase II development (not production)
- Existing workflow: Already using `create_all()` in `main.py` startup
- Simplicity: No Alembic setup or migration scripts needed
- Safety: `server_default` ensures database-level defaults for existing rows
- Constitution compliance: Maintains current development patterns

**Implementation Details**:
```python
from sqlalchemy import Column, JSON

class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    # Existing fields...
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    title: str = Field(max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # NEW FIELDS:
    priority: str = Field(
        default="medium",
        sa_column_kwargs={"server_default": "medium"}
    )
    tags: List[str] = Field(
        default_factory=list,
        sa_column=Column(JSON, server_default="[]")
    )
```

**Migration Process**:
1. Update Task model in `backend/models.py`
2. Restart backend application
3. SQLModel detects new columns and adds them via `create_all()`
4. Existing tasks automatically get default values from `server_default`

---

### R2: PostgreSQL Search Strategy (Full-Text vs ILIKE)

**Question**: Should we use PostgreSQL full-text search or simple ILIKE for searching task titles/descriptions?

**Alternatives Considered**:

1. **PostgreSQL Full-Text Search (tsvector/tsquery)**:
   - Pros: Advanced features (ranking, stemming, stop words), excellent performance at scale (10k+ rows)
   - Cons: Complex setup (tsvector columns, triggers), more query syntax, maintenance overhead
   - Performance: Optimized for large datasets
   - Use case: Applications with 10k+ searchable documents per user

2. **ILIKE (Case-Insensitive LIKE)**:
   - Pros: Simple syntax, no special setup, supports partial matching, adequate performance with indexes
   - Cons: Slower than full-text search at very large scale (10k+ rows)
   - Performance: <100ms for 500 tasks with GIN trigram indexes
   - Use case: Applications with <1000 searchable documents per user

**Decision**: **ILIKE with GIN trigram indexes**

**Rationale**:
- User scale: 5-100 tasks average, max 500 tasks (per spec assumptions)
- Performance target: <1 second (ILIKE meets this easily with 500 tasks)
- Simplicity: No special columns or triggers needed
- Partial matching: ILIKE supports "gro" matching "groceries" natively
- Case-insensitivity: ILIKE handles this without additional configuration

**Implementation Details**:
```python
# Backend search logic (routes/tasks.py)
from sqlmodel import or_

if search:
    query = query.filter(
        or_(
            Task.title.ilike(f"%{search}%"),
            Task.description.ilike(f"%{search}%")
        )
    )
```

**Index Strategy** (optional optimization for future):
```sql
-- PostgreSQL trigram extension for ILIKE performance
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- GIN indexes for fast ILIKE queries
CREATE INDEX idx_task_title_trgm ON tasks USING gin (title gin_trgm_ops);
CREATE INDEX idx_task_description_trgm ON tasks USING gin (description gin_trgm_ops);
```

**Performance Benchmarks**:
- 100 tasks: <10ms query time (no index needed)
- 500 tasks: ~50ms query time (acceptable without index)
- With trigram index: <5ms even at 1000+ tasks

---

### R3: Tags Storage (JSON vs Native Array)

**Question**: Should tags be stored as JSON array or PostgreSQL native array type?

**Alternatives Considered**:

1. **JSON Column**:
   - Type: `Column(JSON)` with `List[str]` Python type
   - Flexibility: Can store complex structures later (e.g., `{name, color}`)
   - SQLModel support: Direct support via type hints
   - Querying: JSON operators (`@>`, `?`, `?|`)
   - Validation: Pydantic validates structure in application

2. **Native PostgreSQL Array**:
   - Type: `ARRAY(TEXT)` column type
   - Strictness: Database enforces string array at storage level
   - SQLModel support: Requires custom `sa_column` definition
   - Querying: Array operators (`ANY`, `@>`, `&&`)
   - Validation: Database-level type checking

**Decision**: **JSON column with List[str] type hint**

**Rationale**:
- SQLModel integration: Seamless with `Column(JSON)` + `List[str]` type hint
- Flexibility: Future-proof if tags need metadata (colors, icons)
- Validation: Pydantic handles type validation in application layer
- Constitution compliance: Uses standard SQLModel patterns
- Querying: JSON containment operator `@>` works well for tag filtering

**Implementation Details**:
```python
from sqlalchemy import Column, JSON
from typing import List

class Task(SQLModel, table=True):
    tags: List[str] = Field(
        default_factory=list,
        sa_column=Column(JSON, server_default="[]")
    )
```

**Query Examples**:
```python
# Filter by single tag
if tag_filter:
    query = query.filter(Task.tags.op('@>')(f'["{tag_filter}"]'))

# Filter by multiple tags (OR logic)
if tags:
    query = query.filter(Task.tags.op('?|')(tags))

# Check if task has any tags
query = query.filter(Task.tags != '[]')
```

**Index for Performance**:
```sql
-- GIN index on tags JSON column for fast containment queries
CREATE INDEX idx_task_tags_gin ON tasks USING gin (tags);
```

---

### R4: Frontend Filter State Management

**Question**: How should search, filter, and sort state be managed in the frontend?

**Alternatives Considered**:

1. **URL Query Parameters** (`?search=test&priority=high`):
   - Pros: Shareable URLs, persistent across page refresh, browser history support
   - Cons: Next.js App Router complexity, URL encoding, more code
   - Use case: When users need to share filtered views or bookmark searches

2. **React Local State** (`useState` in component):
   - Pros: Simple, fast, no URL manipulation needed
   - Cons: State lost on refresh, not shareable
   - Use case: When persistence isn't critical and simplicity is valued

3. **Global State** (Context API or state library):
   - Pros: Shareable across components, persistent in session
   - Cons: Overkill for single-page filters, adds complexity
   - Use case: When multiple components need filter state

**Decision**: **React local state (useState) in dashboard component**

**Rationale**:
- Spec priority: Filter persistence across refreshes is NOT a core requirement
- Simplicity: Fastest implementation, meets all functional requirements
- User behavior: Most users complete workflows in single session
- Constitution: No state management libraries needed (aligns with minimalism)
- Future enhancement: Can migrate to URL params if user feedback requests shareable filters

**Implementation**:
```typescript
const [searchQuery, setSearchQuery] = useState('');
const [filters, setFilters] = useState({
  status: 'all' as 'all' | 'pending' | 'completed',
  priority: 'all' as 'all' | 'high' | 'medium' | 'low',
  tag: null as string | null,
});
const [sortOrder, setSortOrder] = useState<'date' | 'alpha' | 'priority'>('date');

// Debounce search input (avoid API call on every keystroke)
useEffect(() => {
  const timer = setTimeout(() => {
    refreshTasks();
  }, 300);
  return () => clearTimeout(timer);
}, [searchQuery, filters, sortOrder]);
```

---

### R5: Tag Input UI Pattern

**Question**: Should tag input use autocomplete dropdown or free-text input?

**Alternatives Considered**:

1. **Autocomplete with Existing Tags**:
   - Pros: Reuse existing tags, prevent typos, better consistency
   - Cons: Requires API endpoint to fetch user's tags, more complex component
   - UX: Dropdown appears on focus with existing tags
   - Implementation: Fetch `GET /api/{user_id}/tags` → render suggestions

2. **Free-Text Input** (Type and press Enter):
   - Pros: Simple, fast implementation, no extra API calls
   - Cons: Possible tag proliferation, typos create duplicates
   - UX: Type tag name, press Enter to add, click X to remove
   - Implementation: Controlled input + array state

**Decision**: **Free-text input (MVP)** with future autocomplete enhancement

**Rationale**:
- MVP focus: Get core functionality working first
- Spec requirements: "Add tags" - autocomplete not explicitly required
- Performance: One less API call per form render
- User behavior: Users will naturally standardize their own tag vocabulary over time
- Future enhancement: Add autocomplete API endpoint and UI if tag inconsistency becomes a problem

**Implementation**:
```typescript
const [tags, setTags] = useState<string[]>(task?.tags || []);
const [tagInput, setTagInput] = useState('');

const addTag = (tag: string) => {
  if (tag && !tags.includes(tag)) {
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
      placeholder="Type tag and press Enter"
    />
    <div>
      {tags.map(tag => (
        <span key={tag}>
          {tag}
          <button onClick={() => removeTag(tag)}>×</button>
        </span>
      ))}
    </div>
  </div>
);
```

---

## Research Conclusions

All technical decisions finalized:

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Database Migration | SQLModel server defaults | Simple, fits existing workflow |
| Search Strategy | ILIKE with trigram index | Sufficient for scale, simple syntax |
| Tags Storage | JSON column | Flexible, SQLModel native support |
| Filter State | React local state | Simple, meets all requirements |
| Tag Input | Free-text (Enter to add) | MVP approach, future autocomplete |

**No blockers identified**. Ready to proceed to Phase 1 (Data Model & API Contracts).
