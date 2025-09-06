<script>
	import FileUpload from '../lib/components/FileUpload.svelte';
	import Dashboard from '../lib/components/Dashboard.svelte';
	import ArchitectDashboard from '../lib/components/ArchitectDashboard.svelte';

	import { parseGitLog, getCommitStats } from '../lib/parser/gitLogParser.js';
	import { detectWorkSessions, getSessionStats } from '../lib/parser/sessionDetector.js';
	import { analyzeCommitTiming, analyzeCommitVelocity } from '../lib/analytics/timeAnalytics.js';
	import {
		analyzeContributors,
		getCollaborationMatrix
	} from '../lib/analytics/contributorAnalytics.js';
	import {
		analyzeProjectEvolution,
		calculateProjectMetrics
	} from '../lib/analytics/projectAnalytics.js';
	import { analyzeTechnicalDebt } from '../lib/analytics/technicalDebtAnalytics.js';
	import { analyzeScalingReadiness } from '../lib/analytics/scalingAnalytics.js';
	import { analyzeVelocityHealth } from '../lib/analytics/velocityAnalytics.js';
	import { analyzeMVPToScaleTransition } from '../lib/analytics/transitionAnalytics.js';

	// Svelte 5 runes for reactive state
	let isAnalyzing = $state(false);
	let analytics = $state(null);
	let architectAnalytics = $state(null);
	let error = $state(null);
	let activeTab = $state('overview');

	// Derived state for showing landing page
	const showLandingPage = $derived(!analytics && !error);

	function handleFileLoaded(event) {
		const { content } = event.detail;
		analyzeGitLog(content);
	}

	function analyzeGitLog(gitLogText) {
		isAnalyzing = true;
		error = null;

		try {
			// Parse commits
			const commits = parseGitLog(gitLogText);

			if (commits.length === 0) {
				throw new Error(
					'No valid commits found in the git log. Please ensure the file contains valid git log output.'
				);
			}

			// Detect work sessions
			const sessions = detectWorkSessions(commits);

			// Run all analytics
			const commitStats = getCommitStats(commits);
			const sessionStats = getSessionStats(sessions);
			const timeAnalytics = analyzeCommitTiming(commits);
			const velocityAnalytics = analyzeCommitVelocity(commits);
			const contributors = analyzeContributors(commits);
			const collaboration = getCollaborationMatrix(commits);
			const projectEvolution = analyzeProjectEvolution(commits);
			const projectMetrics = calculateProjectMetrics(commits, sessions);

			analytics = {
				commits,
				sessions,
				commitStats,
				sessionStats,
				timeAnalytics,
				velocityAnalytics,
				contributors,
				collaboration,
				projectEvolution,
				projectMetrics
			};

			// Run architect-specific analytics
			const technicalDebt = analyzeTechnicalDebt(commits, projectEvolution);
			const scalingReadiness = analyzeScalingReadiness(
				commits,
				sessions,
				contributors,
				projectEvolution
			);
			const velocityHealth = analyzeVelocityHealth(
				commits,
				sessions,
				contributors,
				projectEvolution
			);
			const transitionMetrics = analyzeMVPToScaleTransition(
				commits,
				projectEvolution,
				contributors
			);

			architectAnalytics = {
				technicalDebt,
				scalingReadiness,
				velocityHealth,
				transitionMetrics
			};
		} catch (err) {
			error = err.message;
			console.error('Analysis error:', err);
		} finally {
			isAnalyzing = false;
		}
	}

	function resetAnalysis() {
		analytics = null;
		architectAnalytics = null;
		error = null;
		activeTab = 'overview';
	}
</script>

