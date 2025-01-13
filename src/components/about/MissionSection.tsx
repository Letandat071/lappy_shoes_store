import React from 'react';

const MissionSection = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              At SneakerVault, we're committed to providing authentic, high-quality footwear while delivering an exceptional shopping experience. We believe everyone deserves to step out in style and comfort.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-check text-black text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Authenticity Guaranteed</h3>
                  <p className="text-gray-600">Every product in our inventory is verified for authenticity</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-heart text-black text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Customer First</h3>
                  <p className="text-gray-600">Your satisfaction is our top priority</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519" 
              alt="Our Store" 
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg">
              <p className="font-bold text-3xl text-black">5000+</p>
              <p className="text-gray-600">Happy Customers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection; 