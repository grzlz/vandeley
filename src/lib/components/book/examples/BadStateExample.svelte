<script>
  // This demonstrates poor state management patterns

  let { items: initialItems } = $props();

  // State scattered across multiple variables
  let cartItems = $state([...initialItems]);
  let cartTotal = $state(0);
  let cartCount = $state(0);
  let discount = $state(10);
  let tax = $state(0);
  let finalTotal = $state(0);

  // Manual synchronization function that's easy to forget
  function updateCartStats() {
    cartCount = cartItems.length;
    cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    tax = cartTotal * 0.08;
    finalTotal = cartTotal + tax - discount;
  }

  // Initialize with manual sync
  updateCartStats();

  // Inconsistent state updates
  function addItem(item) {
    cartItems.push({ ...item, quantity: 1 });
    updateCartStats(); // Remember to call this!
  }

  function removeItem(id) {
    cartItems = cartItems.filter(item => item.id !== id);
    // Oops! Forgot to call updateCartStats() here
    // This will cause inconsistent state
  }

  function updateQuantity(id, quantity) {
    const item = cartItems.find(item => item.id === id);
    if (item) {
      item.quantity = quantity;
      updateCartStats(); // Another place to remember this
    }
  }

  // Simulated bug: remove item without updating stats
  function buggyRemoveItem(id) {
    cartItems = cartItems.filter(item => item.id !== id);
    // Missing updateCartStats() - totals will be wrong!
  }
</script>

<div class="space-y-4">
  <div class="rounded-lg border border-gray-200 bg-white p-4">
    <h4 class="font-medium text-gray-900 mb-2">Shopping Cart (Poor State Management)</h4>

    <!-- Cart header with scattered state values -->
    <div class="flex justify-between items-center mb-4 p-3 bg-gray-50 rounded">
      <span class="font-medium">Items: {cartCount}</span>
      <span class="font-medium">Total: ${finalTotal.toFixed(2)}</span>
    </div>

    <!-- Cart items -->
    <div class="space-y-2">
      {#each cartItems as item (item.id)}
        <div class="flex items-center justify-between p-3 border border-gray-200 rounded">
          <div class="flex-1">
            <div class="font-medium">{item.name}</div>
            <div class="text-sm text-gray-600">${item.price} × {item.quantity}</div>
          </div>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100"
              onclick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
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
              onclick={() => buggyRemoveItem(item.id)}
            >
              Remove
            </button>
          </div>
        </div>
      {/each}
    </div>

    <!-- Cart summary with many separate values -->
    <div class="mt-4 p-4 bg-gray-50 rounded space-y-2">
      <div class="flex justify-between text-sm">
        <span>Subtotal:</span>
        <span>${cartTotal.toFixed(2)}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span>Discount:</span>
        <span>-${discount.toFixed(2)}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span>Tax (8%):</span>
        <span>${tax.toFixed(2)}</span>
      </div>
      <div class="flex justify-between font-medium border-t border-gray-300 pt-2">
        <span>Total:</span>
        <span>${finalTotal.toFixed(2)}</span>
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
        class="px-3 py-2 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
        onclick={() => {
          // This will cause state inconsistency
          discount = discount === 10 ? 20 : 10;
          // Forgot to call updateCartStats()!
        }}
      >
        Toggle Discount (Buggy)
      </button>
    </div>

    <!-- Warning about state issues -->
    <div class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
      <div class="text-xs font-medium text-yellow-800 mb-1">State Management Issues:</div>
      <ul class="text-xs text-yellow-700 space-y-1">
        <li>• Remove button doesn't update totals (try it!)</li>
        <li>• Toggle discount doesn't recalculate (try it!)</li>
        <li>• {cartItems.length} separate state variables to keep in sync</li>
        <li>• Manual updateCartStats() calls everywhere</li>
      </ul>
    </div>
  </div>
</div>