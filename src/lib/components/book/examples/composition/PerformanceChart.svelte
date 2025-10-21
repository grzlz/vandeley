<script>
  /** @typedef {import('$lib/types/dashboard').TrendPoint} TrendPoint */

  let { data = [], loading = false, title = 'Performance Chart' } = $props();

  /**
   * @param {TrendPoint[]} series
   */
  function buildRenderData(series) {
    if (!Array.isArray(series) || series.length === 0) {
      return [];
    }
    const max = Math.max(...series.map(point => point.y || 0)) || 1;
    return series.map((point, index) => {
      const x = 8 + (index / Math.max(1, series.length - 1)) * 84;
      const y = 45 - ((point.y || 0) / max) * 35;
      return { x, y };
    });
  }

  const chartPoints = $derived(buildRenderData(data));
</script>

<div class="bg-slate-800 border border-slate-700 rounded-lg p-6">
  <div class="flex items-center justify-between mb-4">
    <h2 class="text-slate-100 text-lg font-semibold">{title}</h2>
    {#if loading}
      <span class="text-xs text-slate-500 uppercase tracking-wide">Loading…</span>
    {/if}
  </div>

  <div class="h-48">
    {#if loading}
      <div class="w-full h-full flex items-center justify-center">
        <div class="w-8 h-8 border-3 border-slate-700 border-t-blue-500 rounded-full animate-spin" aria-label="Loading chart"></div>
      </div>
    {:else if chartPoints.length}
      <svg viewBox="0 0 100 50" class="w-full h-full">
        {#each chartPoints as point, index}
          <circle cx={point.x} cy={point.y} r="0.8" fill="#3b82f6" />
          {#if index < chartPoints.length - 1}
            <line
              x1={point.x}
              y1={point.y}
              x2={chartPoints[index + 1].x}
              y2={chartPoints[index + 1].y}
              stroke="#3b82f6"
              stroke-width="0.3"
            />
          {/if}
        {/each}
      </svg>
    {:else}
      <div class="w-full h-full flex items-center justify-center text-slate-500 text-sm">
        No data available.
      </div>
    {/if}
  </div>
</div>
