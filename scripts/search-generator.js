hexo.extend.generator.register('custom-search', function(locals) {
  const posts = locals.posts.sort('-date');

  function decodeHtmlEntities(text) {
    const entities = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&#x3D;': '=',
      '&#x27;': "'"
    };
    return text.replace(/&[#\w]+;/g, entity => entities[entity] || entity);
  }

  const searchData = posts.map(post => ({
    title: post.title,
    path: post.path,
    content: post.content ? decodeHtmlEntities(post.content.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()) : '',
    date: post.date.format('YYYY-MM-DD'),
    categories: post.categories.map(cat => cat.name),
    tags: post.tags.map(tag => tag.name)
  }));

  return {
    path: 'search-data.json',
    data: JSON.stringify(searchData)
  };
});
