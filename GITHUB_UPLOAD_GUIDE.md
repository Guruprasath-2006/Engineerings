# GitHub Upload Guide

## Prerequisites

Git is not currently installed on your system. Follow these steps:

### Step 1: Install Git

1. Download Git from: https://git-scm.com/download/win
2. Run the installer and follow the setup wizard
3. Use the default options (recommended)
4. Restart VS Code after installation

### Step 2: Configure Git (First Time Only)

Open a new terminal and run:
```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 3: Initialize Git Repository

Navigate to your project folder:
```powershell
cd e:\ACEDEMIC\aroma-luxe
git init
```

### Step 4: Add Files

```powershell
git add .
```

### Step 5: Create First Commit

```powershell
git commit -m "Initial commit: Aroma Luxe E-commerce Platform"
```

### Step 6: Create GitHub Repository

1. Go to https://github.com
2. Sign in (or create an account)
3. Click the "+" icon in the top right
4. Select "New repository"
5. Name it "aroma-luxe" (or your preferred name)
6. **Do NOT** initialize with README, .gitignore, or license
7. Click "Create repository"

### Step 7: Link and Push to GitHub

After creating the repository, GitHub will show you commands. Use:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/aroma-luxe.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Alternative: Using GitHub Desktop

If you prefer a GUI:

1. Download GitHub Desktop: https://desktop.github.com/
2. Install and sign in to GitHub
3. File → Add Local Repository → Select `e:\ACEDEMIC\aroma-luxe`
4. Publish repository to GitHub

## What Gets Uploaded

The `.gitignore` file I created ensures these won't be uploaded:
- `node_modules/` folders (too large, can be reinstalled)
- Environment files with secrets
- Build outputs
- Log files
- OS and IDE specific files

## Notes

- The `.gitignore` file has been created at the root of your project
- Make sure to add your actual `.env` files to `.gitignore` if they contain sensitive data
- Total upload size should be reasonable after excluding node_modules

## Troubleshooting

If you get authentication errors:
- Use Personal Access Token instead of password
- Generate at: GitHub Settings → Developer settings → Personal access tokens

Need help? Feel free to ask!
