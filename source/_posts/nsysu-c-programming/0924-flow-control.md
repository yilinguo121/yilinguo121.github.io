---
title: 09/24｜流程控制與函式基礎（Ch 2、Ch 3）
date: 2026-09-10
updated: 2026-09-11
permalink: 2026/09/09/nsysu-c-programming/0924-flow-control/
cover: /images/code-cover.jpg
categories: [程式設計]
tags: [C++, 中山大學, 自學指南]
toc: true
comments: true
hidden: true
---

[← 09/17｜C++ 基礎（Ch 1）](/2026/09/09/nsysu-c-programming/0917-cpp-basics/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [10/01｜參數傳遞與函式重載（Ch 4） →](/2026/09/09/nsysu-c-programming/1001-parameters/)

> 對應課本習題：Ch3: 1, 5, 10, 11, 13

**這週要會什麼**

```text
布林運算式 → if / switch → while / do-while / for → break / continue
            → 預定義函式 → 自訂函式 → 遞迴 → 作用域
```

這是整學期**份量最重的一次進度**，兩章塞在一起。如果只能挑一週認真做練習，就是這週。

## 布林運算式

比較運算子：`==`、`!=`、`<`、`<=`、`>`、`>=`
邏輯運算子：`&&`（且）、`||`（或）、`!`（非）

```cpp
bool inRange = (0 <= x && x <= 100);
bool isWeekend = (day == 6 || day == 7);
bool notEmpty = !s.empty();
```

**優先順序**（由高到低）：`!` > 算術運算子 > 比較運算子 > `&&` > `||` > `=`
不確定就**加括號**，沒有人會因為你多加括號扣分。

> **雷區 ①：連續不等式**
> ```cpp
> if (0 < x < 10)   // 永遠為真！
> ```
> C++ 會先算 `0 < x`，得到 `true`(1) 或 `false`(0)，再拿 1 或 0 去跟 10 比——`1 < 10` 與 `0 < 10` 都成立。正確寫法：`if (0 < x && x < 10)`。

> **雷區 ②：`=` 寫成 `==`**
> ```cpp
> if (x = 5) { ... }   // 這是「把 5 指派給 x」，結果 5 非 0 → 永遠為真
> ```
> `-Wall` 會提示 `warning: suggest parentheses around assignment used as truth value`。看到這個警告 99% 是打錯字。

> **雷區 ③：整數可以當布林用**
> ```cpp
> int n = 0;
> if (n) cout << "yes";    // 不會印，因為 0 == false
> if (-3) cout << "yes";   // 會印，非 0 皆為 true
> ```
> 這在讀別人程式碼時常見（`while (n)` 等同 `while (n != 0)`），自己寫則建議寫清楚。

**短路求值（short-circuit evaluation）**：

```cpp
if (a != 0 && b / a > 3)  { ... }   // a == 0 時右邊「不會被執行」，避免除以 0
if (i < n && arr[i] > 0)  { ... }   // 先確認索引合法，再存取陣列
```

`&&` 左邊為 `false` 就不算右邊；`||` 左邊為 `true` 就不算右邊。**順序寫反就會當掉**，這是很實用的防呆技巧。

## 分支：`if` / `else if` / `else`

```cpp
int score;
cin >> score;
if (score >= 90)      cout << 'A';
else if (score >= 80) cout << 'B';
else if (score >= 70) cout << 'C';
else if (score >= 60) cout << 'D';
else                  cout << 'F';
```

多路 `if-else` 是**由上而下**逐一檢查，第一個成立就結束，所以條件要**由嚴格排到寬鬆**。如果把 `score >= 60` 寫在第一個，95 分也會拿 D。

**複合敘述（compound statement）**：只有一行時可以不加大括號，但**建議一律加**：

```cpp
if (x > 0)
    cout << "positive";
    cout << "!!!";        // 陷阱：這行「不在」if 裡面，永遠會執行
```

## `switch`

```cpp
char op;
int a, b;
cin >> a >> op >> b;
switch (op) {
    case '+': cout << a + b; break;
    case '-': cout << a - b; break;
    case '*': cout << a * b; break;
    case '/':
        if (b == 0) cout << "divide by zero";
        else        cout << a / b;
        break;
    default:  cout << "unknown operator";
}
```

規則：

- `switch` 的條件必須是**整數型別或字元或列舉**，**不能是 `double` 或 `string`**。
- `case` 後面必須是**常數**。
- 沒寫 `break` 會**穿透（fall-through）**到下一個 `case`。

> **雷區 ④：忘記 `break`**
> ```cpp
> switch (n) {
>     case 1: cout << "one";
>     case 2: cout << "two"; break;
> }
> // n == 1 時會印出 "onetwo"
> ```
> 有時穿透是刻意的（多個 case 共用同一段程式），這時建議加註解 `// fall through`。

**列舉型別（enum）**，適合搭配 `switch`：

```cpp
enum Weekday { MON, TUE, WED, THU, FRI };   // MON=0, TUE=1, ...
enum class Color { RED, GREEN, BLUE };      // C++11 強型別列舉

Weekday d = WED;
if (d == WED) cout << "Wednesday";
Color c = Color::RED;                       // 強型別必須加 Color::
```

**條件運算子（三元運算子）**：

```cpp
int maxVal = (a > b) ? a : b;      // 等同 if-else 的簡寫
cout << (n % 2 == 0 ? "even" : "odd");
```

## 迴圈

```cpp
// while：先判斷再執行，可能一次都不跑
int n = 100, cnt = 0;
while (n > 1) { n /= 2; cnt++; }

// do-while：先執行再判斷，至少跑一次（適合輸入驗證）
int x;
do {
    cout << "請輸入正整數：";
    cin >> x;
} while (x <= 0);

// for：初始化、條件、更新寫在一起
for (int i = 1; i <= 10; i++) cout << i << ' ';
```

`for` 的三個部分都可以省略，`for (;;)` 就是無窮迴圈。

**巢狀迴圈**（九九乘法表）：

```cpp
for (int i = 1; i <= 9; i++) {
    for (int j = 1; j <= 9; j++)
        cout << i << "*" << j << "=" << i * j << '\t';
    cout << '\n';
}
```

> **雷區 ⑤：`for` 後面多一個分號**
> ```cpp
> for (int i = 0; i < 10; i++);     // 注意這個分號
>     cout << i;                     // 這行只執行一次，而且 i 已超出作用域 → 編譯錯
> ```

> **雷區 ⑥：無窮迴圈**
> ```cpp
> for (int i = 0; i != 10; i += 3)  { ... }   // i = 0,3,6,9,12,... 永遠跳過 10
> ```
> 迴圈條件用 `<`、`<=` 比用 `!=` 安全。另外浮點數也不要拿來當迴圈計數器（`for (double d = 0; d != 1.0; d += 0.1)` 因為精度誤差不會停）。

**`break` 與 `continue`**：

```cpp
for (int i = 1; i <= 100; i++) {
    if (i % 3 != 0) continue;    // 不是 3 的倍數就跳過本輪剩下的部分
    if (i > 30) break;           // 超過 30 就整個跳出迴圈
    cout << i << ' ';
}
// 印出 3 6 9 12 15 18 21 24 27 30
```

`break` 只跳出**最內層**的迴圈。想跳出雙層迴圈，用旗標變數或把它包成函式直接 `return`。

### 逗號運算子

`,` 也可以當成運算子：**由左到右依序計算，整串運算式的值是最右邊那一個**。最常見的用途是在 `for` 的初始化與更新部分塞進多個動作：

```cpp
#include <iostream>
using namespace std;

int main() {
    for (int i = 0, j = 10; i < j; i++, j--)   // 兩個地方都用了逗號運算子
        cout << i << ' ' << j << '\n';
    return 0;
}
```

輸出：

```text
0 10
1 9
2 8
3 7
4 6
```

除了 `for` 之外，其他地方用逗號運算子只會讓程式更難讀，不建議。

## 從檔案讀入（Ch2 尾）

課本在 Ch2 最後就介紹了 `ifstream`，[後面〈檔案輸入輸出〉那一節](/2026/09/09/nsysu-c-programming/1203-file-io/)會完整講，這裡先知道長相：

```cpp
#include <fstream>
ifstream fin("input.txt");
int x;
while (fin >> x) { /* ... */ }
```

## 預定義函式

```cpp
#include <cmath>     // 數學函式
#include <cstdlib>   // rand, srand, abs, exit
#include <ctime>     // time
```

| 函式 | 功能 | 範例 |
| --- | --- | --- |
| `sqrt(x)` | 平方根 | `sqrt(16.0)` → `4.0` |
| `pow(x, y)` | $x^y$ | `pow(2, 10)` → `1024` |
| `abs(n)` / `fabs(x)` | 整數 / 浮點絕對值 | `abs(-3)` → `3` |
| `ceil(x)` / `floor(x)` | 無條件進位 / 捨去 | `ceil(3.2)` → `4.0` |
| `round(x)` | 四捨五入 | `round(3.5)` → `4.0` |
| `max(a, b)` / `min(a, b)` | 較大 / 較小值（`<algorithm>`） | `max(3, 7)` → `7` |

**亂數**：

```cpp
#include <iostream>
#include <cstdlib>
#include <ctime>
using namespace std;

int main() {
    srand(time(nullptr));            // 用目前時間當種子，每次執行結果不同
    int dice = rand() % 6 + 1;       // 1 ~ 6
    int r = rand() % 100;            // 0 ~ 99
    cout << dice << ' ' << r << '\n';
    return 0;
}
```

某一次的執行結果（每次都不一樣）：

```text
3 11
```

`srand` 整支程式**只呼叫一次**（放在 `main` 開頭）。放在迴圈裡每次都重設種子，反而會一直拿到同一個數。

## 自訂函式

函式的三要素：**回傳型別**、**函式名**、**參數列表**。

```cpp
#include <iostream>
using namespace std;

// 函式「定義」：有 body
int gcd(int a, int b) {
    return (b == 0) ? a : gcd(b, a % b);     // 遞迴
}

bool isPrime(int n) {
    if (n < 2) return false;
    for (int i = 2; i * i <= n; i++)
        if (n % i == 0) return false;
    return true;
}

void greet(string name) {                    // void：不回傳值
    cout << "Hello, " << name << "!\n";
}

int main() {
    cout << gcd(24, 36) << '\n';     // 12
    cout << isPrime(17) << '\n';     // 1（true 印出來是 1）
    greet("NSYSU");
    return 0;
}
```

輸出：

```text
12
1
Hello, NSYSU!
```

**函式原型（prototype）**：如果想把 `main` 放在最前面，就要先「宣告」函式：

```cpp
#include <iostream>
using namespace std;

int gcd(int a, int b);       // 宣告（prototype），注意結尾有分號

int main() {
    cout << gcd(24, 36);
    return 0;
}

int gcd(int a, int b) {      // 定義寫在後面
    return (b == 0) ? a : gcd(b, a % b);
}
```

輸出：

```text
12
```

宣告時參數名可以省略：`int gcd(int, int);` 也合法。

（`greet` 的參數之後可以再改良成 `const string&`，效率比較好，但那要等到[下一節講參數傳遞](/2026/09/09/nsysu-c-programming/1001-parameters/)才會解釋 `&` 是什麼，這裡先用最單純的寫法。）

**要點：**

- 回傳型別不是 `void` 時，**每一條執行路徑都要 `return`**。漏掉的話 `-Wall` 會警告 `control reaches end of non-void function`，執行結果是垃圾值。
- `void` 函式可以用 `return;`（沒有值）提早結束。
- **參數（parameter）** 是函式定義裡的變數名，**引數（argument）** 是呼叫時實際傳進去的值。筆試喜歡考這組名詞。

**函式可以呼叫函式**：上面的 `main` 呼叫了 `gcd`、`isPrime`、`greet`，而 `gcd` 裡面又呼叫了自己。函式互相呼叫是把大問題拆小的基礎——寫程式時先想「我需要哪幾個小工具」，再一個一個把它們實作出來。

> **雷區 ⑦：引數順序寫反**
> ```cpp
> double areaOfRect(double width, double height);
> areaOfRect(3.0, 5.0);    // 編譯器不會幫你檢查你到底哪個是寬哪個是高
> ```
> 型別相同時**編譯器完全幫不上忙**，只能靠命名與註解。

**前置條件與後置條件（precondition / postcondition）**：課本強調的文件習慣，筆試可能考名詞：

```cpp
// Precondition:  n >= 0
// Postcondition: 回傳 n!
int factorial(int n);
```

## 遞迴

遞迴函式必須有兩個部分：

1. **終止條件（base case）**：不再呼叫自己的情況。
2. **遞迴步驟**：呼叫自己，但問題規模要**變小**。

```cpp
int factorial(int n) {
    if (n <= 1) return 1;            // base case
    return n * factorial(n - 1);     // recursive step
}
```

追蹤 `factorial(4)`：

```text
factorial(4) = 4 * factorial(3)
             = 4 * (3 * factorial(2))
             = 4 * (3 * (2 * factorial(1)))
             = 4 * (3 * (2 * 1)) = 24
```

> **雷區 ⑧：無窮遞迴**
> 忘記 base case 或問題沒變小，會一直往下呼叫直到**堆疊溢位（stack overflow）**，執行時出現 `Segmentation fault`。

## 作用域（scope）

```cpp
#include <iostream>
using namespace std;

int g = 100;              // 全域變數（盡量少用）

int main() {
    int x = 10;           // 區域變數，只在 main 內有效
    {
        int x = 5;        // 內層區塊的新變數，遮蔽外層的 x
        cout << x << '\n';        // 5
    }
    cout << x << '\n';            // 10
    for (int i = 0; i < 3; i++) { /* i 只在這個 for 內有效 */ }
    // cout << i;         // 編譯錯誤：'i' was not declared in this scope
    return 0;
}
```

輸出：

```text
5
10
```

- **區域變數**在函式（或區塊）結束時消失，不同函式裡的同名變數互不相干。
- **全域常數**（`const double PI = 3.14159;`）可以接受；**全域變數**則會讓程式難以追蹤，課本與業界都建議避免。
- **程序抽象（procedural abstraction）**：使用函式的人只需要知道「它做什麼」，不需要知道「它怎麼做」——這就是把程式拆成函式的目的。

## 本節重點回顧

- `0 < x < 10` **永遠為真**，要寫成 `0 < x && x < 10`。
- `=` 是指派、`==` 才是比較。`if (x = 5)` 會編譯過但永遠成立。
- `switch` 的 `case` 忘記 `break` 會**穿透**到下一個 case。
- `while` 先判斷、`do-while` **至少執行一次**（適合輸入驗證）；迴圈條件用 `<`、`<=` 比 `!=` 安全。
- `break` 跳出整個迴圈（且只跳一層），`continue` 只跳過本輪剩下的部分。
- 非 `void` 的函式，**每一條路徑都要 `return`**。
- 遞迴一定要有**終止條件**，而且每次呼叫問題規模要變小。
- 內層區塊宣告的同名變數會**遮蔽**外層的，離開區塊後外層完全不受影響。

## 本週練習題

**Q1. 質數列印**
讀入正整數 `n`，輸出 2 到 `n` 之間（含）所有質數，以空白分隔，最後換行。

```text
輸入： 20
輸出： 2 3 5 7 11 13 17 19
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

bool isPrime(int n) {
    if (n < 2) return false;
    for (int i = 2; i * i <= n; i++)      // 只需檢查到 sqrt(n)
        if (n % i == 0) return false;
    return true;
}

int main() {
    int n;
    cin >> n;
    bool first = true;
    for (int i = 2; i <= n; i++) {
        if (!isPrime(i)) continue;
        if (!first) cout << ' ';
        cout << i;
        first = false;
    }
    cout << '\n';
    return 0;
}
```

`i * i <= n` 比 `i <= sqrt(n)` 好：不用引入浮點運算，也沒有精度問題。

</details>

**Q2. 階乘（兩種寫法）**
寫出 `int factIter(int n)`（迴圈版）與 `int factRec(int n)`（遞迴版），讀入 `n`（0 ≤ n ≤ 12）後兩種都印一次，確認結果相同。

```text
輸入： 5
輸出：
iterative: 120
recursive: 120
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

int factIter(int n) {
    int result = 1;
    for (int i = 2; i <= n; i++) result *= i;
    return result;
}

int factRec(int n) {
    if (n <= 1) return 1;
    return n * factRec(n - 1);
}

int main() {
    int n;
    cin >> n;
    cout << "iterative: " << factIter(n) << '\n';
    cout << "recursive: " << factRec(n) << '\n';
    return 0;
}
```

為什麼限制 n ≤ 12？因為 `13! = 6227020800` 已經超過 `int` 的上限（約 21 億），會溢位。需要更大就換 `long long`（可到 20!）。

</details>

**Q3. 數字反轉與回文判斷**
讀入一個正整數，輸出它反轉後的數字，並判斷是否為回文數。

```text
輸入： 12321
輸出：
reversed: 12321
palindrome: yes
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

int reverseNumber(int n) {
    int r = 0;
    while (n > 0) {
        r = r * 10 + n % 10;    // 取個位數，接到 r 的尾巴
        n /= 10;                // 去掉個位數
    }
    return r;
}

int main() {
    int n;
    cin >> n;
    int r = reverseNumber(n);
    cout << "reversed: " << r << '\n';
    cout << "palindrome: " << (r == n ? "yes" : "no") << '\n';
    return 0;
}
```

</details>

**Q4. 成績等第（`switch` 版）**
讀入 0–100 的整數分數，用 **`switch`** 輸出等第（90↑ A、80↑ B、70↑ C、60↑ D、其餘 F）。分數不在 0–100 範圍時輸出 `invalid`。

```text
輸入： 87
輸出： B
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

int main() {
    int score;
    cin >> score;
    if (score < 0 || score > 100) {
        cout << "invalid\n";
        return 0;
    }
    switch (score / 10) {          // 關鍵：把 0~100 壓成 0~10
        case 10:
        case 9:  cout << "A\n"; break;
        case 8:  cout << "B\n"; break;
        case 7:  cout << "C\n"; break;
        case 6:  cout << "D\n"; break;
        default: cout << "F\n";
    }
    return 0;
}
```

`case 10:` 後面故意不寫 `break`，讓 100 分穿透到 `case 9` 的處理——這是**刻意**的 fall-through。

</details>

**Q5. 猜數字**
程式用 `rand()` 產生 1–100 的秘密數字，重複讀入玩家的猜測，提示 `too high` / `too low`，猜中則印出 `correct in k guesses` 並結束。

```text
（互動範例）
50  → too high
25  → too low
37  → correct in 3 guesses
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <cstdlib>
#include <ctime>
using namespace std;

int main() {
    srand(time(nullptr));              // 整支程式只呼叫一次
    int secret = rand() % 100 + 1;
    int guess = 0, count = 0;
    do {
        cin >> guess;
        count++;
        if (guess > secret)      cout << "too high\n";
        else if (guess < secret) cout << "too low\n";
    } while (guess != secret);
    cout << "correct in " << count << " guesses\n";
    return 0;
}
```

用 `do-while` 而不是 `while`，因為「至少要先讀一次猜測」——這就是 `do-while` 的典型使用時機。

</details>

**Q6. 費氏數列**
讀入 `n`，輸出費氏數列前 `n` 項（$F_1 = 1, F_2 = 1$），以空白分隔。請用**迴圈**寫，並想想為什麼這題不該用單純遞迴。

```text
輸入： 10
輸出： 1 1 2 3 5 8 13 21 34 55
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    long long prev = 0, cur = 1;       // cur 是第 1 項
    for (int i = 1; i <= n; i++) {
        if (i > 1) cout << ' ';
        cout << cur;
        long long next = prev + cur;
        prev = cur;
        cur = next;
    }
    cout << '\n';
    return 0;
}
```

**為什麼不用純遞迴？** `fib(n) = fib(n-1) + fib(n-2)` 會把同一個子問題重複算無數次，時間複雜度是指數級的 $O(1.618^n)$，`n = 45` 就要跑很久。迴圈版是 $O(n)$。

</details>

---

[← 09/17｜C++ 基礎（Ch 1）](/2026/09/09/nsysu-c-programming/0917-cpp-basics/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [10/01｜參數傳遞與函式重載（Ch 4） →](/2026/09/09/nsysu-c-programming/1001-parameters/)
