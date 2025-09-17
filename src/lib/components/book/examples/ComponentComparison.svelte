<script>
  import BadComponent from './BadComponent.svelte';
  import GoodUserCard from './GoodUserCard.svelte';

  const badComponentCode =
`// BadComponent.svelte - Poor Architecture Example

// 16+ props make this component impossible to memorize
let {
  userType, userData, showAvatar, avatarSize, showEmail, showPhone,
  showActions, actionType, onEdit, onDelete, onView, backgroundColor,
  textColor, borderStyle, padding
} = $props();

let isLoading = $state(false);
let hasError = $state(false);
let errorMessage = $state('');

// Too much logic in one component
function handleAction(type) {
  isLoading = true;
  setTimeout(() => {
    if (type === 'edit' && onEdit) {
      onEdit(userData);
    } else if (type === 'delete' && onDelete) {
      onDelete(userData);
    } else if (type === 'view' && onView) {
      onView(userData);
    }
    isLoading = false;
  }, 1000);
}

// Inline styles make this unmaintainable
const cardStyle = \`
  background-color: \${backgroundColor || '#ffffff'};
  color: \${textColor || '#000000'};
  border: \${borderStyle || '1px solid #e5e7eb'};
  padding: \${padding || '1rem'};
\`;

// Template with too many conditional renders
<div class="user-card" style={cardStyle}>
  {#if showAvatar}
    <img src={userData?.avatar || '/default-avatar.png'}
         alt={userData?.name}
         style={\`width: \${avatarSize || 48}px;\`} />
  {/if}

  <div class="user-info">
    <h3>{userData?.name || 'Unknown User'}</h3>
    {#if showEmail && userData?.email}
      <p>Email: {userData.email}</p>
    {/if}
    {#if showPhone && userData?.phone}
      <p>Phone: {userData.phone}</p>
    {/if}

    {#if userType === 'admin'}
      <span class="badge admin">Admin</span>
    {:else if userType === 'moderator'}
      <span class="badge moderator">Moderator</span>
    {:else}
      <span class="badge user">User</span>
    {/if}
  </div>

  {#if showActions}
    <div class="actions">
      {#if actionType === 'full'}
        <button onclick={() => handleAction('edit')} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Edit'}
        </button>
        <button onclick={() => handleAction('delete')} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Delete'}
        </button>
        <button onclick={() => handleAction('view')} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'View'}
        </button>
      {/if}
    </div>
  {/if}
</div>`;

  const goodComponentCode =
