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

> **全域**變數不要取名叫 `size`：C++17 起標準函式庫有 `std::size`，`using namespace std;` 會把它拉進來跟全域的 `size` 撞名，得到 `error: reference to 'size' is ambiguous`（寫在函式裡的 `size` 會遮蔽掉它、不會出錯，但取名 `used`、`len` 還是清楚得多）。

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

## 本節重點回顧

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
讀入 `n`（`n ≤ 100`）與 `n` 個整數，輸出最大值以及它**第一次出現**的索引（從 0 起算）。

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
讀入 `n`（`n ≤ 100`）與 `n` 個整數，手寫排序後輸出中位數（`n` 為奇數取正中間，偶數取中間兩數的平均，保留一位小數）。

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
    else            median = (a[n / 2 - 1] + a[n / 2]) / 2.0;   // 記得 2.0

    cout << "median = " << fixed << setprecision(1) << median << '\n';
    return 0;
}
```

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

---

[← 10/01｜參數傳遞與函式重載（Ch 4）](/2026/09/09/nsysu-c-programming/1001-parameters/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [10/15｜結構與類別（Ch 5–6） →](/2026/09/09/nsysu-c-programming/1015-struct-class/)
