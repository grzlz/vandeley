export function analyzeVelocityHealth(commits, sessions, contributors, projectEvolution) {
	// Context Switching Analysis
	const contextSwitching = analyzeContextSwitching(sessions, projectEvolution.fileHistory);

	// Knowledge Silos Risk Assessment
	const knowledgeSilos = analyzeKnowledgeSilos(contributors, projectEvolution.fileHistory);

	// Onboarding Complexity Analysis
	const onboardingComplexity = analyzeOnboardingComplexity(contributors, commits);

	// Engineering Velocity Score
	const velocityScore = calculateVelocityScore({
		contextSwitching: contextSwitching.penaltyScore,
		knowledgeSilos: knowledgeSilos.riskScore,
		onboarding: onboardingComplexity.complexityScore
	});

	return {
		contextSwitching,
		knowledgeSilos,
		onboardingComplexity,
		velocityScore,
		velocityRecommendations: generateVelocityRecommendations({
			contextSwitching,
			knowledgeSilos,
			onboardingComplexity,
			velocityScore
		})
	};
}

function analyzeContextSwitching(sessions, fileHistory) {
	// Analyze how often developers jump between unrelated files/modules
	const contextSwitches = [];
	let totalPenalty = 0;

	sessions.forEach((session) => {
		const filesInSession = session.commits.flatMap((commit) =>
			commit.filesChanged.map((f) => f.filename)
		);

		// Group files by module/directory
		const moduleGroups = {};
		filesInSession.forEach((filename) => {
			const module = getFileModule(filename);
			if (!moduleGroups[module]) {
				moduleGroups[module] = [];
			}
			moduleGroups[module].push(filename);
		});

		const modulesCount = Object.keys(moduleGroups).length;
		const contextSwitchPenalty = calculateContextSwitchPenalty(modulesCount, filesInSession.length);

		totalPenalty += contextSwitchPenalty;

		if (contextSwitchPenalty > 20) {
			contextSwitches.push({
				sessionId: session.id,
				author: session.author,
				date: new Date(session.startTime),
				modulesCount,
				filesCount: filesInSession.length,
				penalty: contextSwitchPenalty,
				modules: Object.keys(moduleGroups)
			});
		}
	});

	const averagePenalty = sessions.length > 0 ? totalPenalty / sessions.length : 0;
	const highSwitchingSessions = contextSwitches.filter((cs) => cs.penalty > 30);

	return {
		averagePenalty,
		penaltyScore: Math.min(100, averagePenalty * 2),
		totalHighSwitchingSessions: highSwitchingSessions.length,
		switchingRatio:
			sessions.length > 0 ? (highSwitchingSessions.length / sessions.length) * 100 : 0,
		topSwitchingSessions: contextSwitches.sort((a, b) => b.penalty - a.penalty).slice(0, 10),
		moduleFragmentation: analyzeModuleFragmentation(sessions)
	};
}

function analyzeKnowledgeSilos(contributors, fileHistory) {
	// Calculate "bus factor" for critical components
	const fileBusFactor = {};
	const contributorExpertise = {};
	const silos = [];

	// Initialize contributor expertise tracking
	contributors.forEach((contributor) => {
		contributorExpertise[contributor.name] = {
			files: new Set(),
			totalContributions: contributor.totalCommits,
			specializedFiles: []
		};
	});

	// Analyze file ownership patterns
	fileHistory.forEach((file) => {
		// Files with high modification count are critical
		const isCritical = file.totalModifications > 10 || file.authors === 1;

		if (isCritical) {
			// Calculate bus factor (how many people would need to leave to lose knowledge)
			const busFactor = Math.min(file.authors, 3); // Cap at 3 for practical purposes
			fileBusFactor[file.filename] = {
				busFactor,
				riskLevel: getBusFactorRisk(busFactor),
				modifications: file.totalModifications,
				authors: file.authors
			};

			// If only 1-2 people work on critical files, it's a silo risk
			if (busFactor <= 2) {
				silos.push({
					filename: file.filename,
					busFactor,
					modifications: file.totalModifications,
					riskLevel: getBusFactorRisk(busFactor)
				});
			}
		}
	});

	// Calculate overall knowledge silo risk
	const criticalFiles = Object.keys(fileBusFactor).length;
	const siloFiles = silos.length;
	const siloRatio = criticalFiles > 0 ? (siloFiles / criticalFiles) * 100 : 0;
	const riskScore = Math.min(100, siloRatio * 1.2 + (siloFiles > 10 ? 20 : 0));

	// Identify knowledge experts and potential single points of failure
	const knowledgeExperts = identifyKnowledgeExperts(contributors, fileHistory);

	return {
		criticalFiles,
		siloFiles,
		siloRatio,
		riskScore,
		topSilos: silos
			.sort((a, b) => a.busFactor - b.busFactor || b.modifications - a.modifications)
			.slice(0, 15),
		knowledgeExperts,
		busFactor: calculateOverallBusFactor(fileBusFactor)
	};
}

