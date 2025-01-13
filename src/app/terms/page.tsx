import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
const TermsAndConditions = () => {
  return (
    <main>
    <Navbar />
    <div className="max-w-4xl mx-auto px-4 py-12">
        
      <h1 className="text-3xl font-bold mb-8">Terms & Conditions</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
          <p className="text-gray-600 leading-relaxed">
            By accessing and using SneakerVault, you agree to be bound by these Terms and Conditions. 
            If you disagree with any part of these terms, you may not access our website or use our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Products and Orders</h2>
          <p className="text-gray-600 leading-relaxed">
            All products are subject to availability. We reserve the right to discontinue any product 
            at any time. Prices are subject to change without notice. We strive to display accurate 
            product information, but we do not warrant that product descriptions or prices are accurate, 
            complete, or current.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Shipping and Delivery</h2>
          <p className="text-gray-600 leading-relaxed">
            Shipping times are estimates only. We are not responsible for any delays caused by shipping 
            carriers or customs. Risk of loss and title for items purchased pass to you upon delivery 
            of the items to the carrier.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Returns and Refunds</h2>
          <p className="text-gray-600 leading-relaxed">
            We accept returns within 30 days of delivery for unworn items in original condition with tags attached. 
            Refunds will be issued to the original form of payment. Shipping costs are non-refundable.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Account Responsibilities</h2>
          <p className="text-gray-600 leading-relaxed">
            You are responsible for maintaining the confidentiality of your account and password. 
            You agree to accept responsibility for all activities that occur under your account.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
          <p className="text-gray-600 leading-relaxed">
            All content on this website, including text, graphics, logos, images, and software, 
            is the property of SneakerVault and is protected by copyright and other intellectual 
            property laws.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
          <p className="text-gray-600 leading-relaxed">
            SneakerVault shall not be liable for any indirect, incidental, special, consequential, 
            or punitive damages resulting from your use of or inability to use our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
          <p className="text-gray-600 leading-relaxed">
            For any questions regarding these Terms & Conditions, please contact us at support@sneakervault.com
          </p>
        </section>
      </div>
    </div>
    <Footer />
    </main>
  );
};

export default TermsAndConditions; 