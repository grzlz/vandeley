<script>
	// Single responsibility: Display user role badge
	let {
		role,
		variant = 'default',
		...restProps
	} = $props();

	const roleConfig = {
		admin: {
			label: 'Admin',
			color: 'bg-red-100 text-red-800 border-red-200'
		},
		moderator: {
			label: 'Moderator',
			color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
		},
		user: {
			label: 'User',
			color: 'bg-green-100 text-green-800 border-green-200'
		},
		guest: {
			label: 'Guest',
			color: 'bg-gray-100 text-gray-800 border-gray-200'
		}
	};

	const config = $derived(() => roleConfig[role] || roleConfig.user);

	const badgeClasses = $derived(() => {
		const base = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border';
		return `${base} ${config.color}`;
	});
</script>

{#if role}
	<span class={badgeClasses} {...restProps}>
		{config.label}
	</span>
{/if}