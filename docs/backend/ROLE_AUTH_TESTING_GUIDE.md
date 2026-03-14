# Role-Based Authentication - Testing Guide

## 🧪 Complete Testing Checklist

### Prerequisites
- Backend server running on `http://localhost:5000`
- Frontend running on `http://localhost:8080`
- Admin email configured: `guntaganideepak1234@gmail.com`
- Test user account created

---

## Test Suite 1: Admin Login & Sidebar

### Test 1.1: Admin Login Flow
**Steps:**
1. Navigate to `/login`
2. Enter admin credentials:
   - Email: `guntaganideepak1234@gmail.com`
   - Password: [admin password]
3. Click "Sign In"

**Expected Results:**
- ✅ Login successful toast appears
- ✅ Redirected to `/redirect`
- ✅ Then redirected to `/admin`
- ✅ **Admin sidebar is visible** (not user sidebar)
- ✅ Admin navigation items shown:
  - Overview
  - User Dashboard Control
  - User Activity
  - Field Insights
  - Roadmap Manager
  - Assessment Management
  - AI Usage Monitor
  - Notifications
  - Feedback & Reports
  - Career Paths
  - Security & Access
  - System Settings

**Console Logs to Verify:**
```
[Auth State Change] User: guntaganideepak1234@gmail.com
[Auth Init] ✅ Using cached profile: guntaganideepak1234@gmail.com Role: admin
[LoginRedirect] Redirecting admin to /admin
```

### Test 1.2: Admin Tries to Access User Routes
**Steps:**
1. While logged in as admin, manually navigate to `/dashboard`

**Expected Results:**
- ✅ Immediately redirected to `/admin`
- ✅ Admin sidebar remains visible
- ✅ No user sidebar shown

**Console Logs:**
```
[DashboardLayout] Admin user detected, redirecting to /admin
```

### Test 1.3: Admin Page Refresh
**Steps:**
1. While on `/admin`, press F5 to refresh

**Expected Results:**
- ✅ Page reloads
- ✅ Admin sidebar still visible
- ✅ Admin session persists
- ✅ No redirect to login

---

## Test Suite 2: User Login & Sidebar

### Test 2.1: User Login Flow
**Steps:**
1. Navigate to `/login`
2. Enter user credentials:
   - Email: [test user email]
   - Password: [user password]
3. Click "Sign In"

**Expected Results:**
- ✅ Login successful toast appears
- ✅ Redirected to `/redirect`
- ✅ Then redirected to `/dashboard`
- ✅ **User sidebar is visible** (not admin sidebar)
- ✅ User navigation items shown:
  - Dashboard
  - My Profile
  - Portfolio
  - Upgrade Plan
  - Field Selection
  - Specializations
  - Career Paths
  - Roadmap
  - Projects
  - Playground
  - Certifications
  - AI Mentor
  - Analytics
  - Notifications

**Console Logs:**
```
[Auth State Change] User: [user email]
[Auth Init] ✅ Using cached profile: [user email] Role: user
[LoginRedirect] Redirecting user to /dashboard
```

### Test 2.2: User Tries to Access Admin Routes
**Steps:**
1. While logged in as user, manually navigate to `/admin`

**Expected Results:**
- ✅ AdminGuard blocks access
- ✅ "Access Denied" screen shown
- ✅ Error message: "You do not have permission to access the admin dashboard"
- ✅ Buttons to return to dashboard or home

**Console Logs:**
```
[Admin Check] Access Denied - User: [user email] | Required: guntaganideepak1234@gmail.com
```

### Test 2.3: User Page Refresh
**Steps:**
1. While on `/dashboard`, press F5 to refresh

**Expected Results:**
- ✅ Page reloads
- ✅ User sidebar still visible
- ✅ User session persists
- ✅ No redirect to login

---

## Test Suite 3: Multiple Browser Sessions

### Test 3.1: Simultaneous User and Admin Sessions
**Setup:**
- Browser A: Chrome
- Browser B: Firefox (or Chrome Incognito)

**Steps:**

**In Browser A:**
1. Navigate to `/login`
2. Login with **user credentials**
3. Verify user dashboard and sidebar visible

**In Browser B (simultaneously):**
1. Navigate to `/login`
2. Login with **admin credentials**
3. Verify admin panel and sidebar visible

