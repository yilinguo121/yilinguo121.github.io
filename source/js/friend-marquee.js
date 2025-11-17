(function() {
  // 從頁面中提取友鏈數據
  function extractFriendData() {
    const friendItems = document.querySelectorAll('.friend-item-wrap');
    console.log('Found', friendItems.length, 'friend items');

    const friends = [];
    friendItems.forEach(item => {
      const link = item.querySelector('a');
      const img = item.querySelector('.friend-icon img');
      const name = item.querySelector('.friend-name');
      const desc = item.querySelector('.friend-desc');

      if (link && img && name) {
        const friendData = {
          name: name.textContent.trim(),
          url: link.href,
          desc: desc ? desc.textContent.trim() : '',
          // 使用 data-src 或 src，因為圖片可能使用了懶加載
          image: img.getAttribute('data-src') || img.src
        };
        console.log('Extracted friend:', friendData);
        friends.push(friendData);
      }
    });

    return friends;
  }

  // 初始化跑馬燈
  function initMarquee() {
    const friendWrap = document.querySelector('.friend-wrap');
    if (!friendWrap) {
      console.log('friend-wrap not found');
      return;
    }

    // 從頁面提取友鏈數據
    const friends = extractFriendData();
    if (friends.length === 0) {
      console.log('No friends found');
      return;
    }

    // 創建跑馬燈容器
    const marqueeContainer = document.createElement('div');
    marqueeContainer.className = 'friend-marquee-container';

    // 創建兩排跑馬燈
    const row1 = createMarqueeRow(friends, 'row1');
    const row2 = createMarqueeRow(friends, 'row2');

    marqueeContainer.appendChild(row1);
    marqueeContainer.appendChild(row2);

    // 插入到友鏈容器前面
    friendWrap.insertBefore(marqueeContainer, friendWrap.firstChild);

    console.log('Marquee container created and inserted successfully');
  }

  // 創建一排跑馬燈
  function createMarqueeRow(data, rowClass) {
    const row = document.createElement('div');
    row.className = `friend-marquee-row ${rowClass}`;

    const track = document.createElement('div');
    track.className = 'friend-marquee-track';

    // 重複朋友列表多次以創造無縫滾動效果
    const repeatTimes = 5; // 重複5次確保足夠長
    for (let i = 0; i < repeatTimes; i++) {
      data.forEach(friend => {
        const item = createMarqueeItem(friend);
        track.appendChild(item);
      });
    }

    row.appendChild(track);
    return row;
  }

  // 創建單個跑馬燈項目
  function createMarqueeItem(friend) {
    const item = document.createElement('a');
    item.className = 'friend-marquee-item';
    item.href = friend.url;
    item.target = '_blank';
    item.rel = 'noopener noreferrer';

    const img = document.createElement('img');
    // 直接使用 src 而不是 data-src，避免懶加載問題
    img.src = friend.image;
    img.alt = friend.name;
    img.loading = 'eager'; // 立即加載圖片

    console.log('Creating marquee item for', friend.name, 'with image:', friend.image);

    img.onload = function() {
      console.log('Image loaded successfully:', friend.name);
    };

    img.onerror = function(e) {
      console.error('Failed to load image for', friend.name, ':', friend.image, e);
      // 如果圖片加載失敗，嘗試使用備用圖片
      if (this.src !== '/avatar/avatar.webp') {
        this.src = '/avatar/avatar.webp';
      }
    };

    const name = document.createElement('div');
    name.className = 'friend-marquee-name';
    name.textContent = friend.name;

    item.appendChild(img);
    item.appendChild(name);

    return item;
  }

  // 頁面加載完成後初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMarquee);
  } else {
    initMarquee();
  }
})();
