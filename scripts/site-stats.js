// 網站統計功能 - 生成統計數據JS文件
hexo.extend.generator.register('site-stats-data', function(locals) {
  const posts = locals.posts.filter(post => post.published).data;

  // 計算文章數目
  const postCount = posts.length;

  // 計算總字數 - 使用 Hexo 已經計算好的字數
  const totalWords = posts.reduce((total, post) => {
    // 使用 hexo-word-counter 插件計算的字數
    const wordCount = post.symbolsCount || post.length || 0;
    return total + wordCount;
  }, 0);

  // 格式化字數（14.4k 格式）
  let formattedWords;
  if (totalWords >= 1000) {
    formattedWords = (totalWords / 1000).toFixed(1) + 'k';
  } else {
    formattedWords = totalWords.toString();
  }

  // 生成JavaScript文件
  const jsContent = `window.siteStats = {
  postCount: ${postCount},
  totalWords: '${formattedWords}',
  siteStartDate: '2025-09-08' // 建站日期
};`;

  return {
    path: 'js/site-stats.js',
    data: jsContent
  };
});
