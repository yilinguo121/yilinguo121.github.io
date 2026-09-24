---
title: 10/08｜陣列（Ch 5）
date: 2026-09-10
updated: 2026-09-12
permalink: 2026/09/09/nsysu-c-programming/1008-arrays/
cover: /images/code-cover.jpg
categories: [程式設計]
tags: [C++, 中山大學, 自學指南]
description: 中山大學 C 程式設計自學指南 Ch 5：陣列宣告與走訪、陣列傳進函式、部分填滿的陣列、搜尋與排序、二維陣列，附本週練習題與參考解答。
toc: true
comments: true
hidden: true
---

[← 10/01｜參數傳遞與函式重載（Ch 4）](/2026/09/09/nsysu-c-programming/1001-parameters/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [10/15｜結構與類別（Ch 5–6） →](/2026/09/09/nsysu-c-programming/1015-struct-class/)

> 對應課本習題：Ch5: 4, 8, 10, 14, 17

<details>
<summary><b>這幾題各要用到什麼（動手前先看）</b></summary>

主課的上機考幾乎就是這些題目，所以每一題都自己寫過。下表是每題需要的東西（我的歸納，不是題目本文）與本系列對應的練習：

| 課本題號 | 要用到的東西 | 先練 |
| --- | --- | --- |
| Ch5-4 | 讀入一串字元，統計幾個母音各出現幾次、按字母序印成兩欄——計數陣列＋部分填滿 | Q4 |
| Ch5-8 | 模擬：幾千次隨機分配生日、用陣列記有沒有撞到——陣列＋`rand`（09/24） | Q4、09/24 Q15 |
| Ch5-10 | 代號與庫存各一個陣列，選單反覆購買到結束——陣列存狀態＋迴圈選單 | Q7 訂票系統 |
| Ch5-14 | 評分表存二維陣列，算距離找最接近的評分者——二維陣列、`sqrt` | Q5、Q6、Q10 |
| Ch5-17 | 統計首位數字出現的次數——計數陣列＋09/24 的讀檔範例 | Q4 |

</details>

**這週要會什麼**

```text
陣列宣告 → 索引與越界 → 用迴圈掃描 → 陣列與函式 → 部分填滿 → 搜尋與排序 → 二維陣列
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

`= {3, 1, 4, 1, 5}` 的大括號跟 `if`／`for` 的**不是同一回事**：這裡它不是程式區塊，而是「一串初始值」，由左到右塞進 `a[0]`、`a[1]`…。整行是一個宣告敘述，所以收尾的 `}` 後面**還要加分號**（跟 09/24 的 `enum { ... };` 同一個道理）。

初始化的幾種寫法：

```cpp
int a[5] = {3, 1, 4, 1, 5};   // 完整給
int b[5] = {1, 2};            // 沒寫到的自動補 0 → {1,2,0,0,0}；所以 int c[5] = {}; 就是全 0
int d[]  = {1, 2, 3};         // 不寫大小，編譯器自己數成 3
int e[5];                     // 沒初始化 → 垃圾值（寫在函式裡時；全域陣列會自動歸零）
```

> **雷區 ①：索引 0 到 n-1，而且越界不會有人擋你**
> `int a[5];` 合法索引是 `a[0]` ~ `a[4]`，**`a[5]` 不存在**。但 C++ **不檢查陣列邊界**：
> ```cpp
> int a[5] = {};
> a[10] = 999;      // 編譯得過、可能不會當掉，但你已經踩到別人的記憶體
> ```
> 常見症狀有三種：`*** stack smashing detected ***: terminated`；`Segmentation fault`（踩得太遠）；什麼都不發生，但另一個變數的值莫名其妙變了（**最可怕的一種**，因為你會去懷疑無辜的程式碼）。寫迴圈時務必確認條件是 `i < n` 而不是 `i <= n`。

> **雷區 ②：陣列大小必須是常數**
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
for (int i = 0; i < N; i++) sum += a[i];      // 標準寫法（+= 與 i++ 見 09/17）

for (int x : a) cout << x << ' ';             // C++11 range-based for
```

`for (int x : a)` 讀作「對 `a` 裡的每一個元素 `x`」。**注意**：`x` 是複製品，改 `x` 不會改到陣列；要改就寫 `for (int& x : a) x *= 2;`——這個 `&` 跟 [10/01 的參考參數](/2026/09/09/nsysu-c-programming/1001-parameters/)是同一個，`x` 不是複製品，而是陣列裡那一格的**別名**。

