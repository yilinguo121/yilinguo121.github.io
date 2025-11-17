const fs = require('fs');
const path = require('path');

const langFile = path.join(__dirname, '../node_modules/hexo-theme-reimu/languages/zh-TW.yml');

if (fs.existsSync(langFile)) {
  let content = fs.readFileSync(langFile, 'utf8');
  content = content.replace(/^archive_a: 彙整$/m, 'archive_a: 文章');
  content = content.replace(/^archive_b: 彙整：%s$/m, 'archive_b: 文章：%s');
  content = content.replace(/^archives: 歸檔$/m, 'archives: 文章');
  fs.writeFileSync(langFile, content, 'utf8');
  console.log('✓ Theme language file patched successfully');
}
