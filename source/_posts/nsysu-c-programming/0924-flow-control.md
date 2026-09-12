---
title: 09/24｜流程控制與函式基礎（Ch 2、Ch 3）
date: 2026-09-10
updated: 2026-09-12
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
布林運算式 → if / switch（含 enum、三元運算子）
           → while / do-while / for → break / continue → 從檔案讀入
── 以上 Ch2 ────────────────────────────
預定義函式 → 自訂函式 → 作用域 → 遞迴
```

這是整學期**份量最重的一次進度**，兩章塞在一起。讀不完很正常，可以在 Ch2 結束的地方停一次，分兩天讀。

（下面的程式碼裡如果出現 `{ ... }` 或 `/* ... */`，那是「這裡省略了與重點無關的程式碼」的意思，不是要你真的打三個點。可編譯性的規則跟 09/17 一樣：**有寫 `#include` 和 `int main()` 的區塊才是可以直接編譯的完整程式**，其餘都是片段，要自己貼進 `main` 的大括號裡；片段裡沒宣告的變數，例如三元運算子那段的 `a`、`b`、`n`，也要自己先補上 `int a = 3, b = 5, n = 7;` 之類的宣告。）

## Ch2：流程控制

### 布林運算式

比較運算子：`==`、`!=`、`<`、`<=`、`>`、`>=`
邏輯運算子：`&&`（且）、`||`（或）、`!`（非）

```cpp
int x = 50, day = 6;                      // 一行宣告兩個 int，等同 int x = 50; int day = 6;
bool inRange    = (0 <= x && x <= 100);   // 兩個條件都成立才是 true
bool isWeekend  = (day == 6 || day == 7); // 任一個成立就是 true
bool notInRange = !inRange;               // ! 把 true / false 反過來
```

**優先順序**（由高到低）：`!` > 算術運算子 > 比較運算子 > `&&` > `||` > `=`
不確定就**加括號**，沒有人會因為你多加括號扣分。

> **雷區 ①：連續不等式**
> ```cpp
> if (0 < x < 10)   // 永遠為真！
> ```
> C++ 會先算 `0 < x`，得到 `true`(1) 或 `false`(0)，再拿 1 或 0 去跟 10 比——`1 < 10` 與 `0 < 10` 都成立。正確寫法：`if (0 < x && x < 10)`。
> 這招 `-Wall` 抓得到：`warning: comparisons like ‘X<=Y<=Z’ do not have their mathematical meaning [-Wparentheses]`，看到就是中這招。

> **雷區 ②：`=` 寫成 `==`**
> ```cpp
> if (x = 5) { ... }   // 這是「把 5 指派給 x」，結果 5 非 0 → 永遠為真
> ```
> `-Wall` 會提示 `warning: suggest parentheses around assignment used as truth value`。看到這個警告 99% 是打錯字。

Ch1 提過「非 0 即 true」，所以讀別人的程式時 `while (n)` 就等於 `while (n != 0)`；自己寫建議寫完整。

**短路求值（short-circuit evaluation）**：`&&` 左邊為 `false` 就不算右邊；`||` 左邊為 `true` 就不算右邊。

```cpp
int a = 0, b = 10;
if (a != 0 && b / a > 3) { ... }   // a == 0 時右邊「不會被執行」，避免除以 0
```

所以**保護條件一定要寫在左邊**：寫成 `if (b / a > 3 && a != 0)` 就沒救了，`a` 是 0 時 `b / a` 先被算，**整數除以 0** 會讓程式當場 `Floating point exception (core dumped)` 掛掉，右邊的保護來不及生效。

### 分支：`if` / `else if` / `else`

最小形式是 `if (條件) 敘述A else 敘述B`——括號裡的條件（一個布林運算式）算出來是 `true` 就執行敘述A，是 `false` 就執行敘述B，`else` 那半可以整個省略。結果不只兩種時，把下一個 `if` 接在 `else` 後面寫成 `else if`，就變成一串由上往下的檢查：

```cpp
int score;
cin >> score;
if (score >= 90)      { cout << 'A'; }
else if (score >= 80) { cout << 'B'; }
else if (score >= 70) { cout << 'C'; }
else if (score >= 60) { cout << 'D'; }
else                  { cout << 'F'; }
```

多路 `if-else` 是**由上而下**逐一檢查，第一個成立就結束，所以條件要**由嚴格排到寬鬆**。如果把 `score >= 60` 寫在第一個，95 分也會拿 D。

用 `{}` 包起來的一串敘述叫**複合敘述（compound statement）**，語法上算「一個」敘述——`if` 後面永遠只管一個敘述。只有一行時大括號可以不加，但**建議一律加**（上面的範例就是照這個規矩寫的）：

```cpp
if (x > 0)
    cout << "positive";
    cout << "!!!";        // 陷阱：這行「不在」if 裡面，永遠會執行
```

### 條件運算子（三元運算子）

