<!--
  +page.svelte — Order Confirmation Page (/confirmation)

  SVELTE PATTERNS DEMONSTRATED:
  1. Store reading ($lastOrder) for cross-page data passing
  2. onMount() lifecycle hook for redirect logic
  3. {#if}/{:else} for conditional page rendering
  4. Date formatting in templates

  CROSS-PAGE DATA WITH STORES
  ============================
  The confirmation page reads $lastOrder, which was set by placeOrder()
  during checkout. This is a simple pattern for passing data between
  pages without URL parameters or complex state management.

  The trade-off: if the user refreshes the page, the store resets to null
  (since stores are in-memory). In a production app, you would:
  - Persist the order to a backend and load by order ID from the URL
  - Use localStorage to persist the store across refreshes
  - Use SvelteKit's page load function to fetch the order server-side

  LIFECYCLE HOOKS
  ================
  onMount() runs once after the component is first rendered to the DOM.
  It's the Svelte equivalent of React's useEffect(() => { ... }, []).

  Common uses:
  - Fetching data after render
  - Setting up timers or event listeners
  - DOM measurements
  - Redirect logic (as we use here)

  onMount callbacks can return a cleanup function (like useEffect):
    onMount(() => {
      const timer = setInterval(() => {}, 1000);
      return () => clearInterval(timer);  // cleanup on destroy
    });
-->
<script lang="ts">
  import { lastOrder } from '$lib/stores';
  import { PriceDisplay } from '$lib/components';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  /**
   * onMount — REDIRECT GUARD
   *
   * If there's no order data (user navigated here directly or refreshed),
   * redirect to the home page. This is a "guard" pattern — protecting
   * pages that require certain state to be present.
   *
   * In Svelte 5, you could also use $effect() for this:
   *   $effect(() => {
   *     if (!$lastOrder) goto('/');
   *   });
   *
   * We use onMount here to demonstrate the lifecycle hook pattern and
   * to ensure the redirect only happens once on initial render.
   */
  onMount(() => {
    if (!$lastOrder) {
      goto('/');
    }
  });

  /**
   * Format a Date object to a human-readable string.
   * Using toLocaleDateString/toLocaleTimeString for locale-aware formatting.
   */
  function formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
</script>

<svelte:head>
  <title>Order Confirmed — ShopApp</title>
</svelte:head>

<div class="container page-confirmation">
  <!--
    CONDITIONAL RENDERING with store value.
    $lastOrder is null until an order is placed, so we guard against it.
  -->
  {#if $lastOrder}
    <div class="confirmation-content">
      <div class="success-header">
        <div class="success-icon">✓</div>
        <h1>Order Confirmed!</h1>
        <p class="success-message">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
      </div>

      <div class="order-details card">
        <div class="order-header">
          <h2>Order Details</h2>
          <div class="order-meta">
            <span class="order-id">Order #{$lastOrder.id.slice(0, 8).toUpperCase()}</span>
            <span class="order-date">{formatDate($lastOrder.createdAt)}</span>
          </div>
        </div>

        <!-- Items ordered -->
        <div class="ordered-items">
          <h3>Items Ordered</h3>
          {#each $lastOrder.items as item (item.product.id)}
            <div class="ordered-item">
              <img
                src={item.product.image}
                alt={item.product.name}
                class="ordered-item-image"
              />
              <div class="ordered-item-details">
                <span class="ordered-item-name">{item.product.name}</span>
                <span class="ordered-item-qty">Quantity: {item.quantity}</span>
              </div>
              <div class="ordered-item-price">
                <PriceDisplay cents={item.product.price * item.quantity} />
              </div>
            </div>
          {/each}
        </div>

        <hr class="divider" />

        <!-- Order total -->
        <div class="order-total">
          <span>Total</span>
          <PriceDisplay cents={$lastOrder.total} />
        </div>

        <hr class="divider" />

        <!-- Customer info -->
        <div class="customer-info">
          <h3>Shipping To</h3>
          <p>{$lastOrder.customer.name}</p>
          <p>{$lastOrder.customer.address}</p>
          <p>{$lastOrder.customer.city}, {$lastOrder.customer.zipCode}</p>
          <p class="customer-email">{$lastOrder.customer.email}</p>
        </div>
      </div>

      <div class="confirmation-actions">
        <a href="/" class="btn btn-primary">Continue Shopping</a>
      </div>
    </div>
  {:else}
    <!--
      Loading/redirect state.
      This briefly shows while onMount triggers the redirect to /.
    -->
    <div class="loading">
      <p>Redirecting...</p>
    </div>
  {/if}
</div>

<style>
  .page-confirmation {
    padding-top: var(--space-8);
    max-width: 700px;
  }

  .confirmation-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-8);
  }

  .success-header {
    text-align: center;
  }

  .success-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 4rem;
    height: 4rem;
    border-radius: var(--radius-full);
    background-color: var(--color-success);
    color: #ffffff;
    font-size: var(--font-size-2xl);
    font-weight: 700;
    margin-bottom: var(--space-4);
  }

  .success-header h1 {
    font-size: var(--font-size-3xl);
    margin-bottom: var(--space-2);
  }

  .success-message {
    color: var(--color-text-muted);
    font-size: var(--font-size-lg);
  }

  .order-details {
    padding: var(--space-6);
  }

  .order-details:hover {
    transform: none;
  }

  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--space-6);
  }

  .order-header h2 {
    font-size: var(--font-size-xl);
  }

  .order-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: var(--space-1);
    font-size: var(--font-size-sm);
  }

  .order-id {
    font-weight: 600;
    font-family: var(--font-mono);
  }

  .order-date {
    color: var(--color-text-muted);
  }

  .ordered-items h3 {
    font-size: var(--font-size-base);
    margin-bottom: var(--space-4);
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
  }

  .ordered-item {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    padding: var(--space-3) 0;
  }

  .ordered-item + .ordered-item {
    border-top: 1px solid var(--color-border);
  }

  .ordered-item-image {
    width: 50px;
    height: 50px;
    border-radius: var(--radius-sm);
    object-fit: cover;
  }

  .ordered-item-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .ordered-item-name {
    font-weight: 500;
  }

  .ordered-item-qty {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }

  .ordered-item-price {
    font-weight: 600;
  }

  .divider {
    border: none;
    border-top: 1px solid var(--color-border);
    margin: var(--space-4) 0;
  }

  .order-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: var(--font-size-lg);
    font-weight: 600;
  }

  .customer-info h3 {
    font-size: var(--font-size-base);
    margin-bottom: var(--space-3);
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
  }

  .customer-info p {
    line-height: 1.5;
  }

  .customer-email {
    margin-top: var(--space-2);
    color: var(--color-primary);
  }

  .confirmation-actions {
    text-align: center;
  }

  .confirmation-actions .btn {
    padding: var(--space-3) var(--space-8);
    font-size: var(--font-size-lg);
  }

  .loading {
    text-align: center;
    padding: var(--space-16);
    color: var(--color-text-muted);
  }

  @media (max-width: 640px) {
    .order-header {
      flex-direction: column;
      gap: var(--space-2);
    }

    .order-meta {
      align-items: flex-start;
    }
  }
</style>