**用 `const int N` 而不是直接寫 5**：陣列大小改成 10 時只要改一個地方，迴圈條件自動跟著對。

## 陣列傳進函式

陣列傳進函式時**不會複製整個陣列**，傳的是「第一格的**位址**」——位址就是那格記憶體的**門牌號碼（細節等 [11/19 講指標](/2026/09/09/nsysu-c-programming/1119-pointers/)再展開）**。函式拿到的是**第一格的門牌**，不是整排格子的影本——它照門牌找得到第一格、也改得動裡面的值，但沒人告訴它這排總共有幾格。後果有三個：

1. 函式**可以改到**原陣列（就算沒寫 `&`）。
2. 函式**不知道陣列多長**，所以一定要**額外傳長度**。
3. 函式裡**不能**對陣列參數用 range-based for：`for (int x : a)` 會編譯失敗，訊息是 `'begin' was not declared in this scope`。原因就是第 2 點——編譯器不知道該在哪裡停。函式裡一律寫 `for (int i = 0; i < n; i++)`。

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

`const int a[]` 就是 [10/01 的 `const`](/2026/09/09/nsysu-c-programming/1001-parameters/)——對讀者和編譯器宣告「只讀不寫」，手滑寫進去會直接編譯失敗。參數列裡的 `[]` **寫了大小也沒用**（編譯器會忽略它，反而騙了讀程式的人），所以一律留空；這跟雷區 ② 的「宣告陣列時大小必須是常數」是兩回事。

### 為什麼不能回傳區域陣列

同一個原因還會咬你一口：陣列**不能直接回傳**。這樣寫會出事：

```cpp
int* makeArray() {           // int* 是「存放位址」的型別，叫指標，11/19 才正式教
    int a[5] = {1, 2, 3, 4, 5};
    return a;                // 陣列名字單獨出現時值就是第一格的位址，所以型別是 int*
}                            // 但 a 在函式結束的瞬間就消失了
```

編譯器會給 `warning: address of local variable 'a' returned`，執行結果是垃圾值或當掉——區域陣列在函式結束時就被回收，回傳的位址指向一塊已經不屬於你的記憶體。標準作法是**由呼叫端準備好陣列，函式只負責填**：

```cpp
#include <iostream>
using namespace std;

void fillSquares(int a[], int n) {      // 函式不製造陣列，只填內容
    for (int i = 0; i < n; i++) a[i] = i * i;
}

int main() {
    int a[5];                            // 陣列由呼叫端宣告
    fillSquares(a, 5);
    for (int i = 0; i < 5; i++) {
        if (i > 0) cout << ' ';
        cout << a[i];
    }
    cout << '\n';
    return 0;
}
```

輸出：

```text
0 1 4 9 16
```

另一種作法是用 `new` 在「函式結束也不會消失」的地方配置記憶體，那要等到[指標那一節](/2026/09/09/nsysu-c-programming/1119-pointers/)才會教。

## 部分填滿的陣列

陣列大小必須是常數（雷區 ②），可是要讀幾筆資料常常執行時才知道——只好先開夠大的 100 格，實際可能只用 47 格。做法是**另外用一個變數記住有效長度**：**容量**（總共幾格）和**目前長度**（用了幾格）是兩個不同的數字，傳進函式時兩個都要傳。

```cpp
#include <iostream>
using namespace std;

const int MAX = 100;

// used = 目前用了幾格，capacity = 總共有幾格
void push(int a[], int& used, int capacity, int value) {
    if (used < capacity) a[used++] = value;   // 先拿目前的 used 當索引，再把 used 加 1
}

int main() {
    int a[MAX];
    int used = 0;                 // 一格都還沒用

    push(a, used, MAX, 10);
    push(a, used, MAX, 20);
    push(a, used, MAX, 30);

    for (int i = 0; i < used; i++) {      // 上界是 used，不是 MAX
        if (i > 0) cout << ' ';
        cout << a[i];
    }
    cout << '\n';
    return 0;
}
```

輸出：

```text
10 20 30
```

參數列裡 `used` 前面那個 `&` 就是 [10/01 的傳參考](/2026/09/09/nsysu-c-programming/1001-parameters/)：`push` 改掉「用了幾格」要讓 `main` 看得見，所以必須傳參考；`capacity`、`value` 只是讀進來看，傳值就夠。`a` 沒寫 `&` 也改得到則是另一回事——陣列傳的是第一格位址，兩者別混著記。

