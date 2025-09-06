<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	export let data;

	let chartContainer;

	onMount(() => {
		createChart();

		// Add resize listener
		const resizeHandler = () => createChart();
		window.addEventListener('resize', resizeHandler);
		return () => window.removeEventListener('resize', resizeHandler);
	});

	function createChart() {
		if (!data || !data.timeAnalytics) return;

		// Get container width dynamically
		const containerWidth = chartContainer.clientWidth || 500;
		const margin = { top: 20, right: 20, bottom: 40, left: 40 };
		const width = Math.max(300, containerWidth - margin.left - margin.right);
		const height = 250 - margin.top - margin.bottom;

		d3.select(chartContainer).selectAll('*').remove();

		const svg = d3
			.select(chartContainer)
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.style('overflow', 'visible');

		const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

		// Create gradient for the area chart
		const gradient = svg
			.append('defs')
			.append('linearGradient')
			.attr('id', 'area-gradient')
			.attr('gradientUnits', 'userSpaceOnUse')
			.attr('x1', 0)
			.attr('y1', height)
			.attr('x2', 0)
			.attr('y2', 0);

		gradient
			.append('stop')
			.attr('offset', '0%')
			.attr('stop-color', 'oklch(0.685 0.169 237.323)')
			.attr('stop-opacity', 0.1);

		gradient
			.append('stop')
			.attr('offset', '100%')
			.attr('stop-color', 'oklch(0.685 0.169 237.323)')
			.attr('stop-opacity', 0.6);

		// Prepare daily commit data
		const dailyData = Object.entries(data.timeAnalytics.dailyActivity)
			.map(([date, commits]) => ({
				date: new Date(date),
				commits: commits
			}))
			.sort((a, b) => a.date - b.date);

		if (dailyData.length === 0) return;

		// Create scales
		const xScale = d3
			.scaleTime()
			.domain(d3.extent(dailyData, (d) => d.date))
			.range([0, width]);

		const yScale = d3
			.scaleLinear()
			.domain([0, d3.max(dailyData, (d) => d.commits)])
			.range([height, 0])
			.nice();

		// Create line and area generators
		const line = d3
			.line()
			.x((d) => xScale(d.date))
			.y((d) => yScale(d.commits))
			.curve(d3.curveCardinal);

		const area = d3
			.area()
			.x((d) => xScale(d.date))
			.y0(height)
			.y1((d) => yScale(d.commits))
			.curve(d3.curveCardinal);

		// Add axes
		g.append('g')
			.attr('transform', `translate(0,${height})`)
			.call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%m/%d')).ticks(6))
			.selectAll('text')
			.style('fill', 'oklch(0.5 0.134 242.749)')
			.style('font-size', '12px');

		g.append('g')
			.call(d3.axisLeft(yScale).ticks(5))
			.selectAll('text')
			.style('fill', 'oklch(0.5 0.134 242.749)')
			.style('font-size', '12px');

		// Style axis lines
		g.selectAll('.domain')
			.style('stroke', 'oklch(0.828 0.111 230.318)')
			.style('stroke-width', '1px');

		g.selectAll('.tick line')
			.style('stroke', 'oklch(0.901 0.058 230.902)')
			.style('stroke-width', '1px');

		// Add area
		g.append('path').datum(dailyData).attr('fill', 'url(#area-gradient)').attr('d', area);

		// Add line
		g.append('path')
			.datum(dailyData)
			.attr('fill', 'none')
			.attr('stroke', 'oklch(0.685 0.169 237.323)')
			.attr('stroke-width', 3)
			.attr('d', line);

		// Add interactive dots
		g.selectAll('.dot')
			.data(dailyData)
			.enter()
			.append('circle')
			.attr('class', 'dot')
			.attr('cx', (d) => xScale(d.date))
			.attr('cy', (d) => yScale(d.commits))
			.attr('r', 4)
			.attr('fill', 'oklch(0.685 0.169 237.323)')
			.attr('stroke', 'white')
			.attr('stroke-width', 2)
			.style('cursor', 'pointer')
			.on('mouseover', function (event, d) {
				d3.select(this).transition().duration(200).attr('r', 6);

				// Tooltip
				const tooltip = d3
					.select('body')
					.append('div')
					.attr('class', 'tooltip')
					.style('position', 'absolute')
					.style('background', 'rgba(0, 0, 0, 0.8)')
					.style('color', 'white')
					.style('padding', '8px 12px')
					.style('border-radius', '8px')
					.style('font-size', '14px')
					.style('pointer-events', 'none')
					.style('z-index', '1000');

				tooltip
					.html(`${d.commits} commits<br>${d3.timeFormat('%B %d, %Y')(d.date)}`)
					.style('left', event.pageX + 10 + 'px')
					.style('top', event.pageY - 10 + 'px');
			})
			.on('mouseout', function () {
				d3.select(this).transition().duration(200).attr('r', 4);

				d3.selectAll('.tooltip').remove();
			});

		// Add labels only if there's enough space
		if (width > 400) {
			g.append('text')
				.attr('transform', 'rotate(-90)')
				.attr('y', 0 - margin.left + 10)
				.attr('x', 0 - height / 2)
				.attr('dy', '1em')
				.style('text-anchor', 'middle')
				.style('fill', 'oklch(0.5 0.134 242.749)')
				.style('font-size', '12px')
				.style('font-weight', '500')
				.text('Commits');

			g.append('text')
				.attr('transform', `translate(${width / 2}, ${height + margin.bottom - 5})`)
				.style('text-anchor', 'middle')
				.style('fill', 'oklch(0.5 0.134 242.749)')
				.style('font-size', '12px')
				.style('font-weight', '500')
				.text('Date');
		}
	}
</script>

<div class="w-full overflow-hidden">
	<div bind:this={chartContainer} class="flex h-64 w-full items-center justify-center">
		{#if !data || !data.timeAnalytics}
			<div class="font-medium text-primary-500">No timeline data available</div>
		{/if}
	</div>
</div>