function analyzeOnboardingComplexity(contributors, commits) {
	// Analyze how long it takes new contributors to become productive
	const onboardingData = [];

	contributors.forEach((contributor) => {
		const contributorCommits = commits
			.filter((commit) => commit.author === contributor.name)
			.sort((a, b) => a.timestamp - b.timestamp);

		if (contributorCommits.length >= 5) {
			// Need minimum commits for analysis
			const firstCommit = contributorCommits[0];
			const productiveCommit = findProductiveCommit(contributorCommits);

			const rampUpTime = productiveCommit
				? (productiveCommit.timestamp - firstCommit.timestamp) / (1000 * 60 * 60 * 24)
				: null;

			if (rampUpTime !== null) {
				onboardingData.push({
					contributor: contributor.name,
					rampUpDays: Math.round(rampUpTime),
					firstCommitDate: new Date(firstCommit.timestamp),
					totalCommits: contributorCommits.length,
					complexityIndicator: calculateOnboardingComplexity(contributorCommits.slice(0, 10))
				});
			}
		}
	});

	// Calculate average onboarding time
	const averageRampUp =
		onboardingData.length > 0
			? onboardingData.reduce((sum, data) => sum + data.rampUpDays, 0) / onboardingData.length
			: 0;

	// Complexity score (0-100, higher means more complex onboarding)
	const complexityScore = Math.min(
		100,
		(averageRampUp > 30 ? 40 : averageRampUp * 1.3) +
			onboardingData.filter((d) => d.rampUpDays > 60).length * 10
	);

	return {
		averageRampUpDays: Math.round(averageRampUp),
		complexityScore,
		onboardingData: onboardingData.slice(0, 10),
		complexityFactors: identifyComplexityFactors(onboardingData, commits)
	};
}

function calculateVelocityScore(metrics) {
	const weights = {
		contextSwitching: 0.4, // Lower penalty = better velocity
		knowledgeSilos: 0.35, // Lower risk = better velocity
		onboarding: 0.25 // Lower complexity = better velocity
	};

	// Convert to velocity-positive scores (higher is better)
	const contextScore = Math.max(0, 100 - metrics.contextSwitching);
	const siloScore = Math.max(0, 100 - metrics.knowledgeSilos);
	const onboardingScore = Math.max(0, 100 - metrics.onboarding);

	const totalScore =
		contextScore * weights.contextSwitching +
		siloScore * weights.knowledgeSilos +
		onboardingScore * weights.onboarding;

	return Math.round(totalScore);
}

// Helper functions
function getFileModule(filename) {
	const parts = filename.split('/');
	if (parts.length > 1) {
		return parts[0]; // First directory
	}

	// Fallback: use file extension as module
	const extension = filename.split('.').pop();
	return extension || 'misc';
}

function calculateContextSwitchPenalty(modulesCount, filesCount) {
	// Penalty increases with number of different modules touched
	const moduleSpread = modulesCount > 1 ? (modulesCount - 1) * 15 : 0;
	const fileSpread = filesCount > 5 ? (filesCount - 5) * 2 : 0;

	return moduleSpread + fileSpread;
}

function analyzeModuleFragmentation(sessions) {
	const moduleStats = {};

	sessions.forEach((session) => {
		const modules = new Set();
		session.commits.forEach((commit) => {
			commit.filesChanged.forEach((file) => {
				modules.add(getFileModule(file.filename));
			});
		});

		modules.forEach((module) => {
			if (!moduleStats[module]) {
				moduleStats[module] = { sessions: 0, totalTime: 0 };
			}
			moduleStats[module].sessions++;
			moduleStats[module].totalTime += session.duration;
		});
	});

	return Object.entries(moduleStats)
		.map(([module, stats]) => ({
			module,
			sessions: stats.sessions,
			averageSessionTime: stats.totalTime / stats.sessions / (1000 * 60 * 60), // hours
			fragmentation: stats.sessions > 10 ? 'high' : stats.sessions > 5 ? 'medium' : 'low'
		}))
		.sort((a, b) => b.sessions - a.sessions);
}

function getBusFactorRisk(busFactor) {
	if (busFactor === 1) return 'critical';
	if (busFactor === 2) return 'high';
	if (busFactor === 3) return 'medium';
	return 'low';
}

