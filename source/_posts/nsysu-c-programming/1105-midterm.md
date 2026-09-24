---
title: 11/05｜期中上機考（範圍 Ch 1–6）
date: 2026-09-10
updated: 2026-09-12
permalink: 2026/09/09/nsysu-c-programming/1105-midterm/
cover: /images/code-cover.jpg
categories: [程式設計]
tags: [C++, 中山大學, 自學指南]
description: 中山大學 C 程式設計自學指南的期中上機考準備（範圍 Ch 1–6）：考前複習清單、上機考當天流程，以及兩份可計時練習的模擬上機考與解答。
toc: true
comments: true
hidden: true
---

[← 10/29｜vector 與運算子重載入門（Ch 7）](/2026/09/09/nsysu-c-programming/1029-vector-operator/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [11/12｜運算子重載、friend 與 string（Ch 8、Ch 9） →](/2026/09/09/nsysu-c-programming/1112-operator-string/)

期中考是**上機考**，也是多數人第一次在考場上寫程式。這篇給你三樣東西：考前一週的複習清單、考場流程、一份可以計時做完的五題模擬考與完整解答。（這是**主課**的期中考；實驗課沒有期中考，它自己的上機考在期末，題型見文末。）

範圍到 **Ch6 的 class 基礎**為止：

```text
基本語法 → 流程控制 → 函式與參數傳遞 → 陣列（含二維） → struct / class（存取控制、setter/getter、const 成員函式）
```

**不包含建構子、`vector`、運算子重載**——課綱寫的期中範圍就是 Ch1–Ch6，而這三樣屬於 Ch7 之後，所以 10/22、10/29 這兩週留到期末。現在不用複習它們，但別忘了期末全考。

## 考前一週的複習清單

老師說過期中考**幾乎全部從課本勾選的習題出**（總覽頁那張表的「課本指定習題」欄，Ch1–Ch6），所以第一件事是把那些題目每一題自己寫過一遍。接著下面每一項都要做到不看筆記能寫出來（括號是對應的模擬考題號）：

- ☐ 格式化輸出：`fixed << setprecision(n)` 控小數位（→ Q1、Q4、Q5）、`setw(n)` 控欄寬（→ Q4）、`setfill('0')` 補零（模擬考沒出，自己拿 Q4 多加一欄練）
- ☐ 函式三件事：回傳 `bool` 的判斷函式（→ Q2）、用 `double&` 一次帶回兩個結果（→ Q1）、同名函式重載三個版本（模擬考沒出，自己補一題）
- ☐ 一維陣列：讀入與累加（→ Q1）、找最大值與索引、手寫排序（→ Q4）、反轉（模擬考沒出，自己補一題）
- ☐ 二維陣列：讀入、印出、轉置、每列每行求和（→ Q3）
- ☐ `struct`：定義、陣列、傳進函式、整包交換（→ Q4）
- ☐ `class`：private 資料 + public setter + `const` 成員函式（→ Q5）、getter（自己補）
- ☐ 默寫〈環境設置〉那份模組化 Makefile（助教範本的形式：變數＋每題兩行），`make clean && make` 通過且**零警告**（不用自己發明，背熟就好）

`+=`、`i++`、單獨一行的 `cout << fixed << setprecision(2);`——這三個寫法忘了就回 [09/17](/2026/09/09/nsysu-c-programming/0917-cpp-basics/) 翻。另外主課的期中題目通常會先給你數量 `n`，用 `for` 讀就好；「讀到結束值才停」的寫法是實驗課考題的習慣，見下面第二份模擬考。

## 上機考當天的流程

1. **開場三分鐘先搭架子**，不要一上來就衝第一題：
   ```bash
   mkdir B1130xxxxx && cd B1130xxxxx
   nano Makefile        # 貼上默背好的模組化 Makefile
   ```
   （這裡的 `&&` 是 shell 的「前一個指令成功才做下一個」，跟 C++ 的邏輯 `&&` 沒有關係。）之後每題只是新增 `Qn.cpp`，`make` 一下全部編好。
2. **先掃過五題**，從最有把握的開始，不要卡在第一題。
3. **每寫完一題就 `make` 並跑題目給的範例**，警告當場清掉。
4. **剩 15 分鐘停止寫新功能**，改成 `make clean && make` 確認乾淨重編沒問題。
5. **打包後找助教確認**：
   ```bash
   make clean           # 重編確認過了才打包，zip 裡只留原始碼（.cpp、.h）和 Makefile
   cd ..
   zip -r B1130xxxxx.zip B1130xxxxx/
   ```

完整繳交規則見[〈環境設置〉](/2026/09/09/nsysu-c-programming/setup/)。兩條會要命的：**Makefile 編不過 = 0 分**、**有任何警告或錯誤扣 2 分**。

## 模擬上機考（建議計時 90 分鐘）

正式期中考依 1151 學期課程資料是 90 分鐘五題（實際題數與時間以當學期公告為準），這份模擬考照同樣的量設計。時間是**總量**參考、不是順序（順序照上面第 2 步，從最有把握的開始）：Q2、Q5 各 10 分鐘，Q1、Q3 各 15 分鐘，Q4 最久 25 分鐘，留 15 分鐘機動與重編打包。

解答裡有不少 `for` 沒加大括號——跟 09/17 講 `if` 時同一條規則：`for`、`while` 後面也只管**一個**敘述，而那個敘述可以是一行程式，也可以是另一個 `for`（Q3 的兩層迴圈就是這樣）。決定範圍的是語法不是縮排，自己寫還是建議一律加。

**Q1. 平均與標準差**
讀入 `n`（`1 ≤ n ≤ 1000`）與 `n` 個整數，輸出平均與**母體**標準差，各保留兩位小數。計算的部分要寫成獨立函式，用兩個 `double&` 參數把平均與標準差一起帶回 `main`。

$$\mu = \frac{1}{n}\sum x_i, \qquad \sigma = \sqrt{\frac{1}{n}\sum (x_i - \mu)^2}$$

```text
輸入：
5
2 4 4 4 5
輸出：
mean = 3.80
sd = 0.98
```

**Q2. 完全數**
讀入 `n`，輸出 1 到 `n` 之間所有的完全數（除了自己以外的因數總和等於自己，例如 6 = 1+2+3）。請把「判斷是否為完全數」寫成獨立函式。

```text
輸入： 500
輸出： 6 28 496
```

**Q3. 矩陣的行列總和與轉置**
讀入 `n`、`m`（都不超過 100）與矩陣，輸出每一列的和、每一行的和，最後印出這個矩陣的轉置。

```text
輸入：
2 3
1 2 3
4 5 6
輸出：
row sums: 6 15
col sums: 5 7 9
transpose:
1 4
2 5
3 6
```

**Q4. 圖書資料**
定義 `struct Book { string title; string author; int year; double price; };`，讀入 `n` 本書（`n ≤ 1000`），每行一本：`書名 作者 年份 價格`，其中**書名與作者都保證是不含空白的單字**（含空白的字串要等 Ch9 學會 `getline` 才處理得了）。輸出：

1. 價格最高的書名
2. 依出版年由舊到新排序後的完整清單，由 `void printBook(const Book& b)` 負責輸出，每行印「年份 書名 作者 價格」四欄：年份在行首直接印、不補寬，其餘三欄分別是 `setw(12)`、`setw(10)`、`setw(8)`

```text
輸入：
3
C++Primer Lippman 2012 45.5
SICP Abelson 1985 60
K&R Ritchie 1978 30.25
輸出：
most expensive: SICP
1978         K&R   Ritchie   30.25
1985        SICP   Abelson   60.00
2012   C++Primer   Lippman   45.50
```

**Q5. 矩形類別**
寫 `class Rectangle`，private 資料為寬高，提供 setter（負數視為 0）、`area()`、`perimeter()`、`isSquare()`，全部唯讀函式都要加 `const`。讀入寬高後印出三個結果，面積與周長保留兩位小數。

```text
輸入： 3 4
輸出：
area = 12.00
perimeter = 14.00
square? no
```

<details>
<summary><b>Q1 參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
#include <cmath>
using namespace std;

const int MAX = 1000;

// 用兩個參考參數一次把平均與標準差帶回 main
void analyze(const int a[], int n, double& mean, double& sd) {
    double sum = 0;
    for (int i = 0; i < n; i++) sum += a[i];
    mean = sum / n;

    double var = 0;
    for (int i = 0; i < n; i++) var += (a[i] - mean) * (a[i] - mean);
    var /= n;                       // 母體：分母是 n
    sd = sqrt(var);
}

int main() {
    int a[MAX], n;
    cin >> n;
    for (int i = 0; i < n; i++) cin >> a[i];

    double mean, sd;
    analyze(a, n, mean, sd);

    cout << fixed << setprecision(2);
    cout << "mean = " << mean << '\n';
    cout << "sd = " << sd << '\n';
    return 0;
}
```

**考點與常見扣分**：母體標準差的分母是 `n` 不是 `n - 1`；忘了 `fixed` 的話 3.8 會印成 `3.8` 而不是 `3.80`，格式不符就算錯。陣列大小照題目的上限開（這題是 1000），開太小會寫爆陣列——可能當場 `*** stack smashing detected ***` 或 `Segmentation fault`，也可能一聲不響地把別的變數改壞（10/08〈雷區①〉的三種症狀），偏偏編譯器完全不會擋你；題目寫明 `n ≤ 10000` 就開 10000。**題目沒給上限就舉手問助教**——猜一個「看起來夠大」的數字不是解法，固定大小的陣列本來就裝不下未知數量的資料，真正的解是 10/29 的 `vector`。

</details>

<details>
<summary><b>Q2 參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

bool isPerfect(int n) {
    if (n < 2) return false;           // 1 不是完全數
    int sum = 0;
    for (int i = 1; i < n; i++)        // 掃過所有比 n 小的數
        if (n % i == 0) sum += i;      // 整除就是因數，累加起來
    return sum == n;
}

int main() {
    int n;
    cin >> n;
    bool first = true;
    for (int i = 2; i <= n; i++) {
        if (isPerfect(i)) {
            if (!first) cout << ' ';   // 第一個數字前不印空白，避免行尾多一格
            cout << i;
            first = false;
        }
    }
    cout << '\n';
    return 0;
}
```

**考點與常見扣分**：題目明講「寫成獨立函式」，寫在 `main` 裡就不合規格。邊界是 `1`（不是完全數，所以 `n < 2` 直接回 `false`）。`first` 旗標只是為了讓數字之間有空白、行尾沒有多餘空白。

> **進階**：因數成雙成對出現（找到 2 就同時知道 6 / 2 = 3），所以有一種只掃到 `i * i <= n` 的寫法快很多，但要另外處理 `i = 1`（配出來的 `n / 1` 是 `n` 自己）與平方數（那一對是同一個因數）兩個特例。`n ≤ 500` 用不到——上機考先求對，別急著優化。

</details>

<details>
<summary><b>Q3 參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

const int MAX = 100;                   // 陣列大小要在編譯時就確定，所以用 const int

int main() {
    int a[MAX][MAX], n, m;
    cin >> n >> m;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++) cin >> a[i][j];

    cout << "row sums:";               // 固定 i，掃 j
    for (int i = 0; i < n; i++) {
        int s = 0;
        for (int j = 0; j < m; j++) s += a[i][j];
        cout << ' ' << s;
    }
    cout << '\n';

    cout << "col sums:";               // 固定 j，掃 i（內外層剛好對調）
    for (int j = 0; j < m; j++) {
        int s = 0;
        for (int i = 0; i < n; i++) s += a[i][j];
        cout << ' ' << s;
    }
    cout << '\n';

    cout << "transpose:\n";            // 轉置：印的時候把兩個索引對調
    for (int j = 0; j < m; j++) {
        for (int i = 0; i < n; i++) {
            if (i > 0) cout << ' ';
            cout << a[i][j];
        }
        cout << '\n';
    }
    return 0;
}
```

**考點與常見扣分**：陣列大小必須是**編譯時就確定的常數**，所以用 `const int MAX`，不能是 `int n; cin >> n; int a[n];` 這種執行時才知道的值（10/08〈雷區②〉）；寫在 `main` 裡或 `main` 外都合法，放外面只是多個函式共用比較方便。二維陣列別開太大——放在 `main` 裡的陣列全部加起來大約只有幾 MB 可用，`int a[2000][2000]`（約 16 MB）一跑就 `Segmentation fault`；`100 × 100` 這種題目夠用。分隔空白這裡用了兩種寫法：`row sums:` 前面已經有標籤，所以每個數字前都印一格；`transpose` 每行開頭不能有空白，改成「第一個不印、之後才印」——Q2 的 `first` 旗標是同一招。

</details>

<details>
<summary><b>Q4 參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
#include <string>
using namespace std;

const int MAX = 1000;

struct Book {
    string title;
    string author;
    int    year;
    double price;
};

void printBook(const Book& b) {        // const 參考：不複製、也保證不修改
    cout << b.year << setw(12) << b.title << setw(10) << b.author
         << setw(8) << b.price << '\n';   // 年份在行首不補寬，後面三欄各寫一次 setw
}

int main() {
    Book b[MAX];
    int n;
    cin >> n;
    for (int i = 0; i < n; i++)
        cin >> b[i].title >> b[i].author >> b[i].year >> b[i].price;

    int best = 0;
    for (int i = 1; i < n; i++) if (b[i].price > b[best].price) best = i;
    cout << "most expensive: " << b[best].title << '\n';

    for (int i = 0; i < n - 1; i++)                 // 依年份由舊到新排序
        for (int j = 0; j < n - 1 - i; j++)
            if (b[j].year > b[j + 1].year) {
                Book t = b[j]; b[j] = b[j + 1]; b[j + 1] = t;   // 整包交換
            }

    cout << fixed << setprecision(2);
    for (int i = 0; i < n; i++) printBook(b[i]);
    return 0;
}
```

