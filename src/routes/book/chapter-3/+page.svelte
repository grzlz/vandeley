<script>
  import BookLayout from '$lib/layouts/BookLayout.svelte';
  import CompositionEvolution from '$lib/components/book/examples/CompositionEvolution.svelte';
</script>

<svelte:head>
  <title>Chapter 3: Advanced Composition | Vandeley Analytics</title>
</svelte:head>

<BookLayout>
  <h1>Chapter 3: Advanced Composition</h1>

  <p>
    Composition is the art of building complex interfaces from simple, reusable pieces.
    In this chapter, we evolve a monolithic dashboard into a composable system by separating
    rendering, state orchestration, and shared context step by step.
  </p>

  <div class="mb-10 rounded-2xl border border-blue-400/30 bg-blue-500/10 p-6 text-blue-100 backdrop-blur">
    <h2 class="text-lg font-semibold text-white">How to use this chapter</h2>
    <p class="mt-2 text-sm text-blue-200">
      Watch how each evolution stage improves maintainability, reusability, and testability.
      Pay attention to how responsibilities get separated and how composition patterns emerge.
    </p>
    <ul class="mt-4 grid gap-2 text-sm text-blue-200 md:grid-cols-2">
      <li class="flex items-start gap-2">
        <span aria-hidden="true">🧩</span>
        <span>Notice how small, focused components become building blocks for larger interfaces.</span>
      </li>
      <li class="flex items-start gap-2">
        <span aria-hidden="true">🎯</span>
        <span>Track how each component gets a single, clear responsibility.</span>
      </li>
      <li class="flex items-start gap-2">
        <span aria-hidden="true">🔄</span>
        <span>Observe how composition patterns make components reusable across different contexts.</span>
      </li>
      <li class="flex items-start gap-2">
        <span aria-hidden="true">🛠️</span>
        <span>Experiment with each evolution stage in the interactive playground.</span>
      </li>
    </ul>
  </div>

  <h2>Why composition matters</h2>

  <blockquote>
    <p><strong>"Favor object composition over class inheritance."</strong> — Gang of Four</p>
  </blockquote>

  <p>
    In UI development, composition lets you build complex interfaces by combining simple,
    focused components. Instead of creating monolithic dashboard components that do everything,
    you create small pieces that work together. This makes your code easier to test,
    maintain, and extend.
  </p>

  <h2>Running example: analytics dashboard</h2>

  <p>
    Imagine building an analytics dashboard with metrics cards, charts, filters, and tables.
    The naive approach crams everything into one massive component. Through composition patterns,
    we'll refactor this into a system where each piece has a clear purpose and shared state lives
    in one place.
  </p>

  <h3>Evolution walkthrough</h3>

  <p>
    Use the playground below to step through the evolution. Each stage shows the live dashboard,
    the architectural approach, and the trade-offs. Pay special attention to how responsibilities
    shift as we separate rendering, data shaping, and shared state.
  </p>

  <CompositionEvolution />

  <h2>Breakdown: from monolith to composition</h2>

  <h3>1. Monolithic dashboard ("everything in one place")</h3>
  <p>
    The first version puts all dashboard logic in a single component. Metrics calculation,
    data fetching, rendering, and layout are all mixed together. Adding new chart types
    or changing the layout requires editing the entire component.
  </p>

  <h3>2. Componentized view layer ("separate by UI sections")</h3>
  <p>
    We extract chart, metric, and table components so the parent focuses on orchestration.
    Presentational components become dumb renderers with clear prop contracts, leaving
    the container to handle data shaping.
  </p>

  <h3>3. Context-driven composition ("shared state, isolated components")</h3>
  <p>
    Finally, a provider owns the dashboard state and exposes it through context. Widgets
    subscribe to the shared data and can trigger refreshes without prop drilling. Layouts
    become interchangeable collections of autonomous pieces.
  </p>

  <h2>How Svelte 5 runes support composition</h2>

  <ul>
    <li><strong><code>$props()</code></strong> provides clean interfaces between components.</li>
    <li><strong><code>$state()</code></strong> keeps local component state isolated and focused.</li>
    <li><strong><code>getContext()/setContext()</code></strong> shares data without prop drilling.</li>
    <li><strong><code>{'@render children()'}</code></strong> enables flexible content composition.</li>
    <li><strong><code>$derived()</code></strong> creates computed values that automatically update across the composition.</li>
  </ul>

  <h2>Composition patterns checklist</h2>

  <div class="my-8 grid gap-6 md:grid-cols-2">
    <div class="rounded-xl border border-red-400/40 bg-red-500/10 p-6 text-red-100">
      <h3 class="mb-2 text-white">Anti-patterns</h3>
      <ul class="space-y-2 text-sm">
        <li>Massive components that handle multiple concerns</li>
        <li>Deep prop drilling through component hierarchies</li>
        <li>Components that know too much about their siblings</li>
        <li>Hard-coded layout logic mixed with business logic</li>
        <li>Duplicate code across similar dashboard sections</li>
      </ul>
    </div>
    <div class="rounded-xl border border-emerald-400/40 bg-emerald-500/10 p-6 text-emerald-100">
      <h3 class="mb-2 text-white">Good composition</h3>
      <ul class="space-y-2 text-sm">
        <li>Small, focused components with single responsibilities</li>
        <li>Clear data flow through props and context</li>
        <li>Reusable components that work in different contexts</li>
        <li>Separate layout systems from content components</li>
        <li>Composable patterns that enable easy customization</li>
      </ul>
    </div>
  </div>

  <h2>Key takeaways</h2>

  <ol>
    <li><strong>Start small and compose up.</strong> Build with small, focused components that do one thing well.</li>
    <li><strong>Separate layout from content.</strong> Use grid systems to handle positioning and sizing.</li>
    <li><strong>Design clear interfaces.</strong> Props and context should have obvious purposes.</li>
    <li><strong>Think in composition patterns.</strong> How can components be combined in different ways?</li>
    <li><strong>Test components in isolation.</strong> Good composition makes testing much easier.</li>
  </ol>

  <h2>Next steps</h2>

  <p>
    Identify a complex component in your codebase that handles multiple responsibilities.
    Break it down using composition patterns—extract focused components, design clean interfaces,
    and consider how a grid system could improve the layout flexibility.
  </p>
</BookLayout>
