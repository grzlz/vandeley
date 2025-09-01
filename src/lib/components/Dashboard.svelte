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
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="glass-accent rounded-2xl p-6">
            <div class="flex items-center justify-between mb-3">
                <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl 
                            flex items-center justify-center text-white text-xl">
                    📊
                </div>
                <span class="text-sm font-medium text-primary-600 bg-primary-100 px-3 py-1 rounded-full">
                    Total
                </span>
            </div>
            <div class="text-3xl font-bold text-primary-900 mb-1">
                {formatNumber(analytics.projectMetrics.totalCommits)}
            </div>
            <div class="text-primary-600 font-medium">
                Commits
            </div>
        </div>
        
        <div class="glass-accent rounded-2xl p-6">
            <div class="flex items-center justify-between mb-3">
                <div class="w-12 h-12 bg-gradient-to-br from-secondary-400 to-secondary-500 rounded-xl 
                            flex items-center justify-center text-white text-xl">
                    ⏱️
                </div>
                <span class="text-sm font-medium text-secondary-600 bg-secondary-100 px-3 py-1 rounded-full">
                    Estimated
                </span>
            </div>
            <div class="text-3xl font-bold text-secondary-900 mb-1">
                {formatHours(analytics.projectMetrics.totalEstimatedHours)}
            </div>
            <div class="text-secondary-600 font-medium">
                Work Time
            </div>
        </div>
        
        <div class="glass-accent rounded-2xl p-6">
            <div class="flex items-center justify-between mb-3">
                <div class="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-500 rounded-xl 
                            flex items-center justify-center text-white text-xl">
                    👥
                </div>
                <span class="text-sm font-medium text-primary-600 bg-primary-100 px-3 py-1 rounded-full">
                    Active
                </span>
            </div>
            <div class="text-3xl font-bold text-primary-900 mb-1">
                {analytics.projectMetrics.totalContributors}
            </div>
            <div class="text-primary-600 font-medium">
                {analytics.projectMetrics.totalContributors === 1 ? 'Contributor' : 'Contributors'}
            </div>
        </div>
        
        <div class="glass-accent rounded-2xl p-6">
            <div class="flex items-center justify-between mb-3">
                <div class="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl 
                            flex items-center justify-center text-white text-xl">
                    📁
                </div>
                <span class="text-sm font-medium text-secondary-600 bg-secondary-100 px-3 py-1 rounded-full">
                    Modified
                </span>
            </div>
            <div class="text-3xl font-bold text-secondary-900 mb-1">
                {formatNumber(analytics.projectMetrics.totalFiles)}
            </div>
            <div class="text-secondary-600 font-medium">
                Files
            </div>
        </div>
    </div>
    
    <!-- Session Insights -->
    <div class="glass-accent rounded-2xl p-8">
        <h2 class="text-2xl font-bold text-primary-900 mb-6 flex items-center gap-3">
            <span class="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg 
                         flex items-center justify-center text-white text-sm">🔥</span>
            Work Sessions Insights
        </h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div>
                <h3 class="text-lg font-semibold text-primary-800 mb-4">Session Summary</h3>
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
                <h3 class="text-lg font-semibold text-primary-800 mb-4">Work Schedule</h3>
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
                <h3 class="text-lg font-semibold text-primary-800 mb-4">Project Timeline</h3>
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
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Timeline Chart -->
        <div class="glass-accent rounded-2xl p-8">
            <h3 class="text-xl font-bold text-primary-900 mb-6 flex items-center gap-3">
                <span class="w-6 h-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded 
                             flex items-center justify-center text-white text-xs">📈</span>
                Commit Timeline
            </h3>
            <TimeChart data={analytics} />
        </div>
        
        <!-- Contributors Chart -->
        <div class="glass-accent rounded-2xl p-8">
            <h3 class="text-xl font-bold text-primary-900 mb-6 flex items-center gap-3">
                <span class="w-6 h-6 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded 
                             flex items-center justify-center text-white text-xs">👤</span>
                Contributors
            </h3>
            <ContributorChart contributors={analytics.contributors} />
        </div>
    </div>
    
    <!-- File Heatmap -->
    <div class="glass-accent rounded-2xl p-8">
        <h3 class="text-xl font-bold text-primary-900 mb-6 flex items-center gap-3">
            <span class="w-6 h-6 bg-gradient-to-br from-primary-600 to-secondary-500 rounded 
                         flex items-center justify-center text-white text-xs">🔥</span>
            File Activity Heatmap
        </h3>
        <ProjectHeatmap hotspots={analytics.projectEvolution.hotspots} />
    </div>
    
    <!-- Top Contributors Detail -->
    {#if analytics.contributors.length > 0}
    <div class="glass-accent rounded-2xl p-8">
        <h3 class="text-xl font-bold text-primary-900 mb-6 flex items-center gap-3">
            <span class="w-6 h-6 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded 
                         flex items-center justify-center text-white text-xs">🏆</span>
            Top Contributors
        </h3>
        
        <div class="space-y-6">
            {#each analytics.contributors.slice(0, 3) as contributor, index}
            <div class="flex items-center gap-6 p-4 bg-primary-50/50 rounded-xl">
                <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 
                            rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {index + 1}
                </div>
                
                <div class="flex-1">
                    <h4 class="font-semibold text-primary-900 text-lg">{contributor.name}</h4>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
                        <div>
                            <span class="text-primary-600">Commits:</span>
                            <span class="font-semibold text-primary-900 ml-1">
                                {formatNumber(contributor.totalCommits)}
                            </span>
                        </div>
                        <div>
                            <span class="text-primary-600">Changes:</span>
                            <span class="font-semibold text-primary-900 ml-1">
                                {formatNumber(contributor.totalChanges)}
                            </span>
                        </div>
                        <div>
                            <span class="text-primary-600">Files:</span>
                            <span class="font-semibold text-primary-900 ml-1">
                                {contributor.filesModified}
                            </span>
                        </div>
                        <div>
                            <span class="text-primary-600">Active Days:</span>
                            <span class="font-semibold text-primary-900 ml-1">
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