**考點與常見扣分**：`Book t = b[j];` 是**整包交換**，不要四個欄位各換一次（漏一個就整筆錯位）。`setw` 只影響下一個輸出，所以三欄各寫一次；年份在行首、不需要補寬。

</details>

<details>
<summary><b>Q5 參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
using namespace std;

class Rectangle {
private:
    double w, h;

public:
    void setWidth(double x)  { w = (x >= 0) ? x : 0; }
    void setHeight(double x) { h = (x >= 0) ? x : 0; }

    double area() const      { return w * h; }
    double perimeter() const { return 2 * (w + h); }
    bool   isSquare() const  { return w == h; }
};

int main() {
    double w, h;
    cin >> w >> h;
    Rectangle r;
    r.setWidth(w);
    r.setHeight(h);

    cout << fixed << setprecision(2);
    cout << "area = " << r.area() << '\n';
    cout << "perimeter = " << r.perimeter() << '\n';
    cout << "square? " << (r.isSquare() ? "yes" : "no") << '\n';
    return 0;
}
```

**考點與常見扣分**：唯讀的成員函式一律加 `const`，漏掉必扣分。`isSquare()` 直接用 `==` 比兩個 `double` 在這題是安全的，因為 `w`、`h` 直接來自輸入、沒經過任何運算；**一旦值是算出來的**（例如 `w * 3 / 3`），就要改成 `fabs(w - h) < 1e-9`（`fabs` 在 `<cmath>`、`1e-9` 的科學記號寫法 10/29 講過），意思是「差距小到可以當作相等」。這題刻意不寫建構子（期中不考），但 10/22 已經學過了，考完之後自己寫類別請一律補上，否則物件一建立、setter 還沒呼叫之前就是垃圾值。

</details>

## 實驗課上機考題型（Ch 1–6 的部分）

實驗課是另一門課，有自己的期末上機考（佔實驗課成績 40%），題型就是每週練習題那種，歷年考卷的共同特徵：連續輸入、讀到 `0` 或 `0 0` 結束、輸出格式要一模一樣、一題只有全對或零分。下面六題只用 Ch 1–6 的內容，期中前就可以練；主課的期中考**不是**這種題型（幾乎全從課本勾選題出），別搞混。六題建議 90 分鐘。

實驗課考題有個習慣要先適應：**多半不給你數量 `n`**，而是「一直讀到某個結束值」，所以大部分題目的骨架都是 `while (true) { cin >> ...; if (結束條件) break; ... }`。

**Q1. 沙漏**
反覆讀入整數 `N`，`N` 是正奇數時印出高 `N` 列的沙漏（第一列 `N` 顆星、每列少兩顆到 1 顆、再加回 `N` 顆），否則印 `invalid`；讀到 `0` 結束。星號前面要補空白讓圖形置中，星號後面不印空白。

```text
輸入：
5
4
1
0
輸出：
*****
 ***
  *
 ***
