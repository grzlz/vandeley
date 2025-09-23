<script>
  import BookLayout from '$lib/layouts/BookLayout.svelte';
  import StrategyEvolution from '$lib/components/book/examples/StrategyEvolution.svelte';
</script>

<svelte:head>
  <title>Chapter 4: Design Patterns — Strategy | Vandeley Analytics</title>
</svelte:head>

<BookLayout>
  <h1>Chapter 4: Design Patterns — Strategy</h1>

  <p>
    Welcome to the first design-pattern chapter in our playbook. We're going to start with the Strategy
    pattern because it forces us to separate "what" we want to achieve from "how" we actually do it.
    Along the way, we'll walk through the messy, brute-force solutions that most teams stumble into
    before snapping the behaviour into a clean strategy interface.
  </p>

  <div class="mb-10 rounded-2xl border border-blue-400/30 bg-blue-500/10 p-6 text-blue-100 backdrop-blur">
    <h2 class="text-lg font-semibold text-white">How to use this chapter</h2>
    <p class="mt-2 text-sm text-blue-200">
      Spend time with each stage of the evolution. The anti-patterns highlight the smell, the partial fixes
      show why incremental tweaks are not enough, and the Strategy implementation demonstrates the payoff
      of formalising behaviour.
    </p>
    <ul class="mt-4 grid gap-2 text-sm text-blue-200 md:grid-cols-2">
      <li class="flex items-start gap-2">
        <span aria-hidden="true">🐢</span>
        <span>Notice how each brute-force approach slows feature work with branching logic and duplication.</span>
      </li>
      <li class="flex items-start gap-2">
        <span aria-hidden="true">🔍</span>
        <span>Track where responsibilities live—data, behaviour, and rendering should not be tangled.</span>
      </li>
      <li class="flex items-start gap-2">
        <span aria-hidden="true">🧭</span>
        <span>Use the Strategy interface as your compass: input contract, interchangeable behaviours, predictable outputs.</span>
      </li>
      <li class="flex items-start gap-2">
        <span aria-hidden="true">🛠️</span>
        <span>Try swapping strategies in the playground to feel how easy experimentation becomes.</span>
      </li>
    </ul>
  </div>

  <h2>Why start with Strategy?</h2>

  <blockquote>
    <p><strong>"Program to an interface, not an implementation."</strong> — Gang of Four</p>
  </blockquote>

  <p>
    The Strategy pattern lets you encapsulate algorithms behind a consistent interface. In UI code, this
    often means choosing different presentation or transformation behaviours based on context—without
    smearing conditionals across the component tree. Svelte 5 runes give us a clean way to bind reactive
    data into strategies and swap them at runtime.
  </p>

  <h2>Running example: payment processing system</h2>

  <p>
    Imagine an e-commerce checkout that needs to handle different payment methods—credit cards, PayPal,
    cryptocurrency. Each method has different validation rules, processing fees, and redirect flows. The
    business requirement is simple, but the implementation gets ugly fast if we lean on ad-hoc conditionals.
  </p>

  <h3>Evolution walkthrough</h3>

  <p>
    Use the playground below to step through the evolution. Each tab shows the live payment processor, the driving
    idea, and the trade-offs. Pay extra attention to how payment logic and UI rendering boundaries improve
    as we move toward Strategy.
  </p>

  <StrategyEvolution />

  <h2>Breakdown: from brute force to Strategy</h2>

  <h3>1. Naïve conditionals ("just make it work")</h3>
  <p>
    The first version hardcodes every payment method with nested <code>if</code> statements inside the component.
    Processing logic, fee calculation, and rendering are fused together. This is how bugs sneak in—adding a new
    payment method requires touching every branch.
  </p>

  <h3>2. Slightly better branching ("switch on a type")</h3>
  <p>
    Extracting the conditional into a helper function and switching on payment type feels tidier, but it keeps
    the same knowledge problem: the component decides both <em>which</em> payment method to use and <em>how</em> to process it.
    The branching helper grows every time the business wants a new payment option.
  </p>

  <h3>3. Configuration objects ("data-driven" but leaky)</h3>
  <p>
    Moving payment details into a lookup table is a big step. However, the component still reaches into
    each config to orchestrate processing. We reduced repetition, but there is no guarantee that each config
    implements the same contract.
  </p>

  <h3>4. Strategy pattern ("swap behaviour, keep the contract")</h3>
  <p>
    By defining a Strategy interface—<code>process(payment) ⇒ result</code>—we isolate payment logic from rendering.
    Each strategy owns its processing rules and side effects like redirects. The component simply selects an active strategy
    and renders whatever it returns. Adding a new payment method now means shipping a new strategy object that
    honours the same contract.
  </p>

  <h3>5. Strategy with explicit interfaces ("production-ready contracts")</h3>
  <p>
    The duck-typed approach works but is fragile. By adding JSDoc interface definitions and runtime validation,
    we get TypeScript-like safety in plain JavaScript. Strategies must implement the <code>PaymentStrategy</code>
    interface with proper <code>id</code>, <code>label</code>, and <code>process</code> methods. Validation catches
    malformed strategies at creation time, and JSDoc provides IntelliSense for better developer experience.
  </p>

  <h3>6. TypeScript interfaces ("concise and compile-time safe")</h3>
  <p>
    JSDoc works but gets verbose quickly. TypeScript gives us clean, concise interface definitions with compile-time
    type checking. No runtime validation needed—the compiler prevents malformed strategies before they reach production.
    The <code>PaymentStrategy</code> interface is just 4 lines instead of 20+ lines of JSDoc comments, and we get
    superior developer experience with auto-completion and refactoring support.
  </p>

  <h2>How Svelte 5 runes support the Strategy pattern</h2>

  <ul>
    <li><strong><code>$state()</code></strong> stores the current strategy selection and reactive payment inputs.</li>
    <li><strong><code>$derived()</code></strong> computes the payment result from the combination of payment data + strategy.</li>
    <li><strong><code>$effect()</code></strong> lets us plug in optional side effects per strategy (redirects, logging) without polluting the component.</li>
  </ul>

  <h2>Checklist: spotting the need for Strategy</h2>

  <div class="my-8 grid gap-6 md:grid-cols-2">
    <div class="rounded-xl border border-red-400/40 bg-red-500/10 p-6 text-red-100">
      <h3 class="mb-2 text-white">Red flags</h3>
      <ul class="space-y-2 text-sm">
        <li>Growing chains of <code>if</code>/<code>else</code> that gate payment processing</li>
        <li>New payment methods require changes across multiple files</li>
        <li>Duplicated validation or fee calculation with minor tweaks per method</li>
        <li>"Temporary" payment flags that never get removed</li>
      </ul>
    </div>
    <div class="rounded-xl border border-emerald-400/40 bg-emerald-500/10 p-6 text-emerald-100">
      <h3 class="mb-2 text-white">Signals to refactor</h3>
      <ul class="space-y-2 text-sm">
        <li>You can describe payment processing in terms of interchangeable strategies</li>
        <li>Inputs (payment data) and outputs (results) stay consistent across methods</li>
        <li>Payment experiments should be swappable at runtime</li>
        <li>Side effects like redirects or logging differ per payment method</li>
      </ul>
    </div>
  </div>

  <h2>Key takeaways</h2>

  <ol>
    <li><strong>Separate the decision from the implementation.</strong> Strategy gives you a clean seam for extension.</li>
    <li><strong>Treat strategies as first-class modules.</strong> They deserve proper naming, testing, and review.</li>
    <li><strong>Lean on Svelte runes for clarity.</strong> Keep reactive data flow outside of strategy logic.</li>
    <li><strong>Optimise for experimentation.</strong> Swappable behaviours unlock A/B tests, pilots, and gradual rollouts.</li>
  </ol>

  <h2>Next steps</h2>

  <p>
    Implement a Strategy pattern in your own codebase. Pick a messy payment flow or similar branching logic, define the contract, and
    extract concrete strategies. Observe how much smaller your components feel when processing logic becomes
    interchangeable.
  </p>
</BookLayout>
