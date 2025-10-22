<script>
	import { goto } from '$app/navigation';
	import { getProgress } from '$lib/stores/progress.svelte.js';

	const progress = getProgress();

	const tracks = [
		{
			id: 'track-1',
			title: 'Component Architecture',
			description: 'Master the art of building scalable, maintainable Svelte components',
			icon: '🏗️',
			chapters: 4,
			status: 'available',
			path: '/book/chapter-1'
		},
		{
			id: 'track-2',
			title: 'Language Evolution',
			description: 'Understand how architecture evolves with language features',
			icon: '🔄',
			chapters: 5,
			status: 'coming-soon'
		},
		{
			id: 'track-3',
			title: 'System Design',
			description: 'Scale from components to complete application architectures',
			icon: '🌐',
			chapters: 6,
			status: 'coming-soon'
		}
	];

	const tools = [
		{
			id: 'diagrams',
			title: 'Diagrams Studio',
			description: 'Visualize architecture with Mermaid diagrams',
			icon: '📊',
			path: '/tools/diagrams',
			status: 'available'
		},
		{
			id: 'git-analytics',
			title: 'Git Analytics',
			description: 'Analyze codebase health and architectural patterns',
			icon: '📈',
			path: '/',
			status: 'available'
		},
		{
			id: 'playground',
			title: 'Component Playground',
			description: 'Experiment with component patterns in real-time',
			icon: '🎮',
			status: 'coming-soon'
		}
	];

	const resources = [
		{
			title: 'Fundamentals of Software Architecture',
			authors: 'Mark Richards & Neal Ford',
			description: 'An engineering approach to software architecture',
			category: 'Practical',
			url: 'https://mrce.in/ebooks/Software-Fundamentals%20of%20Software%20Architecture.pdf'
		},
		{
			title: 'Clean Architecture',
			authors: 'Robert C. Martin',
			description: "A craftsman's guide to software structure and design",
			category: 'Practical',
			url: 'https://agorism.dev/book/software-architecture/%28Robert%20C.%20Martin%20Series%29%20Robert%20C.%20Martin%20-%20Clean%20Architecture_%20A%20Craftsman%E2%80%99s%20Guide%20to%20Software%20Structure%20and%20Design-Prentice%20Hall%20%282017%29.pdf'
		},
		{
			title: 'Software Architecture: The Hard Parts',
			authors: 'Neal Ford, Mark Richards, Pramod Sadalage, Zhamak Dehghani',
			description: 'Modern trade-off analyses for distributed architectures',
			category: 'Strategic',
			url: 'https://dl.ebooksworld.ir/books/Software.Architecture.The.Hard.Parts.Neal.Ford.OReilly.9781492086895.EBooksWorld.ir.pdf'
		}
	];

	function navigateTo(path) {
		if (path) {
			goto(path);
		}
	}
</script>

<svelte:head>
	<title>Architecture Learning Ecosystem | Vandeley</title>
</svelte:head>

