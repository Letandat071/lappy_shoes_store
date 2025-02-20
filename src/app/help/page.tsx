import React from 'react';
import Link from 'next/link';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import HelpHero from '../../components/help/HelpHero';
import QuickLinks from '../../components/help/QuickLinks';
import FAQSection from '../../components/help/FAQSection';
import ContactSection from '../../components/help/ContactSection';

const HelpPage = () => {
  return (
    <>
      <Navbar />
      <main>
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 mb-8 pt-20">
          <nav className="flex text-gray-500 text-sm">
            <Link href="/" className="hover:text-black">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-black">Help</span>
          </nav>
        </div>

        {/* Main Content */}
        <HelpHero />
        <QuickLinks />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
};

export default HelpPage; 