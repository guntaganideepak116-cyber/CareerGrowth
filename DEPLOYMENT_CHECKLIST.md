# 🚀 Vercel Deployment - Quick Checklist

## ✅ Pre-Deployment Checklist

### Local Testing
- [ ] Frontend builds successfully: `cd frontend && npm run build`
- [ ] Backend builds successfully: `cd backend && npm run build`
- [ ] No TypeScript errors
- [ ] All tests passing (if any)
- [ ] Mobile responsiveness tested
- [ ] Firebase rules deployed

### Environment Variables Ready
- [ ] Firebase config values copied
- [ ] Firebase Service Account JSON minified
- [ ] Admin email configured
- [ ] API keys ready (OpenAI, Gemini - optional)

### Git & GitHub
- [ ] Code committed to Git
- [ ] Pushed to GitHub repository
- [ ] `.gitignore` includes sensitive files
- [ ] `vercel.json` created in backend folder

---

## 📋 Deployment Steps

### Step 1: GitHub Setup (5 minutes)
- [ ] Create GitHub repository
- [ ] Push code to GitHub
- [ ] Verify files are on GitHub

### Step 2: Deploy Frontend (10 minutes)
- [ ] Sign up/login to Vercel
- [ ] Import GitHub repository
- [ ] Set root directory to `frontend`
- [ ] Add all `VITE_*` environment variables
- [ ] Deploy frontend
- [ ] Copy frontend URL
- [ ] Test: Visit frontend URL

### Step 3: Deploy Backend (10 minutes)
- [ ] Create new Vercel project
- [ ] Import same GitHub repository
- [ ] Set root directory to `backend`
- [ ] Add backend environment variables
- [ ] Verify `FIREBASE_SERVICE_ACCOUNT_JSON` is minified
- [ ] Deploy backend
- [ ] Copy backend URL
- [ ] Test: Visit `backend-url/api/health`

### Step 4: Connect Frontend & Backend (5 minutes)
- [ ] Update `VITE_API_URL` in frontend env vars
- [ ] Set value to backend URL
- [ ] Redeploy frontend
- [ ] Test: Login on frontend

### Step 5: Firebase Configuration (5 minutes)
- [ ] Add Vercel domain to Firebase authorized domains
- [ ] Verify Firestore rules are deployed
- [ ] Test: Create account and login

### Step 6: Final Testing (10 minutes)
- [ ] Sign up works
- [ ] Login works
- [ ] Dashboard loads
- [ ] Profile page works
- [ ] Career paths load
- [ ] Mobile responsive
- [ ] Admin access works
- [ ] No console errors

---

## 🎯 Quick Commands

### Build Locally
```bash
# Frontend
cd frontend
npm install
npm run build

# Backend
cd backend
npm install
npm run build
```

### Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push
```

### Get Firebase Config
1. Firebase Console → Project Settings
2. Your apps → Web app
3. Copy config values

### Minify Service Account JSON
1. Firebase Console → Service accounts
2. Generate new private key
3. Go to https://jsonminifier.com
4. Paste JSON → Copy minified version

---

## 🔗 Important URLs

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Firebase Console:** https://console.firebase.google.com
- **GitHub:** https://github.com
- **JSON Minifier:** https://jsonminifier.com

---

## ⏱️ Estimated Time

| Step | Time |
|------|------|
| Pre-deployment prep | 15 min |
| GitHub setup | 5 min |
| Frontend deployment | 10 min |
| Backend deployment | 10 min |
| Connection & testing | 15 min |
| **Total** | **~55 minutes** |

---

## 🎉 Success Criteria

Your deployment is successful when:

✅ Frontend URL loads without errors
✅ Backend health endpoint returns `{"status": "ok"}`
✅ Login works on production
✅ Dashboard displays data
✅ Mobile responsive
✅ No console errors
✅ Admin access works

---

## 🆘 Quick Troubleshooting

### Frontend won't load
- Check build logs in Vercel
- Verify environment variables
- Check browser console for errors

### Backend returns errors
- Check function logs in Vercel
- Verify `FIREBASE_SERVICE_ACCOUNT_JSON`
- Test `/api/health` endpoint

### Can't login
- Add domain to Firebase authorized domains
- Check CORS settings in backend
- Verify `VITE_API_URL` is correct

### Data not loading
- Check Firestore rules are deployed
- Verify Firebase config in frontend
- Check network tab in DevTools

---

## 📞 Need Help?

Refer to the complete guide:
**`VERCEL_DEPLOYMENT_COMPLETE_GUIDE.md`**

---

**Ready to deploy? Let's go! 🚀**

**Estimated completion: 1 hour**
**Difficulty: Medium**
**Cost: Free (Vercel free tier)**
