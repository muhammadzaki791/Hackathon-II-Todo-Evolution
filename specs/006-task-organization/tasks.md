# Tasks: Task Organization & Usability Enhancements

**Input**: Design documents from `/specs/006-task-organization/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api-endpoints.md

**Tests**: Tests are included per constitution Section IV (Test-Driven Development requirement).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: No new infrastructure needed - extending existing application

*No setup tasks required - all infrastructure exists from previous features*

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data model changes that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T001 [P] Add priority field (string enum, default="medium") to Task model in backend/models.py with server_default
- [x] T002 [P] Add tags field (JSON array, default=[]) to Task model in backend/models.py with server_default
- [x] T003 [P] Update TaskCreate schema to accept priority and tags fields (both optional with defaults) in backend/schemas.py
- [x] T004 [P] Update TaskUpdate schema to accept priority and tags fields (both optional) in backend/schemas.py
- [x] T005 [P] Update TaskResponse schema to include priority and tags fields in backend/schemas.py
- [x] T006 [P] Update Task interface to include priority and tags fields in frontend/types/Task.ts
- [x] T007 [P] Update TaskCreate interface to include optional priority and tags in frontend/types/Task.ts
- [x] T008 [P] Update TaskUpdate interface to include optional priority and tags in frontend/types/Task.ts
- [x] T009 Restart backend to trigger SQLModel migration (adds priority and tags columns to database)
- [x] T010 Verify existing tasks now have priority="medium" and tags=[] via database query or GET endpoint

**Checkpoint**: Foundation ready - data model updated, all user stories can now proceed ✅

---

## Phase 3: User Story 1 - Task Search and Discovery (Priority: P1) 🎯 MVP

**Goal**: Users can quickly find tasks by searching keywords in title/description

**Independent Test**: Create 15 tasks with varied titles, search for "groceries", verify only matching tasks appear

### Backend Implementation for US1

- [x] T011 [P] [US1] Add search query parameter (Optional[str]) to GET /tasks endpoint in backend/routes/tasks.py
- [x] T012 [P] [US1] Implement ILIKE search logic (title OR description contains keyword) in backend/routes/tasks.py
- [x] T013 [P] [US1] Add case-insensitive partial matching using SQLModel or_ and ilike() in backend/routes/tasks.py
- [ ] T014 [P] [US1] Write backend test for search with single keyword in backend/tests/test_tasks.py
- [ ] T015 [P] [US1] Write backend test for case-insensitive search in backend/tests/test_tasks.py
- [ ] T016 [P] [US1] Write backend test for empty search (returns all tasks) in backend/tests/test_tasks.py

### Frontend Implementation for US1

- [x] T017 [P] [US1] Create SearchBar component with debounced input (300ms) in frontend/components/SearchBar/SearchBar.tsx
- [x] T018 [P] [US1] Add searchQuery state to dashboard page in frontend/app/dashboard/page.tsx
- [x] T019 [US1] Update useTasks hook to accept search parameter and pass to API in frontend/hooks/useTasks.ts
- [x] T020 [US1] Update api.getTasks() to accept and encode search query parameter in frontend/lib/api.ts
- [x] T021 [US1] Integrate SearchBar into dashboard layout (above task list) in frontend/app/dashboard/page.tsx
- [x] T022 [US1] Add empty state message "No tasks found matching '[keyword]'" when search returns no results in frontend/app/dashboard/page.tsx
- [ ] T023 [P] [US1] Write component test for SearchBar (debounce, clear, onChange) in frontend/tests/components/SearchBar.test.tsx
- [ ] T024 [US1] Write E2E test for search flow (type keyword, verify filtered results) in frontend/tests/e2e/task-organization.spec.ts

**Checkpoint**: Search functionality complete - users can find tasks by keyword

---

## Phase 4: User Story 2 - Task Priority Management (Priority: P1)

**Goal**: Users can assign and visualize priority levels (high/medium/low) on tasks

**Independent Test**: Create tasks with different priorities, verify red/yellow/blue badges display correctly

### Backend Implementation for US2

- [ ] T025 [P] [US2] Add priority validation in TaskCreate schema (pattern regex for high/medium/low) in backend/schemas.py
- [ ] T026 [P] [US2] Add priority validation in TaskUpdate schema in backend/schemas.py
- [ ] T027 [P] [US2] Write backend test for creating task with high priority in backend/tests/test_tasks.py
- [ ] T028 [P] [US2] Write backend test for updating task priority in backend/tests/test_tasks.py
- [ ] T029 [P] [US2] Write backend test for default priority (medium) when not specified in backend/tests/test_tasks.py
- [ ] T030 [P] [US2] Write backend test for invalid priority value (expect 400) in backend/tests/test_tasks.py

### Frontend Implementation for US2

- [x] T031 [P] [US2] Create PriorityBadge component (high=red, medium=yellow, low=blue) in frontend/components/PriorityBadge/PriorityBadge.tsx
- [x] T032 [US2] Add priority dropdown to TaskForm (High, Medium, Low options, default Medium) in frontend/components/TaskForm/TaskForm.tsx
- [x] T033 [US2] Add priority state to TaskForm and include in create/update API calls in frontend/components/TaskForm/TaskForm.tsx
- [x] T034 [US2] Integrate PriorityBadge into TaskCard (display above title) in frontend/components/TaskCard/TaskCard.tsx
- [ ] T035 [P] [US2] Write component test for PriorityBadge (renders correct colors) in frontend/tests/components/PriorityBadge.test.tsx
- [ ] T036 [US2] Write E2E test for priority assignment (create high-priority task, verify red badge) in frontend/tests/e2e/task-organization.spec.ts

**Checkpoint**: Priority management complete - users can assign and see task priorities

---

## Phase 5: User Story 3 - Task Filtering by Status and Priority (Priority: P2)

**Goal**: Users can filter tasks by status (pending/completed) and priority level

**Independent Test**: Create 15 tasks (10 pending, 5 completed, mixed priorities), apply filters, verify correct subsets display

### Backend Implementation for US3

- [x] T037 [P] [US3] Add status query parameter to GET /tasks endpoint in backend/routes/tasks.py
- [x] T038 [P] [US3] Add priority query parameter to GET /tasks endpoint in backend/routes/tasks.py
- [x] T039 [US3] Implement status filter logic (completed = status == "completed") in backend/routes/tasks.py
- [x] T040 [US3] Implement priority filter logic (priority == value) in backend/routes/tasks.py
- [x] T041 [US3] Implement combined filter logic (AND across all filters) in backend/routes/tasks.py
- [ ] T042 [P] [US3] Write backend test for status filter (pending only) in backend/tests/test_tasks.py
- [ ] T043 [P] [US3] Write backend test for priority filter (high only) in backend/tests/test_tasks.py
- [ ] T044 [P] [US3] Write backend test for combined filters (pending + high priority) in backend/tests/test_tasks.py

### Frontend Implementation for US3

- [x] T045 [P] [US3] Create FilterPanel component with status and priority dropdowns in frontend/components/FilterPanel/FilterPanel.tsx
- [x] T046 [US3] Add filter state (status, priority) to dashboard page in frontend/app/dashboard/page.tsx
- [x] T047 [US3] Update useTasks hook to accept status and priority parameters in frontend/hooks/useTasks.ts
- [x] T048 [US3] Update api.getTasks() to encode status and priority query parameters in frontend/lib/api.ts
- [x] T049 [US3] Integrate FilterPanel into dashboard layout (below SearchBar) in frontend/app/dashboard/page.tsx
- [x] T050 [US3] Add "Clear Filters" button that resets all filters to default in frontend/components/FilterPanel/FilterPanel.tsx
- [ ] T051 [P] [US3] Write component test for FilterPanel (dropdowns, clear button) in frontend/tests/components/FilterPanel.test.tsx
- [ ] T052 [US3] Write E2E test for filtering (apply filters, verify correct tasks shown) in frontend/tests/e2e/task-organization.spec.ts

**Checkpoint**: Status and priority filtering complete - users can create focused task views

---

## Phase 6: User Story 4 - Task Categorization with Tags (Priority: P2)

**Goal**: Users can organize tasks using custom tags and filter by tag

**Independent Test**: Create tasks with tags ("work", "home", "urgent"), filter by "work", verify only work tasks display

### Backend Implementation for US4

- [x] T053 [P] [US4] Add tags query parameter to GET /tasks endpoint in backend/routes/tasks.py
- [x] T054 [US4] Implement tag filter logic using JSON containment operator (@>) in backend/routes/tasks.py
- [x] T055 [US4] Add tags validation in TaskCreate schema (max 20 tags, each 1-50 chars) in backend/schemas.py
- [x] T056 [US4] Add tags validation in TaskUpdate schema in backend/schemas.py
- [ ] T057 [P] [US4] Write backend test for creating task with multiple tags in backend/tests/test_tasks.py
- [ ] T058 [P] [US4] Write backend test for filtering by single tag in backend/tests/test_tasks.py
- [ ] T059 [P] [US4] Write backend test for updating task tags in backend/tests/test_tasks.py

### Frontend Implementation for US4

- [x] T060 [P] [US4] Create TagChip component to display single tag as badge in frontend/components/TagChip/TagChip.tsx
- [x] T061 [US4] Add tag input field to TaskForm (type and press Enter to add) in frontend/components/TaskForm/TaskForm.tsx
- [x] T062 [US4] Add tag removal functionality (click X on chip) in TaskForm in frontend/components/TaskForm/TaskForm.tsx
- [x] T063 [US4] Add tags state to TaskForm and include in create/update API calls in frontend/components/TaskForm/TaskForm.tsx
- [x] T064 [US4] Display TagChip array in TaskCard (wrap to multiple lines if needed) in frontend/components/TaskCard/TaskCard.tsx
- [x] T065 [US4] Add tag filter dropdown to FilterPanel (populated from visible tasks) in frontend/components/FilterPanel/FilterPanel.tsx
- [x] T066 [US4] Update useTasks hook to accept tags parameter in frontend/hooks/useTasks.ts
- [x] T067 [US4] Update api.getTasks() to encode tags query parameter in frontend/lib/api.ts
- [ ] T068 [P] [US4] Write component test for TagChip (display, remove button) in frontend/tests/components/TagChip.test.tsx
- [ ] T069 [US4] Write E2E test for tag management (add tags, filter by tag) in frontend/tests/e2e/task-organization.spec.ts

**Checkpoint**: Tag categorization complete - users can organize and filter tasks by context

---

## Phase 7: User Story 5 - Task Sorting and Organization (Priority: P3)

**Goal**: Users can sort tasks by creation date, alphabetical order, or priority

**Independent Test**: Create 10 tasks with varied properties, apply each sort option, verify correct ordering

### Backend Implementation for US5

- [x] T070 [P] [US5] Add sort query parameter to GET /tasks endpoint (default="date") in backend/routes/tasks.py
- [x] T071 [US5] Implement sort by date (created_at DESC) in backend/routes/tasks.py
- [x] T072 [US5] Implement sort by alpha (title ASC) in backend/routes/tasks.py
- [x] T073 [US5] Implement sort by priority (CASE statement for high/medium/low, secondary sort by date) in backend/routes/tasks.py
- [ ] T074 [P] [US5] Write backend test for sort by date in backend/tests/test_tasks.py
- [ ] T075 [P] [US5] Write backend test for sort by alphabetical in backend/tests/test_tasks.py
- [ ] T076 [P] [US5] Write backend test for sort by priority with secondary date sort in backend/tests/test_tasks.py
- [ ] T077 [P] [US5] Write backend test for sort combined with filters in backend/tests/test_tasks.py

### Frontend Implementation for US5

- [x] T078 [P] [US5] Create SortSelector component (dropdown with date/alpha/priority options) in frontend/components/SortSelector/SortSelector.tsx
- [x] T079 [US5] Add sortOrder state to dashboard page (default="date") in frontend/app/dashboard/page.tsx
- [x] T080 [US5] Update useTasks hook to accept sort parameter in frontend/hooks/useTasks.ts
- [x] T081 [US5] Update api.getTasks() to encode sort query parameter in frontend/lib/api.ts
- [x] T082 [US5] Integrate SortSelector into dashboard layout (next to filters) in frontend/app/dashboard/page.tsx
- [ ] T083 [P] [US5] Write component test for SortSelector (dropdown, onChange) in frontend/tests/components/SortSelector.test.tsx
- [ ] T084 [US5] Write E2E test for sorting (apply each sort option, verify order) in frontend/tests/e2e/task-organization.spec.ts

**Checkpoint**: All 5 user stories complete - full search/filter/sort functionality working

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final quality checks

- [ ] T085 [P] Add comprehensive backend test for all query parameter combinations in backend/tests/test_tasks.py
- [ ] T086 [P] Add backward compatibility test (old API calls without new fields) in backend/tests/test_tasks.py
- [ ] T087 [P] Add performance test (100+ tasks with filters) in backend/tests/test_tasks.py
- [x] T088 [P] Verify empty state handling (no tasks match search/filters) in frontend/app/dashboard/page.tsx
- [x] T089 [P] Add loading state for filter changes (debounced API calls) in frontend/app/dashboard/page.tsx
- [ ] T090 [P] Verify mobile responsiveness of new UI controls (SearchBar, FilterPanel, SortSelector)
- [ ] T091 [P] Add accessibility attributes to new components (aria-labels, keyboard navigation)
- [ ] T092 [P] Write E2E test for complete workflow (search → filter → sort → create with priority/tags → edit) in frontend/tests/e2e/task-organization.spec.ts
- [ ] T093 Run full test suite (backend pytest + frontend jest + playwright E2E)
- [ ] T094 Verify all acceptance criteria from spec.md are met
- [ ] T095 Manual testing of edge cases (special characters in search, many tags, etc.)
- [ ] T096 Performance validation (verify <1 second for 100+ tasks with filters)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No tasks - infrastructure exists
- **Foundational (Phase 2)**: No dependencies - can start immediately - **BLOCKS all user stories**
- **User Stories (Phase 3-7)**: All depend on Foundational phase (T001-T010) completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (US1 → US2 → US3 → US4 → US5)
- **Polish (Phase 8)**: Depends on all 5 user stories being complete

### User Story Dependencies

- **User Story 1 (P1) - Search**: Can start after Foundational (T010) - No dependencies on other stories
- **User Story 2 (P1) - Priority**: Can start after Foundational (T010) - No dependencies on other stories
- **User Story 3 (P2) - Filters**: Can start after Foundational (T010) - Integrates with US1 (search) and US2 (priority) but independently testable
- **User Story 4 (P2) - Tags**: Can start after Foundational (T010) - Integrates with US3 (tag filter) but independently testable
- **User Story 5 (P3) - Sorting**: Can start after Foundational (T010) - Works with all previous stories but independently testable

### Within Each User Story

**User Story 1** (T011-T024):
- Backend tests (T014-T016) can run in parallel BEFORE implementation
- Backend implementation (T011-T013) can run in parallel (same file, related logic)
- Frontend components (T017) independent of backend
- Frontend integration (T018-T022) after backend complete
- Frontend tests (T023-T024) can run in parallel

**User Story 2** (T025-T036):
- Backend tests (T027-T030) can run in parallel BEFORE implementation
- Backend validation (T025-T026) can run in parallel
- Frontend component (T031) independent of backend
- Frontend form integration (T032-T033) can be done together
- Frontend display (T034) after form complete
- Frontend tests (T035-T036) can run in parallel

**User Story 3** (T037-T052):
- Backend parameters (T037-T038) can run in parallel
- Backend filter logic (T039-T041) must be sequential (same function)
- Backend tests (T042-T044) can run in parallel
- Frontend component (T045) independent of backend
- Frontend integration (T046-T049) sequential (state → hook → API → UI)
- Frontend clear filters (T050) can be added anytime after T045
- Frontend tests (T051-T052) can run in parallel

**User Story 4** (T053-T069):
- Backend parameter (T053) and filter logic (T054) sequential
- Backend validation (T055-T056) can run in parallel
- Backend tests (T057-T059) can run in parallel
- Frontend TagChip (T060) independent of backend
- Frontend form integration (T061-T063) sequential (related state/logic)
- Frontend display (T064) after T060 complete
- Frontend filter dropdown (T065) after T064
- Frontend hook/API updates (T066-T067) can be done together
- Frontend tests (T068-T069) can run in parallel

**User Story 5** (T070-T084):
- Backend parameter (T070) and sort logic (T071-T073) sequential (same function, 3 sort types)
- Backend tests (T074-T077) can run in parallel
- Frontend component (T078) independent of backend
- Frontend integration (T079-T082) sequential (state → hook → API → UI)
- Frontend tests (T083-T084) can run in parallel

### Parallel Opportunities

**Within Foundational Phase (T001-T010)**:
- T001-T008 can ALL run in parallel (different files, no conflicts)
- T009-T010 must be sequential (restart → verify)

**Within User Story 1**:
```bash
# Backend tests in parallel (BEFORE implementation):
parallel T014 T015 T016

