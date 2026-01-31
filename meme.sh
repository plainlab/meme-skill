#!/bin/bash
# Simple wrapper for meme generation with pipe syntax
# Usage: ./meme.sh "template | text1 | text2 | text3 | ..."
# Supports variable number of text positions

INPUT="$1"
SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Parse pipe-separated input
IFS='|' read -ra PARTS <<< "$INPUT"

TEMPLATE=$(echo "${PARTS[0]}" | xargs)  # trim whitespace

# Extract all text parts (everything after the template)
TEXT_ARGS=()
for i in "${PARTS[@]:1}"; do
  TEXT_ARGS+=("$(echo "$i" | xargs)")  # trim each text part
done

# Generate meme with all text positions
if [ ${#TEXT_ARGS[@]} -eq 0 ]; then
  # No text provided, pass just template (will use defaults)
  node "$SKILL_DIR/index.js" "$TEMPLATE"
else
  # Pass template and all text arguments
  node "$SKILL_DIR/index.js" "$TEMPLATE" "${TEXT_ARGS[@]}"
fi
