<!--
  +page.svelte — Shopping Cart Page (/cart)

  SVELTE PATTERNS DEMONSTRATED:
  1. Store subscriptions in templates ($cart, $cartTotal, $cartCount)
  2. {#if}/{:else} conditional rendering for empty vs. populated states
  3. {#each} with keyed blocks for the cart item list
  4. Component composition (CartItem, PriceDisplay)

  STORE SUBSCRIPTIONS IN TEMPLATES
  ==================================
  When you use $storeName in a .svelte template, Svelte:
  1. Calls store.subscribe() when the component mounts
  2. Updates the template reactively when the store value changes
  3. Calls the unsubscribe function when the component is destroyed

  This is entirely automatic — you never need to manually subscribe
  or worry about memory leaks from forgotten unsubscriptions.

  Multiple components can subscribe to the same store simultaneously.
  Changes to the store (via set() or update()) notify ALL subscribers.
-->
<script lang="ts">
  import { cart, cartTotal, cartCount } from '$lib/stores';
  import { CartItem as CartItemComponent, PriceDisplay } from '$lib/components';
</script>

<svelte:head>
  <title>Shopping Cart — ShopApp</title>
</svelte:head>

<div class="container page-cart">
  <h1>Shopping Cart</h1>

  <!--
    CONDITIONAL RENDERING: Empty vs. Populated Cart
    =================================================
    {#if $cartCount > 0} checks the reactive store value.
    Since $cartCount is a derived store, it automatically updates
    whenever items are added, removed, or quantities change.
  -->
  {#if $cartCount > 0}
    <div class="cart-layout">
      <!-- Cart Items List -->
      <div class="cart-items">
        <p class="item-count">{$cartCount} item{$cartCount !== 1 ? 's' : ''} in your cart</p>

        <!--
          KEYED EACH BLOCK:
          Using (item.product.id) as the key ensures Svelte correctly
          tracks each CartItem component when the list changes.
        -->
        {#each $cart as item (item.product.id)}
          <CartItemComponent {item} />
        {/each}
      </div>

      <!-- Order Summary Sidebar -->
      <div class="cart-summary card">
        <h2>Order Summary</h2>

        <div class="summary-row">
          <span>Subtotal ({$cartCount} item{$cartCount !== 1 ? 's' : ''})</span>
          <PriceDisplay cents={$cartTotal} />
        </div>

        <div class="summary-row">
          <span>Shipping</span>
          <span class="free-shipping">Free</span>
        </div>

        <hr class="divider" />

        <div class="summary-row total-row">
          <span>Total</span>
          <PriceDisplay cents={$cartTotal} />
        </div>

        <a href="/checkout" class="btn btn-primary checkout-btn">
          Proceed to Checkout
        </a>

        <a href="/" class="btn btn-secondary continue-btn">
          Continue Shopping
        </a>
      </div>
    </div>
  {:else}
    <!--
      EMPTY STATE
      Show a friendly message when the cart is empty, with a CTA
      to browse products. This is a common UX pattern.
    -->
    <div class="empty-cart">
      <div class="empty-icon">🛒</div>
      <h2>Your cart is empty</h2>
      <p>Looks like you haven't added any items yet.</p>
      <a href="/" class="btn btn-primary">Browse Products</a>
    </div>
  {/if}
</div>

<style>
  .page-cart {
    padding-top: var(--space-8);
  }

  .page-cart h1 {
    font-size: var(--font-size-3xl);
    margin-bottom: var(--space-8);
  }

  .cart-layout {
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: var(--space-8);
    align-items: start;
  }

  .cart-items {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .item-count {
    color: var(--color-text-muted);
    font-size: var(--font-size-sm);
    margin-bottom: var(--space-2);
  }

  .cart-summary {
    padding: var(--space-6);
    position: sticky;
    top: calc(3.5rem + var(--space-4));
  }

  .cart-summary:hover {
    transform: none; /* Override card hover effect */
  }

  .cart-summary h2 {
    font-size: var(--font-size-xl);
    margin-bottom: var(--space-6);
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-2) 0;
  }

  .free-shipping {
    color: var(--color-success);
    font-weight: 500;
  }

  .divider {
    border: none;
    border-top: 1px solid var(--color-border);
    margin: var(--space-4) 0;
  }

  .total-row {
    font-size: var(--font-size-lg);
    font-weight: 600;
  }

  .checkout-btn {
    width: 100%;
    margin-top: var(--space-6);
    padding: var(--space-3);
    font-size: var(--font-size-lg);
  }

  .continue-btn {
    width: 100%;
    margin-top: var(--space-2);
  }

  /* Empty cart state */
  .empty-cart {
    text-align: center;
    padding: var(--space-16) var(--space-4);
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: var(--space-4);
  }

  .empty-cart h2 {
    font-size: var(--font-size-2xl);
    margin-bottom: var(--space-2);
  }

  .empty-cart p {
    color: var(--color-text-muted);
    margin-bottom: var(--space-8);
  }

  /* Responsive: stack sidebar below cart items */
  @media (max-width: 768px) {
    .cart-layout {
      grid-template-columns: 1fr;
    }

    .cart-summary {
      position: static;
    }
  }
</style>