*****
invalid
*
```

**Q2. 質數原地降冪**
反覆讀入一串正整數（以 `0` 結尾，最多 1024 個），把其中**是質數的那些**由大到小重新排列，其他數字的位置不動；讀到空的一串（直接輸入 `0`）就印 `Finish!` 結束。

```text
輸入：
1 2 3 4 5 6 7 8 9 10 0
2 4 6 8 3 5 7 11 13 17 19 0
10 8 6 4 2 0
0
輸出：
1 7 5 4 3 6 2 8 9 10
19 4 6 8 17 13 11 7 5 3 2
10 8 6 4 2
Finish!
```

**Q3. 區間內的質數**
反覆讀入 `x y`，印出 `x` 到 `y` 之間（含）所有質數，同一行用空白隔開；`x > y` 或有負數印 `Invalid input`；區間內沒有質數就不印任何東西；讀到 `0 0` 結束。

```text
輸入：
10 30
24 28
30 10
1 10
0 0
輸出：
11 13 17 19 23 29
Invalid input
2 3 5 7
```

**Q4. 爬樓梯**
一次可以爬 1 階或 2 階，問爬到第 `n` 階有幾種走法（`0 < n < 45`，其他值印 `invalid`）。反覆讀入直到 `0`。

```text
輸入：
2
4
10
44
0
輸出：
2
5
89
1134903170
```

**Q5. 狀態機計算器**
先讀 `n`，再讀 `n` 個整數。程式有五個狀態輪流切換：第 1 個數進入 `RST`（直接記下來）；之後依序 `ADD`（結果 + 輸入）、`SUB`（結果 − 輸入）、`MUL`（結果 × 輸入）、`DIV`（**輸入 ÷ 結果**，整數除法）；`DIV` 之後回到 `ADD` 循環。`DIV` 時若結果是 0，印 `division by zero => reset`，下一個數重新從 `RST` 開始。每一步印 `(State XXX) => 結果`。

```text
輸入：
7
3 4 1 5 10 2 6
輸出：
(State RST) => 3
(State ADD) => 7
(State SUB) => 6
(State MUL) => 30
(State DIV) => 0
(State ADD) => 2
(State SUB) => -4
```

```text
輸入：
6
5 0 5 0 9 1
輸出：
(State RST) => 5
(State ADD) => 5
(State SUB) => 0
(State MUL) => 0
division by zero => reset
(State RST) => 1
```

**Q6. 成績結構排序**
`struct Student` 存五科分數與總分。讀入 `n` 個學生（每行五個整數），分數不在 0–100 的視為 0，依總分**由高到低**印出每人的五科與總分。

```text
輸入：
3
80 20 30 40 50
30 40 70 70 30
20 30 30 100 120
輸出：
30 40 70 70 30 | 240
80 20 30 40 50 | 220
20 30 30 100 0 | 180
```

<details>
<summary><b>Q1 參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    while (true) {
        cin >> n;
        if (n == 0) break;
        if (n <= 0 || n % 2 == 0) {
            cout << "invalid\n";
            continue;
        }
        // 上半部（含中間那顆星）：星星數 n, n-2, ..., 1
        for (int stars = n; stars >= 1; stars -= 2) {
            for (int s = 0; s < (n - stars) / 2; s++) cout << ' ';
            for (int s = 0; s < stars; s++) cout << '*';
            cout << '\n';
        }
        // 下半部：3, 5, ..., n
        for (int stars = 3; stars <= n; stars += 2) {
            for (int s = 0; s < (n - stars) / 2; s++) cout << ' ';
            for (int s = 0; s < stars; s++) cout << '*';
            cout << '\n';
        }
    }
    return 0;
}
```

