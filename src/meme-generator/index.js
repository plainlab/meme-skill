const { fetchTemplates, searchTemplate, getRandomTemplate, buildUrl, downloadMeme } = require('./core');

/**
 * Generate a meme URL based on a prompt and text.
 * Falls back to a random template if the prompt matches nothing.
 *
 * @param {string} searchPrompt - The "intent" or keyword (e.g., "smart guy").
 * @param {...string} texts - Variable text lines (top, middle, bottom, etc.).
 * @returns {Promise<string>} - The meme image URL.
 */
const generateMemeUrl = async (searchPrompt, ...texts) => {
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

  return buildUrl(template.id, ...texts);
};

module.exports = {
  generateMemeUrl,
  downloadMeme
};
