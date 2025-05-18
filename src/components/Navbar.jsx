import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Navbar({ scrollToDiscovery }) {

    const navigate = useNavigate();
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
        <div onClick={()=>{
            navigate('/')
        }}>
        <motion.a
          variants={navItemVariant}
          whileHover="hover"
          className="text-gray-800"
        >
          Home
        </motion.a>

        </div>
        <div onClick={()=>{
            navigate('/')
        }}>
        <motion.a
          
          variants={navItemVariant}
          whileHover="hover"
          className="text-gray-800"
        >
          See AI in Action
        </motion.a>
        </div>
        <div onClick={()=>{
            navigate('/')
        }}>
        <motion.div
          variants={navItemVariant}
          whileHover="hover"
          className="relative group"
        >
          <a  className="text-gray-800 flex items-center">
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
        </div>
        <div onClick={()=>{
            navigate('/')
        }}>
        <motion.a
          
          variants={navItemVariant}
          whileHover="hover"
          className="text-gray-800"
        >
          Plans & Costs
        </motion.a>
        </div>
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
              <div
                className="text-gray-800 text-xl font-medium"
                onClick={() => {
                    setMobileMenuOpen(false)
                    navigate('/')
                }}
              >
                Home
              </div>
              <div 
                className="text-gray-800 text-xl font-medium"
                onClick={() => {
                    setMobileMenuOpen(false)
                    navigate('/')
                }}
              >
                See AI in Action
              </div>
              <div
                className="text-gray-800 text-xl font-medium"
                onClick={() => {
                    setMobileMenuOpen(false)
                    navigate('/')
                }}
              >
                Coverage Options
              </div>
              <div
                className="text-gray-800 text-xl font-medium"
                onClick={() => {
                    setMobileMenuOpen(false)
                    navigate('/')
                }}
              >
                Plans & Costs
              </div>
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
  );
}