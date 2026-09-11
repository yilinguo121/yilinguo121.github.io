---
title: 11/05｜期中上機考（範圍 Ch 1–6）
date: 2026-09-10
updated: 2026-09-11
permalink: 2026/09/09/nsysu-c-programming/1105-midterm/
cover: /images/code-cover.jpg
categories: [程式設計]
tags: [C++, 中山大學, 自學指南]
toc: true
comments: true
hidden: true
---

[← 10/29｜vector 與運算子重載入門（Ch 7）](/2026/09/09/nsysu-c-programming/1029-vector-operator/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [11/12｜運算子重載、friend 與 string（Ch 8、Ch 9） →](/2026/09/09/nsysu-c-programming/1112-operator-string/)

期中考是**上機考**，範圍到 Ch6，也就是：

```text
基本語法 → 流程控制 → 函式與參數傳遞 → 陣列（含二維） → struct / class
```

**不包含**建構子、`vector`、運算子重載、指標、檔案 I/O、繼承。

## 考前一週的複習清單

把下面每一項都做到「不看筆記能寫出來」：

- [ ] 讀入不定數量的整數直到 EOF（`while (cin >> x)`）
- [ ] `fixed << setprecision(n)` 控制小數位數
- [ ] `setw` + `setfill('0')` 補零對齊
- [ ] 寫一個回傳 `bool` 的判斷函式（質數、回文、閏年）
- [ ] 用 `int&` 參數一次帶回兩個結果
- [ ] 函式重載三個版本
- [ ] 一維陣列：讀入、反轉、找最大值與索引、手寫排序
- [ ] 二維陣列：讀入、印出、轉置、每列每行求和
- [ ] `struct`：定義、陣列、傳進函式、整包交換
- [ ] `class`：private 資料 + public setter/getter + `const` 成員函式
- [ ] 從零寫出模組化 Makefile，`make clean && make` 通過且**零警告**

## 模擬上機考（建議計時 90 分鐘）

規則比照正式考試：只用文字編輯器、只用 `g++`、附 Makefile、檔名 `Q1.cpp` ~ `Q5.cpp`、資料夾以學號命名。

**Q1. 平均與標準差**
讀入 `n` 與 `n` 個整數，輸出平均與**母體**標準差，各保留兩位小數。

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

**Q3. 矩陣的行列總和**
讀入 `n`、`m` 與矩陣，輸出每一列的和與每一行的和。

```text
輸入：
2 3
1 2 3
4 5 6
輸出：
row sums: 6 15
col sums: 5 7 9
```

**Q4. 圖書資料**
定義 `struct Book { string title; string author; int year; double price; };`，讀入 `n` 本書，輸出：
1. 價格最高的書名
2. 依出版年由舊到新排序後的完整清單

**Q5. 矩形類別**
寫 `class Rectangle`，private 資料為寬高，提供 setter（負數視為 0）、`area()`、`perimeter()`、`isSquare()`，全部唯讀函式都要加 `const`。讀入寬高後印出三個結果。

<details>
<summary><b>Q1 參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
#include <cmath>
using namespace std;

int main() {
    const int MAX = 1000;
    int a[MAX], n;
    cin >> n;
    double sum = 0;
    for (int i = 0; i < n; i++) { cin >> a[i]; sum += a[i]; }

    double mean = sum / n;
    double var = 0;
    for (int i = 0; i < n; i++) var += (a[i] - mean) * (a[i] - mean);
    var /= n;

    cout << fixed << setprecision(2);
    cout << "mean = " << mean << '\n';
    cout << "sd = " << sqrt(var) << '\n';
    return 0;
}
```

</details>

<details>
<summary><b>Q2 參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

bool isPerfect(int n) {
    if (n < 2) return false;
    int sum = 1;                       // 1 一定是因數（n > 1 時）
    for (int i = 2; i * i <= n; i++) {
        if (n % i != 0) continue;
        sum += i;
        if (i != n / i) sum += n / i;  // 成對加入，注意平方數只加一次
    }
    return sum == n;
}

int main() {
    int n;
    cin >> n;
    bool first = true;
    for (int i = 2; i <= n; i++)
        if (isPerfect(i)) { if (!first) cout << ' '; cout << i; first = false; }
    cout << '\n';
    return 0;
}
```

</details>

<details>
<summary><b>Q3 參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

const int MAX = 100;

int main() {
    int a[MAX][MAX], n, m;
    cin >> n >> m;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++) cin >> a[i][j];

    cout << "row sums:";
    for (int i = 0; i < n; i++) {
        int s = 0;
        for (int j = 0; j < m; j++) s += a[i][j];
        cout << ' ' << s;
    }
    cout << '\n';

    cout << "col sums:";
    for (int j = 0; j < m; j++) {
        int s = 0;
        for (int i = 0; i < n; i++) s += a[i][j];
        cout << ' ' << s;
    }
    cout << '\n';
    return 0;
}
```

</details>

<details>
<summary><b>Q4 參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
#include <string>
using namespace std;

struct Book {
    string title;
    string author;
    int    year;
    double price;
};

int main() {
    const int MAX = 100;
    Book b[MAX];
    int n;
    cin >> n;
    for (int i = 0; i < n; i++)
        cin >> b[i].title >> b[i].author >> b[i].year >> b[i].price;

    int best = 0;
    for (int i = 1; i < n; i++) if (b[i].price > b[best].price) best = i;
    cout << "most expensive: " << b[best].title << '\n';

    for (int i = 0; i < n - 1; i++)                 // 依年份排序
        for (int j = 0; j < n - 1 - i; j++)
            if (b[j].year > b[j + 1].year) {
                Book t = b[j]; b[j] = b[j + 1]; b[j + 1] = t;
            }

    cout << fixed << setprecision(2);
    for (int i = 0; i < n; i++)
        cout << b[i].year << ' ' << b[i].title << ' '
             << b[i].author << ' ' << b[i].price << '\n';
    return 0;
}
```

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

**小提醒**：這題沒有建構子（期中範圍不含），所以 `w`、`h` 在 setter 被呼叫前是垃圾值。正式寫程式時請一定要加建構子；期中考則照範圍寫即可。

</details>

---

[← 10/29｜vector 與運算子重載入門（Ch 7）](/2026/09/09/nsysu-c-programming/1029-vector-operator/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [11/12｜運算子重載、friend 與 string（Ch 8、Ch 9） →](/2026/09/09/nsysu-c-programming/1112-operator-string/)
