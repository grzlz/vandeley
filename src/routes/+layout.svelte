<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.png';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import Navbar from '$lib/components/Navbar.svelte';

	let { children } = $props();

	injectAnalytics();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />

	<!-- Open Graph Meta Tags -->
	<meta property="og:title" content="Your software architect, importer-exporter" />
	<meta
		property="og:description"
		content="Transform your git history into actionable architectural insights. Import git log, export insights."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://www.vandeley.art" />
	<meta property="og:image" content="https://www.vandeley.art/screenshot.png?v=20240508" />
	<meta property="og:image:alt" content="Vandeley Analytics - Git History Analysis Dashboard" />
	<meta property="og:site_name" content="vandeley.art" />

	<!-- Twitter Card Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="vandeley.art - Software Architect" />
	<meta
		name="twitter:description"
		content="Transform your git history into actionable architectural insights. Advanced analytics for software architects."
	/>
	<meta name="twitter:image" content="https://www.vandeley.art/screenshot_tw.png?v=20240508" />
	<meta name="twitter:image:alt" content="Vandeley Analytics - Git History Analysis Dashboard" />

	<!-- Standard Meta Tags -->
	<meta
		name="description"
		content="Transform your git history into actionable architectural insights. Advanced analytics for software architects scaling from MVP to enterprise."
	/>
	<meta
		name="keywords"
		content="software architecture, git analytics, technical debt, scaling readiness, architecture insights, MVP to enterprise"
	/>
</svelte:head>

<Navbar />

{@render children?.()}
