/**
 * src/lib/stores/cartStore.ts
 *
 * Shopping cart state management using Svelte stores.
 *
 * SVELTE STORES PRIMER
 * ====================
 *
 * A Svelte store is an object with a subscribe() method. Any component can
 * subscribe to receive new values whenever the store changes.
 *
 * Built-in store types from 'svelte/store':
 *
 *  1. writable(initialValue)
 *     - Can be read AND written from anywhere.
 *     - Exposes: subscribe(), set(newValue), update(fn)
 *
 *  2. readable(initialValue, startFn)
 *     - Read-only from outside. Use for external event sources
 *       (timers, WebSockets, geolocation, etc.).
 *
 *  3. derived(stores, derivationFn)
 *     - Computed from one or more other stores. Re-runs whenever its
 *       dependencies change - similar to Vue computed properties or
 *       React useMemo().
 *
 * THE $STORE AUTO-SUBSCRIPTION SYNTAX
 * =====================================
 * Inside a .svelte component, prefix any store name with $ to:
 *   - Automatically subscribe when the component mounts
 *   - Automatically unsubscribe when the component is destroyed
 *   - Read the current value as a plain variable (not a store object)
 *
 * Example in a component:
 *   <script>
 *     import { cart, cartCount } from '$lib/stores';
 *   </script>
 *   <p>You have {$cartCount} items in your cart.</p>
 *
 * You CANNOT use $ syntax in .ts files - only in .svelte files.
 * In .ts files, use the get() helper from 'svelte/store' instead:
 *   import { get } from 'svelte/store';
 *   const currentCart = get(cart); // reads the current value once
 *
 * STORE CONTRACT PATTERN
 * =======================
 * We follow a "store + actions" pattern:
 *   - Export the store itself (for reading/subscribing in components)
 *   - Export plain functions for mutations (addToCart, removeFromCart, etc.)
 *   - Never let components call store.update() directly - all mutations
 *     go through named functions so logic is centralised and testable.
 */

import { writable, derived } from 'svelte/store';
import type { CartItem, Product } from '$lib/types';

// --- CART STORE ---

/**
 * cart - the source-of-truth for the shopping cart contents.
 *
 * writable<CartItem[]>([]) creates a writable store whose initial value is
 * an empty array. The generic type parameter ensures type safety everywhere
 * the store is used.
 *
 * In a production app you would initialise this from localStorage so the
 * cart persists across page reloads.
 */
export const cart = writable<CartItem[]>([]);

// --- DERIVED STORES ---

/**
 * cartTotal - total price of all items in the cart, in CENTS.
 *
 * derived(stores, fn) takes:
 *   - stores: a single store or array of stores to depend on
 *   - fn: receives current store value(s) and returns the derived value
 *
 * Svelte re-runs this function every time `cart` changes.
 * Usage in a component: {($cartTotal / 100).toFixed(2)}
 */
export const cartTotal = derived(cart, ($cart) =>
  $cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )
);

/**
 * cartCount - total number of individual units across all cart items.
 *
 * Note: counts units, not unique products.
 * If a user has 2 headphones and 3 t-shirts, cartCount is 5.
 * Used for the badge number on the cart icon in the navigation.
 */
export const cartCount = derived(cart, ($cart) =>
  $cart.reduce((sum, item) => sum + item.quantity, 0)
);

// --- CART ACTIONS ---

/**
 * addToCart - adds a product to the cart or increments its quantity.
 *
 * store.update(fn) is like store.set() but receives the current value
 * as an argument so you can derive the new value from the old one.
 *
 * IMPORTANT: We always return a NEW array (immutable update pattern).
 * Mutating the existing array would NOT trigger Svelte reactivity
 * because Svelte tracks store identity (reference), not deep equality.
 */
export function addToCart(product: Product): void {
  cart.update((items) => {
    const existingItem = items.find((item) => item.product.id === product.id);

    if (existingItem) {
      // Product already in cart - increment quantity with immutable map
      return items.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }

    // Product not in cart - append new CartItem
    return [...items, { product, quantity: 1 }];
  });
}

/**
 * removeFromCart - removes a product from the cart entirely.
 */
export function removeFromCart(productId: string): void {
  cart.update((items) => items.filter((item) => item.product.id !== productId));
}

/**
 * updateQuantity - sets a specific quantity for a cart item.
 * If quantity <= 0, the item is removed from the cart entirely.
 */
export function updateQuantity(productId: string, quantity: number): void {
  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  cart.update((items) =>
    items.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    )
  );
}

/**
 * clearCart - empties the cart completely.
 *
 * store.set(value) is the simplest way to replace the entire store value.
 * Called by placeOrder() in orderStore.ts after a successful checkout.
 */
export function clearCart(): void {
  cart.set([]);
}
