// SEO 調整：控制哪些頁面進 Google 索引、哪些文字可以被當成搜尋摘要

// 標籤／分類／文章列表頁只是文章清單，沒有自己的內容，不需要出現在搜尋結果。
// noindex 讓 Google 不收錄，follow 讓它照樣沿著清單上的連結去爬文章。
const NOINDEX = '<meta name="robots" content="noindex, follow">';
['tag', 'category', 'archive'].forEach(type => {
  hexo.extend.injector.register('head_end', NOINDEX, type);
});

// 側欄（作者資訊、目錄）、行動版側欄、頁尾每一頁都一樣，
// 加上 data-nosnippet 後 Google 就不會拿這些文字當搜尋結果的描述。
// data-nosnippet 只在 div / span / section 上有效，所以加在 aside / footer 裡面的 div。
// （網站統計 widget 是自己寫在 _config.reimu.yml 的，直接在那邊加。）
hexo.extend.filter.register('after_render:html', str => {
  return str.replace(
    /<div (class="sidebar-wrapper-container[ "]|class="sidebar-wrap"|id="footer-info")/g,
    '<div data-nosnippet $1'
  );
});
