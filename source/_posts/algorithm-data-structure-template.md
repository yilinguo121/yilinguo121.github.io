---
title: 演算法、資料結構模板
date: 2026-02-21
updated: 2026-02-21
categories: [競程]
tags: [演算法, 資料結構, C++, 模板]
description: 競程常用演算法與資料結構的 C++ 模板整理，涵蓋 BIT、線段樹、DSU、Dijkstra、DP、貪心、二分搜等。
toc: true
comments: true
---

## 基礎模板

```cpp
#include <bits/stdc++.h>
using namespace std;
#define IO ios::sync_with_stdio(0), cin.tie(0), cout.tie(0);
#define int long long
const long long INF = numeric_limits<int>::max();
const long long mod = 1000000007;
signed main() {
	IO

}
```

---

## 資料結構

### BIT (Fenwick Tree / 樹狀數組)

**用途**：支援單點修改、前綴和查詢的資料結構。
**複雜度**：修改 $O(\log n)$、查詢 $O(\log n)$。

```cpp
struct BIT {
	int n;
	vector<int> tree;
	vector<int> v;       // v[i] 記錄位置 i 的原始值
	BIT (int n = 0) : n(n), tree(n + 1, 0), v(n + 1, 0) {}
	void upd(int i, int x) {                       // 位置 i 加上 x
		v[i] += x;
		for (;i <= n;i += i & -i) tree[i] += x;
	}
	int get(int i) {                                // 查詢前綴和 [1, i]
		int s = 0;
		for (;i > 0;i -= i & -i) s += tree[i];
		return s;
	}
	int sum(int l, int r) {return get(r) - get(l - 1);}  // 區間和 [l, r]
};
```

用法：

```cpp
BIT bit(n);
bit.upd(i, x);        // 位置 i 加上 x
bit.sum(l, r);         // 查詢區間 [l, r] 的和
```

單點覆蓋（把位置 x 的值改成 y）：

```cpp
bit.upd(x, -bit.v[x]);  // 先扣掉舊值
bit.upd(x, y);           // 再加上新值
```

簡化版 BIT（不需記錄原值，適合只做加法的場景）：

```cpp
struct BIT {
	int n;
	vector<int> tree;
	BIT (int n = 0) : n(n), tree(n + 1, 0) {}
	void upd(int i, int x = 1) {for (;i <= n;i += i & -i) tree[i] += x;}
	int get(int i) {
		int s = 0;
		for (;i > 0;i -= i & -i) s += tree[i];
		return s;
	}
	int sum(int l, int r) {return get(r) - get(l - 1);}
};
```

### Segment Tree (線段樹 - 迭代式)

**用途**：支援單點修改、區間查詢的資料結構。比 BIT 更泛用（可處理 min/max/sum 等）。
**複雜度**：建樹 $O(n)$、修改 $O(\log n)$、查詢 $O(\log n)$。

以下為區間最小值查詢 + 單點修改版本：

```cpp
struct segment_tree {
	int sz;              // 葉節點數量（補到 2 的冪次）
	vector<int> t;       // t[1] 為根，t[sz..2*sz-1] 為葉節點
	segment_tree(int n = 0) {init(n);}
	void init(int n) {
		for (sz = 1;sz < n;sz *= 2);       // sz 為 >= n 的最小 2 冪次
		t.assign(2 * sz, INF);              // 初始化為單位元素
	}
	void build(vector<int> &v) {
		for (int i = 0;i < v.size();i++) t[sz + i] = v[i];               // 填入葉節點
		for (int i = sz - 1;i > 0;i--) t[i] = min(t[i * 2], t[(i * 2) | 1]);  // 自底向上合併
	}
	void upd(int x, int k) {               // 把位置 x 的值改成 k（1-indexed）
		int i = sz + x - 1;
		t[i] = k;
		for (i /= 2;i > 0;i /= 2) t[i] = min(t[i * 2], t[(i * 2) | 1]);
	}
	int ask(int l, int r) {                 // 查詢 [l, r] 的最小值（1-indexed）
		int ans = INF;
		for (l = sz + l - 1, r = sz + r - 1;l <= r;l /= 2, r /= 2) {
			if (l & 1) ans = min(ans, t[l++]);        // l 是右子 -> 單獨計入，l 右移
			if (!(r & 1)) ans = min(ans, t[r--]);     // r 是左子 -> 單獨計入，r 左移
		}
		return ans;
	}
};
```

用法：

```cpp
segment_tree st(n);
st.build(v);           // 用陣列 v 建樹（v 為 0-indexed）
st.upd(x, k);         // 把位置 x 的值改成 k（1-indexed）
st.ask(l, r);          // 查詢區間 [l, r] 的最小值（1-indexed）
```

> 改成區間和：把所有 `min` 改成 `+`，初始值 `INF` 改成 `0`。

### Sparse Table (稀疏表)

**用途**：靜態陣列上 O(1) 回答區間 min/max 查詢（不支援修改）。
**複雜度**：建表 $O(n \log n)$、查詢 $O(1)$。

利用兩個有重疊的區間取 max/min 結果仍正確的性質（冪等性），可以 $O(1)$ 查詢。

```cpp
// 建表：st[i][j] = 從位置 i 開始、長度 2^j 的區間最大值
vector<vector<int>> st(m, vector<int>(20));
for (int i = 0;i < m;i++) st[i][0] = v[i];
for (int j = 1;j < 20;j++)
	for (int i = 0;i + (1 << j) - 1 < m;i++)
		st[i][j] = max(st[i][j - 1], st[i + (1 << (j - 1))][j - 1]);

// 查詢 [l, r] 的最大值（0-indexed）
int lg = log2(r - l + 1);
int ans = max(st[l][lg], st[r - (1 << lg) + 1][lg]);
```

### DSU (Disjoint Set Union / 並查集)

**用途**：維護不相交集合的合併與查詢，常用於判斷連通性。
**複雜度**：均攤 $O(\alpha(n)) \approx O(1)$。

基本版（含路徑壓縮 + 啟發式合併）：

```cpp
struct DSU {
	vector<int> p, sz;          // p[i] = i 的父節點，sz[i] = i 所在集合大小
	DSU (int n = 0) {init(n);}
	void init(int x) {
		p.resize(x);
		sz.assign(x, 1);
		for (int i = 0;i < x;i++) p[i] = i;   // 初始時每個元素是自己的根
	}
	int find(int x) {
		return (p[x] == x ? x : p[x] = find(p[x]));   // 路徑壓縮
	}
	bool unite(int a, int b) {
		a = find(a), b = find(b);
		if (a == b) return 0;           // 已在同一集合
		if (sz[a] < sz[b]) swap(a, b); // 小的接到大的下面
		p[b] = a;
		sz[a] += sz[b];
		return 1;
	}
};
```

附帶連通分量數 + 最大分量大小（適合需要即時查詢這些資訊的場景）：

```cpp
struct DSU {
	vector<int> p, sz;
	int mx, cnt;            // mx = 最大集合大小，cnt = 集合數量
	DSU (int n = 0) {init(n);}
	void init(int x) {
		cnt = x;
		mx = 1;
		p.resize(x);
		sz.assign(x, 1);
		for (int i = 0;i < x;i++) p[i] = i;
	}
	int find(int x) {
		return (p[x] == x ? x : p[x] = find(p[x]));
	}
	void unite(int a, int b) {
		a = find(a), b = find(b);
		if (a == b) return;
		if (sz[a] < sz[b]) swap(a, b);
		p[b] = a;
		sz[a] += sz[b];
		mx = max(mx, sz[a]);
		cnt--;
	}
};
```

不帶路徑壓縮版（需要可撤銷 / rollback 時使用，搭配啟發式合併仍為 $O(\log n)$）：

```cpp
int find(int x) {
	if (p[x] == x) return x;
	return find(p[x]);     // 不做 p[x] = find(p[x])，因此可以撤銷
}
```

### Monotone Stack (單調棧)

**用途**：在 O(n) 內找到每個元素左/右邊第一個比它大或小的元素。
**複雜度**：$O(n)$（每個元素最多入棧出棧各一次）。

找每個元素左邊第一個比它小的位置（v 存的是下標，棧底放哨兵 0）：

```cpp
vector<int> v, a(n + 1);
v.push_back(0);                     // 哨兵，代表「沒有更小的」
for (int i = 1;i <= n;i++) {
	cin >> a[i];
	while (v.size() > 1 and a[i] <= a[v.back()]) v.pop_back();  // 彈出不再有用的
	cout << v.back() << ' ';        // v.back() 就是左邊第一個 < a[i] 的位置
	v.push_back(i);
}
```

最大矩形面積（histogram）- 雙 pass：對每個柱子找左右邊界，再算面積。

