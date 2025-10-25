# Vandeley - Importer-Exporter of Well-Architected Skills

[![Svelte](https://img.shields.io/badge/Svelte-5-FF3E00?logo=svelte)](https://svelte.dev)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-2-FF3E00)](https://kit.svelte.dev)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🎯 What is Vandeley?

Vandeley is a **self-bootstrapping documentation framework** that combines git analytics with AI-powered documentation generation. It's both:

1. **A git analytics tool** - Analyze commit patterns, detect technical debt, and measure architecture health
2. **The Skillful Framework** - A distributed skill registry that enables AI agents to auto-generate framework-specific documentation

Think of it as "Art Vandeley, Importer-Exporter" but for software architecture skills.

## ✨ Key Features

### Git Analytics Dashboard
- 📊 **Commit Pattern Analysis** - Visualize velocity, hotspots, and work sessions
- 🏗️ **Architecture KPIs** - Technical debt scoring, scaling readiness, velocity health
- 👥 **Contributor Analytics** - Collaboration patterns and knowledge distribution
- 📈 **Project Evolution** - Track architectural changes over time

### Skillful Framework (The Secret Sauce)
- 🤖 **Self-Bootstrapping Documentation** - AI agents auto-detect tech stack and generate docs
- 🌐 **Distributed Skills Registry** - Framework-specific templates (Svelte, React, Python, etc.)
- 🔍 **Git-Powered Detection** - Analyzes git history to understand project characteristics
- 📚 **Spanish-First Documentation** - Comprehensive READMEs in Spanish following best practices

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
# The art-vandeley skill uses Vandeley's registry
# When invoked, it:
# 1. Runs git analytics on your project
# 2. Detects tech stack (svelte, react, python, etc.)
# 3. Fetches framework-specific skill from vandeley.art/skills
# 4. Generates documentation following best practices

# From Claude Code:
# User: "Document this project"
# art-vandeley skill activates and orchestrates everything automatically
```

## 🏗️ Architecture

Vandeley implements a **self-bootstrapping agent orchestration pattern**:

```
art-vandeley skill invoked
    ↓
1. Run git analytics (.sh script)
   Outputs: { tech_stack, commits, scale, patterns }
    ↓
2. Fetch skills registry
   GET https://vandeley.art/api/skills
    ↓
3. Select framework-specific skill
   Based on detected tech_stack
    ↓
4. Fetch skill template
   GET https://vandeley.art/api/skills/skillful-{framework}
    ↓
5. Generate documentation
   Following framework best practices
   Output: README.md + Mermaid diagrams
```

### Project Structure

```
vandeley/
├── src/
│   ├── routes/
│   │   ├── analyze/          # Git analytics dashboard
│   │   ├── api/skills/       # Skills registry API
│   │   ├── book/             # Architecture learning content
│   │   └── tools/            # Developer tools (diagrams)
│   ├── lib/
│   │   ├── analytics/        # Git analytics engine
│   │   ├── parser/           # Git log parsing
│   │   └── components/       # Reusable components
│   └── static/skills/        # Skills registry
│       ├── registry.json     # Skills catalog
│       └── skillful-svelte/  # Framework-specific templates
│           └── SKILL.md
├── ~/.claude/skills/art-vandeley/
│   ├── SKILL.md              # Agent skill definition
│   └── scripts/
│       ├── analyze-git.sh    # Git analytics
│       ├── create-architecture.sh
│       ├── create-sequence.sh
│       └── create-interfaces.sh
└── README.md                 # This file
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

Documentation is hard because:
- Every framework has different conventions
- Developers forget to document
- Documentation gets outdated quickly
- Generic templates don't capture framework-specific patterns

### The Skillful Solution

Instead of manual documentation, Vandeley enables **autonomous documentation generation**:

1. **Git Analytics** - Understand the project without reading code
2. **Tech Stack Detection** - Auto-identify framework (Svelte, React, etc.)
3. **Skill Selection** - Fetch framework-specific documentation template
4. **Smart Generation** - Create docs that match framework conventions

### How It Works

```bash
# Phase 0: Orchestration (in art-vandeley skill)
ANALYTICS=$(~/.claude/skills/art-vandeley/scripts/analyze-git.sh)
TECH_STACK=$(echo "$ANALYTICS" | jq -r '.tech_stack')
SKILL=$(curl -s https://vandeley.art/api/skills/skillful-${TECH_STACK})

# Phase 1: Analysis
# Git analytics already provided project insights

# Phase 2: Generation
# Follow SKILL template for framework-specific docs

# Phase 3: Output
# README.md (Spanish)
# system-architecture.mmd
# component-hierarchy.mmd (for Svelte)
# sequence-diagram.mmd
```

## 🌐 API Endpoints

### Skills Registry

```bash
# Get all available skills
GET https://vandeley.art/api/skills
# Returns: registry.json with all framework skills

# Get specific skill template
GET https://vandeley.art/api/skills/skillful-svelte
# Returns: SKILL.md with Svelte-specific guidelines
```

### Git Analytics (Shell Script)

```bash
# Analyze any git repository
~/.claude/skills/art-vandeley/scripts/analyze-git.sh /path/to/repo

# Output (JSON):
{
  "repo_name": "my-project",
  "tech_stack": "svelte",
  "total_commits": 150,
  "has_database": true,
  "project_scale": "medium",
  "architecture_patterns": "component-based,api"
}
```

## 🤝 Contributing to the Skills Registry

Want to add a new framework skill? Here's how:

1. **Create skill directory**: `static/skills/skillful-{framework}/`
2. **Write SKILL.md**: Framework-specific documentation guidelines
3. **Update registry.json**: Add skill metadata
4. **Test**: Verify skill works with art-vandeley

Example skill structure:

```markdown
# Skillful {Framework} Documentation Generator

## Tech Stack Context
[Framework-specific features to highlight]

## README Structure (Spanish)
[Recommended sections]

## Diagram Guidelines
[What diagrams to create for this framework]

## Best Practices to Highlight
[Framework conventions]
```

## 📄 License

MIT

---

**Built with Svelte 5, D3.js, and an unhealthy obsession with well-architected software.**

*"I'm an importer-exporter. I focus mainly on chips... architecture chips."* - Art Vandeley (probably)
