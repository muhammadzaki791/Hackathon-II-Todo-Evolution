---
name: jwt-security-validator
description: |
  This skill validates JWT-based authentication and authorization across frontend and backend
  services. It ensures secure user isolation, correct token handling, and proper enforcement
  of protected API access.

  Use this skill whenever authentication, authorization, or API protection is implemented
  or modified.

  This skill focuses on correctness, security, and consistency of JWT usage.
---

## When to Use
- After implementing login/signup
- When securing API endpoints
- When verifying request authorization logic
- During backend security review

## Validation Workflow
1. Confirm JWT token is required for protected endpoints
2. Verify token signature using shared secret
3. Decode token payload and extract user identity
4. Ensure user identity matches request context
5. Validate token expiration handling
6. Confirm unauthorized requests return proper errors

## Quality Criteria
- All protected endpoints require Authorization header
- Invalid or missing tokens return 401 Unauthorized
- Token user ID must match resource ownership
- No data leakage between users
- Stateless verification (no frontend dependency)

## Output Format
- Verdict: PASS | FAIL
- Endpoint or Component Reviewed
- Security Checks Performed
- Issues Found (if any)
- Required Fixes or Improvements