```cpp
vector<int> h(m), l(m), r(m);       // h = 高度，l[j] = 左邊第一個 < h[j] 的位置
vector<int> st;
// 左邊界
for (int j = 0;j < m;j++) {
	while (!st.empty() and h[j] <= h[st.back()]) st.pop_back();
	l[j] = (st.empty() ? -1 : st.back());
	st.push_back(j);
}
st.clear();
// 右邊界
for (int j = m - 1;j >= 0;j--) {
	while (!st.empty() and h[j] < h[st.back()]) st.pop_back();
	r[j] = (st.empty() ? n : st.back());
	st.push_back(j);
}
// 計算面積：以 h[j] 為高度，寬度 = r[j] - l[j] - 1（開區間）
for (int j = 0;j < m;j++) ans = max(ans, 1ll * h[j] * (r[j] - l[j]));
```

最大矩形面積（histogram）- 單 pass（在右端點處結算）：

```cpp
vector<int> v, a(n + 2);            // a[n+1] = 0 作為結尾哨兵
v.push_back(0);                     // 底部哨兵
int ans = 0;
for (int i = 1;i <= n + 1;i++) {
	if (i <= n) cin >> a[i];
	while (v.size() > 0 and a[i] < a[v.back()]) {
		int h = v.back();            // 被彈出的柱子（以它為高度）
		v.pop_back();
		ans = max(ans, (i - v.back() - 1) * a[h]);   // 寬度 = i - 左邊界 - 1
	}
	v.push_back(i);
}
```

### Monotone Deque (單調雙端佇列)

**用途**：在滑動視窗中 O(1) 查詢最大/最小值。
**複雜度**：整體 $O(n)$。

滑動視窗最小值（視窗大小在 [a, b] 之間）：

```cpp
deque<int> q;                        // 存下標，隊列中的值單調遞增
int ans = -INF;
for (int r = a;r <= n;r++) {
	int i = r - a;                   // 新進入視窗的元素
	while (!q.empty() and x[i] <= x[q.back()]) q.pop_back();   // 維護遞增
	q.push_back(i);
	while (!q.empty() and q.front() < r - b) q.pop_front();    // 移除超出視窗的
	ans = max(ans, x[r] - x[q.front()]);    // q.front() 是視窗內最小值的位置
}
```

同時維護最大值和最小值（固定視窗大小 m）：

```cpp
deque<int> q, p;                     // q: 遞減隊列（max），p: 遞增隊列（min）
for (int i = 1;i <= n;i++) {
	while (!q.empty() and q.front() <= i - m) q.pop_front();   // 移除過期
	while (!p.empty() and p.front() <= i - m) p.pop_front();
	while (!q.empty() and h[q.back()] <= h[i]) q.pop_back();   // 維護遞減
	while (!p.empty() and h[p.back()] >= h[i]) p.pop_back();   // 維護遞增
	q.push_back(i);
	p.push_back(i);
	// 此時 h[q.front()] = 視窗最大值，h[p.front()] = 視窗最小值
}
```

---

## 圖論

### BFS (廣度優先搜尋)

**用途**：在無權圖上求最短路徑、探索連通分量。
**複雜度**：$O(V + E)$。

最短路徑 + 路徑回溯（從節點 1 到節點 n）：

```cpp
vector<vector<int>> v(n + 1);       // 鄰接表
vector<bool> vis(n + 1);            // 是否拜訪過
vector<int> pa(n + 1);              // pa[x] = x 的前一個節點（用於回溯路徑）
queue<int> q;
vis[1] = 1;
q.push(1);
while (!q.empty()) {
	int t = q.front();
	q.pop();
	for (auto x : v[t]) {
		if (!vis[x]) {
			q.push(x);
			vis[x] = 1;
			pa[x] = t;
		}
	}
}
// 從終點回溯路徑
vector<int> ans;
int now = n;
while (now) {
	ans.push_back(now);
	now = pa[now];
}
reverse(ans.begin(), ans.end());
```

網格 BFS（上下左右四方向）：

```cpp
int dx[4] = {0, 0, 1, -1};
int dy[4] = {1, -1, 0, 0};
queue<pair<int, int>> q;
q.push({si, sj});                   // 起點座標
vis[si][sj] = 1;
while (!q.empty()) {
	auto [x, y] = q.front();
	q.pop();
	for (int k = 0;k < 4;k++) {
		int nx = x + dx[k];
		int ny = y + dy[k];
		if (nx < 0 or ny < 0 or nx >= n or ny >= m) continue;   // 越界
		if (vis[nx][ny] or a[nx][ny] != '.') continue;           // 已訪問或障礙
		q.push({nx, ny});
		vis[nx][ny] = 1;
	}
}
```

### 0-1 BFS

**用途**：邊權只有 0 和 1 時的最短路，用 deque 取代 priority_queue。
**複雜度**：$O(V + E)$（比 Dijkstra 的 $O(E \log V)$ 快）。

權重 0 的邊放隊首（push_front），權重 1 的邊放隊尾（push_back）：

```cpp
deque<tuple<int, int, int>> q;       // {節點, 距離, 狀態}
q.push_back({start, 0, init_state});
while (!q.empty()) {
	auto [x, l, t] = q.front();
	q.pop_front();
	// 花費 0 的轉移 -> push_front（保持隊列的距離單調性）
	if (/* 0-cost transition */) {
		q.push_front({x, l, !t});
	}
	// 花費 1 的轉移 -> push_back
	for (auto i : v[t][x]) {
		if (vis.count({i, t})) continue;
		vis[{i, t}] = 1;
		q.push_back({i, l + 1, t});
	}
}
```

### DFS (深度優先搜尋)

**用途**：圖的遍歷、連通分量計數、環偵測、拓撲排序等。
**複雜度**：$O(V + E)$。

連通分量計數（網格版，每個連通區域呼叫一次 dfs）：

```cpp
int dx[4] = {0, 0, 1, -1};
int dy[4] = {1, -1, 0, 0};
void dfs(int x, int y) {
	vis[x][y] = 1;
	for (int k = 0;k < 4;k++) {
		int nx = x + dx[k];
		int ny = y + dy[k];
		if (nx < 0 or ny < 0 or nx >= n or ny >= m) continue;
		if (vis[nx][ny] or a[nx][ny] == '#') continue;
		dfs(nx, ny);
	}
}
```

### Dijkstra (最短路徑)

**用途**：求單源最短路（邊權非負）。
**複雜度**：$O(E \log V)$。

```cpp
vector<vector<pair<int, int>>> v(n + 1);   // v[a] = {{b, w}, ...} 表示 a->b 權重 w
vector<int> dis(n + 1, INF);
dis[1] = 0;
// min-heap，{距離, 節點}
priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> q;
q.push({0, 1});
while (!q.empty()) {
	auto [w, t] = q.top();
	q.pop();
	if (w != dis[t]) continue;              // 已有更短路，跳過（懶刪除）
	for (auto [nt, nw] : v[t]) {
		if (dis[nt] > w + nw) {              // 鬆弛
			dis[nt] = w + nw;
			q.push({dis[nt], nt});
		}
	}
}
```

變體：同時記錄最短路數量、最少邊數、最多邊數：

```cpp
vector<int> dis(n + 1, INF), way(n + 1, 0), mn(n + 1, INF), mx(n + 1, 0);
dis[1] = mn[1] = 0, way[1] = 1;
// ... 在鬆弛時：
if (d + nd < dis[nt]) {             // 發現更短路
	dis[nt] = d + nd;
	way[nt] = way[t];               // 路徑數繼承
	mn[nt] = mn[t] + 1;
	mx[nt] = mx[t] + 1;
	q.push({d + nd, nt});
}
else if (d + nd == dis[nt]) {       // 等長路徑
	way[nt] = (way[t] + way[nt]) % mod;   // 路徑數累加
	mn[nt] = min(mn[nt], mn[t] + 1);
	mx[nt] = max(mx[nt], mx[t] + 1);
}
```

K-th 最短路（允許同一節點被拜訪多次，第 k 次到達即為第 k 短路）：

```cpp
priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> q;
vector<int> cnt(n + 1);             // cnt[t] = 節點 t 被拜訪的次數
q.push({0, 1});
while (!q.empty()) {
	auto [d, t] = q.top();
	q.pop();
	if (++cnt[t] > k) continue;     // 第 k+1 次以後不需要
	if (t == n) cout << d << ' ';   // 第 cnt[t] 次到達終點
	for (auto [nt, nd] : v[t]) q.push({d + nd, nt});
}
```

網格 Dijkstra（Trapping Rain Water 2D：從邊界開始，向內推水位高度）：

