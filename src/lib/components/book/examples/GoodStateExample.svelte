<script>
  // This demonstrates good state management patterns

  let { items: initialItems } = $props();

  // Single source of truth for cart state
  let cartState = $state({
    items: [...initialItems],
    discount: 10
  });

  // All derived values computed automatically
  let cartStats = $derived.by(() => {
    const subtotal = cartState.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax - cartState.discount;

    return {
      count: cartState.items.length,
      subtotal,
      tax,
      total
    };
  });

  // Pure functions for state updates
  function addItem(item) {
    cartState.items.push({ ...item, quantity: 1 });
    // No manual sync needed - derived values update automatically
  }

  function removeItem(id) {
    const index = cartState.items.findIndex(item => item.id === id);
    if (index > -1) {
      cartState.items.splice(index, 1);
    }
    // All totals automatically recalculate
  }

  function updateQuantity(id, quantity) {
    const item = cartState.items.find(item => item.id === id);
    if (item && quantity > 0) {
      item.quantity = quantity;
    }
    // Derived values automatically update
  }

  function toggleDiscount() {
    cartState.discount = cartState.discount === 10 ? 20 : 10;
    // Total automatically recalculates
  }
</script>

<div class="space-y-4">
  <div class="rounded-lg border border-gray-200 bg-white p-4">
    <h4 class="font-medium text-gray-900 mb-2">Shopping Cart (Good State Management)</h4>

    <!-- Cart header with derived values -->
    <div class="flex justify-between items-center mb-4 p-3 bg-gray-50 rounded">
      <span class="font-medium">Items: {cartStats.count}</span>
      <span class="font-medium">Total: ${cartStats.total.toFixed(2)}</span>
    </div>

    <!-- Cart items -->
    <div class="space-y-2">
      {#each cartState.items as item (item.id)}
        <div class="flex items-center justify-between p-3 border border-gray-200 rounded">
          <div class="flex-1">
            <div class="font-medium">{item.name}</div>
            <div class="text-sm text-gray-600">${item.price} × {item.quantity}</div>
          </div>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100"
              onclick={() => updateQuantity(item.id, item.quantity - 1)}
            >
              -
            </button>
            <span class="w-8 text-center text-sm">{item.quantity}</span>
            <button
              type="button"
              class="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100"
              onclick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              +
            </button>
            <button
              type="button"
              class="ml-2 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
              onclick={() => removeItem(item.id)}
            >
              Remove
            </button>
          </div>
        </div>
      {/each}
    </div>

    <!-- Cart summary with automatically computed values -->
    <div class="mt-4 p-4 bg-gray-50 rounded space-y-2">
      <div class="flex justify-between text-sm">
        <span>Subtotal:</span>
        <span>${cartStats.subtotal.toFixed(2)}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span>Discount:</span>
        <span>-${cartState.discount.toFixed(2)}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span>Tax (8%):</span>
        <span>${cartStats.tax.toFixed(2)}</span>
      </div>
      <div class="flex justify-between font-medium border-t border-gray-300 pt-2">
        <span>Total:</span>
        <span>${cartStats.total.toFixed(2)}</span>
      </div>
    </div>

    <!-- Actions -->
    <div class="mt-4 flex gap-2">
      <button
        type="button"
        class="px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        onclick={() => addItem({ id: Date.now(), name: 'New Item', price: 29.99 })}
      >
        Add Random Item
      </button>
      <button
        type="button"
        class="px-3 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600"
        onclick={toggleDiscount}
      >
        Toggle Discount
      </button>
    </div>

    <!-- Benefits of good state management -->
    <div class="mt-4 p-3 bg-green-50 border border-green-200 rounded">
      <div class="text-xs font-medium text-green-800 mb-1">State Management Benefits:</div>
      <ul class="text-xs text-green-700 space-y-1">
        <li>• All derived values automatically stay in sync</li>
        <li>• Only 2 core state values: items array and discount</li>
        <li>• Pure functions make updates predictable</li>
        <li>• Impossible to have inconsistent state</li>
        <li>• Easy to test and debug</li>
      </ul>
    </div>
  </div>
</div>