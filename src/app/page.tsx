"use client";

import React, { Suspense } from 'react';
import { 
  DynamicHeroSection,
  DynamicCollectionSection,
  DynamicCategorySection 
} from '@/utils/lazyImports';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import ServiceSection from "@/components/home/ServiceSection";
import CollectionSection from "@/components/home/CollectionSection";
import BestSellersSection from "@/components/home/BestSellersSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import TrendingStylesSection from "@/components/home/TrendingStylesSection";
import SizesSection from "@/components/home/SizesSection";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Suspense fallback={<div className="h-[600px] animate-pulse bg-gray-200 rounded-lg" />}>
        <DynamicHeroSection />
      </Suspense>

      <Suspense fallback={<div className="h-[400px] animate-pulse bg-gray-200 rounded-lg" />}>
        <DynamicCollectionSection />
      </Suspense>

      <Suspense fallback={<div className="h-[300px] animate-pulse bg-gray-200 rounded-lg" />}>
        <DynamicCategorySection />
      </Suspense>

      <ServiceSection />
      <BestSellersSection />
      <TestimonialSection />
      <TrendingStylesSection />
      <SizesSection />
      <Footer />
    </main>
  );
}