本週練習題 Q1–Q3 用的就是這個模式：宣告 `a[100]`、讀進 `n` 個，之後每個迴圈的上界都是 `n` 而不是 100。

## 搜尋與排序

### 線性搜尋

```cpp
#include <iostream>
using namespace std;

// 找 target：找到回傳「索引」，找不到回傳 -1
int search(const int a[], int n, int target) {
    for (int i = 0; i < n; i++)
        if (a[i] == target) return i;
    return -1;
}

int main() {
    int a[5] = {3, 1, 4, 1, 5};
    cout << search(a, 5, 4) << ' ' << search(a, 5, 9) << '\n';
    return 0;
}
```

輸出：

```text
2 -1
```

回傳 `-1` 代表「找不到」是很常見的約定，因為 `-1` 不可能是合法索引。

### 選擇排序（selection sort）

每一輪找出剩下元素中最小的，換到前面。

```cpp
#include <iostream>
using namespace std;

void selectionSort(int a[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;                          // 先假設剩下的裡面 a[i] 最小
        for (int j = i + 1; j < n; j++)
            if (a[j] < a[minIdx]) minIdx = j;    // 找到更小的就記住索引
        if (minIdx != i) {
            int t = a[i]; a[i] = a[minIdx]; a[minIdx] = t;
        }
    }
}

int main() {
    int a[5] = {5, 1, 4, 2, 8};
    selectionSort(a, 5);
    for (int i = 0; i < 5; i++) {
        if (i > 0) cout << ' ';
        cout << a[i];
    }
    cout << '\n';
    return 0;
}
```

輸出：

```text
1 2 4 5 8
```

過程長這樣：

```text
{5,1,4,2,8}  i=0：後面最小是 1，跟 a[0] 交換 → {1,5,4,2,8}
             i=1：後面最小是 2，跟 a[1] 交換 → {1,2,4,5,8}
             i=2、i=3：minIdx == i，已經就位，不交換
```

`int t = a[i]; a[i] = a[minIdx]; a[minIdx] = t;` 是三個敘述擠在同一行——C++ 只看分號、不看你怎麼斷行，一行寫幾個敘述都可以。這三步就是 [10/01 `swapValues`](/2026/09/09/nsysu-c-programming/1001-parameters/) 的交換手法：先把 `a[i]` 存進暫存的 `t`，才不會在搬動時把它蓋掉。外層只跑到 `i = n-2`，因為前 `n-1` 格都挑定之後，剩下的最後一格必然已經是最大的，不用再挑。

### 氣泡排序（bubble sort）

相鄰兩兩比較，把大的往後推。

```cpp
void bubbleSort(int a[], int n) {
    for (int i = 0; i < n - 1; i++)
        for (int j = 0; j < n - 1 - i; j++)
            if (a[j] > a[j + 1]) {               // 前面比後面大就交換
                int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
            }
}
```

把上面那個程式的 `selectionSort(a, 5);` 換成 `bubbleSort(a, 5);`，輸出一模一樣是 `1 2 4 5 8`——排序法不同、結果相同，差別只在過程。輪到第 `i` 輪時，前面已經跑過 `i` 輪，最後面 `i` 格都是最大的那幾個、確定就位了，不用再比，所以內層上界是 `n - 1 - i` 而不是 `n - 1`。這兩種排序都是 $O(n^2)$，這是描述演算法快慢的通用寫法，意思是資料量 10 倍、時間約 100 倍。

> **進階**：氣泡排序可以多一個 `bool swapped`，某一輪完全沒交換就代表已經排好，直接 `break` 提早結束。

### 為什麼不讓你用 std::sort

實務上會直接寫 `sort(a, a + n);`——`sort` 跟 [09/24](/2026/09/09/nsysu-c-programming/0924-flow-control/) 用過的 `max`、`min` 住在同一個函式庫，所以檔案最上面要多一行 `#include <algorithm>`，忘了會得到 `error: 'sort' was not declared in this scope`。兩個引數是「開頭」與「結尾的下一格」：`a` 是第一格的位址、`a + n` 是第 `n` 格的位址。它是 $O(n \log n)$，資料一多就把手寫版甩開——但實驗課要的是**手寫版**，目的是練陣列操作，交作業用 `sort` 會沒分。

## 二維陣列

