const fetch = require('node-fetch');
const fs = require('fs');

/**
 * Send a file to Slack via Web API (requires SLACK_BOT_TOKEN).
 * @param {string} filePath - Local path to the file.
 * @param {string} channel - Channel ID to send to.
 */
const sendFileToSlack = async (filePath, channel) => {
  const botToken = process.env.SLACK_BOT_TOKEN;

  if (!botToken) {
    console.error('SLACK_BOT_TOKEN is not defined in environment variables.');
    return false;
  }

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return false;
  }

  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    formData.append('channels', channel);
    formData.append('initial_comment', '😏'); // Just an emoji, no extra text

    const response = await fetch('https://slack.com/api/files.upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${botToken}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (!result.ok) {
      throw new Error(`Slack API error: ${result.error}`);
    }

    console.log('[Slack] File sent successfully');
    return true;
  } catch (error) {
    console.error('Failed to send file to Slack:', error);
    return false;
  }
};

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

  // Check if imageUrl is actually a local file path
  if (fs.existsSync(imageUrl)) {
    console.log('[Slack] Detected local file, attempting file upload...');
    const channel = process.env.SLACK_CHANNEL_ID;
    if (channel) {
      return sendFileToSlack(imageUrl, channel);
    } else {
      console.error('SLACK_CHANNEL_ID is not defined for file upload.');
      return false;
    }
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

module.exports = { sendToSlack, sendFileToSlack };
