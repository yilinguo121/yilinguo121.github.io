---
title: 09/17｜C++ 基礎（Ch 1）
date: 2026-09-10
updated: 2026-09-11
permalink: 2026/09/09/nsysu-c-programming/0917-cpp-basics/
cover: /images/code-cover.jpg
categories: [程式設計]
tags: [C++, 中山大學, 自學指南]
toc: true
comments: true
hidden: true
---

[← 09/10｜課程介紹與環境暖身](/2026/09/09/nsysu-c-programming/0910-intro/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [09/24｜流程控制與函式基礎（Ch 2、Ch 3） →](/2026/09/09/nsysu-c-programming/0924-flow-control/)

> 對應課本習題：Ch1: 6, 8, 13；Ch2: 2, 4, 7, 8

**這週要會什麼**

```text
程式骨架 → 變數與型別 → 輸入輸出 → 算術運算 → 型別轉換 → 常數與風格
```

## 一支程式的骨架

```cpp
#include <iostream>   // ① 前置處理：引入函式庫的宣告
using namespace std;  // ② 命名空間：之後不用一直寫 std::

int main() {          // ③ 程式進入點
    // 你的程式從這裡開始
    return 0;         // ④ 回傳 0 給作業系統＝正常結束
}
```

## 識別字（identifier）命名規則

- 只能由**英文字母、數字、底線** `_` 組成，且**不能以數字開頭**。
- **大小寫有別**：`Total`、`total`、`TOTAL` 是三個不同的變數。
- 不能使用**保留字**：`int`、`class`、`return`、`for`、`if`、`new`、`delete`……
- 命名習慣：變數與函式用 `camelCase`（`totalScore`）或 `snake_case`（`total_score`），類別用 `PascalCase`（`BankAccount`），常數用全大寫（`MAX_SIZE`）。**整份程式挑一種、保持一致**，筆試改考卷的人會看風格。

## 基本型別

| 型別 | 典型大小 | 範圍 / 精度 | 用途 |
| --- | --- | --- | --- |
| `int` | 4 bytes | 約 $\pm 2.1 \times 10^9$ | 整數 |
| `long long` | 8 bytes | 約 $\pm 9.2 \times 10^{18}$ | 大整數 |
| `unsigned int` | 4 bytes | $0 \sim 4.29 \times 10^9$ | 非負整數 |
| `short` | 2 bytes | 約 $\pm 3.2 \times 10^4$ | 省空間的小整數 |
| `float` | 4 bytes | 約 7 位有效數字 | 單精度浮點 |
| `double` | 8 bytes | 約 15 位有效數字 | 浮點數（**預設用這個**） |
| `char` | 1 byte | 一個字元 | `'A'`、`'0'`、`' '` |
| `bool` | 1 byte | `true` / `false` | 布林值 |
| `string` | 不定 | 需 `#include <string>` | 字串（類別，不是基本型別） |

想在自己機器上確認實際大小：

```cpp
#include <iostream>
#include <climits>
using namespace std;

int main() {
    cout << "sizeof(int)    = " << sizeof(int) << " bytes\n";
    cout << "sizeof(double) = " << sizeof(double) << " bytes\n";
    cout << "INT_MAX = " << INT_MAX << '\n';
    cout << "INT_MIN = " << INT_MIN << '\n';
    return 0;
}
```

## 宣告與初始化

```cpp
int age = 18;               // 宣告同時初始化（建議）
double pi = 3.14159;
char grade = 'A';           // 單引號是字元
bool passed = true;
string name = "Yilin";      // 雙引號是字串

int a, b, c;                // 一次宣告多個（都還沒初始化）
int x{5};                   // C++11 大括號初始化
```

> **雷區 ①：未初始化的變數**
> ```cpp
> int sum;            // 沒給初值
> for (int i = 1; i <= 10; i++) sum += i;
> cout << sum;        // 結果是垃圾值，每次執行可能不同
> ```
> C++ **不會**幫區域變數自動歸零。累加器一定要 `int sum = 0;`。
> 補充一個實測細節：這種錯誤要加上最佳化選項才抓得到，`g++ -Wall -O2` 會給 `warning: 'sum' is used uninitialized`，只寫 `-Wall` 反而不會提醒你。所以**不要依賴編譯器**，宣告變數時就順手給初值。

## 賦值相容性與隱式轉換

```cpp
int    i = 3.99;    // i = 3，小數部分被「截斷」而不是四捨五入
double d = 5;       // d = 5.0，沒問題
char   c = 65;      // c = 'A'（65 是 'A' 的 ASCII 碼）
int    n = 'A';     // n = 65
bool   b = 42;      // b = true（非 0 皆為 true）
```

`double → int` 會**損失精度**，`-Wconversion` 會警告。要明確表達「我知道我在做什麼」，用 cast：

```cpp
double d = 3.99;
int i = static_cast<int>(d);   // 現代 C++ 寫法（推薦）
int j = (int)d;                // C 風格，課本也用，考試兩種都可
```

## 字面值與跳脫序列

```cpp
42        // int
42L       // long
42u       // unsigned
3.14      // double
3.14f     // float
'A'       // char
"Hello"   // C-string 字面值
true      // bool
```

常用跳脫序列：

| 寫法 | 意義 |
| --- | --- |
| `\n` | 換行 |
| `\t` | Tab |
| `\\` | 反斜線本身 |
| `\"` | 雙引號 |
| `\'` | 單引號 |
| `\0` | 空字元（字串結尾標記，Ch9 會用到） |

## 輸入輸出：`cin` 與 `cout`

```cpp
#include <iostream>
using namespace std;

int main() {
    int a, b;
    cout << "請輸入兩個整數：";
    cin >> a >> b;
    cout << "和 = " << a + b << endl;
    return 0;
}
```

- `cout << x`：把 `x` 送到標準輸出，`<<` 可以一直串接。
- `cin >> x`：從標準輸入讀一個值。**會自動跳過前置的空白與換行**，讀到下一個空白為止。
- `endl` = 換行 + **強制清空緩衝區**；`'\n'` 只換行。大量輸出時用 `'\n'` 比較快。
- `cerr` 是**標準錯誤輸出**，不緩衝，用來印錯誤訊息：`cerr << "cannot open file\n";`

**格式化輸出**（需要 `#include <iomanip>`）：

```cpp
#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    double x = 3.14159265;
    cout << fixed << setprecision(2) << x << '\n';   // 3.14
    cout << setw(10) << 42 << "|\n";                 // 靠右對齊寬度 10
    cout << left << setw(10) << 42 << "|\n";         // 靠左對齊
    return 0;
}
```

- `fixed` + `setprecision(n)`：固定小數點後 `n` 位。**這是實驗課題目最常要求的格式**。
- 只寫 `setprecision(n)` 而沒有 `fixed` 的話，`n` 代表**有效位數**而不是小數位數，兩者不一樣。
- `setw(n)` **只對下一個輸出有效**，`fixed`、`setprecision` 則會一直生效。

## 算術運算與整數除法陷阱

```cpp
cout << 7 / 2 << '\n';           // 3    整數 ÷ 整數 = 整數（無條件捨去）
cout << 7 % 2 << '\n';           // 1    取餘數
cout << 7 / 2.0 << '\n';         // 3.5  只要一邊是浮點，結果就是浮點
cout << (double)7 / 2 << '\n';   // 3.5
cout << -7 / 2 << '\n';          // -3   C++11 起向 0 取整
cout << -7 % 2 << '\n';          // -1   餘數與被除數同號
```

> **雷區 ②：整數除法**
> ```cpp
> int a = 5;
> double b = a / 2;      // b = 2.0，不是 2.5！
> ```
> `a / 2` 兩邊都是 `int`，先算出整數 2，才轉成 `double`。正確寫法：`double b = a / 2.0;` 或 `double b = static_cast<double>(a) / 2;`。
> **平均分數算錯**幾乎都是這個原因，是實驗課最常見的扣分點。

`%` 只能用在**整數**。`5.5 % 2` 直接編譯錯誤。

## 遞增遞減與求值順序

```cpp
int i = 5;
cout << i++;   // 印出 5，之後 i 變 6（後置：先用值，再加）
cout << ++i;   // i 先變 7，印出 7（前置：先加，再用值）
```

> **雷區 ③：同一個運算式裡改同一個變數**
> ```cpp
> int i = 1;
> int x = i++ + i++;    // 結果未定義，不同編譯器可能給不同答案
> ```
> 不要寫這種程式。筆試若出現，答案通常是「undefined behavior」。

## 常數

```cpp
const double PI = 3.14159265358979;
const int MAX_SIZE = 100;
// PI = 3.14;   // 編譯錯誤：assignment of read-only variable
```

用 `const` 具名常數的好處：**改一個地方就全改**、**編譯器會擋住誤改**、**程式自我說明**（看到 `MAX_SIZE` 比看到 `100` 清楚）。課本與課程都建議用 `const` 而非 `#define`。

## 註解與程式風格

```cpp
// 單行註解

/* 多行註解
   可以跨很多行 */
```

筆試會看程式可讀性，實驗課助教檢查時也會看。三個基本要求：**縮排一致**（一層 4 個空格或 1 個 Tab，別混用）、**變數名有意義**、**關鍵步驟有註解**。

## 本週練習題

> 全部題目都用 `g++ -Wall -Wextra -std=c++17` 編譯，確認**零警告**。

**Q1. BMI 計算**
讀入身高（公分，浮點數）與體重（公斤，浮點數），輸出 BMI 到小數點後兩位。

$$\text{BMI} = \frac{\text{體重(kg)}}{\text{身高(m)}^2}$$

```text
輸入： 175.5 68.2
輸出： BMI = 22.14
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    double cm, kg;
    cin >> cm >> kg;
    double m = cm / 100.0;          // 注意 100.0 而非 100
    double bmi = kg / (m * m);
    cout << "BMI = " << fixed << setprecision(2) << bmi << '\n';
    return 0;
}
```

</details>

**Q2. 秒數轉時分秒**
讀入一個非負整數 `n`（秒），輸出格式為 `hh:mm:ss`，不足兩位補 0。

```text
輸入： 3725
輸出： 01:02:05
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    int n;
    cin >> n;
    int h = n / 3600;
    int m = (n % 3600) / 60;
    int s = n % 60;
    cout << setfill('0')
         << setw(2) << h << ':'
         << setw(2) << m << ':'
         << setw(2) << s << '\n';
    return 0;
}
```

`setfill('0')` 把補位字元從空白改成 `0`；`setw(2)` 要對**每一個**輸出各寫一次，因為它只影響下一次輸出。

</details>

**Q3. 找零錢**
讀入一個整數金額（元），用 500、100、50、10、5、1 元由大到小找零，輸出每種各幾張／幾個。

```text
輸入： 1268
輸出：
500: 2
100: 2
50: 1
10: 1
5: 1
1: 3
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

int main() {
    int money;
    cin >> money;
    const int COINS[6] = {500, 100, 50, 10, 5, 1};
    for (int i = 0; i < 6; i++) {
        cout << COINS[i] << ": " << money / COINS[i] << '\n';
        money %= COINS[i];
    }
    return 0;
}
```

沒學陣列也可以寫六次 `money / 500; money %= 500;`，但用陣列（下下週）會乾淨很多。

</details>

**Q4. 溫度轉換表**
讀入起始攝氏溫度 `a`、結束溫度 `b`、間隔 `d`（皆為整數），輸出從 `a` 到 `b`（含）每隔 `d` 度的攝氏與華氏對照，華氏取小數點後一位。

$$F = C \times \frac{9}{5} + 32$$

```text
輸入： 0 100 25
輸出：
0C = 32.0F
25C = 77.0F
50C = 122.0F
75C = 167.0F
100C = 212.0F
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    int a, b, d;
    cin >> a >> b >> d;
    cout << fixed << setprecision(1);
    for (int c = a; c <= b; c += d) {
        double f = c * 9.0 / 5.0 + 32;    // 9.0 / 5.0，不是 9 / 5！
        cout << c << "C = " << f << "F\n";
    }
    return 0;
}
```

如果寫成 `c * 9 / 5 + 32`，因為先乘後除其實也會對；但寫成 `c * (9 / 5) + 32` 就會變成 `c * 1 + 32`，整個錯。養成「浮點運算就寫 `.0`」的習慣。

</details>

**Q5. 數字拆解**
讀入一個三位數正整數，分別輸出它的百位、十位、個位數字，以及三個數字的和。

```text
輸入： 472
輸出：
4 7 2
sum = 13
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int h = n / 100;
    int t = n / 10 % 10;
    int u = n % 10;
    cout << h << ' ' << t << ' ' << u << '\n';
    cout << "sum = " << h + t + u << '\n';
    return 0;
}
```

`n / 10 % 10` 的運算順序是由左到右（`/` 與 `%` 同優先級），先除再取餘。

</details>

---

[← 09/10｜課程介紹與環境暖身](/2026/09/09/nsysu-c-programming/0910-intro/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [09/24｜流程控制與函式基礎（Ch 2、Ch 3） →](/2026/09/09/nsysu-c-programming/0924-flow-control/)
