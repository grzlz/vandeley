# Skillful Framework Reference

Complete reference guide for the Skillful lazy-loading documentation framework.

## Overview

**Skillful** is a framework-specific documentation generation system where specialized agents are curled on-demand based on git analytics. Each framework gets its own agent because documentation needs vary wildly between Svelte, Go, and TypeScript projects.

## Available Agents

### skillful-svelte

**File**: `skillful/svelte/SKILL.md`
**Trigger**: `git-analyzer.sh` returns `"tech_stack": "svelte"`
**Purpose**: Generate Spanish README.md for Svelte 5 / SvelteKit projects

**Generates**:
- README.md (Spanish) with Svelte 5 runes explanations
- `system-architecture.mmd` - Overall system architecture
- `component-hierarchy.mmd` - Svelte component tree
- `routing-diagram.mmd` - SvelteKit file-based routing
- `state-flow.mmd` - Reactive state flow (if applicable)

**Key Features**:
- Svelte 5 runes (`$state`, `$derived`, `$effect`) documentation
- SvelteKit routing patterns
- Spanish terminology for Svelte concepts
- Component props and event flow diagrams

**Detection Rules**:
- Presence of `*.svelte` files
- `package.json` contains `"svelte"` or `"@sveltejs/kit"`
- `svelte.config.js` exists

---

### skillful-go (Planned)

**File**: `skillful/go/SKILL.md` (Not yet implemented)
**Trigger**: `git-analyzer.sh` returns `"tech_stack": "go"`
**Purpose**: Generate Spanish README.md for Go projects

**Will Generate**:
- README.md (Spanish) with Go project structure
- `system-architecture.mmd` - Service architecture
- `package-diagram.mmd` - Go package relationships
- `api-diagram.mmd` - HTTP handlers and routes (if applicable)

**Planned Features**:
- Go modules and package documentation
- Concurrency patterns (goroutines, channels)
- HTTP server routing (if using net/http, gin, echo)
- Spanish terminology for Go concepts

**Detection Rules**:
- `go.mod` file exists
- Presence of `*.go` files
- `go.sum` exists

---

### skillful-typescript (Planned)

**File**: `skillful/typescript/SKILL.md` (Not yet implemented)
**Trigger**: `git-analyzer.sh` returns `"tech_stack": "typescript"`
**Purpose**: Generate Spanish README.md for TypeScript projects

**Will Generate**:
- README.md (Spanish) with TypeScript setup
- `system-architecture.mmd` - Project architecture
- `module-diagram.mmd` - TypeScript module relationships
- `type-hierarchy.mmd` - Key type/interface definitions

**Planned Features**:
- TypeScript configuration (`tsconfig.json`)
- Type system patterns
- Module resolution
- Build and compilation steps
- Spanish terminology for TypeScript concepts

**Detection Rules**:
- `tsconfig.json` exists
- Presence of `*.ts` files (excluding `*.d.ts` only projects)
- `package.json` contains `"typescript"`

---

## Tech Stack Detection

The `git-analyzer.sh` script detects frameworks in this priority order:

1. **Svelte**: Check for `*.svelte` files or `svelte.config.js`
2. **Go**: Check for `go.mod` or `*.go` files
3. **TypeScript**: Check for `tsconfig.json` and `*.ts` files
4. **React**: Check for `*.tsx` files or `react` in `package.json` (future)
5. **Python**: Check for `requirements.txt`, `pyproject.toml`, or `*.py` files (future)

**Priority matters**: A SvelteKit project has TypeScript files, but Svelte takes priority because that's the more specific framework.

## Diagram Types by Framework

### Common to All Frameworks

**system-architecture.mmd**
- High-level system overview
- External dependencies
- Database connections
- API integrations
- Deployment architecture

### Svelte-Specific

**component-hierarchy.mmd**
- Svelte component tree
- Props flow between components
- Event dispatching patterns
- Layout and page relationships

**routing-diagram.mmd**
- SvelteKit file-based routing
- `+page.svelte`, `+layout.svelte`, `+server.js` relationships
- Load functions and data flow

