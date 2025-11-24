# Deployment Guide

## Netlify (Frontend - Auto Deploy)

### One-Time Setup:
1. Push your code to GitHub
2. Go to https://app.netlify.com
3. Click "Add new site" → "Import an existing project"
4. Connect to GitHub and select your repo
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Click "Deploy"

### After Setup:
✅ Every time you push to GitHub, Netlify auto-deploys!
❌ NO manual uploads needed!

---

## Hugging Face (AI Backend - Auto Deploy)

### One-Time Setup:
1. Go to https://huggingface.co/new-space
2. Create new Space:
   - Name: `ibrood-api`
   - SDK: `Gradio`
   - Hardware: `CPU basic` (free)
3. Connect to GitHub OR upload files from `/huggingface-deploy/`
4. Files needed:
   - app.py
   - best-seg.pt
   - requirements.txt

### After Setup:
✅ If connected to GitHub: Auto-deploys on push!
✅ If manual upload: Use git commands or web interface
❌ Model file (best-seg.pt) only upload ONCE (it's 6MB+)

---

## Recommended Setup

**For Development (localhost):**
- Frontend: `npm run dev` (localhost:3000)
- Backend: `python api/app.py` (localhost:5000)
- Change code → Save → Auto-refresh ✅

**For Production:**
- Frontend: Netlify (auto-deploy from GitHub)
- Backend: Hugging Face (auto-deploy from GitHub)
- Change code → Push to GitHub → Both auto-deploy ✅

---

## Quick Commands

### Connect to GitHub (One-Time):
```bash
cd c:\Users\ASUS\Downloads\ibrood-pwa
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### After Changes:
```bash
git add .
git commit -m "Your changes"
git push
```
✅ Netlify and Hugging Face auto-deploy!

---

## Important Notes

1. **Hugging Face Model File**: Upload `best-seg.pt` ONCE. Don't re-upload unless model changes.

2. **Netlify Cannot Run Python**: Your Flask backend won't work on Netlify. Use Hugging Face for the AI backend.

3. **Auto-Deploy**: Once connected to GitHub, you NEVER manually upload again!

4. **Free Tiers**:
   - Netlify: 100GB bandwidth/month (free)
   - Hugging Face: CPU Space (free, may sleep after inactivity)
