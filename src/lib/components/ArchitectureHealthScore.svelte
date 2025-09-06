<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	export let analytics;

	let chartContainer;
	let overallHealthScore = 0;

	onMount(() => {
		calculateOverallScore();
		createHealthChart();
	});

	function calculateOverallScore() {
		const scores = {
			technicalDebt: Math.max(0, 100 - analytics.technicalDebt.technicalDebtScore),
			scalingReadiness: analytics.scalingReadiness.scalingReadinessScore,
			velocityHealth: analytics.velocityHealth.velocityScore,
			transitionReadiness: analytics.transitionMetrics.scaleReadinessScore
		};

		const weights = {
			technicalDebt: 0.3,
			scalingReadiness: 0.3,
			velocityHealth: 0.25,
			transitionReadiness: 0.15
		};

		overallHealthScore = Math.round(
			scores.technicalDebt * weights.technicalDebt +
				scores.scalingReadiness * weights.scalingReadiness +
				scores.velocityHealth * weights.velocityHealth +
				scores.transitionReadiness * weights.transitionReadiness
		);
	}

	function createHealthChart() {
		const width = 300;
		const height = 300;
		const radius = Math.min(width, height) / 2 - 10;

		d3.select(chartContainer).selectAll('*').remove();

		const svg = d3.select(chartContainer).append('svg').attr('width', width).attr('height', height);

		const g = svg.append('g').attr('transform', `translate(${width / 2}, ${height / 2})`);

		// Background circle
		g.append('circle')
			.attr('r', radius)
			.attr('fill', 'none')
			.attr('stroke', 'oklch(0.901 0.058 230.902)')
			.attr('stroke-width', 20);

		// Create arc generator
		const arc = d3
			.arc()
			.innerRadius(radius - 10)
			.outerRadius(radius + 10)
			.startAngle(0);

		// Health score arc
		const healthArc = g
			.append('path')
			.datum({ endAngle: 0 })
			.attr('fill', getHealthColor(overallHealthScore))
			.attr('d', arc);

		// Animate the health arc
		healthArc
			.transition()
			.duration(1500)
			.attrTween('d', function (d) {
				const interpolate = d3.interpolate(d.endAngle, (overallHealthScore / 100) * 2 * Math.PI);
				return function (t) {
					d.endAngle = interpolate(t);
					return arc(d);
				};
			});

		// Center text
		const textGroup = g.append('g');

		textGroup
			.append('text')
			.attr('text-anchor', 'middle')
			.attr('dy', '-0.5em')
			.style('font-size', '48px')
			.style('font-weight', 'bold')
			.style('fill', getHealthColor(overallHealthScore))
			.text('0')
			.transition()
			.duration(1500)
			.tween('text', function () {
				const i = d3.interpolate(0, overallHealthScore);
				return function (t) {
					this.textContent = Math.round(i(t));
				};
			});

		textGroup
			.append('text')
			.attr('text-anchor', 'middle')
			.attr('dy', '1.2em')
			.style('font-size', '14px')
			.style('font-weight', '500')
			.style('fill', 'oklch(0.5 0.134 242.749)')
			.text('Architecture Health');
	}

	function getHealthColor(score) {
		if (score >= 80) return 'oklch(0.7 0.15 142)'; // Green
		if (score >= 60) return 'oklch(0.75 0.15 85)'; // Yellow-green
		if (score >= 40) return 'oklch(0.75 0.15 65)'; // Yellow
		if (score >= 20) return 'oklch(0.65 0.15 45)'; // Orange
		return 'oklch(0.55 0.15 25)'; // Red
	}

	function getHealthLabel(score) {
		if (score >= 80) return 'Excellent';
		if (score >= 60) return 'Good';
		if (score >= 40) return 'Moderate';
		if (score >= 20) return 'Poor';
		return 'Critical';
	}
</script>

<div class="flex items-center justify-between">
	<div class="flex-1">
		<div class="mb-2 text-6xl font-bold" style="color: {getHealthColor(overallHealthScore)}">
			{overallHealthScore}
		</div>
		<div class="mb-4 text-xl font-semibold text-primary-800">
			{getHealthLabel(overallHealthScore)} Architecture Health
		</div>

		<div class="grid grid-cols-2 gap-4 text-sm">
			<div class="flex justify-between">
				<span class="text-primary-600">Technical Debt:</span>
				<span class="font-semibold text-primary-900">
					{Math.max(0, 100 - analytics.technicalDebt.technicalDebtScore)}/100
				</span>
			</div>
			<div class="flex justify-between">
				<span class="text-primary-600">Scaling Ready:</span>
				<span class="font-semibold text-primary-900">
					{analytics.scalingReadiness.scalingReadinessScore}/100
				</span>
			</div>
			<div class="flex justify-between">
				<span class="text-primary-600">Team Velocity:</span>
				<span class="font-semibold text-primary-900">
					{analytics.velocityHealth.velocityScore}/100
				</span>
			</div>
			<div class="flex justify-between">
				<span class="text-primary-600">Transition Ready:</span>
				<span class="font-semibold text-primary-900">
					{analytics.transitionMetrics.scaleReadinessScore}/100
				</span>
			</div>
		</div>
	</div>

	<div class="ml-8 flex-shrink-0">
		<div bind:this={chartContainer} class="flex items-center justify-center"></div>
	</div>
</div>
