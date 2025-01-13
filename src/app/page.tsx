'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/home/CategorySection';
import ServiceSection from '@/components/home/ServiceSection';
import CollectionSection from '@/components/home/CollectionSection';
import BestSellersSection from '@/components/home/BestSellersSection';
import TestimonialSection from '@/components/home/TestimonialSection';
import TrendingStylesSection from '@/components/home/TrendingStylesSection';
import SizesSection from '@/components/home/SizesSection';

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <ServiceSection />
      <BestSellersSection />
      <CollectionSection />
      <CategorySection />
      <TestimonialSection />
      <TrendingStylesSection />
      <SizesSection />
      <Footer />
    </main>
  );
}
