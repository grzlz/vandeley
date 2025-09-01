export function analyzeMVPToScaleTransition(commits, projectEvolution, contributors) {
    // Component Coupling Evolution Analysis
    const couplingEvolution = analyzeCouplingEvolution(commits, projectEvolution);
    
    // Performance Debt Accumulation
    const performanceDebt = analyzePerformanceDebt(commits, projectEvolution.fileHistory);
    
    // Feature Flag Technical Debt
    const featureFlagDebt = analyzeFeatureFlagDebt(commits);
    
    // Infrastructure Drift Analysis
    const infrastructureDrift = analyzeInfrastructureDrift(commits, projectEvolution.fileHistory);
    
    // MVP Maturity Assessment
    const mvpMaturity = assessMVPMaturity(commits, contributors, projectEvolution);
    
    // Scale Readiness Score
    const scaleReadinessScore = calculateScaleReadinessScore({
        coupling: couplingEvolution.currentCouplingScore,
        performance: performanceDebt.debtScore,
        featureFlags: featureFlagDebt.debtScore,
        infrastructure: infrastructureDrift.driftScore,
        maturity: mvpMaturity.maturityScore
    });
    
    return {
        couplingEvolution,
        performanceDebt,
        featureFlagDebt,
        infrastructureDrift,
        mvpMaturity,
        scaleReadinessScore,
        transitionPhase: identifyTransitionPhase(scaleReadinessScore, mvpMaturity),
        transitionRecommendations: generateTransitionRecommendations({
            couplingEvolution,
            performanceDebt,
            featureFlagDebt,
            infrastructureDrift,
            mvpMaturity,
            scaleReadinessScore
        })
    };
}

function analyzeCouplingEvolution(commits, projectEvolution) {
    // Track how file relationships change over time
    const timeSlices = createCouplingTimeSlices(commits, 30); // 30-day slices
    const couplingTrend = [];
    
    timeSlices.forEach((slice, index) => {
        const sliceFiles = new Set();
        const filePairs = new Set();
        
        slice.commits.forEach(commit => {
            commit.filesChanged.forEach(file => {
                sliceFiles.add(file.filename);
            });
            
            // Files changed together indicate coupling
            if (commit.filesChanged.length > 1) {
                for (let i = 0; i < commit.filesChanged.length; i++) {
                    for (let j = i + 1; j < commit.filesChanged.length; j++) {
                        const pair = [commit.filesChanged[i].filename, commit.filesChanged[j].filename]
                            .sort().join('::');
                        filePairs.add(pair);
                    }
                }
            }
        });
        
        const couplingRatio = sliceFiles.size > 0 ? filePairs.size / sliceFiles.size : 0;
        
        couplingTrend.push({
            period: index,
            startDate: slice.startDate,
            endDate: slice.endDate,
            filesCount: sliceFiles.size,
            couplingPairs: filePairs.size,
            couplingRatio,
            commits: slice.commits.length
        });
    });
    
    // Calculate coupling trend direction
    const recentCoupling = couplingTrend.slice(-3).reduce((sum, t) => sum + t.couplingRatio, 0) / 3;
    const earlierCoupling = couplingTrend.slice(-6, -3).reduce((sum, t) => sum + t.couplingRatio, 0) / 3;
    const trendDirection = recentCoupling - earlierCoupling;
    
    const currentCouplingScore = Math.min(100, recentCoupling * 50);
    
    return {
        couplingTrend: couplingTrend.slice(-12), // Last 12 periods
        currentCouplingScore,
        trendDirection,
        evolutionPhase: getCouplingEvolutionPhase(currentCouplingScore, trendDirection),
        componentBoundaries: identifyComponentBoundaries(projectEvolution.fileHistory)
    };
}

function analyzePerformanceDebt(commits, fileHistory) {
    // Identify database/query/performance-related files and their change patterns
    const performanceFiles = fileHistory.filter(file => 
        isPerformanceRelatedFile(file.filename)
    );
    
    const performanceCommits = commits.filter(commit =>
        commit.filesChanged.some(file => isPerformanceRelatedFile(file.filename)) ||
        isPerformanceRelatedCommit(commit.message)
    );
    
    // Calculate performance debt accumulation over time
    const debtAccumulation = analyzeDebtAccumulation(performanceCommits);
    const hotspotPerformanceFiles = performanceFiles
        .filter(file => file.totalModifications > 3)
        .sort((a, b) => b.totalModifications - a.totalModifications)
        .slice(0, 10);
    
    const debtScore = calculatePerformanceDebtScore(performanceFiles, performanceCommits, commits.length);
    
    return {
        performanceFiles: performanceFiles.length,
        performanceCommits: performanceCommits.length,
        performanceRatio: (performanceCommits.length / commits.length) * 100,
        debtScore,
        hotspotPerformanceFiles,
        debtAccumulation,
        performancePatterns: identifyPerformancePatterns(performanceCommits)
    };
}

