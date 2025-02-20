import React from 'react';
import Link from 'next/link';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import AboutHero from '../../components/about/AboutHero';
import MissionSection from '../../components/about/MissionSection';
import TeamSection from '../../components/about/TeamSection';
import LocationSection from '../../components/about/LocationSection';

const AboutPage = () => {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <nav className="flex text-gray-500 text-sm">
            <Link href="/" className="hover:text-black">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-black">About Us</span>
          </nav>
        </div>

        {/* Main Content */}
        <AboutHero />
        <MissionSection />
        <TeamSection />
        <LocationSection />
      </main>
      <Footer />
    </>
  );
};

export default AboutPage; 