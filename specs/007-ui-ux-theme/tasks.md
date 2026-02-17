# Tasks: UI/UX Enhancement, Homepage, and Theme System

**Input**: Design documents from `/specs/007-ui-ux-theme/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create frontend/components/SearchBar directory structure
- [x] T002 Create frontend/components/FilterPanel directory structure
- [x] T003 Create frontend/components/SortSelector directory structure
- [x] T004 Create frontend/components/PriorityBadge directory structure
- [x] T005 Create frontend/components/TagChip directory structure
- [x] T006 Create frontend/components/ThemeToggle directory structure
- [x] T007 Create frontend/contexts directory structure
- [x] T008 Create frontend/styles directory structure

**Checkpoint**: All directory structures ready for component development

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T009 [P] Create ThemeContext to manage theme state (light/dark) in frontend/contexts/ThemeContext.tsx
- [x] T010 [P] Add ThemeProvider to app layout in frontend/app/layout.tsx
- [x] T011 [P] Create global CSS variables for theme system in frontend/styles/globals.css
- [x] T012 [P] Update tailwind.config.ts to support theme variables
- [x] T013 [P] Update types/Task.ts to include priority and tags in existing Task interface
- [x] T014 [P] Create types/Theme.ts with Theme type definition
- [x] T015 [P] Create theme constants and utilities in frontend/lib/theme.ts

**Checkpoint**: Foundation ready - theme system available, all user stories can now proceed

---

## Phase 3: User Story 1 - Public Homepage Experience (Priority: P1) 🎯 MVP

**Goal**: As a first-time visitor, I want to understand what this app does and why I should use it, so I can decide whether to sign up.

**Independent Test**: Visit homepage without login, understand app purpose, click "Get Started" button and navigate to signup.

### Implementation for US1

- [x] T016 [P] [US1] Create public homepage at frontend/app/page.tsx with hero section and value proposition
- [x] T017 [P] [US1] Add "Get Started" button linking to signup page in homepage component
- [x] T018 [US1] Add "Login" button linking to login page in homepage component
- [x] T019 [US1] Create feature highlights section showcasing app capabilities in homepage
- [x] T020 [US1] Create how-it-works section with 3 simple steps in homepage
- [x] T021 [US1] Add visual preview/mockup of dashboard interface in homepage
- [x] T022 [US1] Add footer with app identity and credits to homepage
- [x] T023 [P] [US1] Add static generation for SEO optimization to homepage

**Checkpoint**: Homepage functional - new visitors can understand app value and navigate to signup

---

## Phase 4: User Story 2 - Theme Switching (Priority: P1)

**Goal**: As a user, I want to switch between light and dark modes, so I can use the app comfortably in different lighting conditions.

**Independent Test**: Toggle theme preference, verify all UI elements change appropriately and preference persists after refresh.

### Implementation for US2

- [x] T024 [P] [US2] Create ThemeToggle component with light/dark mode switch in frontend/components/ThemeToggle/ThemeToggle.tsx
- [x] T025 [US2] Integrate ThemeToggle into dashboard header layout
- [x] T026 [US2] Integrate ThemeToggle into homepage header layout
- [x] T027 [US2] Add localStorage persistence for theme preference
- [x] T028 [US2] Add theme-aware styling to all UI components using CSS variables
- [x] T029 [US2] Test theme switching across all application pages

**Checkpoint**: Theme switching complete - users can toggle between light/dark modes with persistence

---

## Phase 5: User Story 3 - Improved Task Card Layout (Priority: P2)

**Goal**: As a user, I want to quickly scan and understand my tasks, so I can prioritize and manage them efficiently.

**Independent Test**: View task list, quickly identify task status, priority, and tags with improved visual hierarchy.

### Implementation for US3

- [x] T030 [P] [US3] Create PriorityBadge component with visual indicators (high=red, medium=yellow, low=blue) in frontend/components/PriorityBadge/PriorityBadge.tsx
- [x] T031 [P] [US3] Create TagChip component to display tags as badges in frontend/components/TagChip/TagChip.tsx
- [x] T032 [US3] Update TaskCard component to display priority badge using PriorityBadge component
- [x] T033 [US3] Update TaskCard component to display tags using TagChip components
- [x] T034 [US3] Improve visual hierarchy and spacing in TaskCard layout
- [x] T035 [US3] Add distinct styling for completed vs pending tasks in TaskCard
- [x] T036 [US3] Test task card display with various priority and tag combinations

**Checkpoint**: Improved task cards - visual hierarchy enhanced with priority badges and tag chips

---

## Phase 6: User Story 4 - Enhanced Task Form (Priority: P2)

**Goal**: As a user, I want to create and edit tasks with a clean, intuitive interface, so I can add information efficiently.

**Independent Test**: Open task form, see clean layout with proper spacing, clear input fields, and intuitive controls.

### Implementation for US4

- [x] T037 [P] [US4] Add priority dropdown field to TaskForm with high/medium/low options in frontend/components/TaskForm/TaskForm.tsx
- [x] T038 [P] [US4] Add tag input field with add/remove functionality to TaskForm
- [x] T039 [US4] Update TaskForm to include priority in create/update API calls
- [x] T040 [US4] Update TaskForm to include tags in create/update API calls
- [x] T041 [US4] Style TaskForm with consistent spacing and clean layout
- [x] T042 [US4] Add visual feedback for tag input and priority selection
- [x] T043 [US4] Test task creation with priority and tags in TaskForm

**Checkpoint**: Enhanced task form - clean interface with priority dropdown and tag input

---

## Phase 7: User Story 5 - Search, Filter, and Sort Controls (Priority: P3)

**Goal**: As a user, I want to search, filter, and sort my tasks, so I can find and organize them efficiently.

**Independent Test**: Apply search term, verify only matching tasks appear; apply filters, verify correct subsets display; change sort order, verify tasks reorder appropriately.

### Backend Integration (no new endpoints needed - query parameters already exist from Feature 006)

- [x] T044 [P] [US5] Update useTasks hook to accept query parameters (search, status, priority, tags, sort) in frontend/hooks/useTasks.ts
- [x] T045 [P] [US5] Update api client functions to pass query parameters to API calls in frontend/lib/api.ts

### Frontend Implementation

- [x] T046 [P] [US5] Create SearchBar component with debounced input (300ms) in frontend/components/SearchBar/SearchBar.tsx
- [x] T047 [P] [US5] Create FilterPanel component with status/priority/tag dropdowns in frontend/components/FilterPanel/FilterPanel.tsx
- [x] T048 [P] [US5] Create SortSelector component with sort options (date/alpha/priority) in frontend/components/SortSelector/SortSelector.tsx
- [x] T049 [US5] Integrate SearchBar into dashboard page layout
- [x] T050 [US5] Integrate FilterPanel into dashboard page layout
- [x] T051 [US5] Integrate SortSelector into dashboard page layout
- [x] T052 [US5] Add state management for search, filters, and sort in dashboard page
- [x] T053 [US5] Connect search input to task filtering logic
- [x] T054 [US5] Connect filter dropdowns to task filtering logic
- [x] T055 [US5] Connect sort selector to task sorting logic
- [x] T056 [US5] Add "Clear Filters" button functionality
- [x] T057 [US5] Test search functionality with various keywords
- [x] T058 [US5] Test filter combinations (status + priority + tags)
- [x] T059 [US5] Test sort ordering (date, alpha, priority)

**Checkpoint**: Complete search/filter/sort functionality - users can efficiently find and organize tasks

---

## Phase 8: User Story 5 (Continued) - Responsive Design & Accessibility (Priority: P3)

**Goal**: As a user, I want the app to work well on different devices and be accessible, so I can use it reliably in various contexts.

**Independent Test**: Use app on different screen sizes, verify layout adapts properly and keyboard navigation works.

### Implementation

- [x] T060 [P] [US5] Add responsive layout classes to homepage for mobile/tablet/desktop
- [x] T061 [P] [US5] Add responsive layout classes to dashboard and task components
- [x] T062 [US5] Implement keyboard navigation for all interactive elements
- [x] T063 [US5] Add ARIA labels and attributes for accessibility
- [x] T064 [US5] Test color contrast ratios in both themes (4.5:1 minimum)
- [x] T065 [US5] Test focus indicators for keyboard navigation
- [x] T066 [US5] Verify mobile layout on 320px-768px screen sizes
- [x] T067 [US5] Verify tablet layout on 768px-1024px screen sizes
- [x] T068 [US5] Verify desktop layout on 1024px+ screen sizes

**Checkpoint**: Responsive and accessible - app works on all devices with proper accessibility

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final quality checks

- [x] T069 [P] Add empty state messages when search returns no results
- [x] T070 [P] Add loading states for search/filter operations
- [x] T071 [P] Add error handling for theme switching operations
- [x] T072 [P] Optimize CSS bundle size for theme variables
- [x] T073 [P] Add analytics/tracking for feature usage (search, filters, theme toggle)
- [x] T074 [P] Create documentation for new components and patterns
- [x] T075 Run comprehensive testing of all features together
- [x] T076 Verify all acceptance criteria from spec.md are met
- [x] T077 Manual testing of complete user flows
- [x] T078 Performance testing with 100+ tasks
- [x] T079 Accessibility audit using automated tools

**Checkpoint**: All features polished and integrated - complete, production-ready implementation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies - can start after Foundational phase
- **User Story 2 (P1)**: No dependencies - can start after Foundational phase
- **User Story 3 (P2)**: No dependencies - can start after Foundational phase
- **User Story 4 (P2)**: No dependencies - can start after Foundational phase
- **User Story 5 (P3)**: Depends on TaskForm (US4) and TaskCard (US3) for full functionality

### Within Each User Story

**User Story 1** (T016-T023):
- T016 (homepage creation) must complete before other homepage tasks
- T017-T022 can run in parallel (all homepage sections)

**User Story 2** (T024-T029):
- T024 (ThemeToggle component) can run parallel to T009-T015 (theme foundation)
- T025-T026 (integration) after T024 and foundational tasks complete

**User Story 3** (T030-T036):
- T030-T031 (components) can run in parallel
- T032-T033 (integration) after component creation
- T034-T036 (styling) after integration

**User Story 4** (T037-T043):
- T037-T040 (form updates) can run in parallel
- T041-T043 (styling/testing) after core updates

**User Story 5** (T044-T059):
- T044-T045 (hook/client updates) can run parallel to T046-T048 (component creation)
- T049-T052 (integration) after both above sets complete
- T053-T059 (connection/testing) after integration

### Parallel Opportunities

**Within Foundational Phase (T009-T015)**:
- T009-T012 can ALL run in parallel (different files, no conflicts)
- T013-T015 can run in parallel (different concerns)

**Across User Stories**:
- US1 (Homepage) and US2 (Theme) can run in parallel after foundational
- US3 (Task Cards) and US4 (Task Form) can run in parallel
- US5 (Search/Filter/Sort) can start after US3/US4 foundation is laid

---

## Parallel Example: User Story 5 (Search/Filter/Sort)

```bash
# Develop components in parallel:
Task T046: "Create SearchBar component with debounced input in frontend/components/SearchBar/SearchBar.tsx"
Task T047: "Create FilterPanel component with dropdowns in frontend/components/FilterPanel/FilterPanel.tsx"
Task T048: "Create SortSelector component with options in frontend/components/SortSelector/SortSelector.tsx"

