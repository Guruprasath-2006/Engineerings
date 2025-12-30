import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      toast.success('Login successful!');
      navigate('/');
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  // Engineering themed animated gears
  const gearVariants = {
    rotate: {
      rotate: 360,
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-luxury-gradient py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Engineering Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated Grid Blueprint Pattern */}
        <motion.div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(255, 111, 0, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 111, 0, 0.3) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
          animate={{
            backgroundPosition: ['0px 0px', '50px 50px']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Hexagon Pattern */}
        <motion.div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='none' stroke='%23ff6f00' stroke-width='1'/%3E%3C/svg%3E")`,
          }}
          animate={{
            opacity: [0.03, 0.08, 0.03],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Multiple Animated Gears with Different Sizes */}
        <motion.div
          className="absolute top-20 left-10 text-primary-500/10"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{ fontSize: '120px' }}
        >
          ⚙️
        </motion.div>
        
        <motion.div
          className="absolute top-40 right-20 text-primary-500/10"
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          style={{ fontSize: '80px' }}
        >
          ⚙️
        </motion.div>
        
        <motion.div
          className="absolute bottom-20 left-1/4 text-primary-500/10"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          style={{ fontSize: '100px' }}
        >
          ⚙️
        </motion.div>

        <motion.div
          className="absolute bottom-40 right-1/3 text-primary-500/10"
          animate={{ rotate: -360 }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          style={{ fontSize: '90px' }}
        >
          ⚙️
        </motion.div>

        {/* Animated Circuit Board Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          {/* Multiple circuit paths */}
          <motion.path
            d="M 0 100 Q 200 100 400 300 T 800 400"
            stroke="rgba(255, 111, 0, 0.5)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M 800 200 Q 600 200 400 400 T 0 500"
            stroke="rgba(255, 111, 0, 0.4)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.path
            d="M 400 0 L 400 300 L 600 500"
            stroke="rgba(255, 111, 0, 0.3)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="10 5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Moving particles on circuits */}
          <motion.circle
            cx="100"
            cy="100"
            r="5"
            fill="rgba(255, 111, 0, 0.8)"
            animate={{ cx: [100, 400, 800], cy: [100, 300, 400] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle
            cx="800"
            cy="200"
            r="4"
            fill="rgba(255, 200, 0, 0.9)"
            animate={{ cx: [800, 400, 0], cy: [200, 400, 500] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
        </svg>

        {/* Glowing Orbs */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full blur-xl"
            style={{
              width: `${50 + i * 10}px`,
              height: `${50 + i * 10}px`,
              background: `radial-gradient(circle, rgba(255, 111, 0, ${0.3 - i * 0.03}) 0%, transparent 70%)`,
              left: `${10 + i * 10}%`,
              top: `${15 + i * 8}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        ))}

        {/* Floating Engineering Tools with More Variety */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`tool-${i}`}
            className="absolute text-primary-500/10 text-3xl"
            initial={{ 
              x: `${10 + i * 12}%`,
              y: `${10 + i * 10}%`,
              rotate: 0
            }}
            animate={{
              y: [`${10 + i * 10}%`, `${20 + i * 10}%`, `${10 + i * 10}%`],
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {['🔧', '🔩', '⚡', '🏗️', '📐', '🔨', '⚙️', '🛠️'][i]}
          </motion.div>
        ))}

        {/* Pulsing Corner Accents */}
        {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
          <motion.div
            key={`corner-${i}`}
            className={`absolute ${pos} w-32 h-32`}
            style={{
              background: 'radial-gradient(circle at center, rgba(255, 111, 0, 0.2) 0%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}

        {/* Scanning Lines Effect */}
        <motion.div
          className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent"
          animate={{
            top: ['0%', '100%', '0%'],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ opacity: 0.3 }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotateX: -15 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="max-w-md w-full space-y-8 relative z-10"
      >
        {/* Engineering Header with Blueprint Style */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div 
            className="flex justify-center mb-4 relative"
          >
            <div className="relative">
              {/* Rotating Gear with Multiple Layers */}
              <motion.div
                className="text-6xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{ zIndex: 1 }}
              >
                ⚙️
              </motion.div>
              
              {/* Pulsing Glow Ring */}
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(255, 111, 0, 0.4) 0%, transparent 70%)',
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Orbiting Particles */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute w-2 h-2 bg-primary-500 rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                  }}
                  animate={{
                    x: [0, Math.cos((i * Math.PI) / 2) * 50, 0],
                    y: [0, Math.sin((i * Math.PI) / 2) * 50, 0],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.2,
                  }}
                />
              ))}
              
              <motion.div
                className="text-6xl relative z-10"
                animate={{
                  textShadow: [
                    '0 0 20px rgba(255, 111, 0, 0.5)',
                    '0 0 40px rgba(255, 111, 0, 0.8)',
                    '0 0 60px rgba(255, 111, 0, 1)',
                    '0 0 40px rgba(255, 111, 0, 0.8)',
                    '0 0 20px rgba(255, 111, 0, 0.5)',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ⚙️
              </motion.div>
            </div>
          </motion.div>
          
          <h2 className="mt-6 text-center text-4xl font-extrabold font-serif text-white relative">
            <motion.span
              initial={{ letterSpacing: '10px', opacity: 0 }}
              animate={{ letterSpacing: 'normal', opacity: 1 }}
              transition={{ duration: 1 }}
              className="relative inline-block"
            >
              {/* Glitch Effect on Text */}
              <motion.span
                className="relative z-10"
                animate={{
                  x: [0, -1, 1, -1, 0],
                }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                  repeatDelay: 5,
                }}
              >
                Engineering Access
              </motion.span>
              <motion.span
                className="absolute top-0 left-0 text-red-500 opacity-70"
                animate={{
                  x: [-2, 2, -2],
                  opacity: [0, 0.7, 0],
                }}
                transition={{
                  duration: 0.2,
                  repeat: Infinity,
                  repeatDelay: 6,
                }}
                style={{ clipPath: 'inset(0 0 50% 0)' }}
              >
                Engineering Access
              </motion.span>
              <motion.span
                className="absolute top-0 left-0 text-cyan-400 opacity-70"
                animate={{
                  x: [2, -2, 2],
                  opacity: [0, 0.7, 0],
                }}
                transition={{
                  duration: 0.2,
                  repeat: Infinity,
                  repeatDelay: 6,
                  delay: 0.1,
                }}
                style={{ clipPath: 'inset(50% 0 0 0)' }}
              >
                Engineering Access
              </motion.span>
            </motion.span>
            
            {/* Animated Underline with Gradient */}
            <motion.div
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent"
              initial={{ width: 0 }}
              animate={{ 
                width: ['0%', '100%', '100%'],
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ 
                width: { delay: 0.5, duration: 1 },
                backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" }
              }}
              style={{ backgroundSize: '200% 100%' }}
            />
          </h2>
          <motion.p 
            className="mt-4 text-center text-sm text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <motion.span
              animate={{
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Sign in to Velan Engineering Portal
            </motion.span>
          </motion.p>
        </motion.div>
        
        <motion.form 
          className="mt-8 space-y-6 luxury-card p-8 rounded-xl relative overflow-hidden border-2 border-primary-500/30"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Multiple Animated Borders */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-blue-500 to-primary-500"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ backgroundSize: '200% 100%' }}
          />
          
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-purple-500 to-primary-500"
            animate={{
              backgroundPosition: ['100% 50%', '0% 50%', '100% 50%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ backgroundSize: '200% 100%' }}
          />

          {/* Side Borders */}
          <motion.div
            className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-primary-500 via-blue-500 to-primary-500"
            animate={{
              backgroundPosition: ['50% 0%', '50% 100%', '50% 0%'],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ backgroundSize: '100% 200%' }}
          />
          
          <motion.div
            className="absolute top-0 bottom-0 right-0 w-1 bg-gradient-to-b from-primary-500 via-purple-500 to-primary-500"
            animate={{
              backgroundPosition: ['50% 100%', '50% 0%', '50% 100%'],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ backgroundSize: '100% 200%' }}
          />

          {/* Glowing Corner Dots */}
          {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
            <motion.div
              key={`dot-${i}`}
              className={`absolute ${pos} w-3 h-3 bg-primary-500 rounded-full`}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
                boxShadow: [
                  '0 0 10px rgba(255, 111, 0, 0.5)',
                  '0 0 20px rgba(255, 111, 0, 1)',
                  '0 0 10px rgba(255, 111, 0, 0.5)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}

          <div className="space-y-4 relative z-10">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                <motion.span 
                  className="mr-2"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  📧
                </motion.span> 
                Email Address
              </label>
              <motion.input
                whileFocus={{ 
                  scale: 1.02, 
                  borderColor: 'rgba(255, 111, 0, 1)',
                  boxShadow: '0 0 30px rgba(255, 111, 0, 0.4)',
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
              transition={{ delay: 0.6 }}
            >
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                <motion.span 
                  className="mr-2"
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  🔒
                </motion.span> 
                Password
              </label>
              <motion.input
                whileFocus={{ 
                  scale: 1.02, 
                  borderColor: 'rgba(255, 111, 0, 1)',
                  boxShadow: '0 0 30px rgba(255, 111, 0, 0.4)',
                }}
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-primary-600/30 bg-luxury-black text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Enter secure password"
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 0 30px rgba(255, 111, 0, 0.6)',
              }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 gold-glow-btn text-black font-bold rounded-lg disabled:opacity-50 relative overflow-hidden group"
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{ opacity: 0.3 }}
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
                    Initializing System...
                  </>
                ) : (
                  <>
                    <span className="mr-2">⚡</span>
                    Access Engineering Portal
                  </>
                )}
              </span>
            </motion.button>
          </motion.div>

          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-sm text-gray-400">
              New engineer?{' '}
              <Link to="/signup" className="text-primary-500 hover:text-primary-400 font-semibold relative group">
                <span>Register here</span>
                <motion.span
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </p>
          </motion.div>

          {/* Demo Credentials */}
          <motion.div 
            className="mt-6 p-4 bg-luxury-lightGray rounded-lg border-2 border-primary-600/20 relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
          >
            <motion.div
              className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary-500/10 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <p className="text-xs text-primary-400 mb-2 font-semibold flex items-center">
              <span className="mr-2">🔧</span> Demo System Access:
            </p>
            <p className="text-xs text-gray-300">👨‍💼 Admin: admin@aromaluxe.com / admin123</p>
            <p className="text-xs text-gray-300">👷 User: user@aromaluxe.com / user123</p>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Login;


