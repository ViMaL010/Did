import { useState } from 'react';
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = () => {
    // Handle subscribe logic
    console.log('Subscribing with email:', email);
    setEmail('');
  };

  return (
    <footer className="max-w-6xl mx-auto p-8 border rounded-lg mt-10 py-10 mb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left section */}
        <div className="flex flex-col space-y-6">
          <h1 className="text-2xl font-cursive font-bold">Logo</h1>
          
          <div>
            <p className="mb-4">Join our newsletter to stay up to date on features and releases.</p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 border rounded-full flex-grow"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button 
                onClick={handleSubscribe}
                className="px-6 py-2 border rounded-full hover:bg-gray-100"
              >
                Subscribe
              </button>
            </div>
            
            <p className="text-xs mt-2 text-gray-600">
              By subscribing you agree to with our <a href="#" className="underline">Privacy Policy</a> and provide consent to receive updates from our company.
            </p>
          </div>
        </div>
        
        {/* Middle navigation */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-3">
            <a href="#" className="hover:underline">Home</a>
            <a href="#" className="hover:underline">About us</a>
            <a href="#" className="hover:underline">See AI in Action</a>
            <a href="#" className="hover:underline">Plans & Costs</a>
            <a href="#" className="hover:underline">Log in</a>
          </div>
          
          <div className="flex flex-col space-y-3">
            <a href="#" className="hover:underline">Health Insurance</a>
            <a href="#" className="hover:underline">Car Insurance</a>
            <a href="#" className="hover:underline">Life Insurance</a>
            <a href="#" className="hover:underline">Pet Insurance</a>
            <a href="#" className="hover:underline">Home Insurance</a>
          </div>
        </div>
        
        {/* Right social links */}
        <div className="flex flex-col space-y-6">
          <p className="font-medium">Follow Us</p>
          
          <div className="flex flex-col space-y-4">
            <a href="#" className="flex items-center space-x-2 hover:text-gray-600">
              <Facebook size={20} />
              <span>Facebook</span>
            </a>
            <a href="#" className="flex items-center space-x-2 hover:text-gray-600">
              <Instagram size={20} />
              <span>Instagram</span>
            </a>
            <a href="#" className="flex items-center space-x-2 hover:text-gray-600">
              <Twitter size={20} />
              <span>X</span>
            </a>
            <a href="#" className="flex items-center space-x-2 hover:text-gray-600">
              <Linkedin size={20} />
              <span>LinkedIn</span>
            </a>
            <a href="#" className="flex items-center space-x-2 hover:text-gray-600">
              <Youtube size={20} />
              <span>Youtube</span>
            </a>
          </div>
        </div>
      </div>
      
      {/* Bottom copyright and links */}
      <div className="mt-8 pt-4 border-t flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
        <div>
          © 2025 Company Name. All rights reserved.
        </div>
        
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Cookies Settings</a>
        </div>
      </div>
    </footer>
  );
}