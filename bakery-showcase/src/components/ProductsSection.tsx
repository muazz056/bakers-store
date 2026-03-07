'use client';

import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import { useProductModal } from './ProductModalContext';
import { PRODUCTS } from '@/lib/constants';

export default function ProductsSection() {
  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    freezeOnceVisible: true,
  });

  const { selectedProduct, isModalOpen, openModal, closeModal } = useProductModal();

  return (
    <>
      <section
        id="products"
        className="section bg-cream dark:bg-chocolate-900"
      >
        <div className="container-custom">
          {/* Section Header */}
          <div
            ref={ref}
            className={`text-center mb-16 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <span className="inline-block text-gold font-medium uppercase tracking-wider text-sm mb-4">
              Our Creations
            </span>
            <h2 className="heading-lg text-chocolate-800 dark:text-cream-100 mb-4">
              Featured Products
            </h2>
            <div className="line-decoration mx-auto mb-6" />
            <p className="body-lg max-w-2xl mx-auto">
              Each creation is a masterpiece of flavor and craftsmanship, 
              made with the finest ingredients and baked to perfection.
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCTS.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                index={index}
                onOpenModal={openModal}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
}
