# Vandeley - Importer-Exporter of Well-Architected Skills

[![Svelte](https://img.shields.io/badge/Svelte-5-FF3E00?logo=svelte)](https://svelte.dev)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-2-FF3E00)](https://kit.svelte.dev)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🎯 What is Vandeley?

Vandeley is a **lazy-loading AI agent orchestration framework** that combines git analytics with on-demand skill loading. It's both:

1. **A git analytics tool** - Analyze commit patterns, detect technical debt, and measure architecture health
2. **The Skillful Framework** - A lazy-loading architecture where AI agents curl framework-specific instructions on-demand

Think of it as "Art Vandeley, Importer-Exporter" - minimal footprint locally, fetches expertise when needed.

## ✨ Key Features

### Git Analytics Dashboard
- 📊 **Commit Pattern Analysis** - Visualize velocity, hotspots, and work sessions
- 🏗️ **Architecture KPIs** - Technical debt scoring, scaling readiness, velocity health
- 👥 **Contributor Analytics** - Collaboration patterns and knowledge distribution
- 📈 **Project Evolution** - Track architectural changes over time

### Skillful Framework (The Secret Sauce)
- 🤖 **Lazy-Loading Agents** - AI agents curl their own instructions on-demand (zero local bloat)
- 🔄 **Multi-Skill Orchestration** - Load framework-specific skills, execute, then garbage collect
- 🔍 **Git-Powered Detection** - Analyzes git history to auto-detect tech stack without asking
- 📚 **Framework-Aware Documentation** - Generates docs that match your stack (Svelte, React, Python, etc.)

## 🚀 Quick Start

### As a Git Analytics Tool

```bash
# Generate git log
git log --stat > gitlog.txt

# Open Vandeley and upload the file
open http://localhost:5173/analyze

# Or use the analytics scripts directly
~/.claude/skills/art-vandeley/scripts/analyze-git.sh
```

### As a Documentation Framework

```bash
# Art Vandeley lazy-loads his own brain on-demand:
# When invoked, he:
# 1. Curls full instructions: curl vandeley.art/art-vandeley.md
# 2. Runs git analytics to detect your stack
# 3. Curls framework-specific skill: curl vandeley.art/skillful/svelte/SKILL.md
# 4. Generates documentation, then forgets everything (garbage collection)

# From Claude Code:
# User: "Document this project"
# art-vandeley: "Hey, let me see what imports-exports we have here..."
```

## 🏗️ Architecture

Vandeley implements a **lazy-loading agent orchestration pattern**:

```
User: "Document this project"
    ↓
art-vandeley subagent (minimal trigger: static/art-vandeley.md)
    ↓
Step 1: Lazy load full instructions
    curl vandeley.art/art-vandeley.md
    ↓
Step 2: Self-introduction
    "Hey, I am Art Vandeley, let me see what imports-exports we have here..."
    ↓
Step 3: Run git analytics
    bash <(curl -sL vandeley.art/skillful/scripts/git-analyzer.sh)
    Outputs: { tech_stack: "svelte", commits: 150, scale: "medium" }
    ↓
Step 4: Analyze and recommend
    "Your README.md hasn't been touched since commit X..."
    "I recommend: skillful-svelte based on your Svelte 5 + runes setup"
    ↓
Step 5: Lazy load framework-specific agent
    curl vandeley.art/skillful/svelte/SKILL.md
    ↓
Step 6: Execute framework agent
    Generate README.md (Spanish) + Mermaid diagrams
    ↓
Step 7: Garbage collect (forget all instructions)
```

**Key insight**: Art Vandeley is a **stateless orchestrator**. He curls expertise, uses it, then forgets it. Zero bloat.

### Project Structure

```
vandeley/
├── src/
│   ├── routes/
│   │   ├── analyze/          # Git analytics dashboard
│   │   ├── book/             # Architecture learning content
│   │   ├── skills/           # Skills marketplace UI
│   │   └── tools/            # Developer tools (diagrams)
│   └── lib/
│       ├── analytics/        # Git analytics engine
│       ├── parser/           # Git log parsing
│       └── components/       # Reusable components
├── static/
│   ├── art-vandeley.md       # Minimal orchestrator trigger
│   └── skillful/             # Framework-specific agents (lazy-loaded)
│       ├── SKILL.md          # Meta: what is skillful framework
│       ├── reference.md      # Available skills reference
│       ├── examples.md       # Example outputs
│       ├── scripts/
│       │   └── git-analyzer.sh
│       ├── svelte/
│       │   └── SKILL.md      # Svelte 5 documentation agent
│       └── react/
│           └── SKILL.md      # React agent (planned)
└── ~/.claude/skills/art-vandeley/
    ├── SKILL.md              # Local skill (points to lazy-loader)
    └── scripts/
        └── analyze-git.sh    # Git analytics (being migrated)
```

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/vandeley.git
cd vandeley

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:5173
```

## 🎓 The Skillful Framework Explained

### What Problem Does It Solve?

Traditional AI skills are **bloated**:
- Every skill carries full instructions locally
- Context windows fill up with static prompts
- Can't update skills without reinstalling
- One-size-fits-all approaches don't work per framework

### The Skillful Solution

**Lazy-loading + Garbage collection**:

1. **Minimal Trigger** - Local skill is ~10 lines: "curl my real instructions"
2. **On-Demand Loading** - Fetch full instructions only when invoked
3. **Framework Detection** - Git analytics identifies tech stack automatically
4. **Specialized Execution** - Load framework-specific agent (Svelte/React/Python)
5. **Garbage Collection** - Forget everything after execution

### The Flow

```bash
# Art Vandeley's orchestration:
curl vandeley.art/art-vandeley.md          # Load orchestration logic
bash <(curl vandeley.art/skillful/scripts/git-analyzer.sh)  # Detect stack
curl vandeley.art/skillful/svelte/SKILL.md # Load specialist

# Output:
# - README.md (Spanish, framework-aware)
# - system-architecture.mmd
# - component-hierarchy.mmd (Svelte-specific)
# - sequence-diagram.mmd
```

## 🧪 How Git Analytics Works

The secret sauce is **detecting without asking**:

```bash
# Run git analyzer
~/.claude/skills/art-vandeley/scripts/analyze-git.sh

# Detects via file patterns:
*.svelte → Svelte project
*.tsx → React/TypeScript
*.py + requirements.txt → Python

# Outputs structured JSON:
{
  "tech_stack": "svelte",
  "total_commits": 150,
  "has_database": true,
  "project_scale": "medium",
  "architecture_patterns": "component-based,api"
}
```

## 🤝 Contributing New Framework Skills

Want to add support for a new framework? Just add markdown files:

1. **Create framework directory**: `static/skillful/{framework}/`
2. **Write SKILL.md**: Agent instructions for that framework
3. **Test locally**: Update art-vandeley.md to curl your local file
4. **Deploy**: Push to vandeley.art and it's instantly available

Example `static/skillful/python/SKILL.md`:

```markdown
# Skillful Python Documentation Generator

You are a Python documentation specialist. You've been loaded because
git analytics detected a Python project.

## Your Mission
Generate a comprehensive Spanish README.md that highlights:
- Virtual environment setup (venv/poetry)
- Dependencies from requirements.txt or pyproject.toml
- Package structure following Python conventions
- Testing with pytest

## Diagrams to Create
1. **Module architecture** - Show package hierarchy
2. **Class diagrams** - Key classes and relationships
3. **Sequence diagrams** - Important workflows

## Spanish Terminology
- Entorno virtual → Virtual environment
- Paquete → Package
- Módulo → Module
```

**No registry, no database, no API.** Just markdown files.

## 📄 License

MIT

---

**Built with Svelte 5, D3.js, and the power of lazy-loading everything.**

*"I'm an importer-exporter. I focus mainly on lazy-loading skills and forgetting them immediately."* - Art Vandeley
