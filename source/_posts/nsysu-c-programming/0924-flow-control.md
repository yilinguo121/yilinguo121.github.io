---
title: 09/24｜流程控制與函式基礎（Ch 2、Ch 3）
date: 2026-09-10
updated: 2026-09-12
permalink: 2026/09/09/nsysu-c-programming/0924-flow-control/
cover: /images/code-cover.jpg
categories: [程式設計]
tags: [C++, 中山大學, 自學指南]
description: 中山大學 C 程式設計自學指南 Ch 2–3：布林運算式、if／switch 分支、迴圈，以及自訂函式與作用域，附本週練習題與參考解答。
toc: true
comments: true
hidden: true
---

[← 09/17｜C++ 基礎（Ch 1）](/2026/09/09/nsysu-c-programming/0917-cpp-basics/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [10/01｜參數傳遞與函式重載（Ch 4） →](/2026/09/09/nsysu-c-programming/1001-parameters/)

> 對應課本習題：Ch3: 1, 5, 10, 11, 13（Ch2 那幾題的對照表在 09/17，學完本週的迴圈就全部寫得出來）

<details>
<summary><b>這幾題各要用到什麼（動手前先看）</b></summary>

主課的上機考幾乎就是這些題目，所以每一題都自己寫過。下表是每題需要的東西（我的歸納，不是題目本文）與本系列對應的練習：

| 課本題號 | 要用到的東西 | 先練 |
| --- | --- | --- |
| Ch3-1 | 單位換算包成函式，換算常數用全域 `const`——自訂函式、全域常數 | Q1、Q2 |
| Ch3-5 | 三個公式各寫成回傳 `double` 的函式；做完問「要不要再算一次」——函式＋本週〈再一次？〉那種 `do-while` | Q13、Q14 |
| Ch3-10 | 函式收三個參數算預估值；呎、吋換算用整數除法與 `%`——函式、`/` `%` | Q3、Q13 |
| Ch3-11 | 擲骰子遊戲：`rand`、每回合一個函式、讀 `r`／`h` 字元決定動作 | Q5、Q14 |
| Ch3-13 | 隨機抽幾個不重複的號碼——`rand`＋重抽直到不重複 | Q16 |

</details>

**這週要會什麼**

```text
條件運算子 → enum → while / do-while / for → break / continue → 從檔案讀入
── 以上 Ch2（if / switch 上週講過）────────
預定義函式 → 自訂函式 → 作用域
```

這是整學期**份量最重的一次進度**，兩章塞在一起。讀不完很正常，可以在 Ch2 結束的地方停一次，分兩天讀。

（下面的程式碼裡如果出現 `{ ... }` 或 `/* ... */`，那是「這裡省略了與重點無關的程式碼」的意思，不是要你真的打三個點。可編譯性的規則跟 09/17 一樣：**有寫 `#include` 和 `int main()` 的區塊才是可以直接編譯的完整程式**，其餘都是片段，要自己貼進 `main` 的大括號裡——**但函式的定義例外**（像 `int gcd(int a, int b) { ... }` 這種有名字、有自己大括號的整段）：C++ 不允許在一個函式裡再定義另一個函式，函式定義要放在 `main` **外面**，只有「呼叫它」的那一行才放進 `main`；片段裡沒宣告的變數，例如三元運算子那段的 `a`、`b`、`n`，也要自己先補上 `int a = 3, b = 5, n = 7;` 之類的宣告。）

## Ch2：流程控制

`if`／`else if`／`else` 與 `switch` 上週講完了（[09/17 的〈比較與邏輯運算〉與〈分支〉](/2026/09/09/nsysu-c-programming/0917-cpp-basics/)），這週補 Ch2 剩下的：條件運算子、`enum`、三種迴圈與 `break`／`continue`。

### 條件運算子（三元運算子）

寫法是 `條件 ? 值A : 值B`——條件成立時整串的值是 `值A`，不成立時是 `值B`。它是**運算式**（算得出一個值），所以可以直接放在 `=` 右邊或 `cout <<` 後面，算是 `if`／`else` 的運算式版本。

```cpp
int maxVal = (a > b) ? a : b;          // 等同 if (a > b) maxVal = a; else maxVal = b;
cout << (n % 2 == 0 ? "even" : "odd");
```

放進 `cout <<` 時**外面那層括號不能省**：`<<` 的優先順序比 `?:` 高，少了括號會變成先算 `cout << n % 2`、再拿整個 `cout` 去跟 `0` 比，編譯器會吐出一長串 `no match for 'operator=='`。

### 列舉型別（enum）

自己造一組有名字的整數常數，跟 `switch` 很搭：

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

另一個課本很愛用的形狀——**做完問使用者要不要再一次**：

```cpp
#include <iostream>
using namespace std;

int main() {
    char again;
    do {
        double r;
        cout << "radius: ";
        cin >> r;
        cout << "area = " << 3.14159 * r * r << '\n';
        cout << "again? (y/n) ";
        cin >> again;
    } while (again == 'y');       // 使用者回 y 才再來一次
    cout << "bye\n";
    return 0;
}
```

```text
radius: 2
area = 12.5664
again? (y/n) y
radius: 1
area = 3.14159
again? (y/n) n
bye
```

課本 Ch3、Ch4 的勾選題好幾題都要求「讓使用者一直重複算，直到說不要為止」，就是這個寫法：把整段工作包在 `do { } while (回答 == 'y')` 裡。

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

`for` 的括號裡可以一次管兩個變數：初始化寫 `int i = 0, j = 10`（一次宣告兩個 `int`），更新寫 `i++, j--`（逗號隔開、由左到右依序做）：

```cpp
for (int i = 0, j = 10; i < j; i++, j--)
    cout << i << ' ' << j << '\n';      // 0 10 / 1 9 / 2 8 / 3 7 / 4 6
```

`for` 以外的地方別用逗號串敘述，程式會變得難讀。

> **雷區 ①：`for` 後面多一個分號**
> ```cpp
> int i, sum = 0;
> for (i = 1; i <= 10; i++);   // 注意這個分號：迴圈主體是「空的」
>     sum += i;                // 這行不在迴圈裡，只跑一次 → sum = 11，不是 55
> ```
> 這種寫法編得過、跑得完、答案卻是錯的。`g++ -Wall` 會警告 `this 'for' clause does not guard... [-Wmisleading-indentation]`，看到就是中這招。

> **雷區 ②：無窮迴圈**
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

### 從檔案讀入（先會用，原理 12/03 講）

課本在 Ch2 最後就介紹了 `ifstream`，而且 Ch4、Ch5、Ch6 各有一題勾選題要從檔案讀資料（Ch4-17、Ch5-17、Ch6-12），所以這個形狀現在就要會用。假設跟程式同一個資料夾裡有個 `scores.txt`：

```text
Amy 90
Bob 72
Cat 85
```

```cpp
#include <iostream>
#include <fstream>       // 檔案輸入要多這一行
#include <string>
using namespace std;

int main() {
    ifstream fin("scores.txt");        // 打開同一個資料夾裡的 scores.txt 來讀
    if (!fin) {                        // 開不起來（檔名打錯、檔案不在這個資料夾）就結束
        cout << "cannot open scores.txt\n";
        return 1;
    }
    string name;
    int score, sum = 0, count = 0;
    while (fin >> name >> score) {     // 一次讀「名字 分數」，讀不到就停
        sum += score;
        count++;
    }
    fin.close();
    cout << count << " students, total " << sum << '\n';
    return 0;
}
```

輸出：

```text
3 students, total 247
```

照抄的四件事：`#include <fstream>`；`ifstream fin("檔名");` 打開檔案，`fin` 之後就跟 `cin` 一樣用；`if (!fin)` 先確認真的打開了；`while (fin >> ...)` 讀到檔尾自動停（不用自己數有幾行）。括號放初值、串流能當條件，原理分別在 10/22 與 12/03；[〈檔案輸入輸出〉那一節](/2026/09/09/nsysu-c-programming/1203-file-io/)會完整講。

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
    for (int i = 2; i <= n / i; i++)         // 等同 i * i <= n，但不會溢位（見 Q1 說明）
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

> **雷區 ③：引數順序寫反**
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

## 本週重點回顧

看到症狀先查這張表：

| 你看到的症狀 | 先去檢查 |
| --- | --- |
| 條件永遠成立 | 寫成 `0 < x < 10`？還是 `if (x = 5)`？（09/17） |
| 輸出多印了東西 | `switch` 的 `case` 忘記 `break`（09/17） |
| 迴圈停不下來 | 條件用了 `!=`，或計數器根本沒變 |
| 迴圈主體好像沒跑 | `for (...)` 後面多一個分號 |
| `control reaches end of non-void function` | 有某條路徑沒寫 `return` |

還有一件編譯器**真的**不會提醒你的事：`do-while` **至少會執行一次**——條件一開始就不成立，主體照樣先跑完一輪，這種錯只能自己讀程式讀出來。（結尾那個分號剛好相反，漏掉會直接編不過：`error: expected ‘;’ before ‘cout’`。）另一件編譯器幫不上忙的是雷區③ 的引數順序寫反。

## 本週練習題

**Q1. 質數統計**
讀入正整數 `n`（`n ≤ 10000000`），沿用前面寫好的 `isPrime`，輸出 2 到 `n` 之間（含）質數的**個數**與**總和**。

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
    for (int i = 2; i <= n / i; i++)
        if (n % i == 0) return false;
    return true;
}

