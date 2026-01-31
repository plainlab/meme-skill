---
name: meme-skill
description: Generate memes using the memegen.link API with Unicode support. Fuzzy template matching finds the best meme for your prompt. Supports popular meme templates and custom images.
---

# Meme Skill (plainlab/meme-skill)

A Node.js-based meme generator skill with fuzzy template matching and Unicode support. Now supports **multiple text positions** (not just 2)!

## Quick Start

**CLI Usage:**
```bash
cd ~/.openclaw/workspace/skills/meme-skill
node index.js "<prompt>" "<text1>" "<text2>" "<text3>" ...
```

**Wrapper Script (simplified syntax):**
```bash
./meme.sh "template | text1 | text2 | text3 | ..."
```

## Examples

```bash
# 2 text positions (classic format)
node index.js "doge" "Much skill" "Very wow"

# 3 text positions (e.g., Captain America)
node index.js "captain-america" "Look at me" "I am the captain" "now"

# 5 text positions (e.g., Elmo choosing cocaine)
node index.js "elmo" "option 1" "option 2" "option 3" "option 4" "option 5"

# 6 text positions (e.g., American Chopper Argument)
node index.js "chair" "point 1" "point 2" "point 3" "point 4" "point 5" "point 6"

# Unicode support (Vietnamese, emojis, etc.)
node index.js "success" "Tài đức" "Vẹn toàn"

# Using the wrapper script with pipe syntax
./meme.sh "drake | not using memes | using memes"
./meme.sh "house fire | Trời ơi | cháy rồi"
```

## How It Works

1. **Fuzzy Matching**: The skill searches for the best meme template based on your prompt keyword
2. **Template Fallback**: If no match is found, it falls back to a random template
3. **Multiple Text Positions**: Supports variable number of text lines (2, 3, 4, 5, 6+) depending on the template
4. **Unicode Support**: Full support for non-English text using the notosans font
5. **Direct URLs**: Returns direct image URLs that can be shared anywhere

## Popular Templates by Text Position Count

### 2 Lines (Classic)
- `doge` - Doge
- `drake` - Drake Hotline Bling
- `change-my-mind` - Steven Crowder with sign
- `surprised-pikachu` - Shocked Pikachu
- `stonks` - Meme man with stock gains

### 3 Lines
- `captain-america` - Captain America Elevator Fight Dad Joke
- `distracted-boyfriend` - Distracted Boyfriend (choice vs temptation)
- `ds` - Daily Struggle

### 4 Lines
- `astronaut` - Always Has Been
- `balloon` - Running Away Balloon

### 5 Lines
- `elmo` - Elmo Choosing Cocaine

### 6 Lines
- `chair` - American Chopper Argument

## Integration with OpenClaw

The skill can be integrated programmatically:
```javascript
const { executeSkill } = require('/Users/manhtai/.openclaw/workspace/skills/meme-skill/index.js');

// Generate with 2 text positions
const result = await executeSkill('cat', ['I can has', 'cheezburger'], false);
console.log(result.url);

// Generate with multiple text positions
const result2 = await executeSkill('elmo', ['choice 1', 'choice 2', 'choice 3', 'choice 4', 'choice 5'], false);
console.log(result2.url);

// Generate and send to Slack (requires SLACK_HOOK_URL in .env)
await executeSkill('cat', ['I can has', 'cheezburger'], true);
```

## Configuration

Optional `.env` file in the skill directory:
```bash
# Optional: Self-hosted instance, defaults to api.memegen.link
MEMEGEN_URI=https://api.memegen.link

# Required for Slack notification feature
SLACK_HOOK_URL=https://hooks.slack.com/services/YOUR/HOOK/URL
```

## Testing

Run tests:
```bash
cd ~/.openclaw/workspace/skills/meme-skill
npm test
```

## Notes

- The memegen.link API is free and requires no authentication
- Generated image URLs are permanent and publicly accessible
- Text is automatically URL-encoded (spaces → underscores)
- Each template has a specific number of text lines - the skill will use as many as you provide
- Use underscore `_` or empty strings to skip text fields if needed
