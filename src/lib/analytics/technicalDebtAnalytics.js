export function analyzeTechnicalDebt(commits, projectEvolution) {
    const hotspots = projectEvolution.hotspots;
    const fileHistory = projectEvolution.fileHistory;
    
    // Hotspot Concentration Ratio
    const totalFiles = fileHistory.length;
    const top10PercentCount = Math.max(1, Math.floor(totalFiles * 0.1));
    const top10PercentChanges = hotspots.slice(0, top10PercentCount)
        .reduce((sum, file) => sum + file.totalModifications, 0);
    const totalChanges = hotspots.reduce((sum, file) => sum + file.totalModifications, 0);
    const hotspotConcentrationRatio = totalChanges > 0 ? (top10PercentChanges / totalChanges) * 100 : 0;
    
    // Code Churn Rate Analysis
    const churnData = fileHistory.map(file => {
        const lifespan = file.lifespan / (1000 * 60 * 60 * 24); // days
        const churnRate = lifespan > 0 ? file.totalModifications / lifespan : 0;
        return {
            filename: file.filename,
            churnRate,
            totalModifications: file.totalModifications,
            lifespan
        };
    }).sort((a, b) => b.churnRate - a.churnRate);
    
    const averageChurnRate = churnData.reduce((sum, file) => sum + file.churnRate, 0) / churnData.length || 0;
    const highChurnFiles = churnData.filter(file => file.churnRate > averageChurnRate * 2);
    
    // Refactoring vs Feature Analysis
    const commitPatterns = analyzeCommitPatterns(commits);
    const refactoringRatio = commitPatterns.totalCommits > 0 
        ? (commitPatterns.refactoringCommits / commitPatterns.totalCommits) * 100 
        : 0;
    
    // Architecture Violation Score (cross-module dependencies)
    const architectureViolations = calculateArchitectureViolations(fileHistory);
    
    // Technical Debt Score (0-100, lower is better)
    const technicalDebtScore = calculateTechnicalDebtScore({
        hotspotConcentrationRatio,
        averageChurnRate,
        refactoringRatio,
        architectureViolations: architectureViolations.score
    });
    
    return {
        hotspotConcentrationRatio,
        averageChurnRate,
        highChurnFiles: highChurnFiles.slice(0, 10),
        refactoringRatio,
        commitPatterns,
        architectureViolations,
        technicalDebtScore,
        recommendations: generateTechnicalDebtRecommendations({
            hotspotConcentrationRatio,
            highChurnFiles,
            refactoringRatio,
            architectureViolations
        })
    };
}

function analyzeCommitPatterns(commits) {
    let featureCommits = 0;
    let refactoringCommits = 0;
    let bugfixCommits = 0;
    let otherCommits = 0;
    
    const featureKeywords = ['feat', 'add', 'implement', 'create', 'new'];
    const refactorKeywords = ['refactor', 'cleanup', 'reorganize', 'restructure', 'optimize'];
    const bugfixKeywords = ['fix', 'bug', 'patch', 'resolve', 'correct'];
    
    commits.forEach(commit => {
        const message = commit.message.toLowerCase();
        
        if (featureKeywords.some(keyword => message.includes(keyword))) {
            featureCommits++;
        } else if (refactorKeywords.some(keyword => message.includes(keyword))) {
            refactoringCommits++;
        } else if (bugfixKeywords.some(keyword => message.includes(keyword))) {
            bugfixCommits++;
        } else {
            otherCommits++;
        }
    });
    
    return {
        totalCommits: commits.length,
        featureCommits,
        refactoringCommits,
        bugfixCommits,
        otherCommits,
        featureRatio: (featureCommits / commits.length) * 100,
        refactorRatio: (refactoringCommits / commits.length) * 100,
        bugfixRatio: (bugfixCommits / commits.length) * 100
    };
}

