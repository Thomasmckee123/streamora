/**
 * src/lib/stores/orderStore.ts
 *
 * Order placement logic and last-order state.
 *
 * get() - READING A STORE IN A .TS FILE
 * =======================================
 * In .svelte files we use the $ prefix for auto-subscriptions.
 * In .ts files (like this one), we use the get() helper from 'svelte/store'.
 *
 * get(store) reads the store's current value ONCE without setting up an
 * ongoing subscription. It is equivalent to:
 *   let value;
 *   const unsubscribe = store.subscribe(v => { value = v; });
 *   unsubscribe();
 *   return value;
 *
 * Use get() sparingly - it is a point-in-time snapshot. For reactive
 * derivations that update automatically, use derived() instead.
 */

import { writable, get } from 'svelte/store';
import type { Order, CustomerInfo } from '$lib/types';
import { cart, clearCart } from './cartStore';

// --- ORDER STORE ---

/**
 * lastOrder - stores the most recently placed order.
 *
 * Initialised to null because no order has been placed yet.
 * After a successful checkout, placeOrder() sets this to the new Order.
 * The confirmation page reads this to display order details.
 *
 * In a real app you would also persist this to a backend or localStorage.
 */
export const lastOrder = writable<Order | null>(null);

// --- ORDER ACTIONS ---

/**
 * placeOrder - finalises the cart into an Order and clears the cart.
 *
 * @param customer - Shipping and contact details from the checkout form.
 * @returns The newly created Order object.
 *
 * Steps:
 *   1. Read the current cart contents with get(cart)
 *   2. Validate the cart is not empty
 *   3. Compute the order total (same formula as cartTotal derived store)
 *   4. Create a new Order object with a unique ID and current timestamp
 *   5. Store the order in lastOrder so the confirmation page can display it
 *   6. Clear the cart so the user starts fresh
 *   7. Return the order (useful for navigation to /confirmation)
 */
export function placeOrder(customer: CustomerInfo): Order {
  // get() reads the cart store value without subscribing.
  // This is safe here because we only need the value at this instant.
  const currentCart = get(cart);

  if (currentCart.length === 0) {
    throw new Error('Cannot place an order with an empty cart.');
  }

  // Compute total in cents (mirrors the cartTotal derived store formula)
  const total = currentCart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  /**
   * Generate a unique order ID.
   * crypto.randomUUID() is available in modern browsers and Node 19+.
   * The fallback uses Date.now() + random string for older environments.
   */
  const id =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `order_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  const order: Order = {
    id,
    // Snapshot the cart items at this moment so the order record is
    // independent of future cart mutations (immutability for correctness).
    items: currentCart.map((item) => ({ ...item })),
    total,
    customer,
    createdAt: new Date(),
  };

  // Persist the order so the /confirmation page can display it.
  lastOrder.set(order);

  // Clear the cart - the purchase is complete.
  clearCart();

  return order;
}
