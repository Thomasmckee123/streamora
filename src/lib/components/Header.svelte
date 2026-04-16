<!--
  Header.svelte — App-wide navigation header with cart badge.

  SVELTE PATTERN: $store auto-subscription
  =========================================
  In .svelte files, you can prefix any store name with $ to automatically:
  1. Subscribe to the store when the component mounts
  2. Get the current value as a plain variable
  3. Unsubscribe when the component is destroyed

  Example:
    import { cartCount } from '$lib/stores';
    // $cartCount is now a reactive number that updates when the cart changes

  This is one of Svelte's most powerful DX features — no useSelector,
  no mapStateToProps, no context consumers. Just $ and you're done.

  The $ prefix ONLY works inside .svelte files. In .ts files, use
  get(store) from 'svelte/store' instead.
-->
<script lang="ts">
  import { cartCount } from '$lib/stores';
</script>

<header class="header">
  <div class="container header-inner">
    <!--
      Logo/brand linking to the home page.
      In SvelteKit, standard <a> tags handle client-side navigation
      automatically — no special Link component needed.
    -->
    <a href="/" class="brand">
      <span class="brand-icon">🛍️</span>
      <span class="brand-name">ShopApp</span>
    </a>

    <!--
      Navigation links.
      SvelteKit's router intercepts <a> clicks for same-origin URLs,
      providing instant client-side navigation without full page reloads.
    -->
    <nav class="nav">
      <a href="/" class="nav-link">Products</a>
      <a href="/cart" class="nav-link cart-link">
        Cart
        <!--
          SVELTE STORE SUBSCRIPTION: $cartCount
          ======================================
          $cartCount is automatically subscribed to the cartCount derived store.
          It updates reactively whenever the cart contents change.

          {#if} conditionally renders the badge only when there are items.
          This avoids showing an empty "0" badge.
        -->
        {#if $cartCount > 0}
          <span class="cart-badge">{$cartCount}</span>
        {/if}
      </a>
    </nav>
  </div>
</header>

<style>
  .header {
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    box-shadow: var(--shadow-sm);
  }

  .header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 3.5rem;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    text-decoration: none;
    color: var(--color-text);
  }

  .brand:hover {
    text-decoration: none;
    color: var(--color-text);
  }

  .brand-icon {
    font-size: var(--font-size-xl);
  }

  .brand-name {
    font-size: var(--font-size-xl);
    font-weight: 700;
  }

  .nav {
    display: flex;
    align-items: center;
    gap: var(--space-6);
  }

  .nav-link {
    font-weight: 500;
    color: var(--color-text);
    text-decoration: none;
    transition: color var(--transition-fast);
  }

  .nav-link:hover {
    color: var(--color-primary);
    text-decoration: none;
  }

  .cart-link {
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--space-1);
  }

  .cart-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.25rem;
    height: 1.25rem;
    padding: 0 var(--space-1);
    border-radius: var(--radius-full);
    background-color: var(--color-primary);
    color: #ffffff;
    font-size: 0.7rem;
    font-weight: 700;
    line-height: 1;
  }
</style>