**白話說**：二維陣列就是「表格」，`g[i][j]` 是第 `i` 列第 `j` 行；走訪要用**巢狀迴圈**，外層跑列、內層跑行。

```cpp
int g[3][4] = {
    {1,  2,  3,  4},
    {5,  6,  7,  8},
    {9, 10, 11, 12}
};
cout << g[1][2] << '\n';        // 7：第 1 列第 2 行
```

初始化時**每一組內層大括號就是一列**，由上而下對應第 0、1、2 列，外層那組包住整個陣列。

**二維陣列在記憶體裡其實是攤平的**：`int g[3][4]` 是 **12 個連續的整數**，一列接一列排好（所以寫成一長串 `int g[3][4] = {1,2,3,4,5,6,7,8,9,10,11,12};` 也合法，只是分組好讀得多）。

```text
   g[0][0..3]      g[1][0..3]      g[2][0..3]
 ┌──┬──┬──┬──┐  ┌──┬──┬──┬──┐  ┌──┬──┬──┬──┐
 │ 1│ 2│ 3│ 4│  │ 5│ 6│ 7│ 8│  │ 9│10│11│12│
 └──┴──┴──┴──┘  └──┴──┴──┴──┘  └──┴──┴──┴──┘
```

所以 `g[i][j]` 的實際位置是第 `i * 4 + j` 個格子，那個 **4 就是第二維**。函式只拿到第一格的位址，你不告訴它 4，它就算不出第 `i` 列從哪裡開始——這就是為什麼傳進函式時，**第一維可以留空、第二維（以及之後每一維）的大小必須寫死**：

```cpp
#include <iostream>
using namespace std;

void printGrid(const int g[][4], int rows) {   // 第一維留空、第二維寫死
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < 4; j++) {
            if (j > 0) cout << ' ';
            cout << g[i][j];
        }
        cout << '\n';
    }
}

int main() {
    int g[3][4] = {
        {1,  2,  3,  4},
        {5,  6,  7,  8},
        {9, 10, 11, 12}
    };
    printGrid(g, 3);      // 直接傳陣列名，第二維編譯器已經知道了
    return 0;
}
```

輸出：

```text
1 2 3 4
5 6 7 8
9 10 11 12
```

> 印表格時很多人圖方便寫成 `cout << g[i][j] << '\t';`，這樣每列**尾端會多一個 tab**。自己看沒差，但實驗課如果是自動比對輸出就會被判錯——用上面 `if (j > 0) cout << ' ';` 的寫法才安全（Q5、Q6 解答也是這樣寫）。

## 本週重點回顧

- 索引 **0 到 n-1**，迴圈用 `i < n`，越界沒人擋你。
- 陣列參數必配一個長度參數；只讀就加 `const`，`[]` 不寫大小。
- 函式改得到原陣列，但**不能回傳區域陣列**——呼叫端備陣列，函式只負責填。
- 部分填滿：迴圈上界用**目前長度**，不是容量。
- 二維陣列參數的**第二維必須寫死**。
- 排序要**自己手寫**（交作業用 `std::sort` 沒分）；搜尋找不到就回傳 `-1`。

## 本週練習題

**Q1. 讀入與反轉**
讀入 `n`（`n ≤ 100`）與 `n` 個整數，反轉後輸出。

```text
輸入：
5
1 2 3 4 5
輸出：
5 4 3 2 1
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

int main() {
    const int MAX = 100;
    int a[MAX], n;                  // 兩個宣告寫在一起：a 是陣列、n 是普通整數
    cin >> n;
    for (int i = 0; i < n; i++) cin >> a[i];

    for (int i = 0; i < n / 2; i++) {        // 只要跑一半
        int t = a[i];
        a[i] = a[n - 1 - i];
        a[n - 1 - i] = t;
    }
    for (int i = 0; i < n; i++) {
        if (i > 0) cout << ' ';
        cout << a[i];
    }
    cout << '\n';
    return 0;
}
```

`int a[MAX], n;` 裡的 `[MAX]` 只跟緊鄰在它前面的名字有關，所以 `n` 是普通整數、不是陣列。

</details>

**Q2. 最大值與其索引**
讀入 `n`（`1 ≤ n ≤ 100`）與 `n` 個整數，輸出最大值以及它**第一次出現**的索引（從 0 起算）。

