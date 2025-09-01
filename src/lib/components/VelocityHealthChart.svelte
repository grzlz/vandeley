<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    
    export let data;
    
    let chartContainer;
    
    onMount(() => {
        createVelocityChart();
        
        // Add resize listener
        const resizeHandler = () => createVelocityChart();
        window.addEventListener('resize', resizeHandler);
        return () => window.removeEventListener('resize', resizeHandler);
    });
    
    function createVelocityChart() {
        // Get container width dynamically
        const containerWidth = chartContainer.clientWidth || 600;
        const margin = { top: 30, right: containerWidth > 500 ? 100 : 20, bottom: 50, left: 70 };
        const width = Math.max(300, containerWidth - margin.left - margin.right);
        const height = 250 - margin.top - margin.bottom;
        
        d3.select(chartContainer).selectAll("*").remove();
        
        const svg = d3.select(chartContainer)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);
        
        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
        
        // Prepare velocity health data
        const velocityMetrics = [
            {
                category: 'Context Switching',
                current: data.contextSwitching.penaltyScore,
                ideal: 30,
                description: 'Developer focus disruption'
            },
            {
                category: 'Knowledge Silos',
                current: data.knowledgeSilos.riskScore,
                ideal: 25,
                description: 'Bus factor and expertise concentration'
            },
            {
                category: 'Onboarding Time',
                current: data.onboardingComplexity.complexityScore,
                ideal: 40,
                description: 'New contributor ramp-up complexity'
            }
        ];
        
        // Create scales
        const yScale = d3.scaleBand()
            .domain(velocityMetrics.map(d => d.category))
            .range([0, height])
            .padding(0.3);
        
        const xScale = d3.scaleLinear()
            .domain([0, 100])
            .range([0, width]);
        
        // Add background bars (ideal thresholds)
        g.selectAll(".ideal-bar")
            .data(velocityMetrics)
            .enter().append("rect")
            .attr("class", "ideal-bar")
            .attr("x", 0)
            .attr("y", d => yScale(d.category))
            .attr("width", d => xScale(d.ideal))
            .attr("height", yScale.bandwidth())
            .attr("fill", "oklch(0.7 0.15 142)")
            .attr("opacity", 0.3);
        
        // Add current value bars
        const currentBars = g.selectAll(".current-bar")
            .data(velocityMetrics)
            .enter().append("rect")
            .attr("class", "current-bar")
            .attr("x", 0)
            .attr("y", d => yScale(d.category))
            .attr("width", 0)
            .attr("height", yScale.bandwidth())
            .attr("fill", d => getVelocityColor(d.current, d.ideal))
            .style("cursor", "pointer");
        
        // Animate current bars
        currentBars.transition()
            .duration(1000)
            .delay((d, i) => i * 200)
            .attr("width", d => xScale(d.current));
        
        // Add value labels
        g.selectAll(".value-label")
            .data(velocityMetrics)
            .enter().append("text")
            .attr("class", "value-label")
            .attr("x", d => xScale(d.current) + 5)
            .attr("y", d => yScale(d.category) + yScale.bandwidth() / 2)
            .attr("dy", "0.35em")
            .style("fill", "oklch(0.5 0.134 242.749)")
            .style("font-size", "12px")
            .style("font-weight", "600")
            .style("opacity", 0)
            .text(d => Math.round(d.current))
            .transition()
            .delay(1000)
            .duration(400)
            .style("opacity", 1);
        
        // Add category labels
        g.selectAll(".category-label")
            .data(velocityMetrics)
            .enter().append("text")
            .attr("class", "category-label")
            .attr("x", -10)
            .attr("y", d => yScale(d.category) + yScale.bandwidth() / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "end")
            .style("fill", "oklch(0.5 0.134 242.749)")
            .style("font-size", "14px")
            .style("font-weight", "500")
            .text(d => d.category);
        
        // Add axis
        g.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .style("fill", "oklch(0.5 0.134 242.749)")
            .style("font-size", "12px");
        
        // Style axis
        g.selectAll(".domain")
            .style("stroke", "oklch(0.828 0.111 230.318)")
            .style("stroke-width", "1px");
        
        g.selectAll(".tick line")
            .style("stroke", "oklch(0.901 0.058 230.902)")
            .style("stroke-width", "1px");
        
        // Add chart title only if there's enough space
        if (width > 400) {
            g.append("text")
                .attr("x", width / 2)
                .attr("y", -15)
                .attr("text-anchor", "middle")
                .style("fill", "oklch(0.5 0.134 242.749)")
                .style("font-size", "14px")
                .style("font-weight", "600")
                .text(width > 500 ? "Velocity Health Metrics (Lower is Better)" : "Velocity Health");
        }
        
        // Add legend only if there's enough space
        if (containerWidth > 500) {
            const legend = g.append("g")
                .attr("transform", `translate(${width + 20}, 20)`);
            
            legend.append("rect")
                .attr("width", 12)
                .attr("height", 12)
                .attr("fill", "oklch(0.7 0.15 142)")
                .attr("opacity", 0.3)
                .attr("rx", 2);
            
            legend.append("text")
                .attr("x", 16)
                .attr("y", 9)
                .style("fill", "oklch(0.5 0.134 242.749)")
                .style("font-size", "11px")
                .style("font-weight", "500")
                .text("Ideal");
            
            legend.append("rect")
                .attr("y", 20)
                .attr("width", 12)
                .attr("height", 12)
                .attr("fill", "oklch(0.65 0.15 45)")
                .attr("rx", 2);
            
            legend.append("text")
                .attr("x", 16)
                .attr("y", 29)
                .style("fill", "oklch(0.5 0.134 242.749)")
                .style("font-size", "11px")
                .style("font-weight", "500")
                .text("Current");
        }
        
        // Add interactions
        currentBars.on("mouseover", function(event, d) {
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
                    .style("box-shadow", "0 4px 20px rgba(0,0,0,0.3)")
                    .style("max-width", "250px");
                
                const status = d.current <= d.ideal ? 'Good' : 'Needs Attention';
                
                tooltip.html(`
                    <div style="font-weight: bold; margin-bottom: 8px;">${d.category}</div>
                    <div>Current: ${Math.round(d.current)}</div>
                    <div>Ideal: ≤${d.ideal}</div>
                    <div>Status: <span style="color: ${d.current <= d.ideal ? '#10b981' : '#f59e0b'}">${status}</span></div>
                    <div style="margin-top: 8px; font-size: 12px; opacity: 0.8;">${d.description}</div>
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
        
        // Add specific insights
        const insights = g.append("g")
            .attr("transform", `translate(0, ${height + 40})`);
        
        // Knowledge silos insight
        const siloRisk = data.knowledgeSilos.busFactor.overall;
        let siloColor = "oklch(0.7 0.15 142)"; // green
        if (siloRisk === 'risky') siloColor = "oklch(0.55 0.15 25)"; // red
        else if (siloRisk === 'moderate') siloColor = "oklch(0.65 0.15 45)"; // orange
        
        insights.append("text")
            .attr("x", 0)
            .attr("y", 0)
            .style("fill", siloColor)
            .style("font-size", "12px")
            .style("font-weight", "600")
            .text(`Bus Factor: ${siloRisk} (${data.knowledgeSilos.busFactor.average} avg)`);
        
        // Context switching insight
        insights.append("text")
            .attr("x", 200)
            .attr("y", 0)
            .style("fill", "oklch(0.5 0.134 242.749)")
            .style("font-size", "12px")
            .text(`High Context Switching: ${data.contextSwitching.switchingRatio.toFixed(1)}% of sessions`);
        
        // Onboarding insight
        insights.append("text")
            .attr("x", 400)
            .attr("y", 0)
            .style("fill", "oklch(0.5 0.134 242.749)")
            .style("font-size", "12px")
            .text(`Avg Ramp-up: ${data.onboardingComplexity.averageRampUpDays} days`);
    }
    
    function getVelocityColor(current, ideal) {
        if (current <= ideal) return "oklch(0.7 0.15 142)"; // Green - good
        if (current <= ideal * 1.5) return "oklch(0.75 0.15 65)"; // Yellow - moderate
        if (current <= ideal * 2) return "oklch(0.65 0.15 45)"; // Orange - concerning
        return "oklch(0.55 0.15 25)"; // Red - critical
    }
</script>

<div class="w-full overflow-hidden">
    <div bind:this={chartContainer} class="w-full h-72 flex items-center justify-center">
        {#if !data}
            <div class="text-primary-500 font-medium">No velocity health data available</div>
        {/if}
    </div>
</div>