```cpp
priority_queue<tuple<int, int, int>, vector<tuple<int, int, int>>, greater<tuple<int, int, int>>> q;
// 先把邊界所有格子放入 heap
while (!q.empty()) {
	auto [h, x, y] = q.top();       // h = 目前的水位高度
	q.pop();
	for (int i = 0;i < 4;i++) {
		int nx = x + dx[i], ny = y + dy[i];
		if (nx < 0 or nx >= n or ny < 0 or ny >= m) continue;
		if (vis[nx][ny]) continue;
		vis[nx][ny] = 1;
		if (v[nx][ny] < h) ans += h - v[nx][ny];   // 可以蓄水
		q.push({max(h, v[nx][ny]), nx, ny});        // 水位取 max
	}
}
```

### Floyd-Warshall (全源最短路)

**用途**：求所有點對之間的最短路。適合節點數少（$n \leq 500$）的稠密圖。
**複雜度**：$O(n^3)$。

核心思想：$dis[i][j] = \min(dis[i][j],\ dis[i][k] + dis[k][j])$，依序考慮每個中繼點 $k$。

```cpp
const long long INF = numeric_limits<int>::max() / 2;   // 注意用 INF/2 避免溢位
vector<vector<int>> dis(n, vector<int>(n, INF));
for (int i = 0;i < n;i++) dis[i][i] = 0;
// 建圖：dis[a][b] = w
for (int k = 0;k < n;k++) {
	for (int i = 0;i < n;i++) {
		if (dis[i][k] == INF) continue;         // 剪枝：i 到 k 不通就跳過
		for (int j = 0;j < n;j++) {
			if (dis[k][j] == INF) continue;
			dis[i][j] = min(dis[i][j], dis[i][k] + dis[k][j]);
		}
	}
}
```

離線刪邊技巧：把刪邊反轉成加邊，每次加入新中繼點 $x$ 後用 $O(n^2)$ 更新：

```cpp
// 加入邊 (a[x], b[x]) 權重 w[x] 後，a[x] 和 b[x] 可作為新中繼點
for (int i = 0;i < n;i++) {
	for (int j = 0;j < n;j++) {
		dis[i][j] = min({dis[i][j], dis[i][a[x]] + w[x] + dis[b[x]][j], dis[i][b[x]] + w[x] + dis[a[x]][j]});
	}
}
```

### Topological Sort (拓撲排序 / Kahn's Algorithm)

**用途**：將 DAG（有向無環圖）的節點排成線性序列，使得所有邊都從前指向後。
**複雜度**：$O(V + E)$。

做法：反覆取出入度為 0 的節點。如果最終排序長度 ≠ n，代表圖有環。

```cpp
vector<vector<int>> v(n + 1);       // 鄰接表
vector<int> cnt(n + 1);             // cnt[i] = 節點 i 的入度
// 建圖時：v[a].push_back(b); cnt[b]++;
queue<int> q;
for (int i = 1;i <= n;i++) if (!cnt[i]) q.push(i);   // 入度 0 的先進隊
vector<int> ans;
while (!q.empty()) {
	int x = q.front();
	q.pop();
	ans.push_back(x);
	for (auto nx : v[x]) {
		cnt[nx]--;                   // 移除 x 後，nx 的入度減 1
		if (!cnt[nx]) q.push(nx);    // 入度變 0，可以排序了
	}
}
if (ans.size() != n) cout << "IMPOSSIBLE";   // 有環
```

DAG 上最長路徑（拓撲排序 + DP：在拓撲序上做 DP）：

```cpp
dp[1] = 1;                          // dp[i] = 到達 i 的最長路徑長
while (!q.empty()) {
	auto t = q.front();
	q.pop();
	for (auto nt : v[t]) {
		dp[nt] = max(dp[nt], dp[t] + 1);  // 或計數: dp[nt] = (dp[nt] + dp[t]) % mod;
		if (!--cnt[nt]) q.push(nt);
	}
}
```

### Kruskal (最小生成樹)

**用途**：找出連接所有節點的最小權重邊集合。
**複雜度**：$O(E \log E)$（瓶頸在排序）。

做法：將所有邊按權重排序，依序加入不會形成環的邊（用 DSU 判斷）。

```cpp
DSU dsu(n);
vector<tuple<int, int, int>> edges(m);   // {權重, 端點a, 端點b}
for (auto &[w, a, b] : edges) {
	cin >> a >> b >> w;
	a--, b--;
}
sort(edges.begin(), edges.end());        // 按權重排序
int cost = 0;
for (auto [w, a, b] : edges) if (dsu.unite(a, b)) cost += w;   // 不在同一集合才加
```

### LCA (最近公共祖先 - Binary Lifting)

**用途**：求樹上兩點的最近公共祖先，也可以算兩點距離。
**複雜度**：預處理 $O(n \log n)$、每次查詢 $O(\log n)$。

做法：`up[t][i]` = 節點 $t$ 往上跳 $2^i$ 步的祖先。先讓兩點跳到同一深度，再一起往上跳。

```cpp
vector<vector<int>> v, up;           // v = 鄰接表，up = 倍增表
vector<int> deep;                    // deep[i] = 節點 i 的深度
void dfs(int t, int p) {
	up[t][0] = p;                    // 父節點
	for (int i = 1;i < 20;i++) up[t][i] = up[up[t][i - 1]][i - 1];  // 倍增
	for (auto nt : v[t]) {
		if (nt == p) continue;
		deep[nt] = deep[t] + 1;
		dfs(nt, t);
	}
}
int lca(int a, int b) {
	if (deep[a] < deep[b]) swap(a, b);          // 確保 a 更深
	// 第一步：把 a 跳到跟 b 同深度
	for (int i = 0;i < 20;i++) if (((deep[a] - deep[b]) >> i) & 1) a = up[a][i];
	if (a == b) return a;                        // b 就是 LCA
	// 第二步：a, b 一起往上跳，找到 LCA 的正下方
	for (int i = 19;i >= 0;i--) if (up[a][i] != up[b][i]) a = up[a][i], b = up[b][i];
	return up[a][0];                             // 再跳一步就是 LCA
}
```

用法：

```cpp
v.resize(n + 1);
deep.resize(n + 1);
up.resize(n + 1, vector<int>(20));
dfs(1, 1);                          // 以 1 為根做 DFS
int dist = deep[a] - deep[lca(a, b)] + deep[b] - deep[lca(a, b)];   // 兩點距離
```

K-th Ancestor（查詢節點 start 的第 k 個祖先）：

```cpp
int x = start;
for (int i = 0;i < 20;i++) {
	if (k & (1 << i)) x = up[x][i];   // k 的二進位拆解，逐步跳
}
// x == 0 表示不存在（跳超過根了）
```

### Binary Lifting (倍增法 - 通用)

**用途**：在任意「下一步」函數上做倍增，快速跳 $k$ 步或找到滿足條件的最遠位置。
**複雜度**：預處理 $O(n \log n)$、每次查詢 $O(\log n)$。

```cpp
// up[i][j] = 從 j 出發跳 2^i 步到達的位置
vector<vector<int>> up(20, vector<int>(2 * n + 1, 2 * n));   // 2*n 作為「不存在」
up[0] = nxt;                         // nxt[j] = j 的下一步位置
for (int i = 1;i < 20;i++)
	for (int j = 0;j <= 2 * n;j++)
		up[i][j] = up[i - 1][up[i - 1][j]];   // 跳 2^i = 跳兩次 2^(i-1)
// 從 i 開始，跳最多步使得不超過 limit（貪心從大到小嘗試）
int now = i, cnt = 0;
for (int j = 19;j >= 0;j--)
	if (up[j][now] < limit) now = up[j][now], cnt += (1 << j);
```

### Bipartite Check (二分圖判定)

**用途**：判斷圖是否能二著色（即是否為二分圖）。
**複雜度**：$O(V + E)$。

做法：BFS 染色，相鄰節點必須不同色。若發現衝突則非二分圖。

```cpp
vector<int> color(n + 1);           // 0 = 未染色，1 / 2 = 兩種顏色
queue<int> q;
q.push(1);
color[1] = 1;
while (!q.empty()) {
	int t = q.front();
	q.pop();
	for (auto nt : v[t]) {
		if (color[nt] == color[t]) {         // 相鄰同色 -> 非二分圖
			cout << "IMPOSSIBLE";
			return 0;
		}
		if (color[nt]) continue;             // 已染色
		q.push(nt);
		color[nt] = 3 - color[t];           // 1 -> 2, 2 -> 1
	}
}
```

### Cycle Detection (環偵測)

**用途**：偵測圖中是否存在環，並找出環上的節點。

無向圖找環（DFS，用 parent 陣列回溯路徑）：

