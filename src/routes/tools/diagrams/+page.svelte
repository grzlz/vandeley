<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { markToolExplored } from '$lib/stores/progress.svelte.js';

	let mermaid;
	let diagramCode = $state(`graph TD
    A[Your System] --> B[Component]
    B --> C[Another Component]`);

	let savedDiagrams = $state([]);
	let currentName = $state('');
	let error = $state('');
	let currentExampleIndex = $state(0);

	// Mark tool as explored
	if (browser) {
		markToolExplored('diagrams');
	}

	const examples = [
		{
			name: 'Basic Graph',
			description: 'Simple component flow with styling',
			code: `graph LR
    Start[Start]

    %% Horizontal section
    Start --> H1[Step 1]
    H1 --> H2[Step 2]
    H2 --> H3[Step 3]

    %% Bridge element
    H3 --> Bridge[ ]

    %% Vertical section - use line breaks to stack
    Bridge --> V1["Step A<br/><br/>↓<br/><br/>Step B"]

    %% Styling
    classDef horizontalStyle fill:#fff4e6,stroke:#ffa500,stroke-width:2px
    classDef verticalStyle fill:#e6f3ff,stroke:#0066cc,stroke-width:2px
    classDef invisible fill:none,stroke:none

    class H1,H2,H3 horizontalStyle
    class V1 verticalStyle
    class Bridge invisible`
		},
		{
			name: 'Component Flow',
			description: 'Flowchart with decision nodes',
			code: `graph LR
    A[User Action] --> B{Route Type?}
    B -->|Component| C[Render Component]
    B -->|Page| D[Load Page Data]
    D --> E[Server Response]
    E --> F[Hydrate Client]
    C --> F
    F --> G[Interactive UI]`
		},
		{
			name: 'Data Model',
			description: 'Entity Relationship Diagram',
			code: `erDiagram
    COMPONENTS ||--o{ PROPS : "accepts"
    COMPONENTS ||--o{ STATE : "manages"
    STATE ||--o{ EFFECTS : "triggers"

    COMPONENTS {
        string id
        string name
        array props
        object state
        boolean reactive
    }

    PROPS {
        string name
        string type
        boolean required
        any default
    }

    STATE {
        string key
        any value
        boolean reactive
        array watchers
    }`
		},
		{
			name: 'Sequence Diagram',
			description: 'Component interaction sequence',
			code: `sequenceDiagram
    participant U as User
    participant C as Component
    participant S as Store
    participant A as API

    U->>C: Click button
    C->>S: Update state
    S->>C: Notify subscribers
    C->>A: Fetch data
    A->>C: Return response
    C->>S: Update with data
    S->>C: Re-render
    C->>U: Show updated UI`
		},
		{
			name: 'Architecture Layers',
			description: 'System architecture with services',
			code: `graph TD
    A["Routes"] --> B["/components"]
    A --> C["/pages"]
    A --> D["/api"]

    B --> E[Component Library]
    B --> F[UI Components]
    B --> G[Layout Components]

    H[Shared Services] --> I[dataService.js]
    H --> J[authService.js]
    H --> K[apiService.js]

    E -.uses.-> I
    F -.uses.-> I
    G -.uses.-> I

    L[Utilities] --> M[validators]
    L --> N[formatters]
    L --> O[helpers]

    F -.renders.-> N
    F -.validates.-> M`
		},
		{
			name: 'State Machine',
			description: 'Component state transitions',
			code: `stateDiagram-v2
    [*] --> Idle: Component mounted
    Idle --> Loading: User action
    Loading --> Success: Data loaded
    Loading --> Error: Request failed
    Success --> Idle: Reset
    Error --> Idle: Retry
    Error --> Loading: Auto-retry
    Success --> [*]: Component destroyed`
		},
		{
			name: 'Component Structure',
			description: 'Complex graph with subgraphs',
			code: `graph TB
    subgraph App["Application Layer"]
        A[Router]
        B[Layout]
        C[Pages]
    end

    A --> D{Route Match?}
    D -->|Yes| E[Load Component]
    D -->|No| F[404 Page]

    E --> G[Fetch Data]
    G -->|Success| H[Render]
    G -->|Error| I[Error Boundary]

    B --> J[Header]
    B --> K[Sidebar]
    B --> L[Footer]

    H --> M[Mount to DOM]`
		}
	];

	function nextExample() {
		currentExampleIndex = (currentExampleIndex + 1) % examples.length;
	}

	function prevExample() {
		currentExampleIndex = currentExampleIndex === 0 ? examples.length - 1 : currentExampleIndex - 1;
	}

	function loadExample() {
		diagramCode = examples[currentExampleIndex].code;
		renderDiagram();
	}

	onMount(async () => {
		if (browser) {
			mermaid = (await import('mermaid')).default;
			mermaid.initialize({
				startOnLoad: false,
				theme: 'dark',
				securityLevel: 'loose'
			});

			// Load saved diagrams from localStorage
			const saved = localStorage.getItem('mermaid-diagrams');
			if (saved) savedDiagrams = JSON.parse(saved);

			renderDiagram();
		}
	});

	async function renderDiagram() {
		if (!mermaid || !browser) return;

		const preview = document.getElementById('preview');
		if (!preview) return;

		try {
			preview.innerHTML = '';
			const { svg } = await mermaid.render('preview-diagram', diagramCode);
			preview.innerHTML = svg;
			error = '';
		} catch (e) {
			error = e.message;
			preview.innerHTML = `<div class="text-red-400 p-4">${e.message}</div>`;
		}
	}

	function saveDiagram() {
		if (!currentName) {
			alert('Please enter a diagram name');
			return;
		}

		const newDiagram = {
			name: currentName,
			code: diagramCode,
			timestamp: new Date().toISOString()
		};

		savedDiagrams = [...savedDiagrams, newDiagram];
		localStorage.setItem('mermaid-diagrams', JSON.stringify(savedDiagrams));
		currentName = '';
	}

	function loadDiagram(diagram) {
		diagramCode = diagram.code;
		renderDiagram();
	}

	function deleteDiagram(index) {
		savedDiagrams = savedDiagrams.filter((_, i) => i !== index);
		localStorage.setItem('mermaid-diagrams', JSON.stringify(savedDiagrams));
	}

	function exportSVG() {
		const svg = document.querySelector('#preview svg');
		if (!svg) return;

		const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${currentName || 'diagram'}.svg`;
		a.click();
	}

	function copyCode() {
		navigator.clipboard.writeText(diagramCode);
		alert('Code copied to clipboard!');
	}
</script>

<svelte:head>
	<title>Architecture Diagrams Studio | Vandeley</title>
</svelte:head>

<main
	class="min-h-screen bg-slate-950 font-[system-ui,-apple-system,BlinkMacSystemFont,'SF Pro Display',sans-serif] antialiased"
>
	<!-- Navigation -->
	<nav
		class="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl"
	>
		<div class="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-6 py-3 md:py-4">
			<a href="/" class="flex items-center gap-2 md:gap-4 hover:opacity-80 transition">
				<img src="/logo.png" alt="Vandeley Logo" class="h-8 w-8 md:h-12 md:w-12 object-contain" />
				<div class="flex flex-col">
					<div
						class="text-sm md:text-base font-semibold tracking-tight text-white whitespace-nowrap"
					>
						vandeley.art
					</div>
					<div
						class="text-[0.55rem] md:text-[0.65rem] font-medium tracking-[0.4em] text-slate-300 uppercase whitespace-nowrap"
					>
						Diagrams Studio
					</div>
				</div>
			</a>

			<div class="flex items-center gap-2 md:gap-4 text-xs md:text-sm font-medium">
				<a
					href="/learn"
					class="rounded-full border border-white/10 px-2 md:px-4 py-1.5 md:py-2 text-slate-200 transition hover:border-white/30 hover:text-white whitespace-nowrap"
				>
					<span class="hidden sm:inline">Architecture Hub</span>
					<span class="sm:hidden">Hub</span>
				</a>
			</div>
		</div>
	</nav>

	<div class="pt-20 pb-12 px-4 md:px-6">
		<div class="max-w-7xl mx-auto">
			<!-- Book CTA Banner -->
			<div
				class="mb-8 relative rounded-2xl p-6 overflow-hidden border border-blue-400/30 bg-blue-500/10 backdrop-blur-xl"
			>
				<div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5"></div>
				<div class="relative z-10 flex items-center gap-4">
					<span class="text-3xl">📚</span>
					<div class="flex-1">
						<p class="text-white font-medium mb-1">Learning architecture?</p>
						<p class="text-blue-200 text-sm">
							Check out our interactive book to master component patterns and design principles.
						</p>
					</div>
					<a
						href="/book/chapter-1"
						class="hidden md:inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-xl font-medium hover:bg-white/20 hover:border-white/30 transition-all duration-200"
					>
						<span>Read the book</span>
						<span>→</span>
					</a>
				</div>
			</div>

			<!-- Header -->
			<div class="mb-8 bg-slate-900/30 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
				<div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
					<div>
						<h1 class="text-3xl md:text-4xl font-bold text-white mb-2">
							Architecture Diagrams Studio
						</h1>
						<p class="text-slate-300 text-sm md:text-base">
							Visualize system architecture with live Mermaid preview
						</p>
					</div>

					<div class="flex flex-wrap items-center gap-2">
						<input
							type="text"
							bind:value={currentName}
							placeholder="Diagram name..."
							class="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 backdrop-blur-sm min-w-[180px]"
						/>
						<button
							onclick={saveDiagram}
							class="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-all hover:scale-105"
						>
							Save
						</button>
						<button
							onclick={exportSVG}
							class="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium transition-all"
						>
							Export SVG
						</button>
						<button
							onclick={copyCode}
							class="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium transition-all"
						>
							Copy
						</button>
						<button
							onclick={renderDiagram}
							class="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium transition-all hover:rotate-90"
						>
							↻
						</button>
					</div>
				</div>
			</div>

			<!-- Error Banner -->
			{#if error}
				<div
					class="mb-6 rounded-xl p-4 bg-red-500/20 border border-red-400/30 backdrop-blur-xl animate-in slide-in-from-top"
				>
					<div class="flex items-center gap-3 text-white">
						<span class="text-xl">⚠️</span>
						<span class="font-mono text-sm">{error}</span>
					</div>
				</div>
			{/if}

			<!-- Workspace -->
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
				<!-- Editor Panel -->
				<div
					class="bg-slate-900/30 backdrop-blur-xl rounded-2xl overflow-hidden flex flex-col border border-white/10"
				>
					<div
						class="px-6 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between"
					>
						<h3 class="text-sm font-semibold text-white uppercase tracking-wide">Editor</h3>
						<span
							class="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium"
						>
							Mermaid Syntax
						</span>
					</div>
					<textarea
						bind:value={diagramCode}
						oninput={renderDiagram}
						spellcheck="false"
						placeholder="Start typing your Mermaid diagram..."
						class="flex-1 min-h-[500px] p-6 bg-slate-900/50 text-white font-mono text-sm leading-relaxed focus:outline-none placeholder-slate-500 resize-none"
					/>
				</div>

				<!-- Preview Panel -->
				<div
					class="bg-slate-900/30 backdrop-blur-xl rounded-2xl overflow-hidden flex flex-col border border-white/10"
				>
					<div
						class="px-6 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between"
					>
						<h3 class="text-sm font-semibold text-white uppercase tracking-wide">Preview</h3>
						<span
							class="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-medium"
						>
							Live Render
						</span>
					</div>
					<div class="flex-1 min-h-[500px] p-6 bg-slate-800/50 overflow-auto">
						<div
							id="preview"
							class="bg-slate-800/30 rounded-lg flex items-center justify-center min-h-full"
						></div>
					</div>
				</div>
			</div>

			<!-- Examples Carousel -->
			<div class="bg-slate-900/30 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-white/10">
				<div class="flex items-center justify-between mb-4">
					<div>
						<h2 class="text-lg font-semibold text-white">Learning Examples</h2>
						<p class="text-slate-400 text-sm mt-1">Architecture diagram patterns and examples</p>
					</div>
					<span class="px-3 py-1 rounded-full bg-white/10 text-white text-sm font-medium">
						{currentExampleIndex + 1} / {examples.length}
					</span>
				</div>

				<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<!-- Example Info -->
					<div class="lg:col-span-1 flex flex-col gap-3">
						<div class="bg-slate-800/50 rounded-xl p-4 border border-white/10">
							<h3 class="text-white font-semibold mb-2">{examples[currentExampleIndex].name}</h3>
							<p class="text-slate-300 text-sm mb-4">
								{examples[currentExampleIndex].description}
							</p>

							<div class="flex gap-2">
								<button
									onclick={prevExample}
									class="flex-1 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium transition-all"
								>
									← Previous
								</button>
								<button
									onclick={nextExample}
									class="flex-1 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium transition-all"
								>
									Next →
								</button>
							</div>

							<button
								onclick={loadExample}
								class="w-full mt-3 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-all hover:scale-105"
							>
								Load This Example
							</button>
						</div>

						<div class="bg-slate-800/50 rounded-xl p-4 border border-white/10">
							<h4 class="text-slate-300 text-xs font-semibold uppercase tracking-wide mb-2">
								Complexity Level
							</h4>
							<div class="flex gap-1">
								{#each Array(7) as _, i}
									<div
										class="flex-1 h-2 rounded-full {i <= currentExampleIndex
											? 'bg-blue-500'
											: 'bg-white/20'}"
									></div>
								{/each}
							</div>
						</div>
					</div>

					<!-- Example Code Preview -->
					<div class="lg:col-span-2 bg-slate-800/50 rounded-xl overflow-hidden border border-white/10">
						<div class="px-4 py-3 bg-white/5 border-b border-white/10">
							<span class="text-slate-400 text-xs font-mono">Preview Code</span>
						</div>
						<pre
							class="p-4 overflow-auto max-h-64 text-slate-300 text-sm font-mono leading-relaxed">{examples[
								currentExampleIndex
							].code}</pre>
					</div>
				</div>
			</div>

			<!-- Saved Diagrams -->
			{#if savedDiagrams.length > 0}
				<div class="bg-slate-900/30 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
					<div class="flex items-center justify-between mb-4">
						<h2 class="text-lg font-semibold text-white">Saved Diagrams</h2>
						<span class="px-3 py-1 rounded-full bg-white/10 text-white text-sm font-medium">
							{savedDiagrams.length}
						</span>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
						{#each savedDiagrams as diagram, index}
							<div class="flex gap-2">
								<button
									onclick={() => loadDiagram(diagram)}
									class="flex-1 p-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 transition-all hover:scale-105 text-left group"
								>
									<div class="text-white font-medium text-sm mb-1 group-hover:text-white/90">
										{diagram.name}
									</div>
									<div class="text-slate-400 text-xs">
										{new Date(diagram.timestamp).toLocaleDateString()}
									</div>
								</button>
								<button
									onclick={() => deleteDiagram(index)}
									class="w-12 rounded-lg bg-white/10 hover:bg-red-500/30 border border-white/10 hover:border-red-400/40 text-white hover:text-red-200 text-xl transition-all hover:scale-110"
								>
									×
								</button>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
</main>

<style>
	:global(#preview svg) {
		max-width: 100%;
		height: auto;
		filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.08));
	}
</style>
