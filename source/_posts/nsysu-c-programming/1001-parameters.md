---
title: 10/01｜參數傳遞與函式重載（Ch 4）
date: 2026-09-10
updated: 2026-09-12
permalink: 2026/09/09/nsysu-c-programming/1001-parameters/
cover: /images/code-cover.jpg
categories: [程式設計]
tags: [C++, 中山大學, 自學指南]
description: 中山大學 C 程式設計自學指南 Ch 4：傳值與傳參考、const 參考、函式重載、預設引數、用 assert 檢查前置條件，以及 stub 與 driver 測試技巧，附練習題。
toc: true
comments: true
hidden: true
---

[← 09/24｜流程控制與函式基礎（Ch 2、Ch 3）](/2026/09/09/nsysu-c-programming/0924-flow-control/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [10/08｜陣列（Ch 5） →](/2026/09/09/nsysu-c-programming/1008-arrays/)

> 對應課本習題：Ch4: 3, 7, 8, 9, 14, 17

**這週要會什麼**

```text
傳值 vs 傳參考 → const 參考 → 函式重載 → 預設引數 → assert／stub／driver
```

這週要記的東西不多，但**筆試超愛考**：給你一段程式，問呼叫函式之後外面的變數變成多少。

## 傳值（call-by-value）：函式改不到外面

```cpp
#include <iostream>
using namespace std;

void addOne(int x) { x = x + 1; }    // x 是「複製品」

int main() {
    int a = 5;
    addOne(a);
    cout << a << '\n';               // 印出 5，沒有變！
    return 0;
}
```

**白話說**：呼叫 `addOne(a)` 時，電腦把 `a` 的值**影印一份**給函式。函式在影本上塗改，正本完全沒事。

## 傳參考（call-by-reference）：函式可以改到外面

在參數型別後面加一個 `&`，意思是「這個參數就是外面那個變數本人，不是複製品」。（注意這個 `&` 跟 09/24 的 `&&`「且」沒有關係；它還有第三個用法「取記憶體位址」，11/19 講指標才會遇到。）

```cpp
#include <iostream>
using namespace std;

void addOne(int& x) { x = x + 1; }   // x 是 a 的「別名」

int main() {
    int a = 5;
    addOne(a);
    cout << a << '\n';               // 印出 6
    return 0;
}
```

**白話說**：`int& x` 不是複製，而是**替 `a` 取了一個小名**。在函式裡叫 `x`，改的就是外面的 `a` 本人。兩種傳法擺在一起比較：

```text
傳值    main: a=5  ──複製──▶  addOne: x=5 → x=6   （函式結束 x 消失，a 還是 5）
傳參考  main: a ────同一格──── addOne: x           （x 改成 6，就是 a 改成 6）
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

另外，`int&` 只能接**變數**：`addOne(5);`、`addOne(a + 1);` 都會編譯錯誤，訊息裡會出現 `cannot bind non-const lvalue reference`。**lvalue**（左值）在這門課先理解成「有名字、住在記憶體裡的東西」（變數；之後學的 `a[i]`、`*p` 也算），**rvalue**（右值）是 `5`、`a + 1` 這種「算完就丟的暫時值」——暫時值沒有記憶體位置可以被取小名，所以 `int&` 只收前者。（正式定義比這複雜：例如 `const int x = 1;` 的 `x` 是左值卻不能被指派，本學期不深究。）

### 混合傳值與傳參考

同一個參數列裡，傳值與傳參考可以混著用。而且參考參數跟 `return` 不衝突——可以一邊改呼叫端的變數，一邊用回傳值回報狀況：

```cpp
#include <iostream>
using namespace std;

// 把 score 加上 bonus 分（上限 100），回傳是否被上限截斷
bool addBonus(int& score, int bonus) {
    score += bonus;                  // 等同 score = score + bonus;
    if (score > 100) { score = 100; return true; }
    return false;
}

int main() {
    int s = 95;
    bool capped = addBonus(s, 10);
    cout << s << ' ' << capped << '\n';
    return 0;
}
```

輸出：

```text
100 1
```

`score` 真的被改到了（傳參考），同時用回傳值告訴呼叫者「有沒有撞到上限」——輸出的 `1` 就是 `true`（09/17 提過，`bool` 印出來是 `1`／`0`）。

`return` 一次只能帶回一個值。**要一次帶回兩個結果，就改用兩個參考參數**：

```cpp
void minMax(int a, int b, int& mn, int& mx) {
    mn = a < b ? a : b;
    mx = a < b ? b : a;
}
```

呼叫端先準備兩個變數 `int lo, hi;`，跑完 `minMax(7, 3, lo, hi);` 之後 `lo` 是 3、`hi` 是 7。

> **雷區 ①：手滑寫成區域變數**
> ```cpp
> void readScore(int& score) {
>     int score2 = score;   // 想先留一份原值，變數卻取了個跟參數只差一字的名字
>     cin >> score2;        // 想讀進 score，卻讀進了 score2；外面的 score 完全沒變
> }                         // 函式結束，score2 消失
> ```
> 課本稱為 *inadvertent local variable*：編譯完全不會報錯，但外面的變數一輩子不會變，症狀是「函式明明跑了，值卻沒變」。同名（`int score`）編譯器會直接擋下來（`shadows a parameter`），所以真正會出事的永遠是 `score2` 這種**只差一個字**的名字。

## `const` 參考：又快又安全

```cpp
#include <iostream>
#include <string>
using namespace std;

void print(const string& s) {   // 不複製字串，也保證不會被改
    cout << s << '\n';
    // s = "oops";              // 編譯錯誤：s 是 const
}

int main() {
    string msg = "hello";
    print(msg);
    print("literal");           // const 參考可以直接接字面值
    return 0;
}
```

輸出：

```text
hello
literal
```

複製一個長字串很花時間，`&` 省掉複製，`const` 保證不會動到呼叫者的東西。順帶回收前面那條規則：`int&` 不能接 `5` 這種暫時值，但 **`const 型別&` 可以**——因為保證不會改它，編譯器乾脆替暫時值找塊地方放著，所以上面的 `print("literal")` 才合法。**規則：只讀不改、又比一個 `int` 大的，一律用 `const 型別&`**（之後學到的 `struct`、`vector` 都適用；**陣列是例外**——它傳進函式時本來就不會複製，10/08 會解釋為什麼）。

**三種傳法總整理**

| 情況 | 寫法 |
| --- | --- |
| 只讀取，資料很小（`int`、`double`、`char`） | 傳值 `int x` |
| 要改到呼叫端的變數，或一次帶回兩個以上的結果 | 傳參考 `int& x` |
| 只讀取，但資料比一個數字大（`string` 等） | 傳 const 參考 `const string& s` |

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

輸出：

```text
7
7.25
7
```

編譯器根據**你傳進去的引數型別與個數**決定要呼叫哪一個版本，這個挑選過程叫**重載解析（overload resolution）**。（有些書把 overloading 譯成「多載」，是同一件事。）

先分清楚兩個詞：**提升**＝往同族、更大、不會失真的型別搬（`char`／`short`→`int`、`float`→`double`）；**轉換**＝跨族或可能失真（`int`→`double`、`double`→`int`、`int`→`long`）。編譯器**偏好提升多過轉換**，挑選順序大致是：

1. 找**完全吻合**的版本。
2. 找只需要**提升**就能吻合的。
3. 找需要**轉換**才能吻合的。
4. 都找不到或**同時有兩個一樣好**→ 編譯錯誤 `call of overloaded ... is ambiguous`。

> **雷區 ②：只有回傳型別不同，不算重載**
> ```cpp
> int  f(int x);
> double f(int x);     // 編譯錯誤
> ```
> 因為呼叫 `f(3);` 時編譯器無從判斷你要哪一個。

> **雷區 ③：兩邊都要轉型，又一樣好 → 模稜兩可**
> ```cpp
> void show(long x);      // long 是另一種整數型別，大小介於 int 與 long long 之間
> void show(double x);
> show(5);                // 編譯錯誤：int→long 和 int→double 都是「轉換」，一樣好
> ```
> g++ 會報 `call of overloaded 'show(int)' is ambiguous`。對照一下：如果兩個版本是 `show(int)` 與 `show(double)`，那 `show('A')` 不會有事，因為 `char`→`int` 是型別提升（第 2 順位），贏過轉型（第 3 順位）。寫重載時**讓參數型別差異明顯**。

## 預設引數（default arguments）

在參數後面寫 `= 值`，呼叫時就可以**省略**這個參數，省略時自動用這個值：

```cpp
#include <iostream>
#include <string>
using namespace std;

void greet(const string& name = "world", char mark = '!') {
    cout << "Hello, " << name << mark << '\n';
}

int main() {
    greet();                 // Hello, world!
    greet("NSYSU");          // Hello, NSYSU!
    greet("NSYSU", '?');     // Hello, NSYSU?
    return 0;
}
```

輸出：

```text
Hello, world!
Hello, NSYSU!
Hello, NSYSU?
```

注意這裡順手用了 `const string&`——參數是參考，一樣可以給預設值。

規則：

- 有預設值的參數**必須放在參數列最右邊**（不然呼叫時無法判斷你省略了哪一個）。
- 預設值**只能寫一次**：有函式原型就寫在原型，沒有原型就寫在定義；兩邊都寫 g++ 會報 `default argument given for parameter 2 ... previous specification`。

> **雷區 ④：預設引數會跟重載打架**
> 同時有 `void g(int a);` 和 `void g(int a, int b = 1);` 時，`g(5);` 兩個都吻合，編譯錯誤 `call of overloaded 'g(int)' is ambiguous`。

## 用 `assert` 檢查前置條件

Ch4 後半換個主題：函式寫多了，怎麼確認它真的對。先從 09/24 那行寫在註解裡的 **precondition**（前置條件）講起——`assert` 可以讓那行註解自動被檢查。它是「這件事一定要成立，不成立就讓程式當場停下來」的除錯工具，要 `#include <cassert>`：

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
    divide(1, 0);            // 違反前置條件
    return 0;
}
```

輸出（在終端機直接執行）：

```text
2.5
app: main.cpp:6: double divide(double, double): Assertion `b != 0' failed.
Aborted (core dumped)
```

