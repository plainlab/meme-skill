require('dotenv').config();
const { generateMemeUrl, downloadMeme } = require('./src/meme-generator');
const { sendToSlack } = require('./src/notification/slack');

/**
 * Main Skill Function: Generates a meme and optionally sends it to a channel.
 * @param {string} prompt - The meme template keyword (e.g., "doge").
 * @param {string[]} texts - Array of text lines.
 * @param {boolean} sendToChannel - Whether to send to the configured Slack channel.
 * @returns {Promise<{filePath: string, url: string, sent: boolean}>}
 */
const executeSkill = async (prompt, texts = [], sendToChannel = false) => {
  try {
    console.log(`[MemeSkill] Generating for: "${prompt}" with texts: [${texts.join(', ')}]...`);
    // Pass individual text arguments to generateMemeUrl
    const memeUrl = await generateMemeUrl(prompt, ...texts);

    // Download the meme to a local file
    console.log('[MemeSkill] Downloading meme...');
    const filePath = await downloadMeme(memeUrl);
    console.log(`[MemeSkill] Saved to: ${filePath}`);

    let sent = false;
    if (sendToChannel) {
      console.log('[MemeSkill] Sending to Slack...');
      // Send with minimal text - just the emoji, no extra messages
      sent = await sendToSlack('😏', filePath);
    }

    return { filePath, url: memeUrl, sent };
  } catch (error) {
    console.error('[MemeSkill] Error:', error.message);
    throw error;
  }
};

// CLI Execution if run directly
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length > 0) {
    // First arg is prompt
    const prompt = args[0];
    // All subsequent args are texts
    const texts = args.slice(1);
    
    // If no texts provided, default to empty placeholders
    const finalTexts = texts.length > 0 ? texts : ['_', '_'];

    executeSkill(prompt, finalTexts, true)
      .then(res => console.log('Result:', res))
      .catch(err => process.exit(1));
  } else {
    console.log('Usage: node index.js <prompt> <text1> [text2] [text3] ...');
  }
}

module.exports = { executeSkill };
