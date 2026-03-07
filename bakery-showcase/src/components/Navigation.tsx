'use client';

import { useState, useEffect } from 'react';
import { useTheme } from './ThemeProvider';
import { useReducedMotion } from './ReducedMotionProvider';
import { NAV_ITEMS } from '@/lib/constants';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { reducedMotion, toggleReducedMotion } = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'glass shadow-soft py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#hero');
            }}
            className="flex items-center gap-2 transition-all"
          >
            <img 
              src="/assets/images/logo.svg" 
              alt="Nabia's Eatery" 
              className="h-10 w-auto md:h-12"
            />
            <span className="font-serif text-xl md:text-2xl font-bold text-chocolate dark:text-gold">
              Nabia's Eatery
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3 lg:gap-6">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className={`font-medium transition-all duration-300 ${
                  item.isPrimary
                    ? 'bg-gold text-chocolate-900 py-1.5 px-3 lg:py-2 lg:px-4 xl:py-2.5 xl:px-5 rounded-full font-semibold uppercase text-[10px] lg:text-xs xl:text-sm tracking-wide hover:bg-gold-400 hover:shadow-lg hover:-translate-y-0.5 shadow-md whitespace-nowrap'
                    : 'text-xs lg:text-sm text-chocolate-600 dark:text-cream-200 hover:text-chocolate dark:hover:text-gold whitespace-nowrap'
                }`}
              >
                {item.label}
              </a>
            ))}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-chocolate/10 dark:hover:bg-cream/10 transition-colors"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5 text-chocolate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-cream-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>

            {/* Animation Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-chocolate-600 dark:text-cream-200">
                Animations
              </span>
              <button
                onClick={toggleReducedMotion}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  reducedMotion 
                    ? 'bg-chocolate-300 dark:bg-chocolate-700' 
                    : 'bg-gold dark:bg-gold-600'
                }`}
                aria-label={`${reducedMotion ? 'Enable' : 'Disable'} hero animations`}
                title={reducedMotion ? 'Enable hero scroll animation' : 'Disable hero scroll animation'}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    reducedMotion ? 'translate-x-1' : 'translate-x-6'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Mobile Order Button + Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Order Now Button */}
            <a
              href="#products"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#products');
              }}
              className="bg-gold text-chocolate-900 py-1.5 px-3 rounded-full text-[10px] font-semibold uppercase tracking-wide shadow-md hover:bg-gold-400 transition-all whitespace-nowrap"
            >
              Order
            </a>
            
            {/* Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 sm:p-2 text-chocolate dark:text-cream-200"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="glass rounded-2xl p-4 space-y-2">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className={`block py-3 px-4 rounded-xl text-center font-medium transition-colors ${
                  item.isPrimary
                    ? 'bg-chocolate text-cream dark:bg-gold dark:text-chocolate-900'
                    : 'text-chocolate-600 dark:text-cream-200 hover:bg-chocolate/5 dark:hover:bg-cream/5'
                }`}
              >
                {item.label}
              </a>
            ))}

            {/* Mobile toggles */}
            <div className="flex flex-col gap-3 pt-2 border-t border-chocolate/10 dark:border-cream/10">
              <button
                onClick={toggleTheme}
                className="p-3 rounded-xl hover:bg-chocolate/5 dark:hover:bg-cream/5 transition-colors flex items-center justify-center gap-2"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <>
                    <svg className="w-5 h-5 text-chocolate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    <span className="text-sm text-chocolate-600">Dark Mode</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 text-cream-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span className="text-sm text-cream-200">Light Mode</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-chocolate/5 dark:bg-cream/5">
                <span className="text-sm font-medium text-chocolate-600 dark:text-cream-200">
                  Animations
                </span>
                <button
                  onClick={toggleReducedMotion}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    reducedMotion 
                      ? 'bg-chocolate-300 dark:bg-chocolate-700' 
                      : 'bg-gold dark:bg-gold-600'
                  }`}
                  aria-label={`${reducedMotion ? 'Enable' : 'Disable'} hero animations`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      reducedMotion ? 'translate-x-1' : 'translate-x-6'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
