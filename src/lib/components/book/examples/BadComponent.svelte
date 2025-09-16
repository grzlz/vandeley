<script>
	// This is an example of poor component architecture

	let {
		userType,
		userData,
		showAvatar,
		avatarSize,
		showEmail,
		showPhone,
		showActions,
		actionType,
		onEdit,
		onDelete,
		onView,
		backgroundColor,
		textColor,
		borderStyle,
		padding
	} = $props();

	let isLoading = $state(false);
	let hasError = $state(false);
	let errorMessage = $state('');

	// Too much logic in one component
	function handleAction(type) {
		isLoading = true;

		setTimeout(() => {
			if (type === 'edit' && onEdit) {
				onEdit(userData);
			} else if (type === 'delete' && onDelete) {
				onDelete(userData);
			} else if (type === 'view' && onView) {
				onView(userData);
			}
			isLoading = false;
		}, 1000);
	}

	// Inline styles make this unmaintainable
	const cardStyle = `
		background-color: ${backgroundColor || '#ffffff'};
		color: ${textColor || '#000000'};
		border: ${borderStyle || '1px solid #e5e7eb'};
		padding: ${padding || '1rem'};
	`;
</script>

<!-- Too many conditional renders -->
<div class="user-card" style={cardStyle}>
        {#if showAvatar}
                <img
                        src={userData?.avatar || '/default-avatar.png'}
                        alt={userData?.name}
                        style={`width: ${(avatarSize || 48)}px; height: ${(avatarSize || 48)}px;`}
                />
	{/if}

	<div class="user-info">
		<h3>{userData?.name || 'Unknown User'}</h3>

		{#if showEmail && userData?.email}
			<p>Email: {userData.email}</p>
		{/if}

		{#if showPhone && userData?.phone}
			<p>Phone: {userData.phone}</p>
		{/if}

		{#if userType === 'admin'}
			<span class="badge admin">Admin</span>
		{:else if userType === 'moderator'}
			<span class="badge moderator">Moderator</span>
		{:else}
			<span class="badge user">User</span>
		{/if}
	</div>

	{#if showActions}
		<div class="actions">
			{#if actionType === 'full'}
                                <button type="button" onclick={() => handleAction('edit')} disabled={isLoading}>
                                        {isLoading ? 'Loading...' : 'Edit'}
                                </button>
                                <button type="button" onclick={() => handleAction('delete')} disabled={isLoading}>
                                        {isLoading ? 'Loading...' : 'Delete'}
                                </button>
                                <button type="button" onclick={() => handleAction('view')} disabled={isLoading}>
                                        {isLoading ? 'Loading...' : 'View'}
                                </button>
                        {:else if actionType === 'edit-only'}
                                <button type="button" onclick={() => handleAction('edit')} disabled={isLoading}>
                                        {isLoading ? 'Loading...' : 'Edit'}
                                </button>
                        {:else if actionType === 'view-only'}
                                <button type="button" onclick={() => handleAction('view')} disabled={isLoading}>
                                        {isLoading ? 'Loading...' : 'View'}
                                </button>
			{/if}
		</div>
	{/if}

	{#if hasError}
		<div class="error">{errorMessage}</div>
	{/if}
</div>

<style>
	.user-card {
		border-radius: 8px;
		display: flex;
		align-items: center;
		gap: 1rem;
		max-width: 400px;
	}

	.user-info {
		flex: 1;
	}

	.badge {
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.badge.admin { background: #dc2626; color: white; }
	.badge.moderator { background: #f59e0b; color: white; }
	.badge.user { background: #10b981; color: white; }

	.actions {
		display: flex;
		gap: 0.5rem;
		flex-direction: column;
	}

	button {
		padding: 0.5rem 1rem;
		border: 1px solid #e5e7eb;
		border-radius: 4px;
		background: white;
		cursor: pointer;
	}

	button:hover {
		background: #f3f4f6;
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.error {
		color: #dc2626;
		font-size: 0.875rem;
		margin-top: 0.5rem;
	}
</style>