function analyzeFeatureFlagDebt(commits) {
    // Look for feature flag related code that hasn't been cleaned up
    const featureFlagCommits = commits.filter(commit => 
        isFeatureFlagRelated(commit.message) ||
        commit.filesChanged.some(file => isFeatureFlagFile(file.filename))
    );
    
    const flagIntroductions = featureFlagCommits.filter(commit => 
        commit.message.toLowerCase().includes('add') || 
        commit.message.toLowerCase().includes('implement')
    );
    
    const flagRemovals = featureFlagCommits.filter(commit =>
        commit.message.toLowerCase().includes('remove') ||
        commit.message.toLowerCase().includes('cleanup') ||
        commit.message.toLowerCase().includes('delete')
    );
    
    const flagDebtRatio = flagIntroductions.length > 0 
        ? 1 - (flagRemovals.length / flagIntroductions.length)
        : 0;
    
    const debtScore = Math.min(100, flagDebtRatio * 100 + (featureFlagCommits.length > 20 ? 20 : 0));
    
    return {
        totalFlagCommits: featureFlagCommits.length,
        flagIntroductions: flagIntroductions.length,
        flagRemovals: flagRemovals.length,
        flagDebtRatio,
        debtScore,
        flagActivity: analyzeFlagActivity(featureFlagCommits),
        cleanupOpportunities: identifyCleanupOpportunities(featureFlagCommits)
    };
}

function analyzeInfrastructureDrift(commits, fileHistory) {
    // Analyze deployment, configuration, and infrastructure file changes
    const infraFiles = fileHistory.filter(file => isInfrastructureFile(file.filename));
    const infraCommits = commits.filter(commit =>
        commit.filesChanged.some(file => isInfrastructureFile(file.filename))
    );
    
    // Calculate infrastructure change frequency
    const infraChangeFrequency = analyzeInfraChangeFrequency(infraCommits);
    const configurationDrift = analyzeConfigurationDrift(infraFiles, infraCommits);
    
    const driftScore = calculateInfrastructureDriftScore(infraChangeFrequency, configurationDrift);
    
    return {
        infraFiles: infraFiles.length,
        infraCommits: infraCommits.length,
        infraChangeRatio: (infraCommits.length / commits.length) * 100,
        driftScore,
        changeFrequency: infraChangeFrequency,
        configurationDrift,
        infraPatterns: identifyInfrastructurePatterns(infraCommits)
    };
}

function assessMVPMaturity(commits, contributors, projectEvolution) {
    // Assess how mature the MVP is and readiness for scaling
    const codebaseSize = projectEvolution.fileHistory.length;
    const developmentDuration = projectEvolution.projectAge / (1000 * 60 * 60 * 24); // days
    const teamSize = contributors.length;
    
    // Feature velocity analysis
    const featureCommits = commits.filter(commit => 
        commit.message.toLowerCase().includes('feat') ||
        commit.message.toLowerCase().includes('add') ||
        commit.message.toLowerCase().includes('implement')
    );
    
    const maintenanceCommits = commits.filter(commit =>
        commit.message.toLowerCase().includes('fix') ||
        commit.message.toLowerCase().includes('bug') ||
        commit.message.toLowerCase().includes('patch')
    );
    
    const featureMaintenanceRatio = featureCommits.length > 0 
        ? maintenanceCommits.length / featureCommits.length 
        : 0;
    
    // MVP maturity indicators
    const maturityIndicators = {
        codebaseStability: featureMaintenanceRatio < 0.5 ? 80 : Math.max(0, 80 - featureMaintenanceRatio * 100),
        teamGrowth: teamSize > 1 ? Math.min(100, teamSize * 20) : 20,
        developmentPace: Math.min(100, Math.max(0, 100 - (developmentDuration > 90 ? (developmentDuration - 90) : 0))),
        codebaseSize: codebaseSize > 50 ? Math.min(100, codebaseSize / 2) : codebaseSize * 2
    };
    
    const maturityScore = Object.values(maturityIndicators)
        .reduce((sum, score) => sum + score, 0) / Object.keys(maturityIndicators).length;
    
    return {
        maturityScore: Math.round(maturityScore),
        maturityIndicators,
        developmentPhase: identifyDevelopmentPhase(maturityScore),
        codebaseSize,
        developmentDuration: Math.round(developmentDuration),
        teamSize,
        featureMaintenanceRatio: Math.round(featureMaintenanceRatio * 100) / 100,
        scalingReadiness: assessScalingReadiness(maturityIndicators)
    };
}

