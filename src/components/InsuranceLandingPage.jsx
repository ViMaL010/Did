import { Play, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function InsuranceLandingPage({ scrollToDiscovery }) {
  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Screen size state
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add resize listener
    window.addEventListener('resize', checkScreenSize);
    
    // Clean up
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  const slideInFromTop = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, delay: 0.2 }
    }
  };

  const slideInFromBottom = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, delay: 0.4 }
    }
  };

  const staggerButtons = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.6
      }
    }
  };

  const buttonVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  const navItemVariant = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    },
    hover: {
      scale: 1.05,
      color: "#2563EB", // blue-600
      transition: { duration: 0.2 }
    }
  };

  // Mobile menu animation variants
  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        type: "tween",
        duration: 0.3
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "tween",
        duration: 0.3
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-white font-sans relative overflow-hidden"
    >
      {/* Background Image with simple fade-in animation */}
      <motion.div
        variants={fadeIn}
        className="absolute inset-0 w-full h-full z-0 opacity-60"
      >
        <img
          src="/back.svg"
          alt="Travel landmarks background"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            variants={fadeIn}
            className="flex items-center"
          >
            <h1 className="text-xl md:text-2xl font-cursive font-bold">Logo</h1>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.3
                }
              }
            }}
            className="hidden md:flex space-x-8"
          >
            <motion.a
              href="#"
              variants={navItemVariant}
              whileHover="hover"
              className="text-gray-800"
            >
              Home
            </motion.a>
            <motion.a
              href="#"
              variants={navItemVariant}
              whileHover="hover"
              className="text-gray-800"
            >
              See AI in Action
            </motion.a>
            <motion.div
              variants={navItemVariant}
              whileHover="hover"
              className="relative group"
            >
              <a href="#" className="text-gray-800 flex items-center">
                Coverage Options
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </a>
            </motion.div>
            <motion.a
              href="#"
              variants={navItemVariant}
              whileHover="hover"
              className="text-gray-800"
            >
              Plans & Costs
            </motion.a>
          </motion.div>

          {/* Desktop CTA Button */}
          <div className="hidden md:block">
            <motion.div
              variants={fadeIn}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <button 
                className="bg-gray-800 text-white px-6 py-2 rounded-full hover:bg-gray-700 transition-colors"
                onClick={scrollToDiscovery}
              >
                Get Free Advice Now
              </button>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            variants={fadeIn}
            className="md:hidden z-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X size={24} className="text-gray-800" />
            ) : (
              <Menu size={24} className="text-gray-800" />
            )}
          </motion.button>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={mobileMenuVariants}
                className="fixed inset-0 bg-white flex flex-col z-40 p-8 md:hidden"
              >
                <div className="flex flex-col items-center justify-center space-y-8 mt-16">
                  <a 
                    href="#"
                    className="text-gray-800 text-xl font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </a>
                  <a 
                    href="#"
                    className="text-gray-800 text-xl font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    See AI in Action
                  </a>
                  <a 
                    href="#"
                    className="text-gray-800 text-xl font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Coverage Options
                  </a>
                  <a 
                    href="#"
                    className="text-gray-800 text-xl font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Plans & Costs
                  </a>
                  <button 
                    className="bg-gray-800 text-white px-6 py-3 rounded-full mt-6"
                    onClick={() => {
                      scrollToDiscovery();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Get Free Advice Now
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Hero Section */}
        <div className="container mx-auto px-4 py-10 md:py-20 text-center">
          <motion.h2
            variants={slideInFromTop}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 md:mb-6"
          >
            Get Personalized Insurance{isMobile ? " " : <br />}Advice Instantly
          </motion.h2>

          <motion.p
            variants={slideInFromBottom}
            className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto mb-8 md:mb-12 px-2"
          >
            Choose an insurance type, connect with a live expert via video call, and get tailored policy
            suggestions within minutes.
          </motion.p>

          <motion.div
            variants={staggerButtons}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <motion.button
              variants={buttonVariant}
              whileHover="hover"
              className="bg-gray-800 text-white px-6 md:px-8 py-3 rounded-md hover:bg-gray-700 transition-colors"
              onClick={scrollToDiscovery}
            >
              Explore Plans
            </motion.button>

            <motion.button
              variants={buttonVariant}
              whileHover="hover"
              className="border border-gray-300 text-gray-800 px-6 md:px-8 py-3 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
              onClick={scrollToDiscovery}
            >
              Watch Demo
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Play className="ml-2" size={16} />
              </motion.div>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}