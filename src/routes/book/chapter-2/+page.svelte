<script>
  import BookLayout from '$lib/layouts/BookLayout.svelte';
  import StateComparison from '$lib/components/book/examples/StateComparison.svelte';
</script>

<svelte:head>
	<title>Chapter 2: State Management Patterns | Vandeley Analytics</title>
	<meta name="description" content="Master state management patterns in Svelte 5. Learn ownership, flow, and synchronization principles that make applications predictable and scalable." />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="article" />
	<meta property="og:url" content="https://www.vandeley.art/book/chapter-2" />
	<meta property="og:title" content="Chapter 2: State Management Patterns | Vandeley Analytics" />
	<meta property="og:description" content="Master state management patterns in Svelte 5. Learn ownership, flow, and synchronization principles that make applications predictable and scalable." />
	<meta property="og:image" content="https://www.vandeley.art/screenshot.png" />
	<meta property="og:image:width" content="1568" />
	<meta property="og:image:height" content="879" />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:site_name" content="Vandeley Analytics" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@vandeley" />
	<meta name="twitter:creator" content="@vandeley" />
	<meta name="twitter:title" content="Chapter 2: State Management Patterns | Vandeley Analytics" />
	<meta name="twitter:description" content="Master state management patterns in Svelte 5. Learn ownership, flow, and synchronization principles that make applications predictable and scalable." />
	<meta name="twitter:image" content="https://www.vandeley.art/screenshot.png" />
	<meta name="twitter:image:alt" content="Vandeley Analytics - State Management Chapter" />
</svelte:head>