寫法是 `條件 ? 值A : 值B`——條件成立時整串的值是 `值A`，不成立時是 `值B`。它是**運算式**（算得出一個值），所以可以直接放在 `=` 右邊或 `cout <<` 後面，算是 `if`／`else` 的運算式版本。

```cpp
int maxVal = (a > b) ? a : b;          // 等同 if (a > b) maxVal = a; else maxVal = b;
cout << (n % 2 == 0 ? "even" : "odd");
```

放進 `cout <<` 時**外面那層括號不能省**：`<<` 的優先順序比 `?:` 高，少了括號會變成先算 `cout << n % 2`、再拿整個 `cout` 去跟 `0` 比，編譯器會吐出一長串 `no match for 'operator=='`。

### `switch`

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

```text
輸入： 12 * 5
輸出： 60
```

（`cin >> a >> op >> b` 會依序抓走三樣東西，中間的空白自動跳過。）

先建立心智模型：`switch` **不是**「從幾個分支裡挑一個」，而是「拿括號裡的值跟每個 `case` 的常數比對，跳到相符的那一行，然後**一路往下執行**，直到遇見 `break` 或大括號結束」；都沒對上就跳到 `default:`（可省略，省略時什麼都不做）。`case 常數:`、`default:` 後面接的是冒號——它們是標記位置的**標籤**、不是敘述，所以不加分號。另外兩條限制：`switch` 的條件必須是**整數型別、字元或列舉**（**不能是 `double` 或 `string`**），而 `case` 後面必須是**常數**。

> **雷區 ③：忘記 `break`**
> ```cpp
> switch (n) {
>     case 1: cout << "one";
>     case 2: cout << "two"; break;
> }
> // n == 1 時會印出 "onetwo"
> ```
> 這段用 `g++ -Wall -Wextra` 編就會被抓到：`warning: this statement may fall through [-Wimplicit-fallthrough=]`，底下還會補一行 `note: here` 指出穿到哪裡去。
> 有時穿透是刻意的（多個 case 共用同一段程式），這時在兩個 `case` 之間加一行註解 `// fall through`，警告就會消失——**g++ 認得這句英文**，它不只是寫給人看的。至於 Q4 解答那種「`case 10:` 後面直接接 `case 9:`」的空標籤，中間沒有任何敘述，不算穿透，本來就不會警告。

**列舉型別（enum）**：自己造一組有名字的整數常數，跟 `switch` 很搭：

```cpp
enum Weekday { MON, TUE, WED, THU, FRI };   // MON=0, TUE=1, ...

Weekday d = WED;
switch (d) {
    case MON: cout << "週一"; break;
    case WED: cout << "週三"; break;
    default:  cout << "其他天";
}
```

輸出：

```text
週三
```

`enum` 是在**宣告一個型別**，大括號後面要加分號——之後的 `struct`、`class`（10/15、10/22）也是同一條規則，`if`／`for` 那種**敘述**才不用。C++11 另有 `enum class`（更嚴格、不會撞名），課堂上多半仍用一般的 `enum`。

### 迴圈

（下面會大量用到 `n /= 2`、`cnt++` 這些簡寫，[09/17 的〈複合指定運算子〉與〈`++` 與 `--`〉](/2026/09/09/nsysu-c-programming/0917-cpp-basics/)講過，忘了就回去翻一下。）

**`while`：先判斷再執行**，條件一開始就不成立就一次都不跑。

```cpp
int n = 100, cnt = 0;
while (n > 1) { n /= 2; cnt++; }   // 100→50→25→12→6→3→1
cout << cnt;                       // 6：100 一直除以 2，除 6 次會變成 1
```

**`do-while`：先執行再判斷**，至少跑一次，適合輸入驗證。

```cpp
int x;
do {
    cout << "請輸入正整數：";
    cin >> x;
} while (x <= 0);        // 結尾這個分號不能省，do-while 是唯一要用分號收尾的迴圈
```

實際跑起來：

```text
請輸入正整數：-3
請輸入正整數：0
請輸入正整數：7      ← 讀到正數才離開迴圈
```

**`for`：把初始化、條件、更新寫在一起**。

```cpp
for (int i = 1; i <= 10; i++) cout << i << ' ';   // 1 2 3 ... 10
```

`for` 的執行順序：① `int i = 1` 只做一次 → ② 檢查 `i <= 10`，不成立就結束 → ③ 執行迴圈主體 → ④ 做 `i++`，回到 ②。在 `for (...)` 裡宣告的 `i` **只活在這個迴圈內**。三個部分都可省略，`for (;;)` 就是無窮迴圈。浮點數則不要拿來當計數器：`for (double d = 0; d != 1.0; d += 0.1)` 因為精度誤差永遠不會停。

**巢狀迴圈**（九九乘法表）：

```cpp
for (int i = 1; i <= 9; i++) {
    for (int j = 1; j <= 9; j++)
        cout << i << "*" << j << "=" << i * j << '\t';
    cout << '\n';
}
```