function identifyKnowledgeExperts(contributors, fileHistory) {
	const experts = contributors
		.map((contributor) => {
			const expertiseFiles = fileHistory.filter(
				(file) => file.authors <= 2 && file.totalModifications > 5
			);

			const expertiseScore = expertiseFiles.length * 10 + (contributor.totalCommits > 100 ? 20 : 0);

			return {
				name: contributor.name,
				expertiseScore,
				specializedFiles: expertiseFiles.length,
				totalCommits: contributor.totalCommits,
				riskLevel: expertiseScore > 50 ? 'high' : expertiseScore > 25 ? 'medium' : 'low'
			};
		})
		.sort((a, b) => b.expertiseScore - a.expertiseScore);

	return experts.slice(0, 10);
}

function calculateOverallBusFactor(fileBusFactor) {
	const busFactors = Object.values(fileBusFactor).map((file) => file.busFactor);
	const averageBusFactor =
		busFactors.length > 0
			? busFactors.reduce((sum, factor) => sum + factor, 0) / busFactors.length
			: 0;

	const criticalRiskFiles = busFactors.filter((factor) => factor <= 2).length;

	return {
		average: Math.round(averageBusFactor * 10) / 10,
		criticalRiskFiles,
		overall: averageBusFactor > 2.5 ? 'healthy' : averageBusFactor > 1.5 ? 'moderate' : 'risky'
	};
}

function findProductiveCommit(commits) {
	// A "productive" commit is one where the developer makes substantial changes
	// indicating they've ramped up beyond trivial contributions
	for (let i = 4; i < commits.length; i++) {
		// Start from 5th commit
		const commit = commits[i];
		const totalChanges = commit.insertions + commit.deletions;

		if (totalChanges > 50 || commit.filesChanged.length > 3) {
			return commit;
		}
	}

	return commits.length > 10 ? commits[9] : null; // Fallback to 10th commit
}

function calculateOnboardingComplexity(earlyCommits) {
	// Analyze the complexity of early commits
	let complexityScore = 0;

	earlyCommits.forEach((commit) => {
		const filesCount = commit.filesChanged.length;
		const changesCount = commit.insertions + commit.deletions;

		// More files and changes in early commits = higher complexity
		complexityScore += filesCount * 5 + Math.min(changesCount / 10, 20);
	});

	return Math.min(100, complexityScore / earlyCommits.length);
}

function identifyComplexityFactors(onboardingData, commits) {
	const factors = [];

	const avgRampUp =
		onboardingData.reduce((sum, d) => sum + d.rampUpDays, 0) / onboardingData.length;

	if (avgRampUp > 45) {
		factors.push({
			factor: 'Long Ramp-up Time',
			description: `Average ${Math.round(avgRampUp)} days to productivity indicates high codebase complexity`,
			severity: 'high'
		});
	}

	const highComplexityContributors = onboardingData.filter((d) => d.complexityIndicator > 60);
	if (highComplexityContributors.length > onboardingData.length * 0.5) {
		factors.push({
			factor: 'Complex Early Contributions',
			description: 'New contributors are immediately working on complex, multi-file changes',
			severity: 'medium'
		});
	}

	return factors;
}

function generateVelocityRecommendations(metrics) {
	const recommendations = [];

	if (metrics.contextSwitching.penaltyScore > 60) {
		recommendations.push({
			category: 'Focus & Flow',
			severity: 'high',
			title: 'High Context Switching Detected',
			description: `${metrics.contextSwitching.switchingRatio.toFixed(1)}% of sessions involve high context switching between modules.`,
			action:
				'Organize work by feature verticals rather than technical layers to reduce context switching'
		});
	}

	if (metrics.knowledgeSilos.riskScore > 70) {
		recommendations.push({
			category: 'Knowledge Management',
			severity: 'critical',
			title: 'Critical Knowledge Silos',
			description: `${metrics.knowledgeSilos.siloFiles} critical files have bus factor ≤ 2, creating single points of failure.`,
			action: 'Implement pair programming and code review practices to spread knowledge'
		});
	}

	if (metrics.onboardingComplexity.complexityScore > 60) {
		recommendations.push({
			category: 'Developer Experience',
			severity: 'medium',
			title: 'Complex Onboarding Process',
			description: `Average ${metrics.onboardingComplexity.averageRampUpDays} days for new contributors to become productive.`,
			action:
				'Create documentation, setup guides, and identify good "first issues" for new contributors'
		});
	}

	if (metrics.velocityScore < 50) {
		recommendations.push({
			category: 'Team Velocity',
			severity: 'high',
			title: 'Low Engineering Velocity',
			description: 'Multiple factors are impacting team productivity and development speed.',
			action:
				'Focus on reducing context switching, knowledge sharing, and improving developer onboarding'
		});
	}

	return recommendations;
}
