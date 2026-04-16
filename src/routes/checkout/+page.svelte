<!--
  +page.svelte — Checkout Page (/checkout)

  SVELTE PATTERNS DEMONSTRATED:
  1. $state() for form field values and validation state
  2. $derived() for computed validation and cart data
  3. $effect() for side effects (redirect if cart empty)
  4. bind:value for two-way form input binding
  5. Form handling with onsubmit and preventDefault
  6. goto() for programmatic navigation after order placement

  FORM HANDLING IN SVELTE
  ========================
  Svelte makes form handling straightforward:
  - bind:value creates two-way binding between input and state
  - Form submission is handled via onsubmit on the <form> element
  - Use |preventDefault modifier (Svelte 4) or event.preventDefault() (Svelte 5)
  - Validation can be reactive using $derived()
-->
<script lang="ts">
  import { cart, cartTotal, cartCount, placeOrder } from '$lib/stores';
  import { PriceDisplay } from '$lib/components';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  /**
   * FORM STATE with $state()
   *
   * Each form field gets its own reactive state variable.
   * These are bound to inputs via bind:value for two-way data flow.
   */
  let name = $state('');
  let email = $state('');
  let address = $state('');
  let city = $state('');
  let zipCode = $state('');

  /** Track whether the user has attempted to submit (for showing validation errors) */
  let submitted = $state(false);

  /** Processing state to prevent double-submission */
  let isProcessing = $state(false);

  /**
   * VALIDATION with $derived()
   *
   * Each validation rule is a derived value that recomputes whenever
   * its dependencies (the form fields) change. This gives us real-time
   * validation feedback without manual event listeners.
   */
  let errors = $derived({
    name: name.trim() === '' ? 'Name is required' : '',
    email: email.trim() === ''
      ? 'Email is required'
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? 'Please enter a valid email address'
        : '',
    address: address.trim() === '' ? 'Address is required' : '',
    city: city.trim() === '' ? 'City is required' : '',
    zipCode: zipCode.trim() === '' ? 'ZIP code is required' : '',
  });

  /** Check if the entire form is valid */
  let isValid = $derived(
    Object.values(errors).every((error) => error === '')
  );

  /**
   * $effect() — SIDE EFFECTS IN SVELTE 5
   * ======================================
   * $effect() runs a function whenever its reactive dependencies change.
   * It's similar to React's useEffect but with automatic dependency tracking.
   *
   * In Svelte 4, you would use a reactive statement:
   *   $: if ($cartCount === 0) goto('/cart');
   *
   * In Svelte 5:
   *   $effect(() => { if (condition) doSomething(); });
   *
   * Here we redirect to /cart if the cart becomes empty (e.g., if the
   * user opens checkout in a new tab with no cart data).
   */
  onMount(() => {
    if ($cartCount === 0) {
      goto('/cart');
    }
  });

  /**
   * Handle form submission.
   * Validates all fields, then calls placeOrder() from the store
   * and navigates to the confirmation page.
   */
  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    submitted = true;

    if (!isValid) return;

    isProcessing = true;

    try {
      /**
       * placeOrder() from the store:
       * 1. Reads the current cart via get(cart)
       * 2. Creates an Order object with a unique ID
       * 3. Stores it in lastOrder
       * 4. Clears the cart
       * 5. Returns the Order
       */
      placeOrder({
        name: name.trim(),
        email: email.trim(),
        address: address.trim(),
        city: city.trim(),
        zipCode: zipCode.trim(),
      });

      /**
       * Navigate to confirmation page after successful order.
       * goto() is awaitable — we could show a loading state until
       * navigation completes, but for a mock app it's instant.
       */
      await goto('/confirmation');
    } catch (error) {
      console.error('Failed to place order:', error);
      isProcessing = false;
    }
  }
</script>

<svelte:head>
  <title>Checkout — ShopApp</title>
</svelte:head>

