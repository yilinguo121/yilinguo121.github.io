---
title: 11/05｜期中上機考（範圍 Ch 1–6）
date: 2026-09-10
updated: 2026-09-12
permalink: 2026/09/09/nsysu-c-programming/1105-midterm/
cover: /images/code-cover.jpg
categories: [程式設計]
tags: [C++, 中山大學, 自學指南]
toc: true
comments: true
hidden: true
---

[← 10/29｜vector 與運算子重載入門（Ch 7）](/2026/09/09/nsysu-c-programming/1029-vector-operator/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [11/12｜運算子重載、friend 與 string（Ch 8、Ch 9） →](/2026/09/09/nsysu-c-programming/1112-operator-string/)

期中考是**上機考**，也是多數人第一次在考場上寫程式。這篇給你三樣東西：考前一週的複習清單、考場流程、一份可以計時做完的五題模擬考與完整解答。

範圍到 **Ch6 的 class 基礎**為止：

```text
基本語法 → 流程控制 → 函式與參數傳遞 → 陣列（含二維） → struct / class（存取控制、setter/getter、const 成員函式）
```

**不包含建構子、`vector`、運算子重載**——課綱寫的期中範圍就是 Ch1–Ch6，而這三樣屬於 Ch7 之後，所以 10/22、10/29 這兩週留到期末。現在不用複習它們，但別忘了期末全考。

## 考前一週的複習清單

每一項都要做到不看筆記能寫出來（括號是對應的模擬考題號）：

- ☐ 格式化輸出：`fixed << setprecision(n)` 控小數位（→ Q1、Q4、Q5）、`setw(n)` 控欄寬（→ Q4）、`setfill('0')` 補零（模擬考沒出，自己拿 Q4 多加一欄練）
- ☐ 函式三件事：回傳 `bool` 的判斷函式（→ Q2）、用 `double&` 一次帶回兩個結果（→ Q1）、同名函式重載三個版本（模擬考沒出，自己補一題）
- ☐ 一維陣列：讀入與累加（→ Q1）、找最大值與索引、手寫排序（→ Q4）、反轉（模擬考沒出，自己補一題）
- ☐ 二維陣列：讀入、印出、轉置、每列每行求和（→ Q3）
- ☐ `struct`：定義、陣列、傳進函式、整包交換（→ Q4）
- ☐ `class`：private 資料 + public setter + `const` 成員函式（→ Q5）、getter（自己補）
- ☐ 默寫〈環境設置〉那份模組化 Makefile（`wildcard` + pattern rule 那一版），`make clean && make` 通過且**零警告**（不用自己發明，背熟就好）

`+=`、`i++`、單獨一行的 `cout << fixed << setprecision(2);`——這三個寫法忘了就回 [09/17](/2026/09/09/nsysu-c-programming/0917-cpp-basics/) 翻。另外期中題目一定會先給你數量 `n`，用 `for` 讀就好，不必用 `while (cin >> x)` 那種「讀到沒東西可讀就停」的寫法。

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
   make clean           # 重編確認過了才打包，zip 裡只留 .cpp 和 Makefile
   cd ..
   zip -r B1130xxxxx.zip B1130xxxxx/
   ```

完整繳交規則見[〈環境設置〉](/2026/09/09/nsysu-c-programming/setup/)。兩條會要命的：**Makefile 編不過 = 0 分**、**有任何警告或錯誤扣 2 分**。

## 模擬上機考（建議計時 90 分鐘）

正式期中考是 90 分鐘五題，這份模擬考照同樣的量設計。時間是**總量**參考、不是順序（順序照上面第 2 步，從最有把握的開始）：Q2、Q5 各 10 分鐘，Q1、Q3 各 15 分鐘，Q4 最久 25 分鐘，留 15 分鐘機動與重編打包。

解答裡有不少 `for` 沒加大括號——跟 09/24 講 `if` 時同一條規則：`for`、`while` 後面也只管**一個**敘述，而那個敘述可以是一行程式，也可以是另一個 `for`（Q3 的兩層迴圈就是這樣）。決定範圍的是語法不是縮排，自己寫還是建議一律加。

**Q1. 平均與標準差**
讀入 `n` 與 `n` 個整數，輸出平均與**母體**標準差，各保留兩位小數。計算的部分要寫成獨立函式，用兩個 `double&` 參數把平均與標準差一起帶回 `main`。

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
讀入 `n`、`m` 與矩陣，輸出每一列的和、每一行的和，最後印出這個矩陣的轉置。

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
定義 `struct Book { string title; string author; int year; double price; };`，讀入 `n` 本書，每行一本：`書名 作者 年份 價格`，其中**書名與作者都保證是不含空白的單字**（含空白的字串要等 Ch9 學會 `getline` 才處理得了）。輸出：

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

**考點與常見扣分**：母體標準差的分母是 `n` 不是 `n - 1`；忘了 `fixed` 的話 3.8 會印成 `3.8` 而不是 `3.80`，格式不符就算錯。題目沒寫上限就開明顯夠大的值（例如 `const int MAX = 1000;`），開太小會寫爆陣列——可能當場 `*** stack smashing detected ***` 或 `Segmentation fault`，也可能一聲不響地把別的變數改壞（10/08〈雷區①〉的三種症狀），偏偏編譯器完全不會擋你；題目寫明 `n ≤ 10000` 就開 10000——寧可開大，不要剛剛好。

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

## 對完答案之後

五題全對、`make` 零警告，期中就穩了。哪一題寫不出來，回去補對應的那一篇：

- Q1 → [10/01 參數傳遞](/2026/09/09/nsysu-c-programming/1001-parameters/)：`double&` 一次帶回多個結果
- Q2 → [09/24 流程控制與函式](/2026/09/09/nsysu-c-programming/0924-flow-control/)：迴圈、`%`、自訂函式
- Q3 → [10/08 陣列](/2026/09/09/nsysu-c-programming/1008-arrays/)：二維陣列
- Q4 → 同上（手寫排序）＋ [10/15 struct 與 class](/2026/09/09/nsysu-c-programming/1015-struct-class/)：struct 傳參與整包交換
- Q5 → [10/15 struct 與 class](/2026/09/09/nsysu-c-programming/1015-struct-class/)：存取控制、`const` 成員函式

---

[← 10/29｜vector 與運算子重載入門（Ch 7）](/2026/09/09/nsysu-c-programming/1029-vector-operator/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [11/12｜運算子重載、friend 與 string（Ch 8、Ch 9） →](/2026/09/09/nsysu-c-programming/1112-operator-string/)
