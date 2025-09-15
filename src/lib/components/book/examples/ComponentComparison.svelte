<script>
	import BadComponent from './BadComponent.svelte';
	import GoodUserCard from './GoodUserCard.svelte';

	// Sample user data
	const sampleUser = {
		name: 'Jane Smith',
		email: 'jane@example.com',
		phone: '+1 (555) 123-4567',
		role: 'admin',
		avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face'
	};

	// Example actions for the good component
	const userActions = [
		{
			label: 'Edit',
			icon: '✏️',
			handler: (user) => {
				alert(`Editing ${user.name}`);
			}
		},
		{
			label: 'Delete',
			icon: '🗑️',
			handler: (user) => {
				alert(`Deleting ${user.name}`);
			}
		}
	];

	let selectedDemo = $state('bad');
</script>

<div class="component-comparison">
	<div class="mb-6">
		<div class="flex gap-4 mb-4">
			<button
				onclick={() => selectedDemo = 'bad'}
				class="px-4 py-2 rounded-lg transition-colors
					{selectedDemo === 'bad'
						? 'bg-red-100 text-red-700 border border-red-300'
						: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
			>
				❌ Poor Architecture
			</button>
			<button
				onclick={() => selectedDemo = 'good'}
				class="px-4 py-2 rounded-lg transition-colors
					{selectedDemo === 'good'
						? 'bg-green-100 text-green-700 border border-green-300'
						: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
			>
				✅ Good Architecture
			</button>
		</div>

		{#if selectedDemo === 'bad'}
			<div class="p-4 bg-red-50 border border-red-200 rounded-lg">
				<h4 class="font-semibold text-red-800 mb-2">Problems with this approach:</h4>
				<ul class="text-sm text-red-700 space-y-1">
					<li>• Too many props (16+ props make it hard to use)</li>
					<li>• Mixed responsibilities (UI, data, actions, styling)</li>
					<li>• Inline styles make it unmaintainable</li>
					<li>• Complex conditional logic</li>
					<li>• Hard to test individual features</li>
					<li>• Difficult to extend or modify</li>
				</ul>
			</div>
		{:else}
			<div class="p-4 bg-green-50 border border-green-200 rounded-lg">
				<h4 class="font-semibold text-green-800 mb-2">Benefits of this approach:</h4>
				<ul class="text-sm text-green-700 space-y-1">
					<li>• Clear, focused props (user, variant, size, actions)</li>
					<li>• Single responsibility per component</li>
					<li>• Composable and reusable</li>
					<li>• Easy to test each piece independently</li>
					<li>• Consistent styling through design system</li>
					<li>• Easy to extend with new features</li>
				</ul>
			</div>
		{/if}
	</div>

	<div class="demo-area bg-gray-50 p-8 rounded-lg border border-gray-200">
		{#if selectedDemo === 'bad'}
			<BadComponent
				userType="admin"
				userData={sampleUser}
				showAvatar={true}
				avatarSize={48}
				showEmail={true}
				showPhone={false}
				showActions={true}
				actionType="full"
				onEdit={(user) => alert(`Editing ${user.name}`)}
				onDelete={(user) => alert(`Deleting ${user.name}`)}
				onView={(user) => alert(`Viewing ${user.name}`)}
				backgroundColor="#ffffff"
				textColor="#000000"
				borderStyle="1px solid #e5e7eb"
				padding="1.5rem"
			/>
		{:else}
			<GoodUserCard
				user={sampleUser}
				variant="default"
				size="md"
				actions={userActions}
				onclick={(user) => alert(`Clicked ${user.name}`)}
			>
				{#snippet children({ user })}
					<p class="text-xs text-gray-500">Last seen: 2 hours ago</p>
				{/snippet}
			</GoodUserCard>
		{/if}
	</div>
</div>