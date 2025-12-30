import React, { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiPackage, FiCalendar, FiDollarSign } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const { data } = await axios.get('/api/orders/myorders', config);
      setOrders(data.orders);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'text-yellow-400';
      case 'Processing':
        return 'text-blue-400';
      case 'Shipped':
        return 'text-purple-400';
      case 'Delivered':
        return 'text-green-400';
      case 'Cancelled':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <FiPackage className="text-primary-500 text-6xl mx-auto mb-6" />
          <h2 className="text-3xl font-bold font-serif text-white mb-4">No Orders Yet</h2>
          <p className="text-gray-400 mb-8">Start shopping to place your first order</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-white mb-2">
            My Orders
          </h1>
          <p className="text-gray-400">Track and manage your orders</p>
        </motion.div>

        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="luxury-card p-6 rounded-xl"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-primary-600/20">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Order ID</p>
                  <p className="text-white font-mono text-sm">{order._id}</p>
                </div>
                <div className="flex items-center space-x-6 mt-4 sm:mt-0">
                  <div>
                    <p className="text-gray-400 text-sm mb-1 flex items-center">
                      <FiCalendar className="mr-1" /> Date
                    </p>
                    <p className="text-white text-sm">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Status</p>
                    <p className={`font-semibold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {order.products.map((item) => (
                  <div key={item._id} className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="text-primary-500 text-sm">{item.brand}</p>
                      <h3 className="text-white font-semibold">{item.title}</h3>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-gray-400 text-sm">
                          {item.size} • Qty: {item.quantity}
                        </p>
                        <p className="text-primary-500 font-semibold">₹{item.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="flex justify-between items-center pt-4 border-t border-primary-600/20">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Shipping Address</p>
                  <p className="text-white text-sm">
                    {order.shippingAddress.address}, {order.shippingAddress.city}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm mb-1 flex items-center justify-end">
                    <FiDollarSign className="mr-1" /> Total Amount
                  </p>
                  <p className="text-2xl font-bold text-primary-500">
                    ${order.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;


