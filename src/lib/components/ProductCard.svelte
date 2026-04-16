<!--
  ProductCard.svelte — Displays a product in a card layout for the listing grid.

  SVELTE PATTERNS DEMONSTRATED:
  1. $props() — declaring typed component props (Svelte 5 runes)
  2. {#if} blocks — conditional rendering
  3. Store imports — calling store actions (addToCart) directly
  4. Component composition — using PriceDisplay as a child component

  DIRECT STORE MUTATION vs EVENT DISPATCHING
  ==========================================
  This component imports `addToCart` directly from the store and calls it
  in the button handler. This is the simplest approach and works well when:
  - The action is universal (adding to cart always does the same thing)
  - There's no need for the parent to intercept the action

  An alternative is to use a callback prop (like React's pattern):
    let { onadd } = $props();
    <button onclick={() => onadd(product)}>Add</button>
  Then the parent decides what happens. Choose based on your use case.
-->
<script lang="ts">
  import type { Product } from '$lib/types';
  import { addToCart } from '$lib/stores';
  import PriceDisplay from './PriceDisplay.svelte';

  /**
   * The product to display. Typed using the Product interface
   * from our shared types module.
   */
  let { product }: { product: Product } = $props();

  /**
   * Generates a simple star display string from a numeric rating.
   * In a production app, you'd use an SVG star component.
   */
  function getStarDisplay(rating: number): string {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    return '★'.repeat(fullStars) + (hasHalf ? '½' : '') + '☆'.repeat(5 - fullStars - (hasHalf ? 1 : 0));
  }
</script>

<!--
  The card links to the product detail page using SvelteKit's
  file-based routing: /products/[id] maps to src/routes/products/[id]/+page.svelte
-->
<div class="card product-card">
  <a href="/products/{product.id}" class="product-image-link">
    <img src={product.image} alt={product.name} class="product-image" />
  </a>

  <div class="product-info">
    <!--
      SVELTE PATTERN: {#if} conditional rendering
      ============================================
      {#if condition}...{/if} renders content only when the condition is truthy.
      Unlike React's {condition && <JSX>}, Svelte uses template syntax
      which reads more like HTML and is easier to scan.
    -->
    <span class="badge badge-accent">{product.category}</span>

    <a href="/products/{product.id}" class="product-name">
      {product.name}
    </a>

    <div class="product-rating">
      <span class="stars">{getStarDisplay(product.rating)}</span>
      <span class="rating-value">{product.rating}</span>
    </div>

    <div class="product-price">
      <!--
        Component composition: PriceDisplay handles cent-to-dollar formatting.
        We pass `cents` as a prop, which PriceDisplay receives via $props().
      -->
      <PriceDisplay cents={product.price} />
    </div>

    {#if !product.inStock}
      <span class="out-of-stock">Out of Stock</span>
    {/if}

    <!--
      The button calls addToCart directly — the store handles all state logic.
      The :disabled attribute prevents adding out-of-stock items.
    -->
    <button
      class="btn btn-primary add-to-cart-btn"
      disabled={!product.inStock}
      onclick={() => addToCart(product)}
    >
      {#if product.inStock}
        Add to Cart
      {:else}
        Unavailable
      {/if}
    </button>
  </div>
</div>

<style>
  .product-card {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .product-image-link {
    display: block;
    aspect-ratio: 1;
    overflow: hidden;
    background-color: var(--color-bg);
  }

  .product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-base);
  }

  .product-card:hover .product-image {
    transform: scale(1.05);
  }

  .product-info {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    padding: var(--space-4);
    flex: 1;
  }

  .product-name {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--color-text);
    text-decoration: none;
    line-height: 1.3;
  }

  .product-name:hover {
    color: var(--color-primary);
    text-decoration: none;
  }

  .product-rating {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .stars {
    color: var(--color-accent);
    font-size: var(--font-size-sm);
  }

  .rating-value {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }

  .product-price {
    font-size: var(--font-size-xl);
    margin-top: auto;
    padding-top: var(--space-2);
  }

  .out-of-stock {
    font-size: var(--font-size-sm);
    color: var(--color-danger);
    font-weight: 500;
  }

  .add-to-cart-btn {
    margin-top: var(--space-2);
    width: 100%;
  }
</style>