// Helper functions
function createCouplingTimeSlices(commits, daysPerSlice) {
    if (commits.length === 0) return [];
    
    const sortedCommits = commits.sort((a, b) => a.timestamp - b.timestamp);
    const startTime = sortedCommits[0].timestamp;
    const endTime = sortedCommits[sortedCommits.length - 1].timestamp;
    const sliceDuration = daysPerSlice * 24 * 60 * 60 * 1000;
    const slices = [];
    
    for (let time = startTime; time <= endTime; time += sliceDuration) {
        const sliceCommits = sortedCommits.filter(commit => 
            commit.timestamp >= time && commit.timestamp < time + sliceDuration
        );
        
        if (sliceCommits.length > 0) {
            slices.push({
                startDate: new Date(time),
                endDate: new Date(time + sliceDuration),
                commits: sliceCommits
            });
        }
    }
    
    return slices;
}

function isPerformanceRelatedFile(filename) {
    const performanceIndicators = [
        'database', 'db', 'query', 'sql', 'migration', 'index',
        'cache', 'redis', 'memcache', 'performance', 'optimization',
        'schema', 'model', 'repository'
    ];
    
    return performanceIndicators.some(indicator => 
        filename.toLowerCase().includes(indicator)
    );
}

function isPerformanceRelatedCommit(message) {
    const performanceKeywords = [
        'performance', 'optimize', 'slow', 'query', 'database',
        'cache', 'index', 'speed', 'latency', 'memory'
    ];
    
    return performanceKeywords.some(keyword => 
        message.toLowerCase().includes(keyword)
    );
}

function isFeatureFlagRelated(message) {
    const flagKeywords = [
        'feature flag', 'feature toggle', 'flag', 'toggle',
        'experiment', 'a/b test', 'rollout'
    ];
    
    return flagKeywords.some(keyword => 
        message.toLowerCase().includes(keyword)
    );
}

function isFeatureFlagFile(filename) {
    const flagIndicators = ['flag', 'toggle', 'experiment', 'config'];
    return flagIndicators.some(indicator => 
        filename.toLowerCase().includes(indicator)
    );
}

function isInfrastructureFile(filename) {
    const infraIndicators = [
        'docker', 'kubernetes', 'k8s', 'deploy', 'config',
        'terraform', 'ansible', 'chef', 'puppet', 'helm',
        'yml', 'yaml', 'json', 'env', 'infrastructure'
    ];
    
    return infraIndicators.some(indicator => 
        filename.toLowerCase().includes(indicator)
    ) || filename.startsWith('.');
}

function getCouplingEvolutionPhase(score, trend) {
    if (score < 30 && trend < 0) return 'decoupling';
    if (score < 30) return 'loose-coupling';
    if (score < 60 && trend < 0) return 'improving';
    if (score < 60) return 'moderate-coupling';
    return 'tight-coupling';
}

function identifyComponentBoundaries(fileHistory) {
    const modules = {};
    
    fileHistory.forEach(file => {
        const pathParts = file.filename.split('/');
        const module = pathParts[0];
        
        if (!modules[module]) {
            modules[module] = {
                files: 0,
                modifications: 0
            };
        }
        
        modules[module].files++;
        modules[module].modifications += file.totalModifications;
    });
    
    return Object.entries(modules)
        .map(([name, stats]) => ({
            module: name,
            ...stats,
            avgModificationsPerFile: stats.files > 0 ? stats.modifications / stats.files : 0
        }))
        .sort((a, b) => b.modifications - a.modifications);
}

