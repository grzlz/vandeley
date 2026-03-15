#!/bin/bash
# Vandeley Installer — drops the gateway skill into Claude Code
# Usage: curl -sL vandeley.art/install.sh | bash

set -e

SKILL_DIR="$HOME/.claude/skills/vandeley"
SKILL_URL="https://vandeley.art/vandeley.md"

echo "Installing Vandeley skill gateway..."

mkdir -p "$SKILL_DIR"
curl -sL "$SKILL_URL" -o "$SKILL_DIR/SKILL.md"

echo "Installed to $SKILL_DIR/SKILL.md"
echo ""
echo "Vandeley is ready. In any Claude Code session, invoke the 'vandeley' skill."
echo "It will lazy-load the right expertise from vandeley.art/skillful/"