輸出（只列前兩行）：

```text
1*1=1	1*2=2	1*3=3	...	1*9=9
2*1=2	2*2=4	2*3=6	...	2*9=18
```

`for` 的括號裡想塞兩件事時有兩種機制，長得像但不一樣：**初始化**部分寫 `int i = 0, j = 10` 是「一次宣告兩個同型別變數」（跟 `int a, b;` 同一回事，兩個都是 `int`）；**更新**部分寫 `i++, j--` 才是**逗號運算子**——由左到右依序做，整串的值取最右邊那一個。

```cpp
for (int i = 0, j = 10; i < j; i++, j--)
    cout << i << ' ' << j << '\n';      // 0 10 / 1 9 / 2 8 / 3 7 / 4 6
```

`for` 以外的地方用逗號運算子只會讓程式更難讀，不建議。

> **雷區 ④：`for` 後面多一個分號**
> ```cpp
> int i, sum = 0;
> for (i = 1; i <= 10; i++);   // 注意這個分號：迴圈主體是「空的」
>     sum += i;                // 這行不在迴圈裡，只跑一次 → sum = 11，不是 55
> ```
> 這種寫法編得過、跑得完、答案卻是錯的。`g++ -Wall` 會警告 `this 'for' clause does not guard... [-Wmisleading-indentation]`，看到就是中這招。

> **雷區 ⑤：無窮迴圈**
> ```cpp
> for (int i = 0; i != 10; i += 3)  { ... }   // i = 0,3,6,9,12,... 永遠跳過 10
> ```
> 迴圈條件用 `<`、`<=` 比用 `!=` 安全。

**`break` 與 `continue`**：

```cpp
for (int i = 1; i <= 100; i++) {
    if (i % 3 != 0) continue;    // 不是 3 的倍數就跳過本輪剩下的部分
    if (i > 30) break;           // 超過 30 就整個跳出迴圈
    cout << i << ' ';
}
// 印出 3 6 9 12 15 18 21 24 27 30
```

`break` 只跳出**最內層**的迴圈——以上面的九九乘法表為例，內層的 `break` 只會讓那一列提早結束，外層的 `i` 照樣往下跑。想一次跳出兩層，最乾淨的做法是把雙層迴圈包成一個函式，找到答案就直接 `return`（`return` 會立刻結束整個函式，兩層一起離開），這招等下一章〈自訂函式〉學完就會用了。

> **先認個長相：從檔案讀**
> 課本在 Ch2 最後就介紹了 `ifstream`，[後面〈檔案輸入輸出〉那一節](/2026/09/09/nsysu-c-programming/1203-file-io/)會完整講：
> ```cpp
> #include <fstream>
> ifstream fin("input.txt");      // 括號裡放要開啟的檔名
> int x;
> while (fin >> x) { /* ... */ }  // 意思是「成功讀到一個數就繼續，讀到檔尾就停」
> ```
> 括號放初值、串流能當條件，原理分別在 10/22 與 12/03，現在認得長相就好。

## Ch3：把程式切成函式

### 預定義函式

呼叫函式的寫法是「函式名(要給它的值)」，像 `sqrt(16.0)`；不用給值時括號留空，像 `rand()`。

```cpp
#include <cmath>     // 數學函式
#include <cstdlib>   // rand, srand, abs, exit
#include <ctime>     // time
```

| 函式 | 例子（回傳值） |
| --- | --- |
| `sqrt(x)` 平方根 | `sqrt(16.0)` → 4 |
| `pow(x, y)` $x^y$ | `pow(2, 10)` → 1024 |
| `abs(n)` / `fabs(x)` 絕對值（整數 / 浮點） | `abs(-3)` → 3、`fabs(-2.5)` → 2.5 |
| `ceil(x)` / `floor(x)` 無條件進位 / 捨去 | `ceil(3.2)` → 4、`floor(3.2)` → 3 |
| `round(x)` 四捨五入 | `round(3.5)` → 4 |
| `max(a, b)` / `min(a, b)` 較大 / 較小值（需 `<algorithm>`） | `max(3, 7)` → 7 |