function calculateScaleReadinessScore(metrics) {
    const weights = {
        coupling: 0.25,      // Lower coupling = better scaling
        performance: 0.2,    // Lower debt = better scaling
        featureFlags: 0.15,  // Lower debt = better scaling
        infrastructure: 0.15, // Lower drift = better scaling
        maturity: 0.25       // Higher maturity = better scaling
    };
    
    // Normalize scores (higher is better for scaling)
    const couplingScore = Math.max(0, 100 - metrics.coupling);
    const performanceScore = Math.max(0, 100 - metrics.performance);
    const flagScore = Math.max(0, 100 - metrics.featureFlags);
    const infraScore = Math.max(0, 100 - metrics.infrastructure);
    const maturityScore = metrics.maturity;
    
    const totalScore = (
        couplingScore * weights.coupling +
        performanceScore * weights.performance +
        flagScore * weights.featureFlags +
        infraScore * weights.infrastructure +
        maturityScore * weights.maturity
    );
    
    return Math.round(totalScore);
}

function identifyTransitionPhase(scaleReadinessScore, mvpMaturity) {
    if (mvpMaturity.maturityScore < 40) return 'early-mvp';
    if (mvpMaturity.maturityScore < 70 && scaleReadinessScore < 50) return 'mvp-stabilization';
    if (scaleReadinessScore < 60) return 'pre-scale-preparation';
    if (scaleReadinessScore < 80) return 'scale-ready';
    return 'scale-optimized';
}

// Placeholder implementations for remaining helper functions
function analyzeDebtAccumulation(commits) {
    return { trend: 'increasing', rate: 5.2 };
}

function calculatePerformanceDebtScore(files, commits, totalCommits) {
    return Math.min(100, (commits.length / totalCommits) * 200);
}

function identifyPerformancePatterns(commits) {
    return [{ pattern: 'database-queries', frequency: commits.length }];
}

function analyzeFlagActivity(commits) {
    return { recent: commits.slice(-5), trend: 'stable' };
}

function identifyCleanupOpportunities(commits) {
    return commits.slice(0, 3).map(c => ({ commit: c.hash, opportunity: 'Remove old flag' }));
}

function analyzeInfraChangeFrequency(commits) {
    return { changesPerWeek: 2.3, trend: 'stable' };
}

function analyzeConfigurationDrift(files, commits) {
    return { driftScore: 25, configFiles: files.length };
}

function calculateInfrastructureDriftScore(frequency, drift) {
    return (frequency.changesPerWeek * 10) + drift.driftScore;
}

function identifyInfrastructurePatterns(commits) {
    return [{ pattern: 'frequent-config-changes', count: commits.length }];
}

function identifyDevelopmentPhase(maturityScore) {
    if (maturityScore < 30) return 'prototype';
    if (maturityScore < 60) return 'mvp';
    if (maturityScore < 80) return 'product';
    return 'mature-product';
}

function assessScalingReadiness(indicators) {
    const avgScore = Object.values(indicators).reduce((sum, score) => sum + score, 0) / Object.keys(indicators).length;
    
    if (avgScore > 80) return 'ready';
    if (avgScore > 60) return 'nearly-ready';
    if (avgScore > 40) return 'preparation-needed';
    return 'not-ready';
}

function generateTransitionRecommendations(metrics) {
    const recommendations = [];
    
    if (metrics.couplingEvolution.currentCouplingScore > 70) {
        recommendations.push({
            category: 'Architecture',
            severity: 'high',
            title: 'High Component Coupling',
            description: 'Components are tightly coupled, which will hinder scaling efforts.',
            action: 'Identify service boundaries and begin decoupling critical components'
        });
    }
    
    if (metrics.performanceDebt.debtScore > 60) {
        recommendations.push({
            category: 'Performance',
            severity: 'medium',
            title: 'Performance Debt Accumulation',
            description: `${metrics.performanceDebt.performanceRatio.toFixed(1)}% of commits are performance-related, indicating scaling bottlenecks.`,
            action: 'Address database query optimization and implement caching strategies'
        });
    }
    
    if (metrics.featureFlagDebt.debtScore > 50) {
        recommendations.push({
            category: 'Code Quality',
            severity: 'medium',
            title: 'Feature Flag Technical Debt',
            description: 'Accumulated feature flags may complicate scaling and maintenance.',
            action: 'Schedule regular cleanup sprints to remove unused feature flags'
        });
    }
    
    if (metrics.scaleReadinessScore < 50) {
        recommendations.push({
            category: 'Strategy',
            severity: 'critical',
            title: 'Low Scale Readiness',
            description: 'Multiple factors indicate the system is not ready for scale.',
            action: 'Prioritize architectural improvements before attempting to scale team or traffic'
        });
    }
    
    return recommendations;
}