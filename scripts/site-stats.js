// 網站統計功能 - 生成統計數據JS文件
hexo.extend.generator.register('site-stats-data', function(locals) {
  const posts = locals.posts.filter(post => post.published).data;

  // 計算文章數目
  const postCount = posts.length;

  // 計算總字數
  const totalWords = posts.reduce((total, post) => {
    // 使用原始 markdown 內容，而不是渲染後的 HTML
    const content = post._content || post.raw || post.content || '';
    // 移除代碼塊（包括 ``` 和縮進代碼）
    let text = content.replace(/```[\s\S]*?```/g, '');
    text = text.replace(/`[^`]+`/g, '');
    // 移除圖片語法 ![](url)
    text = text.replace(/!\[.*?\]\(.*?\)/g, '');
    // 移除鏈接 URL 部分 [text](url) -> [text]
    text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    // 移除 markdown 標記符號
    text = text.replace(/[#*_\->`]/g, '');
    // 移除所有空白字符（空格、換行、制表符等）
    text = text.replace(/\s+/g, '');
    // 計算所有字符
    return total + text.length;
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
