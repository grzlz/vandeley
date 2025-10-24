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
	<!-- Hero Section with Upload Panel -->
	<section class="pt-32 pb-16 px-6">
		<div class="container mx-auto">
			<!-- Hero + Demo Layout -->
			<div class="grid grid-cols-1 lg:grid-cols-5 gap-16 items-center mb-16">
				<!-- Hero Content - Left Side (3/5) -->
				<div class="lg:col-span-3">
					<h1
						class="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-8 leading-[0.9]"
					>
						Importer-exporter of
						<span class="text-blue-400">well-architected skills</span>
					</h1>

					<p class="text-2xl md:text-3xl text-slate-300 mb-8 font-light leading-relaxed">
						Advanced analytics for vibecoded tech debt enjoyers.
					</p>
				</div>

				<!-- Interactive Demo Playground - Right Side (2/5) -->
				<div class="lg:col-span-2">
					<div
						class="relative bg-slate-900/30 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-slate-900/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
					>
						<!-- Glassy background layers -->
						<div
							class="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-indigo-500/10"
						></div>
						<div class="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>

						<!-- Subtle animated glow -->
						<div
							class="absolute -top-10 -right-10 w-20 h-20 bg-blue-500/20 rounded-full blur-2xl animate-pulse"
						></div>
						<div
							class="absolute -bottom-10 -left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-2xl animate-pulse"
							style="animation-delay: 1.5s;"
						></div>

						<!-- Demo header with horizontal layout -->
						<div class="relative z-10 flex items-center gap-4 mb-6">
							<div class="relative flex-shrink-0">
								<!-- Animated background glow -->
								<div
									class="absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-xl animate-pulse"
								></div>
								<!-- Icon container with glassy effect -->
								<div
									class="relative w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg"
								>
									<span class="text-blue-400 text-2xl font-bold filter drop-shadow-lg">⚡</span>
								</div>
							</div>

							<div class="flex-1 min-w-0">
								<h3 class="text-xl font-bold text-white tracking-tight mb-2">Try it out</h3>
								<p class="text-sm text-slate-300 font-medium leading-relaxed mb-3">
									Upload your git log and watch your codebase come alive
								</p>
								<div class="flex items-center gap-3 text-xs text-slate-400">
									<div class="flex items-center gap-1">
										<div
											class="w-1.5 h-1.5 rounded-full bg-green-400 shadow-sm shadow-green-400/50"
										></div>
										<span>Runs locally</span>
									</div>
									<div class="flex items-center gap-1">
										<div
											class="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400/50"
										></div>
										<span>No servers</span>
									</div>
								</div>
							</div>
						</div>

						<!-- Enhanced file upload area -->
						<div class="relative z-10 mb-4">
							<FileUpload on:fileLoaded={handleFileLoaded} />
						</div>

						<!-- Demo features preview -->
						<div class="relative z-10">
							<div class="bg-slate-800/50 rounded-2xl p-4 border border-white/10">
								<h4 class="font-semibold text-white text-sm mb-3">What you'll discover:</h4>
								<div class="grid grid-cols-1 gap-2">
									<div class="flex items-center gap-2">
										<div class="w-2 h-2 rounded-full bg-red-400"></div>
										<span class="text-xs text-slate-300">Code hotspots & technical debt</span>
									</div>
									<div class="flex items-center gap-2">
										<div class="w-2 h-2 rounded-full bg-blue-400"></div>
										<span class="text-xs text-slate-300">Team collaboration patterns</span>
									</div>
									<div class="flex items-center gap-2">
										<div class="w-2 h-2 rounded-full bg-purple-400"></div>
										<span class="text-xs text-slate-300">Architecture health score</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Skills Library Section -->
	<section class="py-20 px-6 bg-slate-900/30">
		<div class="container mx-auto max-w-7xl">
			<div class="text-center mb-12">
				<h2 class="text-4xl md:text-5xl font-bold text-white mb-4">Skills Library</h2>
				<p class="text-lg text-slate-400">
					Installable AI agent skills for Claude Code, crafted by experts
				</p>
			</div>

			<!-- Masonry-like Grid -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto">
				{#each featuredSkills as skill, i}
					<div
						class="group relative bg-slate-900/50 border border-white/5 rounded-xl p-6 hover:border-blue-500/30 transition-all hover:scale-[1.02] {i ===
						0
							? 'md:row-span-2'
							: ''}"
					>
						<div class="text-5xl mb-4">{skill.icon}</div>

						<div
							class="text-xs px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20 inline-block mb-3"
						>
							{skill.category}
						</div>

						<h3 class="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
							{skill.name}
						</h3>
						<p class="text-sm text-slate-400 font-medium mb-2">{skill.tagline}</p>
						<p class="text-sm text-slate-500 {i === 0 ? '' : 'line-clamp-2'}">
							{skill.description}
						</p>

						<a
							href="/skills/{skill.id}"
							class="absolute inset-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
							aria-label="View {skill.name}"
						></a>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="py-20 px-6">
		<div class="container mx-auto max-w-4xl text-center">
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
	</section>
</main>
