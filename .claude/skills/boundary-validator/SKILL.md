---
name: boundary-validator
description: |
  This skill ensures strict architectural boundaries between frontend, backend, and database
  layers. It enforces separation of concerns and prevents leakage of responsibilities across
  layers.

  Use this skill when reviewing cross-layer changes or full-stack features.

  This skill protects long-term maintainability and scalability.
---

## When to Use
- After implementing full-stack features
- When adding new API routes
- When modifying database access logic
- During architecture reviews

## Validation Workflow
1. Identify responsibility of each layer
2. Verify frontend only communicates via API
3. Ensure backend contains all business logic
4. Confirm database access is ORM-based only
5. Check authentication is not handled in UI logic
6. Detect boundary violations or shortcuts

## Quality Criteria
- Frontend has no database or business logic
- Backend does not contain UI or presentation logic
- Database logic isolated in models/repositories
- APIs act as the only communication contract

## Output Format
- Verdict: ACCEPT | REJECT | ESCALATE
- Boundary Violations (if any)
- Affected Files or Layers
- Spec References
- Required Refactoring Actions
