import { Play } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";

export default function InsuranceLandingPage({ scrollToDiscovery }) {
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
    src="/dubai.svg"
    alt="Travel landmarks background"
    className="w-full h-full object-contain mt-40 md:mt-20 md:object-cover opacity-20"
  />
</motion.div>


      {/* Content */}
      <div className="relative z-10">
        {/* Navbar Component */}
        <Navbar scrollToDiscovery={scrollToDiscovery} />

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