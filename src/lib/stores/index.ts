/**
 * src/lib/stores/index.ts
 *
 * Barrel export for all Svelte stores.
 *
 * A "barrel" file re-exports everything from multiple modules through a
 * single entry point. This lets consumers do:
 *
 *   import { cart, cartTotal, addToCart, lastOrder, placeOrder } from '$lib/stores';
 *
 * Instead of:
 *
 *   import { cart, cartTotal, addToCart } from '$lib/stores/cartStore';
 *   import { lastOrder, placeOrder } from '$lib/stores/orderStore';
 *
 * In SvelteKit, $lib/stores resolves to src/lib/stores/index.ts automatically.
 */

export {
  cart,
  cartTotal,
  cartCount,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} from './cartStore';

export { lastOrder, placeOrder } from './orderStore';
