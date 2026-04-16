/**
 * src/lib/types/index.ts
 *
 * Central type definitions for ShopApp.
 *
 * In SvelteKit, $lib is an alias for src/lib, so you import these as:
 *   import type { Product, CartItem } from '$lib/types';
 *
 * Using `import type` (instead of `import`) is a TypeScript best practice
 * for type-only imports - it is erased at compile time and cannot cause
 * circular dependency issues at runtime.
 */

/**
 * Product - represents a single item available for purchase in the store.
 *
 * Prices are stored in CENTS (integer) to avoid floating-point rounding errors.
 * Example: $29.99 is stored as 2999.
 * To display: (price / 100).toFixed(2) => "29.99"
 */
export interface Product {
  /** Unique identifier, e.g. "prod_001" */
  id: string;
  /** Display name shown in product listings */
  name: string;
  /** Long-form description shown on the product detail page */
  description: string;
  /** Price in cents (integer). $29.99 -> 2999 */
  price: number;
  /** URL for the product image */
  image: string;
  /** Category slug, e.g. "Electronics" | "Clothing" | "Home" */
  category: string;
  /** Star rating from 1.0 to 5.0 */
  rating: number;
  /** Whether the product is currently available to purchase */
  inStock: boolean;
}

/**
 * CartItem - a product that has been added to the shopping cart.
 *
 * Rather than duplicating product fields, we nest the full Product object.
 * This makes it easy to display cart contents without extra lookups.
 */
export interface CartItem {
  /** The full product data */
  product: Product;
  /** How many units the user wants to buy (minimum 1) */
  quantity: number;
}

/**
 * CustomerInfo - shipping and contact details collected at checkout.
 * All fields are plain strings; validation happens in the form component.
 */
export interface CustomerInfo {
  /** Full name of the customer */
  name: string;
  /** Contact email address */
  email: string;
  /** Street address line */
  address: string;
  /** City name */
  city: string;
  /** Postal / ZIP code */
  zipCode: string;
}

/**
 * Order - a completed purchase record.
 *
 * Created by placeOrder() in orderStore.ts when the user submits the
 * checkout form. In a real app this would be persisted to a database;
 * here we store it in an in-memory Svelte store (lastOrder).
 */
export interface Order {
  /** Unique order identifier, generated at order placement time */
  id: string;
  /** Snapshot of the cart items at the time of purchase */
  items: CartItem[];
  /**
   * Grand total in CENTS.
   * Computed as sum(item.product.price * item.quantity) at checkout time.
   */
  total: number;
  /** Customer shipping and contact information */
  customer: CustomerInfo;
  /** Timestamp of when the order was placed */
  createdAt: Date;
}
