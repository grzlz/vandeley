<script>
    import FileUpload from '../lib/components/FileUpload.svelte';
    import Dashboard from '../lib/components/Dashboard.svelte';
    import ArchitectDashboard from '../lib/components/ArchitectDashboard.svelte';
    
    import { parseGitLog, getCommitStats } from '../lib/parser/gitLogParser.js';
    import { detectWorkSessions, getSessionStats } from '../lib/parser/sessionDetector.js';
    import { analyzeCommitTiming, analyzeCommitVelocity } from '../lib/analytics/timeAnalytics.js';
    import { analyzeContributors, getCollaborationMatrix } from '../lib/analytics/contributorAnalytics.js';
    import { analyzeProjectEvolution, calculateProjectMetrics } from '../lib/analytics/projectAnalytics.js';
    import { analyzeTechnicalDebt } from '../lib/analytics/technicalDebtAnalytics.js';
    import { analyzeScalingReadiness } from '../lib/analytics/scalingAnalytics.js';
    import { analyzeVelocityHealth } from '../lib/analytics/velocityAnalytics.js';
    import { analyzeMVPToScaleTransition } from '../lib/analytics/transitionAnalytics.js';
    
    let isAnalyzing = false;
    let analytics = null;
    let architectAnalytics = null;
    let error = null;
    let activeTab = 'overview'; // 'overview' or 'architect'
    
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
            
            // Run architect-specific analytics
            const technicalDebt = analyzeTechnicalDebt(commits, projectEvolution);
            const scalingReadiness = analyzeScalingReadiness(commits, sessions, contributors, projectEvolution);
            const velocityHealth = analyzeVelocityHealth(commits, sessions, contributors, projectEvolution);
            const transitionMetrics = analyzeMVPToScaleTransition(commits, projectEvolution, contributors);
            
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

