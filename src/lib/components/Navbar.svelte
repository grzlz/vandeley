<script>
	import { page } from '$app/stores';

	const currentPath = $derived($page.url.pathname);

	function isActive(path) {
		if (path === '/') return currentPath === '/';
		return currentPath.startsWith(path);
	}
</script>

<nav class="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/95 backdrop-blur-md">
	<div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
		<!-- Brand -->
		<a href="/" class="group flex flex-col transition-opacity hover:opacity-80">
			<span class="text-lg font-bold tracking-tight text-white">
				vandeley.art
			</span>
			<span class="text-[0.7rem] font-medium text-slate-400 transition-colors group-hover:text-slate-300">
				importer-exporter
			</span>
		</a>

		<!-- Navigation -->
		<div class="flex items-center gap-1">
			<a
				href="/skills"
				class="px-4 py-2 text-sm font-medium transition-colors {isActive('/skills')
					? 'text-white'
					: 'text-slate-400 hover:text-white'}"
			>
				Skills
			</a>
			<a
				href="/analyze"
				class="px-4 py-2 text-sm font-medium transition-colors {isActive('/analyze')
					? 'text-white'
					: 'text-slate-400 hover:text-white'}"
			>
				Analyze
			</a>
			<a
				href="/learn"
				class="px-4 py-2 text-sm font-medium transition-colors {isActive('/learn')
					? 'text-white'
					: 'text-slate-400 hover:text-white'}"
			>
				Learn
			</a>
		</div>
	</div>
</nav>
