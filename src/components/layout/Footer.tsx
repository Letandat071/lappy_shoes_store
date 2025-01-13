import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold gradient-text">SneakerVault</h2>
            <p className="text-gray-400 leading-relaxed">
              Your premium destination for authentic sneakers. Quality, style, and comfort in every step.
            </p>
            <div className="flex space-x-4">
              {['facebook-f', 'twitter', 'instagram', 'youtube'].map((social) => (
                <a 
                  key={social}
                  href="#" 
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all"
                >
                  <i className={`fab fa-${social}`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-yellow-400"></span>
            </h3>
            <ul className="space-y-4">
              {[
                { text: 'About Us', href: '/about' },
                { text: 'FAQs', href: '/help' },
                { text: 'Privacy Policy', href: '/privacy' },
                { text: 'Terms & Conditions', href: '/terms' }
              ].map((link) => (
                <li key={link.text}>
                  <Link href={link.href} className="text-gray-400 hover:text-yellow-400 transition-colors flex items-center gap-2">
                    <i className="fas fa-chevron-right text-xs"></i>
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6 relative inline-block">
              Contact Us
              <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-yellow-400"></span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <span className="text-gray-400">123 Sneaker Street, Fashion District, NY 10001</span>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-phone"></i>
                </div>
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-envelope"></i>
                </div>
                <span className="text-gray-400">support@sneakervault.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div>
            <h3 className="text-xl font-bold mb-6 relative inline-block">
              Newsletter
              <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-yellow-400"></span>
            </h3>
            <p className="text-gray-400 text-sm mb-4">Stay updated with our latest releases and exclusive offers!</p>
            <form className="space-y-3">
              <input 
                type="email" 
                placeholder="your@email.com" 
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
              <button 
                type="submit"
                className="w-full px-6 py-3 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-300 transition-all"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <p className="text-gray-400 text-center md:text-left">
                © 2024 Lappy Shoes. All rights reserved.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">|</span>
                <span className="text-gray-400">Developed by</span>
                <div className="flex items-center gap-2">
                  <div className="relative w-6 h-6 rounded-full overflow-hidden">
                    <Image
                      src="https://i.pinimg.com/736x/ed/fc/2f/edfc2f43906239efe89ce407415a1856.jpg"
                      alt="Developer"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <a 
                    href="https://lappyhacking.onrender.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow-400 hover:text-yellow-300 transition-colors cursor-pointer"
                  >
                    Nguyên Kỷ
                  </a>
                </div>
              </div>
            </div>
            <div className="flex justify-center md:justify-end space-x-6">
              <i className="fab fa-cc-visa text-gray-400 text-2xl hover:text-white transition-colors"></i>
              <i className="fab fa-cc-mastercard text-gray-400 text-2xl hover:text-white transition-colors"></i>
              <i className="fab fa-cc-paypal text-gray-400 text-2xl hover:text-white transition-colors"></i>
              <i className="fab fa-cc-amex text-gray-400 text-2xl hover:text-white transition-colors"></i>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 