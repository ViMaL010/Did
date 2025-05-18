import { useState } from 'react';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, ChevronDown, ChevronUp } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [expandedSection, setExpandedSection] = useState(null);

  const handleSubscribe = () => {
    // Handle subscribe logic
    console.log('Subscribing with email:', email);
    setEmail('');
  };

  // Toggle mobile accordion sections
  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  return (
    <footer className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8 border rounded-lg mt-6 sm:mt-8 md:mt-10 py-6 sm:py-8 md:py-10 mb-6 sm:mb-8 md:mb-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left section */}
        <div className="flex flex-col space-y-4 sm:space-y-6">
          <h1 className="text-xl sm:text-2xl font-cursive font-bold">Logo</h1>
          
          <div>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base">Join our newsletter to stay up to date on features and releases.</p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-3 sm:px-4 py-2 border rounded-full flex-grow text-sm sm:text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button 
                onClick={handleSubscribe}
                className="px-4 sm:px-6 py-2 border rounded-full hover:bg-gray-100 text-sm sm:text-base"
              >
                Subscribe
              </button>
            </div>
            
            <p className="text-xs mt-2 text-gray-600">
              By subscribing you agree to with our <a href="#" className="underline">Privacy Policy</a> and provide consent to receive updates from our company.
            </p>
          </div>
        </div>
        
        {/* Middle navigation - Desktop View */}
        <div className="hidden md:grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-3">
            <a href="#" className="hover:underline text-sm sm:text-base">Home</a>
            <a href="#" className="hover:underline text-sm sm:text-base">About us</a>
            <a href="#" className="hover:underline text-sm sm:text-base">See AI in Action</a>
            <a href="#" className="hover:underline text-sm sm:text-base">Plans & Costs</a>
            <a href="#" className="hover:underline text-sm sm:text-base">Log in</a>
          </div>
          
          <div className="flex flex-col space-y-3">
            <a href="#" className="hover:underline text-sm sm:text-base">Health Insurance</a>
            <a href="#" className="hover:underline text-sm sm:text-base">Car Insurance</a>
            <a href="#" className="hover:underline text-sm sm:text-base">Life Insurance</a>
            <a href="#" className="hover:underline text-sm sm:text-base">Pet Insurance</a>
            <a href="#" className="hover:underline text-sm sm:text-base">Home Insurance</a>
          </div>
        </div>
        
        {/* Middle navigation - Mobile Accordion */}
        <div className="md:hidden border-t border-b py-2">
          {/* Navigation Links Accordion */}
          <div className="border-b last:border-b-0">
            <button 
              onClick={() => toggleSection('navigation')}
              className="w-full py-3 flex justify-between items-center"
            >
              <span className="font-medium">Navigation</span>
              {expandedSection === 'navigation' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            
            {expandedSection === 'navigation' && (
              <div className="pb-3 grid grid-cols-1 gap-2">
                <a href="#" className="hover:underline text-sm">Home</a>
                <a href="#" className="hover:underline text-sm">About us</a>
                <a href="#" className="hover:underline text-sm">See AI in Action</a>
                <a href="#" className="hover:underline text-sm">Plans & Costs</a>
                <a href="#" className="hover:underline text-sm">Log in</a>
              </div>
            )}
          </div>
          
          {/* Insurance Types Accordion */}
          <div>
            <button 
              onClick={() => toggleSection('insurance')}
              className="w-full py-3 flex justify-between items-center"
            >
              <span className="font-medium">Insurance Types</span>
              {expandedSection === 'insurance' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            
            {expandedSection === 'insurance' && (
              <div className="pb-3 grid grid-cols-1 gap-2">
                <a href="#" className="hover:underline text-sm">Health Insurance</a>
                <a href="#" className="hover:underline text-sm">Car Insurance</a>
                <a href="#" className="hover:underline text-sm">Life Insurance</a>
                <a href="#" className="hover:underline text-sm">Pet Insurance</a>
                <a href="#" className="hover:underline text-sm">Home Insurance</a>
              </div>
            )}
          </div>
        </div>
        
        {/* Right social links */}
        <div className="flex flex-col space-y-4 sm:space-y-6">
          <p className="font-medium text-sm sm:text-base">Follow Us</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-y-3 gap-x-2">
            <a href="#" className="flex items-center space-x-2 hover:text-gray-600 text-sm sm:text-base">
              <Facebook size={18} />
              <span>Facebook</span>
            </a>
            <a href="#" className="flex items-center space-x-2 hover:text-gray-600 text-sm sm:text-base">
              <Instagram size={18} />
              <span>Instagram</span>
            </a>
            <a href="#" className="flex items-center space-x-2 hover:text-gray-600 text-sm sm:text-base">
              <Twitter size={18} />
              <span>X</span>
            </a>
            <a href="#" className="flex items-center space-x-2 hover:text-gray-600 text-sm sm:text-base">
              <Linkedin size={18} />
              <span>LinkedIn</span>
            </a>
            <a href="#" className="flex items-center space-x-2 hover:text-gray-600 text-sm sm:text-base">
              <Youtube size={18} />
              <span>Youtube</span>
            </a>
          </div>
        </div>
      </div>
      
      {/* Bottom copyright and links */}
      <div className="mt-6 sm:mt-8 pt-4 border-t flex flex-col md:flex-row justify-between items-center text-xs sm:text-sm text-gray-600">
        <div className="text-center md:text-left mb-4 md:mb-0">
          © 2025 Company Name. All rights reserved.
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Cookies Settings</a>
        </div>
      </div>
    </footer>
  );
}