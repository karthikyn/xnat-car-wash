#!/bin/bash

# xNAT Car Wash Services - Quick Deploy Script
# This script helps you deploy to GitHub quickly

echo "🚀 xNAT Car Wash Services - Deployment Helper"
echo "=============================================="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first:"
    echo "   Download from: https://git-scm.com/downloads"
    exit 1
fi

echo "✅ Git is installed"
echo ""

# Check if this is already a git repository
if [ -d .git ]; then
    echo "📦 Git repository already initialized"
else
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git repository initialized"
fi

echo ""
echo "📝 Adding files to Git..."
git add .

echo ""
echo "💾 Committing changes..."
read -p "Enter commit message (or press Enter for default): " commit_msg
if [ -z "$commit_msg" ]; then
    commit_msg="Deploy xNAT Car Wash Services"
fi
git commit -m "$commit_msg"

echo ""
echo "✅ Files committed successfully!"
echo ""
echo "📤 Next Steps:"
echo "=============================================="
echo ""
echo "1. Create a GitHub repository:"
echo "   → Go to: https://github.com/new"
echo "   → Name: xnat-car-wash"
echo "   → Make it Public"
echo "   → Click 'Create repository'"
echo ""
echo "2. Push your code:"
echo "   → Copy your GitHub username"
read -p "   → Enter your GitHub username: " github_user

if [ ! -z "$github_user" ]; then
    echo ""
    echo "📤 Setting up remote repository..."
    git remote remove origin 2>/dev/null
    git remote add origin https://github.com/$github_user/xnat-car-wash.git
    git branch -M main
    
    echo ""
    echo "🚀 Pushing to GitHub..."
    echo "   (You may need to enter your GitHub credentials)"
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Successfully pushed to GitHub!"
        echo ""
        echo "🎉 Your code is now on GitHub!"
        echo "   Repository: https://github.com/$github_user/xnat-car-wash"
        echo ""
        echo "📋 Next: Deploy to Render.com"
        echo "=============================================="
        echo "1. Go to: https://render.com"
        echo "2. Sign up with GitHub"
        echo "3. Click 'New +' → 'Web Service'"
        echo "4. Select 'xnat-car-wash' repository"
        echo "5. Use these settings:"
        echo "   - Build Command: npm install"
        echo "   - Start Command: npm start"
        echo "6. Click 'Create Web Service'"
        echo ""
        echo "⏱️  Wait 2-3 minutes for deployment"
        echo "🌐 Your app will be live at: https://xnat-car-wash.onrender.com"
        echo ""
    else
        echo ""
        echo "❌ Push failed. Please check your credentials and try again."
        echo ""
        echo "Manual push command:"
        echo "git push -u origin main"
    fi
else
    echo ""
    echo "⚠️  Skipped GitHub push"
    echo ""
    echo "To push manually, run:"
    echo "git remote add origin https://github.com/YOUR_USERNAME/xnat-car-wash.git"
    echo "git branch -M main"
    echo "git push -u origin main"
fi

echo ""
echo "✅ Deployment preparation complete!"
echo ""
