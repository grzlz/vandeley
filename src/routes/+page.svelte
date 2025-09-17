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

<main class="min-h-screen bg-slate-950 font-[system-ui,-apple-system,BlinkMacSystemFont,'SF Pro Display',sans-serif] antialiased">
	{#if showLandingPage}
		<!-- Apple-Inspired Landing Page -->
		<div class="relative">
			<!-- Clean Navigation -->
			<nav class="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
				<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
					<div class="flex items-center gap-4">
						<img src="/logo.png" alt="Vandeley Logo" class="h-8 w-8" />
						<div class="text-sm">
							<div class="text-base font-semibold tracking-tight text-white">vandeley.art</div>
							<div class="text-[0.65rem] font-medium tracking-[0.4em] text-slate-300 uppercase">
								Git Analytics
							</div>
						</div>
					</div>

					<div class="flex items-center gap-4 text-sm font-medium">
						<a
							href="/architecture"
							class="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-slate-200 transition hover:border-white/30 hover:text-white"
						>
							<span class="text-lg">📚</span>
							Learn Architecture
						</a>
					</div>
				</div>
			</nav>

			<!-- Hero Section -->
			<section class="pt-32 pb-16 px-6">
				<div class="container mx-auto">
					<!-- Hero + Demo Layout -->
					<div class="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center mb-16">
						<!-- Hero Content - Left Side (2/3) -->
						<div class="lg:col-span-2">
							<h1 class="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-8 leading-[0.9]">
								Transform git history into
								<span class="text-blue-400">architectural insights</span>
							</h1>

							<p class="text-2xl md:text-3xl text-slate-300 mb-8 font-light leading-relaxed">
								Advanced analytics for vibecoded tech debt enjoyers.
							</p>
						</div>

						<!-- Interactive Demo Playground - Right Side (1/3) -->
						<div class="lg:col-span-1">
							<div class="bg-slate-900/70 rounded-3xl p-8 border border-white/10 backdrop-blur hover:bg-slate-900/90 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
								<!-- Subtle background pattern -->
								<div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 pointer-events-none"></div>

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
										<h3 class="text-2xl font-bold text-white tracking-tight">
											Live Demo
										</h3>
										<p class="text-base text-slate-300 font-medium leading-relaxed">
											Upload your git log and watch your codebase come alive
										</p>
										<div class="flex items-center justify-center gap-2 text-sm text-slate-400">
											<div class="w-1.5 h-1.5 rounded-full bg-green-400"></div>
											<span>Real-time analysis</span>
											<div class="w-1 h-1 rounded-full bg-slate-500"></div>
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
									<div class="bg-slate-800/50 rounded-2xl p-4 border border-white/10">
										<h4 class="font-semibold text-white text-sm mb-3">What you'll discover:</h4>
										<div class="space-y-2">
											<div class="flex items-center gap-3">
												<div class="w-2 h-2 rounded-full bg-red-400"></div>
												<span class="text-sm text-slate-300">Code hotspots & technical debt</span>
											</div>
											<div class="flex items-center gap-3">
												<div class="w-2 h-2 rounded-full bg-blue-400"></div>
												<span class="text-sm text-slate-300">Team collaboration patterns</span>
											</div>
											<div class="flex items-center gap-3">
												<div class="w-2 h-2 rounded-full bg-purple-400"></div>
												<span class="text-sm text-slate-300">Architecture health score</span>
											</div>
										</div>
									</div>

									<!-- Trust indicators -->
									<div class="flex items-center justify-center gap-6 pt-2">
										<div class="flex items-center gap-2">
											<div class="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center">
												<div class="w-2 h-2 rounded-full bg-green-400"></div>
											</div>
											<span class="text-xs text-slate-400 font-medium">Local only</span>
										</div>
										<div class="flex items-center gap-2">
											<div class="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center">
												<div class="w-2 h-2 rounded-full bg-blue-400"></div>
											</div>
											<span class="text-xs text-slate-400 font-medium">No signup</span>
										</div>
										<div class="flex items-center gap-2">
											<div class="w-4 h-4 rounded-full bg-purple-500/20 flex items-center justify-center">
												<div class="w-2 h-2 rounded-full bg-purple-400"></div>
											</div>
											<span class="text-xs text-slate-400 font-medium">Instant results</span>
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

			<!-- Architecture Book CTA Section -->
			<section class="pb-24 px-6">
				<div class="container mx-auto">
					<div class="max-w-5xl mx-auto">
						<div class="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-12 text-white text-center relative overflow-hidden">
							<!-- Background pattern -->
							<div class="absolute inset-0 opacity-10">
								<div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
							</div>

							<div class="relative z-10">
								<div class="text-5xl mb-6">📚</div>
								<h2 class="text-3xl md:text-4xl font-bold mb-4">
									Free Interactive Book: Building Well-Architected Svelte Apps
								</h2>
								<p class="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
									Master component architecture, design patterns, and best practices with hands-on examples.
									Learn the principles that separate good components from great ones.
								</p>

								<div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
									<div class="flex items-center gap-2 text-blue-100">
										<span class="w-2 h-2 bg-green-400 rounded-full"></span>
										<span>Interactive Examples</span>
									</div>
									<div class="flex items-center gap-2 text-blue-100">
										<span class="w-2 h-2 bg-green-400 rounded-full"></span>
										<span>Svelte 5 Best Practices</span>
									</div>
									<div class="flex items-center gap-2 text-blue-100">
										<span class="w-2 h-2 bg-green-400 rounded-full"></span>
										<span>100% Free</span>
									</div>
								</div>

								<a
									href="/architecture"
									class="inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-1"
								>
									<span>Start Reading Chapter 1</span>
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
									</svg>
								</a>

								<div class="mt-6 text-blue-200 text-sm">
									Chapter 1: Component Architecture Fundamentals • 15 min read
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<!-- Features Grid Section -->
			<section class="pb-24 px-6">
				<div class="container mx-auto">
					<div class="max-w-6xl mx-auto mb-24">
						<h2 class="text-3xl md:text-4xl font-bold text-white mb-16 text-center">
							Powerful insights at a glance
						</h2>
						<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
							<div class="group text-center p-8 rounded-2xl border border-white/10 bg-slate-900/70 hover:border-white/20 backdrop-blur transition-all duration-300 hover:-translate-y-1">
								<div class="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
									<div class="w-8 h-8 rounded-full bg-red-500"></div>
								</div>
								<h3 class="text-lg font-semibold text-white mb-4">Hotspot Heatmaps</h3>
								<p class="text-slate-300 text-sm leading-relaxed">
									Files touched 50+ times, God classes, circular dependencies, refactor candidates
								</p>
							</div>

							<div class="group text-center p-8 rounded-2xl border border-white/10 bg-slate-900/70 hover:border-white/20 backdrop-blur transition-all duration-300 hover:-translate-y-1">
								<div class="w-16 h-16 mx-auto mb-6 rounded-2xl bg-blue-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
									<div class="w-8 h-8 rounded-full bg-blue-500"></div>
								</div>
								<h3 class="text-lg font-semibold text-white mb-4">Context Switching Tax</h3>
								<p class="text-slate-300 text-sm leading-relaxed">
									PR review lag, knowledge silos, commit timing patterns, productivity gaps
								</p>
							</div>

							<div class="group text-center p-8 rounded-2xl border border-white/10 bg-slate-900/70 hover:border-white/20 backdrop-blur transition-all duration-300 hover:-translate-y-1">
								<div class="w-16 h-16 mx-auto mb-6 rounded-2xl bg-purple-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
									<div class="w-8 h-8 rounded-full bg-purple-500"></div>
								</div>
								<h3 class="text-lg font-semibold text-white mb-4">Conway's Law Violations</h3>
								<p class="text-slate-300 text-sm leading-relaxed">
									Team ownership overlaps, merge conflict hotspots, architectural boundaries drift
								</p>
							</div>
						</div>
					</div>

					<!-- Quick Start Guide -->
					<div class="max-w-5xl mx-auto">
						<div class="bg-slate-900/70 rounded-3xl p-12 border border-white/10 backdrop-blur">
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