<BookLayout>
  <h1>Chapter 2: State Management Patterns</h1>

  <p>Now that we understand component architecture fundamentals, let's explore how to manage state effectively across your Svelte applications. State management is where many applications become complex and hard to maintain—but with the right patterns, it becomes predictable and scalable.</p>

  <div class="mb-10 rounded-2xl border border-blue-400/30 bg-blue-500/10 p-6 text-blue-100 backdrop-blur">
    <h2 class="text-lg font-semibold text-white">How to approach this chapter</h2>
    <p class="mt-2 text-sm text-blue-200">
      Focus on understanding the <em>why</em> behind each pattern. State management isn't about memorizing syntax—it's about
      making architectural decisions that keep your data flow predictable and your components maintainable.
    </p>
    <ul class="mt-4 grid gap-2 text-sm text-blue-200 md:grid-cols-2">
      <li class="flex items-start gap-2">
        <span aria-hidden="true">🎯</span>
        <span>Identify the ownership for every piece of state in your application.</span>
      </li>
      <li class="flex items-start gap-2">
        <span aria-hidden="true">🔄</span>
        <span>Practice unidirectional data flow patterns in the interactive examples.</span>
      </li>
      <li class="flex items-start gap-2">
        <span aria-hidden="true">⚡</span>
        <span>Notice how Svelte 5's runes make complex state patterns simpler and more performant.</span>
      </li>
      <li class="flex items-start gap-2">
        <span aria-hidden="true">🧪</span>
        <span>Think about how each pattern affects testing and debugging in your applications.</span>
      </li>
    </ul>
  </div>

  <h2>The Philosophy of State Management</h2>

  <blockquote>
    <p><strong>"State management is not about managing state. It's about managing complexity."</strong> - Dan Abramov</p>
  </blockquote>

  <p>Every piece of state in your application tells a story about user interaction, data flow, and business logic. Good state management patterns make these stories clear and predictable. Poor patterns create confusion, bugs, and maintenance nightmares.</p>

  <h3>The Three Pillars of State Management</h3>

  <ol>
    <li><strong>Ownership</strong> - Every piece of state has a clear owner</li>
    <li><strong>Flow</strong> - Data moves in predictable directions</li>
    <li><strong>Synchronization</strong> - Related state stays consistent</li>
  </ol>

  <h2>State Ownership Patterns</h2>

  <p>The most important decision in state management is determining <em>where</em> state lives. Svelte 5's runes give us powerful tools, but the patterns for organizing state remain crucial.</p>

  <h3>The State Ownership Hierarchy</h3>

  <div class="my-8 rounded-xl border border-gray-200 bg-gray-50 p-6">
    <h4 class="mb-4 font-semibold">From Most Local to Most Global:</h4>
    <div class="space-y-4">
      <div class="rounded-lg border border-green-200 bg-green-50 p-4">
        <h5 class="font-medium text-green-800">1. Component Local State</h5>
        <p class="mt-1 text-sm text-green-700">Use <code>$state()</code> for data that only this component cares about.</p>
        <code class="mt-2 block text-xs text-green-600">let count = $state(0);</code>
      </div>
      <div class="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h5 class="font-medium text-blue-800">2. Lifted State</h5>
        <p class="mt-1 text-sm text-blue-700">Move state up when multiple children need to share it.</p>
        <code class="mt-2 block text-xs text-blue-600">// Parent owns, children receive via props</code>
      </div>
      <div class="rounded-lg border border-purple-200 bg-purple-50 p-4">
        <h5 class="font-medium text-purple-800">3. Module-Level State</h5>
        <p class="mt-1 text-sm text-purple-700">Use reactive objects for application-wide state.</p>
        <code class="mt-2 block text-xs text-purple-600">export const appState = $state(&#123; user: null &#125;);</code>
      </div>
    </div>
  </div>

  <h3>The Single Source of Truth Principle</h3>

  <p>Every piece of state should have exactly one owner. This owner is responsible for:</p>
  <ul>
    <li>Initializing the state</li>
    <li>Updating the state</li>
    <li>Exposing read-only access to consumers</li>
    <li>Maintaining state consistency</li>
  </ul>

  <h2>Data Flow Patterns</h2>

  <p>How data moves through your application determines how easy it is to understand, debug, and maintain. Svelte 5's reactivity makes implementing clean data flow patterns straightforward.</p>

  <h3>Unidirectional Data Flow</h3>

  <p>The fundamental pattern of modern UI frameworks: data flows down through props, changes flow up through events.</p>

  <div class="my-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
    <h4 class="mb-4 font-medium">The Flow:</h4>
    <div class="space-y-3 text-sm">
      <div class="flex items-center gap-3">
        <span class="rounded bg-blue-100 px-2 py-1 text-blue-800">Parent State</span>
        <span class="text-gray-400">→</span>
        <span class="rounded bg-green-100 px-2 py-1 text-green-800">Child Props</span>
      </div>
      <div class="flex items-center gap-3">
        <span class="rounded bg-green-100 px-2 py-1 text-green-800">Child Events</span>
        <span class="text-gray-400">→</span>
        <span class="rounded bg-blue-100 px-2 py-1 text-blue-800">Parent Handlers</span>
      </div>
    </div>
  </div>

  <h3>State Lifting Patterns</h3>

  <p>When multiple components need access to the same state, lift it to their closest common ancestor. This maintains the single source of truth while allowing shared access.</p>

  <h2>Svelte 5 Reactive Patterns</h2>

  <p>Svelte 5's runes provide powerful primitives for building reactive state management patterns. Let's explore how to use them effectively.</p>

  <h3>$state() - Reactive Primitives</h3>

  <p>The foundation of Svelte 5 state management. Use <code>$state()</code> for any data that can change over time.</p>

  <div class="my-6 rounded-xl border border-gray-200 bg-gray-900 p-4 text-gray-100">
    <pre><code>// Simple reactive state
let count = $state(0);

// Reactive objects
let user = $state(&#123;
  name: 'Jane',
  email: 'jane@example.com',
  preferences: &#123; theme: 'dark' &#125;
&#125;);

// Reactive arrays
let todos = $state([]);</code></pre>
  </div>

  <h3>$derived() - Computed State</h3>

  <p>Use derived state for values that are computed from other state. This ensures consistency and performance.</p>

  <div class="my-6 rounded-xl border border-gray-200 bg-gray-900 p-4 text-gray-100">
    <pre><code>// Simple derived values
let doubled = $derived(count * 2);

// Complex computations
let completedTodos = $derived(
  todos.filter(todo => todo.completed)
);

// For expensive computations
let expensiveComputation = $derived.by(() => &#123;
  return heavyCalculation(largeDataSet);
&#125;);</code></pre>
  </div>

  <h3>$effect() - Side Effects</h3>

  <p>Use effects to react to state changes and perform side effects like API calls, localStorage updates, or DOM manipulation.</p>

  <div class="my-6 rounded-xl border border-gray-200 bg-gray-900 p-4 text-gray-100">
    <pre><code>// React to state changes
$effect(() => &#123;
  console.log('Count changed:', count);
&#125;);

// Side effects with cleanup
$effect(() => &#123;
  const interval = setInterval(() => &#123;
    updateTime();
  &#125;, 1000);

  return () => clearInterval(interval);
&#125;);</code></pre>
  </div>

  <h2>State Organization Patterns</h2>

  <p>How you structure your state affects maintainability, performance, and developer experience. Let's explore proven patterns.</p>

  <h3>State Normalization</h3>

  <p>For complex data structures, normalize your state to avoid duplication and make updates easier.</p>

  <div class="my-6 grid gap-6 md:grid-cols-2">
    <div class="rounded-xl border border-red-200 bg-red-50 p-4">
      <h4 class="font-medium text-red-800">❌ Nested State</h4>
      <pre class="mt-2 text-xs text-red-700"><code>let state = $state(&#123;
  posts: [
    &#123; id: 1, title: '...', author: &#123; id: 1, name: 'John' &#125; &#125;,
    &#123; id: 2, title: '...', author: &#123; id: 1, name: 'John' &#125; &#125;
  ]
&#125;);</code></pre>
    </div>
    <div class="rounded-xl border border-green-200 bg-green-50 p-4">
      <h4 class="font-medium text-green-800">✅ Normalized State</h4>
      <pre class="mt-2 text-xs text-green-700"><code>let state = $state(&#123;
  posts: &#123; 1: &#123; id: 1, title: '...', authorId: 1 &#125; &#125;,
  authors: &#123; 1: &#123; id: 1, name: 'John' &#125; &#125;
&#125;);</code></pre>
    </div>
  </div>

  <h3>State Machines</h3>

  <p>For complex state transitions, model your state as a finite state machine using Svelte 5's reactivity.</p>

  <div class="my-6 rounded-xl border border-gray-200 bg-gray-900 p-4 text-gray-100">
    <pre><code>let formState = $state(&#123;
  status: 'idle', // 'idle' | 'submitting' | 'success' | 'error'
  data: &#123;&#125;,
  error: null
&#125;);

function submitForm() &#123;
  formState.status = 'submitting';
  // API call logic...
&#125;</code></pre>
  </div>

  <h2>Practical State Management Patterns</h2>

  <p>Let's see these patterns in action with real-world examples that demonstrate good and bad state management approaches.</p>

  <StateComparison />

  <h2>Advanced Patterns</h2>

  <h3>State Composition</h3>

  <p>Combine multiple state objects and derived values to create complex, maintainable state systems.</p>

  <h3>Optimistic Updates</h3>

  <p>Update the UI immediately, then sync with the server. This pattern improves perceived performance.</p>

  <h3>Command Pattern</h3>

  <p>Encapsulate state changes as commands for better testing, undo/redo functionality, and debugging.</p>

  <h2>Performance Considerations</h2>

  <p>Svelte 5's reactivity is highly optimized, but understanding these patterns helps you build performant applications:</p>

  <ul>
    <li><strong>Use $derived.by() for expensive computations</strong> - It only recalculates when dependencies change</li>
    <li><strong>Keep state shallow when possible</strong> - Reduces reactive update complexity</li>
    <li><strong>Batch related updates</strong> - Svelte automatically batches synchronous updates</li>
    <li><strong>Use effects sparingly</strong> - Prefer derived values over effects when possible</li>
  </ul>

  <h2>Testing State Management</h2>

  <p>Well-structured state is easier to test. These patterns make testing straightforward:</p>

  <ul>
    <li><strong>Pure state transformations</strong> - Easy to unit test</li>
    <li><strong>Clear state ownership</strong> - Know exactly what to test where</li>
    <li><strong>Predictable data flow</strong> - Test inputs and outputs</li>
    <li><strong>Isolated side effects</strong> - Mock external dependencies cleanly</li>
  </ul>

  <h2>Key Takeaways</h2>

  <ol>
    <li><strong>State Has Clear Owners</strong> - Every piece of state belongs somewhere specific</li>
    <li><strong>Data Flows Predictably</strong> - Down through props, up through events</li>
    <li><strong>Derived Values Stay Consistent</strong> - Use $derived() instead of manual synchronization</li>
    <li><strong>Effects Handle Side Effects</strong> - Keep side effects separate from state logic</li>
    <li><strong>Structure Matches Usage</strong> - Organize state to match how your components consume it</li>
  </ol>

  <h2>What's Next?</h2>

  <p>In the next chapter, we'll explore advanced composition patterns including the Context API, component slots, and building reusable component systems that scale across large applications.</p>

  <hr />

  <p><em>Ready to practice? Try refactoring a component in your application to use these state management patterns.</em></p>
</BookLayout>