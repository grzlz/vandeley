<script>
    import FileUpload from './lib/components/FileUpload.svelte';
    import Dashboard from './lib/components/Dashboard.svelte';
    
    import { parseGitLog, getCommitStats } from './lib/parser/gitLogParser.js';
    import { detectWorkSessions, getSessionStats } from './lib/parser/sessionDetector.js';
    import { analyzeCommitTiming, analyzeCommitVelocity } from './lib/analytics/timeAnalytics.js';
    import { analyzeContributors, getCollaborationMatrix } from './lib/analytics/contributorAnalytics.js';
    import { analyzeProjectEvolution, calculateProjectMetrics } from './lib/analytics/projectAnalytics.js';
    
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
                throw new Error('No valid commits found in the git log. Please ensure the file contains valid git log output.');
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

<main class="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-100 
             font-primary antialiased">
    <div class="container mx-auto px-6 py-12">
        <!-- Header -->
        <header class="text-center mb-12">
            <div class="flex items-center justify-center gap-4 mb-6">
                <div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 
                            rounded-2xl flex items-center justify-center text-white text-2xl 
                            shadow-lg">
                    📊
                </div>
                <h1 class="text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 
                           bg-clip-text text-transparent">
                    Git Analytics
                </h1>
            </div>
            <p class="text-xl text-primary-700 max-w-2xl mx-auto leading-relaxed">
                Transform your git history into beautiful insights. Upload your git log and discover 
                development patterns, work sessions, and contributor analytics.
            </p>
        </header>
        
        {#if !analytics && !error}
            <!-- File Upload Section -->
            <div class="max-w-2xl mx-auto mb-12">
                <FileUpload on:fileLoaded={handleFileLoaded} />
            </div>
            
            <!-- Instructions -->
            <div class="max-w-4xl mx-auto">
                <div class="glass-accent rounded-2xl p-8 mb-8">
                    <h2 class="text-2xl font-bold text-primary-900 mb-6 flex items-center gap-3">
                        <span class="w-8 h-8 bg-gradient-to-br from-secondary-500 to-secondary-600 
                                     rounded-lg flex items-center justify-center text-white text-sm">💡</span>
                        How to Generate Your Git Log
                    </h2>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 class="text-lg font-semibold text-primary-800 mb-3">Basic Git Log</h3>
                            <div class="bg-secondary-900 text-secondary-100 p-4 rounded-lg font-mono text-sm">
                                git log --stat > gitlog.txt
                            </div>
                            <p class="text-primary-600 mt-2 text-sm">
                                Generates a log with file statistics showing which files were modified.
                            </p>
                        </div>
                        
                        <div>
                            <h3 class="text-lg font-semibold text-primary-800 mb-3">Detailed Git Log</h3>
                            <div class="bg-secondary-900 text-secondary-100 p-4 rounded-lg font-mono text-sm break-all">
                                git log --stat --date=iso --pretty=fuller > detailed_log.txt
                            </div>
                            <p class="text-primary-600 mt-2 text-sm">
                                Includes more detailed information with ISO dates for better analysis.
                            </p>
                        </div>
                    </div>
                    
                    <div class="mt-6 p-4 bg-primary-100/50 rounded-lg">
                        <p class="text-primary-700 text-sm">
                            <strong>Tip:</strong> Run these commands in your project directory, 
                            then upload the generated .txt file above for analysis.
                        </p>
                    </div>
                </div>
            </div>
        {/if}
        
        {#if isAnalyzing}
            <!-- Loading State -->
            <div class="text-center py-20">
                <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 
                            border-primary-200 border-t-primary-600 mb-6"></div>
                <h3 class="text-2xl font-semibold text-primary-800 mb-2">
                    Analyzing Your Git History
                </h3>
                <p class="text-primary-600">
                    Processing commits, detecting work sessions, and generating insights...
                </p>
            </div>
        {/if}
        
        {#if error}
            <!-- Error State -->
            <div class="max-w-2xl mx-auto">
                <div class="glass-accent rounded-2xl p-8 border-2 border-red-200">
                    <div class="text-center">
                        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center 
                                    mx-auto mb-4">
                            <span class="text-red-600 text-2xl">⚠️</span>
                        </div>
                        <h3 class="text-xl font-semibold text-red-800 mb-3">
                            Analysis Error
                        </h3>
                        <p class="text-red-700 mb-6">
                            {error}
                        </p>
                        <button
                            on:click={resetAnalysis}
                            class="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 
                                   text-white rounded-xl font-medium hover:from-primary-600 
                                   hover:to-primary-700 transition-all duration-200 shadow-lg 
                                   hover:shadow-xl transform hover:scale-105"
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
                <div class="flex items-center justify-between mb-8">
                    <h2 class="text-3xl font-bold text-primary-900 flex items-center gap-3">
                        <span class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 
                                     rounded-xl flex items-center justify-center text-white">📈</span>
                        Analytics Dashboard
                    </h2>
                    <button
                        on:click={resetAnalysis}
                        class="px-4 py-2 bg-secondary-200 hover:bg-secondary-300 
                               text-secondary-800 rounded-lg font-medium transition-all duration-200
                               flex items-center gap-2"
                    >
                        <span>🔄</span>
                        Upload New File
                    </button>
                </div>
                
                <Dashboard {analytics} />
            </div>
        {/if}
        
        <!-- Footer -->
        <footer class="text-center mt-20 py-8 border-t border-primary-200">
            <p class="text-primary-600">
                Built with ❤️ using Svelte, D3.js, and Tailwind CSS
            </p>
        </footer>
    </div>
</main>