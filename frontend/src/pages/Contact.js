import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiSend, 
  FiUser, 
  FiMessageSquare,
  FiClock,
  FiCheckCircle
} from 'react-icons/fi';
import axios from 'axios';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send email using EmailJS or your backend
      // For now, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: FiMapPin,
      title: 'Visit Us',
      content: '9/1022 Arvind Nagar, Chinna Andan Kovil Road, Near Madurai Bypass, Karur - 639001',
      color: 'primary'
    },
    {
      icon: FiMail,
      title: 'Email Us',
      content: 'velankarur1976@gmail.com',
      color: 'blue',
      link: 'mailto:velankarur1976@gmail.com'
    },
    {
      icon: FiPhone,
      title: 'Call Us',
      content: '+91 9443839900',
      color: 'green',
      link: 'tel:+919443839900'
    },
    {
      icon: FiClock,
      title: 'Business Hours',
      content: 'Mon - Sat: 9:00 AM - 6:00 PM',
      color: 'purple'
    }
  ];

  return (
    <div className="min-h-screen bg-luxury-black py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold font-serif text-white mb-4">
            Get In <span className="text-primary-500">Touch</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Have a project in mind? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        {/* Contact Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="luxury-card p-6 rounded-xl text-center hover:shadow-xl hover:shadow-primary-500/20 transition-all duration-300"
            >
              <div className={`inline-flex p-4 bg-${info.color}-500/10 rounded-full mb-4`}>
                <info.icon className={`w-6 h-6 text-${info.color}-500`} />
              </div>
              <h3 className="text-white font-semibold mb-2">{info.title}</h3>
              {info.link ? (
                <a 
                  href={info.link}
                  className="text-gray-400 text-sm hover:text-primary-500 transition-colors"
                >
                  {info.content}
                </a>
              ) : (
                <p className="text-gray-400 text-sm">{info.content}</p>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Form & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="luxury-card p-8 md:p-10 rounded-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-primary-500/10 rounded-lg">
                  <FiMessageSquare className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Send us a Message</h2>
                  <p className="text-gray-400 text-sm">Fill out the form below and we'll get back to you</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm font-medium">
                      Your Name *
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-luxury-black text-white border border-primary-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2 text-sm font-medium">
                      Email Address *
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-luxury-black text-white border border-primary-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm font-medium">
                      Phone Number
                    </label>
                    <div className="relative">
                      <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-luxury-black text-white border border-primary-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                        placeholder="+91 9443839900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2 text-sm font-medium">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      placeholder="Project Inquiry"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-medium">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none"
                    placeholder="Tell us about your project requirements..."
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-primary-500 to-blue-500 hover:from-primary-600 hover:to-blue-600 text-white font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-500/30"
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Why Choose Us */}
            <div className="luxury-card p-8 rounded-2xl bg-gradient-to-br from-primary-500/10 to-transparent border border-primary-600/30">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FiCheckCircle className="text-primary-500" />
                Why Choose Us?
              </h3>
              <ul className="space-y-4">
                {[
                  'Expert Engineering Solutions',
                  'Quality Workmanship',
                  'Timely Project Delivery',
                  '24/7 Customer Support',
                  'Competitive Pricing',
                  'Experienced Team'
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-3 text-gray-300"
                  >
                    <div className="w-2 h-2 bg-primary-500 rounded-full" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Quick Response */}
            <div className="luxury-card p-8 rounded-2xl">
              <h3 className="text-xl font-bold text-white mb-4">Quick Response</h3>
              <p className="text-gray-400 text-sm mb-4">
                We typically respond to inquiries within 24 hours during business days.
              </p>
              <div className="p-4 bg-primary-500/10 rounded-lg border border-primary-600/30">
                <p className="text-primary-500 text-sm font-semibold">
                  For urgent inquiries, call us directly at:
                </p>
                <a 
                  href="tel:+919443839900"
                  className="text-white text-xl font-bold mt-2 block hover:text-primary-500 transition-colors"
                >
                  +91 9443839900
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
