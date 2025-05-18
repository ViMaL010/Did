import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';

const InsuranceDiscovery = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: '',
    maritalStatus: '',
    dependents: ''
  });
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  
  // References for viewport detection
  const componentRef = useRef(null);
  const isInView = useInView(componentRef, { once: true, margin: "-100px 0px" });
  
  // Simulated navigation with loader
  const handleNavigate = () => {
    setLoading(true);
    // Simulate loading time
    setTimeout(() => {
      navigate('/agent');
    }, 2000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = () => {
    setStep(2);
  };

  const insurancePlans = [
    {
      title: 'Essential Coverage',
      price: 45,
      benefits: [
        'Medical emergencies',
        '24/7 Customer support',
        'No paperwork',
        'Quick claims'
      ]
    },
    {
      title: 'Family Protection Plus',
      price: 89,
      benefits: [
        'Full family coverage',
        'Dental & vision included',
        'Travel protection',
        'Low deductibles'
      ]
    },
    {
      title: 'Premium Protection',
      price: 125,
      benefits: [
        'Comprehensive coverage',
        'Global protection',
        'VIP customer service',
        'Zero waiting period'
      ]
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        duration: 0.5
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  // Sentinel 3 logo animation variants
  const logoLetterVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        duration: 0.5,
        ease: "easeOut" 
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const titleVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: i => ({
      opacity: 1,
      scale: 1,
      transition: { 
        delay: i * 0.2,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    hover: {
      scale: 1.03,
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
      transition: { duration: 0.3 }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      backgroundColor: "#1f2937",
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4" ref={componentRef}>
      <div className="max-w-4xl mx-auto">
        <motion.div 
          className="text-center mb-10"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.h1 
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
            variants={titleVariants}
          >
            Try the Future of Insurance Discovery – Right Now
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600"
            variants={itemVariants}
          >
            See how our personalized experience works with a quick demo
          </motion.p>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center"
            >
              <motion.div 
                className="relative"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Sentinel 3 Logo Animation */}
                <motion.div className="flex items-center justify-center">
                  <motion.div 
                    className="text-4xl md:text-6xl font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="text-blue-600">S</span>
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="text-gray-800"
                    >
                      entinel
                    </motion.span>
                    <motion.span 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      className="ml-2 text-blue-600"
                    >
                      3
                    </motion.span>
                  </motion.div>
                </motion.div>
                
                {/* Loading animation */}
                <motion.div className="mt-8 flex justify-center">
                  <motion.div
                    className="w-3 h-3 bg-blue-600 rounded-full mr-2"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.8, 1]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeInOut",
                      delay: 0
                    }}
                  />
                  <motion.div
                    className="w-3 h-3 bg-blue-600 rounded-full mr-2"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.8, 1]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeInOut",
                      delay: 0.2
                    }}
                  />
                  <motion.div
                    className="w-3 h-3 bg-blue-600 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.8, 1]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeInOut",
                      delay: 0.4
                    }}
                  />
                </motion.div>
                
                <motion.p 
                  className="mt-4 text-gray-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  Connecting you with your virtual advisor...
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        
          {step === 1 ? (
            <motion.div 
              key="form"
              className="bg-white rounded-lg shadow-md p-6 md:p-8 max-w-md mx-auto"
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              exit="exit"
              variants={containerVariants}
            >
              <div>
                <motion.div className="mb-6" variants={itemVariants}>
                  <label htmlFor="age" className="block text-gray-800 font-medium mb-2">
                    Your Age
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.2)" }}
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </motion.div>

                <motion.div className="mb-6" variants={itemVariants}>
                  <label htmlFor="maritalStatus" className="block text-gray-800 font-medium mb-2">
                    Marital Status
                  </label>
                  <motion.select
                    whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.2)" }}
                    id="maritalStatus"
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                  >
                    <option value="">Select status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </motion.select>
                </motion.div>

                <motion.div className="mb-8" variants={itemVariants}>
                  <label htmlFor="dependents" className="block text-gray-800 font-medium mb-2">
                    Number of Dependents
                  </label>
                  <motion.select
                    whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.2)" }}
                    id="dependents"
                    name="dependents"
                    value={formData.dependents}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                  >
                    <option value="">Select number</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5+">5+</option>
                  </motion.select>
                </motion.div>

                <motion.button
                  onClick={handleSubmit}
                  className="w-full bg-gray-900 text-white py-3 px-6 rounded-md font-medium transition duration-300"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Show My Options
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              exit="exit"
              variants={containerVariants}
            >
              <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {insurancePlans.map((plan, index) => (
                  <motion.div 
                    key={index} 
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                    custom={index}
                    variants={cardVariants}
                    whileHover="hover"
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                  >
                    <motion.div 
                      className="bg-blue-500 text-white p-4"
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1, transition: { delay: 0.3 + index * 0.2 } } : { opacity: 0 }}
                    >
                      <h2 className="text-xl font-semibold">{plan.title}</h2>
                      <p className="text-2xl font-bold">${plan.price}/month</p>
                    </motion.div>
                    <div className="p-6">
                      <h3 className="font-medium text-gray-800 mb-3">Key Benefits:</h3>
                      <ul className="space-y-2">
                        {plan.benefits.map((benefit, i) => (
                          <motion.li 
                            key={i} 
                            className="flex items-start"
                            initial={{ opacity: 0, x: -10 }}
                            animate={isInView 
                              ? { 
                                  opacity: 1, 
                                  x: 0,
                                  transition: { delay: 0.5 + index * 0.1 + i * 0.1 } 
                                }
                              : { opacity: 0, x: -10 }
                            }
                          >
                            <div className="mr-2 mt-1 text-blue-500">•</div>
                            <span>{benefit}</span>
                          </motion.li>
                        ))}
                      </ul>
                      <div className="flex items-center justify-start mt-6 space-x-3 text-gray-600 text-sm">
                        <motion.div 
                          className="flex items-center cursor-pointer"
                          whileHover={{ scale: 1.1 }}
                        >
                          <span className="mr-1">💬</span> Chat
                        </motion.div>
                        <motion.div 
                          className="flex items-center cursor-pointer"
                          whileHover={{ scale: 1.1 }}
                        >
                          <span className="mr-1">🎧</span> Audio
                        </motion.div>
                        <motion.div 
                          className="flex items-center cursor-pointer"
                          whileHover={{ scale: 1.1 }}
                        >
                          <span className="mr-1">📹</span> Video
                        </motion.div>
                      </div>
                      <motion.div 
                        className="w-full mt-4 py-2 px-4 border border-gray-300 rounded-md text-gray-800 font-medium hover:bg-gray-50 transition duration-300 text-center cursor-pointer"
                        onClick={handleNavigate}
                        whileHover={{ scale: 1.03, backgroundColor: "#f3f4f6" }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Chat with Virtual Advisor
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div 
                className="max-w-2xl mx-auto text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView 
                  ? { opacity: 1, y: 0, transition: { delay: 0.8, duration: 0.5 } }
                  : { opacity: 0, y: 30 }
                }
              >
                <p className="text-lg mb-4">Want a copy of your conversation and curated policies?</p>
                <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
                  <motion.input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:flex-1"
                    whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.2)" }}
                  />
                  <motion.div 
                    className="bg-gray-900 text-white py-2 px-6 rounded-md font-medium transition duration-300 cursor-pointer"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Email Me My Summary
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InsuranceDiscovery;