
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { FiCreditCard, FiDollarSign, FiSmartphone } from 'react-icons/fi';
import { SiGooglepay, SiPhonepe, SiPaytm, SiAmazonpay } from 'react-icons/si';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useContext(CartContext);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
    paymentMethod: 'Cash on Delivery'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      // Check if already loaded
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        console.log('Razorpay script loaded successfully');
        resolve(true);
      };
      script.onerror = () => {
        console.error('Failed to load Razorpay script');
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  // Handle Razorpay payment
  const handleRazorpayPayment = async (orderData) => {
    try {
      console.log('Starting payment process...');
      
      const scriptLoaded = await loadRazorpayScript();
      
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway. Please check your internet connection.');
        setLoading(false);
        return;
      }

      console.log('Creating order on backend...');
      
      // Create order on backend
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const { data } = await axios.post('/api/orders/create-razorpay-order', {
        amount: orderData.totalAmount
      }, config);

      console.log('Order created:', data);

      if (!data.success) {
        throw new Error(data.message || 'Failed to create order');
      }

      // Check if demo mode (Razorpay not configured)
      if (data.isDemo) {
        console.log('⚠️ Demo mode detected - creating order directly');
        toast.info('Demo payment mode - Order will be created as "pending payment"');
        
        // Create order directly without Razorpay modal
        const demoOrderData = {
          ...orderData,
          paymentStatus: 'pending',
          paymentId: data.razorpayOrderId
        };

        const orderResponse = await axios.post('/api/orders', demoOrderData, config);
        
        if (orderResponse.data.success) {
          toast.success('Order placed successfully! (Demo Mode)');
          clearCart();
          navigate('/orders');
        }
        setLoading(false);
        return;
      }

      // Real Razorpay payment
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: 'Velan Engineering',
        description: 'Engineering Services Payment',
        order_id: data.razorpayOrderId,
        handler: async function (response) {
          console.log('Payment successful:', response);
          try {
            setLoading(true);
            const verifyData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderData: {
                ...orderData,
                paymentId: response.razorpay_payment_id,
                paymentStatus: 'paid'
              }
            };

            const verifyResponse = await axios.post('/api/orders/verify-payment', verifyData, config);
            
            if (verifyResponse.data.success) {
              toast.success('Payment successful! Order placed.');
              clearCart();
              navigate('/orders');
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Verification error:', error);
            toast.error(error.response?.data?.message || 'Payment verification failed');
            setLoading(false);
          }
        },
        prefill: {
          name: formData.fullName,
          email: '',
          contact: formData.phone
        },
        notes: {
          address: formData.address
        },
        theme: {
          color: '#ff6f00'
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal closed');
            setLoading(false);
            toast.info('Payment cancelled');
          }
        }
      };

      console.log('Opening Razorpay modal...');
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      console.error('Razorpay payment error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to initiate payment';
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        products: cart.map(item => ({
          product: item._id,
          title: item.title,
          brand: item.brand,
          price: item.price,
          size: item.size,
          quantity: item.quantity,
          image: item.images[0]
        })),
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone
        },
        paymentMethod: formData.paymentMethod,
        totalAmount: getCartTotal() * 1.1 // Including 10% tax
      };

      console.log('Order Data:', orderData);
      console.log('Payment Method:', formData.paymentMethod);

      // Check if payment method is online (not COD)
      const onlinePaymentMethods = ['PhonePe', 'Google Pay', 'Paytm', 'Amazon Pay', 'Credit/Debit Card', 'Net Banking'];
      
      if (onlinePaymentMethods.includes(formData.paymentMethod)) {
        console.log('Processing online payment...');
        // Process online payment through Razorpay
        await handleRazorpayPayment(orderData);
      } else {
        console.log('Processing COD order...');
        // Cash on Delivery - direct order creation
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };

        const response = await axios.post('/api/orders', orderData, config);
        
        console.log('COD Order Response:', response.data);

        if (response.data.success) {
          toast.success('Order placed successfully! Pay on delivery.');
          clearCart();
          navigate('/orders');
        } else {
          throw new Error(response.data.message || 'Failed to create order');
        }
        setLoading(false);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to place order';
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
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
            Checkout
          </h1>
          <p className="text-gray-400">Complete your order</p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Shipping Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="luxury-card p-8 rounded-xl"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Shipping Information</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-luxury-black text-white border border-gold-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Address *</label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-luxury-black text-white border border-gold-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                      placeholder="Street address"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-luxury-black text-white border border-gold-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                        placeholder="City"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2">Postal Code *</label>
                      <input
                        type="text"
                        name="postalCode"
                        required
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-luxury-black text-white border border-gold-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                        placeholder="Postal code"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Country *</label>
                    <input
                      type="text"
                      name="country"
                      required
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-luxury-black text-white border border-gold-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                      placeholder="Country"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-luxury-black text-white border border-gold-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                      placeholder="Phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-3 text-lg font-semibold">Payment Method *</label>
                    
                    <div className="space-y-3">
                      {/* UPI Payment Options */}
                      <div className="space-y-2">
                        <p className="text-sm text-gray-400 font-medium mb-2">UPI Payments</p>
                        
                        <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.paymentMethod === 'PhonePe' 
                            ? 'border-primary-500 bg-primary-500/10' 
                            : 'border-gold-600/30 hover:border-primary-500/50'
                        }`}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="PhonePe"
                            checked={formData.paymentMethod === 'PhonePe'}
                            onChange={handleChange}
                            className="w-5 h-5 text-primary-500"
                          />
                          <SiPhonepe className="text-3xl text-purple-600" />
                          <div className="flex-1">
                            <p className="text-white font-semibold">PhonePe</p>
                            <p className="text-xs text-gray-400">Pay using PhonePe UPI</p>
                          </div>
                        </label>

                        <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.paymentMethod === 'Google Pay' 
                            ? 'border-primary-500 bg-primary-500/10' 
                            : 'border-gold-600/30 hover:border-primary-500/50'
                        }`}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="Google Pay"
                            checked={formData.paymentMethod === 'Google Pay'}
                            onChange={handleChange}
                            className="w-5 h-5 text-primary-500"
                          />
                          <SiGooglepay className="text-3xl text-blue-600" />
                          <div className="flex-1">
                            <p className="text-white font-semibold">Google Pay</p>
                            <p className="text-xs text-gray-400">Pay using Google Pay UPI</p>
                          </div>
                        </label>

                        <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.paymentMethod === 'Paytm' 
                            ? 'border-primary-500 bg-primary-500/10' 
                            : 'border-gold-600/30 hover:border-primary-500/50'
                        }`}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="Paytm"
                            checked={formData.paymentMethod === 'Paytm'}
                            onChange={handleChange}
                            className="w-5 h-5 text-primary-500"
                          />
                          <SiPaytm className="text-3xl text-blue-500" />
                          <div className="flex-1">
                            <p className="text-white font-semibold">Paytm</p>
                            <p className="text-xs text-gray-400">Pay using Paytm Wallet/UPI</p>
                          </div>
                        </label>

                        <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.paymentMethod === 'Amazon Pay' 
                            ? 'border-primary-500 bg-primary-500/10' 
                            : 'border-gold-600/30 hover:border-primary-500/50'
                        }`}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="Amazon Pay"
                            checked={formData.paymentMethod === 'Amazon Pay'}
                            onChange={handleChange}
                            className="w-5 h-5 text-primary-500"
                          />
                          <SiAmazonpay className="text-3xl text-orange-500" />
                          <div className="flex-1">
                            <p className="text-white font-semibold">Amazon Pay</p>
                            <p className="text-xs text-gray-400">Pay using Amazon Pay balance</p>
                          </div>
                        </label>
                      </div>

                      {/* Wallet & Card Options */}
                      <div className="space-y-2 pt-3 border-t border-gold-600/20">
                        <p className="text-sm text-gray-400 font-medium mb-2">Cards & Wallets</p>
                        
                        <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.paymentMethod === 'Credit/Debit Card' 
                            ? 'border-primary-500 bg-primary-500/10' 
                            : 'border-gold-600/30 hover:border-primary-500/50'
                        }`}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="Credit/Debit Card"
                            checked={formData.paymentMethod === 'Credit/Debit Card'}
                            onChange={handleChange}
                            className="w-5 h-5 text-primary-500"
                          />
                          <FiCreditCard className="text-3xl text-gray-300" />
                          <div className="flex-1">
                            <p className="text-white font-semibold">Credit/Debit Card</p>
                            <p className="text-xs text-gray-400">Visa, Mastercard, Rupay</p>
                          </div>
                        </label>

                        <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.paymentMethod === 'Net Banking' 
                            ? 'border-primary-500 bg-primary-500/10' 
                            : 'border-gold-600/30 hover:border-primary-500/50'
                        }`}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="Net Banking"
                            checked={formData.paymentMethod === 'Net Banking'}
                            onChange={handleChange}
                            className="w-5 h-5 text-primary-500"
                          />
                          <FiSmartphone className="text-3xl text-gray-300" />
                          <div className="flex-1">
                            <p className="text-white font-semibold">Net Banking</p>
                            <p className="text-xs text-gray-400">All major banks supported</p>
                          </div>
                        </label>
                      </div>

                      {/* Cash on Delivery */}
                      <div className="space-y-2 pt-3 border-t border-gold-600/20">
                        <p className="text-sm text-gray-400 font-medium mb-2">Cash Payment</p>
                        
                        <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.paymentMethod === 'Cash on Delivery' 
                            ? 'border-primary-500 bg-primary-500/10' 
                            : 'border-gold-600/30 hover:border-primary-500/50'
                        }`}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="Cash on Delivery"
                            checked={formData.paymentMethod === 'Cash on Delivery'}
                            onChange={handleChange}
                            className="w-5 h-5 text-primary-500"
                          />
                          <FiDollarSign className="text-3xl text-green-500" />
                          <div className="flex-1">
                            <p className="text-white font-semibold">Cash on Delivery</p>
                            <p className="text-xs text-gray-400">Pay when you receive</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="luxury-card p-6 rounded-xl sticky top-24"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item._id} className="flex gap-3">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="text-white font-semibold text-sm">{item.title}</p>
                        <p className="text-gray-400 text-xs">{item.brand}</p>
                        <p className="text-gold-500 text-sm">
                          {item.quantity} x ₹{item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t border-gold-600/20 pt-4 mb-6">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping</span>
                    <span className="text-green-400">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Tax (10%)</span>
                    <span>${(getCartTotal() * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gold-600/20 pt-3">
                    <div className="flex justify-between text-white text-xl font-bold">
                      <span>Total</span>
                      <span className="text-gold-500">₹{(getCartTotal() * 1.1).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 gold-glow-btn text-black font-bold rounded-lg disabled:opacity-50"
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </motion.button>
              </motion.div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
