<script>
	let {
		children,
		header,
		footer,
		variant = 'default',
		padding = 'md',
		shadow = 'sm',
		hover = false,
		onclick,
		class: className = '',
		...restProps
	} = $props();

	const cardClasses = $derived(() => {
		const baseClasses = 'bg-white border border-gray-200 transition-all duration-200';

		const variantClasses = {
			default: 'rounded-xl',
			bordered: 'rounded-xl border-2',
			elevated: 'rounded-xl border-none',
			glass: 'rounded-xl backdrop-blur-xl bg-white/80 border-white/20'
		};

		const paddingClasses = {
			none: '',
			sm: 'p-4',
			md: 'p-6',
			lg: 'p-8'
		};

		const shadowClasses = {
			none: '',
			sm: 'shadow-sm',
			md: 'shadow-md',
			lg: 'shadow-lg',
			xl: 'shadow-xl'
		};

		const hoverClasses = hover ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : '';

		return `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${shadowClasses[shadow]} ${hoverClasses} ${className}`;
	});

	const contentClasses = $derived(() => {
		return padding === 'none' ? 'p-6' : '';
	});

	function handleClick(event) {
		if (onclick) {
			onclick(event);
		}
	}
</script>

{#if onclick}
<button
	class={cardClasses}
	onclick={handleClick}
	{...restProps}
>
	{#if header}
		<div class="mb-4 border-b border-gray-200 pb-4">
			{@render header()}
		</div>
	{/if}

	<div class={contentClasses}>
		{@render children()}
	</div>

	{#if footer}
		<div class="mt-4 border-t border-gray-200 pt-4">
			{@render footer()}
		</div>
	{/if}
</button>
{:else}
<div
	class={cardClasses}
	{...restProps}
>
	{#if header}
		<div class="mb-4 border-b border-gray-200 pb-4">
			{@render header()}
		</div>
	{/if}

	<div class={contentClasses}>
		{@render children()}
	</div>

	{#if footer}
		<div class="mt-4 border-t border-gray-200 pt-4">
			{@render footer()}
		</div>
	{/if}
</div>
{/if}