int main() {
    int n;
    cin >> n;
    int count = 0;
    long long sum = 0;             // 一千萬以內的質數和約 3.2 兆，int 裝不下
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

`isPrime` 裡的 `i <= n / i` 跟 `i * i <= n` 意思一樣，都比 `i <= sqrt(n)` 好（不用浮點運算、沒有精度問題）；選除法版是因為 `n` 接近 `int` 上限時 `i * i` 會先溢位（09/17 講過那是未定義行為），`n / i` 永遠不會。`sum` 用 `long long` 也是同一件事：`n` 只到 30 萬時質數和就超過 `int` 上限了，題目給多大的範圍，就要先想結果會不會裝不下。這題也示範了把「判斷質數」包成函式的好處：`main` 裡只剩「一個一個問、數一數、加一加」，完全看不到質數怎麼判斷——這就是課文說的程序抽象。

</details>

**Q2. 階乘**
寫一個函式 `int factorial(int n)`，用迴圈算出 $n! = 1 \times 2 \times \cdots \times n$（$0! = 1$）：讀入 `n`（0 ≤ n ≤ 12）後印出 `n!`，並回答為什麼要限制 n ≤ 12。

```text
輸入： 5
輸出： 120
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

int factorial(int n) {
    int result = 1;
    for (int i = 2; i <= n; i++) result *= i;
    return result;
}

int main() {
    int n;
    cin >> n;
    cout << factorial(n) << '\n';
    return 0;
}
```

為什麼限制 n ≤ 12？因為 `13! = 6227020800` 已經超過 `int` 的上限（約 21 億），會溢位。需要更大就換 `long long`（可到 20!）。

</details>

**Q3. 數字反轉與回文判斷**
讀入一個正整數 `n`（1 ≤ n ≤ 999999：這是保守的上限，六位數反轉後還是六位數一定裝得下；九位數反轉後可能超過 `int` 上限，例如 1000000009 反過來是 9000000001，理由跟 Q2 的 13! 一樣），輸出它反轉後的數字，並判斷是否為回文數。

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
讀入 `n`（1 ≤ n ≤ 90：`long long` 到第 92 項都還裝得下，第 93 項起就會像 Q2 的 13! 一樣溢位，這裡保守取 90），輸出費氏數列前 `n` 項（$F_1 = 1, F_2 = 1$），以空白分隔。請用**迴圈**寫。

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

</details>

**Q7. 溫度轉換表**
讀入起始攝氏溫度 `a`、結束溫度 `b`、間隔 `d`（皆為整數，保證 `a ≤ b` 且 `d ≥ 1`），用 `for` 迴圈輸出從 `a` 到 `b`（含）每隔 `d` 度的攝氏與華氏對照，華氏取小數點後一位。

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
    for (int c = a; c <= b; c += d) {    // c += d 等同 c = c + d;
        double f = c * 9.0 / 5.0 + 32;   // 9.0 / 5.0，不是 9 / 5！
        cout << c << "C = " << f << "F\n";
    }
    return 0;
}
```

`c * 9 / 5 + 32` 看起來像「先乘後除所以安全」，其實不是：`c = 1` 時先算 `1 * 9 = 9`，再算 `9 / 5` 仍是整數除法得 1，印出 `33.0`（正解 `33.8`）。只有 `c` 剛好是 5 的倍數才會碰巧對，而這題的範例輸入 0、25、50、75、100 全是 5 的倍數，所以「測範例都對」反而最危險。

</details>

**實驗課題型加練**
下面 Q8–Q10 就是**今年第 2 週（09/24）**實驗課的三題課堂練習——不是我出的；這裡用我自己的話重講、範例資料是我自己做的，要求跟課堂投影片相同。Q11–Q14 的**題型**取自去年（2025）第 2、3 週的課堂練習（今年還沒公布，題目可能會換）：練的東西跟去年那幾題一樣，但敘述、規則、範例資料都是我重寫的，不是原題。這七題只給題目、範例輸出與思路，不放完整程式：實驗課的分數是當場檢查給的，課堂也規定不能用 AI 產生解答，請自己寫完再拿範例對。阿姆斯壯數的題型取自歷年考古題、抽不重複號碼對應課本勾選題，這兩題附完整解答。

**Q8. 三角形分類**（實驗課第 2 週課堂練習 2-1）
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
輸入： 3 8 5
輸出： not a triangle
```