<main class="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
	<!-- Background gradients -->
	<div class="pointer-events-none absolute inset-0 -z-10 bg-slate-950 overflow-hidden">
		<div class="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-blue-600/30 blur-3xl"></div>
		<div
			class="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-indigo-500/25 blur-[140px]"
		></div>
		<div
			class="absolute -bottom-32 left-1/3 h-[26rem] w-[26rem] rounded-full bg-purple-600/20 blur-[160px]"
		></div>
	</div>

	<!-- Navigation -->
	<nav
		class="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl"
	>
		<div class="mx-auto flex max-w-6xl items-center justify-between px-4 md:px-6 py-3 md:py-4">
			<a href="/" class="flex items-center gap-2 md:gap-4 hover:opacity-80 transition">
				<img src="/logo.png" alt="Vandeley Logo" class="h-8 w-8 md:h-12 md:w-12 object-contain" />
				<div class="flex flex-col">
					<div
						class="text-sm md:text-base font-semibold tracking-tight text-white whitespace-nowrap"
					>
						vandeley.art
					</div>
					<div
						class="text-[0.55rem] md:text-[0.65rem] font-medium tracking-[0.4em] text-slate-300 uppercase whitespace-nowrap"
					>
						Architecture
					</div>
				</div>
			</a>

			<div class="flex items-center gap-2 md:gap-4 text-xs md:text-sm font-medium">
				<a
					href="/"
					class="rounded-full border border-white/10 px-2 md:px-4 py-1.5 md:py-2 text-slate-200 transition hover:border-white/30 hover:text-white whitespace-nowrap"
				>
					<span class="hidden sm:inline">Git Analytics</span>
					<span class="sm:hidden">Analytics</span>
				</a>
				<span
					class="rounded-full bg-white px-2 md:px-4 py-1.5 md:py-2 text-slate-900 shadow-sm whitespace-nowrap text-xs md:text-sm"
				>
					<span class="hidden sm:inline">Ecosystem Hub</span>
					<span class="sm:hidden">Hub</span>
				</span>
			</div>
		</div>
	</nav>

	<!-- Hero Section -->
	<section class="relative z-10 pt-32 pb-16">
		<div class="mx-auto max-w-6xl px-6">
			<div class="text-center mb-12">
				<h1 class="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
					Architecture Learning
					<span class="text-blue-400">Ecosystem</span>
				</h1>
				<p class="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
					Master software architecture through interactive learning, powerful tools, and curated
					resources
				</p>

				<!-- Progress Indicator -->
				<div
					class="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
				>
					<div class="flex items-center gap-2">
						<div class="w-2 h-2 rounded-full bg-green-400"></div>
						<span class="text-sm text-slate-200">
							{progress.completedChapters}/{progress.totalChapters} Chapters
						</span>
					</div>
					<div class="w-px h-4 bg-white/20"></div>
					<div class="flex items-center gap-2">
						<div class="w-2 h-2 rounded-full bg-blue-400"></div>
						<span class="text-sm text-slate-200">
							{progress.exploredTools}/{progress.totalTools} Tools
						</span>
					</div>
					<div class="w-px h-4 bg-white/20"></div>
					<span class="text-sm font-semibold text-white">{progress.percentComplete}% Complete</span>
				</div>
			</div>
		</div>
	</section>

	<!-- Interactive Book Section -->
	<section class="relative z-10 py-12 px-6">
		<div class="mx-auto max-w-6xl">
			<div class="mb-8">
				<div class="flex items-center gap-3 mb-3">
					<span class="text-3xl">📚</span>
					<h2 class="text-3xl font-bold text-white">Interactive Book</h2>
				</div>
				<p class="text-slate-300 text-lg">
					Learn architecture through hands-on chapters with live examples
				</p>
			</div>

			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each tracks as track}
					<div
						class="group relative rounded-2xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur transition-all duration-300 hover:border-white/20 hover:bg-slate-900/90 {track.status ===
						'coming-soon'
							? 'opacity-60'
							: ''}"
					>
						<!-- Glassy background -->
						<div
							class="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent rounded-2xl"
						></div>

						<div class="relative z-10 space-y-4">
							<div class="flex items-start justify-between">
								<div
									class="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/20 text-3xl"
								>
									{track.icon}
								</div>
								{#if track.status === 'coming-soon'}
									<span
										class="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-slate-400 uppercase"
									>
										Soon
									</span>
								{:else}
									<span
										class="rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-300 uppercase"
									>
										Available
									</span>
								{/if}
							</div>

							<div>
								<h3 class="text-xl font-semibold text-white mb-2">{track.title}</h3>
								<p class="text-sm text-slate-300 leading-relaxed">{track.description}</p>
							</div>

							<div class="space-y-3">
								<div class="flex items-center justify-between text-xs text-slate-300">
									<span>{track.chapters} chapters</span>
									{#if track.status === 'available'}
										<span>{progress.completedChapters} completed</span>
									{/if}
								</div>
								<div class="h-2 overflow-hidden rounded-full bg-white/10">
									<div
										class="h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-300"
										style={`width: ${track.status === 'available' ? (progress.completedChapters / track.chapters) * 100 : 0}%`}
									></div>
								</div>
							</div>

							{#if track.status === 'coming-soon'}
								<p class="text-sm text-slate-400 leading-relaxed">
									Advanced content in development. Coming soon with comprehensive guides.
								</p>
							{:else}
								<button
									onclick={() => navigateTo(track.path)}
									class="w-full bg-blue-500/20 px-4 py-2.5 text-sm font-medium text-blue-100 hover:bg-blue-500/30 rounded-lg transition-all"
								>
									{progress.completedChapters === 0 ? 'Start Learning' : 'Continue'}
								</button>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Architecture Tools Section -->
	<section class="relative z-10 py-12 px-6">
		<div class="mx-auto max-w-6xl">
			<div class="mb-8">
				<div class="flex items-center gap-3 mb-3">
					<span class="text-3xl">🛠️</span>
					<h2 class="text-3xl font-bold text-white">Architecture Tools</h2>
				</div>
				<p class="text-slate-300 text-lg">
					Powerful utilities to visualize, analyze, and design your systems
				</p>
			</div>

			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each tools as tool}
					<div
						class="group relative rounded-2xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur transition-all duration-300 hover:border-white/20 hover:bg-slate-900/90 {tool.status ===
						'coming-soon'
							? 'opacity-60'
							: 'cursor-pointer'}"
						onclick={() => tool.status === 'available' && navigateTo(tool.path)}
						role={tool.status === 'available' ? 'button' : 'article'}
						tabindex={tool.status === 'available' ? 0 : -1}
					>
						<!-- Glassy background -->
						<div
							class="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-transparent rounded-2xl"
						></div>

						<div class="relative z-10 space-y-4">
							<div class="flex items-start justify-between">
								<div
									class="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/20 text-3xl"
								>
									{tool.icon}
								</div>
								{#if tool.status === 'coming-soon'}
									<span
										class="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-slate-400 uppercase"
									>
										Soon
									</span>
								{:else}
									<span
										class="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-300 uppercase"
									>
										Ready
									</span>
								{/if}
							</div>

							<div>
								<h3 class="text-xl font-semibold text-white mb-2">{tool.title}</h3>
								<p class="text-sm text-slate-300 leading-relaxed">{tool.description}</p>
							</div>

							{#if tool.status === 'available'}
								<div
									class="flex items-center gap-2 text-sm text-blue-400 font-medium group-hover:gap-3 transition-all"
								>
									<span>Launch tool</span>
									<span>→</span>
								</div>
							{:else}
								<p class="text-sm text-slate-400">In development</p>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Learning Resources Section -->
	<section class="relative z-10 py-12 px-6 pb-24">
		<div class="mx-auto max-w-6xl">
			<div class="mb-8">
				<div class="flex items-center gap-3 mb-3">
					<span class="text-3xl">📖</span>
					<h2 class="text-3xl font-bold text-white">Learning Resources</h2>
				</div>
				<p class="text-slate-300 text-lg">
					Curated books and references to deepen your architectural knowledge
				</p>
			</div>

			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each resources as book}
					<a
						href={book.url}
						target="_blank"
						rel="noopener noreferrer"
						class="block rounded-2xl border border-white/10 bg-white/95 p-6 backdrop-blur transition-all hover:bg-white hover:scale-105 cursor-pointer"
					>
						<div class="space-y-4">
							<div>
								<h3 class="text-lg font-semibold text-slate-900 leading-tight">{book.title}</h3>
								<p class="mt-1 text-sm text-slate-600">by {book.authors}</p>
							</div>

							<p class="text-sm text-slate-700 leading-relaxed">{book.description}</p>

							<div class="flex items-center justify-between pt-2">
								{#if book.category === 'Practical'}
									<span
										class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700"
									>
										Practical
									</span>
								{:else}
									<span
										class="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
									>
										Strategic
									</span>
								{/if}
								<svg
									class="h-4 w-4 text-slate-500"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
									></path>
								</svg>
							</div>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</section>
</main>
