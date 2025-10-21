<script>
  /** @typedef {import('$lib/types/dashboard').ActivityRow} ActivityRow */

  let { rows = [], loading = false } = $props();
</script>

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
      {#if loading}
        {#each Array(5) as _, index}
          <tr class="animate-pulse">
            <td class="px-4 py-3 border-b border-slate-700">
              <div class="h-4 w-24 bg-slate-700 rounded"></div>
            </td>
            <td class="px-4 py-3 border-b border-slate-700">
              <div class="h-4 w-20 bg-slate-700 rounded"></div>
            </td>
            <td class="px-4 py-3 border-b border-slate-700">
              <div class="h-4 w-20 bg-slate-700 rounded"></div>
            </td>
          </tr>
        {/each}
      {:else if rows.length}
        {#each rows as row}
          <tr class="hover:bg-slate-700/30 transition-colors">
            <td class="px-4 py-3 text-slate-200 border-b border-slate-700 last:border-b-0">{row.date}</td>
            <td class="px-4 py-3 text-slate-200 border-b border-slate-700 last:border-b-0">{row.visitors.toLocaleString()}</td>
            <td class="px-4 py-3 text-slate-200 border-b border-slate-700 last:border-b-0">${row.revenue.toLocaleString()}</td>
          </tr>
        {/each}
      {:else}
        <tr>
          <td colspan="3" class="px-4 py-6 text-center text-slate-500">No activity recorded.</td>
        </tr>
      {/if}
    </tbody>
  </table>
</div>
