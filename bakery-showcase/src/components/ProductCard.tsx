'use client';

import { useState, useEffect, useRef } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import type { Product } from '@/lib/constants';

interface ProductCardProps {
  product: Product;
  index: number;
  onOpenModal: (product: Product) => void;
}

export default function ProductCard({ product, index, onOpenModal }: ProductCardProps) {
  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.2,
    freezeOnceVisible: true,
  });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete) {
      setImageLoaded(true);
    }
  }, []);

  const handleClick = () => {
    onOpenModal(product);
  };

  const startingPrice = product.priceOptions.length > 0 
    ? Math.min(...product.priceOptions.map(o => o.price))
    : 0;

  const placeholderImage = `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
      <rect fill="#F5EFE5" width="400" height="300"/>
      <text fill="#8B5A2B" font-family="Georgia, serif" font-size="24" x="50%" y="50%" text-anchor="middle" dy=".3em">${product.name}</text>
    </svg>
  `)}`;

  return (
    <div
      ref={ref}
      className={`group relative transition-all duration-700 cursor-pointer ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-10'
      }`}
      style={{
        transitionDelay: `${index * 150}ms`,
      }}
      onClick={handleClick}
    >
      <div className="bg-cream dark:bg-chocolate-700 rounded-3xl overflow-hidden shadow-soft card-hover card-glow">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {/* Skeleton loader */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 skeleton rounded-t-3xl" />
          )}

          {/* Product Image */}
          <img
            ref={imgRef}
            src={imageError ? placeholderImage : product.image}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-700 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } group-hover:scale-110`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
          />

          {/* Price Badge */}
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1.5 bg-gold text-chocolate-900 text-sm font-bold rounded-full shadow-lg">
              From Rs. {startingPrice.toLocaleString()}
            </span>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-chocolate/60 to-transparent transition-opacity duration-500 opacity-0 group-hover:opacity-100">
            <div className="absolute bottom-4 left-4 right-4">
              <button
                className="btn-gold w-full text-center"
              >
                View Options
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="heading-sm text-chocolate dark:text-cream-100 mb-2 group-hover:text-gold transition-colors duration-300">
            {product.name}
          </h3>
          <p className="body-md text-chocolate-500 dark:text-cream-300 mb-4 line-clamp-2">
            {product.description}
          </p>
          
          {/* CTA Button */}
          <button
            className="btn-primary w-full text-center"
          >
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
}