`// GoodUserCard.svelte - Well-Architected Example

import Avatar from './Avatar.svelte';
import UserBadge from './UserBadge.svelte';
import ActionButtons from './ActionButtons.svelte';

// Clean, intentional prop interface
let {
  user,
  variant = 'default',
  size = 'md',
  children,          // Snippet for extension
  actions,           // Action configuration
  onclick = undefined,
  ...restProps
} = $props();

// Computed styling with clear variants
const cardClasses = $derived.by(() => {
  const base = 'user-card rounded-lg border transition-all duration-200';
  const variants = {
    default: 'border-gray-200 bg-white hover:shadow-md',
    compact: 'border-gray-200 bg-white p-4',
    highlighted: 'border-blue-200 bg-blue-50 hover:bg-blue-100'
  };
  const sizes = { sm: 'p-4', md: 'p-6', lg: 'p-8' };

  return \`\${base} \${variants[variant]} \${sizes[size]}\`;
});

function handleClick() {
  if (onclick) onclick(user);
}

// Composable content using snippet
{#snippet cardContent()}
  <div class="flex items-center gap-4">
    <Avatar {user} {size} />

    <div class="min-w-0 flex-1">
      <div class="mb-1 flex items-center gap-2">
        <h3 class="truncate font-semibold">{user.name}</h3>
        <UserBadge role={user.role} />
      </div>

      {#if user.email}
        <p class="truncate text-sm text-gray-600">{user.email}</p>
      {/if}

      {#if children}
        <div class="mt-2">
          {@render children({ user })}
        </div>
      {/if}
    </div>

    {#if actions}
      <ActionButtons {user} {actions} />
    {/if}
  </div>
{/snippet}

<!-- Conditional wrapper based on interactivity -->
{#if onclick}
  <button type="button" class={cardClasses} onclick={handleClick} {...restProps}>
    {@render cardContent()}
  </button>
{:else}
  <div class={cardClasses} {...restProps}>
    {@render cardContent()}
  </div>
{/if}`;

  const sampleUser = {
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1 (555) 123-4567',
    role: 'admin',
    avatar: 'https://upload.wikimedia.org/wikipedia/en/d/d1/Melora_Hardin_as_Jan_Levinson.png'
  };

  const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const userActions = [
    {
      label: 'Edit',
      icon: '✏️',
      handler: async (user) => {
        await pause(450);
        alert(`Editing ${user.name}`);
      }
    },
    {
      label: 'Delete',
      icon: '🗑️',
      handler: async (user) => {
        await pause(450);
        alert(`Deleting ${user.name}`);
      }
    }
  ];

  const demos = {
    bad: {
      id: 'bad',
      label: 'Poor Architecture',
      emoji: '❌',
      summary:
        'An overloaded component that tries to do everything at once. Notice how the public API becomes unpredictable and the UI logic leaks everywhere.',
      points: [
        'Too many props (16+ props make the component impossible to memorise)',
        'Inline styling and conditional logic tightly coupled to the view',
        'Business logic, UI state, and actions all live in the same component'
      ],
      code: badComponentCode,
      metrics: [
        {
          label: 'Props surface',
          value: '16 props',
          helper: 'Every scenario is toggled with a new prop'
        },
        {
          label: 'Responsibilities',
          value: 'UI + state + actions',
          helper: 'Difficult to isolate behaviour for testing'
        },
        {
          label: 'Reusability',
          value: 'Low',
          helper: 'Component knows about specific layouts and actions'
        }
      ]
    },
    good: {
      id: 'good',
      label: 'Good Architecture',
      emoji: '✅',
      summary:
        'A focused user card that composes smaller building blocks. The public API stays small while offering powerful extension points.',
      points: [
        'Intentional props (user, variant, size, actions) communicate the contract clearly',
        'Dedicated components for avatar, badge, and actions keep concerns separate',
        'Snippets and action handlers allow extension without modifying the card'
      ],
      code: goodComponentCode,
      metrics: [
        {
          label: 'Props surface',
          value: '4 core props',
          helper: 'Clear contract: user, variant, size, actions'
        },
        {
          label: 'Responsibilities',
          value: 'Composition only',
          helper: 'State and data stay with their owners'
        },
        {
          label: 'Extensibility',
          value: 'High',
          helper: 'Snippets expose custom content while actions encapsulate behaviour'
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
      <span class="text-xs font-semibold uppercase tracking-[0.35em] text-blue-400">Live comparison</span>
      <h3 class="text-2xl font-semibold text-slate-100">Good architecture feels different in use</h3>
      <p class="max-w-3xl text-sm text-slate-300 md:text-base">
        The same requirement implemented two ways. Switch between them to feel how API design, composition, and extensibility
        change the developer experience.
      </p>
    </div>

    <div class="flex items-center gap-4">
      <div class="inline-flex w-fit items-center gap-2 rounded-full bg-slate-800 p-1 shadow-inner">
        {#each demoList as demo}
          <button
            type="button"
            class={
              selectedDemo === demo.id
                ? 'inline-flex items-center gap-2 rounded-full bg-slate-700 px-4 py-2 text-sm font-medium text-white shadow apple-transition'
                : 'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-slate-400 hover:text-slate-200 apple-transition'
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
            ? 'inline-flex items-center gap-2 rounded-lg bg-blue-500/20 px-3 py-2 text-sm font-medium text-blue-300 transition-colors hover:bg-blue-500/30'
            : 'inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-700'
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
        ? 'rounded-2xl border border-red-400/30 bg-red-500/10 p-6 backdrop-blur'
        : 'rounded-2xl border border-green-400/30 bg-green-500/10 p-6 backdrop-blur'
    }
  >
    <h4 class={selectedDemo === 'bad' ? 'text-red-300 font-semibold mb-3' : 'text-green-300 font-semibold mb-3'}>
      {activeDemo.label} patterns
    </h4>
    <p class="mb-4 max-w-3xl text-sm text-slate-300 md:text-base">{activeDemo.summary}</p>
    <ul class={selectedDemo === 'bad' ? 'space-y-2 text-sm text-red-200 md:text-base' : 'space-y-2 text-sm text-green-200 md:text-base'}>
      {#each activeDemo.points as point}
        <li class="flex gap-2">
          <span>{selectedDemo === 'bad' ? '⚠️' : '✨'}</span>
          <span class="flex-1 leading-relaxed">{point}</span>
        </li>
      {/each}
    </ul>
  </div>

  {#if showCode}
    <div class="rounded-2xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur">
      <div class="mb-4 flex items-center justify-between">
        <h5 class="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Source code</h5>
        <span
          class={
            selectedDemo === 'bad'
              ? 'rounded-full bg-red-500/20 px-3 py-1 text-xs font-medium text-red-300'
              : 'rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-300'
          }
        >
          {activeDemo.label}
        </span>
      </div>
      <div class="overflow-x-auto">
        <pre class="rounded-xl bg-slate-800 p-4 text-sm text-slate-200 overflow-x-auto"><code>{activeDemo.code}</code></pre>
      </div>
    </div>
  {/if}

  <div class="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
    <div class="rounded-2xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur">
      <div class="mb-4 flex items-center justify-between">
        <h5 class="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Example component</h5>
        <span
          class={
            selectedDemo === 'bad'
              ? 'rounded-full bg-red-500/20 px-3 py-1 text-xs font-medium text-red-300'
              : 'rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-300'
          }
        >
          {activeDemo.label}
        </span>
      </div>
      <div class="rounded-xl border border-dashed border-white/20 bg-slate-800/50 p-6">
        {#if selectedDemo === 'bad'}
          <BadComponent
            userType="admin"
            userData={sampleUser}
            showAvatar={true}
            avatarSize={48}
            showEmail={true}
            showPhone={false}
            showActions={true}
            actionType="full"
            onEdit={(user) => alert(`Editing ${user.name}`)}
            onDelete={(user) => alert(`Deleting ${user.name}`)}
            onView={(user) => alert(`Viewing ${user.name}`)}
            backgroundColor="#ffffff"
            textColor="#000000"
            borderStyle="1px solid #e5e7eb"
            padding="1.5rem"
          />
        {:else}
          <GoodUserCard
            user={sampleUser}
            variant="default"
            size="md"
            actions={userActions}
            onclick={(user) => alert(`Clicked ${user.name}`)}
          >
            {#snippet children({ user })}
              <p class="text-xs text-gray-500">Last seen: 2 hours ago</p>
            {/snippet}
          </GoodUserCard>
        {/if}
      </div>
    </div>
    <div class="space-y-4">
      <div class="rounded-2xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur">
        <h5 class="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Architecture metrics</h5>
        <p class="mt-2 text-sm text-slate-300">
          Compare how each version feels when you integrate it into a real screen and maintain it over time.
        </p>
        <div class="mt-5 grid gap-4">
          {#each activeDemo.metrics as metric}
            <div
              class={
                selectedDemo === 'bad'
                  ? 'rounded-xl border border-red-400/30 bg-red-500/10 p-4'
                  : 'rounded-xl border border-green-400/30 bg-green-500/10 p-4'
              }
            >
              <div class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{metric.label}</div>
              <div
                class={
                  selectedDemo === 'bad'
                    ? 'mt-1 text-base font-semibold text-red-300'
                    : 'mt-1 text-base font-semibold text-green-300'
                }
              >
                {metric.value}
              </div>
              <p class="mt-1 text-sm text-slate-300">{metric.helper}</p>
            </div>
          {/each}
        </div>
      </div>
      <div class="rounded-2xl border border-blue-400/30 bg-blue-500/10 p-6 backdrop-blur">
        <h5 class="text-xs font-semibold uppercase tracking-[0.25em] text-blue-300">What to try next</h5>
        <p class="mt-2 text-sm text-blue-200">
          Inspect the props available on each component and imagine how you would add a "Suspend user" action. The well-architected
          version gives you extension points without modifying the base component.
        </p>
      </div>
    </div>
  </div>
</div>
