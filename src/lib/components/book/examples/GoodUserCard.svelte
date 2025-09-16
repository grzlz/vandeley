<script>
  import Avatar from './Avatar.svelte';
  import UserBadge from './UserBadge.svelte';
  import ActionButtons from './ActionButtons.svelte';

  let {
    user,
    variant = 'default',
    size = 'md',
    children,
    actions,
    onclick = undefined,
    ...restProps
  } = $props();

  const cardClasses = $derived(() => {
    const base =
      'user-card rounded-lg border transition-all duration-200 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2';
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

    const variantClasses = variants[variant] ?? variants.default;
    const sizeClasses = sizes[size] ?? sizes.md;

    return `${base} ${variantClasses} ${sizeClasses}`;
  });

  function handleClick() {
    if (onclick) {
      onclick(user);
    }
  }
</script>

{#snippet cardContent()}
  <div class="flex items-center gap-4">
    <Avatar user={user} size={size} />

    <div class="min-w-0 flex-1">
      <div class="mb-1 flex items-center gap-2">
        <h3 class="truncate font-semibold text-gray-900">{user.name}</h3>
        <UserBadge role={user.role} />
      </div>

      {#if user.email}
        <p class="truncate text-sm text-gray-600">{user.email}</p>
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
{/snippet}

{#if onclick}
  <button type="button" class={cardClasses} onclick={handleClick} {...restProps}>
    {@render cardContent()}
  </button>
{:else}
  <div class={cardClasses} {...restProps}>
    {@render cardContent()}
  </div>
{/if}

<style>
  .user-card {
    cursor: default;
  }

  .user-card:focus-visible {
    outline: none;
  }
</style>
