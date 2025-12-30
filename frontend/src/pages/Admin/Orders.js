import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  FiPackage, 
  FiSearch, 
  FiFilter, 
  FiEye, 
  FiX, 
  FiCheck, 
  FiClock,
  FiTruck,
  FiMapPin,
  FiUser,
  FiMail,
  FiPhone,
  FiShoppingBag,
  FiDollarSign,
  FiCalendar,
  FiCreditCard,
  FiArrowLeft
} from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const statuses = ['all', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

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
      const { data } = await axios.get('/api/orders', config);
      setOrders(data.orders);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      await axios.put(`/api/orders/${orderId}`, { status: newStatus }, config);
      toast.success('Order status updated successfully');
      fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'Processing':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'Shipped':
        return 'bg-purple-500/20 text-purple-500 border-purple-500/30';
      case 'Delivered':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'Cancelled':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <FiClock className="w-4 h-4" />;
      case 'Processing':
        return <FiPackage className="w-4 h-4" />;
      case 'Shipped':
        return <FiTruck className="w-4 h-4" />;
      case 'Delivered':
        return <FiCheck className="w-4 h-4" />;
      case 'Cancelled':
        return <FiX className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'Pending').length,
    processing: orders.filter(o => o.status === 'Processing').length,
    shipped: orders.filter(o => o.status === 'Shipped').length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
    cancelled: orders.filter(o => o.status === 'Cancelled').length,
    totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/admin/dashboard')}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-luxury-lightGray/50 hover:bg-luxury-lightGray text-white rounded-lg transition-all duration-300 group"
        >
          <motion.div
            animate={{ x: [0, -3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <FiArrowLeft className="w-5 h-5 text-primary-500 group-hover:text-white transition-colors" />
          </motion.div>
          <span className="font-medium">Back to Dashboard</span>
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-white mb-2">
            Order Management
          </h1>
          <p className="text-gray-400">Manage and track all customer orders</p>
        </motion.div>

        {/* Statistics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8"
        >
          {[
            { label: 'Total', value: stats.total, icon: FiShoppingBag, color: 'primary' },
            { label: 'Pending', value: stats.pending, icon: FiClock, color: 'yellow' },
            { label: 'Processing', value: stats.processing, icon: FiPackage, color: 'blue' },
            { label: 'Shipped', value: stats.shipped, icon: FiTruck, color: 'purple' },
            { label: 'Delivered', value: stats.delivered, icon: FiCheck, color: 'green' },
            { label: 'Cancelled', value: stats.cancelled, icon: FiX, color: 'red' },
            { label: 'Revenue', value: `₹${stats.totalRevenue.toFixed(0)}`, icon: FiDollarSign, color: 'primary', isRevenue: true }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="luxury-card p-4 rounded-xl hover:shadow-lg hover:shadow-primary-500/20 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
                <span className="text-gray-400 text-xs">{stat.label}</span>
              </div>
              <p className={`text-2xl font-bold ${stat.isRevenue ? 'text-primary-500' : 'text-white'}`}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="luxury-card p-6 rounded-xl mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Order ID, Customer name, or Email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-luxury-black text-white rounded-lg border border-primary-600/30 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              <FiFilter className="text-gray-400 flex-shrink-0" />
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex-shrink-0 ${
                    filterStatus === status
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                      : 'bg-luxury-black text-gray-400 hover:text-white hover:bg-luxury-lightGray'
                  }`}
                >
                  {status === 'all' ? 'All Orders' : status}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Orders Grid */}
        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="luxury-card p-12 rounded-xl text-center"
          >
            <FiPackage className="text-primary-500 text-6xl mx-auto mb-4" />
            <p className="text-gray-400 text-xl">No orders found</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="luxury-card rounded-xl overflow-hidden hover:shadow-xl hover:shadow-primary-500/20 transition-all duration-300 group"
              >
                {/* Card Header */}
                <div className="p-6 border-b border-primary-600/20">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-gray-400 text-xs mb-1">Order ID</p>
                      <p className="text-white font-mono text-sm font-semibold">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-2 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-300">
                      <FiUser className="w-4 h-4 text-primary-500" />
                      <span className="text-sm">{order.user?.name || 'Unknown Customer'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <FiCalendar className="w-4 h-4 text-primary-500" />
                      <span className="text-sm">{new Date(order.orderDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Items</p>
                      <p className="text-white font-semibold">{order.products.length}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Total Amount</p>
                      <p className="text-primary-500 font-bold">₹{order.totalAmount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Payment</p>
                      <p className="text-white text-sm capitalize">{order.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Delivery</p>
                      <p className="text-white text-sm">{order.shippingAddress?.city || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowModal(true);
                      }}
                      className="flex-1 py-2 px-4 bg-primary-500/20 text-primary-500 rounded-lg hover:bg-primary-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <FiEye className="w-4 h-4" />
                      View Details
                    </button>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 py-2 bg-luxury-black text-white border border-primary-600/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {showModal && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="luxury-card rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-luxury-black/95 backdrop-blur-xl border-b border-primary-600/20 p-6 z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      Order Details
                    </h2>
                    <p className="text-gray-400 font-mono text-sm">
                      #{selectedOrder._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-luxury-lightGray rounded-lg transition-colors"
                  >
                    <FiX className="w-6 h-6 text-gray-400 hover:text-white" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Order Status and Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-luxury-lightGray/30 rounded-xl border border-primary-600/20">
                  <div className="flex items-center gap-4">
                    <div className={`px-4 py-2 rounded-lg text-sm font-semibold border flex items-center gap-2 ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusIcon(selectedOrder.status)}
                      {selectedOrder.status}
                    </div>
                    <div className="text-gray-400 text-sm">
                      <FiCalendar className="inline w-4 h-4 mr-2" />
                      {new Date(selectedOrder.orderDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                    className="px-4 py-2 bg-luxury-black text-white border border-primary-600/30 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  >
                    <option value="Pending">Mark as Pending</option>
                    <option value="Processing">Mark as Processing</option>
                    <option value="Shipped">Mark as Shipped</option>
                    <option value="Delivered">Mark as Delivered</option>
                    <option value="Cancelled">Mark as Cancelled</option>
                  </select>
                </div>

                {/* Customer Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-luxury-lightGray/30 rounded-xl border border-primary-600/20">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <FiUser className="text-primary-500" />
                      Customer Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Name</p>
                        <p className="text-white font-medium">{selectedOrder.user?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Email</p>
                        <p className="text-white font-medium flex items-center gap-2">
                          <FiMail className="w-4 h-4 text-primary-500" />
                          {selectedOrder.user?.email || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="p-6 bg-luxury-lightGray/30 rounded-xl border border-primary-600/20">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <FiMapPin className="text-primary-500" />
                      Shipping Address
                    </h3>
                    <div className="space-y-2 text-white">
                      <p>{selectedOrder.shippingAddress?.street || 'N/A'}</p>
                      <p>{selectedOrder.shippingAddress?.city || 'N/A'}, {selectedOrder.shippingAddress?.state || 'N/A'}</p>
                      <p>{selectedOrder.shippingAddress?.postalCode || 'N/A'}</p>
                      <p>{selectedOrder.shippingAddress?.country || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6 bg-luxury-lightGray/30 rounded-xl border border-primary-600/20">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FiShoppingBag className="text-primary-500" />
                    Order Items ({selectedOrder.products.length})
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.products.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-luxury-black/50 rounded-lg border border-primary-600/10"
                      >
                        <div className="flex-1">
                          <p className="text-white font-medium mb-1">
                            {item.product?.title || item.title || 'Unknown Product'}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {item.product?.brand || item.brand || 'Unknown Brand'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-semibold">
                            ₹{(item.price || 0).toFixed(2)} × {item.quantity}
                          </p>
                          <p className="text-primary-500 font-bold">
                            ₹{((item.price || 0) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="p-6 bg-gradient-to-br from-primary-500/10 to-purple-500/10 rounded-xl border border-primary-600/30">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FiDollarSign className="text-primary-500" />
                    Payment Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal</span>
                      <span>₹{(selectedOrder.subtotal || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Shipping Cost</span>
                      <span>₹{(selectedOrder.shippingCost || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Tax</span>
                      <span>₹{(selectedOrder.tax || 0).toFixed(2)}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-green-500">
                        <span>Discount {selectedOrder.couponCode && `(${selectedOrder.couponCode})`}</span>
                        <span>-₹{(selectedOrder.discount || 0).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="pt-3 border-t border-primary-600/30 flex justify-between text-white text-lg font-bold">
                      <span>Total Amount</span>
                      <span className="text-primary-500">₹{selectedOrder.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="pt-3 border-t border-primary-600/30 flex items-center justify-between">
                      <span className="text-gray-400">Payment Method</span>
                      <div className="flex items-center gap-2 text-white">
                        <FiCreditCard className="text-primary-500" />
                        <span className="capitalize font-medium">{selectedOrder.paymentMethod}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;


