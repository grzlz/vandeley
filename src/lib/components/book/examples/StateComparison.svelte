<script>
  import BadStateExample from './BadStateExample.svelte';
  import GoodStateExample from './GoodStateExample.svelte';

  const badStateCode =
`// BadStateExample.svelte - Poor State Management

// State scattered across multiple components
let cartItems = $state([]);
let cartTotal = $state(0);
let cartCount = $state(0);
let isLoading = $state(false);
let discount = $state(0);
let tax = $state(0);
let finalTotal = $state(0);

// Manual synchronization everywhere
function addToCart(item) {
  cartItems.push(item);
  updateCartStats(); // Easy to forget!
}

function updateCartStats() {
  cartCount = cartItems.length;
  cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  tax = cartTotal * 0.08;
  finalTotal = cartTotal + tax - discount;
}

// Inconsistent updates
function removeItem(id) {
  cartItems = cartItems.filter(item => item.id !== id);
  // Oops! Forgot to call updateCartStats()
  // Now our totals are wrong
}

// Prop drilling nightmare
<CartHeader {cartCount} {finalTotal} />
<CartItems {cartItems} {removeItem} {addToCart} />
<CartSummary {cartTotal} {tax} {discount} {finalTotal} />`;

  const goodStateCode =
`// GoodStateExample.svelte - Clean State Management

// cartStore.svelte.js - Single source of truth
export const cartState = $state({
  items: [],
  discount: 0
});

// Derived values automatically stay in sync
export const cartStats = $derived.by(() => ({
  count: cartState.items.length,
  subtotal: cartState.items.reduce((sum, item) => sum + item.price, 0),
  tax: cartStats.subtotal * 0.08,
  total: cartStats.subtotal + cartStats.tax - cartState.discount
}));

// Pure functions for state updates
export function addToCart(item) {
  cartState.items.push(item);
  // No manual sync needed - derived values update automatically
}

export function removeFromCart(id) {
  const index = cartState.items.findIndex(item => item.id === id);
  if (index > -1) {
    cartState.items.splice(index, 1);
  }
  // All totals automatically recalculate
}

// Component receives clean interface
import { cartState, cartStats, addToCart, removeFromCart } from './cartStore.js';

<CartHeader count={cartStats.count} total={cartStats.total} />
<CartItems items={cartState.items} {removeFromCart} {addToCart} />
<CartSummary stats={cartStats} discount={cartState.discount} />`;

  const sampleItems = [
    { id: 1, name: 'Wireless Headphones', price: 99.99, quantity: 1 },
    { id: 2, name: 'Bluetooth Speaker', price: 49.99, quantity: 2 },
    { id: 3, name: 'Phone Case', price: 19.99, quantity: 1 }
  ];

  const demos = {
    bad: {
      id: 'bad',
      label: 'Poor State Management',
      emoji: '❌',
      summary:
        'State is scattered across components with manual synchronization. This leads to bugs, inconsistencies, and maintenance nightmares.',
      points: [
        'Multiple pieces of state that should be derived (cartTotal, cartCount, finalTotal)',
        'Manual synchronization that is easy to forget and causes bugs',
        'Prop drilling passes too many individual values instead of organized data',
        'State updates are scattered and inconsistent across the component'
      ],
      code: badStateCode,
      metrics: [
        {
          label: 'State pieces',
          value: '7 separate values',
          helper: 'cartItems, cartTotal, cartCount, isLoading, discount, tax, finalTotal'
        },
        {
          label: 'Synchronization',
          value: 'Manual',
          helper: 'updateCartStats() must be called after every change'
        },
        {
          label: 'Bug potential',
          value: 'High',
          helper: 'Easy to forget synchronization, state can become inconsistent'
        }
      ]
    },
    good: {
      id: 'good',
      label: 'Good State Management',
      emoji: '✅',
      summary:
        'State is organized with clear ownership and automatic derivation. Changes are predictable and the system stays consistent.',
      points: [
        'Single source of truth with cartState object containing minimal state',
        'Derived values automatically calculated and stay in sync',
        'Pure functions for state updates make testing and debugging easy',
        'Clean component interface with organized data structures'
      ],
      code: goodStateCode,
      metrics: [
        {
          label: 'State pieces',
          value: '2 core values',
          helper: 'items array and discount - everything else is derived'
        },
        {
          label: 'Synchronization',
          value: 'Automatic',
          helper: 'Derived values update automatically when items change'
        },
        {
          label: 'Bug potential',
          value: 'Low',
          helper: 'Impossible to have inconsistent state - derives from single source'
        }
      ]
    }
  };

  const demoList = Object.values(demos);
  let selectedDemo = $state('bad');
  let showCode = $state(false);
  const activeDemo = $derived(demos[selectedDemo] || demos.bad);

  function selectDemo(id) {
    selectedDemo = id;
  }

  function toggleCode() {
    showCode = !showCode;
  }