<details>
<summary><b>思路與驗算</b></summary>

- 題目的三條公式都假設 $c$ 是**最長邊**，輸入卻不一定照大小給，所以第一步是**把最大的邊換到 `c`**：用兩次「比大小就交換」（`int tmp = a; a = c; c = tmp;`），之後所有判斷只寫一次。要印回原本輸入的順序時，排序請另外用變數，別把輸入蓋掉。
- 排好之後「任兩邊之和大於第三邊」只要檢查 `a + b > c` 一條（最短的兩邊贏得過最長邊，另外兩組一定成立）；`3 8 5` 排成 3、5、8，$3 + 5 = 8$ **剛好等於**，不算三角形——所以要用嚴格的 `>`，不能寫 `>=`。
- 再算 `a*a + b*b` 跟 `c*c`（都是整數，不會有精度問題），三選一。
- 驗算：`5 3 4` → 3, 4, 5，$9 + 16 = 25$，直角；`2 3 4` → $4 + 9 = 13 < 16$，鈍角；`6 4 5` → 4, 5, 6，$16 + 25 = 41 > 36$，銳角。輸入有 0 或負數時印一行錯誤訊息直接結束（09/17 Q6 的「合法性檢查放最前面」）。

</details>

**Q9. 高爾夫術語**（實驗課第 2 週課堂練習 2-2）
高爾夫每一洞有「標準桿數」，實際打了幾桿跟標準桿相比：少 2 桿叫 Eagle、少 1 桿叫 Birdie、剛好叫 Par、多 1 桿叫 Bogey、多 2 桿叫 Double Bogey。先讀入標準桿數，再讀入實際桿數，用 **`switch`** 印出術語；差超過 ±2 印 `No term`。

