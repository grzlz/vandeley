<script>
  import BookLayout from '$lib/layouts/BookLayout.svelte';
  import ComponentComparison from '$lib/components/book/examples/ComponentComparison.svelte';
</script>

<BookLayout>
  <h1>Chapter 1: Component Architecture Fundamentals</h1>

  <p>Welcome to the foundation of building well-architected Svelte applications. In this chapter, we'll explore the core principles that separate good components from great ones, and learn how to think architecturally about your Svelte codebase.</p>

  <div class="mb-10 rounded-2xl border border-blue-400/30 bg-blue-500/10 p-6 text-blue-100 backdrop-blur">
    <h2 class="text-lg font-semibold text-white">How to use this chapter</h2>
    <p class="mt-2 text-sm text-blue-200">
      Spend a few focused minutes comparing the anti-pattern and the well-architected solution. Take notes on the prop surfaces,
      where responsibilities live, and how each example could evolve as requirements change.
    </p>
    <ul class="mt-4 grid gap-2 text-sm text-blue-200 md:grid-cols-2">
      <li class="flex items-start gap-2">
        <span aria-hidden="true">🧠</span>
        <span>Start by reading the philosophy—look for vocabulary you can use during design reviews.</span>
      </li>
      <li class="flex items-start gap-2">
        <span aria-hidden="true">🧩</span>
        <span>Toggle the live example to feel the difference between accidental complexity and intentional composition.</span>
      </li>
      <li class="flex items-start gap-2">
        <span aria-hidden="true">🧪</span>
        <span>Note the testing implications of each approach. How easy would it be to isolate logic or mock dependencies?</span>
      </li>
      <li class="flex items-start gap-2">
        <span aria-hidden="true">🚀</span>
        <span>Apply the takeaways to a component in your own codebase before moving to the next chapter.</span>
      </li>
    </ul>
  </div>

  <h2>The Philosophy of Component Architecture</h2>

  <blockquote>
    <p><strong>"Architecture is about the important stuff. Whatever that is."</strong> - Martin Fowler</p>
  </blockquote>

  <p>In Svelte applications, components are not just reusable pieces of UI—they're the architectural building blocks of your entire system. Every component you create is a decision about how your application will scale, how your team will collaborate, and how maintainable your codebase will be.</p>

  <h3>Why Component Architecture Matters</h3>

  <p>Think of components like LEGO blocks. You could randomly stick pieces together and build something that works, but without architectural thinking, you'll end up with:</p>

  <ul>
    <li><strong>Brittle connections</strong> - Components tightly coupled to specific use cases</li>
    <li><strong>Inconsistent interfaces</strong> - Props and events that vary wildly between similar components</li>
    <li><strong>Duplication everywhere</strong> - The same logic repeated across multiple components</li>
    <li><strong>Testing nightmares</strong> - Components that are impossible to test in isolation</li>
  </ul>

  <p>Instead, we want to build components that are:</p>

  <ol>
    <li><strong>Composable</strong> - Can be combined in unexpected ways</li>
    <li><strong>Predictable</strong> - Have clear contracts and behaviors</li>
    <li><strong>Reusable</strong> - Work across different contexts without modification</li>
    <li><strong>Testable</strong> - Can be tested in isolation with clear inputs and outputs</li>
  </ol>

  <h2>The Svelte 5 Revolution: Runes as Architectural Tools</h2>

  <p>Svelte 5 introduced runes that fundamentally change how we think about component architecture. Let's explore how each rune contributes to better architectural decisions:</p>

  <h3>$props() - The Component Contract</h3>

  <p>Props define your component's public API. In Svelte 5, <code>$props()</code> makes this contract explicit and powerful. Your props should tell a story about what your component does and how it should be used.</p>

  <h3>$state() - Internal Component State</h3>

  <p>Use <code>$state()</code> for data that belongs exclusively to the component. <strong>Architectural Principle:</strong> State should have a clear owner. If multiple components need the same data, it shouldn't be component state.</p>

  <h3>$derived() - Computed Architecture</h3>

  <p><code>$derived()</code> creates computed values that automatically update when their dependencies change. <strong>Architectural Principle:</strong> Derived values eliminate duplication and ensure consistency.</p>

  <h2>Component Patterns That Scale</h2>

  <h3>1. The Compound Component Pattern</h3>
  <p>Instead of creating monolithic components with dozens of props, break them into smaller, composable pieces using Svelte 5 snippets.</p>

  <h3>2. The Render Props Pattern (Svelte Snippets)</h3>
  <p>Use snippets to make components flexible and reusable by allowing the parent to control how data is rendered.</p>

  <h3>3. The Provider Pattern</h3>
  <p>For sharing state across multiple components without prop drilling, use Svelte's context API.</p>

  <h2>Component Communication Patterns</h2>

  <h3>Props Down, Events Up (Callbacks)</h3>
  <p>The fundamental pattern for component communication in Svelte 5 uses callback props instead of traditional events.</p>

  <h3>Lifting State Up</h3>
  <p>When multiple components need to share state, lift it to their common ancestor.</p>

  <h2>The Single Responsibility Principle for Components</h2>

  <p>Each component should have one reason to change. Ask yourself:</p>

  <ul>
    <li><strong>What is this component's primary responsibility?</strong></li>
    <li><strong>If I need to modify this component, what would trigger that change?</strong></li>
    <li><strong>Can I describe what this component does in one sentence?</strong></li>
  </ul>

  <h2>Testing-Driven Component Design</h2>

  <p>Design your components with testing in mind. Components with clear inputs and outputs are easier to test and usually well-architected.</p>

  <h2>Practical Example: Component Architecture in Action</h2>

  <p>Let's see these principles in practice. Compare a poorly architected component with a well-designed one:</p>

  <ComponentComparison />

  <p>Notice how the well-architected version:</p>
  <ul>
    <li>Has fewer, clearer props</li>
    <li>Separates concerns into focused components</li>
    <li>Uses composition for flexibility</li>
    <li>Maintains consistent styling</li>
    <li>Is easier to test and extend</li>
  </ul>

  <h2>Key Takeaways</h2>

  <ol>
    <li><strong>Think in Systems</strong> - Every component is part of a larger architectural system</li>
    <li><strong>Embrace Composition</strong> - Small, focused components that work together</li>
    <li><strong>Make Contracts Clear</strong> - Props should be self-documenting</li>
    <li><strong>State Has Owners</strong> - Be explicit about who owns what data</li>
    <li><strong>Design for Change</strong> - Components should be easy to modify and extend</li>
  </ol>

  <h2>What's Next?</h2>

  <p>In the next chapter, we'll dive deep into state management patterns and learn how to architect data flow in complex Svelte applications.</p>

  <hr />

  <p><em>Ready to apply these concepts? Try refactoring one of your existing components using these architectural principles.</em></p>
</BookLayout>