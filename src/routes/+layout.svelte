<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.png';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />

	<!-- Open Graph Meta Tags -->
	<meta property="og:title" content="vandeley.art - Software Architect as a Service" />
	<meta
		property="og:description"
		content="Transform your git history into actionable architectural insights. Advanced analytics for software architects scaling from MVP to enterprise."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://vandeley.art" />
	<meta property="og:image" content="/logo.png" />
	<meta property="og:image:alt" content="Vandeley Logo" />
	<meta property="og:site_name" content="vandeley.art" />

	<!-- Twitter Card Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="vandeley.art - Software Architect" />
	<meta
		name="twitter:description"
		content="Transform your git history into actionable architectural insights. Advanced analytics for software architects."
	/>
	<meta name="twitter:image" content="/logo.png" />
	<meta name="twitter:image:alt" content="Vandeley Logo" />

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

{@render children?.()}
