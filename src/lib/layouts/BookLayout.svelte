<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  let { children } = $props();

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

  const isActiveChapter = (chapter) => $page.url.pathname === chapter.path;

  const topNavClasses = (chapter) => {
    const base =
      'flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1';
    if (isActiveChapter(chapter)) {
      return `${base} bg-blue-100 text-blue-700 font-medium`;
    }
    if (chapter.disabled) {
      return `${base} text-gray-400 cursor-not-allowed`;
    }
    return `${base} text-gray-600 hover:bg-gray-100`;
  };

  const topNavBadgeClasses = (chapter) => {
    const base = 'w-6 h-6 rounded-full flex items-center justify-center text-xs';
    if (isActiveChapter(chapter)) {
      return `${base} bg-blue-200 text-blue-800`;
    }
    if (chapter.disabled) {
      return `${base} bg-gray-200 text-gray-500`;
    }
    return `${base} bg-gray-200 text-gray-600`;
  };

  const tableOfContentsClasses = (chapter) => {
    const base =
      'w-full text-left px-3 py-2 rounded-lg transition-all text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1';
    if (isActiveChapter(chapter)) {
      return `${base} bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-500`;
    }
    if (chapter.disabled) {
      return `${base} text-gray-400 cursor-not-allowed`;
    }
    return `${base} text-gray-600 hover:bg-gray-50`;
  };

  const currentChapterIndex = $derived(() => {
    return bookChapters.findIndex((chapter) => $page.url.pathname === chapter.path);
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
    <div class="mx-auto max-w-6xl">
      <!-- Header -->
      <header class="mb-8">
        <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.35em] text-blue-600">Architecture Playbook</p>
            <h1 class="mb-2 text-3xl font-bold text-gray-900">
              Building Well-Architected Svelte Applications
            </h1>
            <p class="text-gray-600">A practical guide to component architecture and design patterns</p>
          </div>
          <a href="/architecture" class="flex items-center gap-2 text-blue-600 transition hover:text-blue-800">
            ← Back to Architecture Hub
          </a>
        </div>

        <!-- Chapter Navigation -->
        <nav class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div class="flex items-center gap-2 overflow-x-auto">
            {#each bookChapters as chapter, index}
              <button
                type="button"
                class={topNavClasses(chapter)}
                onclick={() => navigateToChapter(chapter)}
                disabled={chapter.disabled}
                aria-current={isActiveChapter(chapter) ? 'page' : undefined}
                aria-disabled={chapter.disabled ? 'true' : undefined}
              >
                <span class={topNavBadgeClasses(chapter)} aria-hidden="true">{index + 1}</span>
                <span class="truncate">{chapter.title}</span>
              </button>
            {/each}
          </div>
        </nav>
      </header>

      <div class="grid grid-cols-12 gap-8">
        <!-- Table of Contents -->
        <aside class="col-span-3">
          <div class="sticky top-8">
            <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 class="mb-4 font-semibold text-gray-900">Table of Contents</h3>
              <nav class="space-y-2">
                {#each bookChapters as chapter, index}
                  <button
                    type="button"
                    class={tableOfContentsClasses(chapter)}
                    onclick={() => navigateToChapter(chapter)}
                    disabled={chapter.disabled}
                    aria-current={isActiveChapter(chapter) ? 'page' : undefined}
                    aria-disabled={chapter.disabled ? 'true' : undefined}
                  >
                    <div class="flex items-center gap-2">
                      <span class="text-xs">{index + 1}.</span>
                      <span class="truncate">{chapter.title}</span>
                    </div>
                  </button>
                {/each}
              </nav>

              <!-- Reading Progress -->
              <div class="mt-6 border-t border-gray-200 pt-6">
                <div class="mb-2 flex items-center justify-between">
                  <span class="text-sm text-gray-600">Progress</span>
                  <span class="text-sm font-medium text-gray-900">
                    {Math.round(((currentChapterIndex + 1) / bookChapters.length) * 100)}%
                  </span>
                </div>
                <div class="h-2 w-full rounded-full bg-gray-200" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(((currentChapterIndex + 1) / bookChapters.length) * 100)}>
                  <div
                    class="h-2 rounded-full bg-blue-500 transition-all duration-300"
                    style={`width: ${((currentChapterIndex + 1) / bookChapters.length) * 100}%`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="col-span-9">
          <article class="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <div
              class="prose prose-lg max-w-none
                prose-headings:text-gray-900
                prose-p:text-gray-700 prose-p:leading-relaxed
                prose-strong:text-gray-900
                prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                prose-pre:bg-gray-900 prose-pre:text-gray-100
                prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:p-4
                prose-ul:text-gray-700 prose-ol:text-gray-700"
            >
              {@render children()}
            </div>

            <!-- Chapter Navigation -->
            <footer class="mt-12 border-t border-gray-200 pt-8">
              <div class="flex flex-wrap items-center justify-between gap-4">
                {#if prevChapter}
                  <button
                    type="button"
                    class="flex items-center gap-2 rounded-xl bg-gray-100 px-6 py-3 transition-colors hover:bg-gray-200"
                    onclick={() => navigateToChapter(prevChapter)}
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    <div class="text-left">
                      <div class="text-xs text-gray-500">Previous</div>
                      <div class="font-medium">{prevChapter.title}</div>
                    </div>
                  </button>
                {:else}
                  <span></span>
                {/if}

                {#if nextChapter && !nextChapter.disabled}
                  <button
                    type="button"
                    class="flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3 text-white transition-colors hover:bg-blue-600"
                    onclick={() => navigateToChapter(nextChapter)}
                  >
                    <div class="text-right">
                      <div class="text-xs text-blue-100">Next</div>
                      <div class="font-medium">{nextChapter.title}</div>
                    </div>
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
