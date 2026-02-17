---
name: spec-compliance-checker
description: |
  This skill is used to verify that an implementation strictly follows the written specifications
  defined using Spec-Kit Plus. It ensures traceability between specs and implementation and
  prevents undocumented or out-of-scope behavior.

  Use this skill after any feature, API, database, or UI implementation is completed.

  This skill enforces:
  - Alignment with feature specs
  - Fulfillment of acceptance criteria
  - No implementation without specification
  - Clear traceability between specs and code

  The skill outputs a structured compliance verdict.
---

## When to Use
- After implementing a feature
- After modifying an API or database schema
- Before marking a task or milestone as complete
- During final review before submission

## Validation Workflow
1. Read the referenced specification files
2. Identify explicit requirements and acceptance criteria
3. Compare implementation behavior against the spec
4. Detect missing, partial, or extra functionality
5. Verify naming, structure, and behavior consistency
6. Generate a compliance verdict

## Quality Criteria
- Every behavior must be defined in a spec
- All acceptance criteria must be met
- No undocumented features allowed
- Errors and edge cases must match the spec

## Output Format
- Verdict: ACCEPT | REJECT | ESCALATE
- Findings:
  - Missing requirements
  - Incorrect behavior
  - Out-of-scope logic
- Spec References:
  - Spec file paths and sections
- Required Actions:
  - Fixes or spec updates needed