<main class="min-h-screen bg-gray-50 font-[system-ui,-apple-system,BlinkMacSystemFont,'SF Pro Display',sans-serif] antialiased">
	{#if showLandingPage}
		<!-- Apple-Inspired Landing Page -->
		<div class="relative">
			<!-- Clean Navigation -->
			<nav class="sticky top-0 z-50 bg-gray-50/80 backdrop-blur-xl border-b border-gray-200">
				<div class="container mx-auto px-6 py-4">
					<div class="flex items-center justify-center">
						<div class="flex items-center gap-4">
							<img src="/logo.png" alt="Vandeley Logo" class="h-8 w-8" />
							<div class="text-center">
								<div class="text-lg font-semibold tracking-tight text-gray-900">
									vandeley.art
								</div>
								<div class="text-xs font-medium tracking-wide text-gray-600 uppercase">
									Git Analytics
								</div>
							</div>
						</div>
					</div>
				</div>
			</nav>

			<!-- Hero Section -->
			<section class="pt-2 pb-16 px-6">
				<div class="container mx-auto">
					<!-- Hero + Demo Layout -->
					<div class="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center mb-16">
						<!-- Hero Content - Left Side (2/3) -->
						<div class="lg:col-span-2">
							<h1 class="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 mb-8 leading-[0.9]">
								Transform git history into 
								<span class="text-blue-600">architectural insights</span>
							</h1>

							<p class="text-2xl md:text-3xl text-gray-700 mb-8 font-light leading-relaxed">
								Advanced analytics for vibecoded tech debt enjoyers.
							</p>
						</div>

						<!-- Interactive Demo Playground - Right Side (1/3) -->
						<div class="lg:col-span-1">
							<div class="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
								<!-- Subtle background pattern -->
								<div class="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/20 pointer-events-none"></div>
								
								<!-- Demo header with enhanced visual hierarchy -->
								<div class="relative z-10 text-center mb-8">
									<div class="relative mb-6">
										<!-- Animated background glow -->
										<div class="absolute inset-0 w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-xl animate-pulse"></div>
										<!-- Icon container with gradient -->
										<div class="relative w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
											<div class="w-10 h-10 rounded-2xl bg-white/90 flex items-center justify-center">
												<span class="text-blue-600 text-xl font-bold">⚡</span>
											</div>
										</div>
									</div>
									
									<div class="space-y-3">
										<h3 class="text-2xl font-bold text-gray-900 tracking-tight">
											Live Demo
										</h3>
										<p class="text-base text-gray-700 font-medium leading-relaxed">
											Upload your git log and watch your codebase come alive
										</p>
										<div class="flex items-center justify-center gap-2 text-sm text-gray-500">
											<div class="w-1.5 h-1.5 rounded-full bg-green-500"></div>
											<span>Real-time analysis</span>
											<div class="w-1 h-1 rounded-full bg-gray-300"></div>
											<span>Privacy-first</span>
										</div>
									</div>
								</div>
								
								<!-- Enhanced file upload area -->
								<div class="relative z-10 mb-6">
									<FileUpload on:fileLoaded={handleFileLoaded} />
								</div>
								
								<!-- Demo features preview -->
								<div class="relative z-10 space-y-4">
									<div class="bg-gray-50/80 rounded-2xl p-4 border border-gray-100">
										<h4 class="font-semibold text-gray-900 text-sm mb-3">What you'll discover:</h4>
										<div class="space-y-2">
											<div class="flex items-center gap-3">
												<div class="w-2 h-2 rounded-full bg-red-400"></div>
												<span class="text-sm text-gray-700">Code hotspots & technical debt</span>
											</div>
											<div class="flex items-center gap-3">
												<div class="w-2 h-2 rounded-full bg-blue-400"></div>
												<span class="text-sm text-gray-700">Team collaboration patterns</span>
											</div>
											<div class="flex items-center gap-3">
												<div class="w-2 h-2 rounded-full bg-purple-400"></div>
												<span class="text-sm text-gray-700">Architecture health score</span>
											</div>
										</div>
									</div>
									
									<!-- Trust indicators -->
									<div class="flex items-center justify-center gap-6 pt-2">
										<div class="flex items-center gap-2">
											<div class="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
												<div class="w-2 h-2 rounded-full bg-green-500"></div>
											</div>
											<span class="text-xs text-gray-600 font-medium">Local only</span>
										</div>
										<div class="flex items-center gap-2">
											<div class="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
												<div class="w-2 h-2 rounded-full bg-blue-500"></div>
											</div>
											<span class="text-xs text-gray-600 font-medium">No signup</span>
										</div>
										<div class="flex items-center gap-2">
											<div class="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center">
												<div class="w-2 h-2 rounded-full bg-purple-500"></div>
											</div>
											<span class="text-xs text-gray-600 font-medium">Instant results</span>
										</div>
									</div>
								</div>
								
								<!-- Subtle bottom accent -->
								<div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-b-3xl"></div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<!-- Features Grid Section -->
			<section class="pb-24 px-6">
				<div class="container mx-auto">
					<div class="max-w-6xl mx-auto mb-24">
						<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-16 text-center">
							Powerful insights at a glance
						</h2>
						<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
							<div class="group text-center p-8 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
								<div class="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
									<div class="w-8 h-8 rounded-full bg-red-500"></div>
								</div>
								<h3 class="text-lg font-semibold text-gray-900 mb-4">Hotspot Heatmaps</h3>
								<p class="text-gray-600 text-sm leading-relaxed">
									Files touched 50+ times, God classes, circular dependencies, refactor candidates
								</p>
							</div>

							<div class="group text-center p-8 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
								<div class="w-16 h-16 mx-auto mb-6 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
									<div class="w-8 h-8 rounded-full bg-blue-500"></div>
								</div>
								<h3 class="text-lg font-semibold text-gray-900 mb-4">Context Switching Tax</h3>
								<p class="text-gray-600 text-sm leading-relaxed">
									PR review lag, knowledge silos, commit timing patterns, productivity gaps
								</p>
							</div>

							<div class="group text-center p-8 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
								<div class="w-16 h-16 mx-auto mb-6 rounded-2xl bg-purple-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
									<div class="w-8 h-8 rounded-full bg-purple-500"></div>
								</div>
								<h3 class="text-lg font-semibold text-gray-900 mb-4">Conway's Law Violations</h3>
								<p class="text-gray-600 text-sm leading-relaxed">
									Team ownership overlaps, merge conflict hotspots, architectural boundaries drift
								</p>
							</div>
						</div>
					</div>

					<!-- Quick Start Guide -->
					<div class="max-w-5xl mx-auto">
						<div class="bg-white rounded-3xl p-12 border border-gray-200">
							<div class="text-center mb-12">
								<div class="w-16 h-16 mx-auto mb-6 rounded-2xl bg-blue-500 flex items-center justify-center">
									<div class="w-6 h-6 rounded-md bg-white"></div>
								</div>
								<h2 class="text-3xl font-bold text-gray-900 mb-4">
									Get started in seconds
								</h2>
								<p class="text-xl text-gray-600 font-light">
									Generate your git log and get architectural insights in under 30 seconds
								</p>
							</div>

							<div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
								<div class="space-y-6">
									<div class="flex items-center gap-4 mb-6">
										<div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
											1
										</div>
										<h3 class="text-xl font-semibold text-gray-900">Basic Analysis</h3>
									</div>
									<div class="bg-gray-50 rounded-2xl p-6 border border-gray-200 font-mono text-sm">
										<div class="text-gray-500 mb-3"># In your project directory:</div>
										<div class="text-gray-900">git log --stat > gitlog.txt</div>
									</div>
									<div class="bg-blue-50 rounded-xl p-4 border border-blue-100">
										<p class="text-gray-700 text-sm">
											<span class="font-medium text-gray-900">Perfect for:</span> Team velocity, commit patterns, file hotspots, contributor analytics
										</p>
									</div>
								</div>

								<div class="space-y-6">
									<div class="flex items-center gap-4 mb-6">
										<div class="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-semibold">
											2
										</div>
										<h3 class="text-xl font-semibold text-gray-900">Deep Architecture Analysis</h3>
									</div>
									<div class="bg-gray-50 rounded-2xl p-6 border border-gray-200 font-mono text-sm">
										<div class="text-gray-500 mb-3"># For advanced architectural KPIs:</div>
										<div class="text-white break-all">
											git log --stat --date=iso --pretty=fuller > detailed.txt
										</div>
									</div>
									<div class="bg-purple-50 rounded-xl p-4 border border-purple-100">
										<p class="text-gray-700 text-sm">
											<span class="font-medium text-gray-900">Perfect for:</span> Technical debt scoring, scaling readiness assessment, architecture health metrics
										</p>
									</div>
								</div>
							</div>

							<!-- Pro Tip -->
							<div class="mt-12 bg-gray-50 rounded-2xl p-6 border border-gray-200">
								<div class="flex items-start gap-4">
									<div class="w-8 h-8 flex-shrink-0 rounded-full bg-green-500 flex items-center justify-center mt-1">
										<div class="w-3 h-3 rounded-sm bg-white"></div>
									</div>
									<div>
										<p class="text-lg font-semibold text-gray-900 mb-3">
											Pro Tip for Software Architects:
										</p>
										<p class="text-gray-700 leading-relaxed">
											Use <code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">--all</code> to analyze all branches, 
											or <code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">--since="6 months ago"</code> 
											to focus on recent architectural evolution patterns and trends.
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
		</div>
	{:else}
		<!-- Apple-Inspired Dashboard Container -->
		<div class="min-h-screen bg-gray-50">
			<div class="container mx-auto px-6 py-8">
				{#if isAnalyzing}
					<!-- Apple-Style Loading State -->
					<div class="flex min-h-[70vh] items-center justify-center">
						<div class="bg-white rounded-3xl p-16 text-center border border-gray-200 shadow-lg max-w-md mx-auto">
							<div class="mb-8 inline-block h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500"></div>
							<h3 class="mb-4 text-2xl font-semibold text-gray-900">
								Analyzing Your Git History
							</h3>
							<p class="text-gray-600 leading-relaxed">
								Processing commits, detecting work sessions, and generating architectural insights...
							</p>
							<div class="mt-8 flex justify-center space-x-1">
								<div class="h-2 w-2 animate-bounce rounded-full bg-blue-500" style="animation-delay: 0ms;"></div>
								<div class="h-2 w-2 animate-bounce rounded-full bg-blue-500" style="animation-delay: 150ms;"></div>
								<div class="h-2 w-2 animate-bounce rounded-full bg-blue-500" style="animation-delay: 300ms;"></div>
							</div>
						</div>
					</div>
				{/if}

				{#if error}
					<!-- Apple-Style Error State -->
					<div class="flex min-h-[70vh] items-center justify-center">
						<div class="mx-auto max-w-lg">
							<div class="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-lg">
								<div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
									<div class="w-8 h-8 rounded-full bg-red-500"></div>
								</div>
								<h3 class="mb-4 text-xl font-semibold text-gray-900">Analysis Error</h3>
								<p class="mb-8 text-gray-600 leading-relaxed">
									{error}
								</p>
								<button
									onclick={resetAnalysis}
									class="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
								>
									Try Again
								</button>
							</div>
						</div>
					</div>
				{/if}

				{#if analytics}
					<!-- Apple-Style Dashboard -->
					<div class="mb-8">
						<!-- Clean Navigation Bar -->
						<div class="bg-white/80 backdrop-blur-xl sticky top-0 z-40 border-b border-gray-200 mb-8 rounded-2xl">
							<div class="px-8 py-6">
								<div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
									<div>
										<h2 class="text-3xl font-bold text-gray-900 mb-2">
											Git Analytics Dashboard
										</h2>
										<p class="text-gray-600">
											Comprehensive analysis of your repository's architectural patterns and team dynamics
										</p>
									</div>
									<button
										onclick={resetAnalysis}
										class="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-full font-medium transition-all duration-200 border border-gray-200"
									>
										<div class="w-4 h-4 rounded-sm bg-gray-400"></div>
										Upload New File
									</button>
								</div>
							</div>
						</div>

						<!-- Clean Tab Navigation -->
						<div class="bg-white border border-gray-200 rounded-2xl p-2 inline-flex gap-1 mb-8 shadow-sm">
							<button
								onclick={() => (activeTab = 'overview')}
								class="flex items-center gap-3 px-6 py-3 font-medium transition-all duration-200 rounded-xl {activeTab === 'overview'
									? 'bg-blue-500 text-white shadow-sm'
									: 'text-gray-700 hover:bg-gray-50'}"
							>
								<div class="w-4 h-4 rounded-sm bg-current opacity-70"></div>
								<span>General Overview</span>
							</button>
							<button
								onclick={() => (activeTab = 'architect')}
								class="flex items-center gap-3 px-6 py-3 font-medium transition-all duration-200 rounded-xl {activeTab === 'architect'
									? 'bg-blue-500 text-white shadow-sm'
									: 'text-gray-700 hover:bg-gray-50'}"
							>
								<div class="w-4 h-4 rounded-sm bg-current opacity-70"></div>
								<span>Architecture KPIs</span>
							</button>
						</div>

						<!-- Dashboard Content -->
						{#if activeTab === 'overview'}
							<Dashboard {analytics} />
						{:else if activeTab === 'architect' && architectAnalytics}
							<ArchitectDashboard architectAnalytics={architectAnalytics} />
						{/if}
					</div>
				{/if}

				<!-- Clean Footer -->
				<footer class="mt-24 border-t border-gray-200 py-12">
					<div class="text-center">
						<p class="text-gray-600 mb-2">
							Built for software architects
						</p>
						<p class="text-gray-500 text-sm">
							Powered by Svelte 5, D3.js, and Tailwind CSS
						</p>
					</div>
				</footer>
			</div>
		</div>
	{/if}
</main>
