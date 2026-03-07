'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from './ReducedMotionProvider';
import { useProductModal } from './ProductModalContext';
import { HERO_ANIMATION, PRODUCTS } from '@/lib/constants';
import { trackProductClick } from '@/lib/shopify';

export default function HeroSection() {
  const { reducedMotion } = useReducedMotion();
  const { openModal } = useProductModal();
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [scrollLocked, setScrollLocked] = useState(true);
  
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameRef = useRef(0);
  const animationCompleteRef = useRef(false);

  // Preload all images
  useEffect(() => {
    let loadedCount = 0;
    const totalFrames = HERO_ANIMATION.totalFrames;
    const images: HTMLImageElement[] = [];

    const loadImage = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        const frameNum = String(index + 1).padStart(3, '0');
        img.src = `/assets/animations/ezgif-frame-${frameNum}.jpg`;
        
        img.onload = () => {
          images[index] = img;
          loadedCount++;
          setLoadProgress(Math.round((loadedCount / totalFrames) * 100));
          
          // Once first 10 images loaded, show the animation
          if (loadedCount >= 10 && !isLoaded) {
            setIsLoaded(true);
          }
          resolve();
        };

        img.onerror = () => {
          loadedCount++;
          setLoadProgress(Math.round((loadedCount / totalFrames) * 100));
          resolve();
        };
      });
    };

    // Load all images
    Promise.all(
      Array.from({ length: totalFrames }, (_, i) => loadImage(i))
    ).then(() => {
      imagesRef.current = images;
    });

    imagesRef.current = images;
  }, [isLoaded]);

  // Draw frame to canvas
  const drawFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const images = imagesRef.current;
    
    if (!canvas || !ctx || images.length === 0) return;

    const img = images[frameIndex];
    if (!img || !img.complete) return;

    const rect = canvas.getBoundingClientRect();
    
    // Set canvas size for retina displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);
    
    // Calculate dimensions with different zoom for mobile vs desktop
    const canvasRatio = rect.width / rect.height;
    const imgRatio = img.width / img.height;
    
    // Mobile gets zoomed out (shows more content), desktop stays normal
    const isMobile = window.innerWidth < 768;
    const zoomOutFactor = isMobile ? 0.85 : 1.0; // 85% on mobile, 100% on desktop
    
    let drawWidth, drawHeight, offsetX, offsetY;
    
    if (canvasRatio > imgRatio) {
      // Canvas is wider than image ratio - fit to width
      drawWidth = rect.width * zoomOutFactor;
      drawHeight = (rect.width * zoomOutFactor) / imgRatio;
      offsetX = (rect.width - drawWidth) / 2;
      offsetY = (rect.height - drawHeight) / 2;
    } else {
      // Canvas is taller than image ratio - fit to height
      drawWidth = (rect.height * zoomOutFactor) * imgRatio;
      drawHeight = rect.height * zoomOutFactor;
      offsetX = (rect.width - drawWidth) / 2;
      offsetY = (rect.height - drawHeight) / 2;
    }
    
    // Draw image centered
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  // Scroll animation control
  useEffect(() => {
    if (reducedMotion || !isLoaded) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          
          // Calculate progress based on scroll position
          // Each frame needs approximately 25-30px of scroll for smooth playback
          const pixelsPerFrame = 28; // Adjusted for 285 frames
          const totalScrollNeeded = HERO_ANIMATION.totalFrames * pixelsPerFrame;
          
          // Calculate current frame based on scroll
          const frame = Math.min(
            Math.floor(scrollY / pixelsPerFrame),
            HERO_ANIMATION.totalFrames - 1
          );
          
          // Update frame if changed
          if (frame !== frameRef.current) {
            frameRef.current = frame;
            setCurrentFrame(frame);
            drawFrame(frame);
          }
          
          // Check if animation is complete
          if (frame >= HERO_ANIMATION.totalFrames - 1 && !animationCompleteRef.current) {
            animationCompleteRef.current = true;
            setScrollLocked(false);
          } else if (frame < HERO_ANIMATION.totalFrames - 1 && animationCompleteRef.current) {
            animationCompleteRef.current = false;
            setScrollLocked(true);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    // Prevent scrolling past hero until animation complete
    const preventScroll = (e: WheelEvent) => {
      if (scrollLocked && window.scrollY < HERO_ANIMATION.totalFrames * 28) {
        const maxScroll = (HERO_ANIMATION.totalFrames - 1) * 28;
        if (window.scrollY >= maxScroll) {
          // Allow scroll only if animation is complete
          if (!animationCompleteRef.current) {
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', preventScroll, { passive: false });
    
    // Initial draw
    drawFrame(0);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', preventScroll);
    };
  }, [reducedMotion, isLoaded, scrollLocked]);

  // Handle resize
  useEffect(() => {
    if (!isLoaded) return;
    
    const handleResize = () => {
      drawFrame(frameRef.current);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isLoaded]);

  const handleOrderClick = (productId: string) => {
    trackProductClick(productId);
    const product = PRODUCTS.find(p => p.id === productId);
    if (product) {
      openModal(product);
    }
  };

  return (
    <div 
      ref={sectionRef}
      id="hero"
      className="relative"
      style={{ 
        height: reducedMotion 
          ? '100vh' // Normal viewport height when animation disabled
          : `${HERO_ANIMATION.totalFrames * 28}px`, // Full animation height when enabled
        minHeight: '100vh'
      }}
    >
      {/* Sticky container */}
      <div className="sticky top-0 left-0 right-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background Canvas */}
        <div className="absolute inset-0 z-0">
          {/* Loading state */}
          {!isLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-beige dark:bg-chocolate-900 z-10">
              <div className="w-48 h-1 bg-chocolate/20 dark:bg-cream/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold transition-all duration-300"
                  style={{ width: `${loadProgress}%` }}
                />
              </div>
              <p className="mt-4 text-chocolate-500 dark:text-cream-300 text-sm font-medium">
                Loading... {loadProgress}%
              </p>
            </div>
          )}

          {/* Canvas for smooth rendering */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ 
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 0.5s ease-out',
              objectFit: 'cover'
            }}
          />
          
          {/* Fallback image for reduced motion */}
          {reducedMotion && isLoaded && (
            <img
              src="/assets/animations/ezgif-frame-001.jpg"
              alt="Nabia's Eatry"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* Stronger overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30 dark:from-chocolate-900/30 dark:via-transparent dark:to-chocolate-900/40 pointer-events-none" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center pointer-events-none px-4">
          {/* Main Headline with background for better visibility */}
          <div className={`space-y-8 ${reducedMotion ? '' : 'animate-fade-up'}`}>
            <div className="relative inline-block px-8 py-6 rounded-3xl bg-cream/40 dark:bg-chocolate-900/40 backdrop-blur-sm">
              <h1 className="heading-xl text-chocolate-900 dark:text-cream-100" style={{ 
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3), 0 4px 20px rgba(0, 0, 0, 0.2)'
              }}>
                <span className="block">Freshly Baked.</span>
                <span className="block" style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F3CF75 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: 'none'
                }}>Perfectly Crafted.</span>
              </h1>
            </div>
          </div>

          {/* Scroll indicator - positioned below heading (only show when animations enabled) */}
          {!reducedMotion && currentFrame < 5 && (
            <div className="mt-16 animate-float">
              <div className="flex flex-col items-center gap-2 px-6 py-3 rounded-2xl bg-chocolate-900/60 dark:bg-chocolate-900/60 backdrop-blur-sm">
                <span className="text-xs font-semibold uppercase tracking-widest whitespace-nowrap text-cream-100" style={{
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
                }}>Scroll to watch the magic</span>
                <svg
                  className="w-6 h-6 text-cream-100"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
            </div>
          )}

          {/* CTA Buttons - moved to bottom */}
          <div className="absolute left-0 right-0 bottom-16 md:bottom-20 px-4">
            <div className={`flex flex-wrap justify-center gap-3 md:gap-4 pointer-events-auto ${
              reducedMotion ? '' : 'animate-fade-up delay-400'
            }`}>
              <button
                onClick={() => handleOrderClick('cupcake')}
                className="btn-primary"
              >
                Order Cupcakes
              </button>
              <button
                onClick={() => handleOrderClick('brownie')}
                className="btn-secondary"
              >
                Order Brownies
              </button>
              <button
                onClick={() => handleOrderClick('pizza')}
                className="btn-gold"
              >
                Order Pizza
              </button>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-chocolate/10 dark:bg-cream/10 z-20">
          <div
            className="h-full bg-gold"
            style={{ 
              width: `${((currentFrame + 1) / HERO_ANIMATION.totalFrames) * 100}%`,
              transition: 'width 0.1s ease-out'
            }}
          />
        </div>
      </div>
    </div>
  );
}
