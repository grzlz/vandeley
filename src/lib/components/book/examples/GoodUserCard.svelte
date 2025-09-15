<script>
	// Well-architected component with clear responsibilities
	import Avatar from './Avatar.svelte';
	import UserBadge from './UserBadge.svelte';
	import ActionButtons from './ActionButtons.svelte';

	let {
		user,
		variant = 'default',
		size = 'md',
		children,
		actions,
		onclick = () => {},
		...restProps
	} = $props();

	// Single responsibility: UI composition and layout
	const cardClasses = $derived(() => {
		const base = 'user-card rounded-lg border transition-all duration-200';
		const variants = {
			default: 'border-gray-200 bg-white hover:shadow-md',
			compact: 'border-gray-200 bg-white p-4',
			highlighted: 'border-blue-200 bg-blue-50 hover:bg-blue-100'
		};
		const sizes = {
			sm: 'p-4',
			md: 'p-6',
			lg: 'p-8'
		};
		return `${base} ${variants[variant]} ${sizes[size]}`;
	});

	function handleClick() {
		onclick(user);
	}
</script>

{#if onclick}
<button
	class={cardClasses}
	onclick={handleClick}
	{...restProps}
>
	<div class="flex items-center gap-4">
		<Avatar user={user} size={size} />

		<div class="flex-1 min-w-0">
			<div class="flex items-center gap-2 mb-1">
				<h3 class="font-semibold text-gray-900 truncate">{user.name}</h3>
				<UserBadge role={user.role} />
			</div>

			{#if user.email}
				<p class="text-sm text-gray-600 truncate">{user.email}</p>
			{/if}

			{#if children}
				<div class="mt-2">
					{@render children({ user })}
				</div>
			{/if}
		</div>

		{#if actions}
			<ActionButtons {user} {actions} />
		{/if}
	</div>
</button>
{:else}
<div
	class={cardClasses}
	{...restProps}
>
	<div class="flex items-center gap-4">
		<Avatar user={user} size={size} />

		<div class="flex-1 min-w-0">
			<div class="flex items-center gap-2 mb-1">
				<h3 class="font-semibold text-gray-900 truncate">{user.name}</h3>
				<UserBadge role={user.role} />
			</div>

			{#if user.email}
				<p class="text-sm text-gray-600 truncate">{user.email}</p>
			{/if}

			{#if children}
				<div class="mt-2">
					{@render children({ user })}
				</div>
			{/if}
		</div>

		{#if actions}
			<ActionButtons {user} {actions} />
		{/if}
	</div>
</div>
{/if}

<style>
	.user-card {
		cursor: default;
	}

	.user-card[role="button"] {
		cursor: pointer;
	}

	.user-card[role="button"]:focus-visible {
		outline: 2px solid #3b82f6;
		outline-offset: 2px;
	}
</style>