// 網站統計功能 - 生成統計數據JS文件
hexo.extend.generator.register('site-stats-data', function(locals) {
  const posts = locals.posts.filter(post => post.published).data;

  // 計算文章數目
  const postCount = posts.length;

  // 計算總字數
  const totalWords = posts.reduce((total, post) => {
    const content = post.content || '';
    // 移除 HTML 標籤
    const text = content.replace(/<[^>]+>/g, '');
    // 移除所有空白字符（空格、換行、制表符等）
    const textWithoutSpaces = text.replace(/\s+/g, '');
    // 計算所有字符（包括中文、英文、數字、標點符號等）
    return total + textWithoutSpaces.length;
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
