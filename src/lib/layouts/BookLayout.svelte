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
      path: '/book/chapter-2'
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
      return `${base} bg-blue-500/20 text-blue-300 font-medium`;
    }
    if (chapter.disabled) {
      return `${base} text-slate-500 cursor-not-allowed`;
    }
    return `${base} text-slate-300 hover:bg-white/10`;
  };

  const topNavBadgeClasses = (chapter) => {
    const base = 'w-6 h-6 rounded-full flex items-center justify-center text-xs';
    if (isActiveChapter(chapter)) {
      return `${base} bg-blue-400 text-blue-900`;
    }
    if (chapter.disabled) {
      return `${base} bg-slate-700 text-slate-400`;
    }
    return `${base} bg-slate-700 text-slate-300`;
  };

  const tableOfContentsClasses = (chapter) => {
    const base =
      'w-full text-left px-3 py-2 rounded-lg transition-all text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1';
    if (isActiveChapter(chapter)) {
      return `${base} bg-blue-500/20 text-blue-300 font-medium border-l-2 border-blue-400`;
    }
    if (chapter.disabled) {
      return `${base} text-slate-500 cursor-not-allowed`;
    }
    return `${base} text-slate-300 hover:bg-white/10`;
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

<div class="min-h-screen bg-slate-950 overflow-x-hidden">
  <div class="container mx-auto px-4 py-8">
    <div class="mx-auto max-w-6xl">
      <!-- Header -->
      <header class="mb-8">
        <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.35em] text-blue-400">Architecture Playbook</p>
            <h1 class="mb-2 text-3xl font-bold text-white">
              Building Well-Architected Svelte Applications
            </h1>
            <p class="text-slate-300">A practical guide to component architecture and design patterns</p>
          </div>
          <a href="/architecture" class="flex items-center gap-2 text-blue-400 transition hover:text-blue-300">
            ← Back to Architecture Hub
          </a>
        </div>

        <!-- Chapter Navigation -->
        <nav class="rounded-xl border border-white/10 bg-slate-900/70 p-4 backdrop-blur overflow-hidden">
          <div class="flex items-center gap-2 overflow-x-auto scrollbar-hidden">
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
                <span class="truncate min-w-0 flex-shrink">{chapter.title}</span>
              </button>
            {/each}
          </div>
        </nav>
      </header>

      <div class="grid grid-cols-12 gap-8">
        <!-- Table of Contents -->
        <aside class="col-span-3">
          <div class="sticky top-8">
            <div class="rounded-xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur">
              <h3 class="mb-4 font-semibold text-white">Table of Contents</h3>
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
              <div class="mt-6 border-t border-white/10 pt-6">
                <div class="mb-2 flex items-center justify-between">
                  <span class="text-sm text-slate-300">Progress</span>
                  <span class="text-sm font-medium text-white">
                    {Math.round(((currentChapterIndex + 1) / bookChapters.length) * 100)}%
                  </span>
                </div>
                <div class="h-2 w-full rounded-full bg-white/10" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(((currentChapterIndex + 1) / bookChapters.length) * 100)}>
                  <div
                    class="h-2 rounded-full bg-blue-400 transition-all duration-300"
                    style={`width: ${((currentChapterIndex + 1) / bookChapters.length) * 100}%`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="col-span-9">
          <article class="rounded-xl border border-white/10 bg-slate-900/70 p-8 backdrop-blur">
            <div
              class="prose prose-lg max-w-none prose-invert
                prose-headings:text-slate-100 prose-h1:text-slate-100 prose-h2:text-slate-100 prose-h3:text-slate-100
                prose-p:text-slate-300 prose-p:leading-relaxed prose-p:!text-slate-300
                prose-strong:text-slate-100 prose-strong:!text-slate-100
                prose-code:bg-slate-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:text-slate-300
                prose-pre:bg-slate-800 prose-pre:text-slate-300
                prose-blockquote:border-l-blue-400 prose-blockquote:bg-blue-500/10 prose-blockquote:p-4 prose-blockquote:text-slate-300
                prose-ul:text-slate-300 prose-ol:text-slate-300 prose-ul:!text-slate-300 prose-ol:!text-slate-300
                prose-li:text-slate-300 prose-li:!text-slate-300
                [&>*]:text-slate-300 [&_p]:!text-slate-300 [&_h1]:!text-slate-100 [&_h2]:!text-slate-100 [&_h3]:!text-slate-100 [&_li]:!text-slate-300"
            >
              {@render children()}
            </div>

            <!-- Chapter Navigation -->
            <footer class="mt-12 border-t border-white/10 pt-8">
              <div class="flex flex-wrap items-center justify-between gap-4">
                {#if prevChapter}
                  <button
                    type="button"
                    class="flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3 text-slate-200 transition-colors hover:bg-white/20"
                    onclick={() => navigateToChapter(prevChapter)}
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    <div class="text-left">
                      <div class="text-xs text-slate-400">Previous</div>
                      <div class="font-medium text-white">{prevChapter?.title}</div>
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
