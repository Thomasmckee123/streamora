<!--
  +page.svelte — Product Detail Page (/products/[id])

  SVELTE PATTERNS DEMONSTRATED:
  1. SvelteKit load() data via $props()
  2. $state() for local component state (quantity)
  3. {#if}/{:else} conditional rendering
  4. Programmatic navigation with goto()
  5. Component composition (PriceDisplay, QuantitySelector)

  RECEIVING LOAD DATA
  ====================
  In Svelte 5 with SvelteKit, data from the load function (+page.ts)
  is received through $props():
    let { data } = $props();

  In Svelte 4, this was a special `export let data` prop:
    export let data;

  The `data` object contains whatever the load function returned.
-->
<script lang="ts">
  import { getProductById } from '$lib/data/products';
  import { addToCart } from '$lib/stores';
  import { PriceDisplay, QuantitySelector } from '$lib/components';
  import { goto } from '$app/navigation';

  /**
   * Receive the data from +page.ts load function.
   * data.id contains the product ID from the URL (/products/[id]).
   */
  let { data } = $props();

  /**
   * Look up the product from our mock data.
   * In a real app, you would fetch this in the load function.
   * getProductById returns undefined if no product matches.
   *
   * SVELTE 5: We use $derived() here because `data` is a reactive prop
   * that could change (e.g., when navigating between products).
   * Using $derived ensures `product` updates whenever `data.id` changes.
   * A plain `const` would only capture the initial value.
   */
  let product = $derived(getProductById(data.id));

  /**
   * Local state for the quantity selector.
   * $state() creates a reactive variable scoped to this component.
   * This value is only used locally — it's not in the global store.
   */
  let quantity = $state(1);

  /**
   * Generates a star display from a numeric rating.
   */
  function getStarDisplay(rating: number): string {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    return '★'.repeat(fullStars) + (hasHalf ? '½' : '') + '☆'.repeat(5 - fullStars - (hasHalf ? 1 : 0));
  }

  /**
   * Handle "Add to Cart" — adds the product multiple times based on
   * the selected quantity, then navigates to the cart page.
   *
   * NOTE: addToCart increments by 1 each call. For bulk adding, you
   * could extend the store function to accept a quantity parameter.
   * We loop here to keep the store API simple for learning purposes.
   */
  function handleAddToCart() {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    /**
     * goto() — PROGRAMMATIC NAVIGATION
     * =================================
     * Imported from '$app/navigation', goto() navigates to a new route
     * programmatically (without the user clicking a link).
     *
     * Common use cases:
     * - After form submission → goto('/confirmation')
     * - After adding to cart → goto('/cart')
     * - Redirects based on auth state → goto('/login')
     *
     * goto() returns a Promise that resolves when navigation completes.
     */
    goto('/cart');
  }
</script>

<svelte:head>
  <title>{product ? product.name : 'Product Not Found'} — ShopApp</title>
</svelte:head>

<div class="container page-detail">
  <!--
    BREADCRUMB NAVIGATION
    Shows the user's location in the site hierarchy.
    Uses simple <a> tags — SvelteKit handles client-side routing.
  -->
  <nav class="breadcrumb">
    <a href="/">Home</a>
    <span class="separator">/</span>
    <a href="/">Products</a>
    {#if product}
      <span class="separator">/</span>
      <span class="current">{product.name}</span>
    {/if}
  </nav>

  <!--
    {#if}/{:else} CONDITIONAL RENDERING
    ====================================
    Svelte's conditional blocks are template-level constructs,
    unlike React's ternary expressions in JSX.

    Benefits:
    - Cleaner for complex conditions with multiple branches
    - {:else if} for chained conditions
    - The condition is clearly separated from the content
  -->
  {#if product}
    <div class="product-detail">
      <div class="product-image-section">
        <img
          src={product.image}
          alt={product.name}
          class="detail-image"
        />
      </div>

      <div class="product-info-section">
        <span class="badge badge-accent">{product.category}</span>

        <h1 class="product-title">{product.name}</h1>

        <div class="product-rating-detail">
          <span class="stars">{getStarDisplay(product.rating)}</span>
          <span class="rating-text">{product.rating} out of 5</span>
        </div>

        <div class="product-price-detail">
          <PriceDisplay cents={product.price} />
        </div>

        <p class="product-description">{product.description}</p>

        <div class="stock-status">
          {#if product.inStock}
            <span class="in-stock">✓ In Stock</span>
          {:else}
            <span class="out-of-stock">✕ Out of Stock</span>
          {/if}
        </div>

        {#if product.inStock}
          <div class="add-to-cart-section">
            <div class="quantity-row">
              <label for="quantity">Quantity:</label>
              <QuantitySelector
                {quantity}
                max={10}
                onchange={(value) => (quantity = value)}
              />
            </div>

            <button class="btn btn-primary add-btn" onclick={handleAddToCart}>
              Add {quantity} to Cart
            </button>
          </div>
        {/if}
      </div>
    </div>
  {:else}
    <!--
      Error state: product not found.
      This occurs when the URL contains an ID that doesn't match any mock product.
    -->
    <div class="not-found">
      <h2>Product Not Found</h2>
      <p>The product you're looking for doesn't exist or has been removed.</p>
      <a href="/" class="btn btn-primary">Browse Products</a>
    </div>
  {/if}
</div>

<style>
  .page-detail {
    padding-top: var(--space-8);
  }

  .breadcrumb {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin-bottom: var(--space-8);
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }

  .breadcrumb a {
    color: var(--color-text-muted);
  }

  .breadcrumb a:hover {
    color: var(--color-primary);
  }

  .separator {
    color: var(--color-border);
  }

  .current {
    color: var(--color-text);
    font-weight: 500;
  }

  .product-detail {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-12);
    align-items: start;
  }

  .detail-image {
    width: 100%;
    border-radius: var(--radius-lg);
    background-color: var(--color-bg);
    aspect-ratio: 1;
    object-fit: cover;
  }

  .product-info-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .product-title {
    font-size: var(--font-size-3xl);
    line-height: 1.2;
  }

  .product-rating-detail {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .stars {
    color: var(--color-accent);
    font-size: var(--font-size-lg);
  }

  .rating-text {
    color: var(--color-text-muted);
    font-size: var(--font-size-sm);
  }

  .product-price-detail {
    font-size: var(--font-size-2xl);
  }

  .product-description {
    color: var(--color-secondary);
    line-height: 1.7;
  }

  .stock-status {
    font-weight: 500;
  }

  .in-stock {
    color: var(--color-success);
  }

  .out-of-stock {
    color: var(--color-danger);
  }

  .add-to-cart-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    padding-top: var(--space-4);
    border-top: 1px solid var(--color-border);
  }

  .quantity-row {
    display: flex;
    align-items: center;
    gap: var(--space-4);
  }

  .add-btn {
    align-self: flex-start;
    padding: var(--space-3) var(--space-8);
    font-size: var(--font-size-lg);
  }

  .not-found {
    text-align: center;
    padding: var(--space-16);
  }

  .not-found h2 {
    font-size: var(--font-size-2xl);
    margin-bottom: var(--space-4);
  }

  .not-found p {
    color: var(--color-text-muted);
    margin-bottom: var(--space-8);
  }

  /* Responsive: stack on smaller screens */
  @media (max-width: 768px) {
    .product-detail {
      grid-template-columns: 1fr;
      gap: var(--space-6);
    }
  }
</style>
