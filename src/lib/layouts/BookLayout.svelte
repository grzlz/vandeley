<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let { children } = $props();

	// Book navigation structure
	const bookChapters = [
		{
			id: 'chapter-1',
			title: 'Component Architecture Fundamentals',
			path: '/book/chapter-1'
		},
		{
			id: 'chapter-2',
			title: 'State Management Patterns',
			path: '/book/chapter-2',
			disabled: true
		},
		{
			id: 'chapter-3',
			title: 'Advanced Composition',
			path: '/book/chapter-3',
			disabled: true
		}
	];

	const currentChapterIndex = $derived(() => {
		return bookChapters.findIndex(chapter => $page.url.pathname === chapter.path);
	});

	const currentChapter = $derived(() => {
		return bookChapters[currentChapterIndex] || bookChapters[0];
	});

	const nextChapter = $derived(() => {
		const nextIndex = currentChapterIndex + 1;
		return nextIndex < bookChapters.length ? bookChapters[nextIndex] : null;
	});

	const prevChapter = $derived(() => {
		const prevIndex = currentChapterIndex - 1;
		return prevIndex >= 0 ? bookChapters[prevIndex] : null;
	});

	function navigateToChapter(chapter) {
		if (!chapter.disabled) {
			goto(chapter.path);
		}
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
	<div class="container mx-auto px-4 py-8">
		<div class="max-w-6xl mx-auto">
			<!-- Header -->
			<header class="mb-8">
				<div class="flex items-center justify-between mb-6">
					<div>
						<h1 class="text-3xl font-bold text-gray-900 mb-2">
							Building Well-Architected Svelte Applications
						</h1>
						<p class="text-gray-600">A practical guide to component architecture and design patterns</p>
					</div>
					<a
						href="/architecture"
						class="text-blue-600 hover:text-blue-800 flex items-center gap-2"
					>
						← Back to Architecture Hub
					</a>
				</div>

				<!-- Chapter Navigation -->
				<nav class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
					<div class="flex items-center gap-4 overflow-x-auto">
						{#each bookChapters as chapter, index}
							<button
								onclick={() => navigateToChapter(chapter)}
								class="flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap
									{$page.url.pathname === chapter.path
										? 'bg-blue-100 text-blue-700 font-medium'
										: chapter.disabled
											? 'text-gray-400 cursor-not-allowed'
											: 'text-gray-600 hover:bg-gray-100'}"
								disabled={chapter.disabled}
							>
								<span class="w-6 h-6 rounded-full flex items-center justify-center text-xs
									{$page.url.pathname === chapter.path
										? 'bg-blue-200 text-blue-800'
										: chapter.disabled
											? 'bg-gray-200 text-gray-500'
											: 'bg-gray-200 text-gray-600'}">
									{index + 1}
								</span>
								{chapter.title}
							</button>
						{/each}
					</div>
				</nav>
			</header>

			<div class="grid grid-cols-12 gap-8">
				<!-- Table of Contents -->
				<aside class="col-span-3">
					<div class="sticky top-8">
						<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
							<h3 class="font-semibold text-gray-900 mb-4">Table of Contents</h3>
							<nav class="space-y-2">
								{#each bookChapters as chapter, index}
									<button
										onclick={() => navigateToChapter(chapter)}
										class="w-full text-left px-3 py-2 rounded-lg transition-all text-sm
											{$page.url.pathname === chapter.path
												? 'bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-500'
												: chapter.disabled
													? 'text-gray-400 cursor-not-allowed'
													: 'text-gray-600 hover:bg-gray-50'}"
										disabled={chapter.disabled}
									>
										<div class="flex items-center gap-2">
											<span class="text-xs">{index + 1}.</span>
											{chapter.title}
										</div>
									</button>
								{/each}
							</nav>

							<!-- Reading Progress -->
							<div class="mt-6 pt-6 border-t border-gray-200">
								<div class="flex items-center justify-between mb-2">
									<span class="text-sm text-gray-600">Progress</span>
									<span class="text-sm font-medium text-gray-900">
										{Math.round(((currentChapterIndex + 1) / bookChapters.length) * 100)}%
									</span>
								</div>
								<div class="w-full bg-gray-200 rounded-full h-2">
									<div
										class="bg-blue-500 h-2 rounded-full transition-all duration-300"
										style="width: {((currentChapterIndex + 1) / bookChapters.length) * 100}%"
									></div>
								</div>
							</div>
						</div>
					</div>
				</aside>

				<!-- Main Content -->
				<main class="col-span-9">
					<article class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
						<div class="prose prose-lg max-w-none
							prose-headings:text-gray-900
							prose-p:text-gray-700 prose-p:leading-relaxed
							prose-strong:text-gray-900
							prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
							prose-pre:bg-gray-900 prose-pre:text-gray-100
							prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:p-4
							prose-ul:text-gray-700 prose-ol:text-gray-700">
							{@render children()}
						</div>

						<!-- Chapter Navigation -->
						<footer class="mt-12 pt-8 border-t border-gray-200">
							<div class="flex items-center justify-between">
								{#if prevChapter}
									<button
										onclick={() => navigateToChapter(prevChapter)}
										class="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
									>
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
										</svg>
										<div class="text-left">
											<div class="text-xs text-gray-500">Previous</div>
											<div class="font-medium">{prevChapter.title}</div>
										</div>
									</button>
								{:else}
									<div></div>
								{/if}

								{#if nextChapter && !nextChapter.disabled}
									<button
										onclick={() => navigateToChapter(nextChapter)}
										class="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors"
									>
										<div class="text-right">
											<div class="text-xs text-blue-100">Next</div>
											<div class="font-medium">{nextChapter.title}</div>
										</div>
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
										</svg>
									</button>
								{/if}
							</div>
						</footer>
					</article>
				</main>
			</div>
		</div>
	</div>
</div>