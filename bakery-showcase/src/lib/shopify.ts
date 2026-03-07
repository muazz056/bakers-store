// WhatsApp order links
export const WHATSAPP_NUMBER = '923297189301';
export const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

// WhatsApp message templates
const MESSAGES = {
    cupcake: `Assalam o Alaikum! *I'd love to order your Premium Cupcakes!*

*Order Details:*
Product: Premium Cupcakes
Size/Option: 
Quantity: 

*Delivery Info:*
Name: 
Phone: 
Address: 
Preferred Time: 

Payment: Cash on Delivery
Notes: 

JazakAllah!`,

  brownie: `Assalam o Alaikum! *I'd love to order your Brownies!*

*Order Details:*
Product: Brownies
Quantity: 

*Delivery Info:*
Name: 
Phone: 
Address: 
Preferred Time: 

Payment: Cash on Delivery
Notes: 

JazakAllah!`,

  sundae: `Assalam o Alaikum! *I'd love to order your Sundae!*

*Order Details:*
Product: Sundae
Quantity: 

*Delivery Info:*
Name: 
Phone: 
Address: 
Preferred Time: 

Payment: Cash on Delivery
Notes: 

JazakAllah!`,

  chocolateChipButterCake: `Assalam o Alaikum! *I'd love to order your Chocolate Chip Butter Cake!*

*Order Details:*
Product: Chocolate Chip Butter Cake
Quantity: 

*Delivery Info:*
Name: 
Phone: 
Address: 
Preferred Time: 

Payment: Cash on Delivery
Notes: 

JazakAllah!`,

    pizza: `Assalam o Alaikum! *I'd love to order your Mini Pizza!*

*Order Details:*
Product: Mini Pizza
Size/Option: 
Quantity: 

*Delivery Info:*
Name: 
Phone: 
Address: 
Preferred Time: 

Payment: Cash on Delivery
Notes: 

JazakAllah!`,

    chickenBread: `Assalam o Alaikum! *I'd love to order your Chicken Bread!*

*Order Details:*
Product: Chicken Bread
Size/Option: 
Quantity: 

*Delivery Info:*
Name: 
Phone: 
Address: 
Preferred Time: 

Payment: Cash on Delivery
Notes: 

JazakAllah!`,

  general: `Assalam o Alaikum! *I'd love to place an order!*

*Order Details:*
Product: 
Quantity: 

*Delivery Info:*
Name: 
Phone: 
Address: 
Preferred Time: 

Payment: Cash on Delivery
Notes: 

JazakAllah!`,
};

export const SHOPIFY_PRODUCTS = {
  cupcake: `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(MESSAGES.cupcake)}`,
  brownie: `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(MESSAGES.brownie)}`,
  sundae: `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(MESSAGES.sundae)}`,
  chocolateChipButterCake: `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(MESSAGES.chocolateChipButterCake)}`,
  pizza: `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(MESSAGES.pizza)}`,
  chickenBread: `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(MESSAGES.chickenBread)}`,
  store: `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(MESSAGES.general)}`,
} as const;

// Social media links
export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/nabiaseatery/',
  whatsapp: `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(MESSAGES.general)}`,
  facebook: 'https://facebook.com/nabiaseatery',
  twitter: 'https://twitter.com/nabiaseatery',
} as const;

// Track click events (placeholder for analytics)
export function trackProductClick(productName: string) {
  // Implement your analytics tracking here
  // Example: Google Analytics, Mixpanel, etc.
  if (typeof window !== 'undefined' && 'gtag' in window) {
    // @ts-ignore
    window.gtag('event', 'click', {
      event_category: 'product',
      event_label: productName,
    });
  }
  
  console.log(`Product clicked: ${productName}`);
}

export function trackCTAClick(ctaName: string) {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    // @ts-ignore
    window.gtag('event', 'click', {
      event_category: 'cta',
      event_label: ctaName,
    });
  }
  
  console.log(`CTA clicked: ${ctaName}`);
}
