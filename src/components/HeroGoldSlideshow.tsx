'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Pause, Play, ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  id: string;
  src: string;
  alt: string;
  caption: string;
  subcaption: string;
}

const SLIDES: Slide[] = [
  {
    id: 'bullion',
    src: '/images/hero/bullion-macro.jpg',
    alt: 'Allocated 999.9 pure gold bullion bars with pristine metallic luster',
    caption: '100% Segregated Physical Bullion',
    subcaption: 'Hallmarked 24K and 22K investment-grade bars',
  },
  {
    id: 'texture',
    src: '/images/hero/texture-cinematic.jpg',
    alt: 'Abstract fluid metallic gold texture with obsidian midnight contrast',
    caption: 'Real-Time Market Synchronized',
    subcaption: 'Official BAJUS daily circular price tracking',
  },
  {
    id: 'vault',
    src: '/images/hero/vault-cinematic.jpg',
    alt: 'Sovereign gold bullion safely allocated inside Class-III secure vault facilities',
    caption: 'Bank-Grade Institutional Custody',
    subcaption: 'Cryptographically sealed double-entry ledger verification',
  },
];

interface HeroGoldSlideshowProps {
  intervalMs?: number;
  className?: string;
  children?: React.ReactNode;
}

export default function HeroGoldSlideshow({
  intervalMs = 6000,
  className = '',
  children,
}: HeroGoldSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check user preference for reduced motion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  // Automatic slideshow timer
  useEffect(() => {
    if (!isPlaying || prefersReducedMotion) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(nextSlide, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, intervalMs, nextSlide, prefersReducedMotion]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      setIsPlaying((prev) => !prev);
    }
  };

  return (
    <div
      className={`relative w-full overflow-hidden bg-aurum-midnight text-aurum-text select-none ${className}`}
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
      onFocus={() => setIsPlaying(false)}
      onBlur={() => setIsPlaying(true)}
      tabIndex={0}
      role="region"
      aria-label="Cinematic Gold Showcase"
      aria-roledescription="carousel"
      onKeyDown={handleKeyDown}
    >
      {/* Background Slides */}
      <div className="absolute inset-0 z-0">
        {SLIDES.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
              aria-hidden={!isActive}
            >
              <div
                className={`relative w-full h-full transform transition-transform duration-[7000ms] ease-out ${
                  isActive && !prefersReducedMotion ? 'scale-105' : 'scale-100'
                }`}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover object-center filter brightness-[0.68] contrast-[1.08] saturate-[1.12]"
                />
              </div>

              {/* Multi-layered cinematic gold gradients & vignettes */}
              <div className="absolute inset-0 bg-gradient-to-t from-aurum-midnight via-aurum-midnight/60 to-aurum-midnight/40" />
              <div className="absolute inset-0 bg-gradient-to-r from-aurum-midnight via-transparent to-aurum-midnight/80" />
            </div>
          );
        })}
      </div>

      {/* Subtle Warm Gold Horizon Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[340px] bg-aurum-gold/15 rounded-full blur-[140px] pointer-events-none z-10" />

      {/* Hero Foreground Content */}
      <div className="relative z-20 w-full">{children}</div>

      {/* Accessible Slideshow Control Bar */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 pt-2">
        <div className="flex items-center justify-between border-t border-aurum-border/40 pt-4">
          {/* Active slide badge caption */}
          <div className="hidden sm:flex items-center space-x-2 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-aurum-gold animate-pulse" />
            <span className="font-serif-luxury font-bold text-aurum-gold tracking-wide">
              {SLIDES[currentIndex].caption}
            </span>
            <span className="text-aurum-text-dim">•</span>
            <span className="text-aurum-text-muted">{SLIDES[currentIndex].subcaption}</span>
          </div>

          {/* Interactive Slide Switchers & Pause Button */}
          <div className="flex items-center space-x-3 ml-auto sm:ml-0">
            {/* Progress indicators */}
            <div className="flex items-center space-x-1.5 mr-2" role="tablist" aria-label="Slide Selection">
              {SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-aurum-gold ${
                    idx === currentIndex
                      ? 'w-7 bg-aurum-gold shadow-gold-glow'
                      : 'w-2 bg-aurum-border hover:bg-aurum-text-muted'
                  }`}
                  aria-label={`Go to slide ${idx + 1}: ${slide.caption}`}
                  aria-selected={idx === currentIndex}
                  role="tab"
                />
              ))}
            </div>

            {/* Prev Button */}
            <button
              onClick={prevSlide}
              className="p-1.5 rounded-lg bg-aurum-card/60 hover:bg-aurum-card border border-aurum-border hover:border-aurum-gold/50 text-aurum-text transition-colors focus:outline-none focus:ring-1 focus:ring-aurum-gold"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="p-1.5 rounded-lg bg-aurum-card/60 hover:bg-aurum-card border border-aurum-border hover:border-aurum-gold/50 text-aurum-text transition-colors focus:outline-none focus:ring-1 focus:ring-aurum-gold"
              aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-aurum-gold" /> : <Play className="w-3.5 h-3.5 text-aurum-gold" />}
            </button>

            {/* Next Button */}
            <button
              onClick={nextSlide}
              className="p-1.5 rounded-lg bg-aurum-card/60 hover:bg-aurum-card border border-aurum-border hover:border-aurum-gold/50 text-aurum-text transition-colors focus:outline-none focus:ring-1 focus:ring-aurum-gold"
              aria-label="Next slide"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