右欄是**回傳值**（函式算完交回給你的那個結果）：`sqrt`、`ceil`、`round` 回傳的型別都是 `double`，但 `cout` 預設不印多餘的小數，所以 `cout << sqrt(16.0)` 螢幕上是 `4` 不是 `4.0`；要看到小數點得用 Ch1 教過的 `fixed << setprecision(1)`。

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
6 49
```

`rand()` 每次呼叫回傳一個 0 到 `RAND_MAX`（至少 32767）之間的非負整數，`% 6` 壓成 0~5，再 `+1` 就是 1~6；要 a~b 的亂數就寫 `rand() % (b - a + 1) + a`。`time(nullptr)` 的 `nullptr` 是「空指標」，11/19 才會講，這裡照抄就好（寫 `time(0)` 也行）。

`srand` 整支程式**只呼叫一次**（放在 `main` 開頭）。放在迴圈裡每次都重設種子，反而會一直拿到同一個數。

### 自訂函式

函式的三要素：**回傳型別**、**函式名**、**參數列表**。

先講 `return 運算式;`，它做兩件事：① 把運算式的值當成這個函式的**結果交回呼叫它的地方**——`cout << gcd(24, 36);` 印出來的就是 `gcd` 裡 `return` 的那個值，也可以寫成 `int g = gcd(24, 36);` 存起來；② **立刻結束這個函式**，後面的程式碼一行都不會跑。下面 `isPrime` 的 `return false;` 就是在用第二點：一找到因數就不必再檢查下去。`main` 也是函式，所以在 `main` 中間寫 `return 0;` 就是提前結束整支程式（Q4 解答用到）。

```cpp
#include <iostream>
#include <string>
using namespace std;

// 函式「定義」：有 body
int gcd(int a, int b) {                      // 輾轉相除法：一直取餘數，直到餘數是 0
    while (b != 0) { int r = a % b; a = b; b = r; }
    return a;
}

bool isPrime(int n) {
    if (n < 2) return false;
    for (int i = 2; i * i <= n; i++)
        if (n % i == 0) return false;
    return true;
}

