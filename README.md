# Meme Generator Skill

A modular skill for AI agents (like OpenClaw) to generate memes and share them via Slack.

## Features
- **Smart Template Matching**: Fuzzy search to find the best meme template for a user's prompt (e.g., "coding" -> finds relevant dev memes).
- **Unicode Support**: Full support for non-English text (Vietnamese, emojis, etc.) using `notosans` font.
- **Slack Integration**: Verification hook to send generated memes to a channel.
- **Resilient**: Fallback to random templates if no match is found.

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file:

```env
# Optional: Self-hosted instance, defaults to api.memegen.link
MEMEGEN_URI=https://api.memegen.link

# Required for Slack notification
SLACK_HOOK_URL=https://hooks.slack.com/services/YOUR/HOOK/URL
```

## Usage

### CLI
Run directly from the terminal with any number of text lines:

```bash
# Basic (2 lines)
node index.js "doge" "Much Skill" "Very Wow"

# Captain Meme (3 lines)
node index.js "captain" "Look at me" "I am the captain" "now"

# Unicode
node index.js "success" "Tài đức" "Vẹn toàn"
```

### Programmatic
```javascript
const { executeSkill } = require('./index');

// Generate and get URL only
const result = await executeSkill('captain', ['Look at me', 'I am the captain', 'now'], false);
console.log(result.url);

// Generate and Send to Slack
await executeSkill('doge', ['Much code', 'Very works'], true);
```

## AI Agent Integration (OpenClaw)

### 1. Install Skill
Clone this repository into your OpenClaw skills directory or configure it as a remote skill:

- **Repository**: `https://github.com/plainlab/meme-skill`

```bash
git clone https://github.com/plainlab/meme-skill
cd meme-skill
npm install
```

### 2. Tool Definition (`skill.json`)

To register this skill with an AI agent, use the definition found in [`skill.json`](./skill.json):

```json
{
  "name": "generate_meme",
  "description": "Generate a meme image based on a search prompt and captions. Can optionally send to Slack.",
  "parameters": {
    "type": "object",
    "properties": {
      "prompt": {
        "type": "string",
        "description": "Keyword to find a meme template (e.g., 'doge', 'cat', 'coding')."
      },
      "topText": {
        "type": "string",
        "description": "Text to appear at the top of the meme."
      },
      "bottomText": {
        "type": "string",
        "description": "Text to appear at the bottom of the meme."
      },
      "sendToSlack": {
        "type": "boolean",
        "description": "Whether to send the generated meme to the configured Slack channel.",
        "default": true
      }
    },
    "required": ["prompt", "topText", "bottomText"]
  }
}
```

## Testing
Run unit tests:
```bash
npm test
```
