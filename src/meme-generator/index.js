const { fetchTemplates, searchTemplate, getRandomTemplate, buildUrl } = require('./core');

/**
 * Generate a meme URL based on a prompt and text.
 * Falls back to a random template if the prompt matches nothing.
 * 
 * @param {string} searchPrompt - The "intent" or keyword (e.g., "smart guy").
 * @param {string} topText - Top caption.
 * @param {string} bottomText - Bottom caption.
 * @returns {Promise<string>} - The meme image URL.
 */
const generateMemeUrl = async (searchPrompt, topText, bottomText) => {
  const templates = await fetchTemplates();
  
  if (templates.length === 0) {
    throw new Error('No templates available from Meme Service.');
  }

  let template = searchTemplate(templates, searchPrompt);

  if (!template) {
    // Fallback to random if no match found
    console.log(`No match for "${searchPrompt}". Picking random template.`);
    template = getRandomTemplate(templates);
  }

  return buildUrl(template.id, topText, bottomText);
};

module.exports = {
  generateMemeUrl
};
