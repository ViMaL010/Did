import { Play } from "lucide-react";
import { motion } from "framer-motion";

export default function InsuranceLandingPage({ scrollToDiscovery }) {
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
            <h1 className="text-2xl font-cursive font-bold">Logo</h1>
          </motion.div>

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
        </nav>

        {/* Hero Section */}
        <div className="container mx-auto px-4 py-20 text-center">
          <motion.h2
            variants={slideInFromTop}
            className="text-5xl font-bold text-gray-800 mb-6"
          >
            Get Personalized Insurance <br /> Advice Instantly
          </motion.h2>

          <motion.p
            variants={slideInFromBottom}
            className="text-lg text-gray-600 max-w-3xl mx-auto mb-12"
          >
            Choose an insurance type, connect with a live expert via video call, and get tailored policy
            suggestions within minutes.
          </motion.p>

          <motion.div
            variants={staggerButtons}
            className="flex flex-col md:flex-row justify-center gap-4"
          >
            <motion.button
              variants={buttonVariant}
              whileHover="hover"
              className="bg-gray-800 text-white px-8 py-3 rounded-md hover:bg-gray-700 transition-colors"
              onClick={scrollToDiscovery}
            >
              Explore Plans
            </motion.button>

            <motion.button
              variants={buttonVariant}
              whileHover="hover"
              className="border border-gray-300 text-gray-800 px-8 py-3 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
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