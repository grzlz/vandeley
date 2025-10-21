<script>
  let loading = $state(true);
  let metrics = $state({
    revenue: 0,
    users: 0,
    conversion: 0,
    bounce: 0
  });
  let chartData = $state([]);
  let tableData = $state([]);

  // Simulate data loading
  setTimeout(() => {
    metrics = {
      revenue: 125420,
      users: 8932,
      conversion: 3.4,
      bounce: 42
    };
    chartData = Array.from({ length: 12 }, (_, i) => ({
      x: i,
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
</script>

<div class="min-h-96 p-6 bg-slate-900 rounded-xl border border-slate-700">
  {#if loading}
    <div class="flex flex-col items-center justify-center h-72 gap-4 text-slate-400">
      <div class="w-8 h-8 border-3 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
      <p>Loading dashboard...</p>
    </div>
  {:else}
    <!-- Everything mixed together in one component -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
    </div>

    <div class="mb-8">
      <h2 class="text-slate-100 text-lg font-semibold mb-4">Performance Chart</h2>
      <div class="bg-slate-800 border border-slate-700 rounded-lg p-6 h-48">
        <svg viewBox="0 0 100 50" class="w-full h-full">
          {#each chartData as point, i}
            <circle
              cx={8 + (i / (chartData.length - 1)) * 84}
              cy={45 - (point.y / 100) * 35}
              r="0.8"
              fill="#3b82f6"
            />
            {#if i < chartData.length - 1}
              <line
                x1={8 + (i / (chartData.length - 1)) * 84}
                y1={45 - (point.y / 100) * 35}
                x2={8 + ((i + 1) / (chartData.length - 1)) * 84}
                y2={45 - (chartData[i + 1].y / 100) * 35}
                stroke="#3b82f6"
                stroke-width="0.3"
              />
            {/if}
          {/each}
        </svg>
      </div>
    </div>

    <div>
      <h2 class="text-slate-100 text-lg font-semibold mb-4">Data Table</h2>
      <div class="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        <table class="w-full border-collapse">
          <thead>
            <tr>
              <th class="bg-slate-900 text-slate-400 px-4 py-3 text-left font-semibold text-sm uppercase tracking-wide border-b border-slate-700">Date</th>
              <th class="bg-slate-900 text-slate-400 px-4 py-3 text-left font-semibold text-sm uppercase tracking-wide border-b border-slate-700">Visitors</th>
              <th class="bg-slate-900 text-slate-400 px-4 py-3 text-left font-semibold text-sm uppercase tracking-wide border-b border-slate-700">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {#each tableData as row}
              <tr class="hover:bg-slate-700/30 transition-colors">
                <td class="px-4 py-3 text-slate-200 border-b border-slate-700 last:border-b-0">{row.date}</td>
                <td class="px-4 py-3 text-slate-200 border-b border-slate-700 last:border-b-0">{row.visitors.toLocaleString()}</td>
                <td class="px-4 py-3 text-slate-200 border-b border-slate-700 last:border-b-0">${row.revenue.toLocaleString()}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div>

