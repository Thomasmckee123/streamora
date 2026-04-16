/**
 * src/lib/data/products.ts
 *
 * Hardcoded mock product catalog for ShopApp.
 *
 * In a production application, this data would come from an API call
 * (e.g., in a SvelteKit load() function). For this learning app, we
 * keep it simple with static data so no backend is required.
 *
 * The data is exported as a plain array - it is NOT a Svelte store
 * because it never changes. Only mutable state needs to be a store.
 */

import type { Product } from '$lib/types';

/**
 * All products available in the ShopApp catalog.
 * Organized into three categories: Electronics, Clothing, Home.
 *
 * Image URLs use placehold.co which returns placeholder images with the
 * product name as text - perfect for a reference/demo application.
 */
export const products: Product[] = [
  // ---- Electronics ----
  {
    id: 'prod_001',
    name: 'Wireless Headphones',
    description:
      'Premium over-ear wireless headphones with active noise cancellation, 30-hour battery life, and foldable design. Perfect for commuting, work-from-home, or focused listening sessions.',
    price: 7999,  // $79.99
    image: 'https://placehold.co/400x400?text=Wireless+Headphones',
    category: 'Electronics',
    rating: 4.5,
    inStock: true,
  },
  {
    id: 'prod_002',
    name: 'Smart Watch',
    description:
      'Feature-packed smartwatch with heart rate monitoring, GPS, sleep tracking, and 7-day battery. Compatible with iOS and Android. Water resistant to 50 meters.',
    price: 19999,  // $199.99
    image: 'https://placehold.co/400x400?text=Smart+Watch',
    category: 'Electronics',
    rating: 4.7,
    inStock: true,
  },
  {
    id: 'prod_003',
    name: 'Portable Bluetooth Speaker',
    description:
      'Compact 360-degree wireless speaker with 12-hour playtime, IPX7 waterproof rating, and rich bass. Great for outdoor adventures or desktop audio.',
    price: 4999,  // $49.99
    image: 'https://placehold.co/400x400?text=BT+Speaker',
    category: 'Electronics',
    rating: 4.2,
    inStock: true,
  },
  {
    id: 'prod_004',
    name: 'USB-C Hub 7-in-1',
    description:
      'Expand your laptop connectivity with 4K HDMI, 100W power delivery, USB 3.0 x3, SD card reader, and 3.5mm audio jack - all in a slim aluminum enclosure.',
    price: 3499,  // $34.99
    image: 'https://placehold.co/400x400?text=USB-C+Hub',
    category: 'Electronics',
    rating: 3.8,
    inStock: false,
  },

  // ---- Clothing ----
  {
    id: 'prod_005',
    name: 'Classic Crew-Neck Tee',
    description:
      '100% organic cotton heavyweight t-shirt. Pre-shrunk, enzyme-washed for softness, and available in 12 colors. Ethically made in a fair-trade certified facility.',
    price: 2999,  // $29.99
    image: 'https://placehold.co/400x400?text=Crew+Tee',
    category: 'Clothing',
    rating: 4.6,
    inStock: true,
  },
  {
    id: 'prod_006',
    name: 'Slim-Fit Chino Pants',
    description:
      'Versatile slim-fit chinos made from stretch-cotton twill. Office-appropriate yet comfortable enough for weekends. Features a hidden interior waistband.',
    price: 5999,  // $59.99
    image: 'https://placehold.co/400x400?text=Chino+Pants',
    category: 'Clothing',
    rating: 4.1,
    inStock: true,
  },
  {
    id: 'prod_007',
    name: 'Lightweight Running Jacket',
    description:
      'Wind and water-resistant running jacket with reflective details, packable hood, and three pockets. Weighs only 180g - you will hardly notice it.',
    price: 8999,  // $89.99
    image: 'https://placehold.co/400x400?text=Running+Jacket',
    category: 'Clothing',
    rating: 4.8,
    inStock: true,
  },

  // ---- Home ----
  {
    id: 'prod_008',
    name: 'Ceramic Pour-Over Coffee Set',
    description:
      'Handcrafted ceramic pour-over dripper with matching carafe and bamboo dripper stand. Produces a clean, nuanced cup. Dishwasher safe. Serves 1-2 cups per brew.',
    price: 4599,  // $45.99
    image: 'https://placehold.co/400x400?text=Pour-Over+Set',
    category: 'Home',
    rating: 4.9,
    inStock: true,
  },
  {
    id: 'prod_009',
    name: 'Linen Throw Blanket',
    description:
      'Oversized 100% washed linen throw blanket. Breathable in summer, cozy in winter. Gets softer with every wash. Available in natural, sage, and charcoal.',
    price: 6999,  // $69.99
    image: 'https://placehold.co/400x400?text=Linen+Blanket',
    category: 'Home',
    rating: 4.4,
    inStock: true,
  },
  {
    id: 'prod_010',
    name: 'Bamboo Cutting Board Set',
    description:
      'Set of three sustainably-sourced bamboo cutting boards in small, medium, and large. Juice grooves on one side, flat surface on the other. Includes rubber non-slip feet.',
    price: 3299,  // $32.99
    image: 'https://placehold.co/400x400?text=Cutting+Board',
    category: 'Home',
    rating: 3.9,
    inStock: false,
  },
];

/**
 * Helper - get all unique categories from the product list.
 * Used to build the category filter on the shop page.
 *
 * Array.from(new Set(...)) removes duplicates while preserving insertion order.
 */
export const categories: string[] = Array.from(
  new Set(products.map((p) => p.category))
);

/**
 * Helper - look up a single product by its ID.
 * Returns undefined if no product matches (handled by the route's load function).
 */
export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
