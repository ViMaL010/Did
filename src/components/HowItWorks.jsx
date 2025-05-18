import React, { useState, useEffect } from 'react';

const HowItWorks = () => {
  // State for tracking screen size
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Effect to check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <section className="w-full">
      <div className="max-w-4xl mx-auto py-16 md:py-24 lg:py-40 px-4 md:px-8 lg:px-16">
        {/* <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12">
          How It Works
        </h2> */}
        
        {/* Desktop/Tablet Image */}
        <div className="hidden sm:block">
          <img
            src="/items.svg"
            alt="How it Works - Insurance Process Flow"
            className="w-full h-auto"
          />
        </div>
        
        {/* Mobile-optimized alternative layout */}
        <div className="sm:hidden">
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                  1
                </div>
                <h3 className="font-semibold text-lg">Choose Your Insurance</h3>
              </div>
              <p className="text-gray-600">
                Select from our range of insurance options tailored to your specific needs.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                  2
                </div>
                <h3 className="font-semibold text-lg">Connect with Expert</h3>
              </div>
              <p className="text-gray-600">
                Schedule a video call with one of our insurance specialists.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                  3
                </div>
                <h3 className="font-semibold text-lg">Get Personalized Advice</h3>
              </div>
              <p className="text-gray-600">
                Receive tailored policy suggestions based on your situation.
              </p>
            </div>
            
            {/* Step 4 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                  4
                </div>
                <h3 className="font-semibold text-lg">Finalize Your Plan</h3>
              </div>
              <p className="text-gray-600">
                Select and confirm your insurance coverage with our easy process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;