const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const demoUsers = [
  {
    name: 'Admin User',
    email: 'admin@aromaluxe.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'John Doe',
    email: 'user@aromaluxe.com',
    password: 'user123',
    role: 'user'
  }
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    // Clear existing demo users
    await User.deleteMany({ email: { $in: ['admin@aromaluxe.com', 'user@aromaluxe.com'] } });
    console.log('🗑️  Cleared existing demo users');

    // Insert demo users
    await User.create(demoUsers);
    console.log('✅ Demo users created successfully!');
    console.log('\n📋 Demo Credentials:');
    console.log('Admin - Email: admin@aromaluxe.com | Password: admin123');
    console.log('User  - Email: user@aromaluxe.com | Password: user123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedUsers();
