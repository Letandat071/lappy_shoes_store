"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface HeroBanner {
  image: string;
  event: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  highlightedWords: Array<{ text: string; color: string }>;
  stats: Array<{ value: string; label: string }>;
  features: Array<{
    icon: string;
    title: string;
    description: string;
    iconBgColor: string;
  }>;
  styles: {
    backgroundColor: {
      from: string;
      via: string;
      to: string;
    };
    eventBadge: {
      textColor: string;
      backgroundColor: string;
    };
    title: {
      glowColor: string;
      gradientColors: {
        from: string;
        via: string;
        to: string;
      }
    };
    description: {
      textColor: string;
    };
    buttons: {
      primary: {
        textColor: string;
        backgroundColor: string;
        hoverBackgroundColor: string;
      };
      secondary: {
        textColor: string;
        borderColor: string;
        hoverBackgroundColor: string;
        hoverTextColor: string;
      }
    };
    stats: {
      valueColor: string;
      labelColor: string;
    };
    glowEffects: {
      topLeft: {
        color: string;
        opacity: number;
        blur: number;
      };
      bottomRight: {
        color: string;
        opacity: number;
        blur: number;
      }
    }
  };
  overlayOpacity: number;
  particlesEnabled: boolean;
}

interface Props {
  banner?: HeroBanner;
}

const DEFAULT_BANNER = {
  image: '',
  event: '',
  titleLine1: '',
  titleLine2: '',
  description: '',
  highlightedWords: [],
  stats: [],
  features: [],
  styles: {
    backgroundColor: {
      from: '#111827',
      via: '#000000',
      to: '#111827'
    },
    eventBadge: {
      textColor: '#FCD34D',
      backgroundColor: 'rgba(251, 191, 36, 0.1)'
    },
    title: {
      glowColor: '#FCD34D',
      gradientColors: {
        from: '#FCD34D',
        via: '#EF4444',
        to: '#9333EA'
      }
    },
    description: {
      textColor: '#D1D5DB'
    },
    buttons: {
      primary: {
        textColor: '#000000',
        backgroundColor: '#FFFFFF',
        hoverBackgroundColor: '#FCD34D'
      },
      secondary: {
        textColor: '#FFFFFF',
        borderColor: '#FFFFFF',
        hoverBackgroundColor: '#FFFFFF',
        hoverTextColor: '#000000'
      }
    },
    stats: {
      valueColor: '#FFFFFF',
      labelColor: '#9CA3AF'
    },
    glowEffects: {
      topLeft: {
        color: '#FCD34D',
        opacity: 0.5,
        blur: 100
      },
      bottomRight: {
        color: '#9333EA',
        opacity: 0.5,
        blur: 100
      }
    }
  },
  overlayOpacity: 0.2,
  particlesEnabled: true
};

