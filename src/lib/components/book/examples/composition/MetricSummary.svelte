<script>
  /** @typedef {import('$lib/types/dashboard').DashboardMetrics} DashboardMetrics */

  let { metrics, loading = false } = $props();
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {#if loading}
    {#each Array(4) as _, index}
      <div class="bg-slate-800 p-6 rounded-lg border border-slate-700 animate-pulse" aria-busy="true">
        <div class="h-4 w-24 bg-slate-700 rounded mb-3"></div>
        <div class="h-6 w-32 bg-slate-700 rounded"></div>
      </div>
    {/each}
  {:else if metrics}
    <div class="bg-slate-800 p-6 rounded-lg border border-slate-700">
      <h3 class="text-sm text-slate-400 font-medium mb-2 uppercase tracking-wider">Revenue</h3>
      <span class="text-2xl font-bold text-slate-100">${metrics.revenue.toLocaleString()}</span>
    </div>
    <div class="bg-slate-800 p-6 rounded-lg border border-slate-700">
      <h3 class="text-sm text-slate-400 font-medium mb-2 uppercase tracking-wider">Active Users</h3>
      <span class="text-2xl font-bold text-slate-100">{metrics.users.toLocaleString()}</span>
    </div>
    <div class="bg-slate-800 p-6 rounded-lg border border-slate-700">
      <h3 class="text-sm text-slate-400 font-medium mb-2 uppercase tracking-wider">Conversion Rate</h3>
      <span class="text-2xl font-bold text-slate-100">{metrics.conversion}%</span>
    </div>
    <div class="bg-slate-800 p-6 rounded-lg border border-slate-700">
      <h3 class="text-sm text-slate-400 font-medium mb-2 uppercase tracking-wider">Bounce Rate</h3>
      <span class="text-2xl font-bold text-slate-100">{metrics.bounce}%</span>
    </div>
  {/if}
</div>