```text
輸入： 5 3
輸出： You got Eagle
```

```text
輸入： 4 5
輸出： You got Bogey
```

<details>
<summary><b>思路與驗算</b></summary>

- `switch` 的括號裡只能放一個整數（或字元），不能放 `score > par` 這種條件，所以先算 `int diff = score - par;` 再 `switch (diff)`。
- `case` 後面可以是**負數**：`case -2:`、`case -1:`。每個 `case` 結尾記得 `break`，不然 Eagle 之後會把 Birdie、Par 全部印出來（09/17 的雷區 ⑥）；最後用 `default:` 接 `No term`。
- 驗算：`6 5` → Birdie、`7 7` → Par、`5 7` → Double Bogey、`3 8` → No term。輸出的 `You got ` 後面沒有句點，`Double Bogey` 中間一個空白。

</details>

**Q10. 3 的倍數**（實驗課第 2 週課堂練習 2-3）
算出 2 到 100 之間有幾個 3 的倍數，再把 2 到 1000 之間所有 3 的倍數加總，各印一行（注意兩小題的**範圍不一樣**）。

```text
輸出：
count of multiples of 3 in 2..100 = 33
sum of multiples of 3 in 2..1000 = 166833
```

<details>
<summary><b>思路與驗算</b></summary>

- 兩小題各寫一個 `for`：從 2 跑到上限，`i % 3 == 0` 就是 3 的倍數；或者直接從 3 開始、每圈 `i += 3`，連判斷都省了。
- 驗算：100 以內最大的 3 的倍數是 $99 = 3 \times 33$，所以是 33 個；1000 以內最大的是 $999 = 3 \times 333$，總和 $3(1 + 2 + \cdots + 333) = 3 \times \frac{333 \times 334}{2} = 166833$。跑出來不是這兩個數，就是邊界或條件寫錯了。

