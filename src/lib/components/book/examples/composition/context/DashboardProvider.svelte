<script>
  import { setContext } from 'svelte';

  /** @typedef {import('$lib/types/dashboard').DashboardMetrics} DashboardMetrics */
  /** @typedef {import('$lib/types/dashboard').TrendPoint} TrendPoint */
  /** @typedef {import('$lib/types/dashboard').ActivityRow} ActivityRow */

  let { children } = $props();

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

  function generateSample() {
    return {
      metrics: {
        revenue: 125420 + Math.floor(Math.random() * 2000 - 1000),
        users: 8800 + Math.floor(Math.random() * 400),
        conversion: +(3 + Math.random() * 1.2).toFixed(1),
        bounce: +(40 + Math.random() * 4 - 2).toFixed(1)
      },
      chart: Array.from({ length: 12 }, (_, index) => ({
        x: index,
        y: 20 + Math.random() * 60
      })),
      table: [
        { date: '2024-01-15', visitors: 1250, revenue: 2340 },
        { date: '2024-01-14', visitors: 1180, revenue: 2120 },
        { date: '2024-01-13', visitors: 1340, revenue: 2680 },
        { date: '2024-01-12', visitors: 1420, revenue: 2890 },
        { date: '2024-01-11', visitors: 1180, revenue: 2240 }
      ]
    };
  }

  function loadData() {
    loading = true;
    return new Promise((resolve) => {
      setTimeout(() => {
        const sample = generateSample();
        metrics = sample.metrics;
        chartData = sample.chart;
        tableData = sample.table;
        loading = false;
        resolve();
      }, 600);
    });
  }

  const dashboard = {
    get loading() {
      return loading;
    },
    get metrics() {
      return metrics;
    },
    get chartData() {
      return chartData;
    },
    get tableData() {
      return tableData;
    },
    refresh: () => loadData()
  };

  setContext('dashboard', dashboard);
  loadData();
</script>

{@render children?.({ dashboard })}
