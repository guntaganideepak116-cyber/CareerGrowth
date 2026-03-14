# Field-Based Assessment Access Control - Implementation Guide

## 🎯 Objective

Implement access control that requires users to complete a Basic Assessment before accessing field-specific sections:
- Specializations
- Career Paths  
- Roadmaps
- Projects
- Certifications

## ✅ Implementation Status

### Completed Components

1. **`AssessmentGate.tsx`** ✅
   - Location: `frontend/src/components/field-assessment/AssessmentGate.tsx`
   - Blocks access until assessment is attempted
   - Shows modal with "Take Assessment" CTA
   - Grants access after ANY attempt (pass or fail)

2. **Assessment Threshold Updated** ✅
   - Changed from 75% to 50% passing score
   - Files updated:
     - `AssessmentResults.tsx` - Display logic
     - `useFieldAssessment.ts` - Submission logic

### Access Control Logic

```typescript
// Access Rules:
if (!status?.hasAttempted) {
  // Block access - show modal
  return <AccessDeniedModal />;
} else {
  // Grant access (regardless of pass/fail)
  return <>{children}</>;
}
```

### Assessment Status Structure

```typescript
interface FieldAssessmentStatus {
  fieldId: string;
  hasAttempted: boolean;  // Key field for access control
  hasPassed: boolean;     // score >= 50%
  score?: number;         // 0-100
  lastAttemptDate?: Date;
  attemptsCount: number;
}
```

## 📝 Integration Steps

### Step 1: Wrap Protected Pages

Each protected page needs to be wrapped with `AssessmentGate`:

```typescript
import { AssessmentGate } from '@/components/field-assessment/AssessmentGate';

export default function ProtectedPage() {
  const { profile } = useAuthContext();
  
  if (!profile?.field) return null;
  
  return (
    <DashboardLayout>
      <AssessmentGate fieldId={profile.field} sectionName="Section Name">
        {/* Page content here */}
      </AssessmentGate>
    </DashboardLayout>
  );
}
```

### Step 2: Pages to Protect

Apply `AssessmentGate` to these pages:

1. **Specializations** (`frontend/src/pages/Specializations.tsx`)
   ```typescript
   <AssessmentGate fieldId={profile.field} sectionName="Specializations">
   ```

2. **Career Paths** (`frontend/src/pages/CareerPaths.tsx`)
   ```typescript
   <AssessmentGate fieldId={profile.field} sectionName="Career Paths">
   ```

3. **Roadmap** (`frontend/src/pages/Roadmap.tsx`)
   ```typescript
   <AssessmentGate fieldId={profile.field} sectionName="Roadmaps">
   ```

4. **Projects** (`frontend/src/pages/Projects.tsx`)
   ```typescript
   <AssessmentGate fieldId={profile.field} sectionName="Projects">
   ```

5. **Certifications** (`frontend/src/pages/Certifications.tsx`)
   ```typescript
   <AssessmentGate fieldId={profile.field} sectionName="Certifications">
   ```

## 🔧 Implementation Template

### For Each Protected Page:

```typescript
// 1. Add import at top
import { AssessmentGate } from '@/components/field-assessment/AssessmentGate';

// 2. Wrap the main content (after DashboardLayout)
export default function PageName() {
  const { profile, loading } = useAuthContext();
  
  if (loading) {
    return <DashboardLayout><LoadingSpinner /></DashboardLayout>;
  }
  
  if (!profile?.field) {
    return null; // or redirect to /fields
  }
  
  return (
    <DashboardLayout>
      <AssessmentGate 
        fieldId={profile.field} 
        sectionName="Page Name"
      >
        {/* ALL EXISTING PAGE CONTENT GOES HERE */}
        {/* No changes to existing UI needed */}
      </AssessmentGate>
    </DashboardLayout>
  );
}
```

## 🎨 User Experience Flow

### Scenario 1: No Assessment Attempt
```
User selects field → Navigates to Specializations
  ↓
AssessmentGate checks status
  ↓
No attempt found
  ↓
Show modal: "Assessment Required"
  ↓
User clicks "Take Assessment"
  ↓
Redirect to /field-assessment?field={fieldId}
  ↓
User completes assessment
  ↓
Redirect back to Specializations
  ↓
Access granted ✅
```

### Scenario 2: Assessment Completed (Pass)
```
User navigates to any protected section
  ↓
AssessmentGate checks status
  ↓
hasAttempted = true, score >= 50%
  ↓
Access granted immediately ✅
  ↓
Show "Field Ready" badge
```

### Scenario 3: Assessment Completed (Fail)
```
User navigates to any protected section
  ↓
AssessmentGate checks status
  ↓
hasAttempted = true, score < 50%
  ↓
Access granted immediately ✅
  ↓
Show recommendations for improvement
```

## 🔒 Security Implementation

### Frontend Protection
- `AssessmentGate` component checks Firestore
- Blocks rendering until status verified
- Prevents direct URL access

### Backend Protection (Optional Enhancement)
Create middleware to verify assessment status:

```typescript
// backend/src/middleware/assessmentCheck.ts
export async function requireAssessment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userId, fieldId } = req.body;
  
  const assessmentRef = db
    .collection('users')
    .doc(userId)
    .collection('assessments')
    .doc(fieldId);
    
  const doc = await assessmentRef.get();
  
  if (!doc.exists) {
    return res.status(403).json({
      error: 'Assessment required',
      message: 'Complete the field assessment to access this resource'
    });
  }
  
  next();
}
```

