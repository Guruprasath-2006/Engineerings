import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiSettings, 
  FiLayers, 
  FiTool, 
  FiMessageCircle, 
  FiHelpCircle,
  FiMail,
  FiPhone,
  FiMapPin,
  FiArrowRight
} from 'react-icons/fi';

const Footer = () => {
  const services = [
    { name: 'All Services', icon: FiLayers, link: '/shop' },
    { name: 'Mechanical Engineering', icon: FiSettings, link: '/shop?category=Mechanical Engineering' },
    { name: 'Industrial Engineering', icon: FiTool, link: '/shop?category=Industrial Engineering' },
    { name: 'Engineering Consulting', icon: FiMessageCircle, link: '/shop?category=Engineering Consulting' }
  ];

  const support = [
    { name: 'Contact Us', icon: FiMail, link: '/contact' },
    { name: 'FAQ', icon: FiHelpCircle, link: '/faq' }
  ];

  return (
    <footer className="relative bg-gradient-to-b from-luxury-darkGray to-luxury-black border-t border-primary-600/20 mt-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #2196f3 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          {/* Brand Section - Larger */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <div className="luxury-card p-8 rounded-2xl border border-primary-600/20 bg-gradient-to-br from-luxury-lightGray/30 to-transparent">
              <h3 className="text-3xl md:text-4xl font-bold font-serif mb-4">
                <span className="text-white">Velan</span>
                <span className="bg-gradient-to-r from-primary-500 to-blue-400 bg-clip-text text-transparent"> Engineering</span>
              </h3>
              <div className="h-1 w-20 bg-gradient-to-r from-primary-500 to-transparent mb-6 rounded-full" />
              <p className="text-gray-300 text-base leading-relaxed mb-6">
                Professional engineering solutions for industrial, mechanical, electrical, and civil projects. 
                Excellence in design, consulting, and execution.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-400 hover:text-primary-500 transition-colors">
                  <div className="p-2 bg-primary-500/10 rounded-lg">
                    <FiMapPin className="w-4 h-4 text-primary-500" />
                  </div>
                  <span className="text-sm">9/1022 Arvind Nagar, Chinna Andan Kovil Road, Near Madurai Bypass, Karur - 639001</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400 hover:text-primary-500 transition-colors">
                  <div className="p-2 bg-primary-500/10 rounded-lg">
                    <FiMail className="w-4 h-4 text-primary-500" />
                  </div>
                  <span className="text-sm">velankarur1976@gmail.com</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400 hover:text-primary-500 transition-colors">
                  <div className="p-2 bg-primary-500/10 rounded-lg">
                    <FiPhone className="w-4 h-4 text-primary-500" />
                  </div>
                  <span className="text-sm">+91 9443839900</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Services & Support Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Our Services */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h4 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
                <div className="p-2 bg-primary-500/10 rounded-lg">
                  <FiSettings className="w-5 h-5 text-primary-500" />
                </div>
                Our Services
              </h4>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <motion.li
                    key={service.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Link 
                      to={service.link} 
                      className="group flex items-center gap-3 text-gray-400 hover:text-primary-500 transition-all duration-300 p-3 rounded-lg hover:bg-luxury-lightGray/30"
                    >
                      <service.icon className="w-4 h-4 text-primary-500/60 group-hover:text-primary-500 transition-colors" />
                      <span className="text-sm">{service.name}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Customer Service */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
                <div className="p-2 bg-primary-500/10 rounded-lg">
                  <FiHelpCircle className="w-5 h-5 text-primary-500" />
                </div>
                Customer Service
              </h4>
              <ul className="space-y-3">
                {support.map((item, index) => (
                  <motion.li
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                  >
                    <Link 
                      to={item.link} 
                      className="group flex items-center gap-3 text-gray-400 hover:text-primary-500 transition-all duration-300 p-3 rounded-lg hover:bg-luxury-lightGray/30"
                    >
                      <item.icon className="w-4 h-4 text-primary-500/60 group-hover:text-primary-500 transition-colors" />
                      <span className="text-sm">{item.name}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>

              {/* CTA Box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="mt-8 p-6 bg-gradient-to-br from-primary-500/10 to-blue-500/5 rounded-xl border border-primary-600/30"
              >
                <h5 className="text-white font-semibold mb-2">Need Engineering Solutions?</h5>
                <p className="text-gray-400 text-xs mb-4">Get expert consultation for your projects</p>
                <Link to="/contact">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2 px-4 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    Contact Us
                    <FiArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="pt-8 border-t border-primary-600/20"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              &copy; 2024 <span className="text-primary-500 font-semibold">Velan Engineering</span>. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-gray-500">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                Engineering Excellence Since 1995
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;


