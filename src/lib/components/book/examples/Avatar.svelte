<script>
	// Single responsibility: Display user avatar with fallback
	let {
		user,
		size = 'md',
		onclick = () => {},
		...restProps
	} = $props();

	const sizeClasses = {
		sm: 'w-8 h-8',
		md: 'w-12 h-12',
		lg: 'w-16 h-16'
	};

	const fallbackClasses = $derived(() => {
		const base = 'rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium';
		const textSizes = {
			sm: 'text-xs',
			md: 'text-sm',
			lg: 'text-lg'
		};
		return `${base} ${sizeClasses[size]} ${textSizes[size]}`;
	});

	const imageClasses = $derived(() => {
		return `rounded-full object-cover ${sizeClasses[size]}`;
	});

	// Generate initials from user name
	const initials = $derived(() => {
		if (!user?.name) return '?';
		return user.name
			.split(' ')
			.map(word => word[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	});

	let imageLoaded = $state(true);
	let imageError = $state(false);

	function handleImageError() {
		imageError = true;
		imageLoaded = false;
	}

	function handleImageLoad() {
		imageLoaded = true;
		imageError = false;
	}
</script>

{#if user?.avatar && !imageError}
	<img
		src={user.avatar}
		alt={user.name || 'User avatar'}
		class={imageClasses}
		onload={handleImageLoad}
		onerror={handleImageError}
                on:click={() => onclick(user)}
		{...restProps}
	/>
{:else}
	<div
		class={fallbackClasses}
                on:click={() => onclick(user)}
		{...restProps}
	>
		{initials}
	</div>
{/if}