```cpp
vector<int> p(n + 1);               // p[x] = DFS 中 x 的父節點
void dfs(int x, int pa) {
	for (auto nx : v[x]) {
		if (nx == pa) continue;      // 不走回頭路
		if (p[nx]) {
			// 找到環：從 x 沿 p[] 回溯到 nx 即為環
			vector<int> ans = {nx};
			while (x != nx) {
				ans.push_back(x);
				x = p[x];
			}
			ans.push_back(nx);
			exit(0);
		}
		p[nx] = x;
		dfs(nx, x);
	}
}
```

有向圖找環（DFS + 回溯棧：vis2 記錄「目前正在 DFS 路徑上」的節點）：

```cpp
vector<bool> vis, vis2;             // vis = 全域已訪問，vis2 = 當前路徑上
vector<int> ans;                    // 當前 DFS 路徑
void dfs(int t) {
	vis[t] = 1;
	vis2[t] = 1;
	ans.push_back(t);
	for (auto nt : v[t]) {
		if (!vis[nt]) dfs(nt);
		else if (vis2[nt]) {
			// nt 在當前路徑上 -> 找到環（ans 中從 nt 到末尾就是環）
			exit(0);
		}
	}
	ans.pop_back();
	vis2[t] = 0;                    // 離開當前路徑
}
```

### Tree Diameter (樹直徑)

**用途**：找樹上距離最遠的兩點之間的距離。
**複雜度**：$O(n)$。

做法：從任意點 BFS 找最遠點 u，再從 u BFS 找最遠點 v，u-v 距離即為直徑。

```cpp
pair<int, int> bfs(int x) {         // 回傳 {最遠點, 最遠距離}
	vector<int> dis(n + 1), vis(n + 1);
	queue<int> q;
	q.push(x);
	vis[x] = 1;
	pair<int, int> ans = {0, 0};
	while (!q.empty()) {
		auto t = q.front();
		q.pop();
		for (auto nt : v[t]) {
			if (vis[nt]) continue;
			q.push(nt);
			vis[nt] = 1;
			dis[nt] = dis[t] + 1;
			if (dis[nt] > ans.second) ans = {nt, dis[nt]};
		}
	}
	return ans;
}
// 使用：先從 1 找最遠點，再從該點找直徑
// cout << bfs(bfs(1).first).second;
```

### Euler Tour (DFS 序)

**用途**：把樹壓平成一維陣列，使子樹對應到一段連續區間，搭配 BIT/線段樹做子樹查詢。
**複雜度**：$O(n)$。

```cpp
vector<int> in, out;                // in[t] = 進入時間戳，out[t] = 離開時間戳
int now = 0;
void dfs(int t, int d) {
	in[t] = ++now;                  // 進入 t
	for (auto nt : v[t]) dfs(nt, d + 1);
	out[t] = now;                   // 離開 t
}
// 節點 t 的子樹 = 區間 [in[t], out[t]]
```

### Subtree Size (子樹大小)

**用途**：算每個節點的子樹大小。
**複雜度**：$O(n)$。

```cpp
vector<int> vis(n + 1);             // vis[t] = t 的子樹中有多少個子孫
void dfs(int t) {
	for (auto nt : v[t]) {
		dfs(nt);
		vis[t] += vis[nt] + 1;      // 子孫數 = 所有兒子的子樹大小之和 + 兒子本身
	}
}
```

### DSU 離線刪邊 (反向加邊)

**用途**：需要刪邊的場景，因為 DSU 只支援合併，所以把操作反轉：先刪完再反向加回來。
**複雜度**：$O(m \cdot \alpha(n))$。

```cpp
DSU dsu(n);
vector<pair<int, int>> v(m);
for (auto &[x, y] : v) { cin >> x >> y; x--, y--; }
reverse(v.begin(), v.end());         // 反轉順序：最後刪的最先加
int now = n * (n - 1) / 2;          // 初始所有點都不連通時的某個值
vector<int> ans;
for (auto [x, y] : v) {
	ans.push_back(now);
	int px = dsu.find(x), py = dsu.find(y);
	if (px == py) continue;          // 已連通
	now -= dsu.sz[px] * dsu.sz[py];  // 合併後更新答案
	dsu.unite(px, py);
}
reverse(ans.begin(), ans.end());     // 反轉回正確順序
```

---

## 動態規劃

### 0/1 Knapsack (0/1 背包)

**用途**：$n$ 個物品各有重量和價值，每個最多選一次，求在重量限制 $x$ 內的最大總價值。
**複雜度**：$O(nx)$。
**狀態**：$dp[i][j]$ = 考慮前 $i$ 個物品、容量為 $j$ 時的最大價值。

```cpp
int dp[n + 1][x + 1] = {};
for (int i = 1;i <= n;i++) {
	for (int j = 0;j <= x;j++) {
		dp[i][j] = dp[i - 1][j];                    // 不選第 i 個
		if (j >= w[i]) {
			dp[i][j] = max(dp[i][j], dp[i - 1][j - w[i]] + v[i]);   // 選第 i 個
		}
	}
}
```

空間壓縮版（倒序遍歷確保每個物品只用一次）：

```cpp
vector<int> dp(x + 1);
while (n--) {
	int w, v;
	cin >> w >> v;
	for (int i = x;i >= w;i--) dp[i] = max(dp[i], dp[i - w] + v);
}
```

可行性背包（判斷哪些總和可達，用 bool 陣列）：

```cpp
vector<bool> dp(100001);
dp[0] = 1;                          // 總和 0 一定可達
for (int i = 0;i < n;i++) {
	for (int j = 100000;j >= v[i];j--) {
		dp[j] = (dp[j] or dp[j - v[i]]);
	}
}
```

### Unbounded Knapsack (完全背包)

**用途**：每個物品可以選無限次。
**複雜度**：$O(nx)$。
**差異**：正序遍歷（$dp[i][j - t]$ 引用同一列，代表可重複選）。

```cpp
dp[0][0] = 1;
for (int i = 1;i <= n;i++) {
	int t;
	cin >> t;
	for (int j = 0;j <= x;j++) {
		dp[i][j] = dp[i - 1][j];                    // 不選
		if (j >= t) dp[i][j] = (dp[i][j] + dp[i][j - t]) % mod;   // 選（可重複）
	}
}
```

### Coin Change (硬幣問題)

**用途**：用若干種面額的硬幣湊出目標金額。

方法數（排列：外層遍歷金額，內層遍歷硬幣 → 不同順序算不同方案）：

```cpp
vector<int> dp(k + 1);
dp[0] = 1;
for (int i = 1;i <= k;i++) {
	for (auto x : coins) {
		if (x > i) break;
		dp[i] = (dp[i] + dp[i - x]) % mod;
	}
}
```

最少硬幣數：

```cpp
vector<int> dp(k + 1, INF);
dp[0] = 0;
for (int i = 1;i <= k;i++) {
	for (auto x : coins) {
		if (x > i) break;
		dp[i] = min(dp[i], dp[i - x] + 1);
	}
}
```

### LIS (最長遞增子序列)

**用途**：找出陣列中最長的嚴格遞增子序列長度。
**複雜度**：$O(n \log n)$。

做法（patience sort）：維護一個遞增陣列 ans，新元素若大於尾端就 append，否則用 lower_bound 替換。

```cpp
vector<int> ans;                     // ans[i] = 長度為 i+1 的 LIS 的最小末尾值
while (n--) {
	int x;
	cin >> x;
	if (ans.empty() or x > ans.back()) ans.push_back(x);   // 延伸 LIS
	else *lower_bound(ans.begin(), ans.end(), x) = x;       // 替換，保持潛力
}
cout << ans.size();
```

multiset 版（適合需要求最長非遞增子序列等變體）：

```cpp
multiset<int> ans;
while (n--) {
	int x;
	cin >> x;
	auto it = ans.upper_bound(x);    // 找第一個 > x 的位置
	if (it == ans.end()) ans.insert(x);
	else {
		ans.erase(it);               // 替換掉它
		ans.insert(x);
	}
}
cout << ans.size();
```

### LCS (最長公共子序列)

**用途**：找兩個序列的最長公共子序列。
**複雜度**：$O(nm)$。
**狀態**：$dp[i][j]$ = $a$ 的前 $i$ 個字元和 $b$ 的前 $j$ 個字元的 LCS 長度。

```cpp
vector<vector<int>> dp(a.size() + 1, vector<int>(b.size() + 1));
for (int i = 1;i <= a.size();i++) {
	for (int j = 1;j <= b.size();j++) {
		if (a[i - 1] == b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;   // 匹配
		else dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);              // 不匹配
	}
}
```

回溯路徑（pa 記錄每一步的來源方向：1=左上, 2=上, 3=左）：

```cpp
string ans;
int i = a.size(), j = b.size();
while (i > 0 and j > 0) {
	if (pa[i][j] == 1) { ans += a[i - 1]; i--; j--; }   // 匹配，取字元
	else if (pa[i][j] == 2) i--;
	else j--;
}
reverse(ans.begin(), ans.end());
```

