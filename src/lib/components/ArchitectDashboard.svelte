<script>
    import ArchitectureHealthScore from './ArchitectureHealthScore.svelte';
    import TechnicalDebtChart from './TechnicalDebtChart.svelte';
    import ScalingReadinessChart from './ScalingReadinessChart.svelte';
    import VelocityHealthChart from './VelocityHealthChart.svelte';
    
    export let architectAnalytics;
    
    function getSeverityColor(severity) {
        switch (severity) {
            case 'critical': return 'from-red-500 to-red-600';
            case 'high': return 'from-orange-500 to-orange-600';
            case 'medium': return 'from-yellow-500 to-yellow-600';
            default: return 'from-blue-500 to-blue-600';
        }
    }
    
    function getSeverityIcon(severity) {
        switch (severity) {
            case 'critical': return '🚨';
            case 'high': return '⚠️';
            case 'medium': return '⚡';
            default: return '💡';
        }
    }
    
    function formatScore(score) {
        return Math.round(score);
    }
</script>

<div class="space-y-8">
    <!-- Architecture Health Overview -->
    <div class="glass-accent rounded-2xl p-8">
        <h2 class="text-2xl font-bold text-primary-900 mb-6 flex items-center gap-3">
            <span class="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg 
                         flex items-center justify-center text-white text-sm">🏗️</span>
            Architecture Health Overview
        </h2>
        
        <ArchitectureHealthScore analytics={architectAnalytics} />
    </div>
    
    <!-- Key Architecture KPIs -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Technical Debt Score -->
        <div class="glass-accent rounded-2xl p-6">
            <div class="flex items-center justify-between mb-3">
                <div class="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl 
                            flex items-center justify-center text-white text-xl">
                    ⚠️
                </div>
                <span class="text-sm font-medium text-red-600 bg-red-100 px-3 py-1 rounded-full">
                    Debt
                </span>
            </div>
            <div class="text-3xl font-bold text-red-900 mb-1">
                {formatScore(architectAnalytics.technicalDebt.technicalDebtScore)}
            </div>
            <div class="text-red-600 font-medium mb-2">
                Technical Debt Score
            </div>
            <div class="text-sm text-red-700">
                Hotspot Concentration: {formatScore(architectAnalytics.technicalDebt.hotspotConcentrationRatio)}%
            </div>
        </div>
        
        <!-- Scaling Readiness Score -->
        <div class="glass-accent rounded-2xl p-6">
            <div class="flex items-center justify-between mb-3">
                <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl 
                            flex items-center justify-center text-white text-xl">
                    📈
                </div>
                <span class="text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
                    Scale
                </span>
            </div>
            <div class="text-3xl font-bold text-green-900 mb-1">
                {formatScore(architectAnalytics.scalingReadiness.scalingReadinessScore)}
            </div>
            <div class="text-green-600 font-medium mb-2">
                Scaling Readiness
            </div>
            <div class="text-sm text-green-700">
                Coordination Overhead: {formatScore(architectAnalytics.scalingReadiness.coordinationOverhead.overheadScore)}
            </div>
        </div>
        
        <!-- Velocity Health Score -->
        <div class="glass-accent rounded-2xl p-6">
            <div class="flex items-center justify-between mb-3">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl 
                            flex items-center justify-center text-white text-xl">
                    ⚡
                </div>
                <span class="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                    Velocity
                </span>
            </div>
            <div class="text-3xl font-bold text-blue-900 mb-1">
                {formatScore(architectAnalytics.velocityHealth.velocityScore)}
            </div>
            <div class="text-blue-600 font-medium mb-2">
                Engineering Velocity
            </div>
            <div class="text-sm text-blue-700">
                Bus Factor Risk: {architectAnalytics.velocityHealth.knowledgeSilos.busFactor.overall}
            </div>
        </div>
        
        <!-- Scale Transition Score -->
        <div class="glass-accent rounded-2xl p-6">
            <div class="flex items-center justify-between mb-3">
                <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl 
                            flex items-center justify-center text-white text-xl">
                    🚀
                </div>
                <span class="text-sm font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                    Transition
                </span>
            </div>
            <div class="text-3xl font-bold text-purple-900 mb-1">
                {formatScore(architectAnalytics.transitionMetrics.scaleReadinessScore)}
            </div>
            <div class="text-purple-600 font-medium mb-2">
                MVP → Scale Ready
            </div>
            <div class="text-sm text-purple-700 capitalize">
                Phase: {architectAnalytics.transitionMetrics.transitionPhase.replace('-', ' ')}
            </div>
        </div>
    </div>
    
    <!-- Detailed Analytics Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Technical Debt Analysis -->
        <div class="glass-accent rounded-2xl p-8">
            <h3 class="text-xl font-bold text-primary-900 mb-6 flex items-center gap-3">
                <span class="w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 rounded 
                             flex items-center justify-center text-white text-xs">🔥</span>
                Technical Debt Analysis
            </h3>
            <TechnicalDebtChart data={architectAnalytics.technicalDebt} />
        </div>
        
        <!-- Scaling Readiness -->
        <div class="glass-accent rounded-2xl p-8">
            <h3 class="text-xl font-bold text-primary-900 mb-6 flex items-center gap-3">
                <span class="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded 
                             flex items-center justify-center text-white text-xs">📊</span>
                Scaling Readiness
            </h3>
            <ScalingReadinessChart data={architectAnalytics.scalingReadiness} />
        </div>
    </div>
    
    <!-- Knowledge Silos & Context Switching -->
    <div class="glass-accent rounded-2xl p-8">
        <h3 class="text-xl font-bold text-primary-900 mb-6 flex items-center gap-3">
            <span class="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded 
                         flex items-center justify-center text-white text-xs">🧠</span>
            Engineering Velocity Health
        </h3>
        <VelocityHealthChart data={architectAnalytics.velocityHealth} />
    </div>
    
    <!-- Architecture Recommendations -->
    <div class="glass-accent rounded-2xl p-8">
        <h3 class="text-xl font-bold text-primary-900 mb-6 flex items-center gap-3">
            <span class="w-6 h-6 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded 
                         flex items-center justify-center text-white text-xs">💡</span>
            Architecture Recommendations
        </h3>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Technical Debt Recommendations -->
            <div>
                <h4 class="text-lg font-semibold text-primary-800 mb-4 flex items-center gap-2">
                    <span class="text-red-500">⚠️</span>
                    Technical Debt
                </h4>
                <div class="space-y-3">
                    {#each architectAnalytics.technicalDebt.recommendations as rec}
                    <div class="p-4 bg-gradient-to-r {getSeverityColor(rec.severity)} bg-opacity-10 
                                rounded-lg border border-gray-200">
                        <div class="flex items-start gap-3">
                            <span class="text-lg">{getSeverityIcon(rec.severity)}</span>
                            <div class="flex-1">
                                <h5 class="font-semibold text-primary-900 mb-1">{rec.title}</h5>
                                <p class="text-sm text-primary-700 mb-2">{rec.description}</p>
                                <p class="text-xs text-primary-600 font-medium">{rec.action}</p>
                            </div>
                        </div>
                    </div>
                    {/each}
                </div>
            </div>
            
            <!-- Scaling Recommendations -->
            <div>
                <h4 class="text-lg font-semibold text-primary-800 mb-4 flex items-center gap-2">
                    <span class="text-green-500">📈</span>
                    Scaling Readiness
                </h4>
                <div class="space-y-3">
                    {#each architectAnalytics.scalingReadiness.scalingRecommendations as rec}
                    <div class="p-4 bg-gradient-to-r {getSeverityColor(rec.severity)} bg-opacity-10 
                                rounded-lg border border-gray-200">
                        <div class="flex items-start gap-3">
                            <span class="text-lg">{getSeverityIcon(rec.severity)}</span>
                            <div class="flex-1">
                                <h5 class="font-semibold text-primary-900 mb-1">{rec.title}</h5>
                                <p class="text-sm text-primary-700 mb-2">{rec.description}</p>
                                <p class="text-xs text-primary-600 font-medium">{rec.action}</p>
                            </div>
                        </div>
                    </div>
                    {/each}
                </div>
            </div>
        </div>
        
        <!-- Transition Recommendations -->
        <div class="mt-8">
            <h4 class="text-lg font-semibold text-primary-800 mb-4 flex items-center gap-2">
                <span class="text-purple-500">🚀</span>
                MVP to Scale Transition
            </h4>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {#each architectAnalytics.transitionMetrics.transitionRecommendations as rec}
                <div class="p-4 bg-gradient-to-r {getSeverityColor(rec.severity)} bg-opacity-10 
                            rounded-lg border border-gray-200">
                    <div class="flex items-start gap-3">
                        <span class="text-lg">{getSeverityIcon(rec.severity)}</span>
                        <div class="flex-1">
                            <h5 class="font-semibold text-primary-900 mb-1">{rec.title}</h5>
                            <p class="text-sm text-primary-700 mb-2">{rec.description}</p>
                            <p class="text-xs text-primary-600 font-medium">{rec.action}</p>
                        </div>
                    </div>
                </div>
                {/each}
            </div>
        </div>
    </div>
    
    <!-- Architecture Metrics Detail -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Commit Patterns -->
        <div class="glass-accent rounded-2xl p-8">
            <h3 class="text-xl font-bold text-primary-900 mb-6 flex items-center gap-3">
                <span class="w-6 h-6 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded 
                             flex items-center justify-center text-white text-xs">📝</span>
                Commit Patterns Analysis
            </h3>
            
            <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div class="text-center p-4 bg-primary-50 rounded-lg">
                        <div class="text-2xl font-bold text-primary-900">
                            {formatScore(architectAnalytics.technicalDebt.commitPatterns.featureRatio)}%
                        </div>
                        <div class="text-sm text-primary-600">Feature Work</div>
                    </div>
                    <div class="text-center p-4 bg-secondary-50 rounded-lg">
                        <div class="text-2xl font-bold text-secondary-900">
                            {formatScore(architectAnalytics.technicalDebt.commitPatterns.refactorRatio)}%
                        </div>
                        <div class="text-sm text-secondary-600">Refactoring</div>
                    </div>
                </div>
                
                <div class="text-sm text-primary-700">
                    <p class="mb-2">
                        <strong>Feature Commits:</strong> {architectAnalytics.technicalDebt.commitPatterns.featureCommits}
                    </p>
                    <p class="mb-2">
                        <strong>Refactoring Commits:</strong> {architectAnalytics.technicalDebt.commitPatterns.refactoringCommits}
                    </p>
                    <p>
                        <strong>Bug Fix Commits:</strong> {architectAnalytics.technicalDebt.commitPatterns.bugfixCommits}
                    </p>
                </div>
            </div>
        </div>
        
        <!-- MVP Maturity Assessment -->
        <div class="glass-accent rounded-2xl p-8">
            <h3 class="text-xl font-bold text-primary-900 mb-6 flex items-center gap-3">
                <span class="w-6 h-6 bg-gradient-to-br from-purple-400 to-purple-600 rounded 
                             flex items-center justify-center text-white text-xs">🎯</span>
                MVP Maturity Assessment
            </h3>
            
            <div class="space-y-4">
                <div class="text-center">
                    <div class="text-4xl font-bold text-purple-900 mb-2">
                        {formatScore(architectAnalytics.transitionMetrics.mvpMaturity.maturityScore)}
                    </div>
                    <div class="text-purple-600 font-medium capitalize">
                        {architectAnalytics.transitionMetrics.mvpMaturity.developmentPhase} Phase
                    </div>
                </div>
                
                <div class="grid grid-cols-2 gap-3 text-sm">
                    <div class="p-3 bg-purple-50 rounded-lg">
                        <div class="font-semibold text-purple-900">Team Size</div>
                        <div class="text-purple-700">{architectAnalytics.transitionMetrics.mvpMaturity.teamSize} contributors</div>
                    </div>
                    <div class="p-3 bg-purple-50 rounded-lg">
                        <div class="font-semibold text-purple-900">Codebase Size</div>
                        <div class="text-purple-700">{architectAnalytics.transitionMetrics.mvpMaturity.codebaseSize} files</div>
                    </div>
                    <div class="p-3 bg-purple-50 rounded-lg">
                        <div class="font-semibold text-purple-900">Dev Duration</div>
                        <div class="text-purple-700">{architectAnalytics.transitionMetrics.mvpMaturity.developmentDuration} days</div>
                    </div>
                    <div class="p-3 bg-purple-50 rounded-lg">
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