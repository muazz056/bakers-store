'use client';

import { useState, useEffect } from 'react';
import type { Product, PriceOption } from '@/lib/constants';
import { WHATSAPP_BASE_URL } from '@/lib/constants';
import { trackProductClick } from '@/lib/shopify';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [selectedOption, setSelectedOption] = useState<PriceOption | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<PriceOption[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [showTimeInfo, setShowTimeInfo] = useState(false);

  const EXPECTED_TIME_LABEL = 'Discuss on WhatsApp through chat';

  const isBrownie = product?.id === 'brownie';

  useEffect(() => {
    if (product && product.priceOptions.length > 0) {
      const baseOptions = isBrownie
        ? product.priceOptions.filter((option) => !option.id.startsWith('addon-'))
        : product.priceOptions;

      setSelectedOption(baseOptions[0] ?? null);
    }
    setSelectedAddons([]);
    setQuantity(1);
    setAddress('');
    setNotes('');
    setCustomerName('');
    setPhone('');
    setShowValidationErrors(false);
    setPreferredTime(EXPECTED_TIME_LABEL);
  }, [product]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const addonsTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
  const basePrice = selectedOption ? selectedOption.price : 0;
  const totalPrice = (basePrice + addonsTotal) * quantity;

  const generateWhatsAppUrl = () => {
    const addonsLabel =
      isBrownie && selectedAddons.length > 0
        ? selectedAddons
            .map((addon) => addon.label.replace(/^Add On:\s*/i, ''))
            .join(', ')
        : '';

    const message = `Assalam o Alaikum! *I'd love to order from Nabia's Eatery!*

*Order Details:*
Product: ${product.name}
Size/Option: ${selectedOption?.label || ''}
${addonsLabel ? `Add-ons: ${addonsLabel}\n` : ''}Quantity: ${quantity}
Total: Rs. ${totalPrice.toLocaleString()}

*Delivery Info:*
Name: ${customerName || ''}
Phone: ${phone || ''}
Address: ${address || ''}
Preferred Time: ${EXPECTED_TIME_LABEL}

Payment: Cash on Delivery
Notes: ${notes || ''}

JazakAllah!`;

    trackProductClick(product.name);
    return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`;
  };

  const handleOrder = () => {
    if (!customerName || !phone || !address) {
      setShowValidationErrors(true);
      return;
    }

    window.open(generateWhatsAppUrl(), '_blank');
    setIsConfirmOpen(false);
    onClose();
  };

  const handleOpenConfirm = () => {
    if (!address) {
      setShowValidationErrors(true);
      return;
    }

    setIsConfirmOpen(true);
  };

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container - Starts below navbar */}
      <div className="absolute top-16 sm:top-20 left-0 right-0 bottom-0 flex items-start sm:items-center justify-center overflow-hidden p-0 sm:p-4">
        {/* Modal Card */}
        <div className="relative w-full h-full sm:h-auto sm:max-h-[calc(100vh-6rem)] sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-cream dark:bg-chocolate-800 sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            {/* Product Image */}
            <div className="relative h-44 sm:h-52 md:h-60 w-full flex-shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              
              {/* Category Badge */}
              <div className="absolute bottom-3 left-4">
                <span className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider bg-gold text-chocolate-900 rounded-full">
                  {product.category}
                </span>
              </div>

              {/* Price Badge */}
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 text-xs font-bold bg-white/90 text-chocolate rounded-full shadow">
                  From Rs. {Math.min(...product.priceOptions.map(o => o.price)).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-5">
              {/* Header */}
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-chocolate dark:text-cream-100 mb-2">
                  {product.name}
                </h2>
                <p className="text-sm sm:text-base text-chocolate-600 dark:text-cream-300 leading-relaxed">
                  {product.fullDescription}
                </p>
              </div>

              {/* Price Options */}
              <div>
                {isBrownie ? (
                  <>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-chocolate-500 dark:text-cream-400 mb-3">
                      Select Brownie Size
                    </h3>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {product.priceOptions
                        .filter((option) => !option.id.startsWith('addon-'))
                        .map((option) => (
                          <button
                            key={option.id}
                            onClick={() => setSelectedOption(option)}
                            className={`p-3 rounded-xl border-2 transition-all text-left ${
                              selectedOption?.id === option.id
                                ? 'border-gold bg-gold/10 dark:bg-gold/20'
                                : 'border-chocolate/20 dark:border-cream/20 active:border-gold/50'
                            }`}
                          >
                            <span className="block text-xs sm:text-sm font-medium text-chocolate dark:text-cream-100">
                              {option.label}
                            </span>
                            <span className="block text-base sm:text-lg font-bold text-gold mt-0.5">
                              Rs. {option.price.toLocaleString()}
                            </span>
                          </button>
                        ))}
                    </div>

                    <h3 className="text-xs font-semibold uppercase tracking-wider text-chocolate-500 dark:text-cream-400 mb-3">
                      Add-ons (optional)
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {product.priceOptions
                        .filter((option) => option.id.startsWith('addon-'))
                        .map((option) => {
                          const isSelected = selectedAddons.some((addon) => addon.id === option.id);
                          return (
                            <button
                              key={option.id}
                              onClick={() => {
                                setSelectedAddons((current) =>
                                  current.some((addon) => addon.id === option.id)
                                    ? current.filter((addon) => addon.id !== option.id)
                                    : [...current, option]
                                );
                              }}
                              className={`p-3 rounded-xl border-2 transition-all text-left ${
                                isSelected
                                  ? 'border-gold bg-gold/10 dark:bg-gold/20'
                                  : 'border-chocolate/20 dark:border-cream/20 active:border-gold/50'
                              }`}
                            >
                              <span className="block text-xs sm:text-sm font-medium text-chocolate dark:text-cream-100">
                                {option.label}
                              </span>
                              <span className="block text-base sm:text-lg font-bold text-gold mt-0.5">
                                Rs. {option.price.toLocaleString()}
                              </span>
                            </button>
                          );
                        })}
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-chocolate-500 dark:text-cream-400 mb-3">
                      Select Size / Option
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {product.priceOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setSelectedOption(option)}
                          className={`p-3 rounded-xl border-2 transition-all text-left ${
                            selectedOption?.id === option.id
                              ? 'border-gold bg-gold/10 dark:bg-gold/20'
                              : 'border-chocolate/20 dark:border-cream/20 active:border-gold/50'
                          }`}
                        >
                          <span className="block text-xs sm:text-sm font-medium text-chocolate dark:text-cream-100">
                            {option.label}
                          </span>
                          <span className="block text-base sm:text-lg font-bold text-gold mt-0.5">
                            Rs. {option.price.toLocaleString()}
                          </span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Quantity */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-chocolate-500 dark:text-cream-400 mb-3">
                  Quantity
                </h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-11 h-11 rounded-xl bg-chocolate/10 dark:bg-cream/10 text-chocolate dark:text-cream hover:bg-chocolate/20 dark:hover:bg-cream/20 transition-colors flex items-center justify-center text-xl font-bold"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-2xl font-bold text-chocolate dark:text-cream-100">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-11 h-11 rounded-xl bg-chocolate/10 dark:bg-cream/10 text-chocolate dark:text-cream hover:bg-chocolate/20 dark:hover:bg-cream/20 transition-colors flex items-center justify-center text-xl font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-chocolate-500 dark:text-cream-400 mb-3">
                  Delivery Address <span className="text-red-500">*</span>
                </h3>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your delivery address..."
                  className="w-full p-3 rounded-xl border-2 border-chocolate/20 dark:border-cream/20 bg-transparent text-sm text-chocolate dark:text-cream-100 placeholder-chocolate-400 dark:placeholder-cream-500 focus:border-gold focus:outline-none transition-colors resize-none"
                  rows={2}
                />
                {showValidationErrors && !address && (
                  <p className="mt-1 text-xs text-red-500">Delivery address is required.</p>
                )}
              </div>

              {/* Notes */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-chocolate-500 dark:text-cream-400 mb-3">
                  Notes <span className="font-normal text-chocolate-400 dark:text-cream-500">(Special instructions, allergies, etc.)</span>
                </h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="E.g., No nuts, extra chocolate, ring the doorbell..."
                  className="w-full p-3 rounded-xl border-2 border-chocolate/20 dark:border-cream/20 bg-transparent text-sm text-chocolate dark:text-cream-100 placeholder-chocolate-400 dark:placeholder-cream-500 focus:border-gold focus:outline-none transition-colors resize-none"
                  rows={2}
                />
              </div>

              {/* Spacer for mobile sticky footer */}
              <div className="h-20 sm:hidden" />
            </div>
          </div>

          {/* Sticky Footer - Order Button */}
          <div className="flex-shrink-0 p-4 sm:p-6 bg-cream dark:bg-chocolate-800 border-t border-chocolate/10 dark:border-cream/10 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-chocolate-500 dark:text-cream-400">Total</span>
                <p className="text-xl sm:text-2xl font-bold text-gold">
                  Rs. {totalPrice.toLocaleString()}
                </p>
              </div>
              <button
                onClick={handleOpenConfirm}
                className="flex-1 sm:flex-none sm:px-8 py-3.5 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-sm sm:text-base font-semibold rounded-full transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span className="hidden sm:inline">Confirm Order</span>
                <span className="sm:hidden">Confirm</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-[110]">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsConfirmOpen(false)}
          />
          <div className="absolute top-16 sm:top-20 left-0 right-0 bottom-0 flex items-start sm:items-center justify-center overflow-hidden p-0 sm:p-4">
            <div className="relative w-full h-full sm:h-auto sm:max-h-[calc(100vh-6rem)] sm:max-w-md bg-cream dark:bg-chocolate-800 sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden mx-0 sm:mx-auto">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/10 hover:bg-black/20 text-chocolate-800 dark:text-cream-100"
                aria-label="Close confirmation"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-4">
                <h2 className="text-lg sm:text-xl font-serif font-bold text-chocolate dark:text-cream-100">
                  Confirm Your Order
                </h2>

              {/* Customer details */}
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-chocolate-500 dark:text-cream-400">
                    Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className={`w-full rounded-xl border-2 bg-transparent px-3 py-2 text-sm text-chocolate dark:text-cream-100 placeholder-chocolate-400 dark:placeholder-cream-500 focus:border-gold focus:outline-none ${
                      showValidationErrors && !customerName
                        ? 'border-red-500'
                        : 'border-chocolate/20 dark:border-cream/20'
                    }`}
                  />
                  {showValidationErrors && !customerName && (
                    <p className="mt-1 text-xs text-red-500">Name is required.</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-chocolate-500 dark:text-cream-400">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 03XXXXXXXXX"
                    required
                    className={`w-full rounded-xl border-2 bg-transparent px-3 py-2 text-sm text-chocolate dark:text-cream-100 placeholder-chocolate-400 dark:placeholder-cream-500 focus:border-gold focus:outline-none ${
                      showValidationErrors && !phone
                        ? 'border-red-500'
                        : 'border-chocolate/20 dark:border-cream/20'
                    }`}
                  />
                  {showValidationErrors && !phone && (
                    <p className="mt-1 text-xs text-red-500">Phone number is required.</p>
                  )}
                </div>

                <div className="relative">
                  <div className="mb-1 flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-chocolate-500 dark:text-cream-400">
                      Expected Time
                    </label>
                    <button
                      type="button"
                      className="ml-2 flex items-center gap-1 text-[11px] text-chocolate-500 dark:text-cream-400"
                      onMouseEnter={() => setShowTimeInfo(true)}
                      onMouseLeave={() => setShowTimeInfo(false)}
                      onFocus={() => setShowTimeInfo(true)}
                      onBlur={() => setShowTimeInfo(false)}
                    >
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-current text-[10px] font-semibold">
                        i
                      </span>
                      <span>What is this?</span>
                    </button>
                  </div>
                  <p className="text-sm text-chocolate-700 dark:text-cream-200">
                    {EXPECTED_TIME_LABEL}
                  </p>
                  {showTimeInfo && (
                    <div className="absolute right-0 top-7 z-20 w-52 rounded-lg bg-chocolate-900 px-3 py-2 text-[11px] text-cream shadow-lg">
                      We&apos;ll confirm the exact time with you on WhatsApp chat.
                    </div>
                  )}
                </div>
              </div>

              {/* Order summary */}
              <div className="rounded-2xl bg-chocolate/5 dark:bg-cream/5 p-4 text-sm">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-chocolate-500 dark:text-cream-400">
                  Order Summary
                </h3>
                <div className="space-y-1 text-chocolate-800 dark:text-cream-100">
                  <p>
                    <span className="font-semibold">Product:</span>{' '}
                    {product.name}
                  </p>
                  {selectedOption && (
                    <p>
                      <span className="font-semibold">Size/Option:</span>{' '}
                      {selectedOption.label}
                    </p>
                  )}
                  <p>
                    <span className="font-semibold">Quantity:</span>{' '}
                    {quantity}
                  </p>
                  <p>
                    <span className="font-semibold">Total:</span>{' '}
                    Rs. {totalPrice.toLocaleString()}
                  </p>
                  {address && (
                    <p>
                      <span className="font-semibold">Address:</span>{' '}
                      {address}
                    </p>
                  )}
                  {notes && (
                    <p>
                      <span className="font-semibold">Notes:</span>{' '}
                      {notes}
                    </p>
                  )}
                  <p>
                    <span className="font-semibold">Expected Time:</span>{' '}
                    {EXPECTED_TIME_LABEL}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 border-t border-chocolate/10 dark:border-cream/10 bg-cream dark:bg-chocolate-800 px-4 sm:px-6 py-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsConfirmOpen(false)}
                  className="w-full rounded-full border border-chocolate/20 bg-transparent px-4 py-2.5 text-sm font-semibold text-chocolate dark:text-cream-100 hover:bg-chocolate/5 dark:hover:bg-cream/5 sm:w-auto"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleOrder}
                  className="w-full rounded-full bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-green-700 active:bg-green-800 sm:w-auto"
                >
                  Order on WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
