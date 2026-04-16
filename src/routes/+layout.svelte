<!--
  +layout.svelte — Root layout wrapping every page in the app.

  SVELTEKIT LAYOUT SYSTEM
  ========================
  In SvelteKit, +layout.svelte files wrap all pages in the same directory
  (and subdirectories). They're like "parent templates" — perfect for:
  - Shared UI (navigation headers, footers, sidebars)
  - Global styles
  - App-level providers or context

  The layout hierarchy is nested: a layout in src/routes/ wraps everything,
  while a layout in src/routes/admin/ only wraps pages under /admin.

  SVELTE 5: {@render children()} replaces <slot />
  ==================================================
  In Svelte 4, layouts used <slot /> to render child content:
    <Header />
    <slot />

  In Svelte 5, the children content is passed as a "snippet" prop and
  rendered with {@render}:
    let { children } = $props();
    {@render children()}

  Both achieve the same result, but the Svelte 5 approach is more
  explicit and composable (you can have multiple named snippets).
-->
<script>
  import '../app.css';
  import { Header } from '$lib/components';

  /**
   * `children` is a special prop in Svelte 5 layout/components.
   * It contains the content that should be rendered inside this layout,
   * which is the matched +page.svelte component for the current route.
   */
  let { children } = $props();
</script>

<!--
  App shell structure:
  1. Header — sticky navigation bar with cart badge
  2. Main — page content (rendered via {@render children()})
-->
<Header />

<main class="main-content">
  {@render children()}
</main>

<style>
  .main-content {
    min-height: calc(100vh - 3.5rem); /* viewport minus header height */
    padding-bottom: var(--space-16);
  }
</style>