# Backend implementation in parallel (related logic, same file):
parallel T011 T012 T013

# Frontend components in parallel:
parallel T017 T023

# After backend complete, frontend integration:
sequential T019 T020 T021 T022

# Final tests:
T024
```

**Across User Stories** (after Foundational complete):
- US1 (T011-T024) and US2 (T025-T036) can proceed in parallel (different files)
- US3 (T037-T052), US4 (T053-T069), US5 (T070-T084) can start in parallel after US1/US2 or run sequentially

**Within Polish Phase (T085-T096)**:
- T085-T088, T090-T092 can ALL run in parallel
- T089 depends on filter components existing
- T093-T096 must be sequential (test → verify → manual → performance)

---

## Parallel Example: Foundational Phase

```bash
# Launch all model/schema updates together:
Task T001: "Add priority field to Task model in backend/models.py"
Task T002: "Add tags field to Task model in backend/models.py"
Task T003: "Update TaskCreate schema in backend/schemas.py"
Task T004: "Update TaskUpdate schema in backend/schemas.py"
Task T005: "Update TaskResponse schema in backend/schemas.py"
Task T006: "Update Task interface in frontend/types/Task.ts"
Task T007: "Update TaskCreate interface in frontend/types/Task.ts"
Task T008: "Update TaskUpdate interface in frontend/types/Task.ts"

