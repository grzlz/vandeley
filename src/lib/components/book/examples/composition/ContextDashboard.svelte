<script>
  import DashboardProvider from './context/DashboardProvider.svelte';
  import MetricSummary from './MetricSummary.svelte';
  import PerformanceChart from './PerformanceChart.svelte';
  import ActivityTable from './ActivityTable.svelte';
</script>

<DashboardProvider let:dashboard>
  <div class="min-h-96 bg-slate-900 rounded-xl border border-slate-700 p-6 space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-slate-100">Context connected dashboard</h2>
        <p class="text-sm text-slate-400">Widgets subscribe to shared dashboard state.</p>
      </div>
      <button
        class="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-500 transition-colors disabled:opacity-60"
        onclick={() => dashboard.refresh()}
        disabled={dashboard.loading}
        type="button"
      >
        {dashboard.loading ? 'Refreshing…' : 'Refresh data'}
      </button>
    </div>

    <MetricSummary metrics={dashboard.metrics} loading={dashboard.loading} />
    <PerformanceChart data={dashboard.chartData} loading={dashboard.loading} title="Revenue Trends" />
    <ActivityTable rows={dashboard.tableData} loading={dashboard.loading} />
  </div>
</DashboardProvider>
