<!--
  PriceDisplay.svelte — Utility component for formatting prices.

  SVELTE 5 PATTERN: $props() rune
  ================================
  In Svelte 5, component props are declared using the $props() rune.
  This replaces the Svelte 4 `export let propName` syntax.

  Svelte 4 (legacy):
    export let cents: number;

  Svelte 5 (current):
    let { cents } = $props();

  $props() returns a reactive object containing all props passed to
  the component. Destructuring extracts the ones you need.

  WHY A UTILITY COMPONENT?
  ========================
  Even a tiny component like this is useful because:
  1. It centralises formatting logic (cents → "$XX.XX") in one place
  2. It's easy to extend later (e.g., currency symbols, locale formatting)
  3. It demonstrates Svelte's lightweight component model — there's almost
     zero overhead for small components, so don't hesitate to extract them.
-->
<script lang="ts">
  /**
   * Props interface declared inline via $props() destructuring.
   * `cents` is the price in cents (e.g., 2999 for $29.99).
   */
  let { cents }: { cents: number } = $props();
</script>

<!--
  TEMPLATE NOTE:
  The expression inside curly braces is standard JavaScript.
  (cents / 100).toFixed(2) converts cents to a dollar string.
  We prepend a literal "$" for the currency symbol.
-->
<span class="price">${(cents / 100).toFixed(2)}</span>

<style>
  .price {
    font-weight: 600;
    color: var(--color-text);
  }
</style>
