# 🚀 Aroma Luxe - Complete Setup Guide

## Step-by-Step Installation Instructions

### Step 1: Prerequisites Check

Before starting, ensure you have these installed:

1. **Node.js** (v14 or higher)
   - Check version: `node --version`
   - Download from: https://nodejs.org/

2. **MongoDB**
   - Option A: Local MongoDB - https://www.mongodb.com/try/download/community
   - Option B: MongoDB Atlas (Cloud) - https://www.mongodb.com/cloud/atlas

3. **Git** (optional, for cloning)
   - Check version: `git --version`
   - Download from: https://git-scm.com/

### Step 2: MongoDB Setup

#### Option A: Using MongoDB Atlas (Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (free tier available)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password

#### Option B: Using Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service:
   - Windows: MongoDB runs as a service automatically
   - Mac/Linux: `sudo systemctl start mongod`
3. Your connection string will be: `mongodb://localhost:27017/aroma-luxe`

### Step 3: Backend Setup

1. **Navigate to backend folder:**
   ```powershell
   cd e:\ACEDEMIC\aroma-luxe\backend
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Configure environment variables:**
   
   Edit the `.env` file in the backend folder:
   ```env
   PORT=5000
   MONGODB_URI=your-mongodb-connection-string-here
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

   **Important:** Replace `MONGODB_URI` with your actual MongoDB connection string!

4. **Seed sample data:**
   
   First, create demo users:
   ```powershell
   node seedUsers.js
   ```
   
   Then, add sample perfumes:
   ```powershell
   node seedData.js
   ```

5. **Start the backend server:**
   ```powershell
   npm start
   ```
   
   Or for development with auto-restart:
   ```powershell
   npm run dev
   ```

   You should see:
   ```
   ✅ MongoDB Connected
   🚀 Server running on port 5000
   ```

### Step 4: Frontend Setup

1. **Open a NEW PowerShell window**

2. **Navigate to frontend folder:**
   ```powershell
   cd e:\ACEDEMIC\aroma-luxe\frontend
   ```

3. **Install dependencies:**
   ```powershell
   npm install
   ```

4. **Check environment variables:**
   
   The `.env` file should contain:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

5. **Start the React development server:**
   ```powershell
   npm start
   ```

   The browser should automatically open to `http://localhost:3000`

### Step 5: Test the Application

1. **Visit:** http://localhost:3000

2. **Try logging in with demo accounts:**
   
   **Admin Account:**
   - Email: `admin@aromaluxe.com`
   - Password: `admin123`
   
   **User Account:**
   - Email: `user@aromaluxe.com`
   - Password: `user123`

3. **Or create a new account** using the Sign Up page

## 🎯 Quick Start Commands

### Backend (Terminal 1)
```powershell
cd e:\ACEDEMIC\aroma-luxe\backend
npm install
node seedUsers.js
node seedData.js
npm start
```

### Frontend (Terminal 2)
```powershell
cd e:\ACEDEMIC\aroma-luxe\frontend
npm install
npm start
```

## 📋 Features to Test

### As a User:
- ✅ Browse perfumes on home page
- ✅ Filter products by category, brand, price
- ✅ View product details
- ✅ Add products to cart
- ✅ Update cart quantities
- ✅ Checkout and place order
- ✅ View order history

### As an Admin:
- ✅ Login with admin credentials
- ✅ View dashboard statistics
- ✅ Add new products
- ✅ Edit existing products
- ✅ Delete products
- ✅ View all orders
- ✅ Update order status
- ✅ View all users

## ⚠️ Troubleshooting

### Backend Issues

**Problem:** `MongooseError: connect ECONNREFUSED`
**Solution:** 
- Check if MongoDB is running
- Verify MONGODB_URI in `.env` file
- Ensure network access is allowed (Atlas)

**Problem:** `Cannot find module 'express'`
**Solution:** 
```powershell
cd backend
npm install
```

**Problem:** Port 5000 already in use
**Solution:** 
- Change PORT in `.env` to another port (e.g., 5001)
- Update frontend `.env` accordingly

### Frontend Issues

**Problem:** `npm ERR! Failed to compile`
**Solution:** 
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall: 
  ```powershell
  Remove-Item -Recurse -Force node_modules
  npm install
  ```

**Problem:** Blank page or API errors
**Solution:** 
- Ensure backend is running on port 5000
- Check browser console for errors
- Verify REACT_APP_API_URL in `.env`

**Problem:** Styling not applied
**Solution:** 
- Wait for TailwindCSS to compile
- Refresh the browser
- Clear browser cache

## 🔧 Development Tips

1. **Keep both terminals running** - One for backend, one for frontend

2. **Backend URL:** http://localhost:5000
   - API docs: http://localhost:5000

3. **Frontend URL:** http://localhost:3000

4. **MongoDB:**
   - Local: mongodb://localhost:27017/aroma-luxe
   - Atlas: Your custom connection string

5. **Hot Reload:**
   - Backend: Use `npm run dev` for auto-restart
   - Frontend: Changes reflect automatically

## 📦 Project Dependencies

### Backend
- express: Web framework
- mongoose: MongoDB ODM
- bcryptjs: Password hashing
- jsonwebtoken: JWT authentication
- cors: CORS middleware
- dotenv: Environment variables

### Frontend
- react: UI library
- react-router-dom: Routing
- axios: HTTP client
- framer-motion: Animations
- tailwindcss: CSS framework
- react-toastify: Notifications
- react-icons: Icons

## 🎨 Customization

### Change Color Theme
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  gold: {
    400: '#your-color',
    500: '#your-color',
    600: '#your-color',
  }
}
```

### Add More Products
Edit `backend/seedData.js` and run:
```powershell
node seedData.js
```

### Modify Database Models
Edit files in `backend/models/` and restart the server

## 🚀 Production Deployment

### Backend (Heroku/Railway)
1. Set environment variables
2. Set `NODE_ENV=production`
3. Deploy with: `git push heroku main`

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy the `build` folder
3. Set environment variable: `REACT_APP_API_URL`

## 📞 Support

If you encounter any issues:
1. Check this guide first
2. Review error messages carefully
3. Ensure all dependencies are installed
4. Verify environment variables are correct

## ✅ Success Checklist

- [ ] MongoDB connected successfully
- [ ] Backend server running on port 5000
- [ ] Sample data seeded
- [ ] Frontend running on port 3000
- [ ] Can access home page
- [ ] Can login with demo credentials
- [ ] Can browse products
- [ ] Can add to cart
- [ ] Admin panel accessible

---

**Congratulations! 🎉** You now have Aroma Luxe running on your machine!

Enjoy exploring the luxury perfume store! ✨
