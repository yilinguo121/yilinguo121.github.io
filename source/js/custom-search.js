(function() {
  let searchData = [];
  let searchOverlay, searchInput, searchResults;

  // 加載搜索數據
  function loadSearchData() {
    fetch('/search-data.json')
      .then(response => response.json())
      .then(data => {
        searchData = data;
        console.log('Search data loaded:', searchData.length, 'posts');
      })
      .catch(err => console.error('Failed to load search data:', err));
  }

  // 執行搜索
  function performSearch(query) {
    if (!query || query.length < 2) {
      searchResults.innerHTML = '<div class="search-no-result">請輸入至少 2 個字符</div>';
      return;
    }

    console.log('Searching for:', query, 'in', searchData.length, 'posts');
    const queryLower = query.toLowerCase();
    const results = searchData.filter(post => {
      return post.title.toLowerCase().includes(queryLower) ||
             post.content.toLowerCase().includes(queryLower) ||
             post.tags.some(tag => tag.toLowerCase().includes(queryLower)) ||
             post.categories.some(cat => cat.toLowerCase().includes(queryLower));
    });
    console.log('Found', results.length, 'results');

    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-no-result">沒有找到相關結果</div>';
      return;
    }

    let html = `<div class="search-result-count">找到 ${results.length} 個結果</div>`;
    results.forEach(post => {
      const titleHighlight = highlightText(post.title, query);
      const contentSnippet = getContextSnippet(post.content, query);
      html += `
        <div class="search-result-item">
          <a href="/${post.path}" class="search-result-title">${titleHighlight}</a>
          <div class="search-result-content">${contentSnippet}</div>
          <div class="search-result-meta">${post.date}</div>
        </div>
      `;
    });
    searchResults.innerHTML = html;

    // 渲染搜索結果中的數學公式並高亮關鍵字
    renderMath(query);
  }

  // HTML 轉義函數
  function escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // 高亮關鍵字（智能處理數學公式）
  function highlightText(text, query) {
    if (!text) return '';

    // 1. 提取並保護數學公式（分兩步：先處理 $$，再處理 $）
    const mathPlaceholders = [];
    let processedText = text;

    // 先替換 display math ($$...$$)
    processedText = processedText.replace(/\$\$[\s\S]*?\$\$/g, function(match) {
      const index = mathPlaceholders.length;
      mathPlaceholders.push(match);
      return `__MATH_PLACEHOLDER_${index}__`;
    });

    // 再替換 inline math ($...$)
    processedText = processedText.replace(/\$[\s\S]*?\$/g, function(match) {
      const index = mathPlaceholders.length;
      mathPlaceholders.push(match);
      return `__MATH_PLACEHOLDER_${index}__`;
    });

    // 2. 轉義普通文本中的 HTML 特殊字符
    processedText = escapeHtml(processedText);

    // 3. 高亮關鍵詞
    const escapedQuery = escapeRegExp(query);
    const regex = new RegExp(escapedQuery, 'gi');
    processedText = processedText.replace(regex, function(match) {
      return '<mark>' + match + '</mark>';
    });

    // 4. 還原數學公式
    // 使用 <script type="math/tex"> 標籤保護 LaTeX 語法
    processedText = processedText.replace(/__MATH_PLACEHOLDER_(\d+)__/g, function(match, index) {
      let formula = mathPlaceholders[parseInt(index)];

      // 判斷是 display math 還是 inline math
      const isDisplay = formula.startsWith('$$');

      // 移除外層的 $ 或 $$
      let latex = isDisplay ? formula.slice(2, -2) : formula.slice(1, -1);

      // 使用 script 標籤包裹，這樣 HTML 解析器不會破壞內容
      // 注意：不在這裡高亮，等渲染後再高亮
      const scriptType = isDisplay ? 'math/tex; mode=display' : 'math/tex';
      return `<script type="${scriptType}">${latex}</script>`;
    });

    return processedText;
  }

  // 獲取包含關鍵字的上下文片段（智能處理數學公式邊界）
  function getContextSnippet(content, query) {
    if (!content) return '（無內容預覽）';

    const queryLower = query.toLowerCase();
    const contentLower = content.toLowerCase();

    // 找到所有匹配位置
    const matches = [];
    let index = contentLower.indexOf(queryLower);

    while (index !== -1) {
      matches.push(index);
      index = contentLower.indexOf(queryLower, index + 1);
    }

    if (matches.length === 0) {
      // 如果內容中沒有關鍵字，顯示文章開頭
      const preview = content.substring(0, 160);
      return preview + (content.length > 160 ? '...' : '');
    }

    // 顯示第一個匹配的上下文
    const contextLength = 80;
    const firstMatch = matches[0];
    let start = Math.max(0, firstMatch - contextLength);
    let end = Math.min(content.length, firstMatch + query.length + contextLength);

    // 調整邊界以避免截斷數學公式
    start = adjustBoundaryForMath(content, start, 'start');
    end = adjustBoundaryForMath(content, end, 'end');

    let snippet = content.substring(start, end);

    // 如果不是從開頭開始，加上省略號
    if (start > 0) snippet = '...' + snippet;
    if (end < content.length) snippet = snippet + '...';

    // 高亮所有關鍵字（包括片段中的所有出現）
    return highlightText(snippet, query);
  }

  // 調整邊界以避免截斷數學公式（簡化可靠版本）
  function adjustBoundaryForMath(text, position, type) {
    // 找出所有數學公式的位置（分兩步：先找 $$，再找 $）
    const mathRanges = [];
    let tempText = text;
    const replacements = [];

    // 先找所有 display math ($$...$$)
    let match;
    const displayRegex = /\$\$[\s\S]*?\$\$/g;
    while ((match = displayRegex.exec(text)) !== null) {
      mathRanges.push({
        start: match.index,
        end: match.index + match[0].length
      });
      // 用佔位符替換，避免被 inline math 的正則匹配
      replacements.push({
        start: match.index,
        length: match[0].length
      });
    }

    // 替換已找到的 display math，避免干擾
    for (let i = replacements.length - 1; i >= 0; i--) {
      const r = replacements[i];
      tempText = tempText.substring(0, r.start) + '_'.repeat(r.length) + tempText.substring(r.start + r.length);
    }

    // 再找所有 inline math ($...$)
    const inlineRegex = /\$[\s\S]*?\$/g;
    while ((match = inlineRegex.exec(tempText)) !== null) {
      mathRanges.push({
        start: match.index,
        end: match.index + match[0].length
      });
    }

    if (type === 'start') {
      // 檢查 position 是否在某個公式內部或緊鄰公式
      for (const range of mathRanges) {
        if (position >= range.start && position < range.end) {
          // 在公式內部或開頭，返回公式開始位置
          return range.start;
        }
      }
    } else if (type === 'end') {
      // 檢查 position 是否在某個公式內部或緊鄰公式
      for (const range of mathRanges) {
        if (position > range.start && position <= range.end) {
          // 在公式內部或結尾，返回公式結束位置
          return range.end;
        }
      }
    }

    return position;
  }

  // 轉義正則表達式特殊字符
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // 渲染數學公式
  function renderMath(query) {
    // 處理 script type="math/tex" 標籤
    const mathScripts = searchResults.querySelectorAll('script[type^="math/tex"]');

    if (typeof katex !== 'undefined') {
      // 使用 KaTeX 手動渲染每個公式
      mathScripts.forEach(script => {
        const latex = script.textContent;
        const isDisplay = script.type === 'math/tex; mode=display';

        const span = document.createElement('span');
        try {
          katex.render(latex, span, {
            displayMode: isDisplay,
            throwOnError: false
          });
          script.parentNode.replaceChild(span, script);

          // 在渲染後的公式中高亮關鍵字
          if (query) {
            highlightInRenderedMath(span, query);
          }
        } catch (e) {
          console.log('KaTeX render error:', e);
        }
      });
    } else if (typeof renderMathInElement !== 'undefined') {
      // 使用 KaTeX 自動渲染功能
      try {
        renderMathInElement(searchResults, {
          delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false}
          ],
          throwOnError: false
        });
      } catch (e) {
        console.log('KaTeX render error:', e);
      }
    } else if (typeof MathJax !== 'undefined') {
      // 如果使用 MathJax
      try {
        MathJax.typesetPromise([searchResults]);
      } catch (e) {
        console.log('MathJax render error:', e);
      }
    }
  }

  // 在已渲染的數學公式中高亮關鍵字
  function highlightInRenderedMath(element, query) {
    if (!query) return;

    const escapedQuery = escapeRegExp(query);
    const regex = new RegExp(escapedQuery, 'gi');

    // 遍歷所有文本節點
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node);
    }

    textNodes.forEach(textNode => {
      const text = textNode.textContent;
      if (regex.test(text)) {
        const span = document.createElement('span');
        span.innerHTML = text.replace(regex, match => '<mark>' + match + '</mark>');
        textNode.parentNode.replaceChild(span, textNode);
      }
    });
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