</details>

**Q11. 亂數小寫字母**（題型參考去年第 2 週）
用 `rand()` 印出 8 個隨機的小寫英文字母（同一行，字母之間用一個空白隔開），每次執行結果都要不一樣。

```text
某一次的輸出（每次不同）： e l h a c l j m
```

<details>
<summary><b>思路與驗算</b></summary>

- 小寫字母在 ASCII 表裡是 97（`'a'`）到 122（`'z'`）連號，所以 `'a' + rand() % 26` 就是隨機一個小寫字母的碼；印之前要 `static_cast<char>(...)` 轉回字元，否則印出來是數字（09/17〈型別轉換〉那節的 `char` 與整數互轉）。
- 「每次執行都不同」靠 `srand(time(nullptr));`，整支程式在 `main` 開頭呼叫一次就好；放進迴圈裡反而會一直拿到同一個字母（正文講過）。
- 空白只放在字母**之間**：「不是第一個字母才先印一個空白」是最省事的寫法，行尾就不會多一個空白。
- 驗算：暫時把 `srand` 那行拿掉，連跑兩次會得到一模一樣的 8 個字母——反過來就證明了它的作用；也順便確認 8 個都是小寫、行尾沒有多餘空白。

</details>

**Q12. 亂數統計**（題型參考去年第 3 週）
用 `rand()` 產生 50000 個 1–5000 之間的整數（不用存起來），統計這些數字**所有位數**裡 3、7、9 各出現幾次。例如亂數是 3917、75、390、9 時，3 出現 2 次、7 出現 2 次、9 出現 3 次。

```text
某一次的輸出（每次不同）：
3: 24864
7: 14818
9: 15142
```

<details>
<summary><b>思路與驗算</b></summary>

- 外層 `for` 跑 50000 次，每次 `int n = rand() % 5000 + 1;`；內層 `while (n > 0)` 用 `n % 10` 取個位、`n /= 10` 去掉個位（Q3 的拆數字），取到的位數是 3、7、9 就把對應的計數器加 1。
- 三個計數器宣告時一定要歸零（09/17 雷區 ①），不然加在垃圾值上面。
- 驗算：先把 50000 暫時改成 4、把每個亂數印出來手算一次；再把範圍暫時改成 1–2，三個計數器都應該是 0。正式版本 3 的次數會比 7、9 多出一大截（大約多 10000）：1–5000 的千位只會是 1–4，所以 3000–3999 那一千個數的千位全都貢獻給了 3，而 7、9 永遠不會出現在千位——三個數字差不多、或 3 沒有明顯領先，就是拆位數或範圍寫錯了。

</details>

**Q13. 奇數位、偶數位與 11 的倍數**（題型參考去年第 3 週）
讀入一個正整數，**從個位數往左數**，第 1、3、5… 位的數字和為 `A`，第 2、4、6… 位的和為 `B`。有個數學性質：`A - B` 是 11 的倍數（0 與負的倍數也算）時，這個數就能被 11 整除。印出 `A`、`B`，再印它是不是 11 的倍數。兩個和**各寫成一個函式**，在 `main` 呼叫。例如 2728：個位 8、百位 7 是奇數位，$A = 15$；$B = 2 + 2 = 4$；$15 - 4 = 11$，所以 2728 是 11 的倍數（$2728 = 11 \times 248$）。

```text
輸入： 2728
輸出：
A = 15
B = 4
divisible by 11
```

```text
輸入： 519372
輸出：
A = 6
B = 21
not divisible by 11
```

<details>
<summary><b>思路與驗算</b></summary>

- 跟 Q3 一樣用 `n % 10` 取個位、`n /= 10` 去掉個位，只是多一個計數器記「現在是第幾位」（個位是第 1 位）：位數是奇數就加進 A、偶數就加進 B。
- 兩個和各寫成一個函式（例如 `int oddPositionSum(int n)`、`int evenPositionSum(int n)`），`main` 只負責讀、呼叫、判斷、印。判斷寫 `(a - b) % 11 == 0` 就好：`a - b` 是負數時 `%` 的結果可能是負的（`-15 % 11` 是 `-4`），但「等不等於 0」不受影響（`-11 % 11` 還是 0）。10/01 學了傳參考之後，可以改成一個函式一次帶回兩個和。
- 驗算：`121` → A = 2、B = 2 → 是 11 的倍數；`917` → A = 16、B = 1 → 不是；最後拿 `n % 11 == 0` 對一次答案，兩種算法一定要一致。

