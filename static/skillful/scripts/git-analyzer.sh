#!/bin/bash
# analyze-git.sh
# Analyzes git repository and returns structured JSON data for skill selection
# Part of the Skillful framework - used by art-vandeley to auto-detect project characteristics

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default to current directory if no path provided
PROJECT_PATH="${1:-.}"

# Check if directory exists and is a git repo
if [ ! -d "$PROJECT_PATH/.git" ]; then
    echo -e "${RED}Error: Not a git repository${NC}" >&2
    exit 1
fi

cd "$PROJECT_PATH"

# Function to detect tech stack
detect_tech_stack() {
    local stack=""

    # Svelte detection
    if [ -f "svelte.config.js" ] || grep -q "\"svelte\"" package.json 2>/dev/null; then
        stack="svelte"
    # React detection
    elif grep -q "\"react\"" package.json 2>/dev/null; then
        stack="react"
    # Vue detection
    elif grep -q "\"vue\"" package.json 2>/dev/null; then
        stack="vue"
    # Python detection
    elif [ -f "requirements.txt" ] || [ -f "pyproject.toml" ]; then
        stack="python"
    # Rust detection
    elif [ -f "Cargo.toml" ]; then
        stack="rust"
    # Go detection
    elif [ -f "go.mod" ]; then
        stack="go"
    # Node.js generic
    elif [ -f "package.json" ]; then
        stack="nodejs"
    else
        stack="unknown"
    fi

    echo "$stack"
}

# Function to count commits
count_commits() {
    git rev-list --count HEAD 2>/dev/null || echo "0"
}

# Function to get commit frequency (commits per week)
get_commit_frequency() {
    local total_commits=$(count_commits)
    if [ "$total_commits" -eq 0 ]; then
        echo "0"
        return
    fi

    local first_commit=$(git log --reverse --format="%at" | head -1)
    local last_commit=$(git log --format="%at" | head -1)
    local weeks=$(( ($last_commit - $first_commit) / 604800 ))

    if [ "$weeks" -eq 0 ]; then
        echo "$total_commits"
    else
        echo $(( $total_commits / $weeks ))
    fi
}

# Function to detect if project has database
has_database() {
    # Check for common DB files/configs
    if [ -f "prisma/schema.prisma" ] || \
       [ -f "drizzle.config.ts" ] || \
       grep -q "mongoose\|sequelize\|typeorm\|drizzle\|prisma" package.json 2>/dev/null || \
       [ -f "alembic.ini" ] || \
       grep -q "sqlalchemy\|django" requirements.txt 2>/dev/null; then
        echo "true"
    else
        echo "false"
    fi
}

# Function to detect project scale
detect_scale() {
    local total_commits=$(count_commits)
    local file_count=$(git ls-files | wc -l | tr -d ' ')

    if [ "$total_commits" -lt 50 ] && [ "$file_count" -lt 30 ]; then
        echo "small"
    elif [ "$total_commits" -lt 200 ] && [ "$file_count" -lt 100 ]; then
        echo "medium"
    else
        echo "large"
    fi
}

# Function to get top contributors
get_contributors() {
    git log --format='%an' | sort | uniq -c | sort -rn | head -5 | \
        awk '{for(i=2;i<=NF;i++) printf "%s ", $i; print ""}' | \
        sed 's/^/"/; s/$/"/' | paste -sd ',' - || echo ""
}

# Function to detect architecture patterns from commits
detect_architecture_patterns() {
    local patterns=""

    # Check for microservices indicators
    if git log --all --oneline | grep -qi "service\|microservice"; then
        patterns="${patterns}microservices,"
    fi

    # Check for monorepo
    if [ -f "pnpm-workspace.yaml" ] || [ -f "lerna.json" ] || [ -f "nx.json" ]; then
        patterns="${patterns}monorepo,"
    fi

    # Check for component-based
    if [ -d "src/components" ] || [ -d "components" ]; then
        patterns="${patterns}component-based,"
    fi

    # Check for API/backend
    if [ -d "src/routes/api" ] || [ -d "api" ] || [ -d "src/api" ]; then
        patterns="${patterns}api,"
    fi

    # Remove trailing comma
    echo "${patterns%,}"
}

# Function to get recent activity
get_recent_activity() {
    local last_week=$(git log --since="1 week ago" --oneline | wc -l | tr -d ' ')
    local last_month=$(git log --since="1 month ago" --oneline | wc -l | tr -d ' ')

    echo "{\"last_week\":$last_week,\"last_month\":$last_month}"
}

# Function to detect if project uses TypeScript
uses_typescript() {
    if [ -f "tsconfig.json" ] || grep -q "\"typescript\"" package.json 2>/dev/null; then
        echo "true"
    else
        echo "false"
    fi
}

# Main analytics collection
echo -e "${GREEN}Analyzing git repository...${NC}" >&2

TECH_STACK=$(detect_tech_stack)
TOTAL_COMMITS=$(count_commits)
COMMIT_FREQUENCY=$(get_commit_frequency)
HAS_DB=$(has_database)
PROJECT_SCALE=$(detect_scale)
CONTRIBUTORS=$(get_contributors)
ARCHITECTURE=$(detect_architecture_patterns)
RECENT_ACTIVITY=$(get_recent_activity)
USES_TS=$(uses_typescript)
REPO_NAME=$(basename "$(git rev-parse --show-toplevel)")

# Output JSON
cat <<EOF
{
  "repo_name": "$REPO_NAME",
  "tech_stack": "$TECH_STACK",
  "total_commits": $TOTAL_COMMITS,
  "commit_frequency": $COMMIT_FREQUENCY,
  "has_database": $HAS_DB,
  "project_scale": "$PROJECT_SCALE",
  "contributors": [$CONTRIBUTORS],
  "architecture_patterns": "$(echo $ARCHITECTURE | sed 's/,/", "/g; s/^/"/; s/$/"/' | sed 's/""//')",
  "recent_activity": $RECENT_ACTIVITY,
  "uses_typescript": $USES_TS,
  "analysis_timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

echo -e "${GREEN}Analysis complete!${NC}" >&2
