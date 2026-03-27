---
title: 2026 TOI 初選
date: 2026-03-18
updated: 2026-03-18
cover: /images/code-cover.jpg
categories: [TOI]
tags: [TOI, 解題, C++]
description: 2026 年資訊奧林匹亞初選解題紀錄與程式碼。
toc: true
comments: true
---

> **補題連結（由 AA 競程製作）：**[Codeforces Contest](https://codeforces.com/contestInvitation/c92dae442d3d704a38eb0a1bcd9c1aea5e435658)

**先講結果：223 / 500 分，rk.48**
![2026 TOI 初選計分板](/images/2026TOI初選計分板.png)
## 1. 快樂數
### 題目 PDF
<embed src="/pdfs/happy (it).pdf" type="application/pdf" width="100%" height="800px">

### 上傳紀錄
![P1 上傳紀錄](/images/P1上傳.png)
### 當時上傳的程式碼
**100 / 100 分**
```cpp
#include<bits/stdc++.h>
using namespace std;
int f(int x) {
    int sum = 0;
    do{
        sum += (x % 10) * (x % 10);
    } while (x /= 10);
    return sum;
}
int main() {
    int n;
    cin >> n;
    unordered_map<int, int> mp;
    int ans = 0;
    mp[n]++;
    while (n != 1) {
        n = f(n);
        ans++;
        if (mp[n]++) {
            cout << n;
            return 0;
        }
    }
    cout << ans;
}
```
## 2. 河內塔
### 題目 PDF
<embed src="/pdfs/hanoi (it).pdf" type="application/pdf" width="100%" height="800px">

### 上傳紀錄
![P2 上傳紀錄](/images/P2上傳.png)
### 當時上傳的程式碼
~~忘記河內塔咋寫了，啥都沒上傳。~~
## 3. 大中括
### 題目 PDF
<embed src="/pdfs/brackets (it).pdf" type="application/pdf" width="100%" height="800px">

### 上傳紀錄
![P3 上傳紀錄](/images/P3上傳.png)
### 當時上傳的程式碼
**19 / 100 分**
```cpp
#include<bits/stdc++.h>
using namespace std;
#define int long long
signed main() {
    int n, m;
    cin >> n >> m;
    vector<pair<int, int>> v(m);
    for (auto &[x, y] : v) cin >> x >> y;
    for (int i = 0;i < m;i++) for (int j = i + 1;j < m;j++) {
        if (v[i].first < v[j].first and v[j].first <= v[i].second and v[i].second < v[j].second) {
            cout << m - 1;
            return 0;
        }
        if (v[j].first < v[i].first and v[i].first <= v[j].second and v[j].second < v[i].second) {
            cout << m - 1;
            return 0;
        }
    }
    cout << m;
}
```
## 4. 新高價
### 題目 PDF
<embed src="/pdfs/newhigh (it).pdf" type="application/pdf" width="100%" height="800px">

### 上傳紀錄
![P4 上傳紀錄](/images/P4上傳.png)
### 當時上傳的程式碼
**17 / 100 分**
```cpp
#include<bits/stdc++.h>
using namespace std;
#define int long long
signed main() {
    int n, k;
    cin >> n >> k;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    int l = 0, r = n - 1;
    int ans = 0;
    while (l <= r) {
        int m = (l + r) / 2, cnt = 0;
        for (int i = 0;i < n;i++) {
            int now = v[i];
            for (int j = i + 1;j <= min(i + m, n - 1);j++) if (v[j] > now) {
                cnt += v[j];
                now = v[j];
            }
        }
        if (cnt <= k) l = m + 1, ans = m;
        else r = m - 1;
    }
    cout << ans;
}
```
---
**34 / 100 分**
```cpp
#include<bits/stdc++.h>
using namespace std;
#define int long long
signed main() {
    int n, k;
    cin >> n >> k;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    int l = 0, r = n - 1;
    int ans = 0;
    while (l <= r) {
        int m = (l + r) / 2, cnt = 0;
        for (int i = 1;i < n;i++) {
            cnt += v[i] * min(i, m);
        }
        if (cnt <= k) l = m + 1, ans = m;
        else r = m - 1;
    }
    cout << ans;
}
```
---
**100 / 100 分**
```cpp
#include<bits/stdc++.h>
using namespace std;
#define int long long
signed main() {
    ios::sync_with_stdio(0), cin.tie(0), cout.tie(0);
    int n, k;
    cin >> n >> k;
    vector<int> v(n), left(n, 1000000);
    for (auto &x : v) cin >> x;
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> q;
    for (int i = n - 1;i >= 0;i--) {
        while (!q.empty() and v[i] >= q.top().first) {
            left[q.top().second] = q.top().second - i;
            q.pop();
        }
        q.push({v[i], i});
    }
    // for (int i = 0;i < n;i++) cout << left[i] << ' ';
    int l = 0, r = n - 1;
    int ans = 0;
    while (l <= r) {
        int m = (l + r) / 2, cnt = 0;
        for (int i = 1;i < n;i++) cnt += v[i] * min({i, m, left[i] - 1});
        if (cnt <= k) l = m + 1, ans = m;
        else r = m - 1;
    }
    cout << ans;
}
```
## 5. 幾乎獨立的分店
### 題目 PDF
<embed src="/pdfs/independent (it).pdf" type="application/pdf" width="100%" height="800px">

### 上傳紀錄
![P5 上傳紀錄](/images/P5上傳.png)
### 當時上傳的程式碼
**4 / 100 分**
```cpp
#include<bits/stdc++.h>
using namespace std;
#define int long long
signed main() {
	int n, k;
	cin >> n >> k;
	vector<int> a(n + 1);
	vector<vector<int>> v(n + 1);
	for (int i = 0;i < n;i++) cin >> a[i];
	for (int i = 1;i < n;i++) {
		int a, b;
		cin >> a >> b;
		a--, b--;
		v[a].push_back(b);
		v[b].push_back(a);
	}
	int ans = 0;
	for (int j = 0;j < (1 << n);j++) {
		bool flag = 1;
		for (int i = 0;i < n;i++) {
			if (!((1 << i) & j)) continue;
			int cnt = 0;
			for (auto ni : v[i]) if ((1 << ni) & j) cnt++;
			if (cnt > k) {
				flag = 0;
				break;
			}
		}
		if (flag) {
			int sum = 0;
			for (int i = 0;i < n;i++) if ((1 << i) & j) sum += a[i];
			ans = max(ans, sum);
		}
	}
	cout << ans;
}
```
