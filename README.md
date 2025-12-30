# 🌟 Aroma Luxe - Premium Perfume E-Commerce Store

Welcome to **Aroma Luxe**, a full-stack luxury perfume e-commerce website built with the MERN stack (MongoDB, Express.js, React.js, Node.js). This project features a beautiful, premium black and gold theme with smooth animations and a complete shopping experience.

![Aroma Luxe](https://img.shields.io/badge/Version-1.0.0-gold?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

## ✨ Features

### 🔐 User Authentication
- User registration and login
- JWT-based authentication
- Password encryption with bcrypt
- Protected routes for authenticated users
- Role-based access control (User/Admin)

### 🛍️ Product Management
- Browse luxury perfume collection
- Advanced filtering (Category, Brand, Price Range)
- Search functionality
- Product details with multiple images
- Quick view popup
- Stock management

### 🛒 Shopping Cart
- Add/Remove products
- Update quantities
- LocalStorage persistence
- Real-time price calculation
- Responsive cart UI

### 💳 Checkout & Orders
- Secure checkout process
- Shipping address form
- Multiple payment options (Demo)
- Order history tracking
- Order status updates

### 👨‍💼 Admin Panel
- Dashboard with statistics
- Product CRUD operations
- Order management
- User management
- Real-time data updates

### 🎨 Design Features
- Premium black, gold, and white color scheme
- Framer Motion animations
- TailwindCSS styling
- Fully responsive design
- Smooth hover effects
- Loading states and transitions

## 📁 Project Structure

```
aroma-luxe/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── orderController.js    # Order management
│   │   ├── productController.js  # Product CRUD
│   │   └── userController.js     # User management
│   ├── middleware/
│   │   └── auth.js               # JWT middleware
│   ├── models/
│   │   ├── Order.js              # Order schema
│   │   ├── Product.js            # Product schema
│   │   └── User.js               # User schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   └── userRoutes.js
│   ├── .env                      # Environment variables
│   ├── package.json
│   ├── seedData.js               # Sample data seeder
│   └── server.js                 # Express server
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Layout/
    │   │   │   ├── Footer.js
    │   │   │   └── Navbar.js
    │   │   ├── AdminRoute.js     # Admin route guard
    │   │   └── PrivateRoute.js   # Auth route guard
    │   ├── context/
    │   │   ├── AuthContext.js    # Authentication state
    │   │   └── CartContext.js    # Shopping cart state
    │   ├── pages/
    │   │   ├── Admin/
    │   │   │   ├── AddProduct.js
    │   │   │   ├── Dashboard.js
    │   │   │   ├── EditProduct.js
    │   │   │   ├── Orders.js
    │   │   │   ├── Products.js
    │   │   │   └── Users.js
    │   │   ├── Cart.js
    │   │   ├── Checkout.js
    │   │   ├── Home.js
    │   │   ├── Login.js
    │   │   ├── Orders.js
    │   │   ├── ProductDetails.js
    │   │   ├── Shop.js
    │   │   └── Signup.js
    │   ├── App.js
    │   ├── index.css
    │   └── index.js
    ├── .env
    ├── package.json
    ├── postcss.config.js
    └── tailwind.config.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

#### 1. Clone the repository
```bash
cd e:\ACEDEMIC\aroma-luxe
```

#### 2. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Configure environment variables
# Edit .env file with your MongoDB URI and JWT secret

# Seed sample perfume data
node seedData.js

# Start backend server
npm start
# or for development with nodemon
npm run dev
```

Backend will run on: `http://localhost:5000`

#### 3. Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start React development server
npm start
```

Frontend will run on: `http://localhost:3000`

## 🔑 Demo Credentials

### Admin Account
- **Email:** admin@aromaluxe.com
- **Password:** admin123

### User Account
- **Email:** user@aromaluxe.com
- **Password:** user123

*Note: You can also create new accounts through the signup page*

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Frontend
- **React.js** - UI library
- **React Router** - Routing
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **TailwindCSS** - Styling
- **React Icons** - Icon library
- **React Toastify** - Notifications
- **Context API** - State management

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `GET /api/products/brands/all` - Get all brands

### Orders
- `POST /api/orders` - Create order (Protected)
- `GET /api/orders/myorders` - Get user orders (Protected)
- `GET /api/orders` - Get all orders (Admin)
- `GET /api/orders/:id` - Get single order (Protected)
- `PUT /api/orders/:id` - Update order status (Admin)
- `GET /api/orders/stats/dashboard` - Get dashboard stats (Admin)

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get single user (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)

## 🎨 Color Palette

- **Primary Black:** `#0a0a0a`
- **Dark Gray:** `#1a1a1a`
- **Gold:** `#daa520`
- **Light Gold:** `#ffd700`
- **White:** `#ffffff`

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Laptops (1024px+)
- 🖥️ Desktops (1280px+)

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Protected API routes
- Role-based access control
- Input validation
- XSS protection

## 🌟 Key Highlights

1. **Premium UI/UX** - Luxury black and gold theme with smooth animations
2. **Complete E-commerce Flow** - From browsing to checkout
3. **Admin Dashboard** - Full control over products, orders, and users
4. **Real-time Cart** - LocalStorage persistence across sessions
5. **Advanced Filtering** - Search, filter by category, brand, and price
6. **Responsive Design** - Works perfectly on all devices
7. **Modern Stack** - Built with latest web technologies

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created with ❤️ for luxury perfume enthusiasts

---

**Aroma Luxe** - Where Luxury Meets Fragrance ✨🌟