### Edit Distance (編輯距離)

**用途**：把字串 $a$ 變成字串 $b$ 需要的最少操作數（插入/刪除/替換）。
**複雜度**：$O(nm)$。
**狀態**：$dp[i][j]$ = $a$ 的前 $i$ 個字元變成 $b$ 的前 $j$ 個字元的最小編輯距離。

```cpp
vector<vector<int>> dp(a.size() + 1, vector<int>(b.size() + 1));
for (int i = 0;i <= a.size();i++) dp[i][0] = i;   // 刪除 i 個字元
for (int i = 0;i <= b.size();i++) dp[0][i] = i;   // 插入 i 個字元
for (int i = 1;i <= a.size();i++) {
	for (int j = 1;j <= b.size();j++) {
		dp[i][j] = min({dp[i - 1][j] + 1,         // 刪除
		                dp[i][j - 1] + 1,           // 插入
		                dp[i - 1][j - 1] + (a[i - 1] != b[j - 1])});  // 替換或不變
	}
}
```

### Grid DP (網格 DP)

路徑計數（從左上到右下，只能往右或往下，'#' 不可走）：

**複雜度**：$O(hw)$。
**狀態**：$dp[i][j]$ = 走到 $(i, j)$ 的方法數。

```cpp
int dp[h + 1][w + 1] = {};
dp[1][1] = 1;
for (int i = 1;i <= h;i++) {
	for (int j = 1;j <= w;j++) {
		char c;
		cin >> c;
		if (c == '.') dp[i][j] = (1ll * dp[i][j] + dp[i - 1][j] + dp[i][j - 1]) % mod;
	}
}
```

最大正方形（在 01 矩陣中找最大的全 1 正方形，空間壓縮版）：

**狀態**：$dp[j]$ = 以 $(i, j)$ 為右下角的最大正方形邊長。

```cpp
vector<int> dp(m + 1);               // 上一列的 dp 值
for (int i = 1;i <= n;i++) {
	vector<int> now(m + 1);
	for (int j = 1;j <= m;j++) {
		if (grid[i][j] == '0') continue;
		now[j] = min({dp[j], now[j - 1], dp[j - 1]}) + 1;   // 上、左、左上取 min + 1
		ans = max(now[j], ans);
	}
	dp = now;
}
```

### Interval DP (區間 DP)

**用途**：處理「合併/分割區間」類的問題。
**複雜度**：$O(n^3)$。
**狀態**：$dp[l][r]$ = 處理區間 $[l, r]$ 的最優解。

合併石頭（每次合併相鄰兩堆，花費 = 兩堆的和，求最小總花費）：

```cpp
vector<vector<int>> dp(n + 1, vector<int>(n + 1, INF / 2));
vector<int> pre(n + 1);             // 前綴和，用來快速算區間和
for (int i = 1;i <= n;i++) {
	pre[i] = pre[i - 1] + v[i];
	dp[i][i] = 0;                   // 單個石頭不需要合併
}
for (int l = n;l >= 1;l--) {        // 從小區間開始
	for (int r = l + 1;r <= n;r++) {
		for (int k = l;k < r;k++) {  // 枚舉分割點
			dp[l][r] = min(dp[l][r], dp[l][k] + dp[k + 1][r] + pre[r] - pre[l - 1]);
		}
	}
}
```

博弈取石頭（兩人輪流從頭或尾取石頭，求先手最大得分）：

**狀態**：$dp[l][r]$ = 在 $[l, r]$ 中先手能拿到的最大分數。

```cpp
for (int l = n;l >= 1;l--) {
	for (int r = l + 1;r <= n;r++) {
		// 先手取左邊或右邊，剩下的給對手（對手得分 = 總分 - 先手得分）
		dp[l][r] = max(pre[r] - pre[l - 1] - dp[l + 1][r], pre[r] - pre[l - 1] - dp[l][r - 1]);
	}
}
```

### Bitmask DP (狀態壓縮 DP)

**用途**：用二進位表示集合的狀態，適合 $n \leq 20$ 的問題。
**複雜度**：$O(2^n \cdot n)$。

Hamiltonian Path 計數（經過每個節點恰好一次的路徑數）：

**狀態**：$dp[mask][t]$ = 已拜訪集合為 $mask$、目前在節點 $t$ 的路徑數。

```cpp
vector<vector<int>> dp(1 << n, vector<int>(n));
dp[1][0] = 1;                       // 從節點 0 出發，已拜訪 {0}
for (int i = 1;i < (1 << n);i += 2) {       // 只看包含節點 0 的狀態
	for (int t = 0;t < n;t++) {
		if (!dp[i][t]) continue;
		for (auto nt : v[t]) {
			if (i & (1 << nt)) continue;     // nt 已在集合中
			dp[i | (1 << nt)][nt] = (dp[i | (1 << nt)][nt] + dp[i][t]) % mod;
		}
	}
}
cout << dp[(1 << n) - 1][n - 1];    // 所有節點都拜訪過，結束在 n-1
```

賽局 DP（狀態壓縮博弈：用 bitmask 記錄剩餘可選項目）：

```cpp
vector<int> dp(1 << n, -1);
dp[(1 << n) - 1] = 0;               // 全部用完 = 敗態
bool win(int t) {
	if (dp[t] != -1) return dp[t];
	// 嘗試所有可能的移動
	for (...) {
		if (!win(next_state)) return dp[t] = 1;   // 對手會輸 -> 我贏
	}
	return dp[t] = 0;               // 所有移動都讓對手贏 -> 我輸
}
```

### Game DP (Nim / SG)

**用途**：判斷博弈的先手勝負。
**狀態**：$dp[i]$ = 剩 $i$ 個石頭時，先手是否必勝。

```cpp
vector<bool> dp(k + 1);             // dp[i] = true 表示先手必勝
for (int i = 1;i <= k;i++) {
	for (auto x : moves) {          // 每次可以拿 x 個
		if (i < x) break;
		if (!dp[i - x]) {           // 存在一步讓對手進入敗態
			dp[i] = 1;
			break;
		}
	}
}
cout << (dp[k] ? "First" : "Second");
```

### Tree DP (樹 DP)

**用途**：在樹結構上做 DP，自葉向根合併資訊。

獨立集計數（選出的節點兩兩不相鄰的方案數）：

**狀態**：$dp[0][t]$ = 不選 $t$ 的方案數，$dp[1][t]$ = 選 $t$ 的方案數。

```cpp
vector<vector<int>> dp;             // dp[0][t], dp[1][t]
vector<bool> vis;
void dfs(int t) {
	vis[t] = 1;
	for (auto nt : v[t]) {
		if (vis[nt]) continue;
		dfs(nt);
		dp[0][t] = (dp[0][t] * (dp[0][nt] + dp[1][nt]) % mod) % mod;  // 不選 t -> 子可選可不選
		dp[1][t] = dp[1][t] * dp[0][nt] % mod;                         // 選 t -> 子必不選
	}
}
```

DAG 上最長路（記憶化 DFS）：

```cpp
vector<int> dp;
int dfs(int t) {
	if (dp[t] != -1) return dp[t];
	dp[t] = 0;
	for (auto nt : v[t]) dp[t] = max(dp[t], dfs(nt) + 1);
	return dp[t];
}
```

### Weighted Job Scheduling (加權工作排程)

**用途**：$n$ 個工作各有開始/結束時間和報酬，選出不重疊的工作使總報酬最大。
**複雜度**：$O(n \log n)$。
**狀態**：$dp[i]$ = 考慮前 $i$ 個工作的最大報酬。

做法：按結束時間排序，對每個工作二分搜找「開始前最晚結束的工作」。

```cpp
vector<array<int, 3>> v(n);         // {開始, 結束, 報酬}
for (auto &[x, y, w] : v) cin >> x >> y >> w;
sort(v.begin(), v.end(), [](auto x, auto y) {
	if (x[1] == y[1]) return x[0] < y[0];
	return x[1] < y[1];             // 按結束時間排序
});
vector<int> a, dp(n + 1);
for (auto [x, y, w] : v) a.push_back(y);   // 結束時間陣列（用於二分搜）
for (int i = 1;i <= n;i++) {
	auto [x, y, w] = v[i - 1];
	// lower_bound 找第一個結束時間 >= x 的位置 -> 前一個就是不衝突的最後一個
	dp[i] = max(dp[i - 1], dp[lower_bound(a.begin(), a.end(), x) - a.begin()] + w);
}
```

---

## 貪心

### 區間排程 (Interval Scheduling)

**用途**：從一堆區間中選出最多個不重疊的區間。
**複雜度**：$O(n \log n)$。
**策略**：按結束時間排序，每次選結束最早且不衝突的區間。