### API Routes to Protect
```typescript
// Specializations API
router.get('/specializations/:fieldId', 
  verifyToken, 
  requireAssessment, 
  getSpecializations
);

// Career Paths API
router.get('/career-paths/:fieldId', 
  verifyToken, 
  requireAssessment, 
  getCareerPaths
);

// Roadmaps API
router.get('/roadmaps/:fieldId', 
  verifyToken, 
  requireAssessment, 
  getRoadmaps
);
```

## 📊 Database Schema

### Firestore Structure
```
users/
  {userId}/
    assessments/
      {fieldId}/
        score: 65                    // 0-100
        status: "passed"             // "passed" | "needs_improvement"
        totalQuestions: 10
        correctAnswers: 7
        attemptDate: Timestamp
        attemptsCount: 1
        timeSpent: 420               // seconds
        answers: [
          {
            questionId: "q1",
            selectedOption: 2,
            isCorrect: true
          },
          ...
        ]
        updatedAt: Timestamp
```

## 🎯 Assessment Rules

### Passing Criteria
- **Threshold**: 50% (5/10 questions)
- **Status**: `score >= 50` → "passed"
- **Status**: `score < 50` → "needs_improvement"

### Access Criteria
- **Block**: `hasAttempted === false`
- **Allow**: `hasAttempted === true` (regardless of pass/fail)

### Messaging
- **Score >= 50%**: 
  - "Assessment cleared. You now have full access."
  - Show "Field Ready" badge
  
- **Score < 50%**:
  - "Assessment completed. Please improve your basics to build a stronger foundation."
  - Show improvement recommendations
  - Still grant access to all sections

## 🧪 Testing Checklist

### Test Case 1: New User (No Assessment)
- [ ] Navigate to Specializations
- [ ] Verify modal appears
- [ ] Click "Take Assessment"
- [ ] Verify redirect to assessment page
- [ ] Complete assessment
- [ ] Verify redirect back to Specializations
- [ ] Verify access granted

### Test Case 2: User with Passing Score
- [ ] Navigate to any protected section
- [ ] Verify immediate access
- [ ] Verify no modal shown
- [ ] Verify "Field Ready" badge visible

### Test Case 3: User with Failing Score
- [ ] Navigate to any protected section
- [ ] Verify immediate access
- [ ] Verify no modal shown
- [ ] Verify improvement recommendations shown

### Test Case 4: Direct URL Access
- [ ] Manually navigate to `/specializations`
- [ ] Verify AssessmentGate still blocks if no attempt
- [ ] Verify cannot bypass via URL

### Test Case 5: Multiple Fields
- [ ] Complete assessment for Field A
- [ ] Switch to Field B
- [ ] Verify blocked for Field B sections
- [ ] Complete Field B assessment
- [ ] Verify access granted for Field B
- [ ] Verify Field A access still works

## 🚀 Deployment Steps

1. **Verify AssessmentGate Component** ✅
   - File exists and is correct
   
2. **Update Assessment Threshold** ✅
   - Changed to 50% in all files

3. **Wrap Protected Pages** ⏳
   - Add AssessmentGate to 5 pages
   - Test each page individually

4. **Test Access Control** ⏳
   - Run through all test cases
   - Verify no bypasses

5. **Add Backend Protection** (Optional)
   - Create middleware
   - Protect API routes

6. **Deploy to Production**
   - Test in staging first
   - Monitor for issues

## 📝 Code Examples

### Example: Specializations Page (Corrected)

```typescript
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuthContext } from '@/contexts/AuthContext';
import { AssessmentGate } from '@/components/field-assessment/AssessmentGate';
// ... other imports

export default function Specializations() {
  const { user, profile, loading } = useAuthContext();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
    if (!loading && !profile?.field) {
      navigate('/fields');
    }
  }, [user, profile, loading, navigate]);
  
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </DashboardLayout>
    );
  }
  
  if (!profile?.field) {
    return null;
  }
  
  return (
    <DashboardLayout>
      <AssessmentGate fieldId={profile.field} sectionName="Specializations">
        <div className="max-w-7xl mx-auto space-y-8 pb-24">
          {/* ALL EXISTING CONTENT - NO CHANGES */}
          <h1>Specializations in {profile.field}</h1>
          {/* ... rest of existing code ... */}
        </div>
      </AssessmentGate>
    </DashboardLayout>
  );
}
```

## ⚠️ Important Notes

1. **Do NOT modify existing UI** - Only wrap with AssessmentGate
2. **Field ID is required** - Always pass `profile.field`
3. **Section name for UX** - Use descriptive names in modal
4. **Loading states** - Handle before AssessmentGate check
5. **Null checks** - Verify `profile?.field` exists

## 🐛 Troubleshooting

### Issue: Modal shows even after assessment
**Solution**: Check Firestore - ensure `hasAttempted` is `true`

### Issue: Can bypass via URL
**Solution**: Verify AssessmentGate wraps ALL content, not just part

### Issue: Loading loop
**Solution**: Ensure loading check happens BEFORE AssessmentGate

### Issue: Wrong field assessment checked
**Solution**: Verify passing correct `fieldId` prop

## ✅ Success Criteria

- [ ] All 5 pages protected with AssessmentGate
- [ ] Modal appears for users without assessment
- [ ] Access granted after any attempt (pass or fail)
- [ ] No UI changes to existing pages
- [ ] Cannot bypass via direct URL
- [ ] Works across multiple fields
- [ ] Loading states handled correctly
- [ ] No console errors

---

**Status**: AssessmentGate component ready ✅  
**Next Step**: Wrap the 5 protected pages  
**Estimated Time**: 15-20 minutes for integration + testing