第一行要注意：`divide(10, 4)` 印的是 `2.5` 不是 `2`。`10`、`4` 雖然是整數字面值，但參數型別是 `double`，**傳進去的瞬間就先轉成 `10.0` 和 `4.0`**，所以函式裡算的是 `10.0 / 4.0`，不是 09/17 的整數除法——引數傳給參數時一樣會做隱式轉換，這正是上面重載解析第 3 順位在講的事。

後兩行就是斷言失敗的樣子：它直接告訴你**哪個檔、第幾行、哪個條件**掛掉，比自己到處插 `cout` 找 bug 快得多。

編譯時加上 `-DNDEBUG` 就會把所有 `assert` 關掉（正式版不做檢查）：

```bash
g++ -Wall -Wextra -std=c++17 -DNDEBUG -o app main.cpp
```

（`-D` 是「編譯時定義一個名字」，`NDEBUG` 是標準規定的固定名字。）實驗課寫作業時放幾個 `assert` 很好用，但**繳交前確認它不會誤觸發**。

## 測試技巧：stub 與 driver

- **Stub（樁）**：某個函式還沒寫好，先給一個假的實作，讓其他部分能先編譯、先測。
- **Driver（驅動程式）**：寫一個小 `main` 專門測試某一個函式，測完再把它接回大程式。