</script>

<div class="component-comparison space-y-8">
  <div class="space-y-6">
    <div class="space-y-3">
      <span class="text-xs font-semibold uppercase tracking-[0.35em] text-blue-600">State management patterns</span>
      <h3 class="text-2xl font-semibold text-gray-900">Good state management feels effortless</h3>
      <p class="max-w-3xl text-sm text-gray-600 md:text-base">
        Compare two approaches to managing shopping cart state. The difference in complexity and maintainability is dramatic.
      </p>
    </div>

    <div class="flex items-center gap-4">
      <div class="inline-flex w-fit items-center gap-2 rounded-full bg-gray-100 p-1 shadow-inner">
        {#each demoList as demo}
          <button
            type="button"
            class={
              selectedDemo === demo.id
                ? 'inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow apple-transition'
                : 'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900 apple-transition'
            }
            aria-pressed={selectedDemo === demo.id}
            onclick={() => selectDemo(demo.id)}
          >
            <span class="text-base">{demo.emoji}</span>
            <span>{demo.label}</span>
          </button>
        {/each}
      </div>

      <button
        type="button"
        class={
          showCode
            ? 'inline-flex items-center gap-2 rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-200'
            : 'inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-200'
        }
        onclick={toggleCode}
        aria-pressed={showCode}
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
        </svg>
        <span>{showCode ? 'Hide' : 'Show'} Code</span>
      </button>
    </div>
  </div>

  <div
    class={
      selectedDemo === 'bad'
        ? 'rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm'
        : 'rounded-2xl border border-green-200 bg-green-50 p-6 shadow-sm'
    }
  >
    <h4 class={selectedDemo === 'bad' ? 'text-red-800 font-semibold mb-3' : 'text-green-800 font-semibold mb-3'}>
      {activeDemo.label} patterns
    </h4>
    <p class="mb-4 max-w-3xl text-sm text-gray-700 md:text-base">{activeDemo.summary}</p>
    <ul class={selectedDemo === 'bad' ? 'space-y-2 text-sm text-red-700 md:text-base' : 'space-y-2 text-sm text-green-700 md:text-base'}>
      {#each activeDemo.points as point}
        <li class="flex gap-2">
          <span>{selectedDemo === 'bad' ? '⚠️' : '✨'}</span>
          <span class="flex-1 leading-relaxed">{point}</span>
        </li>
      {/each}
    </ul>
  </div>

  {#if showCode}
    <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div class="mb-4 flex items-center justify-between">
        <h5 class="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">Source code</h5>
        <span
          class={
            selectedDemo === 'bad'
              ? 'rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700'
              : 'rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700'
          }
        >
          {activeDemo.label}
        </span>
      </div>
      <div class="overflow-x-auto">
        <pre class="rounded-xl bg-gray-900 p-4 text-sm text-gray-100 overflow-x-auto"><code>{activeDemo.code}</code></pre>
      </div>
    </div>
  {/if}

  <div class="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
    <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div class="mb-4 flex items-center justify-between">
        <h5 class="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">Interactive example</h5>
        <span
          class={
            selectedDemo === 'bad'
              ? 'rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700'
              : 'rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700'
          }
        >
          {activeDemo.label}
        </span>
      </div>
      <div class="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6">
        {#if selectedDemo === 'bad'}
          <BadStateExample items={sampleItems} />
        {:else}
          <GoodStateExample items={sampleItems} />
        {/if}
      </div>
    </div>
    <div class="space-y-4">
      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h5 class="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">State management metrics</h5>
        <p class="mt-2 text-sm text-gray-600">
          Notice how the architecture affects maintainability, debugging, and the likelihood of bugs over time.
        </p>
        <div class="mt-5 grid gap-4">
          {#each activeDemo.metrics as metric}
            <div
              class={
                selectedDemo === 'bad'
                  ? 'rounded-xl border border-red-100 bg-red-50 p-4'
                  : 'rounded-xl border border-green-100 bg-green-50 p-4'
              }
            >
              <div class="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">{metric.label}</div>
              <div
                class={
                  selectedDemo === 'bad'
                    ? 'mt-1 text-base font-semibold text-red-700'
                    : 'mt-1 text-base font-semibold text-green-700'
                }
              >
                {metric.value}
              </div>
              <p class="mt-1 text-sm text-gray-600">{metric.helper}</p>
            </div>
          {/each}
        </div>
      </div>
      <div class="rounded-2xl border border-blue-100 bg-blue-50 p-6 shadow-inner">
        <h5 class="text-xs font-semibold uppercase tracking-[0.25em] text-blue-900">What to try next</h5>
        <p class="mt-2 text-sm text-blue-900/80">
          Try adding or removing items in both examples. Notice how the good example automatically keeps all derived values in sync,
          while the bad example requires manual synchronization that is easy to forget.
        </p>
      </div>
    </div>
  </div>
</div>