require('dotenv').config();
const { generateMemeUrl } = require('./src/meme-generator');
const { sendToSlack } = require('./src/notification/slack');

/**
 * Main Skill Function: Generates a meme and optionally sends it to a channel.
 * @param {string} prompt - The meme template keyword (e.g., "doge").
 * @param {string[]} texts - Array of text lines.
 * @param {boolean} sendToChannel - Whether to send to the configured Slack channel.
 * @returns {Promise<{url: string, sent: boolean}>}
 */
const executeSkill = async (prompt, texts = [], sendToChannel = false) => {
  try {
    console.log(`[MemeSkill] Generating for: "${prompt}" with texts: [${texts.join(', ')}]...`);
    // Pass individual text arguments to generateMemeUrl
    const memeUrl = await generateMemeUrl(prompt, ...texts);
    
    let sent = false;
    if (sendToChannel) {
      console.log('[MemeSkill] Sending to Slack...');
      sent = await sendToSlack(`Meme: ${prompt} [${texts.join('/')}]`, memeUrl);
    }

    return { url: memeUrl, sent };
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
