<script>
	import { goto } from '$app/navigation';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	function startReading() {
		goto('/book/chapter-1');
	}

	const learningPaths = [
		{
			title: 'Component Architecture',
			description: 'Master the art of building scalable, maintainable Svelte components',
			icon: '🏗️',
			progress: 0,
			chapters: 3,
			action: startReading
		},
		{
			title: 'State Management',
			description: 'Learn advanced patterns for managing application state',
			icon: '🔄',
			progress: 0,
			chapters: 4,
			disabled: true
		},
		{
			title: 'Performance Optimization',
			description: 'Optimize your Svelte apps for maximum performance',
			icon: '⚡',
			progress: 0,
			chapters: 3,
			disabled: true
		}
	];

	const architectureBooks = [
		{
			title: 'Fundamentals of Software Architecture',
			authors: 'Mark Richards & Neal Ford',
			description: 'An engineering approach to software architecture',
			rating: 4.5,
			practical: true,
			url: 'https://mrce.in/ebooks/Software-Fundamentals%20of%20Software%20Architecture.pdf'
		},
		{
			title: 'Clean Architecture',
			authors: 'Robert C. Martin',
			description: "A craftsman's guide to software structure and design",
			rating: 4.3,
			practical: true,
			url: 'https://agorism.dev/book/software-architecture/%28Robert%20C.%20Martin%20Series%29%20Robert%20C.%20Martin%20-%20Clean%20Architecture_%20A%20Craftsman%E2%80%99s%20Guide%20to%20Software%20Structure%20and%20Design-Prentice%20Hall%20%282017%29.pdf'
		},
		{
			title: 'Software Architecture: The Hard Parts',
			authors: 'Neal Ford, Mark Richards, Pramod Sadalage, Zhamak Dehghani',
			description: 'Modern trade-off analyses for distributed architectures',
			rating: 4.4,
			practical: false,
			url: 'https://dl.ebooksworld.ir/books/Software.Architecture.The.Hard.Parts.Neal.Ford.OReilly.9781492086895.EBooksWorld.ir.pdf'
		}
	];

	const heroHighlights = [
		{
			title: 'Interactive chapters',
			description: 'Work through guided architecture scenarios with runnable Svelte code.',
			icon: '🎯'
		},
		{
			title: 'Real-world patterns',
			description: 'Translate proven architecture practices into component-driven UI systems.',
			icon: '🧠'
		},
		{
			title: 'Applied assessments',
			description: 'Score your architecture decisions with structured review checklists.',
			icon: '📈'
		}
	];

	function scrollToPaths() {
		if (typeof document === 'undefined') return;

		const section = document.getElementById('learning-paths');
		section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
</script>

<svelte:head>
	<title>Architecture Learning Hub | Vandeley Analytics</title>
</svelte:head>

<main class="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
	<div class="pointer-events-none absolute inset-0 -z-10 bg-slate-950">
		<div class="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-blue-600/30 blur-3xl"></div>
		<div
			class="absolute top-1/3 right-[-8rem] h-96 w-96 rounded-full bg-indigo-500/25 blur-[140px]"
		></div>
		<div
			class="absolute bottom-[-10rem] left-1/3 h-[26rem] w-[26rem] rounded-full bg-purple-600/20 blur-[160px]"
		></div>
	</div>

	<nav class="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
		<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
			<a href="/" class="flex items-center gap-4 hover:opacity-80 transition">
				<img src="/logo.png" alt="Vandeley Logo" class="h-8 w-8" />
				<div class="text-sm">
					<div class="text-base font-semibold tracking-tight text-white">vandeley.art</div>
					<div class="text-[0.65rem] font-medium tracking-[0.4em] text-slate-300 uppercase">
						Git Analytics
					</div>
				</div>
			</a>

			<div class="flex items-center gap-4 text-sm font-medium">
				<a
					href="/"
					class="rounded-full border border-white/10 px-4 py-2 text-slate-200 transition hover:border-white/30 hover:text-white"
				>
					Analytics Home
				</a>
				<span class="rounded-full bg-white px-4 py-2 text-slate-900 shadow-sm"
					>Architecture Hub</span
				>
			</div>
		</div>
	</nav>

	<section class="relative z-10 pt-32 pb-24">
		<div class="mx-auto max-w-6xl px-6">
			<div class="grid lg:grid-cols-[1.2fr_0.8fr] gap-16 items-center">
				<div class="space-y-8">
					<div class="space-y-6">
						<h1 class="text-4xl font-bold tracking-tight text-white md:text-6xl">
							Build well-architected Svelte systems with confidence
						</h1>
						<p class="text-xl leading-relaxed text-slate-200 max-w-lg">
							Master component architecture through interactive chapters and expert guidance.
						</p>
					</div>

					<div class="flex flex-wrap items-center gap-4">
						<Button
							variant="primary"
							size="lg"
							onclick={startReading}
							class="px-8 py-3 text-base font-semibold shadow-lg shadow-blue-500/30 hover:bg-blue-400 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-950"
						>
							Start the interactive book
						</Button>
						<button
							type="button"
							class="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-100 transition duration-200 hover:bg-white/10 focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-slate-950 focus:outline-none"
							onclick={scrollToPaths}
						>
							Explore learning paths
							<span aria-hidden="true">→</span>
						</button>
					</div>
				</div>

				<div class="relative">
					<div class="rounded-2xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur">
						<div class="space-y-4">
							<div class="flex items-center gap-3">
								<div class="h-3 w-3 rounded-full bg-red-400"></div>
								<div class="h-3 w-3 rounded-full bg-yellow-400"></div>
								<div class="h-3 w-3 rounded-full bg-green-400"></div>
								<span class="ml-auto text-xs text-slate-400">Component.svelte</span>
							</div>
							<div class="space-y-2 text-sm font-mono">
								<div class="text-blue-300">{'<script>'}</div>
								<div class="text-slate-300 pl-4">let <span class="text-yellow-300">props</span> = $props();</div>
								<div class="text-slate-300 pl-4">let <span class="text-yellow-300">state</span> = $state(0);</div>
								<div class="text-blue-300">{'</script>'}</div>
								<div class="mt-4 text-blue-300">{'<button'}</div>
								<div class="text-slate-300 pl-4">onclick={'{() => state++}'}</div>
								<div class="text-blue-300">{'>'}</div>
								<div class="text-slate-300 pl-4">Count: {'{state}'}</div>
								<div class="text-blue-300">{'</button>'}</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="mt-20 grid gap-6 sm:grid-cols-3">
				{#each heroHighlights as highlight}
					<div class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur hover:bg-white/10 transition-colors">
						<div class="text-3xl mb-4">{highlight.icon}</div>
						<h3 class="text-lg font-semibold text-white mb-3">{highlight.title}</h3>
						<p class="text-sm text-slate-200/80 leading-relaxed">{highlight.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section id="learning-paths" class="relative z-10 border-t border-white/5 bg-slate-950/40 py-20">
		<div class="mx-auto max-w-6xl px-6">
			<div class="flex flex-col gap-4 pb-10 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<span class="text-sm font-semibold tracking-[0.35em] text-blue-200/80 uppercase"
						>Structured Curriculum</span
					>
					<h2 class="mt-3 text-3xl font-semibold text-white md:text-4xl">
						Learning paths for modern architecture practice
					</h2>
				</div>
				<p class="max-w-xl text-sm leading-relaxed text-slate-300">
					Chart a deliberate journey from foundational component patterns to high-impact systems
					thinking. Each path layers guidance, exercises, and self-assessment to sharpen your craft.
				</p>
			</div>

			<div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
				{#each learningPaths as path}
					<div
						class={`group relative rounded-2xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur transition-all duration-300 ${
							path.disabled
								? 'opacity-60'
								: 'hover:border-white/20 hover:bg-slate-900/90'
						}`}
					>
						<div class="space-y-6">
							<div class="flex items-start gap-4">
								<div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/20 text-2xl">
									{path.icon}
								</div>
								<div class="flex-1">
									<div class="flex items-start justify-between">
										<h3 class="text-lg font-semibold text-white">{path.title}</h3>
										{#if path.disabled}
											<span class="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-slate-400 uppercase">
												Soon
											</span>
										{:else}
											<span class="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-200 uppercase">
												Active
											</span>
										{/if}
									</div>
									<p class="mt-2 text-sm text-slate-300 leading-relaxed">{path.description}</p>
								</div>
							</div>

							<div class="space-y-3">
								<div class="flex items-center justify-between text-xs text-slate-300">
									<span>Progress</span>
									<span>{path.progress}/{path.chapters} chapters</span>
								</div>
								<div class="h-2 overflow-hidden rounded-full bg-white/10">
									<div
										class="h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-300"
										style={`width: ${(path.progress / path.chapters) * 100}%`}
									></div>
								</div>
							</div>

							{#if path.disabled}
								<p class="text-sm text-slate-400 leading-relaxed">
									Get notified when this path goes live with comprehensive guides and hands-on exercises.
								</p>
								<div class="text-xs font-medium text-slate-500 uppercase tracking-wider">
									In development
								</div>
							{:else}
								<p class="text-sm text-slate-200 leading-relaxed">
									Continue building architectural expertise with guided examples and real-world patterns.
								</p>
								<Button
									variant="secondary"
									size="sm"
									onclick={path.action}
									class="w-full bg-blue-500/20 px-4 py-2 text-sm font-medium text-blue-100 hover:bg-blue-500/30"
								>
									{path.progress === 0 ? 'Start Learning' : 'Continue'}
								</Button>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="relative z-10 py-20">
		<div class="mx-auto max-w-6xl px-6">
			<div class="flex flex-col gap-4 pb-10 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<span class="text-sm font-semibold tracking-[0.35em] text-blue-200/80 uppercase"
						>Deep Dives</span
					>
					<h2 class="mt-3 text-3xl font-semibold text-white md:text-4xl">
						Recommended architecture books
					</h2>
				</div>
				<p class="max-w-xl text-sm leading-relaxed text-slate-300">
					Curated reading to complement your practice. These titles pair conceptual clarity with
					practical guidance for evolving software systems.
				</p>
			</div>

			<div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
				{#each architectureBooks as book}
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
								<div class="flex items-center gap-2">
									<div class="flex text-amber-500">
										{#each Array(5) as _, i}
											<span class="text-sm">{i < Math.floor(book.rating) ? '★' : '☆'}</span>
										{/each}
									</div>
									<span class="text-sm font-medium text-slate-700">{book.rating.toFixed(1)}</span>
								</div>
								<div class="flex items-center gap-2">
									{#if book.practical}
										<span class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
											Practical
										</span>
									{:else}
										<span class="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
											Strategic
										</span>
									{/if}
									<svg class="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
									</svg>
								</div>
							</div>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</section>
</main>
