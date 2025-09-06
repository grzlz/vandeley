export function analyzeScalingReadiness(commits, sessions, contributors, projectEvolution) {
	// Team Coordination Overhead Analysis
	const coordinationOverhead = calculateCoordinationOverhead(
		projectEvolution.fileHistory,
		contributors
	);

	// Release Frequency Trend Analysis
	const releaseFrequency = analyzeReleaseFrequency(commits, sessions);

	// Critical Path Dependencies
	const criticalPaths = identifyCriticalPathDependencies(projectEvolution.fileHistory, commits);

	// Monolith Decomposition Progress
	const decompositionMetrics = analyzeDecompositionProgress(projectEvolution.fileHistory, commits);

	// Scaling Readiness Score (0-100, higher is better)
	const scalingReadinessScore = calculateScalingReadinessScore({
		coordinationOverhead: coordinationOverhead.overheadScore,
		releaseFrequency: releaseFrequency.velocityTrend,
		criticalPaths: criticalPaths.riskScore,
		decomposition: decompositionMetrics.progressScore
	});

	return {
		coordinationOverhead,
		releaseFrequency,
		criticalPaths,
		decompositionMetrics,
		scalingReadinessScore,
		scalingRecommendations: generateScalingRecommendations({
			coordinationOverhead,
			releaseFrequency,
			criticalPaths,
			decompositionMetrics,
			scalingReadinessScore
		})
	};
}

function calculateCoordinationOverhead(fileHistory, contributors) {
	// Files touched by multiple contributors (Conway's Law violations)
	const sharedFiles = fileHistory.filter((file) => file.authors > 1);
	const highContentionFiles = fileHistory.filter((file) => file.authors >= 3);

	// Calculate coordination complexity
	let totalCoordinationCost = 0;
	const coordinationMatrix = {};

	sharedFiles.forEach((file) => {
		// Cost increases exponentially with number of authors
		const coordinationCost = file.authors * (file.authors - 1) * file.totalModifications;
		totalCoordinationCost += coordinationCost;

		coordinationMatrix[file.filename] = {
			authors: file.authors,
			modifications: file.totalModifications,
			coordinationCost,
			contentionLevel: getContentionLevel(file.authors)
		};
	});

	const totalFiles = fileHistory.length;
	const sharedFileRatio = (sharedFiles.length / totalFiles) * 100;
	const highContentionRatio = (highContentionFiles.length / totalFiles) * 100;

	// Overhead score (0-100, lower is better)
	const overheadScore = Math.min(
		100,
		sharedFileRatio * 0.6 + highContentionRatio * 1.5 + Math.min(50, totalCoordinationCost / 1000)
	);

	return {
		sharedFiles: sharedFiles.length,
		sharedFileRatio,
		highContentionFiles: highContentionFiles.length,
		highContentionRatio,
		totalCoordinationCost,
		overheadScore,
		topContentionFiles: Object.entries(coordinationMatrix)
			.sort(([, a], [, b]) => b.coordinationCost - a.coordinationCost)
			.slice(0, 10)
			.map(([filename, data]) => ({ filename, ...data }))
	};
}

function analyzeReleaseFrequency(commits, sessions) {
	// Analyze commit patterns over time to detect release cycles
	const sortedCommits = commits.sort((a, b) => a.timestamp - b.timestamp);
	const sortedSessions = sessions.sort((a, b) => a.startTime - b.startTime);

	if (sortedCommits.length < 10) {
		return {
			averageTimeBetweenReleases: 0,
			velocityTrend: 50,
			releasePatterns: [],
			frequencyHealth: 'insufficient-data'
		};
	}

	// Detect potential release points (gaps between sessions > 3 days)
	const releasePoints = [];
	const threeDays = 3 * 24 * 60 * 60 * 1000;

	for (let i = 1; i < sortedSessions.length; i++) {
		const gap = sortedSessions[i].startTime - sortedSessions[i - 1].endTime;
		if (gap > threeDays) {
			releasePoints.push({
				date: new Date(sortedSessions[i - 1].endTime),
				gap: gap / (24 * 60 * 60 * 1000), // days
				commitsSinceLastRelease: 0
			});
		}
	}

	// Calculate average time between releases
	let avgTimeBetweenReleases = 0;
	if (releasePoints.length > 1) {
		const totalTime = releasePoints[releasePoints.length - 1].date - releasePoints[0].date;
		avgTimeBetweenReleases = totalTime / (releasePoints.length - 1) / (24 * 60 * 60 * 1000);
	}

	// Analyze velocity trend (commits per time period)
	const timeSlices = createTimeSlices(sortedCommits, 7); // Weekly slices
	const velocityTrend = calculateVelocityTrend(timeSlices);

	const frequencyHealth = getFrequencyHealth(avgTimeBetweenReleases, velocityTrend);

	return {
		averageTimeBetweenReleases: Math.round(avgTimeBetweenReleases * 10) / 10,
		releasePoints: releasePoints.length,
		velocityTrend,
		timeSlices: timeSlices.slice(-12), // Last 12 weeks
		frequencyHealth,
		releasePatterns: analyzeReleasePatterns(releasePoints)
	};
}

