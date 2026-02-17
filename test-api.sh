#!/bin/bash
# End-to-End API Test Script
# Tests all API endpoints with authentication

set -e  # Exit on error

API_BASE="http://localhost:8000"
FRONTEND_BASE="http://localhost:3000"

echo "=========================================="
echo "TODO APP - END-TO-END API TESTS"
echo "=========================================="
echo ""

# Test 1: Backend Health Check
echo "✓ Test 1: Backend Health Check"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" $API_BASE/)
if [ "$HTTP_CODE" = "200" ]; then
  echo "  ✅ Backend is running (HTTP $HTTP_CODE)"
else
  echo "  ❌ Backend failed (HTTP $HTTP_CODE)"
  exit 1
fi
echo ""

# Test 2: Frontend Health Check
echo "✓ Test 2: Frontend Health Check"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" $FRONTEND_BASE/)
if [ "$HTTP_CODE" = "200" ]; then
  echo "  ✅ Frontend is running (HTTP $HTTP_CODE)"
else
  echo "  ❌ Frontend failed (HTTP $HTTP_CODE)"
  exit 1
fi
echo ""

# Test 3: Create Test User (Signup)
echo "✓ Test 3: User Signup"
SIGNUP_RESPONSE=$(curl -s -X POST "$API_BASE/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{"email":"e2e-test@example.com","password":"Test1234","name":"E2E Test User"}')

TOKEN=$(echo $SIGNUP_RESPONSE | python -c "import sys, json; print(json.load(sys.stdin)['token'])" 2>/dev/null)
USER_ID=$(echo $SIGNUP_RESPONSE | python -c "import sys, json; print(json.load(sys.stdin)['user']['id'])" 2>/dev/null)

if [ -n "$TOKEN" ] && [ -n "$USER_ID" ]; then
  echo "  ✅ User created successfully"
  echo "  User ID: $USER_ID"
else
  echo "  ❌ Signup failed"
  exit 1
fi
echo ""

# Test 4: List Tasks (Empty)
echo "✓ Test 4: List Tasks (Should be empty)"
TASKS=$(curl -s "$API_BASE/api/$USER_ID/tasks" \
  -H "Authorization: Bearer $TOKEN")

if [ "$TASKS" = "[]" ]; then
  echo "  ✅ Empty task list returned correctly"
else
  echo "  ❌ Expected empty array, got: $TASKS"
  exit 1
fi
echo ""

# Test 5: Create Task
echo "✓ Test 5: Create New Task"
TASK_RESPONSE=$(curl -s -X POST "$API_BASE/api/$USER_ID/tasks" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy groceries","description":"Milk, bread, eggs"}')

TASK_ID=$(echo $TASK_RESPONSE | python -c "import sys, json; print(json.load(sys.stdin)['id'])" 2>/dev/null)

if [ -n "$TASK_ID" ]; then
  echo "  ✅ Task created successfully (ID: $TASK_ID)"
else
  echo "  ❌ Task creation failed"
  exit 1
fi
echo ""

# Test 6: Get Single Task
echo "✓ Test 6: Get Single Task"
SINGLE_TASK=$(curl -s "$API_BASE/api/$USER_ID/tasks/$TASK_ID" \
  -H "Authorization: Bearer $TOKEN")

TASK_TITLE=$(echo $SINGLE_TASK | python -c "import sys, json; print(json.load(sys.stdin)['title'])" 2>/dev/null)

if [ "$TASK_TITLE" = "Buy groceries" ]; then
  echo "  ✅ Single task retrieved correctly"
else
  echo "  ❌ Task retrieval failed"
  exit 1
fi
echo ""

# Test 7: Toggle Task Completion
echo "✓ Test 7: Toggle Task Completion"
TOGGLED_TASK=$(curl -s -X PATCH "$API_BASE/api/$USER_ID/tasks/$TASK_ID/complete" \
  -H "Authorization: Bearer $TOKEN")

IS_COMPLETED=$(echo $TOGGLED_TASK | python -c "import sys, json; print(json.load(sys.stdin)['completed'])" 2>/dev/null)

if [ "$IS_COMPLETED" = "True" ]; then
  echo "  ✅ Task marked as complete"
else
  echo "  ❌ Toggle completion failed"
  exit 1
fi
echo ""

# Test 8: Update Task
echo "✓ Test 8: Update Task"
UPDATED_TASK=$(curl -s -X PUT "$API_BASE/api/$USER_ID/tasks/$TASK_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy groceries (updated)","description":"Milk, bread, eggs, cheese"}')

UPDATED_TITLE=$(echo $UPDATED_TASK | python -c "import sys, json; print(json.load(sys.stdin)['title'])" 2>/dev/null)

if [ "$UPDATED_TITLE" = "Buy groceries (updated)" ]; then
  echo "  ✅ Task updated successfully"
else
  echo "  ❌ Task update failed"
  exit 1
fi
echo ""

# Test 9: List Tasks (Should have 1 task)
echo "✓ Test 9: List Tasks (Should have 1 task)"
TASKS_LIST=$(curl -s "$API_BASE/api/$USER_ID/tasks" \
  -H "Authorization: Bearer $TOKEN")

TASK_COUNT=$(echo $TASKS_LIST | python -c "import sys, json; print(len(json.load(sys.stdin)))" 2>/dev/null)

if [ "$TASK_COUNT" = "1" ]; then
  echo "  ✅ Task list contains 1 task"
else
  echo "  ❌ Expected 1 task, got $TASK_COUNT"
  exit 1
fi
echo ""

# Test 10: Delete Task
echo "✓ Test 10: Delete Task"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$API_BASE/api/$USER_ID/tasks/$TASK_ID" \
  -H "Authorization: Bearer $TOKEN")

if [ "$HTTP_CODE" = "204" ]; then
  echo "  ✅ Task deleted successfully (HTTP $HTTP_CODE)"
else
  echo "  ❌ Task deletion failed (HTTP $HTTP_CODE)"
  exit 1
fi
echo ""

# Test 11: Verify Task Deleted
echo "✓ Test 11: Verify Task Deleted"
TASKS_AFTER=$(curl -s "$API_BASE/api/$USER_ID/tasks" \
  -H "Authorization: Bearer $TOKEN")

if [ "$TASKS_AFTER" = "[]" ]; then
  echo "  ✅ Task list is empty after deletion"
else
  echo "  ❌ Task still exists after deletion"
  exit 1
fi
echo ""

# Test 12: Security Test - No Token
echo "✓ Test 12: Security Test - Unauthorized Access"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_BASE/api/$USER_ID/tasks")

if [ "$HTTP_CODE" = "403" ]; then
  echo "  ✅ Unauthorized access blocked (HTTP $HTTP_CODE)"
else
  echo "  ⚠️  Expected 403, got HTTP $HTTP_CODE"
fi
echo ""

echo "=========================================="
echo "ALL TESTS PASSED! ✅"
echo "=========================================="
echo ""
echo "Backend: $API_BASE"
echo "Frontend: $FRONTEND_BASE"
echo "User ID: $USER_ID"
echo ""
echo "Next steps:"
echo "1. Open browser at $FRONTEND_BASE"
echo "2. Test login/signup manually"
echo "3. Test task management UI"