**state-flow.mmd**
- `$state` reactive declarations
- `$derived` computed values
- Event-driven state updates

### Go-Specific (Planned)

**package-diagram.mmd**
- Go package structure
- Import relationships
- Internal vs external packages

**api-diagram.mmd**
- HTTP routes and handlers
- Middleware chain
- Request/response flow

### TypeScript-Specific (Planned)

**module-diagram.mmd**
- ES modules structure
- Import/export relationships
- Barrel exports

**type-hierarchy.mmd**
- Key interfaces
- Type aliases
- Generic type usage
- Inheritance patterns

## Spanish Terminology Standards

Each framework agent follows these translation rules:

### Universal Terms (Keep in English)
- Git, GitHub, npm, package.json
- API, REST, HTTP, JSON, URL
- Build, dev, test (when referring to npm scripts)

### Universal Terms (Translate to Spanish)
- **Setup** → Configuración / Instalación
- **Installation** → Instalación
- **Requirements** → Requisitos
- **Dependencies** → Dependencias
- **Build** → Compilación (when referring to process)
- **Development server** → Servidor de desarrollo
- **Production** → Producción
- **Testing** → Pruebas
- **Documentation** → Documentación

### Framework-Specific Terms

See each framework's SKILL.md for terminology guide.

## Usage Patterns

### Standalone Usage (Direct curl)

```bash
# Detect tech stack
bash <(curl -sL vandeley.art/skillful/scripts/git-analyzer.sh)

# Based on result, curl the appropriate agent
curl vandeley.art/skillful/svelte/SKILL.md

# Read instructions and execute manually
```

### Orchestrated Usage (via art-vandeley)

```bash
# art-vandeley handles everything:
# 1. Runs git-analyzer.sh
# 2. Curls skillful/SKILL.md for routing
# 3. Curls framework-specific agent
# 4. Executes documentation generation
# 5. Garbage collects (forgets instructions)
```

### Local Development

```bash
# During development, use localhost URLs
curl localhost:5173/skillful/svelte/SKILL.md

# Test git analyzer locally
bash static/skillful/scripts/git-analyzer.sh
```

## File Structure

```
static/skillful/
├── SKILL.md              # Meta router - reads this first
├── reference.md          # This file - complete reference
├── examples.md           # Example outputs
├── scripts/
│   └── git-analyzer.sh   # Tech stack detection
├── svelte/
│   └── SKILL.md          # Svelte documentation agent
├── go/                   # (Planned)
│   └── SKILL.md
└── typescript/           # (Planned)
    └── SKILL.md
```

## Adding New Framework Agents

1. **Create directory**: `static/skillful/{framework}/`
2. **Write SKILL.md**: Framework-specific documentation instructions
3. **Add detection rules**: Update `git-analyzer.sh` to detect the framework
4. **Update router**: Add route to `static/skillful/SKILL.md`
5. **Document**: Add section to this reference.md
6. **Test**: Run on real projects, verify output quality

**No registry, no database, no API.** Just markdown files and bash scripts.

## Quality Standards

All skillful agents must:

- ✅ Generate documentation in **Spanish** (neutral, Latin American friendly)
- ✅ Include **concrete code examples** from the actual project
- ✅ Create **accurate Mermaid diagrams** that reflect real code structure
- ✅ Provide **framework-specific explanations** (not generic boilerplate)
- ✅ Include **setup instructions** that work (verified file paths)
- ✅ Use **consistent Spanish terminology** per framework guide
- ✅ Explain the **"why"** not just the "what"

## Execution Success Criteria

Documentation is complete when:

1. A Spanish-speaking developer can clone and run the project in < 5 minutes
2. All file paths mentioned in docs are verified to exist
3. Diagrams accurately represent the current codebase
4. Framework-specific features are explained with project examples
5. Spanish terminology is consistent throughout
6. No generic "TODO" placeholders or copy-paste boilerplate

---

**Last updated**: 2025-10-25
**Active agents**: Svelte
**Planned agents**: Go, TypeScript