function identifyCriticalPathDependencies(fileHistory, commits) {
	// Files that are frequently modified and have high impact
	const criticalFiles = fileHistory
		.filter((file) => file.totalModifications > 5)
		.map((file) => {
			const recentActivity = commits.filter(
				(commit) =>
					commit.filesChanged.some((f) => f.filename === file.filename) &&
					Date.now() - commit.timestamp < 30 * 24 * 60 * 60 * 1000 // Last 30 days
			).length;

			return {
				filename: file.filename,
				totalModifications: file.totalModifications,
				authors: file.authors,
				recentActivity,
				criticalityScore: calculateCriticalityScore(file, recentActivity)
			};
		})
		.sort((a, b) => b.criticalityScore - a.criticalityScore);

	const highRiskFiles = criticalFiles.filter((file) => file.criticalityScore > 70);
	const riskScore = Math.min(100, (highRiskFiles.length / Math.max(1, criticalFiles.length)) * 100);

	return {
		criticalFiles: criticalFiles.slice(0, 15),
		highRiskFiles,
		riskScore,
		recommendations: generateCriticalPathRecommendations(highRiskFiles)
	};
}

function analyzeDecompositionProgress(fileHistory, commits) {
	// Analyze service boundary emergence and module separation
	const moduleStructure = analyzeModuleStructure(fileHistory);
	const coupling = analyzeCouplingTrends(fileHistory, commits);

	// Progress indicators
	const moduleBoundaries = Object.keys(moduleStructure.modules).length;
	const averageFilesPerModule = moduleStructure.totalFiles / moduleBoundaries;
	const couplingReduction = coupling.trend < 0 ? Math.abs(coupling.trend) : 0;

	// Progress score (0-100, higher is better)
	const progressScore = Math.min(
		100,
		(moduleBoundaries > 1 ? 30 : 0) +
			(averageFilesPerModule < 20 ? 30 : Math.max(0, 30 - averageFilesPerModule)) +
			couplingReduction * 40
	);

	return {
		moduleBoundaries,
		averageFilesPerModule,
		moduleStructure,
		coupling,
		progressScore,
		decompositionHealth: getDecompositionHealth(progressScore)
	};
}

function calculateScalingReadinessScore(metrics) {
	const weights = {
		coordination: 0.3, // Lower overhead = better scaling
		frequency: 0.25, // Higher frequency = better scaling
		criticalPaths: 0.25, // Lower risk = better scaling
		decomposition: 0.2 // Higher progress = better scaling
	};

	// Normalize scores (all should be 0-100, higher is better)
	const coordScore = Math.max(0, 100 - metrics.coordinationOverhead);
	const freqScore = Math.min(100, metrics.releaseFrequency);
	const pathScore = Math.max(0, 100 - metrics.criticalPaths);
	const decompScore = metrics.decomposition;

	const totalScore =
		coordScore * weights.coordination +
		freqScore * weights.frequency +
		pathScore * weights.criticalPaths +
		decompScore * weights.decomposition;

	return Math.round(totalScore);
}

// Helper functions
function getContentionLevel(authors) {
	if (authors >= 5) return 'very-high';
	if (authors >= 3) return 'high';
	if (authors >= 2) return 'medium';
	return 'low';
}

function createTimeSlices(commits, daysPerSlice) {
	if (commits.length === 0) return [];

	const startTime = commits[0].timestamp;
	const endTime = commits[commits.length - 1].timestamp;
	const sliceDuration = daysPerSlice * 24 * 60 * 60 * 1000;
	const slices = [];

	for (let time = startTime; time <= endTime; time += sliceDuration) {
		const sliceCommits = commits.filter(
			(commit) => commit.timestamp >= time && commit.timestamp < time + sliceDuration
		);

		slices.push({
			startDate: new Date(time),
			endDate: new Date(time + sliceDuration),
			commitCount: sliceCommits.length,
			contributors: new Set(sliceCommits.map((c) => c.author)).size
		});
	}

	return slices;
}

