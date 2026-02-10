# Onboarding Fixes

## 1. Redirect New Users to Onboarding
- **Issue**: Previously, `Signup.tsx` was redirecting new users directly to `/dashboard`, bypassing the onboarding flow.
- **Fix**: Updated both Email/Password signup and Google Sign-In to navigate to `/onboarding` immediately after account creation.
- **Result**: Every new user will now land on the Onboarding page first.

## 2. Clean Form State
- **Issue**: The form had potential default values (e.g., `openToNewSkills` defaulting to `true`) that might look like pre-filled data.
- **Fix**: Changed initialization state of `openToNewSkills` to `false` in `Onboarding.tsx`. ALSO updated the fetch logic to only apply existing values if explicitly present, defaulting to `false` otherwise.
- **Result**: New users see a completely empty, neutral form with no assumptions made.

## How to Test
1. Create a **new account** via Signup.
2. Confirm you are redirected to `/onboarding` (not Dashboard).
3. Verify the form is empty:
   - Stream: Select placeholder visible
   - Subjects: None selected
   - Open to new skills: Unchecked