# Update API/hook in parallel:
Task T044: "Update useTasks hook to accept query parameters in frontend/hooks/useTasks.ts"
Task T045: "Update api client to pass query parameters in frontend/lib/api.ts"

# Integrate components:
Task T049: "Integrate SearchBar into dashboard layout"
Task T050: "Integrate FilterPanel into dashboard layout"
Task T051: "Integrate SortSelector into dashboard layout"

# Add state management and connection:
Task T052: "Add state management for search/filters/sort in dashboard"
Task T053-T055: "Connect UI to filtering logic"
Task T056: "Add Clear Filters functionality"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

**Why**: P1 priorities deliver core value (public visibility + user comfort) with minimal complexity

1. Complete Phase 1: Setup (T001-T008) → ~15 minutes
2. Complete Phase 2: Foundational (T009-T015) → ~30 minutes
3. Complete Phase 3: User Story 1 - Homepage (T016-T023) → ~2 hours
4. Complete Phase 4: User Story 2 - Theme (T024-T029) → ~1.5 hours
5. **STOP and VALIDATE**: Test homepage conversion and theme functionality
6. Deploy/demo MVP → New visitors can understand app value, existing users can customize appearance

**MVP Deliverables**:
- ✅ Public homepage with clear value proposition
- ✅ Theme switching with persistence
- ✅ Light and dark modes with proper contrast

### Incremental Delivery

1. **Foundation** (Phases 1-2) → Theme system ready
2. **MVP** (Phases 3-4) → Homepage + theme → Deploy/Demo
3. **Enhanced** (Phase 5) → Search/Filter/Sort → Deploy/Demo
4. **Complete** (Phase 6) → Full accessibility → Deploy/Demo
5. **Polished** (Phase 7) → Performance + quality → Production ready

### Parallel Team Strategy

With 2-3 developers after Foundational phase:

**Week 1** (Foundation + MVP):
- Team completes Setup + Foundational together (T001-T015)
- Developer A: User Story 1 (Homepage) - Components + Integration
- Developer B: User Story 2 (Theme) - Components + Integration
- Integration: Both stories tested together

**Week 2** (Enhanced + Complete):
- Developer A: User Story 3 (Task Cards) - Components + Updates
- Developer B: User Story 4 (Task Form) - Updates + Testing
- Developer C: User Story 5 (Search/Filter) - Backend + Frontend
- Integration: All stories work together

**Week 3** (Polish + Deploy):
- Developer A: Polish and accessibility (T060-T068)
- Developer B: Testing and performance (T069-T079)
- Final validation and deployment

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (TDD approach)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence