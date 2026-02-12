# Quick Fix for "Failed to load questions" Error

## Problem
The error "Unexpected token '<', '<!DOCTYPE '... is not valid JSON" means the backend API is returning an HTML error page instead of JSON. This happens when:
1. The backend server needs to be restarted to load the new assessment routes
2. The database has no questions yet

## IMMEDIATE FIX (Use Frontend Questions Temporarily)

### Option 1: Restart Backend Server

```bash
# Stop the backend server (Ctrl+C in the terminal)
# Then restart it:
cd backend
npm run dev
```

**After restart, the `/api/assessment` routes should work.**

### Option 2: Use Frontend Questions (Temporary Fallback)

Update `frontend/src/pages/FieldAssessment.tsx`:

**Find this code** (around line 44-56):
```typescript
    // Load questions from backend when starting quiz
    const handleStartAssessment = async () => {
        setLoadingQuestions(true);
        try {
            const assessmentQuestions = await fetchQuestions();
            setQuestions(assessmentQuestions);
            setStage('quiz');
        } catch (error) {
            console.error('Error loading questions:', error);
            // Error toast already shown in hook
        } finally {
            setLoadingQuestions(false);
        }
    };
```

**Replace with this**:
```typescript
    // Load questions from backend when starting quiz
    const handleStartAssessment = async () => {
        setLoadingQuestions(true);
        try {
            // Try backend first
            const assessmentQuestions = await fetchQuestions();
            setQuestions(assessmentQuestions);
            setStage('quiz');
        } catch (error) {
            console.error('Backend fetch failed, using fallback:', error);
            
            // Use frontend fallback questions
            const { getAssessmentQuestions } = await import('@/data/assessmentQuestions');
            const fallbackQuestions = getAssessmentQuestions(fieldId, 10);
            
            if (fallbackQuestions && fallbackQuestions.length > 0) {
                toast.info('Using offline questions');
                setQuestions(fallbackQuestions);
                setStage('quiz');
            } else {
                toast.error('No questions available');
            }
        } finally {
            setLoadingQuestions(false);
        }
    };
```

**Also add this import at the top**:
```typescript
import { getAssessmentQuestions } from '@/data/assessmentQuestions';
```

## PERMANENT FIX

### Step 1: Restart Backend
```bash
cd backend
# Stop with Ctrl+C if running
npm run dev
```

### Step 2: Populate Database
```bash
cd backend
npx ts-node src/scripts/seedAssessmentQuestions.ts
```

### Step 3: Test API Endpoint

Open browser and go to:
```
http://localhost:5000/api/health
```

Should return: `{"status":"ok","timestamp":"..."}`

### Step 4: Check Backend Logs

When you click "Start Assessment", check the backend terminal for:
```
[Assessment] Fetching questions for field: engineering, user: ...
```

If you see this, the route is working.
If you see nothing, the route isn't registered.

## Verification

After fixing, you should see:
- ✅ Questions load successfully
- ✅ No "Unexpected token" error
- ✅ Backend logs show the API call
- ✅ Quiz starts normally

## If Still Not Working

### Check 1: Verify Routes are Registered

Open `backend/src/index.ts` and verify these lines exist:

```typescript
import assessmentRoutes from './routes/assessmentRoutes';
// ...
app.use('/api/assessment', assessmentRoutes);
```

### Check 2: Verify Backend Port

In `frontend/src/hooks/useFieldAssessment.ts`, check:
```typescript
const API_URL = 'http://localhost:5000/api/assessment';
```

Make sure port matches your backend (default is 5000).

### Check 3: CORS Issues

If you see CORS errors, add this to `backend/src/index.ts`:

```typescript
app.use(cors({
  origin: 'http://localhost:8080', // Your frontend URL
  credentials: true
}));
```

## Quick Test

Run this in browser console while on the assessment page:

```javascript
// Get your auth token
const user = firebase.auth().currentUser;
const token = await user.getIdToken();

// Test the API
fetch('http://localhost:5000/api/assessment/questions/engineering', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

If this returns questions, the API works!
If it returns HTML, the route isn't registered.

---

**Recommended Action**: 
1. Restart backend server
2. If still fails, use the fallback code above
3. Then populate database and test again
