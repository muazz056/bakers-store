// Animation frame configuration
export const HERO_ANIMATION = {
  totalFrames: 285, // Based on the extracted frames (001-285)
  fps: 24,
  preloadCount: 15,
} as const;

// Product data
export interface PriceOption {
  id: string;
  label: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  fullDescription: string;
  image: string;
  category: string;
  prepTime: number; // Preparation time in minutes
  priceOptions: PriceOption[];
}

export const WHATSAPP_NUMBER = '923297189301';
export const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export const PRODUCTS: Product[] = [
  {
    id: 'cupcake',
    name: 'Premium Cupcakes',
    description: 'Choose your level of indulgence with our premium cupcakes.',
    fullDescription: 'Our premium cupcakes are crafted with the finest ingredients and baked fresh daily. Choose from three levels of frosting and toppings: Simple Frosting for classic elegance, Heavy Frosting with toppings for extra delight, or Fully Loaded for the ultimate treat.',
    image: '/assets/images/cupcake.png',
    category: 'desserts',
    prepTime: 90, // 90 minutes
    priceOptions: [
      { id: 'simple-single', label: 'Simple Frosting - 1 Cupcake', price: 180 },
      { id: 'simple-box-6', label: 'Simple Frosting - Box of 6', price: 980 },
      { id: 'heavy-single', label: 'Heavy Frosting & Toppings - 1 Cupcake', price: 320 },
      { id: 'heavy-box-6', label: 'Heavy Frosting & Toppings - Box of 6', price: 1820 },
      { id: 'fullyloaded-single', label: 'Fully Loaded - 1 Cupcake', price: 400 },
      { id: 'fullyloaded-box-6', label: 'Fully Loaded - Box of 6', price: 2500 },
    ],
  },
  { 
    id: 'brownie',
    name: 'Brownies',
    description: 'Rich, fudgy brownies with multiple sizes and delicious add-ons.',
    fullDescription: 'Rich, fudgy brownies with a perfect crackly top and a range of sizes to fit every craving: Mini, Small, Medium, Large, Whole Tray and Box of 6. Customize your brownies further with premium add-ons like Nuts, Chocolate Ganache, and Biscoff for an extra indulgent treat.',
    image: '/assets/images/brownie.png',
    category: 'desserts',
    prepTime: 60, // 60 minutes
    priceOptions: [
      { id: 'mini', label: 'Mini Brownie', price: 100 },
      { id: 'small', label: 'Small Brownie', price: 170 },
      { id: 'medium', label: 'Medium Brownie', price: 250 },
      { id: 'large', label: 'Large Brownie', price: 350 },
      { id: 'whole-tray-12', label: 'Whole Tray (12 Pieces)', price: 1600 },
      { id: 'box-6', label: '6 Brownies in Box', price: 1220 },
      { id: 'addon-nuts', label: 'Add On: Nuts', price: 300 },
      { id: 'addon-ganache', label: 'Add On: Chocolate Ganache', price: 400 },
      { id: 'addon-biscoff', label: 'Add On: Biscoff', price: 600 },
    ],
  },
  {
    id: 'sundae',
    name: 'Sundae',
    description: 'Creamy ice cream sundae with toppings.',
    fullDescription: 'Creamy ice cream sundae topped with chocolate sauce, nuts, sprinkles, and a cherry on top. Made with premium ice cream and fresh toppings.',
    image: '/assets/images/sundae.png',
    category: 'desserts',
    prepTime: 10, // 10 minutes
    priceOptions: [
      { id: 'regular', label: '1 Sundae', price: 400 },
    ],
  },
  {
    id: 'chocolate-chip-butter-cake',
    name: 'Chocolate Chip Butter Cake',
    description: 'Moist buttery cake loaded with chocolate chips.',
    fullDescription: 'Moist buttery cake loaded with premium chocolate chips. A perfect blend of rich and sweet flavors. Ideal for birthdays, parties, or just because!',
    image: '/assets/images/Chocolate Chip Butter Cake.png',
    category: 'cakes',
    prepTime: 120, // 120 minutes
    priceOptions: [
      { id: 'slice', label: 'Single Slice', price: 300 },
      { id: 'half', label: 'Half Cake (500g)', price: 1200 },
      { id: 'full', label: 'Full Cake (1kg)', price: 2200 },
      { id: 'large', label: 'Large Cake (2kg)', price: 4000 },
    ],
  },
  {
    id: 'pizza',
    name: 'Mini Pizza',
    description: 'Freshly baked mini pizza with premium toppings.',
    fullDescription: 'Our mini pizzas feature a crispy crust topped with premium ingredients. Perfect for snacks, parties, or when you want a little something delicious. Each mini pizza is individually crafted and baked fresh.',
    image: '/assets/images/pizza.png',
    category: 'savory',
    prepTime: 30, // 30 minutes
    priceOptions: [
      { id: 'single', label: '1 Mini Pizza', price: 400 },
    ],
  },
  {
    id: 'chicken-bread',
    name: 'Chicken Bread',
    description: 'Soft bread stuffed with seasoned chicken.',
    fullDescription: 'Soft bread stuffed with seasoned chicken filling, herbs, and spices. A savory delight for any time of the day. Perfect for breakfast, lunch, or snacks!',
    image: '/assets/images/chicken bread.png',
    category: 'savory',
    prepTime: 45, // 45 minutes
    priceOptions: [
      { id: 'large', label: 'Large Chicken Bread', price: 800 },
      { id: 'small', label: 'Small Chicken Bread', price: 450 },
    ],
  },
];

// Brand promises
export const BRAND_PROMISES = [
  {
    title: 'Handcrafted',
    description: 'Every item is carefully made by our skilled bakers',
    icon: 'hands',
  },
  {
    title: 'Fresh Ingredients',
    description: 'We source only the finest, freshest ingredients',
    icon: 'leaf',
  },
  {
    title: 'Baked With Love',
    description: 'Passion and care in every single bite',
    icon: 'heart',
  },
] as const;

// Preparation times by product (in minutes)
export const PREPARATION_TIMES = {
  cupcake: 90,
  brownie: 60,
  sundae: 30,
  'chocolate-chip-butter-cake': 120,
  pizza: 45,
  'chicken-bread': 60,
} as const;

// Scroll animation storytelling steps
export const STORY_STEPS = [
  {
    id: 'step1',
    title: 'The Oven Awaits',
    description: 'Our journey begins with a perfectly preheated oven',
    frameRange: [0, 71], // Frames 1-72
  },
  {
    id: 'step2',
    title: 'Crafted by Hand',
    description: 'Expert hands shape each creation with precision',
    frameRange: [72, 142], // Frames 73-143
  },
  {
    id: 'step3',
    title: 'The Magic Happens',
    description: 'Heat transforms ingredients into golden perfection',
    frameRange: [143, 213], // Frames 144-214
  },
  {
    id: 'step4',
    title: 'Ready to Enjoy',
    description: 'Fresh from the oven to your hands',
    frameRange: [214, 284], // Frames 215-285
  },
] as const;

// Navigation items
export interface NavItem {
  label: string;
  href: string;
  isPrimary?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '#hero' },
  { label: 'Our Story', href: '#story' },
  { label: 'Products', href: '#products' },
  { label: 'Order Now', href: '#products', isPrimary: true },
];