**考點與常見扣分**：每列的空白數是 `(N - 星數) / 2`；下半部從 3 顆開始（1 顆那列已經在上半部印過）。`N = 1` 只有一列，兩個迴圈剛好一個印一個不印，不需要特判。行尾多印空白就是零分，`-Wall` 抓不到這種錯，要自己拿題目範例對。

</details>

<details>
<summary><b>Q2 參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

bool isPrime(int n) {
    if (n < 2) return false;
    for (int i = 2; i <= n / i; i++)
        if (n % i == 0) return false;
    return true;
}

int main() {
    const int MAX = 1024;
    int a[MAX], n;
    while (true) {
        n = 0;
        int x;
        while (true) {                              // 一串數字以 0 結尾
            cin >> x;
            if (x == 0) break;
            a[n++] = x;
        }
        if (n == 0) break;                          // 空的一串：結束

        // 只對「是質數的位置」做選擇排序（由大到小），其他位置不動
        for (int i = 0; i < n; i++) {
            if (!isPrime(a[i])) continue;
            int best = i;
            for (int j = i + 1; j < n; j++)
                if (isPrime(a[j]) && a[j] > a[best]) best = j;
            int t = a[i]; a[i] = a[best]; a[best] = t;
        }
        for (int i = 0; i < n; i++) cout << a[i] << (i + 1 < n ? " " : "\n");
    }
    cout << "Finish!\n";
    return 0;
}
```

**考點與常見扣分**：排序骨架還是選擇排序，只是「參與排序的位置」加了條件——`i` 不是質數就跳過，找最大值時也只看質數。這樣非質數自然留在原地。第三組資料只有一個質數 2，所以跟原本一樣。每一串讀完要把 `n` 歸零，這是連續輸入題最常忘的一行。

</details>

<details>
<summary><b>Q3 參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

bool isPrime(int n) {
    if (n < 2) return false;
    for (int i = 2; i <= n / i; i++)
        if (n % i == 0) return false;
    return true;
}

int main() {
    int x, y;
    while (true) {
        cin >> x >> y;
        if (x == 0 && y == 0) break;
        if (x < 0 || y < 0 || x > y) {
            cout << "Invalid input\n";
            continue;
        }
        bool any = false;
        for (int i = x; i <= y; i++) {
            if (isPrime(i)) {
                if (any) cout << ' ';
                cout << i;
                any = true;
            }
        }
        if (any) cout << '\n';
    }
    return 0;
}
```

