require('dotenv').config();
const { generateMemeUrl } = require('./src/meme-generator');
const { sendToSlack } = require('./src/notification/slack');

/**
 * Main Skill Function: Generates a meme and optionally sends it to a channel.
 * @param {string} prompt - The meme template keyword (e.g., "doge").
 * @param {string} topText - Top caption.
 * @param {string} bottomText - Bottom caption.
 * @param {boolean} sendToChannel - Whether to send to the configured Slack channel.
 * @returns {Promise<{url: string, sent: boolean}>}
 */
const executeSkill = async (prompt, topText, bottomText, sendToChannel = false) => {
  try {
    console.log(`[MemeSkill] Generating for: "${prompt}"...`);
    const memeUrl = await generateMemeUrl(prompt, topText, bottomText);
    
    let sent = false;
    if (sendToChannel) {
      console.log('[MemeSkill] Sending to Slack...');
      sent = await sendToSlack(`Meme: ${prompt} [${topText}/${bottomText}]`, memeUrl);
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
    const [prompt, top, bottom] = args;
    executeSkill(prompt, top || '_', bottom || '_', true)
      .then(res => console.log('Result:', res))
      .catch(err => process.exit(1));
  } else {
    console.log('Usage: node index.js <prompt> <topText> <bottomText>');
  }
}

module.exports = { executeSkill };
