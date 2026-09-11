hexo.extend.generator.register('custom-search', function(locals) {
  // 這個 generator 不在 hide_posts 的 blocklist，所以系列子頁也能被站內搜尋找到
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

  // 前端是用 `/${path}` 組連結，front-matter permalink 會帶開頭斜線，要先去掉
  const normalize = (path) => (path || '').replace(/^\/+/, '');

  const searchData = posts.map(post => ({
    title: post.title,
    path: normalize(post.path),
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
