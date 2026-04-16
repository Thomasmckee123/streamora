<!--
  CartItem.svelte — Renders a single item in the shopping cart.

  SVELTE PATTERNS DEMONSTRATED:
  1. $props() with complex types (CartItem interface)
  2. $derived() rune for computed values (line total)
  3. Component composition (PriceDisplay, QuantitySelector)
  4. Store action calls (updateQuantity, removeFromCart)

  REACTIVE DECLARATIONS
  =====================
  Svelte 5 uses the $derived() rune for computed values:
    let lineTotal = $derived(item.product.price * item.quantity);

  In Svelte 4, you would use the $: reactive label:
    $: lineTotal = item.product.price * item.quantity;

  Both automatically re-run when their dependencies change.
  $derived() is preferred in Svelte 5 because it's more explicit
  and works outside of .svelte files too.
-->
<script lang="ts">
  import type { CartItem } from '$lib/types';
  import { updateQuantity, removeFromCart } from '$lib/stores';
  import PriceDisplay from './PriceDisplay.svelte';
  import QuantitySelector from './QuantitySelector.svelte';

  /**
   * The cart item to display (product + quantity).
   */
  let { item }: { item: CartItem } = $props();

  /**
   * $derived() — SVELTE 5 REACTIVE COMPUTATION
   *
   * This value automatically recalculates whenever `item.product.price`
   * or `item.quantity` changes. No manual subscription needed.
   *
   * Think of it as a "computed property" — it's always in sync with
   * its dependencies, but Svelte only re-runs the computation when
   * one of the dependencies actually changes (not on every render).
   */
  let lineTotal = $derived(item.product.price * item.quantity);
</script>

<div class="cart-item">
  <!--
    Small product thumbnail — links to the product detail page
    so users can review what they're buying.
  -->
  <a href="/products/{item.product.id}" class="item-image-link">
    <img
      src={item.product.image}
      alt={item.product.name}
      class="item-image"
    />
  </a>

  <div class="item-details">
    <a href="/products/{item.product.id}" class="item-name">
      {item.product.name}
    </a>

    <div class="item-price">
      <PriceDisplay cents={item.product.price} />
      <span class="price-label">each</span>
    </div>
  </div>

  <div class="item-quantity">
    <!--
      QuantitySelector with callback prop — when the user changes
      the quantity, we call updateQuantity on the cart store.

      CALLBACK PROP PATTERN:
      The onchange prop receives the new quantity value directly.
      QuantitySelector handles all the UI logic (clamping, validation),
      and we just pass the result to the store action.
    -->
    <QuantitySelector
      quantity={item.quantity}
      onchange={(value) => updateQuantity(item.product.id, value)}
    />
  </div>

  <div class="item-total">
    <PriceDisplay cents={lineTotal} />
  </div>

  <!--
    Remove button — calls removeFromCart which filters the item
    out of the cart array entirely.
  -->
  <button
    class="btn btn-danger remove-btn"
    onclick={() => removeFromCart(item.product.id)}
    aria-label="Remove {item.product.name} from cart"
  >
    Remove
  </button>
</div>

<style>
  .cart-item {
    display: grid;
    grid-template-columns: 80px 1fr auto auto auto;
    gap: var(--space-4);
    align-items: center;
    padding: var(--space-4);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
  }

  .item-image-link {
    display: block;
    width: 80px;
    height: 80px;
    border-radius: var(--radius-md);
    overflow: hidden;
    flex-shrink: 0;
  }

  .item-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .item-details {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    min-width: 0;
  }

  .item-name {
    font-weight: 600;
    color: var(--color-text);
    text-decoration: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .item-name:hover {
    color: var(--color-primary);
  }

  .item-price {
    display: flex;
    align-items: baseline;
    gap: var(--space-1);
  }

  .price-label {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }

  .item-total {
    font-size: var(--font-size-lg);
    font-weight: 600;
    white-space: nowrap;
  }

  .remove-btn {
    padding: var(--space-1) var(--space-3);
    font-size: var(--font-size-sm);
  }

  /* Responsive: stack on smaller screens */
  @media (max-width: 640px) {
    .cart-item {
      grid-template-columns: 60px 1fr;
      grid-template-rows: auto auto auto;
    }

    .item-quantity {
      grid-column: 1 / -1;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .item-total {
      grid-column: 1 / -1;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .remove-btn {
      grid-column: 1 / -1;
    }
  }
</style>
