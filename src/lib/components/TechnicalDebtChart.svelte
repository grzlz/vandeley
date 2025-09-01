<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    
    export let data;
    
    let chartContainer;
    
    onMount(() => {
        createDebtChart();
        
        // Add resize listener
        const resizeHandler = () => createDebtChart();
        window.addEventListener('resize', resizeHandler);
        return () => window.removeEventListener('resize', resizeHandler);
    });
    
    function createDebtChart() {
        // Get container width dynamically
        const containerWidth = chartContainer.clientWidth || 500;
        const margin = { top: 20, right: 15, bottom: 50, left: 50 };
        const width = Math.max(300, containerWidth - margin.left - margin.right);
        const height = 250 - margin.top - margin.bottom;
        
        d3.select(chartContainer).selectAll("*").remove();
        
        const svg = d3.select(chartContainer)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);
        
        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
        
        // Prepare data for the chart
        const metrics = [
            { name: 'Hotspot\nConcentration', value: data.hotspotConcentrationRatio, max: 100 },
            { name: 'Code Churn\nRate', value: data.averageChurnRate * 10, max: 50 },
            { name: 'Refactoring\nRatio', value: data.refactoringRatio, max: 100 },
            { name: 'Technical\nDebt Score', value: data.technicalDebtScore, max: 100 }
        ];
        
        // Create scales
        const xScale = d3.scaleBand()
            .domain(metrics.map(d => d.name))
            .range([0, width])
            .padding(0.2);
        
        const yScale = d3.scaleLinear()
            .domain([0, 100])
            .range([height, 0]);
        
        // Color scale based on severity
        const colorScale = d3.scaleThreshold()
            .domain([30, 60, 80])
            .range([
                "oklch(0.7 0.15 142)",   // Green - good
                "oklch(0.75 0.15 65)",   // Yellow - moderate
                "oklch(0.65 0.15 45)",   // Orange - concerning
                "oklch(0.55 0.15 25)"    // Red - critical
            ]);
        
        // Add axes
        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .style("fill", "oklch(0.5 0.134 242.749)")
            .style("font-size", "12px")
            .style("text-anchor", "middle");
        
        g.append("g")
            .call(d3.axisLeft(yScale))
            .selectAll("text")
            .style("fill", "oklch(0.5 0.134 242.749)")
            .style("font-size", "12px");
        
        // Style axes
        g.selectAll(".domain")
            .style("stroke", "oklch(0.828 0.111 230.318)")
            .style("stroke-width", "1px");
        
        g.selectAll(".tick line")
            .style("stroke", "oklch(0.901 0.058 230.902)")
            .style("stroke-width", "1px");
        
        // Create bars
        const bars = g.selectAll(".debt-bar")
            .data(metrics)
            .enter().append("rect")
            .attr("class", "debt-bar")
            .attr("x", d => xScale(d.name))
            .attr("width", xScale.bandwidth())
            .attr("y", height)
            .attr("height", 0)
            .attr("fill", d => colorScale(d.value))
            .style("cursor", "pointer");
        
        // Animate bars
        bars.transition()
            .duration(800)
            .delay((d, i) => i * 100)
            .attr("y", d => yScale(d.value))
            .attr("height", d => height - yScale(d.value));
        
        // Add value labels
        g.selectAll(".debt-label")
            .data(metrics)
            .enter().append("text")
            .attr("class", "debt-label")
            .attr("x", d => xScale(d.name) + xScale.bandwidth() / 2)
            .attr("y", d => yScale(d.value) - 5)
            .attr("text-anchor", "middle")
            .style("fill", "oklch(0.5 0.134 242.749)")
            .style("font-size", "12px")
            .style("font-weight", "500")
            .style("opacity", 0)
            .text(d => Math.round(d.value))
            .transition()
            .delay(800)
            .duration(400)
            .style("opacity", 1);
        
        // Add interaction
        bars.on("mouseover", function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("opacity", 0.8);
                
                const tooltip = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("position", "absolute")
                    .style("background", "rgba(0, 0, 0, 0.9)")
                    .style("color", "white")
                    .style("padding", "12px 16px")
                    .style("border-radius", "8px")
                    .style("font-size", "14px")
                    .style("pointer-events", "none")
                    .style("z-index", "1000")
                    .style("box-shadow", "0 4px 20px rgba(0,0,0,0.3)");
                
                let description = '';
                switch(d.name.replace('\n', ' ')) {
                    case 'Hotspot Concentration':
                        description = 'Percentage of changes concentrated in top 10% of files';
                        break;
                    case 'Code Churn Rate':
                        description = 'Average modifications per file per day';
                        break;
                    case 'Refactoring Ratio':
                        description = 'Percentage of commits focused on refactoring';
                        break;
                    case 'Technical Debt Score':
                        description = 'Overall technical debt assessment (0-100)';
                        break;
                }
                
                tooltip.html(`
                    <div style="font-weight: bold; margin-bottom: 8px;">${d.name.replace('\n', ' ')}</div>
                    <div>Value: ${Math.round(d.value * 10) / 10}</div>
                    <div style="margin-top: 8px; font-size: 12px; opacity: 0.8;">${description}</div>
                `)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 10) + "px");
            })
            .on("mouseout", function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("opacity", 1);
                
                d3.selectAll(".tooltip").remove();
            });
        
        // Add chart title only if there's enough space
        if (width > 400) {
            g.append("text")
                .attr("x", width / 2)
                .attr("y", -5)
                .attr("text-anchor", "middle")
                .style("fill", "oklch(0.5 0.134 242.749)")
                .style("font-size", "14px")
                .style("font-weight", "600")
                .text("Technical Debt Metrics");
        }
    }
</script>

<div class="w-full overflow-hidden">
    <div bind:this={chartContainer} class="w-full h-64 flex items-center justify-center">
        {#if !data}
            <div class="text-primary-500 font-medium">No technical debt data available</div>
        {/if}
    </div>
</div>