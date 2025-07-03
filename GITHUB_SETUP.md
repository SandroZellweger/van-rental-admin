# GitHub Repository Setup Guide

## 🚀 Quick Setup (Recommended)

### Step 1: Create Repository on GitHub
1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Fill in the repository details:
   - **Repository name**: `van-rental-admin`
   - **Description**: `Modern van rental admin dashboard with Google Sheets integration, booking calendar, and CSV import`
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)

### Step 2: Connect Your Local Repository
After creating the repository on GitHub, run these commands in your terminal:

```bash
# Navigate to your project directory
cd "c:\Users\sandr\New Website"

# Add the GitHub repository as remote origin
git remote add origin https://github.com/YOUR_USERNAME/van-rental-admin.git

# Push your code to GitHub
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 3: Verify Upload
1. Refresh your GitHub repository page
2. You should see all your files uploaded
3. Check that the README.md displays correctly

## 🔧 Alternative Setup Methods

### Method 1: Using GitHub CLI (if installed)
```bash
cd "c:\Users\sandr\New Website"
gh repo create van-rental-admin --public --source=. --remote=origin --push
```

### Method 2: Using GitHub Desktop
1. Download and install GitHub Desktop
2. File → Add Local Repository
3. Select your project folder
4. Publish repository to GitHub

## 📁 Repository Structure After Upload

Your GitHub repository will contain:
```
van-rental-admin/
├── 📄 README.md                 # Project overview and documentation
├── 📄 LICENSE                   # MIT License
├── 📄 CHANGELOG.md              # Version history and changes
├── 📄 .gitignore               # Git ignore rules
├── 🌐 admin.html               # Main admin dashboard
├── 🎨 admin-styles.css         # Styling and responsive design
├── ⚙️ admin-script.js          # Core functionality
├── 📊 real-van-data.js         # Real data integration
├── 🔧 vehicle-data-mapper.js   # Data mapping utilities
├── 📚 Documentation/
│   ├── google-sheets-setup.md
│   ├── complete-setup-guide.md
│   └── GOOGLE_SHEETS_SETUP.md
├── 🧪 Testing/
│   ├── real-data-test.html
│   ├── test-mapper.html
│   └── test-admin.html
├── 📈 Sample Data/
│   ├── sample-van-data.csv
│   ├── sample-pricing-data.csv
│   └── test-import-data.csv
└── 🖼️ images/                  # Media assets directory
```

## 🔄 Common Git Commands

### Daily Workflow
```bash
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "Description of changes"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main
```

### Branch Management
```bash
# Create new feature branch
git checkout -b feature/media-manager

# Switch between branches
git checkout main
git checkout feature/media-manager

# Merge branch
git checkout main
git merge feature/media-manager

# Delete branch
git branch -d feature/media-manager
```

## 🎯 Next Steps After GitHub Setup

1. **Clone on Other Devices**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/van-rental-admin.git
   ```

2. **Set up GitHub Pages** (optional):
   - Go to repository Settings → Pages
   - Select source: Deploy from a branch
   - Choose `main` branch
   - Your admin dashboard will be live at: `https://YOUR_USERNAME.github.io/van-rental-admin/admin.html`

3. **Enable Issues and Projects**:
   - Go to repository Settings → Features
   - Enable Issues for bug tracking
   - Enable Projects for task management

4. **Add Collaborators**:
   - Go to repository Settings → Collaborators
   - Add team members with appropriate permissions

## 🛡️ Security Considerations

### Environment Variables
If you add API keys or sensitive data:
1. Create a `.env` file (already in .gitignore)
2. Use environment variables in your code
3. Never commit API keys or passwords

### Branch Protection
For production repositories:
1. Go to Settings → Branches
2. Add branch protection rules for `main`
3. Require pull request reviews
4. Require status checks to pass

## 🏆 Repository Best Practices

1. **Commit Messages**: Use clear, descriptive messages
2. **Branching**: Use feature branches for new development
3. **Pull Requests**: Review code before merging
4. **Documentation**: Keep README and docs updated
5. **Releases**: Tag important versions
6. **Issues**: Use GitHub Issues for bug tracking

## 📞 Support

If you encounter issues:
1. Check GitHub's [documentation](https://docs.github.com/)
2. Verify your Git configuration
3. Ensure you have the correct repository permissions
4. Try using HTTPS instead of SSH for authentication

---

**Ready to push your code to GitHub?** Follow Step 1 and Step 2 above! 🚀