```cpp
sort(v.begin(), v.end(), [](auto a, auto b) {return a.second < b.second;});
int last = -1, ans = 0;             // last = 上一個選的區間的結束時間
for (auto [x, y] : v) {
	if (x >= last) {                 // 開始時間 >= 上一個結束 -> 不衝突
		ans++;
		last = y;
	}
}
```

### 多機區間排程 (k-Screen Scheduling)

**用途**：有 $k$ 個機器（螢幕），每個機器同時只能處理一個區間，求最多能安排幾個。
**複雜度**：$O(n \log n)$。
**策略**：按結束時間排序，用 multiset 記錄每個機器目前的結束時間，優先使用「結束時間最接近開始時間」的機器。

```cpp
sort(v.begin(), v.end(), [](auto a, auto b) {return a.second < b.second;});
multiset<int> st;                    // 每個機器目前的結束時間
int ans = 0;
for (auto [x, y] : v) {
	auto it = st.upper_bound(x);     // 找結束時間 <= x 的最大值
	if (it != st.begin()) {
		st.erase(prev(it));           // 替換該機器的結束時間
		st.insert(y);
		ans++;
		continue;
	}
	if (st.size() < k) {             // 還有空閒機器
		st.insert(y);
		ans++;
	}
}
```

### 最小化完成時間 (Task Scheduling)

**用途**：$n$ 個工作有處理時間和截止時間，排序使得總延遲最小。
**複雜度**：$O(n \log n)$。
**策略**：按處理時間排序（SPT rule），讓短的工作先做。

```cpp
sort(v.begin(), v.end());            // v[i] = {處理時間, 截止時間}
int sum = 0, ans = 0;               // sum = 目前的累計完成時間
for (auto [a, d] : v) {
	sum += a;
	ans += (d - sum);                // 截止時間 - 完成時間 = 剩餘彈性
}
```

### 截止時間排程 - Reverse Sweep (Deadline Job Scheduling)

**用途**：$n$ 個工作有截止時間和報酬，每天只能做一個工作，求最大總報酬。
**複雜度**：$O(n \log n)$。
**策略**：從最後一天開始往前掃，每天從可用工作中選報酬最高的。

```cpp
vector<vector<int>> v(m + 1);       // v[s] = 最早可開始在第 s 天做的工作報酬們
for (int i = 0;i < n;i++) {
	int a, b;                        // a = 需要的天數（截止期限），b = 報酬
	cin >> a >> b;
	int s = m - a + 1;              // 最晚開始日
	if (s >= 1 and s <= m) v[s].push_back(b);
}
priority_queue<int> q;               // max-heap，存可用工作的報酬
int ans = 0;
for (int i = m;i >= 1;i--) {        // 從最後一天往前
	for (auto x : v[i]) q.push(x);  // 第 i 天新可用的工作加入
	if (!q.empty()) {
		ans += q.top();              // 選報酬最高的
		q.pop();
	}
}
```

### 截止時間排程 - Forward Sweep (EDF)

**用途**：$n$ 個工作有開始時間和截止時間，每個時間點做一個，求最多能完成幾個。
**複雜度**：$O(n \log n)$。
**策略**：正向模擬時間，用 min-heap 優先處理截止時間最早的。

```cpp
sort(v.begin(), v.end());            // 按開始時間排序
int now = 0, ans = 0, pos = 0;
priority_queue<int, vector<int>, greater<int>> q;   // min-heap，存截止時間
while (pos < n or !q.empty()) {
	now++;
	if (q.empty()) now = max(now, v[pos].first);     // 跳到下一個有工作的時間
	while (pos < n and v[pos].first <= now) {
		q.push(v[pos].second);       // 把已開始的工作放進 heap
		pos++;
	}
	while (!q.empty() and q.top() < now) q.pop();    // 移除已過期的
	if (!q.empty()) {
		ans++;                       // 做截止時間最早的
		q.pop();
	}
}
```

### 最小費用合併 (Huffman / Min Cost Merge)

**用途**：每次選兩個合併，費用 = 兩者之和，求最小總費用。經典問題：合併竹棍、Huffman 編碼。
**複雜度**：$O(n \log n)$。
**策略**：每次合併最小的兩個（讓大的晚被合併，減少重複計費）。

```cpp
priority_queue<int, vector<int>, greater<int>> q;   // min-heap
while (n--) { int t; cin >> t; q.push(t); }
int ans = 0;
while (q.size() >= 2) {
	int a = q.top(); q.pop();
	int b = q.top(); q.pop();
	ans += a + b;                    // 這次合併的費用
	q.push(a + b);                   // 合併結果放回
}
```

### Multiset 貪心配對 - 最大匹配 (Ticket Assignment)

**用途**：每個需求找一個 $\leq$ 它的最大選項配對。例如：顧客出價 $t$，找 $\leq t$ 的最貴門票。
**複雜度**：$O(n \log n)$。

```cpp
multiset<int> st;
// 先把所有選項插入 st
while (m--) {
	int t;
	cin >> t;
	auto it = st.upper_bound(t);     // 第一個 > t 的位置
	if (it == st.begin()) cout << -1 << '\n';   // 沒有 <= t 的
	else {
		--it;                        // 退一步 = 最大的 <= t
		cout << *it << '\n';
		st.erase(it);               // 配對後移除
	}
}
```

### Multiset 貪心配對 - 最小費用 (Min Cost Matching)

**用途**：每個需求找一個 $\geq$ 它的最小選項配對，使總費用最小。
**複雜度**：$O(n \log n)$。

```cpp
multiset<int> st;
// 先把所有選項插入 st
int ans = 0;
for (int i = 0;i < m;i++) {
	int t;
	cin >> t;
	auto it = st.lower_bound(t);     // 第一個 >= t 的
	if (it == st.end()) { /* 無法匹配 */ }
	ans += *it;
	st.erase(it);                    // 配對後移除
}
```

### 遞增陣列 (Increasing Array)

**用途**：把陣列變成非遞減的最小代價（只能增加元素值）。
**複雜度**：$O(n)$。
**策略**：遇到比前一個小的就補到跟前一個一樣大。

```cpp
int ans = 0;
for (int i = 1;i < n;i++) {
	if (v[i] < v[i - 1]) {
		ans += v[i - 1] - v[i];     // 需要增加的量
		v[i] = v[i - 1];            // 補到跟前一個一樣
	}
}
```

### 集合等分 (Set Partition)

**用途**：把 $1 \sim n$ 分成兩個總和相等的集合。
**複雜度**：$O(n)$。
**策略**：從大到小，能放就放（先填目標總和小的那邊）。

```cpp
int cnt = (n * (n + 1)) / 4;        // 每個集合的目標總和
vector<int> a, b;
for (int i = n;i >= 1;i--) {
	if (i <= cnt) {                  // 還裝得下就放進集合 a
		a.push_back(i);
		cnt -= i;
	}
	else b.push_back(i);
}
```

### 間隔覆蓋 (Minimum Intervals to Cover Range)

**用途**：用最少的區間覆蓋一段指定範圍 $[\text{start}, \text{finish}]$。
**複雜度**：$O(n \log n)$。
**策略**：排序後，每次從所有起點 <= 當前位置的區間中，選終點最遠的。

```cpp
sort(v.begin(), v.end());            // 按起點排序
int now = start, l = 0, cnt = 0;
while (now < finish) {
	int t = now;
	while (l < n and v[l].first <= now) {   // 所有可用的區間
		t = max(t, v[l].second);             // 找最遠的終點
		l++;
	}
	if (t <= now) break;             // 無法前進 -> 覆蓋不了
	now = t;
	cnt++;
}
```

### 間距最小化 (Gap Minimization)

**用途**：$m$ 個點分成 $n$ 組連續的，使組內總距離最小。等同於刪除 $n-1$ 個最大的間距。
**複雜度**：$O(m \log m)$。
**策略**：排序、算相鄰間距、取最小的 $m-n$ 個間距。

```cpp
sort(x.begin(), x.end());
vector<int> dis(m - 1);             // 相鄰兩點的間距
for (int i = 0;i < m - 1;i++) dis[i] = x[i + 1] - x[i];
sort(dis.begin(), dis.end());
int ans = 0;
for (int i = 0;i < m - n;i++) ans += dis[i];   // 取最小的 m-n 個
```

### PQ 貪心移除 (Priority Queue Greedy Removal)

**用途**：依序移除代價最小的元素，移除時更新鄰居的代價。
**複雜度**：$O((V + E) \log V)$。
**策略**：用 min-heap 存 {代價, 節點}，移除後更新鄰居並重新入堆（懶刪除）。