```text
輸入：
6
3 9 2 9 1 4
輸出：
max = 9 at index 1
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
讀入 `n`（`1 ≤ n ≤ 100`）與 `n` 個整數，手寫排序後輸出中位數（`n` 為奇數取正中間，偶數取中間兩數的平均，保留一位小數）。

```text
輸入：
4
7 1 3 9
輸出：
median = 5.0
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
    else            median = (static_cast<double>(a[n / 2 - 1]) + a[n / 2]) / 2.0;   // 先轉 double 再相加

    cout << "median = " << fixed << setprecision(1) << median << '\n';
    return 0;
}
```

偶數的情況**先把其中一個轉成 `double` 再相加**，不是只在最後除以 `2.0`：兩個 `int` 先相加可能溢位（兩個 15 億相加就爆了，結果會是負數），之後再怎麼除都救不回來。`n ≥ 1` 的限制也不是多寫的——`n = 0` 時 `a[n / 2]` 讀的是沒填過的格子。

</details>

**Q4. 分數長條圖**
讀入 `n` 與 `n` 個 0–100 的分數，統計各區間人數（0–59、60–69、70–79、80–89、90–100），用 `*` 畫出長條圖。

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
讀入 `n`、`m`（皆 ≤ 50）與一個 $n \times m$ 的矩陣，輸出它的轉置（$m \times n$）。

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

**Q6. 矩陣相乘（加分題／進階）**
第一行讀入 `n`、`m`、`p`（皆 ≤ 50），接著讀入 $n \times m$ 矩陣 A 與 $m \times p$ 矩陣 B，輸出 $A \times B$。不熟二維陣列的話，先把 Q5 練熟再回來。

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
    int A[MAX][MAX], B[MAX][MAX], C[MAX][MAX];
    int n, m, p;
    cin >> n >> m >> p;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++) cin >> A[i][j];
    for (int i = 0; i < m; i++)
        for (int j = 0; j < p; j++) cin >> B[i][j];

    for (int i = 0; i < n; i++)
        for (int j = 0; j < p; j++) {
            C[i][j] = 0;                     // 累加之前一定要歸零
            for (int k = 0; k < m; k++)      // k 掃過「A 的第 i 列」和「B 的第 j 行」
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

**實驗課題型加練**
以下照**去年（2025）第 5、6 週**實驗課的練習與歷年實驗課考卷的題型改寫（今年的投影片還沒出，題目可能會換）。陣列這週的實驗課一定有「二維陣列當棋盤／座位表」的題目（訂票系統、井字棋年年輪流出現），排序則要求你**印出每一輪的過程**——這是助教確認你不是呼叫 `sort` 的方法。

**Q7. 電影院訂票系統**
座位是 10 × 10 的二維陣列，左上角是 `[0][0]`、右下角是 `[9][9]`，四個角落不開放。反覆讀入「列 行」，成功就登記成 `O`；位置已被訂、在角落或超出範圍就印 `Booking Error`。讀到 `-1` 結束並印出整張座位表。

```text
輸入：
2 3
2 3
0 0
9 5
-1
輸出：
booked (2, 3)
Booking Error
Booking Error
booked (9, 5)
   0123456789
0  #........#
1  ..........
2  ...O......
3  ..........
4  ..........
5  ..........
6  ..........
7  ..........
8  ..........
9  #....O...#
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

const int N = 10;

void printSeats(const char seats[][N]) {
    cout << "   ";
    for (int c = 0; c < N; c++) cout << c;
    cout << '\n';
    for (int r = 0; r < N; r++) {
        cout << r << "  ";
        for (int c = 0; c < N; c++) cout << seats[r][c];
        cout << '\n';
    }
}

bool isCorner(int r, int c) {
    return (r == 0 || r == N - 1) && (c == 0 || c == N - 1);
}