<main class="min-h-screen font-primary antialiased bg-gray-900">
    {#if !analytics && !error}
        <!-- Hero Landing Page -->
        <div class="relative overflow-hidden">
            <!-- Animated Background -->
            <div class="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <div class="absolute inset-0 bg-grid-pattern opacity-10"></div>
                <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-400/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
            </div>
            
            <!-- Hero Content -->
            <div class="relative z-10">
                <!-- Navigation -->
                <nav class="bg-gray-800/90 backdrop-blur-md border-b border-gray-700/50">
                    <div class="container mx-auto px-6 py-4">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-5">
                                <img src="/logo.png" alt="Vandeley Logo" class="w-16 h-auto" />
                                <div class="flex flex-col justify-center">
                                    <div class="text-2xl font-bold text-white tracking-tight font-primary leading-tight">
                                        vandeley.art
                                    </div>
                                    <div class="text-sm text-gray-300 font-medium tracking-wide font-primary">
                                        software architect
                                    </div>
                                </div>
                            </div>
     
                        </div>
                    </div>
                </nav>
                
                <!-- Hero Section -->
                <section class="container mx-auto px-6 py-20">
                    <div class="text-center mb-16">
                        <div class="flex items-center justify-center gap-4 mb-8">
                            <div class="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 
                                        rounded-3xl flex items-center justify-center text-white text-3xl 
                                        shadow-2xl transform rotate-3 hover:rotate-6 transition-transform duration-300">
                                📊
                            </div>
                            <div>
                                <h1 class="text-6xl md:text-7xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 
                                           bg-clip-text text-transparent leading-tight">
                                    Architecture
                                </h1>
                                <h1 class="text-6xl md:text-7xl font-bold bg-gradient-to-r from-gray-300 to-white 
                                           bg-clip-text text-transparent leading-tight">
                                    Intelligence
                                </h1>
                            </div>
                        </div>
                        
                        <p class="text-2xl text-gray-50 max-w-4xl mx-auto leading-relaxed mb-8 font-light">
                            Transform your <span class="font-semibold text-white">git history</span> into 
                            <span class="font-semibold text-white">actionable architectural insights</span>. <br />
                            Advanced analytics for software architects scaling from MVP to enterprise.
                        </p>
                        
                        <!-- Tech Features -->
                        <div class="flex flex-wrap justify-center gap-4 mb-12">
                            <span class="bg-gray-700/60 px-4 py-2 rounded-full text-gray-50 font-medium text-sm 
                                         flex items-center gap-2 shadow-sm border border-gray-600/30">
                                <span class="w-2 h-2 bg-red-400 rounded-full"></span>
                                Technical Debt Analysis
                            </span>
                            <span class="bg-gray-700/60 px-4 py-2 rounded-full text-gray-50 font-medium text-sm 
                                         flex items-center gap-2 shadow-sm border border-gray-600/30">
                                <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                                Scaling Readiness KPIs
                            </span>
                            <span class="bg-gray-700/60 px-4 py-2 rounded-full text-gray-50 font-medium text-sm 
                                         flex items-center gap-2 shadow-sm border border-gray-600/30">
                                <span class="w-2 h-2 bg-blue-400 rounded-full"></span>
                                Velocity Health Metrics
                            </span>
                            <span class="bg-gray-700/60 px-4 py-2 rounded-full text-gray-50 font-medium text-sm 
                                         flex items-center gap-2 shadow-sm border border-gray-600/30">
                                <span class="w-2 h-2 bg-purple-400 rounded-full"></span>
                                MVP → Scale Transition
                            </span>
                        </div>
                    </div>
                    
                    <!-- File Upload Hero -->
                    <div class="max-w-3xl mx-auto mb-16">
                        <FileUpload on:fileLoaded={handleFileLoaded} />
                    </div>
                    
                    <!-- Architecture KPI Preview -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        <div class="glass-accent rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300">
                            <div class="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl 
                                        flex items-center justify-center text-white text-2xl mx-auto mb-4 shadow-lg">
                                ⚠️
                            </div>
                            <h3 class="text-lg font-bold text-primary-400 mb-2">Technical Debt</h3>
                            <p class="text-sm text-primary-200">Hotspot concentration, churn rates, and architectural violations</p>
                        </div>
                        
                        <div class="glass-accent rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300">
                            <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl 
                                        flex items-center justify-center text-white text-2xl mx-auto mb-4 shadow-lg">
                                📈
                            </div>
                            <h3 class="text-lg font-bold text-primary-400 mb-2">Scaling Ready</h3>
                            <p class="text-sm text-primary-200">Team coordination, release frequency, critical dependencies</p>
                        </div>
                        
                        <div class="glass-accent rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300">
                            <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl 
                                        flex items-center justify-center text-white text-2xl mx-auto mb-4 shadow-lg">
                                ⚡
                            </div>
                            <h3 class="text-lg font-bold text-primary-400 mb-2">Team Velocity</h3>
                            <p class="text-sm text-primary-300">Context switching, knowledge silos, onboarding complexity</p>
                        </div>
                        
                        <div class="glass-accent rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300">
                            <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl 
                                        flex items-center justify-center text-white text-2xl mx-auto mb-4 shadow-lg">
                                🚀
                            </div>
                            <h3 class="text-lg font-bold text-primary-400 mb-2">MVP → Scale</h3>
                            <p class="text-sm text-primary-200">Component coupling, performance debt, infrastructure drift</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
        
        <!-- Instructions Section -->
        <section class="container mx-auto px-6 py-16">
            <div class="max-w-5xl mx-auto">
                <div class="glass-accent rounded-3xl p-12 shadow-2xl">
                    <div class="text-center mb-10">
                        <h2 class="text-3xl font-bold text-primary-400 mb-4 flex items-center justify-center gap-3">
                            <span class="w-10 h-10 bg-gradient-to-br from-secondary-500 to-secondary-600 
                                         rounded-xl flex items-center justify-center text-white text-lg">💡</span>
                            Get Started in 30 Seconds
                        </h2>
                        <p class="text-xl text-primary-200 font-light">Generate your git log and upload for instant architecture insights</p>
                    </div>
                    
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div class="space-y-6">
                            <h3 class="text-xl font-bold text-primary-400 mb-4 flex items-center gap-3">
                                <span class="w-8 h-8 bg-primary-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">1</span>
                                Basic Analysis
                            </h3>
                            <div class="bg-secondary-900 text-secondary-100 p-6 rounded-xl font-mono text-sm shadow-inner">
                                <div class="text-green-400 mb-2"># In your project directory:</div>
                                <div class="text-white">git log --stat > gitlog.txt</div>
                            </div>
                            <div class="text-sm text-primary-600 leading-relaxed">
                                <strong>Perfect for:</strong> Team velocity, commit patterns, file hotspots, contributor analytics
                            </div>
                        </div>
                        
                        <div class="space-y-6">
                            <h3 class="text-xl font-bold text-primary-400 mb-4 flex items-center gap-3">
                                <span class="w-8 h-8 bg-secondary-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">2</span>
                                Deep Architecture Analysis
                            </h3>
                            <div class="bg-secondary-900 text-secondary-100 p-6 rounded-xl font-mono text-sm shadow-inner">
                                <div class="text-green-400 mb-2"># For advanced KPIs:</div>
                                <div class="text-white break-all">git log --stat --date=iso --pretty=fuller > detailed.txt</div>
                            </div>
                            <div class="text-sm text-primary-600 leading-relaxed">
                                <strong>Perfect for:</strong> Technical debt scoring, scaling readiness, architecture health assessment
                            </div>
                        </div>
                    </div>
                    
                    <div class="mt-10 p-6 bg-gradient-to-r from-primary-100/80 to-secondary-100/80 rounded-2xl border border-primary-200/50">
                        <div class="flex items-start gap-4">
                            <div class="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1">
                                ✓
                            </div>
                            <div>
                                <p class="text-primary-800 font-semibold mb-2">Pro Tip for Software Architects:</p>
                                <p class="text-primary-700 text-sm leading-relaxed">
                                    Include <code class="bg-primary-200 px-2 py-1 rounded text-xs">--all</code> to analyze all branches, 
                                    or use <code class="bg-primary-200 px-2 py-1 rounded text-xs">--since="6 months ago"</code> 
                                    to focus on recent architecture evolution patterns.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    {:else}
        <!-- Dashboard Container -->
        <div class="bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-100 min-h-screen">
            <div class="container mx-auto px-6 py-12">
        
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
                        Git Analytics Dashboard
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
                
                <!-- Tab Navigation -->
                <div class="glass-accent rounded-2xl p-2 mb-8 inline-flex gap-2">
                    <button
                        on:click={() => activeTab = 'overview'}
                        class="px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2
                               {activeTab === 'overview' 
                                 ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg' 
                                 : 'text-primary-700 hover:bg-primary-100'}"
                    >
                        <span>📊</span>
                        General Overview
                    </button>
                    <button
                        on:click={() => activeTab = 'architect'}
                        class="px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2
                               {activeTab === 'architect' 
                                 ? 'bg-gradient-to-r from-secondary-500 to-secondary-600 text-white shadow-lg' 
                                 : 'text-primary-700 hover:bg-primary-100'}"
                    >
                        <span>🏗️</span>
                        Architecture KPIs
                    </button>
                </div>
                
                <!-- Dashboard Content -->
                {#if activeTab === 'overview'}
                    <Dashboard {analytics} />
                {:else if activeTab === 'architect' && architectAnalytics}
                    <ArchitectDashboard {architectAnalytics} />
                {/if}
            </div>
        {/if}
        
            <!-- Footer -->
            <footer class="text-center mt-20 py-8 border-t border-primary-200">
                <p class="text-primary-600">
                    Built with ❤️ using Svelte, D3.js, and Tailwind CSS
                </p>
            </footer>
            </div>
        </div>
    {/if}
</main>
