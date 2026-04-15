<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.video.title} — SvelteTube</title>
</svelte:head>

<div class="watch-page">
	<div class="player-container">
		<video class="video-player" controls autoplay>
			<source src={data.video.videoUrl} type="video/mp4" />
			<track kind="captions" />
			Your browser does not support the video tag.
		</video>
	</div>

	<div class="video-details">
		<h1 class="video-title">{data.video.title}</h1>
		<div class="video-meta">
			<span class="channel-name">{data.video.channel}</span>
			<span class="separator">·</span>
			<span>{data.video.views}</span>
			<span class="separator">·</span>
			<span>{data.video.timestamp}</span>
		</div>
	</div>

	<a href="/" class="back-link">← Back to Home</a>
</div>

<style>
	.watch-page {
		max-width: 960px;
		margin: 0 auto;
	}

	.player-container {
		width: 100%;
		aspect-ratio: 16 / 9;
		background-color: #000;
		border-radius: 12px;
		overflow: hidden;
		margin-bottom: 16px;
	}

	.video-player {
		width: 100%;
		height: 100%;
	}

	.video-details {
		margin-bottom: 24px;
	}

	.video-title {
		font-size: 1.25rem;
		font-weight: 700;
		margin-bottom: 8px;
	}

	.video-meta {
		display: flex;
		align-items: center;
		gap: 6px;
		color: var(--text-secondary);
		font-size: 0.9rem;
	}

	.channel-name {
		font-weight: 500;
		color: var(--text-primary);
	}

	.separator {
		color: var(--text-secondary);
	}

	.back-link {
		display: inline-block;
		padding: 8px 16px;
		border-radius: 20px;
		background-color: var(--bg-secondary);
		color: var(--text-primary);
		font-size: 0.9rem;
		transition: background-color 0.15s ease;
	}

	.back-link:hover {
		background-color: var(--bg-hover);
	}
</style>
