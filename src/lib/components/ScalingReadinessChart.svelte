<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	export let data;

	let chartContainer;

	onMount(() => {
		createReadinessChart();

		// Add resize listener
		const resizeHandler = () => createReadinessChart();
		window.addEventListener('resize', resizeHandler);
		return () => window.removeEventListener('resize', resizeHandler);
	});

	function createReadinessChart() {
		// Get container width dynamically
		const containerWidth = chartContainer.clientWidth || 500;
		const width = Math.max(300, Math.min(500, containerWidth));
		const height = 280;
		const radius = Math.min(width, height) / 2 - 60;

		d3.select(chartContainer).selectAll('*').remove();

		const svg = d3.select(chartContainer).append('svg').attr('width', width).attr('height', height);

		const g = svg.append('g').attr('transform', `translate(${width / 2}, ${height / 2})`);

		// Prepare data for radar/donut chart
		const metrics = [
			{
				name: 'Team Coordination',
				value: Math.max(0, 100 - data.coordinationOverhead.overheadScore),
				color: 'oklch(0.65 0.15 200)'
			},
			{
				name: 'Release Frequency',
				value: data.releaseFrequency.velocityTrend || 50,
				color: 'oklch(0.65 0.15 160)'
			},
			{
				name: 'Critical Paths',
				value: Math.max(0, 100 - data.criticalPaths.riskScore),
				color: 'oklch(0.65 0.15 120)'
			},
			{
				name: 'Architecture',
				value: data.decompositionMetrics.progressScore,
				color: 'oklch(0.65 0.15 80)'
			}
		];

		// Create pie generator
		const pie = d3
			.pie()
			.value((d) => d.value)
			.sort(null)
			.padAngle(0.02);

		const arc = d3
			.arc()
			.innerRadius(radius * 0.6)
			.outerRadius(radius);

		// Create arcs
		const arcs = g
			.selectAll('.scaling-arc')
			.data(pie(metrics))
			.enter()
			.append('g')
			.attr('class', 'scaling-arc');

		// Add paths
		arcs
			.append('path')
			.attr('fill', (d) => d.data.color)
			.attr('stroke', 'white')
			.attr('stroke-width', 2)
			.style('cursor', 'pointer')
			.transition()
			.duration(1000)
			.delay((d, i) => i * 200)
			.attrTween('d', function (d) {
				const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
				return function (t) {
					return arc(interpolate(t));
				};
			});

		// Add labels
		arcs
			.append('text')
			.attr('transform', (d) => `translate(${arc.centroid(d)})`)
			.attr('text-anchor', 'middle')
			.style('fill', 'white')
			.style('font-size', '12px')
			.style('font-weight', '600')
			.style('opacity', 0)
			.text((d) => Math.round(d.data.value))
			.transition()
			.delay(1200)
			.duration(400)
			.style('opacity', 1);

		// Add center text
		g.append('text')
			.attr('text-anchor', 'middle')
			.attr('dy', '-0.5em')
			.style('font-size', '32px')
			.style('font-weight', 'bold')
			.style('fill', 'oklch(0.5 0.134 242.749)')
			.text('0')
			.transition()
			.duration(1500)
			.tween('text', function () {
				const avgScore = metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length;
				const i = d3.interpolate(0, avgScore);
				return function (t) {
					this.textContent = Math.round(i(t));
				};
			});

		g.append('text')
			.attr('text-anchor', 'middle')
			.attr('dy', '1.2em')
			.style('font-size', '14px')
			.style('font-weight', '500')
			.style('fill', 'oklch(0.5 0.134 242.749)')
			.text('Scaling Score');

		// Add legend only if there's enough space
		if (width > 350) {
			const legend = svg.append('g').attr('transform', `translate(15, 15)`);

			const legendItems = legend
				.selectAll('.legend-item')
				.data(metrics)
				.enter()
				.append('g')
				.attr('class', 'legend-item')
				.attr('transform', (d, i) => `translate(0, ${i * 20})`);

			legendItems
				.append('rect')
				.attr('width', 12)
				.attr('height', 12)
				.attr('fill', (d) => d.color)
				.attr('rx', 2);

			legendItems
				.append('text')
				.attr('x', 16)
				.attr('y', 9)
				.style('fill', 'oklch(0.5 0.134 242.749)')
				.style('font-size', '11px')
				.style('font-weight', '500')
				.text((d) => (width > 400 ? `${d.name} (${Math.round(d.value)})` : d.name.split(' ')[0]));
		}

		// Add interactions
		arcs
			.select('path')
			.on('mouseover', function (event, d) {
				d3.select(this).transition().duration(200).attr('opacity', 0.8);

				const tooltip = d3
					.select('body')
					.append('div')
					.attr('class', 'tooltip')
					.style('position', 'absolute')
					.style('background', 'rgba(0, 0, 0, 0.9)')
					.style('color', 'white')
					.style('padding', '12px 16px')
					.style('border-radius', '8px')
					.style('font-size', '14px')
					.style('pointer-events', 'none')
					.style('z-index', '1000')
					.style('box-shadow', '0 4px 20px rgba(0,0,0,0.3)');

				let description = getMetricDescription(d.data.name);

				tooltip
					.html(
						`
                    <div style="font-weight: bold; margin-bottom: 8px;">${d.data.name}</div>
                    <div>Score: ${Math.round(d.data.value)}/100</div>
                    <div style="margin-top: 8px; font-size: 12px; opacity: 0.8;">${description}</div>
                `
					)
					.style('left', event.pageX + 10 + 'px')
					.style('top', event.pageY - 10 + 'px');
			})
			.on('mouseout', function () {
				d3.select(this).transition().duration(200).attr('opacity', 1);

				d3.selectAll('.tooltip').remove();
			});
	}

	function getMetricDescription(metricName) {
		switch (metricName) {
			case 'Team Coordination':
				return 'How well team structure aligns with codebase architecture';
			case 'Release Frequency':
				return 'Consistency and frequency of releases over time';
			case 'Critical Paths':
				return 'Risk level of critical dependencies and bottlenecks';
			case 'Architecture':
				return 'Progress toward service boundaries and decomposition';
			default:
				return 'Scaling readiness metric';
		}
	}
</script>

<div class="w-full overflow-hidden">
	<div bind:this={chartContainer} class="flex h-72 w-full items-center justify-center">
		{#if !data}
			<div class="font-medium text-primary-500">No scaling readiness data available</div>
		{/if}
	</div>
</div>
