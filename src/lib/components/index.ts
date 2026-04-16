/**
 * src/lib/components/index.ts
 *
 * Barrel export for all reusable UI components.
 *
 * A barrel file lets consumers import multiple components from one path:
 *   import { ProductCard, PriceDisplay, Header } from '$lib/components';
 *
 * Instead of:
 *   import ProductCard from '$lib/components/ProductCard.svelte';
 *   import PriceDisplay from '$lib/components/PriceDisplay.svelte';
 *   import Header from '$lib/components/Header.svelte';
 *
 * NOTE: Svelte components are default exports from their .svelte files,
 * so we re-export them as named exports here for a cleaner API.
 */

export { default as PriceDisplay } from './PriceDisplay.svelte';
export { default as QuantitySelector } from './QuantitySelector.svelte';
export { default as ProductCard } from './ProductCard.svelte';
export { default as CartItem } from './CartItem.svelte';
export { default as Header } from './Header.svelte';