const HeroSection = ({ banner }: Props) => {
  const [localBanner, setLocalBanner] = useState<HeroBanner | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setLocalBanner(banner || DEFAULT_BANNER);
  }, [banner]);

  useEffect(() => {
    if (!banner && isClient) {
      const fetchBanner = async () => {
        try {
          const res = await fetch('/api/admin/banner');
          if (!res.ok) throw new Error('Failed to fetch banner');
          const data = await res.json();
          setLocalBanner({
            ...DEFAULT_BANNER,
            ...data,
            styles: {
              ...DEFAULT_BANNER.styles,
              ...(data.styles || {})
            }
          });
        } catch (error) {
          console.error('Error fetching banner:', error);
          setLocalBanner(DEFAULT_BANNER);
        }
      };

      fetchBanner();
    }
  }, [banner, isClient]);

  if (!localBanner) {
    return (
      <div className="relative min-h-[800px] flex items-center justify-center overflow-hidden bg-gray-900">
        <div className="animate-pulse w-full h-full"></div>
      </div>
    );
  }

  const { backgroundColor } = localBanner.styles;

  return (
    <div 
      className="relative min-h-[800px] flex items-center overflow-hidden pt-32"
      style={{
        background: `linear-gradient(to right, ${backgroundColor.from}, ${backgroundColor.via}, ${backgroundColor.to})`
      }}
    >
      {/* Background effects */}
      <div className="absolute inset-0" style={{ opacity: localBanner.overlayOpacity }}>
        <div className="absolute inset-0 bg-repeat bg-center hero-pattern"></div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/40"></div>
      {isClient && localBanner.particlesEnabled && (
        <div className="absolute inset-0" id="particles-js"></div>
      )}

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-hide">
            <div className="space-y-4">
              <span 
                className="inline-block text-lg font-medium px-4 py-2 rounded-full"
                style={{
                  color: localBanner.styles.eventBadge.textColor,
                  backgroundColor: localBanner.styles.eventBadge.backgroundColor
                }}
              >
                {localBanner.event}
              </span>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span 
                  className="block text-glow mb-2"
                  style={{
                    textShadow: `0 0 10px ${localBanner.styles.title.glowColor}`
                  }}
                >
                  {localBanner.titleLine1}
                </span>
                <span 
                  className="text-transparent bg-clip-text animate-gradient"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${localBanner.styles.title.gradientColors.from}, ${localBanner.styles.title.gradientColors.via}, ${localBanner.styles.title.gradientColors.to})`
                  }}
                >
                  {localBanner.titleLine2}
                </span>
              </h1>
              <div className="max-h-[120px] overflow-y-auto scrollbar-hide">
                <p 
                  className="text-base md:text-xl leading-relaxed"
                  style={{ color: localBanner.styles.description.textColor }}
                >
                  {localBanner.description}
                  {localBanner.highlightedWords.map((word, index) => (
                    <span key={index} style={{ color: word.color }}> {word.text}</span>
                  ))}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link 
                href="/shop"
                className="group relative hero-shine px-6 md:px-8 py-3 md:py-4 rounded-full font-bold transition-all transform hover:scale-105 hover:shadow-xl text-sm md:text-base"
                style={{
                  color: localBanner.styles.buttons.primary.textColor,
                  backgroundColor: localBanner.styles.buttons.primary.backgroundColor,
                  '--hover-bg': localBanner.styles.buttons.primary.hoverBackgroundColor
                } as React.CSSProperties}
              >
                Shop Collection
                <span className="absolute -right-2 -top-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  New
                </span>
              </Link>
              <button 
                className="relative overflow-hidden px-6 md:px-8 py-3 md:py-4 rounded-full font-bold transition-all transform hover:scale-105 border-2 text-sm md:text-base"
                style={{
                  color: localBanner.styles.buttons.secondary.textColor,
                  borderColor: localBanner.styles.buttons.secondary.borderColor,
                  '--hover-bg': localBanner.styles.buttons.secondary.hoverBackgroundColor,
                  '--hover-text': localBanner.styles.buttons.secondary.hoverTextColor
                } as React.CSSProperties}
              >
                <span className="relative z-10">Watch Video</span>
                <i className="fas fa-play ml-2"></i>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 md:gap-8">
              {localBanner.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <h4 
                    className="text-2xl md:text-4xl font-bold text-glow"
                    style={{ color: localBanner.styles.stats.valueColor }}
                  >
                    {stat.value}
                  </h4>
                  <p 
                    className="text-sm md:text-base text-gray-400"
                    style={{ color: localBanner.styles.stats.labelColor }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content */}
          <div className="relative hidden lg:block">
            {/* Glowing effects */}
            <div 
              className="absolute -top-20 -left-20 w-40 h-40 rounded-full filter blur-[100px] opacity-50 floating"
              style={{
                backgroundColor: localBanner.styles.glowEffects.topLeft.color,
                opacity: localBanner.styles.glowEffects.topLeft.opacity,
                filter: `blur(${localBanner.styles.glowEffects.topLeft.blur}px)`
              }}
            />
            <div 
              className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full filter blur-[100px] opacity-50 floating-delay"
              style={{
                backgroundColor: localBanner.styles.glowEffects.bottomRight.color,
                opacity: localBanner.styles.glowEffects.bottomRight.opacity,
                filter: `blur(${localBanner.styles.glowEffects.bottomRight.blur}px)`
              }}
            />
            
            {/* Main product image */}
            <div className="relative">
              {localBanner.image && (
                <Image 
                  id="mainProductImage" 
                  src={localBanner.image}
                  alt="Featured Shoe" 
                  className="w-full max-w-2xl mx-auto transform transition-all duration-700 floating"
                  width={500}
                  height={500}
                  style={{ objectFit: 'contain' }}
                  priority
                />
              )}
              
              {/* Product Features */}
              <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 space-y-4">
                {localBanner.features.map((feature, index) => (
                  <div key={index} className="product-feature bg-white/10 backdrop-blur-md rounded-xl p-4 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: feature.iconBgColor }}>
                        <i className={`fas ${feature.icon} text-black`}></i>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{feature.title}</h4>
                        <p className="text-gray-300 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection; 