stub 長這樣：

```cpp
// stub：故意亂答（連 4 都會說是質數），只是為了讓用到它的程式先編譯、先跑起來
bool isPrime(int n) { return n >= 2; }
```

等外圍都測通了，再換成真正的實作，並配一個 driver 逐一檢查：

```cpp
#include <iostream>
using namespace std;

bool isPrime(int n) {                 // 要被測試的函式
    if (n < 2) return false;
    for (int i = 2; i <= n / i; i++)
        if (n % i == 0) return false;
    return true;
}

// driver：一個只為了測 isPrime 而存在的 main
int main() {
    for (int n = 1; n <= 10; n++)
        cout << n << " -> " << (isPrime(n) ? "prime" : "not prime") << '\n';
    return 0;
}
```

輸出：

```text
1 -> not prime
2 -> prime
3 -> prime
4 -> not prime
5 -> prime
6 -> not prime
7 -> prime
8 -> not prime
9 -> not prime
10 -> not prime
```

這兩個名詞筆試可能考定義，實務上也真的好用：**與其整支寫完才編譯，不如寫一個函式測一個**。

## 本週重點回顧

- **有 `&` 的參數是別名，在函式裡改它就是改到外面；沒有 `&` 的參數是複本，怎麼改都動不到呼叫端**——這是筆試最愛考的觀念。兩個補充：`const 型別&` 有 `&` 但被禁止改；11/19 學指標後會看到「指標本身是複本，但透過它仍能改到指向的東西」。另外 `int&` 只能接變數。
- 只讀不改又比一個數字大的東西，一律用 `const 型別&` 傳：不複製、又保證不被改。
- **重載看的是參數列表（型別或個數）**，**回傳型別不同不算重載**，會編譯錯誤。
- 預設引數只能放在參數列**最右邊**，而且原型與定義只能擇一寫。
- `assert(條件)` 把前置條件變成會自動檢查的程式碼（要 `#include <cassert>`）；stub 是暫時的假實作，driver 是專門測一個函式的小 `main`。

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

