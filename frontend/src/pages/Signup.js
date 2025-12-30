import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const result = await register(formData.name, formData.email, formData.password);

    if (result.success) {
      toast.success('Account created successfully!');
      navigate('/');
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-luxury-gradient py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Blueprint Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Technical Grid */}
        <motion.div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(255, 111, 0, 0.3) 0px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, rgba(255, 111, 0, 0.3) 0px, transparent 1px, transparent 20px)',
          }}
          animate={{
            opacity: [0.03, 0.08, 0.03],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Rotating Technical Diagram Circles */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <motion.circle
            cx="20%"
            cy="20%"
            r="100"
            stroke="rgba(255, 111, 0, 0.5)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0, rotate: 0 }}
            animate={{ pathLength: 1, rotate: 360 }}
            transition={{ pathLength: { duration: 2 }, rotate: { duration: 20, repeat: Infinity, ease: "linear" } }}
          />
          <motion.circle
            cx="80%"
            cy="30%"
            r="150"
            stroke="rgba(255, 111, 0, 0.3)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="10 5"
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
          <motion.circle
            cx="70%"
            cy="80%"
            r="80"
            stroke="rgba(255, 111, 0, 0.4)"
            strokeWidth="1"
            fill="none"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </svg>

        {/* Floating Engineering Icons */}
        {['🏗️', '📐', '⚙️', '🔩', '🔧', '⚡'].map((icon, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl opacity-10"
            initial={{
              x: `${10 + i * 15}%`,
              y: `${10 + i * 10}%`,
            }}
            animate={{
              y: [`${10 + i * 10}%`, `${20 + i * 10}%`, `${10 + i * 10}%`],
              rotate: [0, 360],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {icon}
          </motion.div>
        ))}

        {/* Animated Construction Lines */}
        <svg className="absolute inset-0 w-full h-full">
          {[...Array(3)].map((_, i) => (
            <motion.line
              key={i}
              x1="0"
              y1={`${30 + i * 20}%`}
              x2="100%"
              y2={`${30 + i * 20}%`}
              stroke="rgba(255, 111, 0, 0.2)"
              strokeWidth="1"
              strokeDasharray="5 5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className="max-w-md w-full space-y-8 relative z-10"
      >
        {/* Engineering Registration Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div 
            className="flex justify-center mb-4"
            animate={{ 
              rotateY: [0, 360],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <motion.div
              className="text-6xl relative"
              animate={{
                scale: [1, 1.1, 1],
                filter: [
                  'drop-shadow(0 0 10px rgba(255, 111, 0, 0.5))',
                  'drop-shadow(0 0 20px rgba(255, 111, 0, 0.8))',
                  'drop-shadow(0 0 10px rgba(255, 111, 0, 0.5))',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🏗️
            </motion.div>
          </motion.div>
          
          <h2 className="mt-6 text-center text-4xl font-extrabold font-serif text-white relative">
            <motion.span
              initial={{ clipPath: 'inset(0 100% 0 0)' }}
              animate={{ clipPath: 'inset(0 0% 0 0)' }}
              transition={{ duration: 1.5 }}
            >
              Engineer Registration
            </motion.span>
            <motion.div
              className="absolute -bottom-2 left-0 right-0 mx-auto h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            />
          </h2>
          <motion.p 
            className="mt-4 text-center text-sm text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Join Velan Engineering's professional network
          </motion.p>
        </motion.div>
        
        <motion.form 
          className="mt-8 space-y-6 luxury-card p-8 rounded-xl relative overflow-hidden border-2 border-primary-500/30"
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {/* Animated Border */}
          <motion.div
            className="absolute inset-0 rounded-xl"
            style={{
              background: 'linear-gradient(90deg, rgba(255, 111, 0, 0) 0%, rgba(255, 111, 0, 0.3) 50%, rgba(255, 111, 0, 0) 100%)',
            }}
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          <div className="space-y-4 relative z-10">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                <span className="mr-2">👤</span> Full Name
              </label>
              <motion.input
                whileFocus={{ 
                  scale: 1.02, 
                  borderColor: 'rgba(255, 111, 0, 1)',
                  boxShadow: '0 0 20px rgba(255, 111, 0, 0.3)'
                }}
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-primary-600/30 bg-luxury-black text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Engineer Name"
              />
            </motion.div>

            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                <span className="mr-2">📧</span> Email Address
              </label>
              <motion.input
                whileFocus={{ 
                  scale: 1.02, 
                  borderColor: 'rgba(255, 111, 0, 1)',
                  boxShadow: '0 0 20px rgba(255, 111, 0, 0.3)'
                }}
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-primary-600/30 bg-luxury-black text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="engineer@velan.com"
              />
            </motion.div>
            
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                <span className="mr-2">🔒</span> Password
              </label>
              <motion.input
                whileFocus={{ 
                  scale: 1.02, 
                  borderColor: 'rgba(255, 111, 0, 1)',
                  boxShadow: '0 0 20px rgba(255, 111, 0, 0.3)'
                }}
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-primary-600/30 bg-luxury-black text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Secure password (min. 6 characters)"
              />
            </motion.div>

            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                <span className="mr-2">✅</span> Confirm Password
              </label>
              <motion.input
                whileFocus={{ 
                  scale: 1.02, 
                  borderColor: 'rgba(255, 111, 0, 1)',
                  boxShadow: '0 0 20px rgba(255, 111, 0, 0.3)'
                }}
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-primary-600/30 bg-luxury-black text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Re-enter password"
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="relative z-10"
          >
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 0 40px rgba(255, 111, 0, 0.6)',
              }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 gold-glow-btn text-black font-bold rounded-lg disabled:opacity-50 relative overflow-hidden group"
            >
              {/* Animated shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                animate={{
                  x: ['-200%', '200%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: 1,
                }}
              />
              
              <span className="relative z-10 flex items-center">
                {loading ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      ⚙️
                    </motion.span>
                    Building Profile...
                  </>
                ) : (
                  <>
                    <motion.span
                      animate={{ 
                        scale: [1, 1.2, 1],
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="mr-2"
                    >
                      🚀
                    </motion.span>
                    Register as Engineer
                  </>
                )}
              </span>
            </motion.button>
          </motion.div>

          <motion.div 
            className="text-center relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="text-sm text-gray-400">
              Already registered?{' '}
              <Link to="/login" className="text-primary-500 hover:text-primary-400 font-semibold relative group">
                <span>Access Portal</span>
                <motion.span
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </p>
          </motion.div>

          {/* Registration Benefits */}
          <motion.div 
            className="mt-6 p-4 bg-luxury-lightGray rounded-lg border-2 border-primary-600/20 relative overflow-hidden z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <motion.div
              className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-primary-500 to-blue-500"
              animate={{
                height: ['0%', '100%', '0%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <p className="text-xs text-primary-400 mb-2 font-semibold flex items-center pl-4">
              <span className="mr-2">✨</span> Engineer Benefits:
            </p>
            <div className="space-y-1 pl-4">
              <p className="text-xs text-gray-300 flex items-center">
                <span className="mr-2">⚡</span> Access to 500+ engineering projects
              </p>
              <p className="text-xs text-gray-300 flex items-center">
                <span className="mr-2">🎯</span> Professional design tools & resources
              </p>
              <p className="text-xs text-gray-300 flex items-center">
                <span className="mr-2">🏆</span> 24/7 technical support & consultation
              </p>
            </div>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Signup;


