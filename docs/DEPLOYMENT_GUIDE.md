# Deployment Guide - xNAT Car Wash Services
## Free Hosting Options

---

## 🚀 Recommended Free Hosting Services

### 1. Render.com (RECOMMENDED) ⭐
**Best for**: Full-stack Node.js apps  
**Free Tier**: 750 hours/month, auto-sleep after 15 min inactivity  
**Domain**: Free subdomain (yourapp.onrender.com)

### 2. Railway.app
**Best for**: Easy deployment  
**Free Tier**: $5 credit/month  
**Domain**: Free subdomain (yourapp.up.railway.app)

### 3. Vercel
**Best for**: Frontend + Serverless  
**Free Tier**: Unlimited  
**Domain**: Free subdomain (yourapp.vercel.app)

### 4. Netlify
**Best for**: Static sites + Functions  
**Free Tier**: 100GB bandwidth/month  
**Domain**: Free subdomain (yourapp.netlify.app)

### 5. Cyclic.sh
**Best for**: Node.js apps  
**Free Tier**: 3 apps  
**Domain**: Free subdomain (yourapp.cyclic.app)

---

## 📦 Option 1: Deploy to Render.com (EASIEST)

### Step 1: Prepare Your Repository

1. **Create a GitHub account** (if you don't have one)
   - Go to https://github.com
   - Sign up for free

2. **Install Git** (if not installed)
   ```bash
   # Check if Git is installed
   git --version
   
   # If not, download from: https://git-scm.com/downloads
   ```

3. **Initialize Git repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - xNAT Car Wash Services"
   ```

4. **Create GitHub repository**
   - Go to https://github.com/new
   - Name: `xnat-car-wash`
   - Make it Public
   - Don't initialize with README
   - Click "Create repository"

5. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/xnat-car-wash.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Render

1. **Sign up for Render**
   - Go to https://render.com
   - Sign up with GitHub (easiest)

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `xnat-car-wash`

3. **Configure Service**
   ```
   Name: xnat-car-wash
   Region: Choose closest to you
   Branch: main
   Root Directory: (leave empty)
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Set Environment Variables** (if needed)
   ```
   NODE_ENV=production
   PORT=3000
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait 2-3 minutes for deployment
   - Your app will be live at: `https://xnat-car-wash.onrender.com`

### Step 3: Custom Domain (Optional)

Render allows free custom domains:
1. Go to your service settings
2. Click "Custom Domain"
3. Add your domain (e.g., xnat.yourdomain.com)
4. Update DNS records as instructed

---

## 📦 Option 2: Deploy to Railway.app

### Step 1: Prepare Repository
(Same as Render - push to GitHub)

### Step 2: Deploy to Railway

1. **Sign up for Railway**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `xnat-car-wash`

3. **Configure**
   - Railway auto-detects Node.js
   - No configuration needed!

4. **Deploy**
   - Automatic deployment starts
   - Get your URL: `https://xnat-car-wash.up.railway.app`

---

## 📦 Option 3: Deploy to Cyclic.sh

### Step 1: Prepare Repository
(Same as above - push to GitHub)

### Step 2: Deploy to Cyclic

1. **Sign up for Cyclic**
   - Go to https://cyclic.sh
   - Sign in with GitHub

2. **Deploy**
   - Click "Link Your Own"
   - Select your repository
   - Click "Connect"
   - Automatic deployment!

3. **Access**
   - Your app: `https://xnat-car-wash.cyclic.app`

---

## 🔧 Pre-Deployment Checklist

### 1. Update package.json
Ensure these scripts exist:
```json
{
  "scripts": {
    "start": "node src/server/server.js",
    "dev": "nodemon src/server/server.js"
  }
}
```

### 2. Add .gitignore
```
node_modules/
.env
*.log
.DS_Store
```

### 3. Update Server Port
Your server.js should use environment PORT:
```javascript
const PORT = process.env.PORT || 3000;
```

### 4. Test Locally
```bash
npm install
npm start
# Visit http://localhost:3000
```

---

## 🌐 Free Domain Options

### 1. Freenom (Free .tk, .ml, .ga domains)
- Website: https://www.freenom.com
- Free for 12 months
- Can renew for free

### 2. Use Hosting Subdomain
- Render: `yourapp.onrender.com`
- Railway: `yourapp.up.railway.app`
- Cyclic: `yourapp.cyclic.app`
- Vercel: `yourapp.vercel.app`

### 3. Custom Domain (Paid but cheap)
- Namecheap: ~$10/year
- Google Domains: ~$12/year
- Cloudflare: ~$10/year

---

## 📝 Environment Variables

If you need environment variables, set them in your hosting platform:

### Render
Settings → Environment → Add Environment Variable

### Railway
Variables tab → Add Variable

### Cyclic
Settings → Environment Variables

**Common Variables:**
```
NODE_ENV=production
PORT=3000
```

---

## 🔒 Security Considerations

### Before Deploying:

1. **Change Default Admin Password**
   - Update in `src/data/users.json`
   - Or add password hashing

2. **Add CORS Configuration**
   ```javascript
   app.use(cors({
     origin: 'https://your-domain.com'
   }));
   ```

3. **Use Environment Variables**
   - Don't commit sensitive data
   - Use .env file locally
   - Set in hosting platform

4. **Add Rate Limiting**
   ```bash
   npm install express-rate-limit
   ```

---

## 🚀 Quick Deploy Commands

### For Render/Railway/Cyclic:

```bash
# 1. Initialize Git
git init

# 2. Add all files
git add .

# 3. Commit
git commit -m "Deploy xNAT Car Wash Services"

# 4. Create GitHub repo and push
# (Follow GitHub instructions)

# 5. Connect to hosting platform
# (Use their web interface)
```

---

## 📊 Monitoring & Maintenance

### Free Monitoring Tools:
1. **UptimeRobot** - Monitor uptime (free)
2. **Google Analytics** - Track visitors (free)
3. **Sentry** - Error tracking (free tier)

### Keep Your App Awake:
Free tiers often sleep after inactivity. Solutions:

1. **Cron-job.org**
   - Ping your app every 10 minutes
   - Free service

2. **UptimeRobot**
   - Monitor + keep awake
   - Free tier available

---

## 🎯 Recommended Deployment Path

**For Beginners:**
1. ✅ Use **Render.com** (easiest, most reliable)
2. ✅ Push code to GitHub
3. ✅ Connect Render to GitHub
4. ✅ Deploy with one click
5. ✅ Get free subdomain

**For Advanced Users:**
1. Use Railway or Cyclic
2. Add custom domain
3. Set up CI/CD
4. Add monitoring

---

## 📞 Support Resources

### Render
- Docs: https://render.com/docs
- Community: https://community.render.com

### Railway
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway

### Cyclic
- Docs: https://docs.cyclic.sh
- Discord: https://discord.gg/cyclic

---

## ✅ Post-Deployment Checklist

- [ ] App is accessible via URL
- [ ] Admin login works
- [ ] Customer booking works
- [ ] Database persists data
- [ ] All pages load correctly
- [ ] Mobile responsive
- [ ] Analytics dashboard works
- [ ] Partner management works

---

## 🐛 Troubleshooting

### App Won't Start
- Check logs in hosting dashboard
- Verify `npm start` works locally
- Check PORT configuration

### Database Issues
- JSON files should be in `src/data/`
- Check file permissions
- Verify paths are correct

### 404 Errors
- Check server routes
- Verify static file paths
- Check build output

---

**Need Help?** 
Check the hosting platform's documentation or community forums!
