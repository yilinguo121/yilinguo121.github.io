// 随机文章功能 - 生成包含所有文章路径的JS文件
hexo.extend.generator.register('random-posts-data', function(locals) {
  const posts = locals.posts.filter(post => post.published).data;

  // 生成包含所有文章链接的数据（使用相对路径）
  const postLinks = posts.map(post => {
    // 移除域名，只保留路径部分
    return '/' + post.path;
  });

  // 生成JavaScript文件
  const jsContent = `window.randomPostsPaths = ${JSON.stringify(postLinks)};`;

  return {
    path: 'js/random-posts.js',
    data: jsContent
  };
});
