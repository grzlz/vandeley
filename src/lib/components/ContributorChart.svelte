<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	export let contributors;

	let chartContainer;

	onMount(() => {
		createChart();

		// Add resize listener
		const resizeHandler = () => createChart();
		window.addEventListener('resize', resizeHandler);
		return () => window.removeEventListener('resize', resizeHandler);
	});

	function createChart() {
		if (!contributors || contributors.length === 0) return;

		// Get container width dynamically
		const containerWidth = chartContainer.clientWidth || 500;
		const margin = { top: 20, right: 15, bottom: 50, left: 50 };
		const width = Math.max(300, containerWidth - margin.left - margin.right);
		const height = 250 - margin.top - margin.bottom;

		d3.select(chartContainer).selectAll('*').remove();

		const svg = d3
			.select(chartContainer)
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom);

		const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

		// Sort contributors by commits - limit based on available space
		const maxContributors = Math.min(8, Math.floor(width / 60));
		const sortedContributors = [...contributors]
			.sort((a, b) => b.totalCommits - a.totalCommits)
			.slice(0, maxContributors);

		// Create scales
		const xScale = d3
			.scaleBand()
			.domain(sortedContributors.map((d) => d.name))
			.range([0, width])
			.padding(0.2);

		const yScale = d3
			.scaleLinear()
			.domain([0, d3.max(sortedContributors, (d) => d.totalCommits)])
			.range([height, 0])
			.nice();

		// Create color scale
		const colorScale = d3
			.scaleSequential(d3.interpolateViridis)
			.domain([0, sortedContributors.length - 1]);

		// Add axes
		g.append('g')
			.attr('transform', `translate(0,${height})`)
			.call(d3.axisBottom(xScale))
			.selectAll('text')
			.style('fill', 'oklch(0.5 0.134 242.749)')
			.style('font-size', '11px')
			.attr('transform', width < 500 ? 'rotate(-45)' : 'rotate(0)')
			.style('text-anchor', width < 500 ? 'end' : 'middle')
			.text((d) => {
				// Truncate long names on small screens
				return width < 400 && d.length > 8 ? d.substring(0, 8) + '...' : d;
			});

		g.append('g')
			.call(d3.axisLeft(yScale))
			.selectAll('text')
			.style('fill', 'oklch(0.5 0.134 242.749)')
			.style('font-size', '12px');

		// Style axes
		g.selectAll('.domain')
			.style('stroke', 'oklch(0.828 0.111 230.318)')
			.style('stroke-width', '1px');

		g.selectAll('.tick line')
			.style('stroke', 'oklch(0.901 0.058 230.902)')
			.style('stroke-width', '1px');

		// Create bars
		const bars = g
			.selectAll('.bar')
			.data(sortedContributors)
			.enter()
			.append('rect')
			.attr('class', 'bar')
			.attr('x', (d) => xScale(d.name))
			.attr('width', xScale.bandwidth())
			.attr('y', height)
			.attr('height', 0)
			.attr('fill', (d, i) => colorScale(i))
			.style('cursor', 'pointer');

		// Animate bars
		bars
			.transition()
			.duration(800)
			.delay((d, i) => i * 100)
			.attr('y', (d) => yScale(d.totalCommits))
			.attr('height', (d) => height - yScale(d.totalCommits));

		// Add interaction
		bars
			.on('mouseover', function (event, d) {
				d3.select(this).transition().duration(200).attr('opacity', 0.8);

				// Enhanced tooltip
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

				tooltip
					.html(
						`
                    <div style="font-weight: bold; margin-bottom: 8px;">${d.name}</div>
                    <div>Commits: ${d.totalCommits}</div>
                    <div>Changes: ${d.totalChanges}</div>
                    <div>Files: ${d.filesModified}</div>
                    <div>Active Days: ${d.activeDays}</div>
                `
					)
					.style('left', event.pageX + 10 + 'px')
					.style('top', event.pageY - 10 + 'px');
			})
			.on('mouseout', function () {
				d3.select(this).transition().duration(200).attr('opacity', 1);

				d3.selectAll('.tooltip').remove();
			});

		// Add value labels on bars
		g.selectAll('.label')
			.data(sortedContributors)
			.enter()
			.append('text')
			.attr('class', 'label')
			.attr('x', (d) => xScale(d.name) + xScale.bandwidth() / 2)
			.attr('y', (d) => yScale(d.totalCommits) - 5)
			.attr('text-anchor', 'middle')
			.style('fill', 'oklch(0.5 0.134 242.749)')
			.style('font-size', '12px')
			.style('font-weight', '500')
			.style('opacity', 0)
			.text((d) => d.totalCommits)
			.transition()
			.delay(800)
			.duration(400)
			.style('opacity', 1);

		// Add axis labels only if there's enough space
		if (width > 400) {
			g.append('text')
				.attr('transform', 'rotate(-90)')
				.attr('y', 0 - margin.left + 15)
				.attr('x', 0 - height / 2)
				.attr('dy', '1em')
				.style('text-anchor', 'middle')
				.style('fill', 'oklch(0.5 0.134 242.749)')
				.style('font-size', '12px')
				.style('font-weight', '500')
				.text('Commits');

			g.append('text')
				.attr('transform', `translate(${width / 2}, ${height + margin.bottom - 10})`)
				.style('text-anchor', 'middle')
				.style('fill', 'oklch(0.5 0.134 242.749)')
				.style('font-size', '12px')
				.style('font-weight', '500')
				.text('Contributors');
		}
	}
</script>

<div class="w-full overflow-hidden">
	<div bind:this={chartContainer} class="flex h-64 w-full items-center justify-center">
		{#if !contributors || contributors.length === 0}
			<div class="font-medium text-primary-500">No contributor data available</div>
		{/if}
	</div>
</div>