```cpp
priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> q;
vector<int> sz(n + 1);              // sz[i] = 節點 i 的鄰居權重和
for (int i = 1;i <= n;i++) q.push({sz[i], i});
int ans = 0;
while (cnt < n) {
	auto [w, t] = q.top();
	q.pop();
	if (vis[t]) continue;           // 懶刪除：已移除的跳過
	vis[t] = 1;
	ans = max(w, ans);
	cnt++;
	for (auto nt : v[t]) {
		if (vis[nt]) continue;
		sz[nt] -= a[t];             // 鄰居少了 t，更新代價
		q.push({sz[nt], nt});       // 重新入堆
	}
}
```

### 掃描線 (Sweep Line)

**用途**：求最大重疊區間數（同時進行的事件數上限）。
**複雜度**：$O(n \log n)$。
**策略**：把區間拆成 $+1$（開始）和 $-1$（結束）事件，排序後掃描。

```cpp
vector<pair<int, int>> v(2 * n);     // {時間點, +1 或 -1}
for (int i = 0;i < 2 * n;i += 2) {
	cin >> v[i].first;
	v[i].second = 1;                // 區間開始
	cin >> v[i + 1].first;
	v[i + 1].second = -1;           // 區間結束
}
sort(v.begin(), v.end());
int ans = 0, sum = 0;
for (auto [x, s] : v) {
	sum += s;                        // 目前重疊數
	ans = max(ans, sum);
}
```

### 滑動中位數 (Sliding Median)

**用途**：在滑動視窗中即時查詢中位數。
**複雜度**：每次插入/刪除 $O(\log n)$。
**策略**：用兩個 multiset，a 存較小的一半，b 存較大的一半，保持 a 多一個。

```cpp
multiset<int> a, b;                  // a: 較小的一半，b: 較大的一半
// 插入 x
if (a.empty() or x < *a.rbegin()) a.insert(x);
else b.insert(x);
// 平衡兩邊大小（讓 a 比 b 多一個或相等）
while (b.size() > k / 2) { a.insert(*b.begin()); b.erase(b.begin()); }
while (b.size() < k / 2) { b.insert(*a.rbegin()); a.erase(prev(a.end())); }
// 中位數 = *a.rbegin()（a 的最大值）
```

> 另見「搜尋與排序」中的排序配對 (Ferris Wheel) 和排序匹配 (Apartments)，也屬於貪心。

---

## 搜尋與排序

### Binary Search (二分搜)

**用途**：在單調性上找分界點。
**複雜度**：$O(\log n)$。

```cpp
int l = 0, r = 1e18, ans;
while (l <= r) {
	int m = (l + r) / 2;
	if (check(m)) {                  // check(m) = true 代表 m 可行
		r = m - 1;
		ans = m;                     // 記錄可行解，繼續找更小的
	}
	else {
		l = m + 1;
	}
}
```

### Ternary Search (三分搜)

**用途**：在單峰/單谷函數上找極值。
**複雜度**：$O(\log n)$。

凸函數找最小值：

```cpp
int l = lo, r = hi;
while (r - l >= 3) {
	int m1 = l + (r - l) / 3, m2 = r - (r - l) / 3;
	if (f(m1) > f(m2)) l = m1 + 1;  // 最小值在右邊
	else r = m2 - 1;                 // 最小值在左邊
}
int ans = INF;
for (int i = l;i <= r;i++) ans = min(ans, f(i));   // 剩餘幾個暴力比較
```

### Two Pointers / Sliding Window (雙指標 / 滑動視窗)

**用途**：利用兩個指標在排序陣列或子陣列上高效搜尋。
**複雜度**：$O(n)$ 或 $O(n^2)$（含外層迴圈）。

三數之和（排序後固定一個，剩下兩個用雙指標搜尋）：

```cpp
sort(v.begin(), v.end());
for (int i = 0;i < n;i++) {
	int l = i + 1, r = n - 1;       // 在 i 右邊找兩個數
	while (l < r) {
		if (v[i] + v[l] + v[r] == x) {
			// 找到
			return 0;
		}
		else if (v[i] + v[l] + v[r] > x) r--;   // 太大，右邊縮
		else l++;                                  // 太小，左邊擴
	}
}
```

最長不重複子陣列（維護視窗內每個元素出現次數）：

```cpp
map<int, int> mp;                    // 元素出現次數
int ans = 0;
for (int i = 0, j = 0;i < n;i++) {  // i = 右端，j = 左端
	mp[v[i]]++;
	while (mp[v[i]] > 1) {          // 有重複就縮左端
		mp[v[j]]--;
		j++;
	}
	ans = max(ans, i - j + 1);
}
```

至多 k 種不同元素的子陣列計數：

```cpp
map<int, int> mp;
int cnt = 0, ans = 0;               // cnt = 目前不同元素數
for (int i = 0, j = 0;i < n;i++) {
	mp[v[i]]++;
	if (mp[v[i]] == 1) cnt++;       // 新元素
	while (cnt > k) {               // 超過 k 種就縮左端
		mp[v[j]]--;
		if (!mp[v[j]]) cnt--;
		j++;
	}
	ans += i - j + 1;               // 以 i 為右端的合法子陣列數
}
```

排序後配對（Ferris Wheel：兩人一組，總重 <= x，求最少組數）：

```cpp
sort(v.begin(), v.end());
int ans = 0, i = 0, j = n - 1;      // i = 最輕，j = 最重
while (i <= j) {
	if (i < j and v[i] + v[j] <= x) i++;   // 配對成功，輕的右移
	ans++;                           // 不管有沒有配對，重的都要一組
	j--;
}
```

排序後匹配（Apartments：a 和 b 差在 k 以內就算匹配，求最多配對數）：

```cpp
sort(a.begin(), a.end());
sort(b.begin(), b.end());
int i = 0, ans = 0;
for (auto x : a) {
	while (i < m and b[i] + k < x) i++;   // b[i] 太小，右移
	if (i >= m) break;
	if (x - k <= b[i] and b[i] <= x + k) { ans++; i++; }   // 在範圍內，配對
}
```

### Meet in the Middle (折半搜尋)

**用途**：把 $O(2^n)$ 的暴力拆成兩個 $O(2^{n/2})$，再合併。
**複雜度**：$O(2^{n/2})$。

例：找子集和等於 $k$ 的方案數。

```cpp
// 前半部分：枚舉前 n/2 個元素的所有子集
unordered_map<int, int> cnt;         // cnt[sum] = 和為 sum 的子集數
for (int i = 0;i < (1 << (n / 2));i++) {
	int sum = 0;
	for (int j = 0;j < n / 2;j++) if (i & (1 << j)) sum += v[j];
	cnt[sum]++;
}
// 後半部分：枚舉後 n/2 個元素的所有子集，查表配對
int ans = 0;
for (int i = 0;i < (1 << ((n + 1) / 2));i++) {
	int sum = 0;
	for (int j = 0;j < (n + 1) / 2;j++) if (i & (1 << j)) sum += v[j + n / 2];
	if (cnt.count(k - sum)) ans += cnt[k - sum];
}
```

### Merge Sort - Inversion Count (逆序對計數)

**用途**：計算陣列中有多少對 $(i, j)$ 滿足 $i < j$ 且 $v[i] > v[j]$。
**複雜度**：$O(n \log n)$。

做法：在 merge sort 合併時，右半的元素比左半先被放入 → 代表左半剩餘的都比它大。

```cpp
vector<int> v, a;                    // v = 原陣列，a = 暫存
int f(int l, int r) {
	if (l >= r) return 0;
	int m = (l + r) / 2;
	int ans = f(l, m) + f(m + 1, r);  // 遞迴排序左右半
	int i = l, j = m + 1, k = l;
	while (i <= m and j <= r) {
		if (v[i] <= v[j]) a[k++] = v[i++];
		else a[k++] = v[j++], ans += m - i + 1;   // 左半 i~m 的都比 v[j] 大
	}
	while (i <= m) a[k++] = v[i++];
	while (j <= r) a[k++] = v[j++];
	for (int i = l;i <= r;i++) v[i] = a[i];
	return ans;
}
```

BIT 版逆序對（用離散化 + BIT 計算每個元素前面有多少比它大的）：

```cpp
BIT bit(n);
vector<pair<int, int>> v(n);
for (int i = 0;i < n;i++) { cin >> v[i].first; v[i].second = i; }
sort(v.begin(), v.end());            // 離散化：排序後給每個值一個排名
vector<int> rk(n);
for (int i = n - 1;i >= 0;i--) rk[v[i].second] = i + 1;
int ans = 0;
for (int i = n - 1;i >= 0;i--) {    // 從右到左掃
	ans += bit.get(rk[i] - 1);      // 已插入的排名 < rk[i] 的數量 = 逆序對
	bit.upd(rk[i]);
}
```

---

## 數學

### Fast Exponentiation (快速冪)

**用途**：計算 $a^b \bmod m$。
**複雜度**：$O(\log b)$。

