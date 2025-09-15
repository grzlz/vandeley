<script>
	// Single responsibility: Handle user action buttons
	import Button from '../../ui/Button.svelte';

	let {
		user,
		actions,
		size = 'sm',
		variant = 'secondary',
		...restProps
	} = $props();

	let isLoading = $state(false);

	async function handleAction(action) {
		if (isLoading || !action.handler) return;

		isLoading = true;
		try {
			await action.handler(user);
		} catch (error) {
			console.error('Action failed:', error);
		} finally {
			isLoading = false;
		}
	}
</script>

{#if actions && actions.length > 0}
	<div class="flex items-center gap-2" {...restProps}>
		{#each actions as action}
			<Button
				{variant}
				{size}
				disabled={isLoading || action.disabled}
				loading={isLoading}
				onclick={() => handleAction(action)}
				title={action.tooltip}
			>
				{#if action.icon}
					<span class="mr-1">{action.icon}</span>
				{/if}
				{action.label}
			</Button>
		{/each}
	</div>
{/if}