function calculateArchitectureViolations(fileHistory) {
    // Analyze file paths for cross-module dependencies
    const modules = {};
    const crossModuleChanges = [];
    
    fileHistory.forEach(file => {
        const pathParts = file.filename.split('/');
        const module = pathParts.length > 1 ? pathParts[0] : 'root';
        
        if (!modules[module]) {
            modules[module] = [];
        }
        modules[module].push(file);
    });
    
    // Calculate coupling between modules
    const moduleNames = Object.keys(modules);
    let totalViolations = 0;
    
    // Files that span multiple conceptual modules (heuristic)
    fileHistory.forEach(file => {
        if (file.authors > 3 && file.totalModifications > 10) {
            const pathComplexity = file.filename.split('/').length;
            if (pathComplexity > 4) {
                totalViolations += file.totalModifications;
                crossModuleChanges.push({
                    filename: file.filename,
                    modifications: file.totalModifications,
                    authors: file.authors,
                    complexity: pathComplexity
                });
            }
        }
    });
    
    const violationScore = fileHistory.length > 0 
        ? (totalViolations / fileHistory.reduce((sum, f) => sum + f.totalModifications, 0)) * 100 
        : 0;
    
    return {
        score: violationScore,
        totalModules: moduleNames.length,
        crossModuleChanges: crossModuleChanges.slice(0, 10),
        moduleDistribution: moduleNames.map(name => ({
            module: name,
            fileCount: modules[name].length,
            totalChanges: modules[name].reduce((sum, f) => sum + f.totalModifications, 0)
        })).sort((a, b) => b.totalChanges - a.totalChanges)
    };
}

function calculateTechnicalDebtScore(metrics) {
    // Weights for different factors
    const weights = {
        hotspotConcentration: 0.3,    // High concentration = high debt
        churnRate: 0.25,              // High churn = instability
        lowRefactoringRatio: 0.25,    // Low refactoring = debt accumulation
        architectureViolations: 0.2   // High violations = architectural debt
    };
    
    // Normalize and score each metric (0-100)
    const hotspotScore = Math.min(100, metrics.hotspotConcentrationRatio * 1.5);
    const churnScore = Math.min(100, metrics.averageChurnRate * 10);
    const refactoringScore = Math.max(0, 100 - metrics.refactoringRatio * 5); // Lower refactoring = higher debt
    const architectureScore = Math.min(100, metrics.architectureViolations * 2);
    
    const totalScore = (
        hotspotScore * weights.hotspotConcentration +
        churnScore * weights.churnRate +
        refactoringScore * weights.lowRefactoringRatio +
        architectureScore * weights.architectureViolations
    );
    
    return Math.round(totalScore);
}

function generateTechnicalDebtRecommendations(metrics) {
    const recommendations = [];
    
    if (metrics.hotspotConcentrationRatio > 60) {
        recommendations.push({
            severity: 'high',
            category: 'Architecture',
            title: 'Critical Hotspot Concentration',
            description: `${Math.round(metrics.hotspotConcentrationRatio)}% of changes are concentrated in 10% of files. Consider breaking down these components.`,
            action: 'Prioritize refactoring high-traffic files and extracting responsibilities'
        });
    }
    
    if (metrics.highChurnFiles.length > 5) {
        recommendations.push({
            severity: 'medium',
            category: 'Code Quality',
            title: 'High Code Churn Detected',
            description: `${metrics.highChurnFiles.length} files show excessive change frequency, indicating design instability.`,
            action: 'Review and stabilize frequently changing components'
        });
    }
    
    if (metrics.refactoringRatio < 15) {
        recommendations.push({
            severity: 'medium',
            category: 'Process',
            title: 'Low Refactoring Activity',
            description: `Only ${Math.round(metrics.refactoringRatio)}% of commits are refactoring. Technical debt may be accumulating.`,
            action: 'Allocate 20-30% of development time to refactoring and cleanup'
        });
    }
    
    if (metrics.architectureViolations.score > 25) {
        recommendations.push({
            severity: 'high',
            category: 'Architecture',
            title: 'Architecture Boundary Violations',
            description: 'Detected potential cross-module dependencies and complex file structures.',
            action: 'Review module boundaries and establish clear architectural guidelines'
        });
    }
    
    return recommendations;
}