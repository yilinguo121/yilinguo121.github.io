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
    // 計算中文字符和英文單詞
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
    return total + chineseChars + englishWords;
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
