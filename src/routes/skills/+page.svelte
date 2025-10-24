<script>
	let selectedCategory = $state('all');

	const skills = [
		{
			id: 'art-vandeley',
			name: 'art-vandeley',
			tagline: 'Spanish Documentation Master',
			description:
				'Generate comprehensive Spanish README.md with technical diagrams (architecture, sequence, ERD, class diagrams) for open source projects. Perfect for making your repos accessible to Spanish-speaking developers.',
			icon: '📚',
			category: 'Documentation',
			installs: 1200,
			rating: 4.9,
			author: 'skillhub',
			featured: true
		},
		{
			id: 'incident-report',
			name: 'incident-report',
			tagline: 'Bug Investigation Expert',
			description:
				'Systematically investigates and documents codebase issues with root cause analysis, multiple solution proposals, and comprehensive reporting. Essential for maintaining high code quality.',
			icon: '🔍',
			category: 'Debugging',
			installs: 850,
			rating: 4.8,
			author: 'skillhub',
			featured: true
		},
		{
			id: 'session-handoff',
			name: 'session-handoff',
			tagline: 'Session Memory Manager',
			description:
				'Creates efficient session handoff documentation with conversation summary, changes made, and next steps. Never lose context between coding sessions.',
			icon: '📝',
			category: 'Productivity',
			installs: 920,
			rating: 4.7,
			author: 'skillhub',
			featured: true
		},
		{
			id: 'vim-architect',
			name: 'vim-architect',
			tagline: 'Code Navigation Optimizer',
			description:
				'Optimize files for LazyVim navigation by adding modelines and intelligent fold markers. Makes large codebases navigable with native vim fold commands.',
			icon: '🎯',
			category: 'Development',
			installs: 680,
			rating: 4.6,
			author: 'skillhub',
			featured: true
		},
		{
			id: 'skilled-architect',
			name: 'skilled-architect',
			tagline: 'Architecture Documentation',
			description:
				'Generate production-ready technical documentation with complete diagram suites (system architecture, sequence flows, class diagrams) for architecture-focused projects.',
			icon: '🏗️',
			category: 'Architecture',
			installs: 540,
			rating: 4.8,
			author: 'skillhub',
			featured: false
		}
	];

	const categories = ['all', 'Documentation', 'Debugging', 'Productivity', 'Development', 'Architecture'];

	const filteredSkills = $derived(
		selectedCategory === 'all'
			? skills
			: skills.filter((skill) => skill.category === selectedCategory)
	);
</script>

<div class="min-h-screen bg-slate-950 text-white pt-24 pb-20 px-6">
	<div class="mx-auto max-w-7xl">
		<!-- Header -->
		<div class="mb-12">
			<h1 class="text-4xl md:text-5xl font-bold mb-4">Browse Skills</h1>
			<p class="text-lg text-slate-400 max-w-2xl">
				Discover installable AI agent skills that extend Claude Code with specialized capabilities.
				Install directly to your workflow.
			</p>
		</div>

		<!-- Category Filter -->
		<div class="flex flex-wrap gap-2 mb-12">
			{#each categories as category}
				<button
					onclick={() => (selectedCategory = category)}
					class="px-4 py-2 rounded-full text-sm font-medium transition-all {selectedCategory ===
					category
						? 'bg-blue-500 text-white'
						: 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white'}"
				>
					{category === 'all' ? 'All Skills' : category}
				</button>
			{/each}
		</div>

		<!-- Skills Grid -->
		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each filteredSkills as skill}
				<article
					class="group relative bg-slate-900/50 border border-white/5 rounded-xl p-6 hover:border-white/20 transition-all hover:scale-[1.02]"
				>
					<!-- Featured Badge -->
					{#if skill.featured}
						<div
							class="absolute top-4 right-4 px-2 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold rounded-full"
						>
							FEATURED
						</div>
					{/if}

					<div class="flex items-start justify-between mb-4">
						<div class="text-5xl">{skill.icon}</div>
						<span
							class="text-xs px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20"
						>
							{skill.category}
						</span>
					</div>

					<h2 class="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
						{skill.name}
					</h2>
					<p class="text-sm text-slate-400 mb-2 font-medium">{skill.tagline}</p>
					<p class="text-sm text-slate-500 mb-6 line-clamp-3">{skill.description}</p>

					<div class="flex items-center justify-between text-xs text-slate-500 mb-4">
						<span class="flex items-center gap-1">
							⭐ {skill.rating} ({skill.installs.toLocaleString()})
						</span>
						<span class="text-slate-600">by {skill.author}</span>
					</div>

					<!-- Install Button -->
					<button
						class="w-full py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-medium rounded-lg transition-colors border border-blue-500/20 hover:border-blue-500/40"
					>
						View Details
					</button>

					<a
						href="/skills/{skill.id}"
						class="absolute inset-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
						aria-label="View {skill.name}"
					></a>
				</article>
			{/each}
		</div>

		<!-- Empty State -->
		{#if filteredSkills.length === 0}
			<div class="text-center py-20">
				<div class="text-6xl mb-4">🔍</div>
				<h3 class="text-xl font-bold mb-2">No skills found</h3>
				<p class="text-slate-400">Try selecting a different category</p>
			</div>
		{/if}

		<!-- Bottom CTA -->
		<div class="mt-20 text-center border-t border-white/5 pt-12">
			<h3 class="text-2xl font-bold mb-4">Want to create your own skill?</h3>
			<p class="text-slate-400 mb-6 max-w-2xl mx-auto">
				Turn your expertise into an installable skill. Share your knowledge with the community and
				build your reputation.
			</p>
			<button
				class="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all"
			>
				Create a Skill (Coming Soon)
			</button>
		</div>
	</div>
</div>
