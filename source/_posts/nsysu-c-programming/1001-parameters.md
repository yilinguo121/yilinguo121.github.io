---
title: 10/01｜參數傳遞與函式重載（Ch 4）
date: 2026-09-10
updated: 2026-09-11
permalink: 2026/09/09/nsysu-c-programming/1001-parameters/
cover: /images/code-cover.jpg
categories: [程式設計]
tags: [C++, 中山大學, 自學指南]
toc: true
comments: true
hidden: true
---

[← 09/24｜流程控制與函式基礎（Ch 2、Ch 3）](/2026/09/09/nsysu-c-programming/0924-flow-control/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [10/08｜陣列（Ch 5） →](/2026/09/09/nsysu-c-programming/1008-arrays/)

> 對應課本習題：Ch4: 3, 7, 8, 9, 14, 17

**這週要會什麼**

```text
傳值 vs 傳參考 → const 參考 → 函式重載 → 預設引數 → 用 assert 測試
```

這週的觀念很小，但**筆試超愛考**：給你一段程式，問呼叫函式之後外面的變數變成多少。

## 傳值（call-by-value）：函式改不到外面

```cpp
#include <iostream>
using namespace std;

void addOne(int x) { x = x + 1; }    // x 是「複製品」

int main() {
    int a = 5;
    addOne(a);
    cout << a << '\n';               // 還是 5！
    return 0;
}
```

**白話說**：呼叫 `addOne(a)` 時，電腦把 `a` 的值**影印一份**給函式。函式在影本上塗改，正本完全沒事。

```text
main:      a = 5
            │ 複製
            ▼
addOne:    x = 5  →  x = 6   （函式結束，x 消失）
main:      a 還是 5
```

## 傳參考（call-by-reference）：函式可以改到外面

在參數型別後面加一個 `&`：

```cpp
#include <iostream>
using namespace std;

void addOne(int& x) { x = x + 1; }   // x 是 a 的「別名」

int main() {
    int a = 5;
    addOne(a);
    cout << a << '\n';               // 6
    return 0;
}
```

**白話說**：`int& x` 不是複製，而是**替 `a` 取了一個小名**。在函式裡叫 `x`，改的就是外面的 `a` 本人。

```text
main:      a = 5
            ▲
            │ 同一塊記憶體，只是換個名字叫 x
addOne:    x = 6   →   main 的 a 也變成 6
```

經典應用——交換兩個變數：

```cpp
void swapValues(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
}
```

如果參數少了 `&`，這個函式就完全沒有效果——這是初學者最常見的錯誤之一。

**什麼時候用哪一種？**

| 情況 | 建議寫法 |
| --- | --- |
| 只是要讀取，資料很小（`int`、`double`、`char`） | 傳值 `int x` |
| 需要在函式裡修改呼叫端的變數 | 傳參考 `int& x` |
| 只是要讀取，但資料很大（`string`、`vector`、大 `struct`） | 傳 const 參考 `const string& s` |
| 需要「回傳兩個以上的結果」 | 用參考參數接結果 |

## `const` 參考：又快又安全

```cpp
void print(const string& s) {   // 不複製字串，也保證不會被改
    cout << s << '\n';
    // s = "oops";              // 編譯錯誤：s 是 const
}
```

複製一個長字串或大陣列很花時間，用 `&` 可以避免複製；再加上 `const`，等於對呼叫者宣告「**我保證不動你的東西**」。大型物件幾乎一律用 `const T&`，這是 C++ 的標準習慣，課本也反覆強調。

## 混合參數列表

一個函式可以同時有傳值與傳參考的參數：

```cpp
// 把 score 加上 bonus 分（上限 100），回傳是否被上限截斷
bool addBonus(int& score, int bonus) {
    score += bonus;
    if (score > 100) { score = 100; return true; }
    return false;
}
```

> **雷區 ①：不小心宣告了同名的區域變數**
> ```cpp
> void setTo100(int& x) {
>     int x2 = 100;      // 打算改外面，卻只改了自己的區域變數
>     x2 = x2;           // 什麼都沒做
> }
> ```
> 課本稱為 *inadvertent local variable*。症狀是「函式明明跑了，外面的值卻沒變」。

## 函式重載（overloading）

**同一個函式名字**，只要**參數列表不同**（型別不同或個數不同），就可以同時存在：

```cpp
#include <iostream>
using namespace std;

int    myMax(int a, int b)       { return a > b ? a : b; }
double myMax(double a, double b) { return a > b ? a : b; }
int    myMax(int a, int b, int c){ return myMax(a, myMax(b, c)); }

int main() {
    cout << myMax(3, 7) << '\n';          // 呼叫第一個
    cout << myMax(3.5, 7.25) << '\n';     // 呼叫第二個
    cout << myMax(3, 7, 5) << '\n';       // 呼叫第三個
    return 0;
}
```

編譯器根據**你傳進去的引數型別與個數**決定呼叫哪一個，這叫**多載解析（overload resolution）**，順序大致是：

1. 找**完全吻合**的版本。
2. 找只需要**自動型別提升**（`char`→`int`、`float`→`double`）就能吻合的。
3. 找需要**一般型別轉換**（`int`→`double`、`double`→`int`）的。
4. 都找不到或**同時有兩個一樣好**→ 編譯錯誤 `call of overloaded ... is ambiguous`。

> **雷區 ②：只有回傳型別不同，不算重載**
> ```cpp
> int  f(int x);
> double f(int x);     // 編譯錯誤
> ```
> 因為呼叫 `f(3);` 時編譯器無從判斷你要哪一個。

> **雷區 ③：自動轉型造成模稜兩可**
> ```cpp
> void show(int x);
> void show(double x);
> show('A');     // char 可以轉 int，也可以轉 double
> ```
> 這個例子實際上會選 `int`（型別提升優先），但類似情形很容易變成 ambiguous。寫重載時**讓參數型別差異明顯**。

## 預設引數（default arguments）

```cpp
#include <iostream>
using namespace std;

void greet(string name = "world", char mark = '!') {
    cout << "Hello, " << name << mark << '\n';
}

int main() {
    greet();                 // Hello, world!
    greet("NSYSU");          // Hello, NSYSU!
    greet("NSYSU", '?');     // Hello, NSYSU?
    return 0;
}
```

規則：

- 有預設值的參數**必須放在參數列最右邊**（不然呼叫時無法判斷你省略了哪一個）。
- 預設值只在**宣告**那裡寫一次；如果宣告與定義分開寫，**不要在定義再寫一次**。

## 用 `assert` 檢查前置條件

`assert` 是「這件事一定要成立，不成立就讓程式當場停下來」的除錯工具：

```cpp
#include <iostream>
#include <cassert>
using namespace std;

double divide(double a, double b) {
    assert(b != 0);          // 前置條件：分母不能是 0
    return a / b;
}

int main() {
    cout << divide(10, 4) << '\n';
    // divide(1, 0);         // 執行時會中止並印出檔名行號
    return 0;
}
```

編譯時加上 `-DNDEBUG` 就會把所有 `assert` 關掉（正式版不做檢查）。實驗課寫作業時放幾個 `assert` 很好用，但**繳交前確認它不會誤觸發**。

## 測試技巧：stub 與 driver

- **Stub（樁）**：某個函式還沒寫好，先給一個假的實作（例如固定回傳 0），讓其他部分能先編譯、先測。
- **Driver（驅動程式）**：寫一個小 `main` 專門測試某一個函式，測完再把它接回大程式。

```cpp
// driver：專門測 isPrime
int main() {
    int tests[] = {1, 2, 3, 4, 17, 25, 97};
    for (int t : tests)
        cout << t << " -> " << (isPrime(t) ? "prime" : "not prime") << '\n';
    return 0;
}
```

這兩個名詞筆試可能考定義，實務上也真的好用：**與其整支寫完才編譯，不如寫一個函式測一個**。

## 本週練習題

**Q1. 交換與排序三個數**
寫 `void swapValues(int& a, int& b)`，再用它把讀入的三個整數由小到大排序輸出。

```text
輸入： 5 2 9
輸出： 2 5 9
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

void swapValues(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
}

int main() {
    int a, b, c;
    cin >> a >> b >> c;
    if (a > b) swapValues(a, b);
    if (b > c) swapValues(b, c);
    if (a > b) swapValues(a, b);      // 三次比較足以排好三個數
    cout << a << ' ' << b << ' ' << c << '\n';
    return 0;
}
```

</details>

**Q2. 一次回傳最大值與最小值**
寫 `void minMax(int a, int b, int c, int& mn, int& mx)`，用參考參數把三個數的最小值與最大值帶回呼叫端。

```text
輸入： 7 3 10
輸出： min = 3, max = 10
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

void minMax(int a, int b, int c, int& mn, int& mx) {
    mn = a;
    if (b < mn) mn = b;
    if (c < mn) mn = c;
    mx = a;
    if (b > mx) mx = b;
    if (c > mx) mx = c;
}

int main() {
    int a, b, c, mn, mx;
    cin >> a >> b >> c;
    minMax(a, b, c, mn, mx);
    cout << "min = " << mn << ", max = " << mx << '\n';
    return 0;
}
```

**為什麼要這樣寫？** 一個函式只能 `return` 一個值，要一次帶回兩個結果，最直接的做法就是用參考參數。

</details>

**Q3. 重載 `area`**
寫三個同名函式 `area`：
- 一個參數 → 正方形面積
- 兩個參數 → 長方形面積
- 三個參數 → 三角形面積（海龍公式）

海龍公式：$s = \frac{a+b+c}{2}$，面積 $= \sqrt{s(s-a)(s-b)(s-c)}$

```text
輸入： 3 4 5
輸出：
square(3)      = 9.00
rect(3, 4)     = 12.00
triangle(3,4,5)= 6.00
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
#include <cmath>
using namespace std;

double area(double side) { return side * side; }
double area(double w, double h) { return w * h; }
double area(double a, double b, double c) {
    double s = (a + b + c) / 2.0;
    return sqrt(s * (s - a) * (s - b) * (s - c));
}

int main() {
    double a, b, c;
    cin >> a >> b >> c;
    cout << fixed << setprecision(2);
    cout << "square(" << a << ")      = " << area(a) << '\n';
    cout << "rect(" << a << ", " << b << ")     = " << area(a, b) << '\n';
    cout << "triangle(" << a << "," << b << "," << c << ")= " << area(a, b, c) << '\n';
    return 0;
}
```

</details>

**Q4. 帶預設值的利息計算**
寫 `double compound(double principal, double rate = 0.02, int years = 1)`，計算複利本利和 $P(1+r)^n$，並示範三種呼叫方式。

```text
輸入： 10000
輸出：
default      : 10200.00
rate 5%      : 10500.00
5% for 3 yr  : 11576.25
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
#include <cmath>
using namespace std;

double compound(double principal, double rate = 0.02, int years = 1) {
    return principal * pow(1 + rate, years);
}

int main() {
    double p;
    cin >> p;
    cout << fixed << setprecision(2);
    cout << "default      : " << compound(p) << '\n';
    cout << "rate 5%      : " << compound(p, 0.05) << '\n';
    cout << "5% for 3 yr  : " << compound(p, 0.05, 3) << '\n';
    return 0;
}
```

</details>

**Q5. 找出傳值的 bug**
下面這支程式想把兩個數字交換後印出，但輸出不對。請指出原因並修正。

```cpp
#include <iostream>
using namespace std;

void mySwap(int a, int b) {
    int t = a; a = b; b = t;
}

int main() {
    int x = 1, y = 2;
    mySwap(x, y);
    cout << x << ' ' << y << '\n';   // 期望 2 1，實際 1 2
    return 0;
}
```

<details>
<summary><b>參考解答</b></summary>

參數是**傳值**，函式拿到的是 `x`、`y` 的複製品，交換的是複製品，正本沒有改變。把參數改成**傳參考**即可：

```cpp
void mySwap(int& a, int& b) {
    int t = a; a = b; b = t;
}
```

這題就是筆試最愛出的題型：**看到 `&` 就是會改到外面，沒有 `&` 就不會**。

</details>

---

[← 09/24｜流程控制與函式基礎（Ch 2、Ch 3）](/2026/09/09/nsysu-c-programming/0924-flow-control/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [10/08｜陣列（Ch 5） →](/2026/09/09/nsysu-c-programming/1008-arrays/)