# Then restart and verify:
Task T009: "Restart backend"
Task T010: "Verify migration"
```

---

## Parallel Example: User Story 1 (Search)

```bash
# Write backend tests first (all in parallel):
Task T014: "Backend test for search with single keyword"
Task T015: "Backend test for case-insensitive search"
Task T016: "Backend test for empty search"

# Implement backend (all in parallel, same function):
Task T011: "Add search query parameter to GET /tasks"
Task T012: "Implement ILIKE search logic"
Task T013: "Add case-insensitive partial matching"

# Create frontend components (in parallel with backend):
Task T017: "Create SearchBar component"
Task T023: "Write SearchBar component test"

# After backend complete, integrate frontend:
Task T019: "Update useTasks hook"
Task T020: "Update api.getTasks()"
Task T021: "Integrate SearchBar into dashboard"
Task T022: "Add empty state message"

# Final E2E test:
Task T024: "Write E2E test for search flow"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

**Why**: P1 priorities deliver core value (search + priority) with minimal complexity

1. Complete Phase 2: Foundational (T001-T010) → ~30 minutes
2. Complete Phase 3: User Story 1 - Search (T011-T024) → ~2 hours
3. Complete Phase 4: User Story 2 - Priority (T025-T036) → ~1.5 hours
4. **STOP and VALIDATE**: Test search and priority independently
5. Deploy/demo MVP → Users can search tasks and assign priorities

