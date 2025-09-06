<script>
	import FileUpload from './lib/components/FileUpload.svelte';
	import Dashboard from './lib/components/Dashboard.svelte';

	import { parseGitLog, getCommitStats } from './lib/parser/gitLogParser.js';
	import { detectWorkSessions, getSessionStats } from './lib/parser/sessionDetector.js';
	import { analyzeCommitTiming, analyzeCommitVelocity } from './lib/analytics/timeAnalytics.js';
	import {
		analyzeContributors,
		getCollaborationMatrix
	} from './lib/analytics/contributorAnalytics.js';
	import {
		analyzeProjectEvolution,
		calculateProjectMetrics
	} from './lib/analytics/projectAnalytics.js';

	let isAnalyzing = false;
	let analytics = null;
	let error = null;

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
		} catch (err) {
			error = err.message;
			console.error('Analysis error:', err);
		} finally {
			isAnalyzing = false;
		}
	}

	function resetAnalysis() {
		analytics = null;
		error = null;
	}
</script>

<main
	class="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-100
             font-primary antialiased"
>
	<div class="container mx-auto px-6 py-12">
		<!-- Header -->
		<header class="mb-12 text-center">
			<div class="mb-6 flex items-center justify-center gap-4">
				<div
					class="flex h-16 w-16 items-center justify-center
                            rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-2xl text-white
                            shadow-lg"
				>
					📊
				</div>
				<h1
					class="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-5xl
                           font-bold text-transparent"
				>
					Git Analytics
				</h1>
			</div>
			<p class="mx-auto max-w-2xl text-xl leading-relaxed text-primary-700">
				Transform your git history into beautiful insights. Upload your git log and discover
				development patterns, work sessions, and contributor analytics.
			</p>
		</header>

		{#if !analytics && !error}
			<!-- File Upload Section -->
			<div class="mx-auto mb-12 max-w-2xl">
				<FileUpload on:fileLoaded={handleFileLoaded} />
			</div>

			<!-- Instructions -->
			<div class="mx-auto max-w-4xl">
				<div class="glass-accent mb-8 rounded-2xl p-8">
					<h2 class="mb-6 flex items-center gap-3 text-2xl font-bold text-primary-900">
						<span
							class="flex h-8 w-8 items-center justify-center
                                     rounded-lg bg-gradient-to-br from-secondary-500 to-secondary-600 text-sm text-white"
							>💡</span
						>
						How to Generate Your Git Log
					</h2>

					<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
						<div>
							<h3 class="mb-3 text-lg font-semibold text-primary-800">Basic Git Log</h3>
							<div class="rounded-lg bg-secondary-900 p-4 font-mono text-sm text-secondary-100">
								git log --stat > gitlog.txt
							</div>
							<p class="mt-2 text-sm text-primary-600">
								Generates a log with file statistics showing which files were modified.
							</p>
						</div>

						<div>
							<h3 class="mb-3 text-lg font-semibold text-primary-800">Detailed Git Log</h3>
							<div
								class="rounded-lg bg-secondary-900 p-4 font-mono text-sm break-all text-secondary-100"
							>
								git log --stat --date=iso --pretty=fuller > detailed_log.txt
							</div>
							<p class="mt-2 text-sm text-primary-600">
								Includes more detailed information with ISO dates for better analysis.
							</p>
						</div>
					</div>

					<div class="mt-6 rounded-lg bg-primary-100/50 p-4">
						<p class="text-sm text-primary-700">
							<strong>Tip:</strong> Run these commands in your project directory, then upload the generated
							.txt file above for analysis.
						</p>
					</div>
				</div>
			</div>
		{/if}

		{#if isAnalyzing}
			<!-- Loading State -->
			<div class="py-20 text-center">
				<div
					class="mb-6 inline-block h-16 w-16 animate-spin rounded-full
                            border-4 border-primary-200 border-t-primary-600"
				></div>
				<h3 class="mb-2 text-2xl font-semibold text-primary-800">Analyzing Your Git History</h3>
				<p class="text-primary-600">
					Processing commits, detecting work sessions, and generating insights...
				</p>
			</div>
		{/if}

		{#if error}
			<!-- Error State -->
			<div class="mx-auto max-w-2xl">
				<div class="glass-accent rounded-2xl border-2 border-red-200 p-8">
					<div class="text-center">
						<div
							class="mx-auto mb-4 flex h-16 w-16 items-center justify-center
                                    rounded-full bg-red-100"
						>
							<span class="text-2xl text-red-600">⚠️</span>
						</div>
						<h3 class="mb-3 text-xl font-semibold text-red-800">Analysis Error</h3>
						<p class="mb-6 text-red-700">
							{error}
						</p>
						<button
							on:click={resetAnalysis}
							class="transform rounded-xl bg-gradient-to-r from-primary-500 to-primary-600
                                   px-6 py-3 font-medium text-white
                                   shadow-lg transition-all duration-200 hover:scale-105
                                   hover:from-primary-600 hover:to-primary-700 hover:shadow-xl"
						>
							Try Again
						</button>
					</div>
				</div>
			</div>
		{/if}

		{#if analytics}
			<!-- Dashboard -->
			<div class="mb-8">
				<div class="mb-8 flex items-center justify-between">
					<h2 class="flex items-center gap-3 text-3xl font-bold text-primary-900">
						<span
							class="flex h-10 w-10 items-center justify-center
                                     rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white"
							>📈</span
						>
						Analytics Dashboard
					</h2>
					<button
						on:click={resetAnalysis}
						class="flex items-center gap-2 rounded-lg
                               bg-secondary-200 px-4 py-2 font-medium text-secondary-800
                               transition-all duration-200 hover:bg-secondary-300"
					>
						<span>🔄</span>
						Upload New File
					</button>
				</div>

				<Dashboard {analytics} />
			</div>
		{/if}

		<!-- Footer -->
		<footer class="mt-20 border-t border-primary-200 py-8 text-center">
			<p class="text-primary-600">Built with ❤️ using Svelte, D3.js, and Tailwind CSS</p>
		</footer>
	</div>
</main>