</details>

**Q14. 猜拳**（題型參考去年第 3 週）
玩家輸入 `r`（石頭 rock）、`p`（布 paper）或 `s`（剪刀 scissors），電腦用 `rand()` 出拳，印出雙方的拳與勝負；輸入 `q` 結束，最後印出戰績（贏、輸、平手各幾場）。規則：石頭贏剪刀、剪刀贏布、布贏石頭。要求寫兩個函式：一個回傳電腦的選擇、一個判定勝負。

```text
（互動範例：電腦的拳是隨機的，每次執行結果不同）
輸入：
r
p
x
s
q
輸出：
you: r, computer: s -> you win
you: p, computer: p -> tie
invalid
you: s, computer: s -> tie
score: 1 win, 0 lose, 2 tie
```

<details>
<summary><b>思路與驗算</b></summary>

- 用 `char` 讀：`cin >> c;` 讀到 `'q'` 就 `break`；不是 `'r'`、`'p'`、`'s'` 就印 `invalid` 再讀下一個。
- 電腦出拳的函式：`rand() % 3` 得到 0、1、2，用 `switch`（或三個 `if`）對應成 `'r'`、`'p'`、`'s'` 回傳；`srand(time(nullptr))` 只在 `main` 開頭呼叫一次。
- 判勝負的函式：先處理平手，再把贏的三種組合直接列出來（r 贏 s、s 贏 p、p 贏 r），其餘就是輸；回傳 1／-1／0 讓 `main` 決定印什麼、加哪個計數器——函式只判斷、不印，比較好測。
- 驗算：電腦的拳是隨機的，測試時可以暫時讓出拳函式固定回傳 `'s'`，確認輸入 r → 贏、s → 平手、p → 輸，再改回亂數；最後戰績的三個數加起來要等於有效輸入的次數。

</details>

**Q15. 阿姆斯壯數**
一個 $n$ 位數若等於「各位數字的 $n$ 次方和」，就叫阿姆斯壯數，例如 $153 = 1^3 + 5^3 + 3^3$、$1634 = 1^4 + 6^4 + 3^4 + 4^4$。讀入上限 `N`（10 ≤ N ≤ 1000000），印出 10 到 `N` 之間所有阿姆斯壯數，每行一個。請把「判斷是不是阿姆斯壯數」寫成函式。

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
    if (limit < 10 || limit > 1000000) {
        cout << "out of range\n";
        return 0;
    }
    for (int i = 10; i <= limit; i++)
        if (isArmstrong(i)) cout << i << '\n';
    return 0;
}
```

次方自己用迴圈乘，不用 `pow`——`pow` 回傳 `double`，`pow(5, 3)` 有可能算出 124.99999，轉回整數就錯了。`N` 開到一百萬也只要零點幾秒；自己把上限放大到一千萬的話，等幾秒是正常的。

</details>

**Q16. 抽不重複的號碼**
用 `rand()` 從 1–10 抽出三個**不重複**的號碼印出來。這週還沒有陣列，用三個變數：第一個直接抽，第二個抽到跟第一個相同就重抽，第三個跟前兩個任一相同就重抽。

```text
某一次的輸出（每次不同）： 5 3 2
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <cstdlib>
#include <ctime>
using namespace std;

int main() {
    srand(time(nullptr));
    int a = rand() % 10 + 1;                    // 第一個直接抽
    int b;
    do { b = rand() % 10 + 1; } while (b == a);            // 跟 a 撞到就重抽
    int c;
    do { c = rand() % 10 + 1; } while (c == a || c == b);  // 跟 a 或 b 撞到就重抽
    cout << a << ' ' << b << ' ' << c << '\n';
    return 0;
}
```

「抽到重複就重抽」用 `do-while` 最順：至少要抽一次，抽完才知道要不要重來。號碼一多（例如抽 10 個）就不能靠變數一個個比，10/08 學了陣列後改成「用陣列記哪些抽過」。

</details>

---

[← 09/17｜C++ 基礎（Ch 1）](/2026/09/09/nsysu-c-programming/0917-cpp-basics/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [10/01｜參數傳遞與函式重載（Ch 4） →](/2026/09/09/nsysu-c-programming/1001-parameters/)
