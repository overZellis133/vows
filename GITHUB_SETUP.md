# GitHub Setup Instructions

## ✅ Git Commit Complete!

Your code has been committed locally. Now let's push it to GitHub.

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `vows` (or whatever you prefer)
3. Description: "AI-powered vow and personal letter generator inspired by great philosophers"
4. **Visibility:**
   - Choose **Private** (recommended for personal projects)
   - Or **Public** if you want to share it
5. **DO NOT** initialize with:
   - README
   - .gitignore
   - License
   
   (We already have these files!)
6. Click **"Create repository"**

## Step 2: Link and Push to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add the GitHub repository as a remote
git remote add origin https://github.com/YOUR_USERNAME/vows.git

# Verify it's connected
git remote -v

# Push your code to GitHub
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username!

## Step 3: Set Up GitHub Actions (Optional for Vercel)

If you want to deploy to Vercel:

1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Import your GitHub repository
4. Add environment variable: `OPENAI_API_KEY`
5. Deploy!

## Security Reminder

⚠️ **Important**: Never commit `.env.local`!

Your `.gitignore` already protects this, but always double-check that your API keys are never pushed to GitHub.

You can verify with:
```bash
git check-ignore .env.local
```

Should return: `.env.local` ✅

## Quick Commands Reference

```bash
# Check status
git status

# View commits
git log --oneline

# Check remote connection
git remote -v

# Push changes
git push

# Pull latest changes
git pull
```

## Next Steps After GitHub Setup

1. Add a README badge (if public repo)
2. Set up branch protection (Settings → Branches)
3. Configure GitHub Actions for CI/CD (optional)
4. Deploy to Vercel
5. Share your creation!

---

**Need help?** Check out:
- GitHub Docs: https://docs.github.com
- Git basics: https://git-scm.com/doc

