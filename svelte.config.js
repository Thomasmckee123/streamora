import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      // fallback: 'index.html' enables SPA (Single Page Application) mode.
      // In SPA mode, all routes are served from a single HTML file and
      // client-side routing handles navigation without server involvement.
      fallback: 'index.html'
    })
  }
};

export default config;
