import React from 'react';

const ServiceSection = () => {
  const services = [
    {
      icon: 'fa-truck',
      title: 'Free Shipping',
      description: 'Free shipping on all orders over $100'
    },
    {
      icon: 'fa-undo',
      title: 'Easy Returns',
      description: '30-day return policy for all items'
    },
    {
      icon: 'fa-shield-alt',
      title: 'Secure Payment',
      description: '100% secure payment processing'
    },
    {
      icon: 'fa-headset',
      title: '24/7 Support',
      description: 'Dedicated support team available 24/7'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mb-4">
                <i className={`fas ${service.icon} text-2xl`}></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSection; 