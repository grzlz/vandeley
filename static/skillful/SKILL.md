---
name: skillful-framework
idescription: Entry point for for the Skillful Framework. Routes to skills library for lazy loading by our skilled importer-exporter Arty Vandeley.
---

# Skillful Framework

**TL;DR**: If `git-analyzer.sh` returned `"tech_stack": "svelte"`, read `svelte/SKILL.md`. That agent will generate Spanish README.md + Mermaid diagrams for your Svelte project.

## What is Skillful?

Framework-specific documentation agents that are **lazy-loaded on-demand**. Each framework gets its own specialized agent because a Svelte 5 project needs different docs than a Go service.

## Available Agents

### ✅ Currently Available

**Svelte/SvelteKit** → `skillful/svelte/SKILL.md`
- Svelte 5 runes documentation (`$state`, `$derived`, `$effect`)
- SvelteKit routing + component diagrams
- Spanish README with Svelte-specific terminology

### 🚧 Planned

**Go** → `skillful/go/SKILL.md` (Not yet implemented)
**TypeScript** → `skillful/typescript/SKILL.md` (Not yet implemented)

## Routing Logic

```javascript
const routes = {
  'svelte': 'skillful/svelte/SKILL.md',
  'go': 'skillful/go/SKILL.md',        // TODO
  'typescript': 'skillful/typescript/SKILL.md'  // TODO
};

// For now, default to svelte
const skillPath = routes[tech_stack] || 'skillful/svelte/SKILL.md';
```

## How It Works

1. **art-vandeley** runs `git-analyzer.sh`
2. Script returns JSON: `{ "tech_stack": "svelte", ... }`
3. **art-vandeley** curls this file to determine routing
4. Curl the framework-specific SKILL.md
5. Execute that agent's instructions
6. Generate docs, then garbage collect

## Why Lazy-Loading?

- ✅ Zero local bloat - fetch only what you need
- ✅ Framework-specific expertise per agent
- ✅ Update docs by editing markdown (no reinstall)
- ✅ Stateless execution (curl → execute → forget)

---

**For art-vandeley**: After reading this, curl the appropriate framework SKILL.md and execute its documentation generation instructions.
