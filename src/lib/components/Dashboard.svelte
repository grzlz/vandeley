<script>
	import TimeChart from './TimeChart.svelte';
	import ContributorChart from './ContributorChart.svelte';
	import ProjectHeatmap from './ProjectHeatmap.svelte';

	export let analytics;

	function formatNumber(num) {
		return new Intl.NumberFormat().format(num);
	}

	function formatHours(hours) {
		return `${Math.round(hours * 10) / 10}h`;
	}

	function formatDuration(ms) {
		const days = Math.floor(ms / (1000 * 60 * 60 * 24));
		if (days > 0) return `${days} days`;

		const hours = Math.floor(ms / (1000 * 60 * 60));
		if (hours > 0) return `${hours} hours`;

		const minutes = Math.floor(ms / (1000 * 60));
		return `${minutes} minutes`;
	}
</script>

<div class="space-y-8">
	<!-- Header Stats -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
		<div class="glass-accent rounded-2xl p-6">
			<div class="mb-3 flex items-center justify-between">
				<div
					class="flex h-12 w-12 items-center justify-center rounded-xl
                            bg-gradient-to-br from-primary-500 to-primary-600 text-xl text-white"
				>
					📊
				</div>
				<span class="rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-600">
					Total
				</span>
			</div>
			<div class="mb-1 text-3xl font-bold text-primary-900">
				{formatNumber(analytics.projectMetrics.totalCommits)}
			</div>
			<div class="font-medium text-primary-600">Commits</div>
		</div>

		<div class="glass-accent rounded-2xl p-6">
			<div class="mb-3 flex items-center justify-between">
				<div
					class="flex h-12 w-12 items-center justify-center rounded-xl
                            bg-gradient-to-br from-secondary-400 to-secondary-500 text-xl text-white"
				>
					⏱️
				</div>
				<span
					class="rounded-full bg-secondary-100 px-3 py-1 text-sm font-medium text-secondary-600"
				>
					Estimated
				</span>
			</div>
			<div class="mb-1 text-3xl font-bold text-secondary-900">
				{formatHours(analytics.projectMetrics.totalEstimatedHours)}
			</div>
			<div class="font-medium text-secondary-600">Work Time</div>
		</div>

		<div class="glass-accent rounded-2xl p-6">
			<div class="mb-3 flex items-center justify-between">
				<div
					class="flex h-12 w-12 items-center justify-center rounded-xl
                            bg-gradient-to-br from-primary-400 to-primary-500 text-xl text-white"
				>
					👥
				</div>
				<span class="rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-600">
					Active
				</span>
			</div>
			<div class="mb-1 text-3xl font-bold text-primary-900">
				{analytics.projectMetrics.totalContributors}
			</div>
			<div class="font-medium text-primary-600">
				{analytics.projectMetrics.totalContributors === 1 ? 'Contributor' : 'Contributors'}
			</div>
		</div>

		<div class="glass-accent rounded-2xl p-6">
			<div class="mb-3 flex items-center justify-between">
				<div
					class="flex h-12 w-12 items-center justify-center rounded-xl
                            bg-gradient-to-br from-secondary-500 to-secondary-600 text-xl text-white"
				>
					📁
				</div>
				<span
					class="rounded-full bg-secondary-100 px-3 py-1 text-sm font-medium text-secondary-600"
				>
					Modified
				</span>
			</div>
			<div class="mb-1 text-3xl font-bold text-secondary-900">
				{formatNumber(analytics.projectMetrics.totalFiles)}
			</div>
			<div class="font-medium text-secondary-600">Files</div>
		</div>
	</div>

	<!-- Session Insights -->
	<div class="glass-accent rounded-2xl p-8">
		<h2 class="mb-6 flex items-center gap-3 text-2xl font-bold text-primary-900">
			<span
				class="flex h-8 w-8 items-center justify-center rounded-lg
                         bg-gradient-to-br from-primary-500 to-primary-600 text-sm text-white"
				>🔥</span
			>
			Work Sessions Insights
		</h2>

		<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
			<div>
				<h3 class="mb-4 text-lg font-semibold text-primary-800">Session Summary</h3>
				<div class="space-y-3">
					<div class="flex justify-between">
						<span class="text-primary-600">Total Sessions:</span>
						<span class="font-semibold text-primary-900">
							{analytics.sessionStats.totalSessions}
						</span>
					</div>
					<div class="flex justify-between">
						<span class="text-primary-600">Average Length:</span>
						<span class="font-semibold text-primary-900">
							{formatHours(analytics.sessionStats.averageSessionLength)}
						</span>
					</div>
					<div class="flex justify-between">
						<span class="text-primary-600">Longest Session:</span>
						<span class="font-semibold text-primary-900">
							{formatHours(analytics.sessionStats.longestSession.estimatedHours)}
						</span>
					</div>
				</div>
			</div>

			<div>
				<h3 class="mb-4 text-lg font-semibold text-primary-800">Work Schedule</h3>
				<div class="space-y-3">
					<div class="flex justify-between">
						<span class="text-primary-600">Peak Time:</span>
						<span class="font-semibold text-primary-900 capitalize">
							{analytics.sessionStats.mostProductiveTimeOfDay}
						</span>
					</div>
					<div class="flex justify-between">
						<span class="text-primary-600">Weekend Work:</span>
						<span class="font-semibold text-primary-900">
							{analytics.sessionStats.weekendSessions} sessions
						</span>
					</div>
					<div class="flex justify-between">
						<span class="text-primary-600">Weekday Work:</span>
						<span class="font-semibold text-primary-900">
							{analytics.sessionStats.weekdaySessions} sessions
						</span>
					</div>
				</div>
			</div>

			<div>
				<h3 class="mb-4 text-lg font-semibold text-primary-800">Project Timeline</h3>
				<div class="space-y-3">
					<div class="flex justify-between">
						<span class="text-primary-600">Duration:</span>
						<span class="font-semibold text-primary-900">
							{analytics.projectMetrics.projectDurationDays} days
						</span>
					</div>
					<div class="flex justify-between">
						<span class="text-primary-600">Avg Hours/Week:</span>
						<span class="font-semibold text-primary-900">
							{formatHours(analytics.projectMetrics.hoursPerWeek)}
						</span>
					</div>
					<div class="flex justify-between">
						<span class="text-primary-600">Commits/Day:</span>
						<span class="font-semibold text-primary-900">
							{analytics.projectMetrics.commitsPerDay}
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Visualizations -->
	<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
		<!-- Timeline Chart -->
		<div class="glass-accent rounded-2xl p-8">
			<h3 class="mb-6 flex items-center gap-3 text-xl font-bold text-primary-900">
				<span
					class="flex h-6 w-6 items-center justify-center rounded
                             bg-gradient-to-br from-primary-500 to-primary-600 text-xs text-white"
					>📈</span
				>
				Commit Timeline
			</h3>
			<TimeChart data={analytics} />
		</div>

		<!-- Contributors Chart -->
		<div class="glass-accent rounded-2xl p-8">
			<h3 class="mb-6 flex items-center gap-3 text-xl font-bold text-primary-900">
				<span
					class="flex h-6 w-6 items-center justify-center rounded
                             bg-gradient-to-br from-secondary-500 to-secondary-600 text-xs text-white"
					>👤</span
				>
				Contributors
			</h3>
			<ContributorChart contributors={analytics.contributors} />
		</div>
	</div>

	<!-- File Heatmap -->
	<div class="glass-accent rounded-2xl p-8">
		<h3 class="mb-6 flex items-center gap-3 text-xl font-bold text-primary-900">
			<span
				class="flex h-6 w-6 items-center justify-center rounded
                         bg-gradient-to-br from-primary-600 to-secondary-500 text-xs text-white"
				>🔥</span
			>
			File Activity Heatmap
		</h3>
		<ProjectHeatmap hotspots={analytics.projectEvolution.hotspots} />
	</div>

	<!-- Top Contributors Detail -->
	{#if analytics.contributors.length > 0}
		<div class="glass-accent rounded-2xl p-8">
			<h3 class="mb-6 flex items-center gap-3 text-xl font-bold text-primary-900">
				<span
					class="flex h-6 w-6 items-center justify-center rounded
                         bg-gradient-to-br from-secondary-400 to-secondary-600 text-xs text-white"
					>🏆</span
				>
				Top Contributors
			</h3>

			<div class="space-y-6">
				{#each analytics.contributors.slice(0, 3) as contributor, index}
					<div class="flex items-center gap-6 rounded-xl bg-primary-50/50 p-4">
						<div
							class="flex h-12 w-12 items-center justify-center
                            rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-lg font-bold text-white"
						>
							{index + 1}
						</div>

						<div class="flex-1">
							<h4 class="text-lg font-semibold text-primary-900">{contributor.name}</h4>
							<div class="mt-2 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
								<div>
									<span class="text-primary-600">Commits:</span>
									<span class="ml-1 font-semibold text-primary-900">
										{formatNumber(contributor.totalCommits)}
									</span>
								</div>
								<div>
									<span class="text-primary-600">Changes:</span>
									<span class="ml-1 font-semibold text-primary-900">
										{formatNumber(contributor.totalChanges)}
									</span>
								</div>
								<div>
									<span class="text-primary-600">Files:</span>
									<span class="ml-1 font-semibold text-primary-900">
										{contributor.filesModified}
									</span>
								</div>
								<div>
									<span class="text-primary-600">Active Days:</span>
									<span class="ml-1 font-semibold text-primary-900">
										{contributor.activeDays}
									</span>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
