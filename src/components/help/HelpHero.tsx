import React from 'react';

const HelpHero = () => {
  return (
    <section className="bg-gradient-to-r from-gray-900 to-black text-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6">How Can We Help?</h1>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search for help articles..." 
                className="w-full px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <i className="fas fa-search text-gray-400"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HelpHero; 