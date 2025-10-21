<script>
  import MonolithDashboard from './composition/MonolithDashboard.svelte';
  import ComponentizedDashboard from './composition/ComponentizedDashboard.svelte';
  import ContextDashboard from './composition/ContextDashboard.svelte';

  const stageViews = {
    monolith: MonolithDashboard,
    components: ComponentizedDashboard,
    context: ContextDashboard
  };

  const stages = [
    {
      id: 'monolith',
      emoji: '🏗️',
      label: 'Monolithic Dashboard',
      summary:
        'Initial implementation: a single component owns fetching, state, layout and rendering. Great for fast starts, painful for iteration.',
      painPoints: [
        'Mixed responsibilities make regressions likely.',
        'Adding metrics means touching unrelated layout code.',
        'No way to reuse parts of the dashboard elsewhere.'
      ],
      wins: [],
      code: String.raw`<script>
  let loading = $state(true);
  let metrics = $state({ revenue: 0, users: 0, conversion: 0, bounce: 0 });
  let chartData = $state([]);
  let tableData = $state([]);

  // fetch + transform + render all live here…
<\/script>`
    },
    {
      id: 'components',
      emoji: '🧱',
      label: 'Componentized View Layer',
      summary:
        'Split the monolith into presentational widgets. The parent still orchestrates state, but markup lives in focused components.',
      painPoints: [
        'State and data shaping still sit in the container.',
        'Widgets rely on parent props, so composition is manual.'
      ],
      wins: [
        'Metric, chart and table markup isolated for reuse.',
        'Clear prop contracts through JSDoc types.',
        'Visual changes no longer risk data logic.'
      ],
      code: String.raw`<script>
  import MetricSummary from './MetricSummary.svelte';
  import PerformanceChart from './PerformanceChart.svelte';
  import ActivityTable from './ActivityTable.svelte';

  /** @type {DashboardMetrics} */
  let metrics = $state(fetchMetrics());
<\/script>

<MetricSummary {metrics} {loading} />
<PerformanceChart data={chartData} />
<ActivityTable rows={tableData} />`
    },
    {
      id: 'context',
      emoji: '🌐',
      label: 'Context-driven Composition',
      summary:
        'Lift data orchestration into a provider. Widgets subscribe to shared context and trigger refreshes without prop drilling.',
      painPoints: [
        'Requires a lightweight data layer (stores or context).'
      ],
      wins: [
        'Any component can read dashboard state via context.',
        'Layout shells can swap in different widget sets.',
        'Refresh logic lives in one place.'
      ],
      code: String.raw`<script>
  import DashboardProvider from './context/DashboardProvider.svelte';
  import MetricSummary from './MetricSummary.svelte';
<\/script>

<DashboardProvider let:dashboard>
  <MetricSummary metrics={dashboard.metrics} />
  <button onclick={() => dashboard.refresh()}>Refresh</button>
</DashboardProvider>`
    }
  ];

  let activeStage = $state(stages[0].id);
  let showCode = $state(false);

  const currentStage = $derived(stages.find((stage) => stage.id === activeStage) ?? stages[0]);
  const StageComponent = $derived(stageViews[currentStage.id] ?? MonolithDashboard);

  function selectStage(id) {
    activeStage = id;
    showCode = false;
  }
</script>

<section class="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden">
  <header class="px-8 pt-8 pb-6 bg-gradient-to-br from-slate-800 to-slate-900 border-b border-slate-700">
    <span class="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wide rounded-full border border-blue-500/30">Composition evolution</span>
    <h3 class="text-2xl font-bold text-slate-100 mt-4 mb-2 leading-tight">From monolith to composable dashboard</h3>
    <p class="text-slate-400 text-base leading-relaxed max-w-4xl">Track how we peel responsibilities apart over three deliberate iterations.</p>
  </header>

  <div class="flex flex-wrap items-center gap-3 px-8 py-6 bg-slate-800/50 border-b border-slate-700">
    {#each stages as stage}
      <button
        type="button"
        class="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all {activeStage === stage.id ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 border border-slate-600 hover:bg-slate-600 hover:border-slate-500 hover:text-slate-200'}"
        onclick={() => selectStage(stage.id)}
        aria-pressed={activeStage === stage.id}
      >
        <span class="text-base" aria-hidden="true">{stage.emoji}</span>
        <span class="whitespace-nowrap">{stage.label}</span>
      </button>
    {/each}

    <button
      type="button"
      class="ml-auto flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all {showCode ? 'bg-slate-800 border-blue-500 text-blue-400' : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-300'} border"
      onclick={() => (showCode = !showCode)}
    >
      <span aria-hidden="true">{'</>'}</span>
      <span>{showCode ? 'Hide code' : 'Show code'}</span>
    </button>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 min-h-[460px]">
    <div class="p-8 bg-slate-800/30 border-b lg:border-b-0 lg:border-r border-slate-700">
      <div class="h-full flex flex-col gap-6">
        <div class="flex items-start gap-4">
          <span class="text-4xl leading-none" aria-hidden="true">{currentStage.emoji}</span>
          <div class="flex-1">
            <h4 class="text-xl font-bold text-slate-100 mb-2">{currentStage.label}</h4>
            <p class="text-slate-400 text-base leading-relaxed">{currentStage.summary}</p>
          </div>
        </div>

        {#if currentStage.painPoints?.length}
          <div>
            <h5 class="text-sm font-semibold uppercase tracking-wide text-red-300 mb-3">Trade-offs</h5>
            <ul class="space-y-2">
              {#each currentStage.painPoints as pain}
                <li class="flex items-start gap-3 text-sm leading-relaxed text-slate-300">
                  <span class="text-red-500 font-bold text-base leading-none mt-0.5" aria-hidden="true">×</span>
                  <span>{pain}</span>
                </li>
              {/each}
            </ul>
          </div>
        {/if}

        {#if currentStage.wins?.length}
          <div>
            <h5 class="text-sm font-semibold uppercase tracking-wide text-emerald-300 mb-3">What we gain</h5>
            <ul class="space-y-2">
              {#each currentStage.wins as win}
                <li class="flex items-start gap-3 text-sm leading-relaxed text-slate-300">
                  <span class="text-emerald-500 font-bold text-base leading-none mt-0.5" aria-hidden="true">✓</span>
                  <span>{win}</span>
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      </div>
    </div>

    <div class="bg-slate-900">
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-700">
        <h5 class="text-sm font-semibold text-slate-200">Live dashboard example</h5>
        <span class="text-xs text-slate-500 bg-slate-700 px-2 py-1 rounded">{currentStage.id}</span>
      </div>

      <div class="p-6 overflow-x-auto">
        <StageComponent />
      </div>
    </div>
  </div>

  {#if showCode}
    <div class="bg-slate-900 border-t border-slate-700">
      <pre class="px-6 py-6 overflow-x-auto overflow-y-auto max-h-[32rem] bg-slate-950 text-slate-200 text-sm leading-relaxed font-mono whitespace-pre">{currentStage.code}</pre>
    </div>
  {/if}
</section>
