import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
const PrivacyPolicy = () => {
    
  return (
    <main>
        <Navbar />
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p className="text-gray-600 leading-relaxed">
            We collect information that you provide directly to us, including when you create an account, 
            make a purchase, sign up for our newsletter, or contact us for support. This may include your name, 
            email address, shipping address, payment information, and phone number.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <p className="text-gray-600 leading-relaxed">
            We use the information we collect to:
          </p>
          <ul className="list-disc list-inside mt-2 text-gray-600 space-y-2">
            <li>Process your orders and payments</li>
            <li>Send you order confirmations and updates</li>
            <li>Respond to your questions and concerns</li>
            <li>Send marketing communications (with your consent)</li>
            <li>Improve our website and services</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
          <p className="text-gray-600 leading-relaxed">
            We do not sell or rent your personal information to third parties. We may share your 
            information with service providers who assist us in operating our website, conducting our 
            business, or serving our users.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Security</h2>
          <p className="text-gray-600 leading-relaxed">
            We implement appropriate security measures to protect your personal information. However, 
            no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
          <p className="text-gray-600 leading-relaxed">
            You have the right to:
          </p>
          <ul className="list-disc list-inside mt-2 text-gray-600 space-y-2">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Opt-out of marketing communications</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
          <p className="text-gray-600 leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at support@sneakervault.com
          </p>
        </section>
      </div>
    </div>
    <Footer />
    </main>
  );
};

export default PrivacyPolicy; 