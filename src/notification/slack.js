const fetch = require('node-fetch');

/**
 * Send a message with an image to Slack via Webhook.
 * @param {string} text - Message text.
 * @param {string} imageUrl - URL of the image.
 */
const sendToSlack = async (text, imageUrl) => {
  const hookUrl = process.env.SLACK_HOOK_URL;

  if (!hookUrl) {
    console.error('SLACK_HOOK_URL is not defined in environment variables.');
    return false;
  }

  const payload = {
    text: text,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: text,
        },
      },
      {
        type: 'image',
        image_url: imageUrl,
        alt_text: text,
      },
    ],
  };

  try {
    const response = await fetch(hookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Slack API error: ${response.status} ${body}`);
    }

    return true;
  } catch (error) {
    console.error('Failed to send to Slack:', error);
    return false;
  }
};

module.exports = { sendToSlack };