**MVP Deliverables**:
- ✅ Task search by keyword
- ✅ Priority assignment (high/medium/low)
- ✅ Priority visual indicators (colored badges)
- ✅ Backward compatible with existing tasks

### Incremental Delivery

1. **Foundation** (Phase 2) → Data model ready
2. **MVP** (Phases 3-4) → Search + Priority → Deploy/Demo
3. **Enhanced** (Phase 5) → Add Filters → Deploy/Demo
4. **Full** (Phase 6) → Add Tags → Deploy/Demo
5. **Complete** (Phase 7) → Add Sorting → Deploy/Demo
6. **Polished** (Phase 8) → Final quality checks → Production ready

Each increment adds value without breaking previous functionality.

### Parallel Team Strategy

With 2-3 developers after Foundational phase:

**Week 1** (Foundation + MVP):
- Team completes Foundational together (T001-T010)
- Developer A: User Story 1 (Search) - Backend + Frontend
- Developer B: User Story 2 (Priority) - Backend + Frontend
- Integration: Both stories tested together

**Week 2** (Enhanced + Full):
- Developer A: User Story 3 (Filters) - Builds on US1 + US2
- Developer B: User Story 4 (Tags) - Independent feature
- Integration: All 4 stories tested together

**Week 3** (Complete + Polish):
- Developer A: User Story 5 (Sorting)
- Developer B: Polish tasks (T085-T096)
- Final testing and deployment