**Expected Results:**
- ✅ Browser A: User session remains active
- ✅ Browser A: User sidebar still visible
- ✅ Browser A: No logout or redirect
- ✅ Browser B: Admin session active
- ✅ Browser B: Admin sidebar visible
- ✅ **Both sessions work independently**

### Test 3.2: Logout in One Browser
**Steps:**
1. In Browser B (admin), click "Logout"
2. Check Browser A (user)

**Expected Results:**
- ✅ Browser B: Admin logged out, redirected to home
- ✅ Browser A: User session **still active**
- ✅ Browser A: User sidebar **still visible**
- ✅ Browser A: No logout or redirect

### Test 3.3: Multiple Tabs Same Browser
**Steps:**
1. Open Tab 1: Login as user
2. Open Tab 2 in same browser
3. Navigate to `/dashboard` in Tab 2

**Expected Results:**
- ✅ Tab 1: User session active
- ✅ Tab 2: Same user session (shared within browser)
- ✅ Both tabs show user sidebar
- ✅ Logout in one tab logs out both (same browser)

---

## Test Suite 4: Role Persistence

### Test 4.1: Admin Role Persists Across Refresh
**Steps:**
1. Login as admin
2. Close browser completely
3. Reopen browser
4. Navigate to `/admin`

**Expected Results:**
- ✅ Admin session restored from localStorage
- ✅ Admin sidebar visible
- ✅ No redirect to login
- ✅ Role: admin maintained

### Test 4.2: User Role Persists Across Refresh
**Steps:**
1. Login as user
2. Close browser completely
3. Reopen browser
4. Navigate to `/dashboard`

**Expected Results:**
- ✅ User session restored from localStorage
- ✅ User sidebar visible
- ✅ No redirect to login
- ✅ Role: user maintained

### Test 4.3: Clear Cache Requires Re-login
**Steps:**
1. Login as admin
2. Open DevTools → Application → Storage
3. Clear all storage (localStorage + IndexedDB)
4. Refresh page

**Expected Results:**
- ✅ Session cleared
- ✅ Redirected to `/login`
- ✅ Must login again

---

## Test Suite 5: Protected Routes

### Test 5.1: Unauthenticated Access to User Routes
**Steps:**
1. Ensure logged out
2. Navigate to `/dashboard`

**Expected Results:**
- ✅ Redirected to `/login`
- ✅ ProtectedRoute blocks access

### Test 5.2: Unauthenticated Access to Admin Routes
**Steps:**
1. Ensure logged out
2. Navigate to `/admin`

**Expected Results:**
- ✅ AdminGuard blocks access
- ✅ Redirected to `/login`
- ✅ Toast: "Please login to continue"

### Test 5.3: User Access to Specific Admin Pages
**Steps:**
1. Login as user
2. Try to navigate to:
   - `/admin/assessments`
   - `/admin/user-activity`
   - `/admin/settings`

**Expected Results:**
- ✅ All blocked by AdminGuard
- ✅ "Access Denied" screen shown
- ✅ Cannot access any admin page

---

## Test Suite 6: Edge Cases

### Test 6.1: Missing Role Field (Backward Compatibility)
**Steps:**
1. Manually remove `role` field from Firestore user document
2. Login with that user
3. Check behavior

**Expected Results:**
- ✅ Auto-migration adds role field
- ✅ Role set to 'user' (or 'admin' if email matches)
- ✅ Firestore updated with role
- ✅ Sidebar renders correctly

**Console Logs:**
```
[Migration] Adding role field to existing user profile
```

### Test 6.2: Invalid Role Value
**Steps:**
1. Manually set `role: 'invalid'` in Firestore
2. Login
3. Check behavior

**Expected Results:**
- ✅ Treated as regular user (defensive fallback)
- ✅ User sidebar shown
- ✅ Cannot access admin routes

### Test 6.3: Network Failure During Admin Check
**Steps:**
1. Login as admin
2. Stop backend server
3. Try to access admin page

**Expected Results:**
- ✅ AdminGuard shows error
- ✅ "Failed to verify admin access" toast
- ✅ Access denied screen

---

## Test Suite 7: Google Sign-In

### Test 7.1: Admin Google Sign-In
**Steps:**
1. Click "Sign in with Google"
2. Select admin Google account (`guntaganideepak1234@gmail.com`)

