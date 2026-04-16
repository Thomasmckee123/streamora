<!--
  +page.svelte — Product Listing Page (Home Route: /)

  SVELTE PATTERNS DEMONSTRATED:
  1. $state() — reactive state for filter/search inputs
  2. $derived() — computed filtered product list
  3. {#each} — iterating over arrays to render lists
  4. Keyed each blocks — {#each items as item (item.id)}
  5. Component composition — rendering ProductCard for each product

  $state() vs $derived() — WHEN TO USE WHICH
  =============================================
  - $state() for values the USER controls (inputs, toggles, selections)
  - $derived() for values COMPUTED from other reactive values

  In Svelte 4, both used the same $: syntax:
    let search = '';           // state
    $: filtered = items.filter(...)  // derived

  In Svelte 5, they're distinct runes:
    let search = $state('');                     // state
    let filtered = $derived(items.filter(...))   // derived

  This makes the intent much clearer at a glance.
-->
<script lang="ts">
  import { products, categories } from '$lib/data/products';
  import { ProductCard } from '$lib/components';

  /**
   * $state() — REACTIVE STATE
   *
   * Creates a reactive variable that triggers UI updates when changed.
   * This replaces Svelte 4's implicit reactivity where any top-level
   * `let` variable was reactive.
   */
  let selectedCategory = $state<string>('All');
  let searchQuery = $state<string>('');

  /**
   * $derived() — REACTIVE COMPUTED VALUE
   *
   * Automatically re-computes whenever selectedCategory or searchQuery change.
   * Svelte tracks the dependencies automatically — you don't need to declare them.
   *
   * The filter logic:
   * 1. If a category is selected (not 'All'), filter by category
   * 2. If there's a search query, filter by name match (case-insensitive)
   * 3. Both filters can be active simultaneously (AND logic)
   */
  let filteredProducts = $derived(
    products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
  );
</script>

<!--
  SvelteKit page metadata.
  <svelte:head> lets you set <head> content (title, meta) per page.
-->
<svelte:head>
  <title>ShopApp — Browse Products</title>
</svelte:head>

<div class="container page-listing">
  <div class="page-header">
    <h1>Our Products</h1>
    <p class="subtitle">Browse our curated collection of quality items</p>
  </div>

  <!-- Filters section: search input + category buttons -->
  <div class="filters">
    <!--
      bind:value — TWO-WAY BINDING
      =============================
      `bind:value` creates a two-way binding between the input and
      the searchQuery state variable. When the user types, searchQuery
      updates. When searchQuery is set programmatically, the input updates.

      This is a Svelte convenience — it replaces the React pattern of
      value={state} + onChange={(e) => setState(e.target.value)}.
      bind:value works in both Svelte 4 and 5.
    -->
    <div class="search-wrapper">
      <input
        type="text"
        class="input search-input"
        placeholder="Search products..."
        bind:value={searchQuery}
      />
    </div>

    <!--
      CATEGORY FILTER BUTTONS
      The 'All' button plus one per category.
      Active state is determined by comparing with selectedCategory.
    -->
    <div class="category-filters">
      <button
        class="btn filter-btn"
        class:active={selectedCategory === 'All'}
        onclick={() => (selectedCategory = 'All')}
      >
        All
      </button>
      <!--
        {#each} BLOCK — ITERATING OVER ARRAYS
        =======================================
        {#each array as item} renders the inner template for each element.
        This is Svelte's equivalent of React's array.map() in JSX.

        Unlike React, Svelte's {#each} is part of the template syntax,
        making it visually clear where loops start and end.
      -->
      {#each categories as category}
        <button
          class="btn filter-btn"
          class:active={selectedCategory === category}
          onclick={() => (selectedCategory = category)}
        >
          {category}
        </button>
      {/each}
    </div>
  </div>

  <!-- Product grid -->
  <div class="results-info">
    <p>{filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found</p>
  </div>

  <!--
    KEYED {#each} BLOCKS — {#each items as item (item.id)}
    =======================================================
    The (product.id) part is a "key expression." It tells Svelte to
    identify each block by its key rather than by index.

    Why keys matter:
    - Without keys: Svelte reuses DOM nodes by position. If the list is
      reordered, components may display stale data.
    - With keys: Svelte matches each block to its key across re-renders,
      correctly moving, adding, or removing DOM nodes.

    ALWAYS use keys when:
    - The list can be reordered, filtered, or sorted
    - List items have internal state (like form inputs)
    - Items are components with their own lifecycle

    In React, this is the `key` prop: <Component key={item.id} />.
    In Svelte, it's the parenthesized expression in the {#each} tag.
  -->
  {#if filteredProducts.length > 0}
    <div class="grid product-grid">
      {#each filteredProducts as product (product.id)}
        <ProductCard {product} />
      {/each}
    </div>
  {:else}
    <div class="empty-state">
      <p>No products match your search.</p>
      <button
        class="btn btn-secondary"
        onclick={() => {
          searchQuery = '';
          selectedCategory = 'All';
        }}
      >
        Clear Filters
      </button>
    </div>
  {/if}
</div>

<style>
  .page-listing {
    padding-top: var(--space-8);
  }

  .page-header {
    margin-bottom: var(--space-8);
  }

  .page-header h1 {
    font-size: var(--font-size-3xl);
    margin-bottom: var(--space-2);
  }

  .subtitle {
    color: var(--color-text-muted);
    font-size: var(--font-size-lg);
  }

  .filters {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    margin-bottom: var(--space-6);
  }

  .search-wrapper {
    max-width: 400px;
  }

  .search-input {
    width: 100%;
  }

  .category-filters {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  .filter-btn {
    padding: var(--space-2) var(--space-4);
    background-color: var(--color-surface);
    color: var(--color-text-muted);
    border: 1px solid var(--color-border);
    font-size: var(--font-size-sm);
  }

  .filter-btn:hover {
    color: var(--color-text);
    border-color: var(--color-primary);
  }

  /*
    class:active DIRECTIVE
    =======================
    Svelte's class:name={condition} directive adds or removes a CSS class
    based on a boolean expression. More readable than template-string
    class names: class={`btn ${isActive ? 'active' : ''}`}
  */
  .filter-btn.active {
    background-color: var(--color-primary);
    color: #ffffff;
    border-color: var(--color-primary);
  }

  .results-info {
    margin-bottom: var(--space-4);
    color: var(--color-text-muted);
    font-size: var(--font-size-sm);
  }

  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  }

  .empty-state {
    text-align: center;
    padding: var(--space-16) var(--space-4);
    color: var(--color-text-muted);
  }

  .empty-state p {
    margin-bottom: var(--space-4);
    font-size: var(--font-size-lg);
  }
</style>