int main() {
    char seats[N][N];
    for (int r = 0; r < N; r++)
        for (int c = 0; c < N; c++)
            seats[r][c] = isCorner(r, c) ? '#' : '.';

    int r, c;
    while (true) {
        cin >> r;
        if (r == -1) break;
        cin >> c;
        if (r < 0 || r >= N || c < 0 || c >= N || seats[r][c] != '.') {
            cout << "Booking Error\n";
            continue;
        }
        seats[r][c] = 'O';
        cout << "booked (" << r << ", " << c << ")\n";
    }
    printSeats(seats);
    return 0;
}
```

三個重點：用 `char` 陣列存座位狀態，一格一個字元，印表格最方便；「不能訂」的三種情況（越界、已訂、角落）**先判斷越界**，否則 `seats[r][c]` 本身就越界了；讀 `-1` 要在讀第二個數之前檢查，不然會多吃一個數。

</details>

**Q8. 井字棋**
3 × 3 棋盤的格子編號 0–8。兩人輪流輸入格子編號，第一回合下 `O`、第二回合下 `X`，依此輪流；下到已有棋子的格子要重新輸入（回合數不變）。每一步都印出回合數與盤面，有人連成一線印 `O win!` 或 `X win!`，九格下滿沒人贏印 `draw`。

```text
輸入： 4 0 4 2 6 3 8 5
輸出（節錄後三步）：
Round 6: X -> 8
X . O
O O .
X . X
Round 7: O -> 5
X . O
O O O
X . X
O win!
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

void printBoard(const char b[]) {
    for (int i = 0; i < 9; i++) {
        cout << b[i];
        cout << ((i % 3 == 2) ? '\n' : ' ');
    }
}

// 回傳 'O' 或 'X' 表示誰連線；沒有人就回傳 ' '
char winner(const char b[]) {
    const int lines[8][3] = {{0,1,2},{3,4,5},{6,7,8},   // 三列
                             {0,3,6},{1,4,7},{2,5,8},   // 三行
                             {0,4,8},{2,4,6}};          // 兩條對角線
    for (int i = 0; i < 8; i++) {
        char a = b[lines[i][0]], c = b[lines[i][1]], d = b[lines[i][2]];
        if (a == c && c == d && a != '.') return a;
    }
    return ' ';
}

int main() {
    char board[9];
    for (int i = 0; i < 9; i++) board[i] = '.';
    printBoard(board);

    int round = 1;
    while (round <= 9) {
        char mark = (round % 2 == 1) ? 'O' : 'X';
        int pos;
        cin >> pos;
        if (pos < 0 || pos > 8 || board[pos] != '.') {
            cout << "taken, try again\n";
            continue;                          // 回合數不變
        }
        board[pos] = mark;
        cout << "Round " << round << ": " << mark << " -> " << pos << '\n';
        printBoard(board);
        char w = winner(board);
        if (w != ' ') {
            cout << w << " win!\n";
            return 0;
        }
        round++;
    }
    cout << "draw\n";
    return 0;
}
```

完整輸出（輸入的第三個 `4` 會被拒絕）：

```text
. . .
. . .
. . .
Round 1: O -> 4
. . .
. O .
. . .
Round 2: X -> 0
X . .
. O .
. . .
taken, try again
Round 3: O -> 2
X . O
. O .
. . .
Round 4: X -> 6
X . O
. O .
X . .
Round 5: O -> 3
X . O
O O .
X . .
Round 6: X -> 8
X . O
O O .
X . X
Round 7: O -> 5
X . O
O O O
X . X
O win!
```

八條連線（三列、三行、兩對角）寫成一個 `lines[8][3]` 常數表，`winner` 只要跑一個迴圈，比寫八個 `if` 乾淨得多，也是二維陣列「當查表用」的典型例子。盤面用一維 `char board[9]` 存，印的時候每三個換行，`i % 3 == 2` 就是「這一列的最後一格」。

</details>

**Q9. 排序過程逐步印出**
第一個輸入選排序法（1 氣泡、2 選擇），第二個輸入是數量 `n`（`1 ≤ n ≤ 100`），接著 `n` 個整數（允許負數與重複）。氣泡排序每完成一輪就印一次陣列；選擇排序每**實際交換**一次就印一次。最後印出遞增結果。兩種排序各寫一個函式。

```text
輸入：
2 5
7 -2 7 4 1
輸出：
swap a[0] <-> a[1]: -2 7 7 4 1
swap a[1] <-> a[4]: -2 1 7 4 7
swap a[2] <-> a[3]: -2 1 4 7 7
sorted: -2 1 4 7 7
```

```text
輸入：
1 4
3 1 2 0
輸出：
pass 1: 1 2 0 3
pass 2: 1 0 2 3
pass 3: 0 1 2 3
sorted: 0 1 2 3
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

void printArray(const int a[], int n) {
    for (int i = 0; i < n; i++) cout << a[i] << (i + 1 < n ? " " : "\n");
}

