<script>
	let {
		title,
		description,
		code,
		component,
		children
	} = $props();

	let showCode = $state(false);
</script>

<div class="interactive-example my-8 border border-gray-200 rounded-xl overflow-hidden">
	<!-- Header -->
	<div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
		<div class="flex items-center justify-between">
			<div>
				<h4 class="font-semibold text-gray-900">{title}</h4>
				{#if description}
					<p class="text-sm text-gray-600 mt-1">{description}</p>
				{/if}
			</div>
			<button
				onclick={() => showCode = !showCode}
				class="text-sm text-blue-600 hover:text-blue-800 font-medium"
			>
				{showCode ? 'Hide Code' : 'Show Code'}
			</button>
		</div>
	</div>

	<!-- Live Example -->
	<div class="p-6 bg-white">
		<div class="border border-dashed border-gray-300 rounded-lg p-6">
			{#if component}
				{@render component()}
			{:else if children}
				{@render children()}
			{:else}
				<p class="text-gray-500 italic">No example provided</p>
			{/if}
		</div>
	</div>

	<!-- Code Display -->
	{#if showCode && code}
		<div class="border-t border-gray-200">
			<pre class="bg-gray-900 text-gray-100 p-6 overflow-x-auto text-sm"><code>{code}</code></pre>
		</div>
	{/if}
</div>