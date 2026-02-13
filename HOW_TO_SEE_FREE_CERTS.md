# 🔧 How to See FREE Certifications

## The Issue
The old certifications (without FREE options) are cached in Firestore. Even though we updated the AI prompt, the cache is still serving old data.

## Solution: Force Regenerate

### **Option 1: Wait for Vercel Deployment (Recommended)**
1. Wait 2-3 minutes for Vercel to deploy
2. Go to your live site: https://your-site.vercel.app/certifications
3. The Vercel deployment will have a fresh Firestore instance
4. You'll see FREE certifications immediately

### **Option 2: Clear Browser Cache (Quick)**
1. Open Certifications page: http://localhost:8080/certifications
2. Press `Ctrl + Shift + R` (hard refresh)
3. Open DevTools (F12) → Console
4. You should see: `🤖 Fetching AI certifications for...`
5. Wait 10 seconds for AI to regenerate

### **Option 3: Delete Specific Cache Key (Manual)**
1. Go to Firebase Console: https://console.firebase.google.com
2. Navigate to Firestore Database
3. Find collection: `ai_generated_content`
4. Delete documents starting with `certifications_`
5. Refresh the Certifications page

### **Option 4: Use the API (Developer)**
```bash
# In a new terminal
cd backend
node clearCache.js
```

## What Changed

### **Backend Prompt Update:**
```typescript
Requirements:
1. **MUST include at least 4 FREE certifications** ✅
2. Include 2-3 affordable paid certifications ($50-$200)
3. Include 1-2 premium certifications ($200+)
4. Providers: Coursera, edX, Google, Microsoft, FreeCodeCamp
```

### **Frontend Button Update:**
```tsx
<Button variant="default" className="gap-2">
  <ExternalLink className="w-4 h-4" />
  Enroll Now
</Button>
```

## Expected Result

After clearing cache, you should see:
- ✅ **4+ FREE certifications** (Cost: "Free")
- ✅ **"Enroll Now" button** with external link icon
- ✅ **Real URLs** from Coursera, edX, Google Cloud, etc.
- ✅ **"Save" button** to bookmark certifications

## Verification

Check the browser console for:
```
🤖 Fetching AI certifications for engineering/cse...
✅ Got 8 AI-generated certifications
```

If you see this, the new prompt is working!
