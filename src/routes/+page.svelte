<script>
	import FileUpload from '$lib/components/FileUpload.svelte';
	import { goto } from '$app/navigation';

	const featuredSkills = [
		{
			id: 'art-vandeley',
			name: 'art-vandeley',
			tagline: 'Spanish Documentation Master',
			description:
				'Generate comprehensive Spanish README.md with technical diagrams for open source projects.',
			icon: '📚',
			category: 'Documentation'
		},
		{
			id: 'incident-report',
			name: 'incident-report',
			tagline: 'Bug Investigation Expert',
			description:
				'Systematically investigate codebase issues with root cause analysis and solution proposals.',
			icon: '🔍',
			category: 'Debugging'
		},
		{
			id: 'session-handoff',
			name: 'session-handoff',
			tagline: 'Session Memory Manager',
			description:
				'Create efficient session handoff documentation for seamless coding continuity.',
			icon: '📝',
			category: 'Productivity'
		},
		{
			id: 'vim-architect',
			name: 'vim-architect',
			tagline: 'Code Navigation Optimizer',
			description: 'Optimize files for LazyVim with modelines and intelligent fold markers.',
			icon: '🎯',
			category: 'Development'
		},
		{
			id: 'skilled-architect',
			name: 'skilled-architect',
			tagline: 'Architecture Documentation',
			description:
				'Generate production-ready technical documentation with complete diagram suites.',
			icon: '🏗️',
			category: 'Architecture'
		}
	];

	function handleFileLoaded(event) {
		const { content } = event.detail;
		// Store the content and navigate to analyze page
		sessionStorage.setItem('gitLogContent', content);
		goto('/analyze');
	}
</script>

<main
	class="min-h-screen bg-slate-950 font-[system-ui,-apple-system,BlinkMacSystemFont,'SF Pro Display',sans-serif] antialiased overflow-x-hidden"