**為什麼要這樣寫？** 跟正文的兩數版一樣，只是候選人從兩個變三個。

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
square   = 9.00
rect     = 12.00
triangle = 6.00
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
    cout << "square   = " << area(a) << '\n';
    cout << "rect     = " << area(a, b) << '\n';
    cout << "triangle = " << area(a, b, c) << '\n';
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

**Q5. 綜合題：加分函式**
寫 `void applyBonus(const string& name, int& score, int bonus = 5)`：把 `score` 加上 `bonus`（上限 100），再印出名字與加分後的成績；函式開頭用 `assert` 擋掉負的 `bonus`。另外寫一個 driver `main` 測三組資料，其中一組省略 `bonus`、一組要撞到上限。

```text
輸出：
Amy -> 95
Bob -> 100
Cid -> 100
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <string>
#include <cassert>
using namespace std;

void applyBonus(const string& name, int& score, int bonus = 5) {
    assert(bonus >= 0);              // 前置條件：加分不能是負的
    score += bonus;
    if (score > 100) score = 100;    // 上限 100
    cout << name << " -> " << score << '\n';
}

// driver：只為了測 applyBonus 而存在的 main
int main() {
    int amy = 90, bob = 98, cid = 70;
    applyBonus("Amy", amy);          // bonus 省略，用預設值 5
    applyBonus("Bob", bob, 10);      // 撞到上限
    applyBonus("Cid", cid, 30);
    return 0;
}
```

一題用上本週四個重點：`const string&`（只讀不改的大東西）、`int&`（要改到呼叫端）、預設引數、`assert` 前置條件，外加一個 driver。

</details>

**實驗課題型加練**
以下照實驗課歷年課堂練習的題型改寫。這週實驗課的固定戲碼是：用同一個 swap 示範傳值與傳參考的差別、用預設引數、然後一題「反轉相加到迴文」的經典題。

**Q6. 傳值與傳參考：眼見為憑**
寫兩個交換函式 `swapByValue(int a, int b)` 與 `swapByRef(int& a, int& b)`，函式**內**交換後各印一次，`main` 在呼叫**前後**也各印一次，觀察差別。

```text
輸入： 3 8
輸出：
before: x = 3, y = 8
  inside swapByValue: a = 8, b = 3
after swapByValue: x = 3, y = 8
  inside swapByRef:   a = 8, b = 3
after swapByRef:   x = 8, y = 3
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

void swapByValue(int a, int b) {
    int tmp = a; a = b; b = tmp;
    cout << "  inside swapByValue: a = " << a << ", b = " << b << '\n';
}

void swapByRef(int& a, int& b) {
    int tmp = a; a = b; b = tmp;
    cout << "  inside swapByRef:   a = " << a << ", b = " << b << '\n';
}

int main() {
    int x, y;
    cin >> x >> y;
    cout << "before: x = " << x << ", y = " << y << '\n';
    swapByValue(x, y);
    cout << "after swapByValue: x = " << x << ", y = " << y << '\n';
    swapByRef(x, y);
    cout << "after swapByRef:   x = " << x << ", y = " << y << '\n';
    return 0;
}
```

函式裡兩個版本印出來一模一樣，差別只在**回到 `main` 之後**：傳值版改的是複本，`x`、`y` 沒動；傳參考版的 `a`、`b` 就是 `x`、`y` 的別名，所以真的換了。這題實驗課助教常常追問「為什麼裡面印的一樣、外面不一樣」，要能用「複本 vs 別名」講出來。

</details>

**Q7. 反轉相加到迴文**
把一個數跟它的反轉相加，結果若不是迴文就再做一次，直到出現迴文。例如 195 → 195 + 591 = 786 → 786 + 687 = 1473 → 1473 + 3741 = 5214 → 5214 + 4125 = 9339（迴文）。讀入起始數字，印出每一步、總共加了幾次、最後的迴文；超過 10 次還沒出現就放棄。要求兩個函式：`void reverseDigits(long long n, long long& result)` 用**傳參考**帶回反轉結果，`bool isPalindrome(long long n)` 判斷迴文。

```text
輸入： 195
輸出：
195 + 591 = 786
786 + 687 = 1473
1473 + 3741 = 5214
5214 + 4125 = 9339
steps: 4, palindrome: 9339
```

