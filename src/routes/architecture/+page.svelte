<script>
	import { goto } from '$app/navigation';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	// Navigate to the book
	function startReading() {
		goto('/book/chapter-1');
	}

	// Architecture learning resources
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
			description: 'A craftsman\'s guide to software structure and design',
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
</script>

<svelte:head>
	<title>Architecture Learning Hub | Vandeley Analytics</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
	<div class="container mx-auto px-4 py-12">
		<div class="max-w-6xl mx-auto">
			<!-- Header -->
			<header class="text-center mb-12">
				<h1 class="text-4xl font-bold text-gray-900 mb-4">
					Software Architecture Learning Hub
				</h1>
				<p class="text-xl text-gray-600 max-w-3xl mx-auto">
					Master the principles of software architecture through practical Svelte examples and proven patterns.
					Transform your development skills with hands-on learning.
				</p>
			</header>

			<!-- Interactive Book Section -->
			<section class="mb-16">
				<Card variant="elevated" shadow="lg" class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
					<div class="text-center py-12">
						<div class="text-6xl mb-6">📚</div>
						<h2 class="text-3xl font-bold mb-4">
							Building Well-Architected Svelte Applications
						</h2>
						<p class="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
							A comprehensive, interactive guide to component architecture, design patterns,
							and best practices. Learn by reading and building.
						</p>
						<Button
							variant="secondary"
							size="lg"
							onclick={startReading}
							class="bg-white text-blue-600 hover:bg-blue-50"
						>
							Start Reading - Chapter 1: Component Architecture
						</Button>
						<div class="mt-4 text-blue-200 text-sm">
							Free • Interactive Examples • 3 Chapters
						</div>
					</div>
				</Card>
			</section>

			<!-- Learning Paths -->
			<section class="mb-16">
				<h2 class="text-2xl font-bold text-gray-900 mb-8">Learning Paths</h2>
				<div class="grid md:grid-cols-3 gap-6">
					{#each learningPaths as path}
						<Card
							variant="default"
							shadow="sm"
							hover={!path.disabled}
							onclick={path.disabled ? undefined : path.action}
							class={path.disabled ? 'opacity-60' : ''}
						>
							<div class="text-center">
								<div class="text-4xl mb-4">{path.icon}</div>
								<h3 class="text-xl font-semibold text-gray-900 mb-2">{path.title}</h3>
								<p class="text-gray-600 mb-4">{path.description}</p>

								<!-- Progress Bar -->
								<div class="mb-4">
									<div class="flex justify-between text-sm text-gray-500 mb-1">
										<span>Progress</span>
										<span>{path.progress}/{path.chapters} chapters</span>
									</div>
									<div class="w-full bg-gray-200 rounded-full h-2">
										<div
											class="bg-blue-500 h-2 rounded-full transition-all duration-300"
											style="width: {(path.progress / path.chapters) * 100}%"
										></div>
									</div>
								</div>

								{#if path.disabled}
									<div class="text-sm text-gray-500 italic">Coming Soon</div>
								{:else}
									<Button variant="primary" size="sm" onclick={path.action}>
										{path.progress === 0 ? 'Start Learning' : 'Continue'}
									</Button>
								{/if}
							</div>
						</Card>
					{/each}
				</div>
			</section>

			<!-- Recommended Books -->
			<section class="mb-16">
				<h2 class="text-2xl font-bold text-gray-900 mb-8">Recommended Architecture Books</h2>
				<div class="grid md:grid-cols-3 gap-6">
					{#each architectureBooks as book}
						<Card variant="default" shadow="sm">
							<div class="mb-4">
								<h3 class="font-semibold text-gray-900 mb-1">{book.title}</h3>
								<p class="text-sm text-gray-600 mb-2">by {book.authors}</p>

								<!-- Rating -->
								<div class="flex items-center gap-2 mb-3">
									<div class="flex">
										{#each Array(5) as _, i}
											<span class="text-yellow-400">
												{i < Math.floor(book.rating) ? '★' : '☆'}
											</span>
										{/each}
									</div>
									<span class="text-sm text-gray-600">{book.rating}</span>
									{#if book.practical}
										<span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
											Practical
										</span>
									{/if}
								</div>
							</div>

							<p class="text-sm text-gray-700">{book.description}</p>
						</Card>
					{/each}
				</div>
			</section>

			<!-- Quick Access -->
			<section>
				<h2 class="text-2xl font-bold text-gray-900 mb-8">Quick Access</h2>
				<div class="grid md:grid-cols-2 gap-6">
					<Card variant="default" shadow="sm">
						<div class="text-center">
							<div class="text-3xl mb-4">🧩</div>
							<h3 class="text-lg font-semibold text-gray-900 mb-2">Component Library</h3>
							<p class="text-gray-600 mb-4">
								Explore our collection of well-architected Svelte components with live examples.
							</p>
							<Button
								variant="secondary"
								onclick={() => goto('/architecture/components')}
							>
								View Components
							</Button>
						</div>
					</Card>

					<Card variant="default" shadow="sm">
						<div class="text-center">
							<div class="text-3xl mb-4">📊</div>
							<h3 class="text-lg font-semibold text-gray-900 mb-2">Architecture Analysis</h3>
							<p class="text-gray-600 mb-4">
								Analyze your git repository for architectural insights and patterns.
							</p>
							<Button
								variant="secondary"
								onclick={() => goto('/')}
							>
								Analyze Repository
							</Button>
						</div>
					</Card>
				</div>
			</section>
		</div>
	</div>
</div>