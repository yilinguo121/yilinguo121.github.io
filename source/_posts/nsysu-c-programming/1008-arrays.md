---
title: 10/08｜陣列（Ch 5）
date: 2026-09-10
updated: 2026-09-11
permalink: 2026/09/09/nsysu-c-programming/1008-arrays/
cover: /images/code-cover.jpg
categories: [程式設計]
tags: [C++, 中山大學, 自學指南]
toc: true
comments: true
hidden: true
---

[← 10/01｜參數傳遞與函式重載（Ch 4）](/2026/09/09/nsysu-c-programming/1001-parameters/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [10/15｜結構與類別（Ch 5–6） →](/2026/09/09/nsysu-c-programming/1015-struct-class/)

> 對應課本習題：Ch5: 4, 8, 10, 14, 17

**這週要會什麼**

```text
陣列宣告 → 索引與越界 → 用迴圈掃描 → 陣列與函式 → 搜尋與排序 → 二維陣列
```

## 陣列是什麼

**白話說**：陣列就是**一排編號的格子**，每一格放同一種型別的資料。宣告 `int a[5];` 就是要了五個連續的整數格子，編號 **0 到 4**。

```text
        a[0]  a[1]  a[2]  a[3]  a[4]
      ┌─────┬─────┬─────┬─────┬─────┐
   a  │  3  │  1  │  4  │  1  │  5  │
      └─────┴─────┴─────┴─────┴─────┘
```

```cpp
int a[5] = {3, 1, 4, 1, 5};
cout << a[0] << ' ' << a[4] << '\n';   // 3 5
a[2] = 100;                            // 改第三格
```

初始化的幾種寫法：

```cpp
int a[5] = {3, 1, 4, 1, 5};   // 完整給
int b[5] = {1, 2};            // 剩下自動補 0 → {1,2,0,0,0}
int c[5] = {};                // 全部是 0
int d[]  = {1, 2, 3};         // 不寫大小，編譯器自己數成 3
int e[5];                     // 完全沒初始化 → 裡面是垃圾值
```

> **雷區 ①：索引從 0 開始，最後一格是 `n-1`**
> `int a[5];` 合法索引是 `a[0]` ~ `a[4]`，**`a[5]` 不存在**。

> **雷區 ②：越界不會有人擋你**
> ```cpp
> int a[5] = {};
> a[10] = 999;      // 編譯得過、可能不會當掉，但你已經踩到別人的記憶體
> ```
> C++ **不檢查陣列邊界**。症狀可能是「另一個變數的值莫名其妙變了」，或是執行到一半 `Segmentation fault`。這是 C/C++ 最惡名昭彰的坑，寫迴圈時務必確認條件是 `i < n` 而不是 `i <= n`。

> **雷區 ③：陣列大小必須是常數**
> ```cpp
> int n;
> cin >> n;
> int a[n];        // 標準 C++ 不允許（g++ 有擴充所以編得過，但別依賴）
> ```
> 正解有兩種：宣告一個夠大的固定陣列（`const int MAX = 1000; int a[MAX];`），或用後面會教的 [`vector`（10/29）](/2026/09/09/nsysu-c-programming/1029-vector-operator/)與 [`new`（11/19）](/2026/09/09/nsysu-c-programming/1119-pointers/)。

## 用迴圈掃陣列

```cpp
const int N = 5;
int a[N] = {3, 1, 4, 1, 5};

int sum = 0;
for (int i = 0; i < N; i++) sum += a[i];      // 標準寫法

for (int x : a) cout << x << ' ';             // C++11 range-based for
```

`for (int x : a)` 讀作「對 `a` 裡的每一個元素 `x`」。**注意**：`x` 是複製品，改 `x` 不會改到陣列；要改就寫 `for (int& x : a) x *= 2;`。

**用 `const int N` 而不是直接寫 5**：陣列大小改成 10 時只要改一個地方，迴圈條件自動跟著對。這是課本一再強調的習慣。

## 陣列傳進函式

陣列傳進函式時**不會複製整個陣列**，傳的是「第一格的位址」。後果是：

1. 函式**可以改到**原陣列（就算沒寫 `&`）。
2. 函式**不知道陣列多長**，所以一定要**額外傳長度**。

```cpp
#include <iostream>
using namespace std;

int sumArray(const int a[], int n) {   // const：保證不修改
    int s = 0;
    for (int i = 0; i < n; i++) s += a[i];
    return s;
}

void doubleAll(int a[], int n) {       // 沒有 const：打算修改
    for (int i = 0; i < n; i++) a[i] *= 2;
}

int main() {
    int a[5] = {1, 2, 3, 4, 5};
    cout << sumArray(a, 5) << '\n';    // 15
    doubleAll(a, 5);
    cout << sumArray(a, 5) << '\n';    // 30
    return 0;
}
```

輸出：

```text
15
30
```

寫 `const int a[]` 的意義：**告訴讀者與編譯器「這個函式只讀不寫」**，寫錯了編譯器會直接擋下來。

## 部分填滿的陣列

實務上常見狀況：宣告了 100 格，實際只用了 47 格。做法是**另外用一個變數記住有效長度**：

```cpp
const int MAX = 100;
int a[MAX];
int size = 0;                 // 目前用了幾格

void push(int a[], int& size, int value) {
    if (size < MAX) a[size++] = value;      // 先用 size 當索引，再讓 size 加 1
}
```

之後所有迴圈都寫 `for (int i = 0; i < size; i++)`，不是 `i < MAX`。

## 線性搜尋

```cpp
// 找 target，找到回傳索引，找不到回傳 -1
int search(const int a[], int n, int target) {
    for (int i = 0; i < n; i++)
        if (a[i] == target) return i;
    return -1;
}
```

回傳 `-1` 代表「找不到」是很常見的約定，因為 `-1` 不可能是合法索引。

## 排序

**選擇排序（selection sort）**：每一輪找出剩下元素中最小的，換到前面。

```cpp
void selectionSort(int a[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++)
            if (a[j] < a[minIdx]) minIdx = j;
        if (minIdx != i) {
            int t = a[i]; a[i] = a[minIdx]; a[minIdx] = t;
        }
    }
}
```

**氣泡排序（bubble sort）**：相鄰兩兩比較，把大的往後推。

```cpp
void bubbleSort(int a[], int n) {
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - 1 - i; j++)
            if (a[j] > a[j + 1]) {
                int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
                swapped = true;
            }
        if (!swapped) break;          // 這一輪沒換過 → 已經排好，提早結束
    }
}
```

兩者都是 $O(n^2)$：資料量 10 倍，時間約 100 倍。實務上會用標準函式庫的 `sort`（`#include <algorithm>`，`sort(a, a + n);`），但**實驗課要你手寫是為了練陣列操作**，不要偷懶直接用 `sort` 交作業。

## 二維陣列

**白話說**：二維陣列就是「表格」，`g[i][j]` 是第 `i` 列第 `j` 行。

```cpp
int g[3][4] = {
    {1,  2,  3,  4},
    {5,  6,  7,  8},
    {9, 10, 11, 12}
};

for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 4; j++)
        cout << g[i][j] << '\t';
    cout << '\n';
}
```

傳進函式時，**第二維（以及之後每一維）的大小必須寫死**，因為編譯器要靠它算出每一列從哪裡開始：

```cpp
void printGrid(const int g[][4], int rows) {
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < 4; j++) cout << g[i][j] << ' ';
        cout << '\n';
    }
}
```

## 本週練習題

**Q1. 讀入與反轉**
讀入 `n`（`n ≤ 100`）與 `n` 個整數，反轉後輸出。

```text
輸入：
5
1 2 3 4 5
輸出： 5 4 3 2 1
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

int main() {
    const int MAX = 100;
    int a[MAX], n;
    cin >> n;
    for (int i = 0; i < n; i++) cin >> a[i];

    for (int i = 0; i < n / 2; i++) {        // 只要跑一半
        int t = a[i];
        a[i] = a[n - 1 - i];
        a[n - 1 - i] = t;
    }
    for (int i = 0; i < n; i++) cout << a[i] << " \n"[i == n - 1];
    return 0;
}
```

最後一行的 `" \n"[i == n - 1]` 是個小技巧：條件成立時取字串的第 1 個字元（換行），否則取第 0 個（空白）。覺得難懂就寫成一般的 `if`，考試時清楚比炫技重要。

</details>

**Q2. 最大值與其索引**
讀入 `n` 與 `n` 個整數，輸出最大值以及它**第一次出現**的索引（從 0 起算）。

```text
輸入：
6
3 9 2 9 1 4
輸出： max = 9 at index 1
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

int main() {
    const int MAX = 100;
    int a[MAX], n;
    cin >> n;
    for (int i = 0; i < n; i++) cin >> a[i];

    int best = 0;                        // 先假設第 0 格最大
    for (int i = 1; i < n; i++)
        if (a[i] > a[best]) best = i;    // 用 > 而非 >=，才會保留「第一次出現」

    cout << "max = " << a[best] << " at index " << best << '\n';
    return 0;
}
```

</details>

**Q3. 排序後求中位數**
讀入 `n` 與 `n` 個整數，手寫排序後輸出中位數（`n` 為奇數取正中間，偶數取中間兩數的平均，保留一位小數）。

```text
輸入：
4
7 1 3 9
輸出： median = 5.0
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
using namespace std;

void bubbleSort(int a[], int n) {
    for (int i = 0; i < n - 1; i++)
        for (int j = 0; j < n - 1 - i; j++)
            if (a[j] > a[j + 1]) {
                int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
            }
}

int main() {
    const int MAX = 100;
    int a[MAX], n;
    cin >> n;
    for (int i = 0; i < n; i++) cin >> a[i];
    bubbleSort(a, n);

    double median;
    if (n % 2 == 1) median = a[n / 2];
    else            median = (a[n / 2 - 1] + a[n / 2]) / 2.0;   // 記得 2.0

    cout << "median = " << fixed << setprecision(1) << median << '\n';
    return 0;
}
```

</details>

**Q4. 分數長條圖**
讀入 `n` 個 0–100 的分數，統計各區間人數（0–59、60–69、70–79、80–89、90–100），用 `*` 畫出長條圖。

```text
輸入：
6
55 62 78 85 91 88
輸出：
  0- 59: *
 60- 69: *
 70- 79: *
 80- 89: **
 90-100: *
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    int n, score;
    int count[5] = {};                    // 全部初始化為 0
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> score;
        if (score < 60)      count[0]++;
        else if (score < 70) count[1]++;
        else if (score < 80) count[2]++;
        else if (score < 90) count[3]++;
        else                 count[4]++;
    }
    const int lo[5] = {0, 60, 70, 80, 90};
    const int hi[5] = {59, 69, 79, 89, 100};
    for (int i = 0; i < 5; i++) {
        cout << setw(3) << lo[i] << '-' << setw(3) << hi[i] << ": ";
        for (int j = 0; j < count[i]; j++) cout << '*';
        cout << '\n';
    }
    return 0;
}
```

`int count[5] = {};` 這行很重要：**計數用的陣列一定要歸零**，否則加到垃圾值上面。

</details>

**Q5. 矩陣轉置**
讀入 `n`、`m` 與一個 $n \times m$ 的矩陣，輸出它的轉置（$m \times n$）。

```text
輸入：
2 3
1 2 3
4 5 6
輸出：
1 4
2 5
3 6
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

const int MAX = 50;

int main() {
    int a[MAX][MAX], n, m;
    cin >> n >> m;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            cin >> a[i][j];

    for (int j = 0; j < m; j++) {          // 轉置＝把迴圈順序對調
        for (int i = 0; i < n; i++) {
            if (i > 0) cout << ' ';
            cout << a[i][j];
        }
        cout << '\n';
    }
    return 0;
}
```

</details>

**Q6. 矩陣相乘**
讀入 $n \times m$ 矩陣 A 與 $m \times p$ 矩陣 B，輸出 $A \times B$。

```text
輸入：
2 2 2
1 2
3 4
5 6
7 8
輸出：
19 22
43 50
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

const int MAX = 50;

int main() {
    int A[MAX][MAX], B[MAX][MAX], C[MAX][MAX] = {};
    int n, m, p;
    cin >> n >> m >> p;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++) cin >> A[i][j];
    for (int i = 0; i < m; i++)
        for (int j = 0; j < p; j++) cin >> B[i][j];

    for (int i = 0; i < n; i++)
        for (int j = 0; j < p; j++) {
            C[i][j] = 0;
            for (int k = 0; k < m; k++)      // 三層迴圈是標準做法
                C[i][j] += A[i][k] * B[k][j];
        }

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < p; j++) {
            if (j > 0) cout << ' ';
            cout << C[i][j];
        }
        cout << '\n';
    }
    return 0;
}
```

矩陣相乘的定義：$C_{ij} = \sum_{k} A_{ik} \times B_{kj}$，也就是「A 的第 i 列」跟「B 的第 j 行」對應相乘再相加。

</details>

---

[← 10/01｜參數傳遞與函式重載（Ch 4）](/2026/09/09/nsysu-c-programming/1001-parameters/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [10/15｜結構與類別（Ch 5–6） →](/2026/09/09/nsysu-c-programming/1015-struct-class/)
