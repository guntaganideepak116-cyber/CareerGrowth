# Authentication Session Isolation - Testing Guide

## Quick Test Instructions

### Prerequisites
- Backend running on `http://localhost:5000`
- Frontend running on `http://localhost:5173` (or your dev server)
- Two different browsers (e.g., Chrome and Firefox) OR two browser profiles

---

## Test 1: Multi-Browser Session Isolation ✅

### Objective
Verify that Admin and User can be logged in simultaneously on different browsers without interference.

### Steps

#### Browser A (Chrome) - User Session
1. Open Chrome
2. Navigate to `http://localhost:5173`
3. Click "Sign Up" or "Login"
4. Login with a **regular user account** (not admin email)
5. Verify you're redirected to `/dashboard`
6. **Keep this browser open**

#### Browser B (Firefox) - Admin Session
1. Open Firefox
2. Navigate to `http://localhost:5173`
3. Click "Login"
4. Login with **admin email**: `guntaganideepak1234@gmail.com`
5. Verify you're redirected to `/dashboard`
6. Navigate to `/admin` to access admin dashboard
7. Verify admin dashboard loads successfully

#### Verification
- [ ] Both browsers remain logged in
- [ ] Chrome shows User dashboard
- [ ] Firefox shows Admin dashboard
- [ ] No logout occurred in either browser

#### Test Logout
1. In Firefox (Admin), click "Logout"
2. Verify Firefox is logged out
3. **Switch to Chrome (User)**
4. Verify User is **still logged in** ✅
5. Refresh the page
6. Verify User session persists ✅

### Expected Result
✅ **User session in Chrome is NOT affected by Admin logout in Firefox**

---

## Test 2: Same Browser, Different Tabs (Advanced)

### Objective
Verify that Admin and User profiles use separate localStorage keys in the same browser.

### Steps

#### Tab 1 - User Session
1. Open Chrome
2. Navigate to `http://localhost:5173`
3. Login as **regular user**
4. Open DevTools (F12)
5. Go to Application → Local Storage → `http://localhost:5173`
6. Verify you see: `user_profile` key with your profile data
7. **Keep this tab open**

#### Tab 2 - Check Storage
1. Open new tab in same Chrome window
2. Navigate to `http://localhost:5173`
3. Open DevTools (F12)
4. Go to Application → Local Storage → `http://localhost:5173`
5. Verify you see: `user_profile` key (same as Tab 1)

