const fetch = require('node-fetch');
const NodeCache = require('node-cache');
const Fuse = require('fuse.js');

const BASE_URL = process.env.MEMEGEN_URI || 'https://api.memegen.link';
const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

/**
 * Fetch templates from the API with caching
 */
const fetchTemplates = async () => {
  const cacheKey = 'meme_templates';
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(`${BASE_URL}/templates`);
    if (!response.ok) throw new Error(`Failed to fetch templates: ${response.statusText}`);
    const data = await response.json();
    cache.set(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error fetching templates:', error);
    return [];
  }
};

/**
 * Search for a template using Fuse.js
 * @param {Array} templates 
 * @param {string} query 
 */
const searchTemplate = (templates, query) => {
  if (!query) return null;

  const options = {
    keys: ['name', 'id', 'keywords'],
    threshold: 0.4, // Match sensitivity
  };

  const fuse = new Fuse(templates, options);
  const result = fuse.search(query);

  return result.length > 0 ? result[0].item : null;
};

/**
 * Get a random template
 * @param {Array} templates 
 */
const getRandomTemplate = (templates) => {
  if (!templates || templates.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * templates.length);
  return templates[randomIndex];
};

/**
 * Build the Meme URL
 * @param {string} templateId 
 * @param {string} topText 
 * @param {string} bottomText 
 */
const buildUrl = (templateId, topText = '_', bottomText = '_') => {
  const normalize = (text) => {
    return (text || '_')
      .replace(/ /g, '_')
      .replace(/\?/g, '~q')
      .replace(/&/g, '~a')
      .replace(/%/g, '~p')
      .replace(/#/g, '~h')
      .replace(/\//g, '~s')
      .replace(/\\/g, '~b');
  };

  const path = `${normalize(topText)}/${normalize(bottomText)}`;
  return `${BASE_URL}/images/${templateId}/${encodeURI(path)}.jpg?font=notosans`;
};

module.exports = {
  fetchTemplates,
  searchTemplate,
  getRandomTemplate,
  buildUrl
};
