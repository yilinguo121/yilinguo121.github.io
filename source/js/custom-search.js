(function() {
  let searchData = [];
  let searchOverlay, searchInput, searchResults;

  // 加載搜索數據
  function loadSearchData() {
    fetch('/search-data.json')
      .then(response => response.json())
      .then(data => {
        searchData = data;
      })
      .catch(err => console.error('Failed to load search data:', err));
  }

  // 執行搜索
  function performSearch(query) {
    if (!query || query.length < 2) {
      searchResults.innerHTML = '<div class="search-no-result">請輸入至少 2 個字符</div>';
      return;
    }

    const queryLower = query.toLowerCase();
    const results = searchData.filter(post => {
      return post.title.toLowerCase().includes(queryLower) ||
             post.content.toLowerCase().includes(queryLower) ||
             post.tags.some(tag => tag.toLowerCase().includes(queryLower)) ||
             post.categories.some(cat => cat.toLowerCase().includes(queryLower));
    });

    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-no-result">沒有找到相關結果</div>';
      return;
    }

    let html = `<div class="search-result-count">找到 ${results.length} 個結果</div>`;
    results.forEach(post => {
      const titleHighlight = highlightText(post.title, query);
      const contentHighlight = highlightText(post.content, query);
      html += `
        <div class="search-result-item">
          <a href="/${post.path}" class="search-result-title">${titleHighlight}</a>
          <div class="search-result-content">${contentHighlight}</div>
          <div class="search-result-meta">${post.date}</div>
        </div>
      `;
    });
    searchResults.innerHTML = html;
  }

  // 高亮關鍵字
  function highlightText(text, query) {
    if (!text) return '';
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  // 初始化搜索界面
  function initSearch() {
    // 創建搜索覆蓋層
    const overlay = document.createElement('div');
    overlay.id = 'custom-search-overlay';
    overlay.className = 'custom-search-overlay';
    overlay.innerHTML = `
      <div class="custom-search-container">
        <div class="custom-search-header">
          <img src="/images/Search_Icon.svg" class="custom-search-icon" alt="搜索">
          <input type="text" id="custom-search-input" class="custom-search-input" placeholder="搜索文章..." autocomplete="off">
          <button class="custom-search-close" id="custom-search-close">×</button>
        </div>
        <div id="custom-search-results" class="custom-search-results"></div>
      </div>
    `;
    document.body.appendChild(overlay);

    searchOverlay = overlay;
    searchInput = document.getElementById('custom-search-input');
    searchResults = document.getElementById('custom-search-results');

    // 綁定事件
    document.getElementById('custom-search-close').addEventListener('click', closeSearch);
    searchOverlay.addEventListener('click', function(e) {
      if (e.target === searchOverlay) closeSearch();
    });

    searchInput.addEventListener('input', function(e) {
      performSearch(e.target.value);
    });

    // ESC 關閉搜索
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
        closeSearch();
      }
    });

    // Ctrl+K 或 Cmd+K 開啟搜索
    document.addEventListener('keydown', function(e) {
      // 使用小寫 k 和大寫 K 都可以
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        e.stopPropagation();
        if (searchOverlay.classList.contains('active')) {
          closeSearch();
        } else {
          openSearch();
        }
        return false;
      }
    }, true);
  }

  function openSearch() {
    searchOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => searchInput.focus(), 100);
  }

  function closeSearch() {
    searchOverlay.classList.remove('active');
    document.body.style.overflow = '';
    searchInput.value = '';
    searchResults.innerHTML = '';
  }

  // 添加搜索按鈕到導航欄
  function addSearchButton() {
    const subNav = document.getElementById('sub-nav');
    if (subNav) {
      const searchBtn = document.createElement('a');
      searchBtn.id = 'nav-custom-search-btn';
      searchBtn.className = 'nav-icon';
      searchBtn.title = '搜索';
      searchBtn.href = 'javascript:void(0);';
      searchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openSearch();
      });
      subNav.insertBefore(searchBtn, subNav.firstChild);
    }
  }

  // 初始化
  document.addEventListener('DOMContentLoaded', function() {
    loadSearchData();
    initSearch();
    addSearchButton();
  });
})();
