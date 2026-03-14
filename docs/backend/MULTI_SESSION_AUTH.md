# Multi-Session Authentication Architecture

## Overview
This application **fully supports multiple independent sessions** across different browsers and devices. Each browser/tab maintains its own Firebase authentication session without interfering with other sessions.

## How It Works

### Browser-Specific Sessions
Firebase Authentication creates **browser-specific sessions**. Each browser has:
- Its own `auth` instance
- Its own authentication token stored in IndexedDB
- Its own `localStorage` for caching user profiles

### Example Scenarios

#### ✅ Scenario 1: Different Users, Different Browsers
- **Browser A (Chrome)**: `user@example.com` logs in → User Dashboard
- **Browser B (Firefox)**: `admin@example.com` logs in → Admin Panel
- **Result**: Both sessions remain active simultaneously

#### ✅ Scenario 2: Same User, Different Devices
- **Device A (Laptop)**: `user@example.com` logs in
- **Device B (Mobile)**: `user@example.com` logs in
- **Result**: Both devices maintain independent sessions

#### ✅ Scenario 3: Admin + User Sessions
- **Browser A**: Regular user logs in → Can access `/dashboard`, `/projects`, etc.
- **Browser B**: Admin logs in → Can access `/admin/*` routes
- **Result**: No interference; both sessions work independently

### What Does NOT Happen

❌ **Admin login does NOT**:
- Invalidate user sessions in other browsers
- Trigger global logout
- Revoke tokens from other sessions
- Affect any other active sessions

❌ **User login does NOT**:
- Close admin sessions
- Force re-authentication in other browsers
- Overwrite other sessions' data

## Technical Implementation

### 1. Firebase Auth State Management
```typescript
// Each browser has its own onAuthStateChanged listener
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    // This only fires for THIS browser's session
    setUser(currentUser);
    if (currentUser) {
      await fetchProfile(currentUser.uid);
    }
  });
  return () => unsubscribe();
}, []);
```

### 2. Role-Based Access Control
```typescript
// ProtectedRoute checks role WITHOUT logging anyone out
if (requireAdmin && userRole !== 'admin') {
  // Redirect to dashboard (NO logout)
  return <Navigate to="/dashboard" replace />;
}
```

### 3. Independent Sign-In
```typescript
const signIn = async (email: string, password: string) => {
  // Creates session ONLY for this browser
  const result = await signInWithEmailAndPassword(auth, email, password);
  // Other browsers remain unaffected
};
```

### 4. Browser-Only Sign-Out
```typescript
const signOut = async () => {
  // Signs out ONLY this browser/tab
  await firebaseSignOut(auth);
  // Other sessions continue normally
};
```

## Data Storage

### localStorage Keys
- `user_profile`: Stores cached profile data **per browser**
  - Browser A has its own `user_profile`
  - Browser B has its own `user_profile`
  - They never conflict or overwrite each other

### Firestore
- Stores user profiles in `users` collection
- `lastLogin` timestamp updates when any browser logs in
- No session invalidation logic exists in backend

## Backend Verification

✅ **No global logout mechanisms**:
- No `auth.revokeRefreshTokens()` calls
- No token invalidation on new login
- No session tracking that forces single-session

✅ **Pure role-based access**:
- JWT tokens verified independently per request
- Role checked from user profile in Firestore
- No session state stored in backend

## Testing Multiple Sessions

### Test Case 1: User + Admin
1. Open Chrome → Log in as `user@example.com`
2. Open Firefox → Log in as `admin@example.com`
3. Switch back to Chrome → Verify user session still active
4. Refresh both browsers → Both sessions persist

### Test Case 2: Same User, Different Browsers
1. Open Chrome → Log in as `user@example.com`
2. Open Firefox → Log in as `user@example.com`
3. In Chrome, navigate to Profile page
4. In Firefox, navigate to Projects page
5. Both should work independently

### Test Case 3: Logout Isolation
1. Browser A: Log in as User
2. Browser B: Log in as Admin
3. In Browser A: Click Logout
4. Check Browser B: Admin session remains active ✅

## Key Principles

1. **Firebase handles session isolation natively** - We leverage this, not fight it
2. **No shared mutable state** across browsers (each has its own localStorage)
3. **Role-based routing** prevents unauthorized access without logging anyone out
4. **Backend is stateless** regarding sessions - only validates tokens per request

## For Developers

When adding new features:
- ✅ Use `useAuthContext()` to get current session data
- ✅ Check `profile.role` for access control
- ✅ Trust Firebase's session management
- ❌ Never call `signOut(auth)` globally or conditionally
- ❌ Don't store session state in backend
- ❌ Don't try to "sync" sessions across browsers

## Summary

This architecture ensures **true multi-session support**:
- Multiple users can use the platform simultaneously
- Admin can monitor while users work
- Testing is easier (admin + user views open at once)
- Real-world usage matches expectations

**Bottom line**: Firebase Authentication is designed for this. We simply respect its session model instead of trying to override it.
