# ShopApp — Svelte Reference Implementation

A sample SvelteKit shopping application designed as a **developer reference** for onboarding new developers to the Svelte/SvelteKit stack. This is not a production application — it's a well-structured, thoroughly commented codebase that demonstrates real-world Svelte patterns across a realistic e-commerce user flow.

## Getting Started

```bash
# Install dependencies
yarn install

# Start the development server
yarn dev

# Build for production
yarn build

# Preview the production build
yarn preview

# Run TypeScript validation
npx svelte-check
```

The app runs at `http://localhost:5173` by default.

## Project Structure

| Path | Purpose |
|---|---|
| `src/routes/` | SvelteKit file-based routing — each folder is a URL route |
| `src/lib/components/` | Reusable Svelte UI components (ProductCard, CartItem, etc.) |
| `src/lib/stores/` | Svelte stores for global state (cart, orders) |
| `src/lib/data/` | Mock data fixtures (hardcoded products) |
| `src/lib/types/` | Shared TypeScript interfaces |
| `src/app.css` | Global CSS design system (tokens, utilities, reset) |
| `src/app.html` | HTML shell template |
| `static/` | Static assets served at the root URL |

## Pages

The app includes **5 routes** demonstrating a complete anonymous shopping flow:

### `/` — Product Listing
Browse all products with category filtering and text search. Demonstrates `$state()`, `$derived()`, `{#each}` with keyed blocks, `class:` directives, and `bind:value`.

### `/products/[id]` — Product Detail
View full product details with image, description, and add-to-cart functionality. Demonstrates SvelteKit `load()` functions, dynamic route parameters, `$derived()` for reactive data, and `goto()` programmatic navigation.

### `/cart` — Shopping Cart
Review cart contents, adjust quantities, and proceed to checkout. Demonstrates `$store` auto-subscriptions in templates, `{#if}/{:else}` conditional rendering, and component composition with `CartItem`.

### `/checkout` — Checkout Form
Complete a purchase with shipping information and order summary. Demonstrates `bind:value` two-way binding, `$derived()` for form validation, `$state()` for form fields, and `onMount` lifecycle hook.

### `/confirmation` — Order Confirmation
View order details after a successful purchase. Demonstrates cross-page data passing via stores, `onMount` for redirect guards, and Date formatting.

## Key Svelte Concepts

Every file includes inline comments explaining the patterns used. Here's a quick reference:

| Concept | Where to Find It |
|---|---|
| **`$state()`** — reactive state variables | `src/routes/+page.svelte`, `src/routes/checkout/+page.svelte` |
| **`$derived()`** — computed reactive values | `src/routes/+page.svelte` (filtering), `src/lib/components/CartItem.svelte` |
| **`$props()`** — component props (Svelte 5) | Every component in `src/lib/components/` |
| **`$effect()`** — reactive side effects | Mentioned in comments, alternative to `onMount` |
| **`writable()` / `derived()`** — Svelte stores | `src/lib/stores/cartStore.ts`, `src/lib/stores/orderStore.ts` |
| **`$store`** — auto-subscription syntax | `src/lib/components/Header.svelte`, `src/routes/cart/+page.svelte` |
| **`{#each}`** — list rendering with keys | `src/routes/+page.svelte`, `src/routes/cart/+page.svelte` |
| **`{#if}/{:else}`** — conditional rendering | `src/lib/components/ProductCard.svelte`, `src/routes/cart/+page.svelte` |
| **`bind:value`** — two-way data binding | `src/routes/checkout/+page.svelte`, `src/routes/+page.svelte` |
| **`class:`** — conditional CSS classes | `src/routes/+page.svelte` (filter buttons) |
| **`goto()`** — programmatic navigation | `src/routes/products/[id]/+page.svelte`, `src/routes/checkout/+page.svelte` |
| **`onMount`** — lifecycle hook | `src/routes/confirmation/+page.svelte` |
| **`load()`** — SvelteKit data loading | `src/routes/products/[id]/+page.ts` |
| **`+layout.svelte`** — shared layouts | `src/routes/+layout.svelte` |
| **`{@render children()}`** — slot rendering (Svelte 5) | `src/routes/+layout.svelte` |
| **Callback props** — child-to-parent communication | `src/lib/components/QuantitySelector.svelte` |
| **Barrel exports** — clean import paths | `src/lib/components/index.ts`, `src/lib/stores/index.ts` |
| **`<svelte:head>`** — per-page metadata | Every route page |

## Learning Path

If you're new to Svelte, we recommend exploring the codebase in this order:

1. **Types first** — Start with `src/lib/types/index.ts` to understand the data model
2. **Mock data** — Read `src/lib/data/products.ts` to see the product fixtures
3. **Stores** — Study `src/lib/stores/cartStore.ts` to learn Svelte's state management (writable, derived, store actions)
4. **Simple components** — Look at `PriceDisplay.svelte` and `QuantitySelector.svelte` for basic component patterns ($props, callback props)
5. **Complex components** — Read `ProductCard.svelte` and `CartItem.svelte` for composition, store interaction, and reactive derivations
6. **Layout** — See `src/routes/+layout.svelte` for the app shell and `{@render children()}` pattern
7. **Product listing** — Study `src/routes/+page.svelte` for `$state()`, `$derived()`, and `{#each}` blocks
8. **Product detail** — Read `src/routes/products/[id]/` for `load()` functions and dynamic routing
9. **Cart page** — See `src/routes/cart/+page.svelte` for store subscriptions in templates
10. **Checkout** — Study `src/routes/checkout/+page.svelte` for form handling, validation, and navigation
11. **Confirmation** — Read `src/routes/confirmation/+page.svelte` for lifecycle hooks and redirect guards

## Tech Stack

- **SvelteKit** — Full-stack Svelte framework with file-based routing
- **Svelte 5** — Uses runes (`$state`, `$derived`, `$props`, `$effect`)
- **TypeScript** — Type-safe throughout
- **Vite** — Build tool and dev server
- **adapter-static** — Builds to a static site (no server required)
