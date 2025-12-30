import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import axios from 'axios';
import { FiArrowRight, FiStar } from 'react-icons/fi';

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / (duration * 1000);

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, isInView]);

  return <span ref={ref}>{count}</span>;
};

// Animated Text Letter by Letter Component
const AnimatedText = ({ text, className = "", highlightWords = [] }) => {
  const letters = text.split('');
  
  return (
    <span className={className}>
      {letters.map((letter, index) => {
        const word = text.substring(0, index + 1).split(' ').pop();
        const isHighlighted = highlightWords.some(hw => word.includes(hw));
        
        return (
          <motion.span
            key={index}
            initial={{ opacity: 0, x: -20, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.03,
              ease: [0.25, 0.1, 0.25, 1]
            }}
            className={`inline-block ${isHighlighted ? 'text-primary-500 font-bold text-3xl' : ''}`}
            style={{ 
              display: letter === ' ' ? 'inline' : 'inline-block',
              whiteSpace: letter === ' ' ? 'pre' : 'normal'
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        );
      })}
    </span>
  );
};

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setFeaturedProducts(data.products.slice(0, 6));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  return (
    <div className="bg-luxury-black">
      {/* Hero Section - Unique Engineering Design */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-luxury-black via-luxury-darkGray to-luxury-black">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255, 111, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 111, 0, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Floating Geometric Shapes */}
        <motion.div
          animate={{
            y: [0, -30, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-10 w-32 h-32 border-4 border-primary-500/30"
        ></motion.div>

        <motion.div
          animate={{
            y: [0, 40, 0],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-10 w-40 h-40 rounded-full border-4 border-primary-500/20"
        ></motion.div>

        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/3 right-1/4 w-24 h-24 bg-primary-500/10 backdrop-blur-sm"
          style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
        ></motion.div>

        {/* Orange Glow Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl"></div>

        {/* Main Content */}
        <div className="relative z-10 text-center px-4 max-w-7xl mx-auto py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Company Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-6"
            >
              <div className="px-6 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full backdrop-blur-sm">
                <span className="text-primary-500 font-semibold text-sm tracking-wider">VELAN ENGINEERING</span>
              </div>
            </motion.div>

            {/* Main Heading with Unique Typography */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="mb-2"
              >
                <span className="text-white bg-clip-text">Engineering</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="relative inline-block"
              >
                <span className="text-transparent bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text font-black">
                  Excellence
                </span>
                <motion.div
                  animate={{ width: ['0%', '100%'] }}
                  transition={{ delay: 1, duration: 1 }}
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary-400 to-primary-600"
                ></motion.div>
              </motion.div>
            </h1>

            {/* Services List with Icons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap justify-center gap-4 mb-8 max-w-4xl mx-auto"
            >
              {[
                { icon: '❄️', text: 'HVAC Systems' },
                { icon: '⚡', text: 'Automation' },
                { icon: '🚪', text: 'Door Design' },
                { icon: '🪟', text: 'Window Design' },
                { icon: '🚧', text: 'Gate Systems' },
                { icon: '🏠', text: 'Roofing Solutions' },
                { icon: '🏭', text: 'Industrial Projects' }
              ].map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="px-4 py-2 bg-luxury-darkGray/50 backdrop-blur-sm border border-primary-500/20 rounded-lg hover:border-primary-500/50 transition-all"
                >
                  <span className="text-primary-500 mr-2">{service.icon}</span>
                  <span className="text-gray-300 text-sm">{service.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Description */}
            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Professional engineering solutions with <span className="text-primary-500 font-semibold"><AnimatedCounter end={49} duration={5} /> years</span> of expertise in mechanical and industrial systems
            </p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link to="/shop">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(255, 111, 0, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-10 py-5 bg-gradient-to-r from-primary-500 to-primary-600 text-black font-bold rounded-xl text-lg flex items-center space-x-3 shadow-primary-lg relative overflow-hidden"
                >
                  <span className="relative z-10">Explore Services</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="relative z-10"
                  >
                    <FiArrowRight className="text-xl" />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </motion.button>
              </Link>
              
              <Link to="/shop?category=Consulting">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 border-2 border-primary-500 text-white font-bold rounded-xl text-lg hover:bg-primary-500/10 transition-all backdrop-blur-sm"
                >
                  Get Free Consultation
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-white mb-4">
              Engineering Disciplines
            </h2>
            <p className="text-gray-400 text-lg">Specialized solutions in mechanical and industrial engineering</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { name: 'Mechanical', icon: '⚙️', desc: 'HVAC, Roofing Systems, Door & Window Design, Gate Systems' },
              { name: 'Industrial', icon: '🏭', desc: 'Automation, Plant Design & Manufacturing Solutions' }
            ].map((category, index) => (
              <Link to={`/shop?category=${category.name}`} key={category.name}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="luxury-card p-8 rounded-xl text-center cursor-pointer group"
                >
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                  <p className="text-gray-400">{category.desc}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 bg-luxury-darkGray">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-white mb-4">
              Featured Services
            </h2>
            <p className="text-gray-400 text-lg">Our most requested engineering solutions</p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="loader"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link to={`/product/${product._id}`}>
                    <div className="luxury-card rounded-xl overflow-hidden group">
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 right-4 bg-primary-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                          ₹{product.price}
                        </div>
                      </div>
                      <div className="p-6">
                        <p className="text-primary-500 text-sm font-semibold mb-1">{product.brand}</p>
                        <h3 className="text-xl font-bold text-white mb-2">{product.title}</h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <FiStar className="text-primary-500 fill-current" />
                            <span className="text-white font-semibold">{product.rating}</span>
                          </div>
                          <span className="text-gray-400 text-sm">{product.size}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/shop">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 gold-glow-btn text-black font-bold rounded-lg flex items-center space-x-2 mx-auto"
              >
                <span>View All Services</span>
                <FiArrowRight />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-white mb-4">
              Why Choose Velan Engineering?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🏆', title: 'Years Experience', number: 49, desc: 'Proven expertise in industrial and commercial projects' },
              { icon: '🚚', title: 'On-Time Delivery and installation', desc: 'Meeting deadlines with precision and quality' },
              { icon: '💎', title: 'Industry Certified', desc: 'ISO certified and compliant with international standards' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-8 rounded-xl relative overflow-hidden"
              >
                {/* Special animations for Years Experience card */}
                {index === 0 && (
                  <>
                    {/* Animated background glow */}
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-primary-600/20 to-primary-700/20 blur-xl"
                    />
                    
                    {/* Sparkle effects */}
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0],
                          rotate: [0, 180, 360],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.7,
                          ease: "easeInOut"
                        }}
                        className="absolute w-2 h-2 bg-primary-500 rounded-full"
                        style={{
                          top: `${20 + i * 20}%`,
                          left: `${10 + i * 30}%`,
                        }}
                      />
                    ))}
                  </>
                )}
                
                {/* Animations for On-Time Delivery card */}
                {index === 1 && (
                  <>
                    {/* Moving truck animation path */}
                    <motion.div
                      animate={{
                        x: [-300, 300],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="absolute top-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent"
                    />
                    
                    {/* Speed lines */}
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          x: [100, -100],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.3,
                          ease: "linear"
                        }}
                        className="absolute h-px bg-primary-500/50"
                        style={{
                          top: `${40 + i * 5}%`,
                          width: '60px',
                          right: 0,
                        }}
                      />
                    ))}
                    
                    {/* Pulse glow */}
                    <motion.div
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-primary-500/10 to-blue-500/10 blur-xl"
                    />
                  </>
                )}
                
                {/* Animations for Industry Certified card */}
                {index === 2 && (
                  <>
                    {/* Rotating rings */}
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="absolute inset-0 border-2 border-primary-500/20 rounded-full"
                      style={{ margin: '20%' }}
                    />
                    
                    <motion.div
                      animate={{
                        rotate: [360, 0],
                        scale: [1.2, 1, 1.2],
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="absolute inset-0 border-2 border-primary-500/20 rounded-full"
                      style={{ margin: '30%' }}
                    />
                    
                    {/* Diamond sparkles */}
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          scale: [0, 1.5, 0],
                          opacity: [0, 1, 0],
                          rotate: [0, 180],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.5,
                          ease: "easeInOut"
                        }}
                        className="absolute w-3 h-3 bg-primary-500"
                        style={{
                          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                          top: `${30 + (i % 2) * 40}%`,
                          left: `${20 + Math.floor(i / 2) * 60}%`,
                        }}
                      />
                    ))}
                    
                    {/* Premium glow */}
                    <motion.div
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.2, 0.5, 0.2],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-primary-500/10 to-pink-500/10 blur-xl"
                    />
                  </>
                )}
                
                {/* Animated icon */}
                <motion.div
                  animate={
                    index === 0 ? {
                      y: [0, -20, 0],
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.2, 1],
                    } : index === 1 ? {
                      x: [0, 10, 0],
                      y: [0, -5, 0],
                    } : {
                      rotate: [0, 20, -20, 0],
                      scale: [1, 1.15, 1],
                    }
                  }
                  transition={{
                    duration: index === 0 ? 2 : index === 1 ? 1.5 : 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-6xl mb-4 relative z-10"
                  style={{
                    filter: `drop-shadow(0 0 20px ${
                      index === 0 ? 'rgba(255, 111, 0, 0.8)' : 
                      index === 1 ? 'rgba(34, 197, 94, 0.6)' : 
                      'rgba(168, 85, 247, 0.6)'
                    })`
                  }}
                >
                  {item.icon}
                </motion.div>
                
                <h3 className="text-2xl font-bold text-white mb-2 relative z-10">
                  {item.number ? (
                    <>
                      <motion.span 
                        className="text-5xl block mb-2"
                        animate={{
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <span className="text-transparent bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text font-black">
                          <AnimatedCounter end={item.number} duration={3} />
                        </span>
                      </motion.span>
                      <span className="text-white">{item.title}</span>
                    </>
                  ) : (
                    item.title
                  )}
                </h3>
                <p className="text-gray-400 relative z-10">{item.desc}</p>
                
                {/* Bottom shine effect for experience card */}
                {index === 0 && (
                  <motion.div
                    animate={{
                      x: [-200, 200],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute bottom-0 left-0 w-32 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;