**考點與常見扣分**：三個判斷的順序——先檢查結束、再檢查不合法、最後才算；「沒有質數就不印」包含**不印換行**，所以用 `any` 旗標決定要不要 `'\n'`。`isPrime` 直接沿用 09/24 那份。

</details>

<details>
<summary><b>Q4 參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    while (true) {
        cin >> n;
        if (n == 0) break;
        if (n < 0 || n >= 45) {
            cout << "invalid\n";
            continue;
        }
        long long ways1 = 1, ways2 = 1;   // 到第 0 階和第 1 階各只有 1 種走法
        for (int i = 2; i <= n; i++) {
            long long cur = ways1 + ways2;    // 最後一步踩 1 階或 2 階
            ways1 = ways2;
            ways2 = cur;
        }
        cout << ways2 << '\n';
    }
    return 0;
}
```

**考點與常見扣分**：走到第 `n` 階的最後一步不是 1 階就是 2 階，所以 `ways(n) = ways(n-1) + ways(n-2)`——就是費氏數列，用 09/24 Q6 的迴圈寫法。`n = 44` 的答案超過 11 億，`int` 剛好還裝得下，但再大一點就不行，直接用 `long long` 最保險。

</details>

<details>
<summary><b>Q5 參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    long long result = 0;
    int state = 0;                     // 0 RST, 1 ADD, 2 SUB, 3 MUL, 4 DIV
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        switch (state) {
            case 0: result = x;          cout << "(State RST) => " << result << '\n'; break;
            case 1: result += x;         cout << "(State ADD) => " << result << '\n'; break;
            case 2: result -= x;         cout << "(State SUB) => " << result << '\n'; break;
            case 3: result *= x;         cout << "(State MUL) => " << result << '\n'; break;
            case 4:
                if (result == 0) {
                    cout << "division by zero => reset\n";
                    state = 0;           // 下一筆回到 RST
                    continue;            // 跳過下面的 state++
                }
                result = x / result;
                cout << "(State DIV) => " << result << '\n';
                break;
        }
        state = (state + 1) % 5;         // RST 之後 ADD、SUB、MUL、DIV，再回 ADD
        if (state == 0) state = 1;
    }
    return 0;
}
```

