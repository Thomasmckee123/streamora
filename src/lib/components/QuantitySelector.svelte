<!--
  QuantitySelector.svelte — Increment/decrement control for item quantities.

  SVELTE 5 PATTERN: Callback props (replacing createEventDispatcher)
  ===================================================================
  In Svelte 4, child-to-parent communication used createEventDispatcher():
    const dispatch = createEventDispatcher();
    dispatch('change', newValue);

  In Svelte 5, the recommended approach is callback props:
    let { onchange } = $props();
    onchange(newValue);

  This is simpler, type-safe, and aligns with how React and other
  frameworks handle component callbacks. The parent passes a function:
    <QuantitySelector quantity={qty} onchange={(val) => qty = val} />
-->
<script lang="ts">
  /**
   * Props:
   * - quantity: current quantity value (controlled from parent)
   * - max: maximum allowed quantity (default 99)
   * - onchange: callback fired when the user changes the quantity
   */
  let {
    quantity,
    max = 99,
    onchange
  }: {
    quantity: number;
    max?: number;
    onchange: (value: number) => void;
  } = $props();

  /**
   * Clamp the value between 1 and max, then notify the parent.
   * This centralises the bounds-checking logic so neither the
   * buttons nor the input field can produce invalid values.
   */
  function handleChange(newValue: number) {
    const clamped = Math.min(Math.max(1, newValue), max);
    onchange(clamped);
  }

  /**
   * Handle direct keyboard input in the number field.
   * parseInt can return NaN for empty/invalid strings, so we
   * fall back to 1 in that case.
   */
  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const parsed = parseInt(target.value, 10);
    handleChange(isNaN(parsed) ? 1 : parsed);
  }
</script>

<div class="quantity-selector">
  <!--
    The minus button is disabled when quantity is at the minimum (1).
    :disabled is shorthand for disabled={expression} in Svelte.
  -->
  <button
    class="qty-btn"
    disabled={quantity <= 1}
    onclick={() => handleChange(quantity - 1)}
    aria-label="Decrease quantity"
  >
    &minus;
  </button>

  <!--
    SVELTE 5 NOTE: For the input, we set `value` and listen to `oninput`.
    In Svelte 4, you could use `bind:value` for two-way binding, which
    still works in Svelte 5. Here we use a one-way flow + handler for
    more explicit control over validation.
  -->
  <input
    type="number"
    class="qty-input"
    value={quantity}
    min="1"
    {max}
    oninput={handleInput}
    aria-label="Quantity"
  />

  <button
    class="qty-btn"
    disabled={quantity >= max}
    onclick={() => handleChange(quantity + 1)}
    aria-label="Increase quantity"
  >
    +
  </button>
</div>

<style>
  .quantity-selector {
    display: inline-flex;
    align-items: center;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    overflow: hidden;
  }

  .qty-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border: none;
    background-color: var(--color-bg);
    color: var(--color-text);
    font-size: var(--font-size-lg);
    cursor: pointer;
    transition: background-color var(--transition-fast);
  }

  .qty-btn:hover:not(:disabled) {
    background-color: var(--color-border);
  }

  .qty-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .qty-input {
    width: 3rem;
    height: 2.25rem;
    text-align: center;
    border: none;
    border-left: 1px solid var(--color-border);
    border-right: 1px solid var(--color-border);
    font-size: var(--font-size-base);
    color: var(--color-text);
    background: var(--color-surface);
    /* Hide number input spinners for a cleaner look */
    -moz-appearance: textfield;
    appearance: textfield;
  }

  .qty-input::-webkit-inner-spin-button,
  .qty-input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .qty-input:focus {
    outline: none;
    background: color-mix(in srgb, var(--color-primary) 5%, transparent);
  }
</style>
