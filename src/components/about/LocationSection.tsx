import React from 'react';

const LocationSection = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl font-bold mb-6">Visit Our Store</h2>
            <p className="text-gray-600 mb-8">
              Experience our products in person at our flagship store. Our expert staff is ready to help you find your perfect pair.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                  <i className="fas fa-map-marker-alt text-black"></i>
                </div>
                <p className="text-gray-600">69/68 Đ. Đặng Thuỳ Trâm, Phường 13, Bình Thạnh, Hồ Chí Minh 70000</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                  <i className="fas fa-phone text-black"></i>
                </div>
                <p className="text-gray-600">+84 (123) 456-789</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg h-[400px]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.956346484443!2d106.70543797486507!3d10.820677189323727!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528ee395e2de7%3A0x8e2eb0e1c21787f!2zNjkvNjggxJDhurduZyBUaHXDuSBUcsOibSwgUGjGsOG7nW5nIDEzLCBCw6xuaCBUaOG6oW5oLCBUaMOgbmggcGjhu5EgSOG7kyBDaMOtIE1pbmggNzAwMDAsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1699376547572!5m2!1svi!2s" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection; 