**Expected Results:**
- ✅ Login successful
- ✅ Profile created with `role: 'admin'`
- ✅ Redirected to `/admin`
- ✅ Admin sidebar visible

### Test 7.2: User Google Sign-In
**Steps:**
1. Click "Sign in with Google"
2. Select non-admin Google account

**Expected Results:**
- ✅ Login successful
- ✅ Profile created with `role: 'user'`
- ✅ Redirected to `/dashboard`
- ✅ User sidebar visible

---

## Test Suite 8: Assessment Management (Admin Only)

### Test 8.1: Admin Access to Assessment Management
**Steps:**
1. Login as admin
2. Navigate to `/admin/assessments`

**Expected Results:**
- ✅ Page loads successfully
- ✅ Assessment management interface visible
- ✅ Can view all fields
- ✅ Can add/edit/delete questions

### Test 8.2: User Cannot Access Assessment Management
**Steps:**
1. Login as user
2. Navigate to `/admin/assessments`

**Expected Results:**
- ✅ AdminGuard blocks access
- ✅ "Access Denied" screen shown

---

## Automated Testing Script

```javascript
// Run in browser console to verify role
const profile = JSON.parse(localStorage.getItem('user_profile'));
console.log('Current User:', {
  email: profile?.email,
  role: profile?.role,
  hasRole: !!profile?.role
});

// Verify Firebase auth
import { auth } from '@/lib/firebase';
console.log('Firebase User:', {
  email: auth.currentUser?.email,
  uid: auth.currentUser?.uid
});
```

---

## Common Issues & Solutions

### Issue: Admin sees user sidebar
**Diagnosis:**
- Check localStorage: `user_profile.role` should be 'admin'
- Check Firestore: `users/{uid}/role` should be 'admin'

**Solution:**
1. Clear localStorage
2. Logout and login again
3. Verify email matches `ADMIN_EMAIL`

### Issue: User can access admin routes
**Diagnosis:**
- AdminGuard not working
- Backend not running

**Solution:**
1. Verify backend is running
2. Check backend logs for admin check
3. Verify `ADMIN_EMAIL` in backend `.env`

### Issue: Sessions interfering
**Diagnosis:**
- Should NOT happen with current implementation
- Check for custom logout logic

**Solution:**
1. Verify no global `signOut()` calls
2. Check browser console for errors
3. Clear all browser data and test again

---

## Performance Checks

### Load Time
- ✅ Admin sidebar loads in < 500ms
- ✅ User sidebar loads in < 500ms
- ✅ Role check adds < 50ms overhead

### Memory Usage
- ✅ No memory leaks on role switching
- ✅ localStorage size < 10KB per user

### Network Requests
- ✅ Admin check: 1 request to `/api/admin/check`
- ✅ Profile fetch: 1 request to Firestore
- ✅ No unnecessary re-fetches

---

## Success Criteria

All tests must pass:
- ✅ Admin login shows admin sidebar
- ✅ User login shows user sidebar
- ✅ Admin cannot see user sidebar
- ✅ User cannot access admin routes
- ✅ Multiple browser sessions work independently
- ✅ Logout in one browser doesn't affect others
- ✅ Role persists across refresh
- ✅ Protected routes enforce access control
- ✅ Google sign-in works for both roles
- ✅ No console errors

---

## Test Report Template

```
Date: [Date]
Tester: [Name]
Environment: [Dev/Staging/Prod]

Test Suite 1: Admin Login & Sidebar
- Test 1.1: [PASS/FAIL]
- Test 1.2: [PASS/FAIL]
- Test 1.3: [PASS/FAIL]

Test Suite 2: User Login & Sidebar
- Test 2.1: [PASS/FAIL]
- Test 2.2: [PASS/FAIL]
- Test 2.3: [PASS/FAIL]

Test Suite 3: Multiple Browser Sessions
- Test 3.1: [PASS/FAIL]
- Test 3.2: [PASS/FAIL]
- Test 3.3: [PASS/FAIL]

[Continue for all test suites...]

Overall Result: [PASS/FAIL]
Issues Found: [List any issues]
Notes: [Additional observations]
```

---

**Testing Status**: Ready for execution
**Estimated Time**: 30-45 minutes for complete test suite