**考點與常見扣分**：`DIV` 是「輸入除以結果」，方向跟前面三個相反；除以零那一筆**不算一步**，狀態直接回 `RST`，所以要 `continue` 跳過 `state` 的推進。`switch` 裡每個 `case` 都有 `break`，除以零那條用 `continue` 離開的是外面的 `for`——`continue` 跳的是迴圈、不是 `switch`。

</details>

<details>
<summary><b>Q6 參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

const int SUBJECTS = 5;
struct Student { int score[SUBJECTS]; int total; };

void printStudent(const Student& s) {
    for (int i = 0; i < SUBJECTS; i++) cout << s.score[i] << ' ';
    cout << "| " << s.total << '\n';
}

int main() {
    const int MAX = 10;
    Student cls[MAX];
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cls[i].total = 0;
        for (int j = 0; j < SUBJECTS; j++) {
            cin >> cls[i].score[j];
            if (cls[i].score[j] < 0 || cls[i].score[j] > 100) cls[i].score[j] = 0;
            cls[i].total += cls[i].score[j];
        }
    }
    for (int i = 0; i < n - 1; i++) {                 // 依總分由高到低
        int best = i;
        for (int j = i + 1; j < n; j++)
            if (cls[j].total > cls[best].total) best = j;
        Student t = cls[i]; cls[i] = cls[best]; cls[best] = t;
    }
    for (int i = 0; i < n; i++) printStudent(cls[i]);
    return 0;
}
```

**考點與常見扣分**：總分要在讀入時順便算好存進結構，排序時才不用一直重算；交換的是整個 `Student`。這題實驗課的正式版本會讓每行分數「可能缺少幾科」，要用 `getline` + `stringstream` 一行一行拆，那是 12/03 的內容，期中不會考。

</details>

## 對完答案之後

五題全對、`make` 零警告，期中就穩了。哪一題寫不出來，回去補對應的那一篇：

- Q1 → [10/01 參數傳遞](/2026/09/09/nsysu-c-programming/1001-parameters/)：`double&` 一次帶回多個結果
- Q2 → [09/24 流程控制與函式](/2026/09/09/nsysu-c-programming/0924-flow-control/)：迴圈、`%`、自訂函式
- Q3 → [10/08 陣列](/2026/09/09/nsysu-c-programming/1008-arrays/)：二維陣列
- Q4 → 同上（手寫排序）＋ [10/15 struct 與 class](/2026/09/09/nsysu-c-programming/1015-struct-class/)：struct 傳參與整包交換
- Q5 → [10/15 struct 與 class](/2026/09/09/nsysu-c-programming/1015-struct-class/)：存取控制、`const` 成員函式

---

[← 10/29｜vector 與運算子重載入門（Ch 7）](/2026/09/09/nsysu-c-programming/1029-vector-operator/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [11/12｜運算子重載、friend 與 string（Ch 8、Ch 9） →](/2026/09/09/nsysu-c-programming/1112-operator-string/)
