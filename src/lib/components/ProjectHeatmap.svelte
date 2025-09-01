<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    
    export let hotspots;
    
    let chartContainer;
    
    onMount(() => {
        createHeatmap();
        
        // Add resize listener for responsiveness
        const resizeHandler = () => {
            createHeatmap();
        };
        window.addEventListener('resize', resizeHandler);
        
        return () => {
            window.removeEventListener('resize', resizeHandler);
        };
    });
    
    function createHeatmap() {
        if (!hotspots || hotspots.length === 0) return;
        
        // Get container width dynamically
        const containerWidth = chartContainer.clientWidth || 600;
        const margin = { top: 20, right: 100, bottom: 60, left: 180 };
        const width = Math.max(400, containerWidth - margin.left - margin.right);
        const height = Math.max(300, Math.min(hotspots.length * 25, 400)) - margin.top - margin.bottom;
        
        d3.select(chartContainer).selectAll("*").remove();
        
        const svg = d3.select(chartContainer)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);
        
        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
        
        // Prepare data - show top files (limit for better display)
        const topHotspots = hotspots.slice(0, 12);
        
        // Create scales
        const yScale = d3.scaleBand()
            .domain(topHotspots.map(d => d.filename))
            .range([0, height])
            .padding(0.1);
        
        const xScale = d3.scaleLinear()
            .domain([0, d3.max(topHotspots, d => d.totalModifications)])
            .range([0, width])
            .nice();
        
        // Color scale based on modification frequency
        const colorScale = d3.scaleSequential()
            .domain([0, d3.max(topHotspots, d => d.totalModifications)])
            .interpolator(d3.interpolateReds);
        
        // Create gradient for each bar
        const defs = svg.append("defs");
        
        topHotspots.forEach((d, i) => {
            const gradient = defs.append("linearGradient")
                .attr("id", `gradient-${i}`)
                .attr("gradientUnits", "userSpaceOnUse")
                .attr("x1", "0%").attr("y1", "0%")
                .attr("x2", "100%").attr("y2", "0%");
            
            gradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", colorScale(0))
                .attr("stop-opacity", 0.8);
            
            gradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", colorScale(d.totalModifications))
                .attr("stop-opacity", 1);
        });
        
        // Create bars
        const bars = g.selectAll(".heatmap-bar")
            .data(topHotspots)
            .enter().append("rect")
            .attr("class", "heatmap-bar")
            .attr("x", 0)
            .attr("y", d => yScale(d.filename))
            .attr("width", 0)
            .attr("height", yScale.bandwidth())
            .attr("fill", (d, i) => `url(#gradient-${i})`)
            .style("cursor", "pointer");
        
        // Animate bars
        bars.transition()
            .duration(1000)
            .delay((d, i) => i * 50)
            .attr("width", d => xScale(d.totalModifications));
        
        // Add file labels
        g.selectAll(".file-label")
            .data(topHotspots)
            .enter().append("text")
            .attr("class", "file-label")
            .attr("x", -10)
            .attr("y", d => yScale(d.filename) + yScale.bandwidth() / 2)
            .attr("dy", "0.35em")
            .style("text-anchor", "end")
            .style("fill", "oklch(0.5 0.134 242.749)")
            .style("font-size", "12px")
            .style("font-family", "monospace")
            .text(d => {
                // Truncate long filenames based on available space
                const maxLength = Math.floor(margin.left / 6); // Approximate chars that fit
                return d.filename.length > maxLength 
                    ? "..." + d.filename.slice(-maxLength) 
                    : d.filename;
            });
        
        // Add value labels
        g.selectAll(".value-label")
            .data(topHotspots)
            .enter().append("text")
            .attr("class", "value-label")
            .attr("x", d => xScale(d.totalModifications) + 5)
            .attr("y", d => yScale(d.filename) + yScale.bandwidth() / 2)
            .attr("dy", "0.35em")
            .style("fill", "oklch(0.5 0.134 242.749)")
            .style("font-size", "11px")
            .style("font-weight", "500")
            .style("opacity", 0)
            .text(d => d.totalModifications)
            .transition()
            .delay(1000)
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
                    .style("box-shadow", "0 4px 20px rgba(0,0,0,0.3)")
                    .style("max-width", "300px");
                
                const fileExtension = d.filename.split('.').pop() || 'no extension';
                const totalChanges = d.totalInsertions + d.totalDeletions;
                const avgChangesPerModification = Math.round(totalChanges / d.totalModifications);
                
                tooltip.html(`
                    <div style="font-weight: bold; margin-bottom: 8px; word-break: break-all;">${d.filename}</div>
                    <div>Modifications: ${d.totalModifications}</div>
                    <div>Total Changes: ${totalChanges}</div>
                    <div>Avg Changes/Mod: ${avgChangesPerModification}</div>
                    <div>Contributors: ${d.authors}</div>
                    <div style="margin-top: 8px; font-size: 12px; opacity: 0.8;">File type: ${fileExtension}</div>
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
        
        // Add axis
        g.append("g")
            .attr("transform", `translate(0,${height})`)
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
        
        // Add axis label
        g.append("text")
            .attr("transform", `translate(${width / 2}, ${height + 40})`)
            .style("text-anchor", "middle")
            .style("fill", "oklch(0.5 0.134 242.749)")
            .style("font-size", "14px")
            .style("font-weight", "500")
            .text("Number of Modifications");
        
        // Add legend only if there's enough space
        if (width > 300) {
            const legendData = [
                { label: "Low", color: colorScale(d3.max(topHotspots, d => d.totalModifications) * 0.2) },
                { label: "Medium", color: colorScale(d3.max(topHotspots, d => d.totalModifications) * 0.6) },
                { label: "High", color: colorScale(d3.max(topHotspots, d => d.totalModifications)) }
            ];
            
            const legend = svg.append("g")
                .attr("transform", `translate(${margin.left + width - 80}, ${margin.top + 10})`);
            
            legend.selectAll(".legend-item")
                .data(legendData)
                .enter().append("g")
                .attr("class", "legend-item")
                .attr("transform", (d, i) => `translate(0, ${i * 18})`)
                .each(function(d) {
                    const item = d3.select(this);
                    
                    item.append("rect")
                        .attr("width", 12)
                        .attr("height", 12)
                        .attr("fill", d.color)
                        .attr("rx", 2);
                    
                    item.append("text")
                        .attr("x", 16)
                        .attr("y", 9)
                        .style("fill", "oklch(0.5 0.134 242.749)")
                        .style("font-size", "11px")
                        .style("font-weight", "500")
                        .text(d.label);
                });
        }
    }
</script>

<div class="w-full overflow-hidden">
    <div bind:this={chartContainer} class="w-full flex items-center justify-center overflow-x-auto">
        {#if !hotspots || hotspots.length === 0}
            <div class="text-primary-500 font-medium p-8">No file activity data available</div>
        {/if}
    </div>
</div>