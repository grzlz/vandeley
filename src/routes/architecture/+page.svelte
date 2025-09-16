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
			practical: true
		},
		{
			title: 'Clean Architecture',
			authors: 'Robert C. Martin',
			description: "A craftsman's guide to software structure and design",
			rating: 4.3,
			practical: true
		},
		{
			title: 'Software Architecture: The Hard Parts',
			authors: 'Neal Ford, Mark Richards, Pramod Sadalage, Zhamak Dehghani',
			description: 'Modern trade-off analyses for distributed architectures',
			rating: 4.4,
			practical: false
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

	<nav class="relative z-20 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl">
		<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
			<div class="flex items-center gap-4">
				<img src="/logo.png" alt="Vandeley Logo" class="h-8 w-8" />
				<div class="text-sm">
					<div class="text-base font-semibold tracking-tight text-white">vandeley.art</div>
					<div class="text-[0.65rem] font-medium tracking-[0.4em] text-slate-300 uppercase">
						Git Analytics
					</div>
				</div>
			</div>

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

	<section class="relative z-10 py-24">
		<div class="mx-auto grid max-w-6xl items-center gap-16 px-6 lg:grid-cols-[1.1fr_0.9fr]">
			<div class="space-y-10">
				<div
					class="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-blue-100/90"
				>
					<span class="h-2 w-2 rounded-full bg-blue-300"></span>
					Software Architecture Program
				</div>

				<div class="space-y-6">
					<h1 class="text-4xl font-bold tracking-tight text-white md:text-6xl">
						Build well-architected Svelte systems with confidence
					</h1>
					<p class="max-w-2xl text-lg leading-relaxed text-slate-200">
						Dive into an immersive learning experience that blends interactive chapters,
						architectural frameworks, and expert commentary. Develop intuition for designing
						resilient, scalable applications.
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

				<div class="grid gap-4 sm:grid-cols-3">
					{#each heroHighlights as highlight}
						<div class="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
							<div class="text-2xl">{highlight.icon}</div>
							<h3 class="mt-3 text-base font-semibold text-white">{highlight.title}</h3>
							<p class="mt-2 text-sm text-slate-200/80">{highlight.description}</p>
						</div>
					{/each}
				</div>
			</div>

			<Card
				variant="elevated"
				shadow="xl"
				class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 px-8 py-10 text-left text-white"
			>
				<div
					class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.28),_transparent_60%)] opacity-60"
				></div>
				<div class="relative space-y-6">
					<div
						class="inline-flex items-center gap-3 rounded-full bg-white/15 px-4 py-2 text-sm font-medium"
					>
						<span class="text-xl">📚</span>
						Guided chapter series
					</div>
					<h2 class="text-3xl leading-tight font-semibold">
						Building Well-Architected Svelte Applications
					</h2>
					<p class="text-base text-white/85">
						A comprehensive, interactive guide to component architecture, design patterns, and best
						practices. Learn by reading and building.
					</p>
					<ul class="space-y-3 text-sm text-white/80">
						<li class="flex items-start gap-3">
							<span class="mt-1 h-1.5 w-1.5 rounded-full bg-white"></span>
							Component-driven patterns for scalable UI systems.
						</li>
						<li class="flex items-start gap-3">
							<span class="mt-1 h-1.5 w-1.5 rounded-full bg-white"></span>
							Architectural decision frameworks with real project examples.
						</li>
						<li class="flex items-start gap-3">
							<span class="mt-1 h-1.5 w-1.5 rounded-full bg-white"></span>
							Downloadable checklists and interactive sandboxes.
						</li>
					</ul>
					<Button
						variant="secondary"
						size="lg"
						onclick={startReading}
						class="bg-white px-6 py-3 text-base font-semibold text-blue-600 hover:bg-blue-50 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-slate-950"
					>
						Start Chapter 1
					</Button>
					<div class="text-sm text-white/70">Free • Interactive examples • 3 chapters</div>
				</div>
			</Card>
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
					<Card
						variant="elevated"
						shadow="lg"
						hover={!path.disabled}
						class={`group relative h-full overflow-hidden border border-white/10 bg-slate-900/70 px-7 py-8 text-left transition-colors duration-300 ${
							path.disabled
								? 'opacity-60 saturate-75'
								: 'hover:border-white/20 hover:bg-slate-900/90'
						}`}
					>
						<div class="flex h-full flex-col gap-6">
							<div class="flex items-start justify-between gap-4">
								<div class="flex items-start gap-4">
									<div
										class="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-3xl"
									>
										{path.icon}
									</div>
									<div>
										<h3 class="text-xl font-semibold text-white">{path.title}</h3>
										<p class="mt-1 text-sm text-slate-300">{path.description}</p>
									</div>
								</div>
								{#if path.disabled}
									<span
										class="rounded-full bg-white/5 px-3 py-1 text-xs font-medium tracking-[0.2em] text-slate-400 uppercase"
									>
										Soon
									</span>
								{:else}
									<span
										class="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium tracking-[0.2em] text-blue-200 uppercase"
									>
										Active
									</span>
								{/if}
							</div>

							<div>
								<div class="mb-2 flex items-center justify-between text-xs text-slate-300">
									<span>Progress</span>
									<span>{path.progress}/{path.chapters} chapters</span>
								</div>
								<div class="h-2 w-full overflow-hidden rounded-full bg-white/10">
									<div
										class="h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-300"
										style={`width: ${(path.progress / path.chapters) * 100}%`}
									></div>
								</div>
							</div>

							{#if path.disabled}
								<p class="text-sm leading-relaxed text-slate-400">
									Get notified when this path goes live with deep dives and hands-on labs.
								</p>
							{:else}
								<p class="text-sm leading-relaxed text-slate-200">
									Jump back into your workbook to continue building architectural instincts and
									patterns.
								</p>
							{/if}

							<div class="mt-auto">
								{#if path.disabled}
									<div class="text-xs font-medium tracking-[0.4em] text-slate-500 uppercase">
										In development
									</div>
								{:else}
									<Button
										variant="secondary"
										size="sm"
										onclick={path.action}
										class="bg-blue-500/20 px-4 py-2 text-xs font-semibold tracking-[0.2em] text-blue-100 uppercase hover:bg-blue-500/30 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-slate-950"
									>
										{path.progress === 0 ? 'Start learning' : 'Continue'}
									</Button>
								{/if}
							</div>
						</div>
					</Card>
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
					<Card
						variant="glass"
						shadow="lg"
						class="h-full bg-white/90 px-7 py-8 text-left text-slate-900 backdrop-blur"
					>
						<div class="flex h-full flex-col gap-5">
							<div>
								<h3 class="text-xl font-semibold text-slate-900">{book.title}</h3>
								<p class="mt-1 text-sm font-medium text-slate-600">by {book.authors}</p>
							</div>

							<p class="text-sm leading-relaxed text-slate-700">{book.description}</p>

							<div class="mt-auto flex items-center justify-between pt-4 text-sm text-slate-600">
								<div class="flex items-center gap-2">
									<div class="flex text-lg text-amber-500">
										{#each Array(5) as _, i}
											<span>{i < Math.floor(book.rating) ? '★' : '☆'}</span>
										{/each}
									</div>
									<span class="font-medium">{book.rating.toFixed(1)}</span>
								</div>
								{#if book.practical}
									<span
										class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700"
									>
										Practical playbook
									</span>
								{:else}
									<span
										class="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700"
									>
										Strategic insights
									</span>
								{/if}
							</div>
						</div>
					</Card>
				{/each}
			</div>
		</div>
	</section>
</main>
