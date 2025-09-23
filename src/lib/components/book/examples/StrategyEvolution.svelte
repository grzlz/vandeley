<script>
  import { stages } from './strategy/codeExamples.js';

  const stageIndex = new Map(stages.map((stage) => [stage.id, stage]));

  let activeStage = $state(stages[0].id);
  let showCode = $state(false);

  const currentStage = $derived(stageIndex.get(activeStage) ?? stages[0]);

  const stageList = stages;

  function selectStage(id) {
    activeStage = id;
  }


  function toggleCode() {
    showCode = !showCode;
  }
</script>

<section class="space-y-8">
  <header class="space-y-3">
    <span class="text-xs font-semibold uppercase tracking-[0.35em] text-blue-500">Strategy evolution</span>
    <h3 class="text-2xl font-semibold text-white">Feel the difference as behaviour becomes a strategy</h3>
    <p class="max-w-3xl text-sm text-slate-300 md:text-base">
      Toggle between scenarios and implementations to see how small conditional tweaks compound into accidental complexity,
      and how the Strategy pattern restores focus and experimentation headroom.
    </p>
  </header>

  <div class="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4">
    <div class="inline-flex items-center gap-1 sm:gap-2 rounded-full bg-slate-900/70 p-1 shadow-inner border border-white/10 w-full sm:w-auto overflow-x-auto">
      {#each stageList as stage}
        <button
          type="button"
          class={
            activeStage === stage.id
              ? 'inline-flex items-center gap-1 sm:gap-2 rounded-full bg-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-slate-900 shadow whitespace-nowrap'
              : 'inline-flex items-center gap-1 sm:gap-2 rounded-full px-3 sm:px-4 py-2 text-xs sm:text-sm text-slate-300 hover:text-white transition-colors whitespace-nowrap'
          }
          onclick={() => selectStage(stage.id)}
          aria-pressed={activeStage === stage.id}
        >
          <span class="text-sm sm:text-base">{stage.emoji}</span>
          <span class="hidden sm:inline">{stage.label}</span>
          <span class="sm:hidden">{stage.id}</span>
        </button>
      {/each}
    </div>


    <button
      type="button"
      class={
        showCode
          ? 'inline-flex items-center gap-2 rounded-lg bg-blue-500/20 px-3 py-2 text-sm font-medium text-blue-200 hover:bg-blue-500/30'
          : 'inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700'
      }
      onclick={toggleCode}
    >
      <span aria-hidden="true">{'</>'}</span>
      <span>{showCode ? 'Hide code' : 'Show code'}</span>
    </button>
  </div>

  <div class="grid gap-6 lg:grid-cols-12">
    <aside class="lg:col-span-12 space-y-4">
      <div class="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
        <div class="flex items-start gap-3">
          <span class="text-3xl">{currentStage.emoji}</span>
          <div class="space-y-2">
            <h4 class="text-lg font-semibold text-white">{currentStage.label}</h4>
            <p class="text-sm text-slate-300">{currentStage.summary}</p>
          </div>
        </div>

        {#if currentStage.painPoints}
          <div class="mt-5 space-y-2">
            <span class="text-xs font-semibold uppercase tracking-[0.35em] text-red-300">Pain points</span>
            <ul class="space-y-2 text-sm text-slate-300">
              {#each currentStage.painPoints as point}
                <li class="flex items-start gap-2">
                  <span aria-hidden="true">–</span>
                  <span>{point}</span>
                </li>
              {/each}
            </ul>
          </div>
        {/if}

        {#if currentStage.wins}
          <div class="mt-5 space-y-2">
            <span class="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">Why it works</span>
            <ul class="space-y-2 text-sm text-slate-300">
              {#each currentStage.wins as win}
                <li class="flex items-start gap-2">
                  <span aria-hidden="true">+</span>
                  <span>{win}</span>
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      </div>

    </aside>
  </div>
  {#if showCode}
    <div class="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
      <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-[0.35em] text-blue-300">Implementation sketch</span>
          <span class="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">{currentStage.id}</span>
        </div>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-xs text-slate-200 hover:bg-slate-700"
          onclick={toggleCode}
        >
          <span aria-hidden="true">×</span>
          <span>Hide</span>
        </button>
      </div>
      <pre class="max-h-[32rem] overflow-y-auto overflow-x-auto rounded-xl bg-slate-950/80 p-4 text-xs sm:text-sm leading-relaxed text-slate-200"><code class="whitespace-pre-wrap break-words">{currentStage.code}</code></pre>
    </div>
  {/if}
</section>