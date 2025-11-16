hexo.extend.generator.register('custom-search', function(locals) {
  const posts = locals.posts.sort('-date');
  const searchData = posts.map(post => ({
    title: post.title,
    path: post.path,
    content: post.content ? post.content.replace(/<[^>]+>/g, '').substring(0, 200) : '',
    date: post.date.format('YYYY-MM-DD'),
    categories: post.categories.map(cat => cat.name),
    tags: post.tags.map(tag => tag.name)
  }));

  return {
    path: 'search-data.json',
    data: JSON.stringify(searchData)
  };
});