>
	<!-- Hero + Bookshelf Section -->
	<section class="pt-32 pb-24 px-6">
		<div class="container mx-auto max-w-7xl">
			<div class="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
				<!-- Hero Content - Left Side (3/5) -->
				<div class="lg:col-span-3">
					<h1
						class="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6 leading-[0.95]"
					>
						Importer-exporter of
						<span class="text-blue-400">well-architected skills</span>
					</h1>

					<p class="text-2xl md:text-3xl text-slate-300 font-light leading-relaxed">
						Advanced analytics for vibecoded tech debt enjoyers.
					</p>
				</div>

				<!-- Bookshelf Bento Grid - Right Side (2/5) -->
				<div class="lg:col-span-2">
					<!-- Bookshelf Container -->
					<div class="bg-slate-900/30 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
						<div class="mb-4">
							<h2 class="text-2xl font-bold text-white mb-1">The Bookshelf</h2>
							<p class="text-sm text-slate-400">Curated skills for the discerning code architect</p>
						</div>
						<!-- Bento Grid Layout - Masonry style -->
						<div class="grid grid-cols-2 gap-2 auto-rows-[100px]">
				<!-- Featured: art-vandeley (Medium - 2x2) -->
				<div
					class="group relative col-span-2 row-span-2 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:border-blue-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 overflow-hidden hover:-translate-y-1"
				>
					<!-- Book spine effect -->
					<div
						class="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue-400 to-blue-600 opacity-60"
					></div>

					<div class="relative h-full flex flex-col">
						<div class="text-3xl mb-2 drop-shadow-lg">📚</div>

						<div
							class="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full border border-blue-400/30 inline-block mb-1.5 w-fit"
						>
							Documentation
						</div>

						<h3
							class="text-sm font-bold text-white mb-1 group-hover:text-blue-400 transition-colors"
						>
							art-vandeley
						</h3>
						<p class="text-xs text-slate-300 font-semibold mb-1">Spanish Documentation Master</p>
						<p class="text-xs text-slate-400 leading-tight line-clamp-2">
							Generate comprehensive Spanish README.md with technical diagrams
						</p>
					</div>

					<a
						href="/skills/art-vandeley"
						class="absolute inset-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						aria-label="View art-vandeley"
					></a>
				</div>

				<!-- incident-report (Small - 1x1) -->
				<div
					class="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-white/10 rounded-lg p-3 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 overflow-hidden hover:-translate-y-1"
				>
					<div class="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-purple-400 to-purple-600 opacity-60"></div>

					<div class="relative h-full flex flex-col justify-between">
						<div>
							<div class="text-2xl mb-1 drop-shadow-lg">🔍</div>
							<div
								class="text-xs px-1.5 py-0.5 bg-purple-500/20 text-purple-300 rounded-full border border-purple-400/30 inline-block mb-1 w-fit"
							>
								Debugging
							</div>
							<h3 class="text-xs font-bold text-white group-hover:text-purple-400 transition-colors">
								incident-report
							</h3>
						</div>
					</div>

					<a
						href="/skills/incident-report"
						class="absolute inset-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
						aria-label="View incident-report"
					></a>
				</div>

				<!-- session-handoff (Small - 1x1) -->
				<div
					class="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-white/10 rounded-lg p-3 hover:border-green-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 overflow-hidden hover:-translate-y-1"
				>
					<div class="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-green-400 to-green-600 opacity-60"></div>

					<div class="relative h-full flex flex-col justify-between">
						<div>
							<div class="text-2xl mb-1 drop-shadow-lg">📝</div>
							<div
								class="text-xs px-1.5 py-0.5 bg-green-500/20 text-green-300 rounded-full border border-green-400/30 inline-block mb-1 w-fit"
							>
								Productivity
							</div>
							<h3 class="text-xs font-bold text-white group-hover:text-green-400 transition-colors">
								session-handoff
							</h3>
						</div>
					</div>

					<a
						href="/skills/session-handoff"
						class="absolute inset-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
						aria-label="View session-handoff"
					></a>
				</div>

				<!-- vim-architect (Small - 1x1) -->
				<div
					class="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-white/10 rounded-lg p-3 hover:border-orange-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 overflow-hidden hover:-translate-y-1"
				>
					<div class="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-orange-400 to-orange-600 opacity-60"></div>

					<div class="relative h-full flex flex-col justify-between">
						<div>
							<div class="text-2xl mb-1 drop-shadow-lg">🎯</div>
							<div
								class="text-xs px-1.5 py-0.5 bg-orange-500/20 text-orange-300 rounded-full border border-orange-400/30 inline-block mb-1 w-fit"
							>
								Development
							</div>
							<h3 class="text-xs font-bold text-white group-hover:text-orange-400 transition-colors">
								vim-architect
							</h3>
						</div>
					</div>

					<a
						href="/skills/vim-architect"
						class="absolute inset-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
						aria-label="View vim-architect"
					></a>
				</div>

				<!-- skilled-architect (Medium horizontal - 2x1) -->
				<div
					class="group relative col-span-2 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-white/10 rounded-lg p-3 hover:border-indigo-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 overflow-hidden hover:-translate-y-1"
				>
					<div class="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-indigo-400 to-indigo-600 opacity-60"></div>

					<div class="relative h-full flex items-center gap-2">
						<div class="text-2xl drop-shadow-lg">🏗️</div>
						<div class="flex-1">
							<div
								class="text-xs px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-400/30 inline-block mb-1 w-fit"
							>
								Architecture
							</div>
							<h3 class="text-xs font-bold text-white mb-0.5 group-hover:text-indigo-400 transition-colors">
								skilled-architect
							</h3>
							<p class="text-xs text-slate-400 line-clamp-1">Production-ready docs</p>
						</div>
					</div>

					<a
						href="/skills/skilled-architect"
						class="absolute inset-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
						aria-label="View skilled-architect"
					></a>
				</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="py-20 px-6">
		<div class="container mx-auto max-w-5xl">
			<!-- Primary CTA -->
			<div class="text-center mb-16">
				<h2 class="text-4xl md:text-5xl font-bold text-white mb-6">Ready to level up?</h2>
				<p class="text-xl text-slate-400 mb-10">
					Explore our growing collection of skills and transform how you code
				</p>
				<a
					href="/skills"
					class="inline-block px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
				>
					Explore Our Skillhub
				</a>
			</div>

			<!-- Divider -->
			<div class="relative mb-16">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-slate-800"></div>
				</div>
				<div class="relative flex justify-center text-sm">
					<span class="px-4 bg-slate-950 text-slate-500">or</span>
				</div>
			</div>

			<!-- Secondary CTA - Git Log Analysis -->
			<div class="max-w-2xl mx-auto">
				<div
					class="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all"
				>
					<div class="text-center mb-6">
						<div class="inline-block p-3 bg-slate-800/50 rounded-xl mb-4">
							<span class="text-3xl">⚡</span>
						</div>
						<h3 class="text-2xl font-bold text-white mb-2">Analyze Your Codebase</h3>
						<p class="text-slate-400">
							Upload your git log and discover hidden patterns in your architecture
						</p>
					</div>

					<!-- File Upload -->
					<div class="mb-6">
						<FileUpload on:fileLoaded={handleFileLoaded} />
					</div>

					<!-- Features List -->
					<div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
						<div class="flex items-center gap-2 text-slate-400">
							<div class="w-2 h-2 rounded-full bg-red-400"></div>
							<span>Code hotspots & technical debt</span>
						</div>
						<div class="flex items-center gap-2 text-slate-400">
							<div class="w-2 h-2 rounded-full bg-blue-400"></div>
							<span>Team collaboration patterns</span>
						</div>
						<div class="flex items-center gap-2 text-slate-400">
							<div class="w-2 h-2 rounded-full bg-purple-400"></div>
							<span>Architecture health score</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</main>
