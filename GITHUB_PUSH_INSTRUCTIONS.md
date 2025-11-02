# GitHub Push Instructions

## 🔐 Authentication Required

To push to GitHub, you need to authenticate. Here are your options:

## Option 1: Personal Access Token (Recommended)

### Step 1: Create a Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name: "Vows Project"
4. Select scopes: Check **`repo`** (full control of private repositories)
5. Click **"Generate token"**
6. **COPY THE TOKEN** (you won't see it again!)

### Step 2: Push with Token

When prompted for password, **paste your token** (not your GitHub password):

```bash
git push -u origin main
```

Username: `overZellis133`
Password: `[paste your token here]`

---

## Option 2: GitHub CLI (Alternative)

Install GitHub CLI and authenticate:

```bash
# Install GitHub CLI
brew install gh

# Authenticate
gh auth login

# Then push normally
git push -u origin main
```

---

## Option 3: SSH Setup (For Future)

If you want to set up SSH keys:

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Start ssh-agent
eval "$(ssh-agent -s)"

# Add SSH key
ssh-add ~/.ssh/id_ed25519

# Copy public key to clipboard
pbcopy < ~/.ssh/id_ed25519.pub

# Add to GitHub: https://github.com/settings/keys
# Then you can use SSH URL

git remote set-url origin git@github.com:overZellis133/vows.git
git push -u origin main
```

---

## Quick Reference

**Repository URL:** https://github.com/overZellis133/vows.git

**Current Status:**
- ✅ Git committed locally
- ✅ Remote added
- ⏳ Waiting for authentication

**Your Commands:**
```bash
git push -u origin main
```

---

**Most Common Solution:** Use a Personal Access Token (Option 1)