void greet(string name) {                    // void：不回傳值（參數寫法 10/01 會再改良）
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

int cube(int x);             // 宣告（prototype），注意結尾有分號

int main() {
    cout << cube(3) << '\n';
    return 0;
}

int cube(int x) {            // 定義寫在後面，這裡沒有分號，改成大括號
    return x * x * x;
}
```

輸出：

```text
27
```

宣告時參數名可以省略：`int cube(int);` 也合法。

**要點：**

- 回傳型別不是 `void` 時，**每一條執行路徑都要 `return`**。漏掉的話 `-Wall` 會警告 `control reaches end of non-void function`，而後果比你想的嚴重——這是 09/17 講過的**未定義行為**，不是「拿到一個亂數」這麼溫和。我這台 g++ 實測：走到沒有 `return` 的那條路徑時程式當場 `Illegal instruction (core dumped)` 掛掉；改用 `-O2` 編譯則變成無窮迴圈把上一行印不停。看到這個警告一定要當場修。
- `void` 函式不回傳值，可以用 `return;`（後面不接運算式）提早結束。
- **參數（parameter）** 是函式定義裡的變數名，**引數（argument）** 是呼叫時實際傳進去的值。筆試喜歡考這組名詞。
- **傳進函式的是值的複本**：呼叫 `reverseNumber(n)` 時，函式裡的 `n` 是另一個變數，裡面只是複製過來的值，函式內怎麼改它都不會動到 `main` 的 `n`（Q3 解答就靠這點，呼叫完還能拿原本的 `n` 來比對）。想讓函式改到呼叫端的變數，要用[下一節](/2026/09/09/nsysu-c-programming/1001-parameters/)的傳參考。
- **程序抽象（procedural abstraction）**：用函式的人只要知道「它做什麼」，不必知道「它怎麼做」——所以寫程式時先想「我需要哪幾個小工具」，再一個一個實作，大問題就拆小了。
- **前置條件／後置條件（precondition / postcondition）**：課本強調的註解習慣，筆試可能考名詞——在函式上方寫 `// Precondition: n >= 0`（呼叫前必須成立的假設）與 `// Postcondition: 回傳 n!`（函式保證交出的結果）。

> **雷區 ⑥：引數順序寫反**
> ```cpp
> double percent(double part, double whole) { return part / whole * 100; }
>
> cout << percent(50.0, 200.0) << '\n';   // 25：50 佔 200 的 25%
> cout << percent(200.0, 50.0) << '\n';   // 400：順序寫反，答案錯得離譜，編譯器一聲不吭
> ```
> 型別相同時**編譯器完全幫不上忙**，只能靠命名與註解。

### 作用域（scope）

```cpp
#include <iostream>
using namespace std;

int globalCount = 100;              // 全域變數（盡量少用，名字也要取得看得懂）

int main() {
    cout << globalCount << '\n';    // 100：全域變數在任何函式裡都看得到
    int x = 10;                     // 區域變數，只在 main 內有效
    {
        int x = 5;                  // 內層區塊的新變數，遮蔽外層的 x
        cout << x << '\n';          // 5
    }
    cout << x << '\n';              // 10
    for (int i = 0; i < 3; i++) { /* i 只在這個 for 內有效 */ }
    // cout << i;                   // 編譯錯誤：'i' was not declared in this scope
    return 0;
}
```

輸出：

```text
100
5
10
```

- **區域變數**在函式（或區塊）結束時消失，不同函式裡的同名變數互不相干；同一個函式被呼叫兩次，兩次各有自己的一份。
- **全域常數**（`const double PI = 3.14159;`）可以接受；**全域變數**則會讓程式難以追蹤，課本與業界都建議避免。

### 遞迴

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

每一層 `factorial` 都有**自己的一份 `n`**（上一節的區域變數規則），裡層把 `n` 算成什麼都不會影響外層——這是遞迴能成立的關鍵。

前面那個迴圈版的 `gcd` 也可以改寫成遞迴——同一個函式、兩種寫法：

```cpp
int gcd(int a, int b) {
    if (b == 0) return a;          // base case
    return gcd(b, a % b);          // recursive step：問題規模變小
}
```

（也常見壓成一行的寫法 `return (b == 0) ? a : gcd(b, a % b);`，意思完全一樣。）

> **雷區 ⑦：無窮遞迴**
> 忘記 base case 或問題沒變小，會一直往下呼叫直到**堆疊溢位（stack overflow）**，執行時出現 `Segmentation fault`。

## 本週重點回顧

看到症狀先查這張表：

| 你看到的症狀 | 先去檢查 |
| --- | --- |
| 條件永遠成立 | 寫成 `0 < x < 10`？還是 `if (x = 5)`？ |
| 輸出多印了東西 | `switch` 的 `case` 忘記 `break` |
| 迴圈停不下來 | 條件用了 `!=`，或計數器根本沒變 |
| 迴圈主體好像沒跑 | `for (...)` 後面多一個分號 |
| `Segmentation fault` | 遞迴沒有終止條件 |
| `control reaches end of non-void function` | 有某條路徑沒寫 `return` |

還有一件編譯器**真的**不會提醒你的事：`do-while` **至少會執行一次**——條件一開始就不成立，主體照樣先跑完一輪，這種錯只能自己讀程式讀出來。（結尾那個分號剛好相反，漏掉會直接編不過：`error: expected ‘;’ before ‘cout’`。）另一件編譯器幫不上忙的是雷區⑥ 的引數順序寫反。

## 本週練習題

**Q1. 質數統計**
讀入正整數 `n`，沿用前面寫好的 `isPrime`，輸出 2 到 `n` 之間（含）質數的**個數**與**總和**。

```text
輸入： 20
輸出：
count: 8
sum: 77
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

bool isPrime(int n) {         // 課文那份判斷質數的函式
    if (n < 2) return false;
    for (int i = 2; i * i <= n; i++)
        if (n % i == 0) return false;
    return true;
}

int main() {
    int n;
    cin >> n;
    int count = 0, sum = 0;
    for (int i = 2; i <= n; i++) {
        if (!isPrime(i)) continue;
        count++;
        sum += i;
    }
    cout << "count: " << count << '\n';
    cout << "sum: " << sum << '\n';
    return 0;
}
```

`isPrime` 裡的 `i * i <= n` 比 `i <= sqrt(n)` 好：不用引入浮點運算，也沒有精度問題。這題也示範了把「判斷質數」包成函式的好處：`main` 裡只剩「一個一個問、數一數、加一加」，完全看不到質數怎麼判斷——這就是課文說的程序抽象。

</details>

**Q2. 階乘（迴圈版）**
課文寫過遞迴版的 `factorial`，這題請自己寫出迴圈版 `int factIter(int n)`：讀入 `n`（0 ≤ n ≤ 12）後印出 `n!`，並回答為什麼要限制 n ≤ 12。

```text
輸入： 5
輸出： 120
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

int main() {
    int n;
    cin >> n;
    cout << factIter(n) << '\n';
    return 0;
}
```

為什麼限制 n ≤ 12？因為 `13! = 6227020800` 已經超過 `int` 的上限（約 21 億），會溢位。需要更大就換 `long long`（可到 20!）。

</details>

**Q3. 數字反轉與回文判斷**
讀入一個正整數 `n`（1 ≤ n ≤ 999999；再大的話反轉後會超過 `int` 的上限，理由跟 Q2 的 13! 一樣），輸出它反轉後的數字，並判斷是否為回文數。

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

函式裡的 `n` 被除到 0，但那是複本；`main` 的 `n` 完全沒變，所以最後一行還能拿它來比對。

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
        return 0;                  // 在 main 中間 return：直接結束整支程式
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
（互動範例；`→` 左邊是你打進去的，右邊是程式印的。程式本身不會印 `→`，也不會提示你輸入）
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
讀入 `n`（1 ≤ n ≤ 90；再大連 `long long` 都裝不下，會像 Q2 的 13! 一樣溢位成負數），輸出費氏數列前 `n` 項（$F_1 = 1, F_2 = 1$），以空白分隔。請用**迴圈**寫，並想想為什麼這題不該用單純遞迴。

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

**為什麼不用純遞迴？** `fib(n) = fib(n-1) + fib(n-2)` 寫成遞迴，同一個 `fib(k)` 會被重複算很多次——算一個 `fib(45)` 總共要呼叫這個函式 **22 億次**。我這台實測：`fib(30)` 不到 0.01 秒、`fib(40)` 要 0.2 秒、`fib(45)` 要 2 秒，**每多 5 項就慢 10 倍**，到 `fib(60)` 你會等到放棄。迴圈版是從 1 往上累加，`n` 是多少就只做多少次加法，`fib(45)` 瞬間就出來。

</details>

**實驗課題型加練**
下面幾題是照實驗課歷年課堂練習與上機考的題型改寫的。實驗課的分數是每週當場檢查給的，題目每年會換，但題型很固定：前三週一定是「判斷 → 迴圈 → 拆成函式 → 亂數」這條線。其中九九乘法表、猜拳、河內塔幾乎年年出現。

**Q7. 奇偶與在校時間**
分兩段。先讀入一個整數，印出它是奇數還是偶數；再讀入現在的時、分（24 小時制），假設週四 9:30 前要到校、16:00 放學：在校時間內印 `At School` 並算出距離放學還有多久，不在校時間印 `Off School`，時間不合法（小時不在 0–23、分不在 0–59）印 `Invalid time`。

```text
輸入：
7
14 45
輸出：
7 is odd
At School
left: 1 h 15 m
```

```text
輸入：
10
17 5
輸出：
10 is even
Off School
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    if (n % 2 == 0) cout << n << " is even\n";
    else            cout << n << " is odd\n";

    int h, m;
    cin >> h >> m;
    if (h < 0 || h > 23 || m < 0 || m > 59) {
        cout << "Invalid time\n";
        return 0;
    }
    int now = h * 60 + m;                 // 換成分鐘數，比較就只剩一個數字
    int start = 9 * 60 + 30, end = 16 * 60;
    if (now >= start && now <= end) {
        int left = end - now;
        cout << "At School\n";
        cout << "left: " << left / 60 << " h " << left % 60 << " m\n";
    } else {
        cout << "Off School\n";
    }
    return 0;
}
```

「合法性檢查放最前面、不合法就 `return 0`」是這類題目的固定寫法，後面的判斷就不必再考慮怪輸入。時間先換算成分鐘數，「在不在區間內」就只剩一個 `now >= start && now <= end`。

</details>

**Q8. 三個數的眾數與去重**
讀入三個整數，先印出「出現最多次的數字出現了幾次」，再把三個數**去掉重複**後由大到小印出。這週還沒有陣列，請只用 `if` 和三個變數解決。

```text
輸入： 5 9 5
輸出：
most: 2
9 5
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

int main() {
    int a, b, c;
    cin >> a >> b >> c;

    // 出現最多次的數字出現幾次：三個都一樣 3，兩個一樣 2，否則 1
    int most;
    if (a == b && b == c)               most = 3;
    else if (a == b || b == c || a == c) most = 2;
    else                                most = 1;
    cout << "most: " << most << '\n';

    // 先排成 a >= b >= c（三次「比大小就交換」）
    int tmp;
    if (a < b) { tmp = a; a = b; b = tmp; }
    if (a < c) { tmp = a; a = c; c = tmp; }
    if (b < c) { tmp = b; b = c; c = tmp; }

    // 由大到小印，跟前一個相同就跳過
    cout << a;
    if (b != a) cout << ' ' << b;
    if (c != b) cout << ' ' << c;
    cout << '\n';
    return 0;
}
```

三個數只有三種情況：全部相同、恰有兩個相同、全部不同，一個 `if / else if / else` 就分完了。去重的關鍵是**先排序再印**：排好之後重複的數字一定相鄰，只要跟前一個比就知道要不要跳過。那三行「比大小就交換」是 10/08 排序的雛形。

</details>

**Q9. 三角形分類**
讀入三個正整數當三邊長，先判斷能不能構成三角形（任兩邊之和大於第三邊），可以的話再判斷是直角、銳角還是鈍角三角形：設最長邊為 $c$，$a^2 + b^2 = c^2$ 是直角、$>$ 是銳角、$<$ 是鈍角。

```text
輸入： 5 3 4
輸出： right triangle
```

```text
輸入： 2 3 4
輸出： obtuse triangle
```

```text
輸入： 1 2 3
輸出： not a triangle
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

int main() {
    int a, b, c;
    cin >> a >> b >> c;
    if (a <= 0 || b <= 0 || c <= 0) {
        cout << "invalid\n";
        return 0;
    }
    // 把最大的邊換到 c，之後只要比 a*a + b*b 和 c*c
    int tmp;
    if (a > c) { tmp = a; a = c; c = tmp; }
    if (b > c) { tmp = b; b = c; c = tmp; }

    if (a + b <= c) {
        cout << "not a triangle\n";
        return 0;
    }
    int lhs = a * a + b * b, rhs = c * c;
    if (lhs == rhs)     cout << "right triangle\n";
    else if (lhs > rhs) cout << "acute triangle\n";
    else                cout << "obtuse triangle\n";
    return 0;
}
```

先把最長邊換到 `c`，之後所有判斷都只寫一次；不這樣做的話要對三種「誰最長」各寫一遍。「兩邊之和大於第三邊」只要檢查最短的兩邊加起來是否大於最長邊就夠了。

</details>

**Q10. 進位次數**
反覆讀入兩個正整數，數一數直式相加時總共發生幾次進位（例如 509 + 104 = 613，只有個位 9 + 4 進了一次；999 + 1 三個位數都進位）。沒有進位印 `no carry`，讀到 `0 0` 結束。九九乘法表本週正文已經示範過，實驗課通常也會要你印一次，記得回去看〈巢狀迴圈〉那段。

```text
輸入：
123 456
555 555
999 1
509 104
0 0
輸出：
no carry
3 carry operations
3 carry operations
1 carry operations
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

// 兩個正整數相加時，總共發生幾次進位
int carryCount(long long a, long long b) {
    int count = 0, carry = 0;
    while (a > 0 || b > 0) {
        int sum = a % 10 + b % 10 + carry;    // 這一位的和，要把上一位的進位加進來
        carry = (sum >= 10) ? 1 : 0;
        if (carry == 1) count++;
        a /= 10;
        b /= 10;
    }
    return count;
}

int main() {
    long long a, b;
    while (true) {
        cin >> a >> b;
        if (a == 0 && b == 0) break;
        int c = carryCount(a, b);
        if (c == 0) cout << "no carry\n";
        else        cout << c << " carry operations\n";
    }
    return 0;
}
```

一位一位加，跟小學直式一樣：這一位的和要把**上一位的進位**算進去（999 + 1 的十位是 9 + 0 + 1 才會進位）。`while (a > 0 || b > 0)` 用 `||`，兩數位數不同時較短的那個補 0 繼續。

</details>

**Q11. 奇數位與偶數位的和**
讀入一個正整數，**從個位數往左數**，第 1、3、5… 位的數字和為 `A`，第 2、4、6… 位的和為 `B`，輸出 `A`、`B` 與 $|A - B|$。兩個和**各寫成一個函式**，在 `main` 呼叫。例如 263417：個位 7、百位 4、萬位 6 是奇數位，$A = 17$；$B = 1 + 3 + 2 = 6$。

```text
輸入： 263417
輸出：
A = 17
B = 6
|A - B| = 11
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <cstdlib>       // abs
using namespace std;

// 從個位數算起，第 1、3、5… 位的和
int oddPositionSum(int n) {
    int sum = 0, pos = 1;
    while (n > 0) {
        if (pos % 2 == 1) sum += n % 10;
        n /= 10;
        pos++;
    }
    return sum;
}

// 第 2、4、6… 位的和
int evenPositionSum(int n) {
    int sum = 0, pos = 1;
    while (n > 0) {
        if (pos % 2 == 0) sum += n % 10;
        n /= 10;
        pos++;
    }
    return sum;
}

int main() {
    int n;
    cin >> n;
    int a = oddPositionSum(n), b = evenPositionSum(n);
    cout << "A = " << a << '\n';
    cout << "B = " << b << '\n';
    cout << "|A - B| = " << abs(a - b) << '\n';
    return 0;
}
```

跟 Q3 一樣用 `n % 10` 取個位、`n /= 10` 去掉個位，只是多了一個計數器 `pos` 記「現在是第幾位」。兩個函式長得幾乎一樣——10/01 學會傳參考之後，可以改成一個函式一次帶回兩個和。`abs` 在 `<cstdlib>`。

</details>

**Q12. 猜拳**
玩家輸入 `0`（石頭）、`2`（剪刀）或 `5`（布），電腦用 `rand()` 出拳，印出雙方的拳與勝負；輸入 `q` 結束。規則：0 贏 2、2 贏 5、5 贏 0，相同平手。要求寫兩個函式：一個回傳電腦的選擇、一個判定勝負。

因為輸入裡混了數字和字母 `q`，用 `char` 讀比較單純：讀到 `'5'` 這個**字元**之後，`c - '0'` 就是整數 5（09/17 講過 `char` 存的是 ASCII 碼，`'5'` 減 `'0'` 剛好差 5）。

```text
（互動範例：電腦的拳是隨機的，每次執行結果不同）
輸入：
0
2
5
7
q
輸出：
you: 0, computer: 2 -> you win
you: 2, computer: 5 -> you win
you: 5, computer: 0 -> you win
invalid
bye
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <cstdlib>
#include <ctime>
using namespace std;

// 電腦隨機出拳：回傳 0（石頭）、2（剪刀）或 5（布）
int computerChoice() {
    int r = rand() % 3;             // 0, 1, 2
    if (r == 0) return 0;
    if (r == 1) return 2;
    return 5;
}

// 回傳 1 代表玩家贏、-1 代表電腦贏、0 平手
int judge(int player, int computer) {
    if (player == computer) return 0;
    if ((player == 0 && computer == 2) ||    // 石頭贏剪刀
        (player == 2 && computer == 5) ||    // 剪刀贏布
        (player == 5 && computer == 0))      // 布贏石頭
        return 1;
    return -1;
}

int main() {
    srand(time(nullptr));
    char c;
    while (true) {                           // 一直玩，直到輸入 q
        cin >> c;
        if (c == 'q') break;
        if (c != '0' && c != '2' && c != '5') {
            cout << "invalid\n";
            continue;
        }
        int player = c - '0';                // 字元 '5' 變成整數 5
        int computer = computerChoice();
        cout << "you: " << player << ", computer: " << computer << " -> ";
        int r = judge(player, computer);
        if (r == 1)       cout << "you win\n";
        else if (r == -1) cout << "computer wins\n";
        else              cout << "draw\n";
    }
    cout << "bye\n";
    return 0;
}
```

「贏的三種組合」直接列出來比寫數學規律清楚，而且對應題目的規則描述，助教檢查時一眼看得懂。`srand` 只在 `main` 開頭呼叫一次（正文講過：放在迴圈裡會一直拿到同一個數）。

</details>

**Q13. 阿姆斯壯數**
一個 $n$ 位數若等於「各位數字的 $n$ 次方和」，就叫阿姆斯壯數，例如 $153 = 1^3 + 5^3 + 3^3$、$1634 = 1^4 + 6^4 + 3^4 + 4^4$。讀入上限 `N`（10 ≤ N ≤ 10000000），印出 10 到 `N` 之間所有阿姆斯壯數，每行一個。請把「判斷是不是阿姆斯壯數」寫成函式。

```text
輸入： 100000
輸出：
153
370
371
407
1634
8208
9474
54748
92727
93084
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

int digitCount(int n) {
    int count = 0;
    while (n > 0) { n /= 10; count++; }
    return count;
}

int power(int base, int exp) {            // 整數版的次方，避免 pow 的浮點誤差
    int result = 1;
    for (int i = 0; i < exp; i++) result *= base;
    return result;
}

bool isArmstrong(int n) {
    int k = digitCount(n), sum = 0, m = n;
    while (m > 0) {
        sum += power(m % 10, k);
        m /= 10;
    }
    return sum == n;
}

int main() {
    int limit;
    cin >> limit;
    if (limit < 10 || limit > 10000000) {
        cout << "out of range\n";
        return 0;
    }
    for (int i = 10; i <= limit; i++)
        if (isArmstrong(i)) cout << i << '\n';
    return 0;
}
```

次方自己用迴圈乘，不用 `pow`——`pow` 回傳 `double`，`pow(5, 3)` 有可能算出 124.99999，轉回整數就錯了。`N` 開到一千萬時要跑幾秒，是正常的。

</details>

**Q14. 河內塔**
三根柱子 A、B、C，A 上有 `n` 個盤子（1 最小、`n` 最大，小的在上）。每次只能移動一根柱子最上面的盤子，且大盤子不能壓在小盤子上。讀入 `n`（1 ≤ n ≤ 10），用**遞迴**印出把全部盤子從 A 搬到 C 的每一步，最後印出總步數。

```text
輸入： 3
輸出：
disk 1: A -> C
disk 2: A -> B
disk 1: C -> B
disk 3: A -> C
disk 1: B -> A
disk 2: B -> C
disk 1: A -> C
total moves: 7
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

int moves = 0;

// 把 n 個盤子從 from 搬到 to，中途可以借用 via
void hanoi(int n, char from, char via, char to) {
    if (n == 0) return;                       // 沒有盤子要搬：結束條件
    hanoi(n - 1, from, to, via);              // 先把上面 n-1 個搬到中繼柱
    cout << "disk " << n << ": " << from << " -> " << to << '\n';
    moves++;
    hanoi(n - 1, via, from, to);              // 再把那 n-1 個從中繼柱搬到目的柱
}

int main() {
    int n;
    cin >> n;
    if (n < 1 || n > 10) {
        cout << "invalid\n";
        return 0;
    }
    hanoi(n, 'A', 'B', 'C');
    cout << "total moves: " << moves << '\n';
    return 0;
}
```

這是遞迴的經典題，想法只有三行：要把 `n` 個盤子從 A 搬到 C，就「先把上面 `n-1` 個搬到 B，把最大的那個搬到 C，再把那 `n-1` 個從 B 搬到 C」。搬 `n-1` 個的方法跟搬 `n` 個一模一樣，只是柱子的角色換了——所以函式呼叫自己，只把三根柱子的順序調換。結束條件是 `n == 0`（沒盤子可搬）。總步數是 $2^n - 1$，`n = 10` 就是 1023 行。

</details>

---

[← 09/17｜C++ 基礎（Ch 1）](/2026/09/09/nsysu-c-programming/0917-cpp-basics/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [10/01｜參數傳遞與函式重載（Ch 4） →](/2026/09/09/nsysu-c-programming/1001-parameters/)