```cpp
long long ans = 1;
void f(long long a, long long b) {
	if (b <= 1) {
		ans = ((ans % mod) * (a % mod)) % mod;
		return;
	}
	if (b % 2) {                     // b 是奇數：先乘一個 a
		ans = ((ans % mod) * (a % mod)) % mod;
	}
	a = ((a % mod) * (a % mod)) % mod;   // a = a²
	f(a, b / 2);                     // 遞迴處理 b/2
}
```

### Sieve of Eratosthenes (埃氏篩)

**用途**：找出某範圍內的所有質數。

區間篩（找 $[L, R]$ 中的質數，只需篩到 $\sqrt{R}$）：

```cpp
vector<bool> not_prime(R - L + 1);
for (int i = 2;i * i <= R;i++) {
	int v = R / i * i;               // 從 R 往回找 i 的倍數
	for (;v >= L && v > i;v -= i) {
		not_prime[v - L] = 1;        // 標記為合數
	}
}
```

### Factorial Trailing Zeros (階乘尾零)

**用途**：計算 $n!$ 末尾有幾個 $0$（即 $n!$ 中因子 $5$ 的個數）。
**複雜度**：$O(\log n)$。

```cpp
int f(int n) {
	if (n == 0) return 0;
	return n / 5 + f(n / 5);        // n/5 + n/25 + n/125 + ...
}
```

### Kadane's Algorithm (最大子陣列和)

**用途**：找出連續子陣列的最大和。
**複雜度**：$O(n)$。

```cpp
int ans = -1e18, now = 0;           // now = 以當前位置結尾的最大子陣列和
for (int i = 0;i < n;i++) {
	now += v[i];
	ans = max(ans, now);
	if (now < 0) now = 0;           // 負數不如重新開始
}
```

---

## 前綴和

### 1D Prefix Sum (一維前綴和)

**用途**：$O(1)$ 回答區間和查詢。
**複雜度**：建表 $O(n)$、查詢 $O(1)$。

```cpp
vector<int> pre(n + 1);             // pre[i] = a[1] + a[2] + ... + a[i]
for (int i = 1;i <= n;i++) pre[i] = pre[i - 1] + a[i];
// 區間查詢 [l, r]
int sum = pre[r] - pre[l - 1];
```

子陣列和等於 x 的計數（前綴和 + hash map：找有多少個 pre[j] = pre[i] - x）：

```cpp
map<long long, int> mp;             // mp[s] = 前綴和為 s 的出現次數
mp[0] = 1;                          // 空前綴
long long ans = 0;
for (int i = 1;i <= n;i++) {
	v[i] += v[i - 1];               // v[i] 變成前綴和
	if (mp.find(v[i] - x) != mp.end()) ans += mp[v[i] - x];
	mp[v[i]]++;
}
```

### 2D Prefix Sum (二維前綴和)

**用途**：$O(1)$ 回答矩形區域和查詢。
**複雜度**：建表 $O(n^2)$、查詢 $O(1)$。

使用排容原理：`sum(x1,y1,x2,y2) = pre[x2][y2] - pre[x1-1][y2] - pre[x2][y1-1] + pre[x1-1][y1-1]`。

```cpp
int a[n + 2][n + 2] = {};
for (int i = 1;i <= n;i++) {
	for (int j = 1;j <= n;j++) {
		// a[i][j] += 原始值
		a[i][j] += a[i - 1][j] + a[i][j - 1] - a[i - 1][j - 1];   // 二維前綴和
	}
}
// 查詢左上角 (x1,y1) 到右下角 (x2,y2) 的矩形和
int sum = a[x2][y2] - a[x1 - 1][y2] - a[x2][y1 - 1] + a[x1 - 1][y1 - 1];
```

### 3D Prefix Sum (三維前綴和)

**用途**：$O(1)$ 回答三維長方體區域和查詢。
**複雜度**：建表 $O(n^3)$、查詢 $O(1)$。

排容原理的三維版本（3 個面 - 3 條邊 + 1 個頂點）：

```cpp
int s[N][N][N] = {};
for (int i = 1;i <= n;i++) {
	for (int j = 1;j <= n;j++) {
		for (int k = 1;k <= n;k++) {
			int t;
			cin >> t;
			s[i][j][k] = s[i - 1][j][k] + s[i][j - 1][k] + s[i][j][k - 1]
			            - s[i - 1][j - 1][k] - s[i][j - 1][k - 1] - s[i - 1][j][k - 1]
			            + s[i - 1][j - 1][k - 1] + t;
		}
	}
}
// 查詢 (lx,ly,lz) ~ (rx,ry,rz) 的長方體和
int ans = s[rx][ry][rz] - s[lx-1][ry][rz] - s[rx][ly-1][rz] - s[rx][ry][lz-1]
        + s[lx-1][ly-1][rz] + s[rx][ly-1][lz-1] + s[lx-1][ry][lz-1]
        - s[lx-1][ly-1][lz-1];
```

---

## 其他技巧

### Permutation (排列枚舉)

**用途**：枚舉字串/陣列的所有排列。
**複雜度**：$O(n! \times n)$。

```cpp
string s;
cin >> s;
sort(s.begin(), s.end());           // 先排序，確保從最小排列開始
do {
	cout << s << '\n';
} while (next_permutation(s.begin(), s.end()));
```

### Gray Code (格雷碼)

**用途**：產生 n 位元的格雷碼序列（相鄰兩個只差一位元）。
**複雜度**：$O(2^n)$。

做法：n 位元格雷碼 = 前半加 "0" 前綴，後半為 n-1 位的反轉加 "1" 前綴。

```cpp
vector<string> f(int n) {
	if (n == 1) return {"0", "1"};
	vector<string> now;
	auto x = f(n - 1);
	for (int i = 0;i < x.size();i++) now.push_back("0" + x[i]);         // 正序加 "0"
	for (int i = x.size() - 1;i >= 0;i--) now.push_back("1" + x[i]);   // 逆序加 "1"
	return now;
}
```

### Fast Hash (防 hack 雜湊)

**用途**：替 unordered_map 加上隨機化 hash，防止被特殊測資卡 hash 碰撞。

```cpp
struct FastHash {
	static uint64_t splitmix64(uint64_t x) {
		x += 0x9e3779b97f4a7c15;
		x = (x ^ (x >> 30)) * 0xbf58476d1ce4e5b9;
		x = (x ^ (x >> 27)) * 0x94d049bb133111eb;
		x = x ^ (x >> 31);
		return x;
	}
	size_t operator()(long long x) const {
		static const uint64_t FIXED_RANDOM =
			chrono::steady_clock::now().time_since_epoch().count();
		return splitmix64(x + FIXED_RANDOM);
	}
};
// 用法：unordered_map<int, int, FastHash> mp;
```

### 四數之和 (Hash)

**用途**：在陣列中找四個數和為 x。
**複雜度**：$O(n^2)$。

做法：枚舉兩兩配對，用 hash map 存前面的配對和。

```cpp
unordered_map<int, pair<int, int>> mp;   // mp[sum] = {i, j} 表示 v[i]+v[j] = sum
for (int i = 0;i < n;i++) {
	for (int j = i + 1;j < n;j++) {
		if (mp.find(x - v[i] - v[j]) != mp.end()) {
			auto [a, b] = mp[x - v[i] - v[j]];
			cout << a + 1 << ' ' << b + 1 << ' ' << i + 1 << ' ' << j + 1;
			return 0;
		}
	}
	// 把 (i, j<i) 的配對存入 map（確保不跟自己衝突）
	for (int j = 0;j < i;j++) {
		if (!mp.count(v[i] + v[j])) mp[v[i] + v[j]] = {i, j};
	}
}
```

### Josephus Problem (約瑟夫問題)

**用途**：n 人圍一圈，每隔一人淘汰，求淘汰順序。
**複雜度**：$O(n \log n)$（用 set）。

```cpp
set<int> st;
for (int i = 1;i <= n;i++) st.insert(i);
auto pos = st.begin();
while (st.size() > 1) {
	if (st.upper_bound(*pos) == st.end()) {
		cout << *st.begin() << ' ';
		st.erase(st.begin());
		pos = st.begin();
	}
	else {
		pos = st.upper_bound(*pos);          // 跳到下一個人
		cout << *pos << ' ';
		st.erase(pos);
		auto t = st.upper_bound(*pos);
		if (t == st.end()) pos = st.begin(); // 繞回開頭
		else pos = t;
	}
}
cout << *st.begin();
```

---

## Pragma 加速

**用途**：在 judge 允許的情況下，讓 GCC 做更激進的優化。

```cpp
#pragma GCC optimize("Ofast,unroll-loops,inline,fast-math")
#pragma GCC target("avx2,bmi2,popcnt,lzcnt")
```
