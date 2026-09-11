// 網站統計功能 - 生成統計數據JS文件
hexo.extend.generator.register('site-stats-data', function(locals) {
  // 這個 generator 不在 hide_posts 的 blocklist，所以 locals.posts 會包含隱藏的系列子頁
  const posts = locals.posts.filter(post => post.published).data;

  // 文章數目只算會出現在列表上的文章，系列子頁不另外計為一篇
  const postCount = posts.filter(post => post.hidden !== true).length;

  // 字數優先用 hexo-word-counter 算好的 length，沒有就退回自行計算
  const wordsOf = (post) => {
    if (typeof post.length === 'number') return post.length;
    if (!post.content) return 0;
    return post.content.replace(/<[^>]+>/g, '').replace(/\s+/g, '').length;
  };

  // 總字數要含系列子頁，否則拆頁後字數會憑空消失
  const totalWords = posts.reduce((total, post) => total + wordsOf(post), 0);

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