void bubbleSort(int a[], int n) {
    for (int pass = 0; pass < n - 1; pass++) {
        for (int i = 0; i + 1 < n - pass; i++)
            if (a[i] > a[i + 1]) { int t = a[i]; a[i] = a[i + 1]; a[i + 1] = t; }
        cout << "pass " << pass + 1 << ": ";
        printArray(a, n);
    }
}

void selectionSort(int a[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++)
            if (a[j] < a[minIdx]) minIdx = j;
        if (minIdx != i) {                     // 真的有交換才印
            int t = a[i]; a[i] = a[minIdx]; a[minIdx] = t;
            cout << "swap a[" << i << "] <-> a[" << minIdx << "]: ";
            printArray(a, n);
        }
    }
}

int main() {
    const int MAX = 100;
    int method, n, a[MAX];
    cin >> method >> n;
    for (int i = 0; i < n; i++) cin >> a[i];

    if (method == 1) bubbleSort(a, n);
    else             selectionSort(a, n);
    cout << "sorted: ";
    printArray(a, n);
    return 0;
}
```

跟正文的兩個排序完全相同，只是在對的位置多一行 `printArray`：氣泡排序的「一輪」是外層迴圈跑完一次，選擇排序的「一次交換」是內層找完最小值之後。`printArray` 抽成函式是因為要印很多次；`if (minIdx != i)` 讓「最小值就在原位」的那輪不印。

</details>

**Q10. 巴斯卡三角形**
讀入 `N`（1 ≤ N ≤ 15），印出前 `N` 列的巴斯卡三角形：每列頭尾是 1，中間每個數是「左上 + 正上」。每個數用 `setw(5)` 印。

```text
輸入： 6
輸出：
    1
    1    1
    1    2    1
    1    3    3    1
    1    4    6    4    1
    1    5   10   10    5    1
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    const int MAX = 15;
    int n;
    cin >> n;
    if (n < 1 || n > MAX) {
        cout << "invalid\n";
        return 0;
    }
    int tri[MAX][MAX] = {};                 // 全部先歸零
    for (int r = 0; r < n; r++) {
        tri[r][0] = tri[r][r] = 1;          // 每列頭尾都是 1
        for (int c = 1; c < r; c++)
            tri[r][c] = tri[r - 1][c - 1] + tri[r - 1][c];   // 左上 + 正上
    }
    for (int r = 0; r < n; r++) {
        for (int c = 0; c <= r; c++) cout << setw(5) << tri[r][c];
        cout << '\n';
    }
    return 0;
}
```

先把整張表算好再印，比「邊算邊印」好想：`tri[r][c] = tri[r-1][c-1] + tri[r-1][c]` 就是題目的定義。`int tri[MAX][MAX] = {};` 是二維陣列全部歸零的寫法。這題期末筆試會改成「用遞迴算第 r 列第 c 個數」，遞迴式一模一樣。

</details>

**Q11. 最大最小交替輸出**
讀入 `n`（`1 ≤ n ≤ 100`）與 `n` 個整數，依「最大、最小、次大、次小、…」的順序印出。請先排序再用兩個索引從兩端往中間走。

```text
輸入：
7
4 -3 9 0 7 2 -8
輸出： 9 -8 7 -3 4 0 2
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

int main() {
    const int MAX = 100;
    int n, a[MAX];
    cin >> n;
    for (int i = 0; i < n; i++) cin >> a[i];

    // 選擇排序（由小到大）
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++)
            if (a[j] < a[minIdx]) minIdx = j;
        int t = a[i]; a[i] = a[minIdx]; a[minIdx] = t;
    }

    // 兩根手指：hi 從最後往前、lo 從最前往後，輪流印
    int lo = 0, hi = n - 1;
    while (lo <= hi) {
        cout << a[hi];
        if (lo < hi) cout << ' ' << a[lo];
        lo++; hi--;
        if (lo <= hi) cout << ' ';
    }
    cout << '\n';
    return 0;
}
```

排好之後答案就在陣列兩端，`hi` 從尾巴往前、`lo` 從頭往後，兩根手指交錯（`lo <= hi` 時繼續）。`n` 是奇數時最後只剩中間一個，`if (lo < hi)` 擋住不要重複印。這種「排序後兩端夾」的手法後面很多題都會再用到。

</details>

---

[← 10/01｜參數傳遞與函式重載（Ch 4）](/2026/09/09/nsysu-c-programming/1001-parameters/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [10/15｜結構與類別（Ch 5–6） →](/2026/09/09/nsysu-c-programming/1015-struct-class/)
