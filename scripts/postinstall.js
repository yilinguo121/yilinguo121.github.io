const fs = require('fs');
const path = require('path');

// Patch language file
const langFile = path.join(__dirname, '../node_modules/hexo-theme-reimu/languages/zh-TW.yml');

if (fs.existsSync(langFile)) {
  let content = fs.readFileSync(langFile, 'utf8');
  content = content.replace(/^archive_a: 彙整$/m, 'archive_a: 文章');
  content = content.replace(/^archive_b: 彙整：%s$/m, 'archive_b: 文章：%s');
  content = content.replace(/^archives: 歸檔$/m, 'archives: 文章');
  fs.writeFileSync(langFile, content, 'utf8');
  console.log('✓ Theme language file patched successfully');
}

// Patch header.ejs to use mask-image for icons
const headerFile = path.join(__dirname, '../node_modules/hexo-theme-reimu/layout/_partial/header.ejs');

if (fs.existsSync(headerFile)) {
  let content = fs.readFileSync(headerFile, 'utf8');

  // Replace main navigation <img> tags with <span> tags that use mask-image
  content = content.replace(
    /<img src="<%- url_for\(item\.icon, \{relative: false\}\) %>" alt="<%= item\.name %> icon" style="height: 1em;">/g,
    `<span class="nav-icon-img" style="mask-image: url('<%- url_for(item.icon, {relative: false}) %>'); -webkit-mask-image: url('<%- url_for(item.icon, {relative: false}) %>');" aria-label="<%= item.name %> icon"></span>`
  );

  // Replace sidebar <img> tags with <span> tags that use mask-image
  content = content.replace(
    /<img src="<%- url_for\(item\.icon, \{relative: false\}\) %>" alt="<%= item\.name %> icon" style="width: 1em;">/g,
    `<span class="nav-icon-img" style="mask-image: url('<%- url_for(item.icon, {relative: false}) %>'); -webkit-mask-image: url('<%- url_for(item.icon, {relative: false}) %>');" aria-label="<%= item.name %> icon"></span>`
  );

  fs.writeFileSync(headerFile, content, 'utf8');
  console.log('✓ Theme header.ejs patched successfully');
}

// Patch common-sidebar.ejs to use mask-image for icons
const sidebarFile = path.join(__dirname, '../node_modules/hexo-theme-reimu/layout/_partial/sidebar/common-sidebar.ejs');

if (fs.existsSync(sidebarFile)) {
  let content = fs.readFileSync(sidebarFile, 'utf8');

  // Replace sidebar <img> tags with <span> tags that use mask-image
  content = content.replace(
    /<img src="<%- url_for\(item\.icon, \{relative: false\}\) %>" alt="<%= item\.name %> icon" style="width: 1em;">/g,
    `<span class="nav-icon-img" style="mask-image: url('<%- url_for(item.icon, {relative: false}) %>'); -webkit-mask-image: url('<%- url_for(item.icon, {relative: false}) %>');" aria-label="<%= item.name %> icon"></span>`
  );

  fs.writeFileSync(sidebarFile, content, 'utf8');
  console.log('✓ Theme common-sidebar.ejs patched successfully');
}