---

## Task Summary

**Total Tasks**: 96 tasks

**By Phase**:
- Phase 1 (Setup): 0 tasks
- Phase 2 (Foundational): 10 tasks (T001-T010) ← BLOCKS ALL
- Phase 3 (US1 - Search): 14 tasks (T011-T024)
- Phase 4 (US2 - Priority): 12 tasks (T025-T036)
- Phase 5 (US3 - Filters): 16 tasks (T037-T052)
- Phase 6 (US4 - Tags): 17 tasks (T053-T069)
- Phase 7 (US5 - Sorting): 15 tasks (T070-T084)
- Phase 8 (Polish): 12 tasks (T085-T096)

**By Component**:
- Backend: 38 tasks (model, schemas, routes, tests)
- Frontend: 46 tasks (types, API, components, tests)
- Integration/E2E: 5 tasks
- Polish: 7 tasks

**Parallel Opportunities**:
- Foundational phase: 8 tasks can run in parallel (T001-T008)
- User Story 1: 7 tasks can run in parallel
- User Story 2: 6 tasks can run in parallel
- User Story 3: 7 tasks can run in parallel
- User Story 4: 7 tasks can run in parallel
- User Story 5: 7 tasks can run in parallel
- Polish phase: 9 tasks can run in parallel

**Critical Path**:
- Foundational (10 tasks) → US1 Backend (3 tasks) → US1 Frontend Integration (4 tasks) → ~4 hours minimum
- Full feature: ~15-20 hours (if done sequentially)
- With parallelization: ~8-10 hours (2-3 developers)

---

## Notes

- [P] tasks = different files or independent logic, no blocking dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Tests written BEFORE implementation (TDD per constitution Section IV)
- Foundational phase MUST complete before any user story work
- After Foundational, all 5 user stories can start in parallel
- MVP = Foundational + US1 + US2 (search + priority) ← Recommend this scope
- Stop at any checkpoint to validate story independently
- Backward compatibility verified throughout implementation
