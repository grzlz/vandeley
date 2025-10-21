<script>
  import MetricSummary from './MetricSummary.svelte';
  import PerformanceChart from './PerformanceChart.svelte';
  import ActivityTable from './ActivityTable.svelte';

  /** @typedef {import('$lib/types/dashboard').DashboardMetrics} DashboardMetrics */
  /** @typedef {import('$lib/types/dashboard').TrendPoint} TrendPoint */
  /** @typedef {import('$lib/types/dashboard').ActivityRow} ActivityRow */

  let loading = $state(true);
  /** @type {DashboardMetrics} */
  let metrics = $state({
    revenue: 0,
    users: 0,
    conversion: 0,
    bounce: 0
  });
  /** @type {TrendPoint[]} */
  let chartData = $state([]);
  /** @type {ActivityRow[]} */
  let tableData = $state([]);

  function loadSample() {
    loading = true;
    setTimeout(() => {
      metrics = {
        revenue: 125420,
        users: 8932,
        conversion: 3.4,
        bounce: 42
      };
      chartData = Array.from({ length: 12 }, (_, index) => ({
        x: index,
        y: 20 + Math.random() * 60
      }));
      tableData = [
        { date: '2024-01-15', visitors: 1250, revenue: 2340 },
        { date: '2024-01-14', visitors: 1180, revenue: 2120 },
        { date: '2024-01-13', visitors: 1340, revenue: 2680 },
        { date: '2024-01-12', visitors: 1420, revenue: 2890 },
        { date: '2024-01-11', visitors: 1180, revenue: 2240 }
      ];
      loading = false;
    }, 800);
  }

  loadSample();
</script>

<div class="min-h-96 space-y-8 bg-slate-900 rounded-xl border border-slate-700 p-6">
  <MetricSummary {metrics} {loading} />
  <PerformanceChart data={chartData} {loading} title="Revenue Trends" />
  <ActivityTable rows={tableData} {loading} />
</div>