#### Verification
- [ ] `user_profile` key exists
- [ ] No `admin_profile` key exists (you're logged in as user)
- [ ] Profile data matches your user account

### Expected Result
✅ **User profile stored in `user_profile` localStorage key**

---

## Test 3: Role-Specific Storage Keys

### Objective
Verify that Admin and User use different localStorage keys.

### Steps

#### Part A - User Login
1. Open browser
2. Login as **regular user**
3. Open DevTools (F12) → Application → Local Storage
4. **Observe:** `user_profile` key exists
5. **Note:** No `admin_profile` key
6. Logout

#### Part B - Admin Login
1. In same browser, login as **admin** (`guntaganideepak1234@gmail.com`)
2. Open DevTools (F12) → Application → Local Storage
3. **Observe:** `admin_profile` key exists
4. **Note:** `user_profile` key may still exist (from previous login)

#### Part C - Verify Isolation
1. While logged in as Admin, check localStorage:
   - `admin_profile` → Contains admin profile data
   - `user_profile` → Contains old user profile data (if not cleared)
2. Logout as Admin
3. Check localStorage:
   - `admin_profile` → **Should be removed** ✅
   - `user_profile` → **Should still exist** (if it was there) ✅

### Expected Result
✅ **Admin logout only removes `admin_profile`, not `user_profile`**

---

## Test 4: Legacy Migration

### Objective
Verify that old `user_profile` storage is automatically migrated to role-based storage.

### Steps

#### Setup - Simulate Legacy Storage
1. Logout completely
2. Open DevTools (F12) → Console
3. Run this code to simulate legacy storage:
```javascript
localStorage.setItem('user_profile', JSON.stringify({
  id: 'test123',
  email: 'test@example.com',
  role: 'user',
  full_name: 'Test User'
}));
```
4. Refresh the page

#### Verification
1. Open DevTools → Application → Local Storage
2. **Before migration:** `user_profile` key exists
3. **After page load:** 
   - `user_profile` key should be **migrated**
   - Profile data preserved
4. Login normally
5. Verify profile data is intact

### Expected Result
✅ **Legacy storage automatically migrated without data loss**

---

## Test 5: Admin Route Protection

### Objective
Verify that only admin users can access admin routes.

### Steps

#### Part A - User Access Attempt
1. Login as **regular user**
2. Try to navigate to `/admin`
3. **Expected:** Redirected to `/dashboard` with error message
4. **Expected:** Toast notification: "Access Denied"

#### Part B - Admin Access
1. Logout
2. Login as **admin** (`guntaganideepak1234@gmail.com`)
3. Navigate to `/admin`
4. **Expected:** Admin dashboard loads successfully
5. **Expected:** Can access all admin routes:
   - `/admin/user-activity`
   - `/admin/field-insights`
   - `/admin/assessments`
   - etc.

### Expected Result
✅ **Admin routes protected - only admin can access**

---

## Test 6: Backend API Protection

### Objective
Verify that backend admin API routes require admin token.

### Steps

#### Setup
1. Login as **regular user**
2. Open DevTools (F12) → Console
3. Get your Firebase token:
```javascript
firebase.auth().currentUser.getIdToken().then(token => console.log(token));
```
4. Copy the token

#### Test Admin API
1. Open DevTools → Network tab
2. Try to call admin API:
```javascript
fetch('http://localhost:5000/api/admin/stats', {
  headers: { 'Authorization': 'Bearer YOUR_USER_TOKEN' }
})
.then(r => r.json())
.then(console.log);
```
3. **Expected Response:** 
```json
{
  "error": "Admin access required",
  "details": "You do not have admin privileges"
}
```
4. **Expected Status:** 403 Forbidden

#### Test with Admin Token
1. Logout and login as **admin**
2. Get admin token (same method as above)
3. Call admin API with admin token
4. **Expected:** Success response with stats data

### Expected Result
✅ **Admin API routes reject non-admin tokens**

---

## Test 7: Multi-Device Sessions

### Objective
Verify that sessions on different devices don't interfere.

### Steps

1. **Desktop:** Login as User
2. **Mobile/Tablet:** Login as Admin (or another User)
3. Verify both devices remain logged in
4. Logout on Desktop
5. Verify Mobile/Tablet session persists

### Expected Result
✅ **Device sessions are completely independent**

---

## Debugging Tools

### Check Current Storage
Open DevTools Console and run:
```javascript
// Check all auth-related storage
console.log('Admin Profile:', localStorage.getItem('admin_profile'));
console.log('User Profile:', localStorage.getItem('user_profile'));
console.log('Firebase User:', firebase.auth().currentUser);
```

### Clear All Auth Data (Emergency)
```javascript
// WARNING: This logs out all sessions
localStorage.removeItem('admin_profile');
localStorage.removeItem('user_profile');
firebase.auth().signOut();
```

### Check Current Role
```javascript
// See what role you're logged in as
const profile = JSON.parse(localStorage.getItem('user_profile') || localStorage.getItem('admin_profile'));
console.log('Current Role:', profile?.role);
console.log('Email:', profile?.email);
```

---

## Common Issues & Solutions

### Issue: "Still getting logged out when admin logs in"

**Check:**
1. Are you using the updated code?
2. Clear browser cache and localStorage
3. Verify `authStorage.ts` is being imported
4. Check console for migration messages

**Solution:**
```javascript
// Clear everything and start fresh
localStorage.clear();
// Reload page and login again
```

### Issue: "Can't access admin dashboard"

**Check:**
1. Are you logged in with admin email?
2. Check backend `.env` has correct `ADMIN_EMAIL`
3. Check browser console for errors
4. Verify backend is running

**Solution:**
- Ensure you're using: `guntaganideepak1234@gmail.com`
- Check backend logs for admin verification messages

### Issue: "localStorage shows both admin and user profiles"

**This is normal!** 
- If you logged in as both roles in the same browser
- Each role has its own key
- They don't interfere with each other
- Logout only removes the current role's key

---

## Success Criteria

All tests should pass with these results:

- ✅ Multi-browser sessions remain independent
- ✅ Admin logout doesn't affect User sessions
- ✅ User logout doesn't affect Admin sessions
- ✅ Role-specific localStorage keys used
- ✅ Legacy storage automatically migrated
- ✅ Admin routes protected from non-admin users
- ✅ Backend API rejects non-admin tokens
- ✅ Multi-device sessions work independently

---

## Production Readiness Checklist

Before deploying to production:

- [ ] All 7 tests pass successfully
- [ ] No console errors during login/logout
- [ ] Admin dashboard accessible only to admin
- [ ] User dashboard accessible to all users
- [ ] Backend admin API protected
- [ ] Legacy migration works correctly
- [ ] Multi-browser sessions tested
- [ ] Multi-device sessions tested

---

## Support

If you encounter issues:

1. Check browser console for errors
2. Check backend logs for auth messages
3. Verify environment variables are set
4. Review `AUTH_SESSION_ISOLATION.md` for architecture details
5. Review `IMPLEMENTATION_SUMMARY.md` for code changes

---

**Status:** Ready for Testing
**Last Updated:** 2026-02-09