function calculateVelocityTrend(timeSlices) {
	if (timeSlices.length < 3) return 50;

	const recentSlices = timeSlices.slice(-4);
	const earlierSlices = timeSlices.slice(-8, -4);

	const recentAvg =
		recentSlices.reduce((sum, slice) => sum + slice.commitCount, 0) / recentSlices.length;
	const earlierAvg =
		earlierSlices.reduce((sum, slice) => sum + slice.commitCount, 0) / earlierSlices.length;

	if (earlierAvg === 0) return 50;

	const trendRatio = recentAvg / earlierAvg;
	return Math.min(100, Math.max(0, trendRatio * 50));
}

function getFrequencyHealth(avgDays, velocityTrend) {
	if (avgDays === 0) return 'unknown';
	if (avgDays <= 7 && velocityTrend > 60) return 'excellent';
	if (avgDays <= 14 && velocityTrend > 40) return 'good';
	if (avgDays <= 30) return 'moderate';
	return 'concerning';
}

function calculateCriticalityScore(file, recentActivity) {
	return Math.min(100, file.totalModifications * 2 + file.authors * 10 + recentActivity * 5);
}

function analyzeModuleStructure(fileHistory) {
	const modules = {};
	let totalFiles = 0;

	fileHistory.forEach((file) => {
		const pathParts = file.filename.split('/');
		const module = pathParts.length > 1 ? pathParts[0] : 'root';

		if (!modules[module]) {
			modules[module] = {
				files: [],
				totalModifications: 0,
				authors: new Set()
			};
		}

		modules[module].files.push(file.filename);
		modules[module].totalModifications += file.totalModifications;
		totalFiles++;
	});

	return { modules, totalFiles };
}

function analyzeCouplingTrends(fileHistory, commits) {
	// Simplified coupling analysis
	const couplingScore =
		fileHistory.reduce((score, file) => {
			return score + (file.authors > 2 ? file.authors * 2 : 0);
		}, 0) / fileHistory.length;

	return {
		score: couplingScore,
		trend: Math.random() * 0.2 - 0.1 // Placeholder trend
	};
}

function getDecompositionHealth(score) {
	if (score >= 80) return 'excellent';
	if (score >= 60) return 'good';
	if (score >= 40) return 'moderate';
	return 'needs-attention';
}

function analyzeReleasePatterns(releasePoints) {
	// Analyze patterns in release timing
	return releasePoints.map((point, index) => ({
		...point,
		sequence: index + 1,
		intervalFromPrevious: index > 0 ? point.date - releasePoints[index - 1].date : 0
	}));
}

function generateCriticalPathRecommendations(highRiskFiles) {
	return highRiskFiles.slice(0, 3).map((file) => ({
		filename: file.filename,
		risk: 'high',
		recommendation: `Consider refactoring or breaking down this frequently modified file (${file.totalModifications} modifications by ${file.authors} authors)`
	}));
}

function generateScalingRecommendations(metrics) {
	const recommendations = [];

	if (metrics.coordinationOverhead.overheadScore > 60) {
		recommendations.push({
			category: 'Team Structure',
			severity: 'high',
			title: 'High Team Coordination Overhead',
			description: `${metrics.coordinationOverhead.sharedFileRatio.toFixed(1)}% of files require coordination between multiple team members.`,
			action: 'Consider organizing teams around service boundaries to reduce coordination needs'
		});
	}

	if (metrics.releaseFrequency.frequencyHealth === 'concerning') {
		recommendations.push({
			category: 'Release Process',
			severity: 'medium',
			title: 'Infrequent Release Cycle',
			description: `Average ${metrics.releaseFrequency.averageTimeBetweenReleases} days between releases may indicate scaling friction.`,
			action: 'Implement continuous deployment and feature flags to increase release frequency'
		});
	}

	if (metrics.criticalPaths.riskScore > 50) {
		recommendations.push({
			category: 'Architecture',
			severity: 'high',
			title: 'Critical Path Dependencies',
			description: `${metrics.criticalPaths.highRiskFiles.length} files are blocking development velocity.`,
			action: 'Prioritize refactoring high-risk files and distribute responsibilities'
		});
	}

	if (metrics.scalingReadinessScore < 40) {
		recommendations.push({
			category: 'Strategy',
			severity: 'critical',
			title: 'Low Scaling Readiness',
			description:
				'Multiple factors indicate the codebase may struggle with team and product scaling.',
			action: 'Consider a dedicated architecture sprint to address scaling bottlenecks'
		});
	}

	return recommendations;
}
