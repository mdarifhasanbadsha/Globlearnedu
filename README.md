# Globlearn Education 🎓
### Study in China — Educational Agency Website

A fully-animated, one-page Node.js website for Globlearn Education, a study-abroad agency specializing in China.

## 🚀 Deploy to Vercel (3 steps)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: Globlearn Education website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/globlearn-education.git
git push -u origin main
```

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"** → Import your `globlearn-education` repo
3. Leave all settings as default → Click **Deploy**
4. ✅ Your site is live in ~30 seconds!

### 3. Custom Domain (optional)
In Vercel dashboard → Settings → Domains → Add your domain

---

## 🛠 Local Development

```bash
npm install
npm start
# Visit http://localhost:3000
```

## 📁 File Structure
```
globlearn-education/
├── server.js          # Express server
├── package.json       # Dependencies
├── vercel.json        # Vercel deployment config
├── .gitignore
└── public/
    ├── index.html     # Main one-page website
    ├── css/
    │   └── style.css  # All styles + animations
    └── js/
        └── main.js    # Interactions & animations
```

## ✨ Features
- 🎬 Animated loading screen with Chinese character
- 🖱️ Custom red cursor with follower
- 🖼️ Auto-rotating hero slideshow (Beijing, Shanghai, China)
- 📜 Scrolling university marquee
- 🗺️ 6 Chinese city destination cards
- 🎓 6 academic program cards
- ⏱️ 6-step process timeline
- 💬 Auto-advancing testimonials carousel
- 📊 Animated count-up statistics
- 🎨 Scroll-reveal animations throughout
- 📱 Fully responsive mobile design
- 🚀 Lightweight — no heavy frameworks

## 🎨 Design
- Dark luxury aesthetic with red & gold accents
- Playfair Display + DM Sans typography
- Chinese characters for cultural authenticity
- Unsplash photos of Beijing, Shanghai, Chengdu
