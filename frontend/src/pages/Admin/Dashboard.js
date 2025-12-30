import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign, FiTrendingUp, FiCpu } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const { data } = await axios.get('/api/orders/stats/dashboard', config);
      setStats(data.stats);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats?.totalRevenue?.toFixed(2) || '0.00'}`,
      icon: FiDollarSign,
      color: 'gold',
      link: '/admin/orders'
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: FiShoppingBag,
      color: 'blue',
      link: '/admin/orders'
    },
    {
      title: 'Pending Orders',
      value: stats?.pendingOrders || 0,
      icon: FiPackage,
      color: 'yellow',
      link: '/admin/orders'
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: FiTrendingUp,
      color: 'green',
      link: '/admin/products'
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: FiUsers,
      color: 'purple',
      link: '/admin/users'
    },
    {
      title: 'Design Projects',
      value: stats?.totalDesigns || 0,
      icon: FiCpu,
      color: 'blue',
      link: '/admin/designs'
    }
  ];

  return (
    <div className="min-h-screen bg-luxury-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-400">Welcome to Aroma Luxe Admin Panel</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={stat.link}>
                <div className="luxury-card p-6 rounded-xl hover:scale-105 transition-transform cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className="text-primary-500 text-3xl" />
                    <span className="text-gray-400 text-sm">{stat.title}</span>
                  </div>
                  <p className="text-4xl font-bold text-white">{stat.value}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="luxury-card p-8 rounded-xl"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Link to="/admin/products/add">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 gold-glow-btn text-black font-semibold rounded-lg"
              >
                Add New Product
              </motion.button>
            </Link>
            <Link to="/admin/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 border-2 border-primary-500 text-white font-semibold rounded-lg hover:bg-primary-500 hover:text-black transition-all"
              >
                Manage Products
              </motion.button>
            </Link>
            <Link to="/admin/orders">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 border-2 border-primary-500 text-white font-semibold rounded-lg hover:bg-primary-500 hover:text-black transition-all"
              >
                View Orders
              </motion.button>
            </Link>
            <Link to="/admin/users">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 border-2 border-primary-500 text-white font-semibold rounded-lg hover:bg-primary-500 hover:text-black transition-all"
              >
                Manage Users
              </motion.button>
            </Link>
            <Link to="/admin/designs">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 border-2 border-primary-500 text-white font-semibold rounded-lg hover:bg-primary-500 hover:text-black transition-all"
              >
                Review Designs
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;


