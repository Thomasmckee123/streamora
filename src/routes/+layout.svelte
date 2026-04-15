<script>
	import '../app.css';

	let { children } = $props();
</script>

<nav class="navbar">
	<a href="/" class="logo">
		<svg class="logo-icon" viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
			<path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/>
		</svg>
		<span class="logo-text">SvelteTube</span>
	</a>
</nav>

<main class="content">
	{@render children()}
</main>

<style>
	.navbar {
		position: sticky;
		top: 0;
		z-index: 100;
		display: flex;
		align-items: center;
		height: var(--nav-height);
		padding: 0 16px;
		background-color: var(--bg-primary);
		border-bottom: 1px solid var(--bg-hover);
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.logo-icon {
		color: var(--accent);
	}

	.logo-text {
		font-size: 1.25rem;
		font-weight: 700;
		letter-spacing: -0.5px;
	}

	.content {
		max-width: 1400px;
		margin: 0 auto;
		padding: 24px 16px;
	}
</style>
