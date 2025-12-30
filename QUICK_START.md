# 🚀 Aroma Luxe - Quick Reference Card

## ⚡ Quick Start (3 Steps)

### Step 1: Install Dependencies
```powershell
# Run from project root
.\setup.ps1
```

### Step 2: Start Backend
```powershell
cd backend
npm start
```

### Step 3: Start Frontend (New Terminal)
```powershell
cd frontend
npm start
```

---

## 🔑 Demo Accounts

**Admin:**
- Email: `admin@aromaluxe.com`
- Password: `admin123`

**User:**
- Email: `user@aromaluxe.com`
- Password: `user123`

---

## 🌐 URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| MongoDB Local | mongodb://localhost:27017/aroma-luxe |

---

## 📦 Manual Setup Commands

### Backend
```powershell
cd backend
npm install
node seedUsers.js
node seedData.js
npm start
```

### Frontend
```powershell
cd frontend
npm install
npm start
```

---

## 🎨 Tech Stack

**Frontend:** React + TailwindCSS + Framer Motion
**Backend:** Node.js + Express + MongoDB
**Auth:** JWT + bcrypt

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `backend/server.js` | Backend entry point |
| `backend/.env` | Environment config |
| `frontend/src/App.js` | React app root |
| `frontend/src/index.css` | Global styles |

---

## 🛠️ Common Commands

### Backend
```powershell
npm start          # Start server
npm run dev        # Start with nodemon
node seedData.js   # Seed products
node seedUsers.js  # Seed users
```

### Frontend
```powershell
npm start          # Start dev server
npm run build      # Production build
```

---

## 🔍 Test Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can access home page
- [ ] Can login with demo credentials
- [ ] Can browse products
- [ ] Can filter products
- [ ] Can add to cart
- [ ] Can checkout
- [ ] Can view orders
- [ ] Admin panel accessible

---

## 📊 Project Stats

- **Pages:** 14
- **API Endpoints:** 20+
- **Components:** 25+
- **Files:** 50+
- **Sample Products:** 15

---

## 🎯 Main Features

✅ User Authentication
✅ Product Browsing & Filtering
✅ Shopping Cart
✅ Checkout Process
✅ Order Management
✅ Admin Dashboard
✅ Premium UI/UX

---

## 🆘 Troubleshooting

**Can't connect to MongoDB?**
- Check MongoDB is running
- Verify MONGODB_URI in `.env`

**Port already in use?**
- Change PORT in backend `.env`
- Update REACT_APP_API_URL in frontend `.env`

**Dependencies error?**
- Delete `node_modules`
- Run `npm install` again

---

## 📚 Documentation

- `README.md` - Full documentation
- `SETUP_GUIDE.md` - Detailed setup
- `PROJECT_SUMMARY.md` - Feature list
- `FILE_STRUCTURE.md` - File organization

---

## 🎨 Color Codes

- Black: `#0a0a0a`
- Gold: `#daa520`
- Light Gold: `#ffd700`

---

## 📞 Next Steps

1. Read `SETUP_GUIDE.md` for detailed instructions
2. Run `.\setup.ps1` to install everything
3. Start both servers
4. Visit http://localhost:3000
5. Login and explore!

---

**Happy Coding! 🌟✨**

Made with ❤️ by Aroma Luxe Team
