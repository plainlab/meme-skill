const { searchTemplate, getRandomTemplate, buildUrl } = require('./core');

describe('Meme Generator Core', () => {
  const mockTemplates = [
    { id: 'doge', name: 'Doge', keywords: ['dog', 'shibe', 'wow'] },
    { id: 'cat', name: 'Grumpy Cat', keywords: ['cat', 'grumpy', 'no'] },
    { id: 'drake', name: 'Drake Hotline Bling', keywords: ['drake', 'yes', 'no'] }
  ];

  test('searchTemplate finds exact match by id', () => {
    const result = searchTemplate(mockTemplates, 'doge');
    expect(result.id).toBe('doge');
  });

  test('searchTemplate finds match by keyword', () => {
    const result = searchTemplate(mockTemplates, 'shibe');
    expect(result.id).toBe('doge');
  });

  test('searchTemplate returns null for no match', () => {
    const result = searchTemplate(mockTemplates, 'xyz123');
    expect(result).toBeNull();
  });

  test('getRandomTemplate returns an item from the list', () => {
    const result = getRandomTemplate(mockTemplates);
    expect(mockTemplates).toContain(result);
  });

  test('buildUrl constructs correct URL', () => {
    const url = buildUrl('doge', 'much wow', 'such code');
    expect(url).toBe('https://api.memegen.link/images/doge/much_wow/such_code.jpg');
  });

  test('buildUrl handles special characters', () => {
    const url = buildUrl('doge', 'what?', 'me & you');
    // ? -> ~q, & -> ~a
    expect(url).toContain('what~q');
    expect(url).toContain('me_~a_you');
  });
});