<div class="container page-checkout">
  <h1>Checkout</h1>

  <div class="checkout-layout">
    <!-- Checkout Form -->
    <form class="checkout-form" onsubmit={handleSubmit}>
      <h2>Shipping Information</h2>

      <!--
        FORM FIELDS with bind:value
        ============================
        bind:value creates a two-way binding:
        - Typing in the input updates the $state variable
        - Changing the variable updates the input

        The error display uses submitted && errors.field to only show
        errors after the first submission attempt (better UX than
        showing errors as the user starts typing).
      -->
      <div class="form-group">
        <label for="name">Full Name</label>
        <input
          id="name"
          type="text"
          class="input"
          class:input-error={submitted && errors.name}
          placeholder="John Doe"
          bind:value={name}
        />
        {#if submitted && errors.name}
          <span class="error-message">{errors.name}</span>
        {/if}
      </div>

      <div class="form-group">
        <label for="email">Email Address</label>
        <input
          id="email"
          type="email"
          class="input"
          class:input-error={submitted && errors.email}
          placeholder="john@example.com"
          bind:value={email}
        />
        {#if submitted && errors.email}
          <span class="error-message">{errors.email}</span>
        {/if}
      </div>

      <div class="form-group">
        <label for="address">Street Address</label>
        <input
          id="address"
          type="text"
          class="input"
          class:input-error={submitted && errors.address}
          placeholder="123 Main Street"
          bind:value={address}
        />
        {#if submitted && errors.address}
          <span class="error-message">{errors.address}</span>
        {/if}
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="city">City</label>
          <input
            id="city"
            type="text"
            class="input"
            class:input-error={submitted && errors.city}
            placeholder="New York"
            bind:value={city}
          />
          {#if submitted && errors.city}
            <span class="error-message">{errors.city}</span>
          {/if}
        </div>

        <div class="form-group">
          <label for="zipCode">ZIP Code</label>
          <input
            id="zipCode"
            type="text"
            class="input"
            class:input-error={submitted && errors.zipCode}
            placeholder="10001"
            bind:value={zipCode}
          />
          {#if submitted && errors.zipCode}
            <span class="error-message">{errors.zipCode}</span>
          {/if}
        </div>
      </div>

      <button
        type="submit"
        class="btn btn-primary submit-btn"
        disabled={isProcessing}
      >
        {#if isProcessing}
          Processing...
        {:else}
          Place Order
        {/if}
      </button>
    </form>

    <!-- Order Summary Sidebar -->
    <div class="order-summary card">
      <h2>Order Summary</h2>

      <div class="summary-items">
        {#each $cart as item (item.product.id)}
          <div class="summary-item">
            <div class="summary-item-info">
              <span class="summary-item-name">{item.product.name}</span>
              <span class="summary-item-qty">× {item.quantity}</span>
            </div>
            <PriceDisplay cents={item.product.price * item.quantity} />
          </div>
        {/each}
      </div>

      <hr class="divider" />

      <div class="summary-row">
        <span>Subtotal</span>
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
    </div>
  </div>
</div>

<style>
  .page-checkout {
    padding-top: var(--space-8);
  }

  .page-checkout > h1 {
    font-size: var(--font-size-3xl);
    margin-bottom: var(--space-8);
  }

  .checkout-layout {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: var(--space-8);
    align-items: start;
  }

  .checkout-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .checkout-form h2 {
    font-size: var(--font-size-xl);
    margin-bottom: var(--space-2);
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-4);
  }

  /* Error styling for inputs */
  .input-error {
    border-color: var(--color-danger) !important;
  }

  .input-error:focus {
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-danger) 20%, transparent) !important;
  }

  .error-message {
    font-size: var(--font-size-sm);
    color: var(--color-danger);
  }

  .submit-btn {
    margin-top: var(--space-4);
    padding: var(--space-3) var(--space-8);
    font-size: var(--font-size-lg);
    width: 100%;
  }

  /* Order summary sidebar */
  .order-summary {
    padding: var(--space-6);
    position: sticky;
    top: calc(3.5rem + var(--space-4));
  }

  .order-summary:hover {
    transform: none;
  }

  .order-summary h2 {
    font-size: var(--font-size-xl);
    margin-bottom: var(--space-4);
  }

  .summary-items {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .summary-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: var(--font-size-sm);
  }

  .summary-item-info {
    display: flex;
    gap: var(--space-2);
    min-width: 0;
  }

  .summary-item-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .summary-item-qty {
    color: var(--color-text-muted);
    white-space: nowrap;
  }

  .divider {
    border: none;
    border-top: 1px solid var(--color-border);
    margin: var(--space-4) 0;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-1) 0;
  }

  .free-shipping {
    color: var(--color-success);
    font-weight: 500;
  }

  .total-row {
    font-size: var(--font-size-lg);
    font-weight: 600;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .checkout-layout {
      grid-template-columns: 1fr;
    }

    .order-summary {
      position: static;
      order: -1;
    }

    .form-row {
      grid-template-columns: 1fr;
    }
  }
</style>
