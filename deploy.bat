@echo off
REM xNAT Car Wash Services - Quick Deploy Script for Windows
REM This script helps you deploy to GitHub quickly

echo.
echo ========================================
echo xNAT Car Wash Services - Deployment Helper
echo ========================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Git is not installed!
    echo.
    echo Please install Git first:
    echo Download from: https://git-scm.com/downloads
    echo.
    pause
    exit /b 1
)

echo [OK] Git is installed
echo.

REM Check if this is already a git repository
if exist .git (
    echo [INFO] Git repository already initialized
) else (
    echo [INFO] Initializing Git repository...
    git init
    echo [OK] Git repository initialized
)

echo.
echo [INFO] Adding files to Git...
git add .

echo.
set /p commit_msg="Enter commit message (or press Enter for default): "
if "%commit_msg%"=="" set commit_msg=Deploy xNAT Car Wash Services

echo [INFO] Committing changes...
git commit -m "%commit_msg%"

echo.
echo [OK] Files committed successfully!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo.
echo 1. Create a GitHub repository:
echo    - Go to: https://github.com/new
echo    - Name: xnat-car-wash
echo    - Make it Public
echo    - Click 'Create repository'
echo.
echo 2. Push your code:
set /p github_user="   Enter your GitHub username: "

if not "%github_user%"=="" (
    echo.
    echo [INFO] Setting up remote repository...
    git remote remove origin 2>nul
    git remote add origin https://github.com/%github_user%/xnat-car-wash.git
    git branch -M main
    
    echo.
    echo [INFO] Pushing to GitHub...
    echo (You may need to enter your GitHub credentials)
    git push -u origin main
    
    if errorlevel 1 (
        echo.
        echo [ERROR] Push failed. Please check your credentials and try again.
        echo.
        echo Manual push command:
        echo git push -u origin main
    ) else (
        echo.
        echo [OK] Successfully pushed to GitHub!
        echo.
        echo ========================================
        echo Your code is now on GitHub!
        echo Repository: https://github.com/%github_user%/xnat-car-wash
        echo ========================================
        echo.
        echo Next: Deploy to Render.com
        echo ========================================
        echo 1. Go to: https://render.com
        echo 2. Sign up with GitHub
        echo 3. Click 'New +' - 'Web Service'
        echo 4. Select 'xnat-car-wash' repository
        echo 5. Use these settings:
        echo    - Build Command: npm install
        echo    - Start Command: npm start
        echo 6. Click 'Create Web Service'
        echo.
        echo Wait 2-3 minutes for deployment
        echo Your app will be live at: https://xnat-car-wash.onrender.com
        echo.
    )
) else (
    echo.
    echo [WARNING] Skipped GitHub push
    echo.
    echo To push manually, run:
    echo git remote add origin https://github.com/YOUR_USERNAME/xnat-car-wash.git
    echo git branch -M main
    echo git push -u origin main
)

echo.
echo [OK] Deployment preparation complete!
echo.
pause