```text
輸入： 89
輸出：
89 + 98 = 187
187 + 781 = 968
968 + 869 = 1837
1837 + 7381 = 9218
9218 + 8129 = 17347
17347 + 74371 = 91718
91718 + 81719 = 173437
173437 + 734371 = 907808
907808 + 808709 = 1716517
1716517 + 7156171 = 8872688
gave up after 10 steps
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

// 把 n 反轉後放進 result（用參考帶回去）
void reverseDigits(long long n, long long& result) {
    result = 0;
    while (n > 0) {
        result = result * 10 + n % 10;
        n /= 10;
    }
}

bool isPalindrome(long long n) {
    long long r;
    reverseDigits(n, r);
    return r == n;
}

int main() {
    long long n;
    cin >> n;
    int steps = 0;
    while (!isPalindrome(n) && steps < 10) {
        long long r;
        reverseDigits(n, r);
        cout << n << " + " << r << " = " << n + r << '\n';
        n += r;
        steps++;
    }
    if (isPalindrome(n))
        cout << "steps: " << steps << ", palindrome: " << n << '\n';
    else
        cout << "gave up after 10 steps\n";
    return 0;
}
```

反轉的邏輯跟 09/24 的 Q3 一樣，只是結果改用參考參數帶回、回傳型別變成 `void`——這是題目指定的練習重點。用 `long long` 是因為數字每加一次就長一位，`int` 撐不到 10 步（89 那組第 10 步已經是七位數再反轉相加）。

</details>

**Q8. 字尾符號（預設引數）**
讀入一個不含空白的字串，用**同一個函式** `void decorate(const string& s, int len = 0)` 印兩次：第一次不給長度，一律在尾端加 `!`；第二次把字串長度傳進去，長度 ≥ 5 加 `~`、2–4 加 `*`、1 加 `!`。字串長度用 `s.size()` 取得（`string` 內建的功能，回傳字元數；10/29 會系統性介紹）。

```text
輸入： nsysu
輸出：
nsysu!
nsysu~
```

```text
輸入： hey
輸出：
hey!
hey*
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <string>
using namespace std;

// len 省略（或給 0）時：一律加 "!"；有給長度時：依長度決定符號
void decorate(const string& s, int len = 0) {
    if (len == 0)     cout << s << "!\n";
    else if (len >= 5) cout << s << "~\n";
    else if (len > 1)  cout << s << "*\n";
    else               cout << s << "!\n";
}

int main() {
    string s;
    cin >> s;
    decorate(s);                 // 不看長度
    decorate(s, s.size());       // 看長度
    return 0;
}
```

預設引數 `= 0` 讓「沒給長度」變成一個可以判斷的狀態。`decorate(s, s.size())` 把 `size_t`（無號）傳給 `int` 參數會發生隱含轉換，g++ 在 `-Wall -Wextra` 下不會警告，而且字串長度不可能大到出問題；想寫得更明確可以用 `static_cast<int>(s.size())`。

</details>

**Q9. 最大公因數與最小公倍數**
反覆讀入兩個正整數，輸出它們的最大公因數與最小公倍數，讀到 `0 0` 結束；有非正數就印 `invalid`。最大公因數請用**遞迴**寫輾轉相除法：$\gcd(a, b) = \gcd(b, a \bmod b)$，$b = 0$ 時答案是 $a$。

```text
輸入：
12 18
7 5
100000000000 250000000000
0 0
輸出：
gcd = 6, lcm = 36
gcd = 1, lcm = 35
gcd = 50000000000, lcm = 500000000000
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

// 輾轉相除法：gcd(a, b) = gcd(b, a % b)，餘數為 0 時答案就是 b
long long gcd(long long a, long long b) {
    if (b == 0) return a;
    return gcd(b, a % b);
}

long long lcm(long long a, long long b) {
    return a / gcd(a, b) * b;      // 先除再乘，比較不容易溢位
}

int main() {
    long long a, b;
    while (true) {
        cin >> a >> b;
        if (a == 0 && b == 0) break;
        if (a <= 0 || b <= 0) {
            cout << "invalid\n";
            continue;
        }
        cout << "gcd = " << gcd(a, b) << ", lcm = " << lcm(a, b) << '\n';
    }
    return 0;
}
```

輾轉相除法的遞迴版只有兩行，比迴圈版更貼近數學定義，期末筆試常拿來當「看程式答輸出」。最小公倍數寫成 `a / gcd * b` 而不是 `a * b / gcd`：先乘的話 `a * b` 可能先溢位，就算最後除回來也已經錯了。「讀到 `0 0` 結束」是實驗課上機考的標準格式，寫成 `while (true)` 加 `break` 最直白。

</details>

---

[← 09/24｜流程控制與函式基礎（Ch 2、Ch 3）](/2026/09/09/nsysu-c-programming/0924-flow-control/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [10/08｜陣列（Ch 5） →](/2026/09/09/nsysu-c-programming/1008-arrays/)
