<script lang="ts">
	import { videos } from '$lib/data/videos';
</script>

<svelte:head>
	<title>SvelteTube</title>
</svelte:head>

<div class="video-grid">
	{#each videos as video (video.id)}
		<a href="/watch/{video.id}" class="video-card">
			<div class="thumbnail-container">
				<img src={video.thumbnail} alt={video.title} class="thumbnail" loading="lazy" />
			</div>
			<div class="video-info">
				<h3 class="video-title">{video.title}</h3>
				<p class="channel-name">{video.channel}</p>
				<p class="video-meta">{video.views} · {video.timestamp}</p>
			</div>
		</a>
	{/each}
</div>

<style>
	.video-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 24px 16px;
	}

	.video-card {
		display: block;
		border-radius: 12px;
		overflow: hidden;
		transition: transform 0.15s ease;
	}

	.video-card:hover {
		transform: translateY(-2px);
	}

	.thumbnail-container {
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 9;
		background-color: var(--bg-secondary);
		border-radius: 12px;
		overflow: hidden;
	}

	.thumbnail {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.video-info {
		padding: 12px 4px;
	}

	.video-title {
		font-size: 0.95rem;
		font-weight: 600;
		line-height: 1.3;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		margin-bottom: 4px;
	}

	.channel-name {
		font-size: 0.85rem;
		color: var(--text-secondary);
	}

	.video-meta {
		font-size: 0.85rem;
		color: var(--text-secondary);
	}
</style>
