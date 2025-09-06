<script>
	import ArchitectureHealthScore from './ArchitectureHealthScore.svelte';
	import TechnicalDebtChart from './TechnicalDebtChart.svelte';
	import ScalingReadinessChart from './ScalingReadinessChart.svelte';
	import VelocityHealthChart from './VelocityHealthChart.svelte';

	export let architectAnalytics;

	function getSeverityColor(severity) {
		switch (severity) {
			case 'critical':
				return 'from-red-500 to-red-600';
			case 'high':
				return 'from-orange-500 to-orange-600';
			case 'medium':
				return 'from-yellow-500 to-yellow-600';
			default:
				return 'from-blue-500 to-blue-600';
		}
	}

	function getSeverityIcon(severity) {
		switch (severity) {
			case 'critical':
				return '🚨';
			case 'high':
				return '⚠️';
			case 'medium':
				return '⚡';
			default:
				return '💡';
		}
	}

	function formatScore(score) {
		return Math.round(score);
	}
</script>

<div class="space-y-8">
	<!-- Architecture Health Overview -->
	<div class="glass-accent rounded-2xl p-8">
		<h2 class="mb-6 flex items-center gap-3 text-2xl font-bold text-primary-900">
			<span
				class="flex h-8 w-8 items-center justify-center rounded-lg
                         bg-gradient-to-br from-primary-500 to-primary-600 text-sm text-white"
				>🏗️</span
			>
			Architecture Health Overview
		</h2>

		<ArchitectureHealthScore analytics={architectAnalytics} />
	</div>

	<!-- Key Architecture KPIs -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
		<!-- Technical Debt Score -->
		<div class="glass-accent rounded-2xl p-6">
			<div class="mb-3 flex items-center justify-between">
				<div
					class="flex h-12 w-12 items-center justify-center rounded-xl
                            bg-gradient-to-br from-red-500 to-red-600 text-xl text-white"
				>
					⚠️
				</div>
				<span class="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-600">
					Debt
				</span>
			</div>
			<div class="mb-1 text-3xl font-bold text-red-900">
				{formatScore(architectAnalytics.technicalDebt.technicalDebtScore)}
			</div>
			<div class="mb-2 font-medium text-red-600">Technical Debt Score</div>
			<div class="text-sm text-red-700">
				Hotspot Concentration: {formatScore(
					architectAnalytics.technicalDebt.hotspotConcentrationRatio
				)}%
			</div>
		</div>

		<!-- Scaling Readiness Score -->
		<div class="glass-accent rounded-2xl p-6">
			<div class="mb-3 flex items-center justify-between">
				<div
					class="flex h-12 w-12 items-center justify-center rounded-xl
                            bg-gradient-to-br from-green-500 to-green-600 text-xl text-white"
				>
					📈
				</div>
				<span class="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-600">
					Scale
				</span>
			</div>
			<div class="mb-1 text-3xl font-bold text-green-900">
				{formatScore(architectAnalytics.scalingReadiness.scalingReadinessScore)}
			</div>
			<div class="mb-2 font-medium text-green-600">Scaling Readiness</div>
			<div class="text-sm text-green-700">
				Coordination Overhead: {formatScore(
					architectAnalytics.scalingReadiness.coordinationOverhead.overheadScore
				)}
			</div>
		</div>

		<!-- Velocity Health Score -->
		<div class="glass-accent rounded-2xl p-6">
			<div class="mb-3 flex items-center justify-between">
				<div
					class="flex h-12 w-12 items-center justify-center rounded-xl
                            bg-gradient-to-br from-blue-500 to-blue-600 text-xl text-white"
				>
					⚡
				</div>
				<span class="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600">
					Velocity
				</span>
			</div>
			<div class="mb-1 text-3xl font-bold text-blue-900">
				{formatScore(architectAnalytics.velocityHealth.velocityScore)}
			</div>
			<div class="mb-2 font-medium text-blue-600">Engineering Velocity</div>
			<div class="text-sm text-blue-700">
				Bus Factor Risk: {architectAnalytics.velocityHealth.knowledgeSilos.busFactor.overall}
			</div>
		</div>

		<!-- Scale Transition Score -->
		<div class="glass-accent rounded-2xl p-6">
			<div class="mb-3 flex items-center justify-between">
				<div
					class="flex h-12 w-12 items-center justify-center rounded-xl
                            bg-gradient-to-br from-purple-500 to-purple-600 text-xl text-white"
				>
					🚀
				</div>
				<span class="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-600">
					Transition
				</span>
			</div>
			<div class="mb-1 text-3xl font-bold text-purple-900">
				{formatScore(architectAnalytics.transitionMetrics.scaleReadinessScore)}
			</div>
			<div class="mb-2 font-medium text-purple-600">MVP → Scale Ready</div>
			<div class="text-sm text-purple-700 capitalize">
				Phase: {architectAnalytics.transitionMetrics.transitionPhase.replace('-', ' ')}
			</div>
		</div>
	</div>

	<!-- Detailed Analytics Charts -->
	<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
		<!-- Technical Debt Analysis -->
		<div class="glass-accent rounded-2xl p-8">
			<h3 class="mb-6 flex items-center gap-3 text-xl font-bold text-primary-900">
				<span
					class="flex h-6 w-6 items-center justify-center rounded
                             bg-gradient-to-br from-red-500 to-red-600 text-xs text-white">🔥</span
				>
				Technical Debt Analysis
			</h3>
			<TechnicalDebtChart data={architectAnalytics.technicalDebt} />
		</div>

		<!-- Scaling Readiness -->
		<div class="glass-accent rounded-2xl p-8">
			<h3 class="mb-6 flex items-center gap-3 text-xl font-bold text-primary-900">
				<span
					class="flex h-6 w-6 items-center justify-center rounded
                             bg-gradient-to-br from-green-500 to-green-600 text-xs text-white"
					>📊</span
				>
				Scaling Readiness
			</h3>
			<ScalingReadinessChart data={architectAnalytics.scalingReadiness} />
		</div>
	</div>

	<!-- Knowledge Silos & Context Switching -->
	<div class="glass-accent rounded-2xl p-8">
		<h3 class="mb-6 flex items-center gap-3 text-xl font-bold text-primary-900">
			<span
				class="flex h-6 w-6 items-center justify-center rounded
                         bg-gradient-to-br from-blue-500 to-blue-600 text-xs text-white">🧠</span
			>
			Engineering Velocity Health
		</h3>
		<VelocityHealthChart data={architectAnalytics.velocityHealth} />
	</div>

	<!-- Architecture Recommendations -->
	<div class="glass-accent rounded-2xl p-8">
		<h3 class="mb-6 flex items-center gap-3 text-xl font-bold text-primary-900">
			<span
				class="flex h-6 w-6 items-center justify-center rounded
                         bg-gradient-to-br from-secondary-500 to-secondary-600 text-xs text-white"
				>💡</span
			>
			Architecture Recommendations
		</h3>

		<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
			<!-- Technical Debt Recommendations -->
			<div>
				<h4 class="mb-4 flex items-center gap-2 text-lg font-semibold text-primary-800">
					<span class="text-red-500">⚠️</span>
					Technical Debt
				</h4>
				<div class="space-y-3">
					{#each architectAnalytics.technicalDebt.recommendations as rec}
						<div
							class="bg-gradient-to-r p-4 {getSeverityColor(rec.severity)} bg-opacity-10
                                rounded-lg border border-gray-200"
						>
							<div class="flex items-start gap-3">
								<span class="text-lg">{getSeverityIcon(rec.severity)}</span>
								<div class="flex-1">
									<h5 class="mb-1 font-semibold text-primary-900">{rec.title}</h5>
									<p class="mb-2 text-sm text-primary-700">{rec.description}</p>
									<p class="text-xs font-medium text-primary-600">{rec.action}</p>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Scaling Recommendations -->
			<div>
				<h4 class="mb-4 flex items-center gap-2 text-lg font-semibold text-primary-800">
					<span class="text-green-500">📈</span>
					Scaling Readiness
				</h4>
				<div class="space-y-3">
					{#each architectAnalytics.scalingReadiness.scalingRecommendations as rec}
						<div
							class="bg-gradient-to-r p-4 {getSeverityColor(rec.severity)} bg-opacity-10
                                rounded-lg border border-gray-200"
						>
							<div class="flex items-start gap-3">
								<span class="text-lg">{getSeverityIcon(rec.severity)}</span>
								<div class="flex-1">
									<h5 class="mb-1 font-semibold text-primary-900">{rec.title}</h5>
									<p class="mb-2 text-sm text-primary-700">{rec.description}</p>
									<p class="text-xs font-medium text-primary-600">{rec.action}</p>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Transition Recommendations -->
		<div class="mt-8">
			<h4 class="mb-4 flex items-center gap-2 text-lg font-semibold text-primary-800">
				<span class="text-purple-500">🚀</span>
				MVP to Scale Transition
			</h4>
			<div class="grid grid-cols-1 gap-3 lg:grid-cols-2">
				{#each architectAnalytics.transitionMetrics.transitionRecommendations as rec}
					<div
						class="bg-gradient-to-r p-4 {getSeverityColor(rec.severity)} bg-opacity-10
                            rounded-lg border border-gray-200"
					>
						<div class="flex items-start gap-3">
							<span class="text-lg">{getSeverityIcon(rec.severity)}</span>
							<div class="flex-1">
								<h5 class="mb-1 font-semibold text-primary-900">{rec.title}</h5>
								<p class="mb-2 text-sm text-primary-700">{rec.description}</p>
								<p class="text-xs font-medium text-primary-600">{rec.action}</p>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Architecture Metrics Detail -->
	<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
		<!-- Commit Patterns -->
		<div class="glass-accent rounded-2xl p-8">
			<h3 class="mb-6 flex items-center gap-3 text-xl font-bold text-primary-900">
				<span
					class="flex h-6 w-6 items-center justify-center rounded
                             bg-gradient-to-br from-secondary-400 to-secondary-600 text-xs text-white"
					>📝</span
				>
				Commit Patterns Analysis
			</h3>

			<div class="space-y-4">
				<div class="grid grid-cols-2 gap-4">
					<div class="rounded-lg bg-primary-50 p-4 text-center">
						<div class="text-2xl font-bold text-primary-900">
							{formatScore(architectAnalytics.technicalDebt.commitPatterns.featureRatio)}%
						</div>
						<div class="text-sm text-primary-600">Feature Work</div>
					</div>
					<div class="rounded-lg bg-secondary-50 p-4 text-center">
						<div class="text-2xl font-bold text-secondary-900">
							{formatScore(architectAnalytics.technicalDebt.commitPatterns.refactorRatio)}%
						</div>
						<div class="text-sm text-secondary-600">Refactoring</div>
					</div>
				</div>

				<div class="text-sm text-primary-700">
					<p class="mb-2">
						<strong>Feature Commits:</strong>
						{architectAnalytics.technicalDebt.commitPatterns.featureCommits}
					</p>
					<p class="mb-2">
						<strong>Refactoring Commits:</strong>
						{architectAnalytics.technicalDebt.commitPatterns.refactoringCommits}
					</p>
					<p>
						<strong>Bug Fix Commits:</strong>
						{architectAnalytics.technicalDebt.commitPatterns.bugfixCommits}
					</p>
				</div>
			</div>
		</div>

		<!-- MVP Maturity Assessment -->
		<div class="glass-accent rounded-2xl p-8">
			<h3 class="mb-6 flex items-center gap-3 text-xl font-bold text-primary-900">
				<span
					class="flex h-6 w-6 items-center justify-center rounded
                             bg-gradient-to-br from-purple-400 to-purple-600 text-xs text-white"
					>🎯</span
				>
				MVP Maturity Assessment
			</h3>

			<div class="space-y-4">
				<div class="text-center">
					<div class="mb-2 text-4xl font-bold text-purple-900">
						{formatScore(architectAnalytics.transitionMetrics.mvpMaturity.maturityScore)}
					</div>
					<div class="font-medium text-purple-600 capitalize">
						{architectAnalytics.transitionMetrics.mvpMaturity.developmentPhase} Phase
					</div>
				</div>

				<div class="grid grid-cols-2 gap-3 text-sm">
					<div class="rounded-lg bg-purple-50 p-3">
						<div class="font-semibold text-purple-900">Team Size</div>
						<div class="text-purple-700">
							{architectAnalytics.transitionMetrics.mvpMaturity.teamSize} contributors
						</div>
					</div>
					<div class="rounded-lg bg-purple-50 p-3">
						<div class="font-semibold text-purple-900">Codebase Size</div>
						<div class="text-purple-700">
							{architectAnalytics.transitionMetrics.mvpMaturity.codebaseSize} files
						</div>
					</div>
					<div class="rounded-lg bg-purple-50 p-3">
						<div class="font-semibold text-purple-900">Dev Duration</div>
						<div class="text-purple-700">
							{architectAnalytics.transitionMetrics.mvpMaturity.developmentDuration} days
						</div>
					</div>
					<div class="rounded-lg bg-purple-50 p-3">
						<div class="font-semibold text-purple-900">Scale Readiness</div>
						<div class="text-purple-700 capitalize">
							{architectAnalytics.transitionMetrics.mvpMaturity.scalingReadiness.replace('-', ' ')}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
