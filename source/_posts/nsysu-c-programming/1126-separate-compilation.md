---
title: 11/26｜分離編譯與命名空間（Ch 11）
date: 2026-09-10
updated: 2026-09-12
permalink: 2026/09/09/nsysu-c-programming/1126-separate-compilation/
cover: /images/code-cover.jpg
categories: [程式設計]
tags: [C++, 中山大學, 自學指南]
toc: true
comments: true
hidden: true
---

[← 11/19｜指標、動態記憶體與 C 風格字串（Ch 9、Ch 10）](/2026/09/09/nsysu-c-programming/1119-pointers/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [12/03｜檔案輸入輸出（Ch 12） →](/2026/09/09/nsysu-c-programming/1203-file-io/)

> 對應課本習題：Ch11: 1, 3

**這週要會什麼**

```text
header 檔與實作檔 → include guard → 多檔案編譯與連結 → Makefile 增量編譯 → namespace
```

## 為什麼要拆檔

當程式長到幾百行，全部塞在 `main.cpp` 會有三個問題：

1. 改一個小地方就要重編整份，很慢。
2. 多人合作時同時改同一個檔，一定衝突。
3. 寫好的類別想在別的專案重用，只能複製貼上。

解法是把每個類別拆成兩個檔案：

- `Circle.h`（header，標頭檔）放**宣告**：類別有哪些成員、每個函式長什麼樣，等於這個類別的說明書。
- `Circle.cpp`（實作檔）放**定義**：每個函式實際怎麼做。

講白一點：header 放的就是 09/24 學過的**函式原型**（只有簽名、結尾分號），只是現在連類別一起放進去；`.cpp` 放帶大括號的本體。別人（或未來的你）只要 `#include "Circle.h"`，看宣告就知道有哪些函式能呼叫，不必翻 `Circle.cpp`。

## 把 Circle 拆成三個檔案

**`Circle.h`**

```cpp
#ifndef CIRCLE_H
#define CIRCLE_H

class Circle {
private:
    double r;

public:
    Circle();
    explicit Circle(double x);
    double area() const;
    double perimeter() const;
    void   setRadius(double x);
    double getRadius() const;
};

#endif
```

最外面的 `#ifndef` / `#define` / `#endif` 三行叫 **include guard**，每個 header 都要寫，等一下的〈Include guard〉那一節會解釋它在擋什麼——先照抄。單參數建構子加 `explicit` 是 11/12 講過的習慣，只寫在 header 這一邊。

**`Circle.cpp`**

```cpp
#include "Circle.h"

const double PI = 3.14159265358979;

Circle::Circle() : r(1.0) { }
Circle::Circle(double x) : r(x >= 0 ? x : 0) { }

double Circle::area() const      { return PI * r * r; }
double Circle::perimeter() const { return 2 * PI * r; }
void   Circle::setRadius(double x) { r = (x >= 0) ? x : 0; }
double Circle::getRadius() const   { return r; }
```

**建構子寫在類別外面長這樣**：建構子的名字就是類別名，所以會寫成 `Circle::Circle()`——看起來像重複兩次，其實左邊 `Circle::` 是「屬於哪個類別」、右邊才是函式名。建構子沒有回傳型別，所以 `Circle::` 前面什麼都不寫，跟 `double Circle::area()` 前面要寫 `double` 不一樣。另外**初始化列表只能寫在定義這一邊**，header 裡的 `Circle();` 後面不可以掛 `: r(1.0)`。

**`main.cpp`**

```cpp
#include <iostream>
#include <iomanip>
#include "Circle.h"
using namespace std;

int main() {
    Circle c(5);
    cout << fixed << setprecision(4);
    cout << c.area() << ' ' << c.perimeter() << '\n';
    return 0;
}
```

### 角括號 vs 雙引號，以及 `#include` 放哪個檔

- `#include <iostream>`：**角括號**用於系統／標準函式庫。
- `#include "Circle.h"`：**雙引號**用於你自己寫的檔案（先找目前目錄）。

還有一條擺放規則：header 只 include **宣告本身用得到的**——資料成員型別是 `std::string`，`.h` 就非 `#include <string>` 不可；只有實作才用到的 `<iostream>`、`<iomanip>` 放 `.cpp` 就好，否則每個引入它的檔案都被迫一起吃進去。

## Include guard：`#ifndef` / `#define` / `#endif`

`#include` 做的事就是把檔案內容**原地貼上**。如果同一個 header 被貼進來兩次（例如你後來又寫了 `Canvas.h` 和 `Report.h`，兩個都 `#include "Circle.h"`，而 `main.cpp` 把兩個都引進來），類別就會被定義兩次 → `error: redefinition of 'class Circle'`。

```cpp
#ifndef CIRCLE_H     // 如果還沒定義過 CIRCLE_H 這個名字
#define CIRCLE_H     // 就定義它

/* ... 類別內容 ... */

#endif               // 結束
```

第二次引入時 `CIRCLE_H` 已經存在，整段就被跳過。**每個 header 都要寫**，巨集名稱通常用檔名大寫加底線。（另外有個一行版的 `#pragma once`，效果一樣，但課本與考試請寫 `#ifndef` 三行式。）

**guard 擋得住什麼、擋不住什麼**：它只保證同一個 `.cpp` 裡展開一次，擋不住「兩個 `.cpp` 各含一次」。所以 **header 裡只能放「宣告，或寫在 class 大括號裡面的東西」**——類別定義（含直接寫在 class 大括號內的成員函式本體，它們自動算 `inline`，被兩個 `.cpp` 各引入一次也不會撞，所以 10/15 到 11/12 那種一體成型的類別整個搬進 header 是合法的）、函式原型、`const` 常數可以；把函式實作（`int twice(int x) { return x * 2; }`）寫進 header，兩個 `.cpp` 各引入一次再一起連結，就會爆 `multiple definition of 'twice(int)'`，而且 include guard 救不了，因為那是**連結**階段的錯，不是前置處理階段。（範例把 `const double PI` 放在 `Circle.cpp` 而不是 `Circle.h`，就是因為只有實作用得到。）

## 多檔案怎麼編譯

手動編譯（了解原理用）：

```bash
g++ -c Circle.cpp        # 產生 Circle.o
g++ -c main.cpp          # 產生 main.o
g++ -o app main.o Circle.o    # 連結成執行檔
./app
```

輸出：

```text
78.5398 31.4159
```

`-c` 的意思是「只編譯，不連結」。每個 `.cpp` 各自變成一個 `.o`，最後一次連結起來。趕時間時也可以 `g++ -o app main.cpp Circle.cpp` 一行搞定，但那是**整份重編**；拆成 `.o` 的意義是「只有改過的 `.cpp` 需要重編」——幫你判斷哪些要重編的，就是下一節的 `make`。

> **雷區：`undefined reference to 'Circle::area() const'`**
> （`const` 成員函式的訊息尾巴會帶著 `const`；忘了編 `Circle.cpp` 時第一行其實是 `undefined reference to 'Circle::Circle(double)'`，缺幾個就印幾行。）
> 這是**連結階段**的錯誤，代表「有宣告但找不到實作」。最常見原因：
> 1. 忘了把 `Circle.cpp` 一起編譯（只 `g++ -o app main.cpp`）。
> 2. 定義時忘了寫 `Circle::`／`mathUtil::`，變成定義了一個全域函式。（注意分兩種：漏的是 **namespace** 前綴一定是連結錯；漏的是**類別**的 `Circle::`，只有該函式完全不碰資料成員時才會拖到連結，像 `area()` 要用到 `r`，編 `Circle.cpp` 當下就先報 `error: 'r' was not declared in this scope`，若原本是 `const` 成員還會多一句 `non-member function 'double area()' cannot have cv-qualifier`。）
> 3. **非成員**函式的簽名跟 header 不一致（header 宣告 `int twice(int);`，cpp 卻定義成 `double twice(double)`）——連結器照著 header 的簽名去找，找不到。（成員函式漏寫 `const` 則是編譯 `.cpp` 時就報 `no declaration matches`，不會拖到連結。）
>
> 另外：**永遠不要 `#include "Circle.cpp"`**。`#include` 只拿 `.h`；把 `.cpp` 貼進來再跟它自己一起連結，會得到一整串 `multiple definition of 'Circle::Circle()'`。

## 多檔案的 Makefile

```makefile
CXX      := g++
CXXFLAGS := -Wall -Wextra -std=c++17

.PHONY: all clean

all: app

app: main.o Circle.o
	$(CXX) -o app main.o Circle.o

main.o: main.cpp Circle.h
	$(CXX) $(CXXFLAGS) -c main.cpp

Circle.o: Circle.cpp Circle.h
	$(CXX) $(CXXFLAGS) -c Circle.cpp

clean:
	rm -f *.o app
```

變數名照〈環境設置〉那篇的慣例，C++ 專案用 `CXX`／`CXXFLAGS`。`rm -f *.o app` 的 `*` 是 shell 的**萬用字元**（「目前目錄下所有 `.o` 結尾的檔案」），`-f` 是「檔案不存在也別報錯」；`rm` 配 `*` 威力很大，下指令前先 `pwd` 確認站對資料夾。

**為什麼 `main.o` 要把 `Circle.h` 列為相依？** 因為 `main.cpp` 引入了它——改了 `Circle.h` 卻沒重編 `main.o`，就會編出前後不一致的程式。把 header 列進相依清單，`make` 才知道要重編。

`$@`、`$^`、`$<` 在〈環境設置〉講過，Q1 解答會直接用。但**別只寫 `%.o: %.cpp`**：那樣 header 就不在相依清單裡了，改完 `Circle.h` 再 `make` 只會回 `make: Nothing to be done for 'all'.`；真要用 pattern rule，得另外補一行 `main.o Circle.o: Circle.h`。

## 命名空間（namespace）

當兩個函式庫都定義了 `sort` 或 `Node`，名字就會撞在一起。命名空間就是幫名字加上「姓氏」：

```cpp
#include <iostream>
using namespace std;

namespace square {
    double area(double a) { return a * a; }
}

namespace circle {
    double area(double r) { return 3.14159 * r * r; }
}

int main() {
    cout << square::area(3) << '\n';   // 正方形邊長 3
    cout << circle::area(3) << '\n';   // 圓形半徑 3
    return 0;
}
```

輸出：

```text
9
28.2743
```

兩邊都合理地把函式取名叫 `area`，有「姓氏」就不會打架。注意 `namespace` 的結尾大括號**不加分號**（跟 `class`／`struct`／`enum` 相反）——它是區塊不是型別定義，`if`、`for`、函式的大括號也一樣不加。

**三種使用方式**：

| 寫法 | 意思 | 建議用在哪 |
| --- | --- | --- |
| `std::cout << "A";` | 每次寫全名，最明確 | header 檔一律用這個 |
| `using std::cout;` | using **宣告**：只把 `cout` 一個名字拉進來 | 想少打字又想控制範圍時 |
| `using namespace std;` | using **指令**：把整個 `std` 拉進來，最方便也最髒 | 只寫在 `.cpp` 最上面或函式內 |

兩種 `using` 都遵守作用域：寫在函式裡就只有那個函式受影響，寫在檔案最上面則是整個檔案。

> **重要規則：`using namespace std;` 絕對不要寫在 header 檔裡。**
> 因為所有引入這個 header 的檔案都會被影響，等於強迫別人接受你的選擇，名稱衝突的風險會傳染出去。**header 裡請乖乖寫 `std::string`**。

### namespace 跨檔案怎麼寫

宣告與定義分家之後，**兩邊都要說清楚自己屬於哪個 namespace**：

```cpp
// mathUtil.h —— 宣告包在 namespace 裡
namespace mathUtil { double square(double x); }

// mathUtil.cpp —— 定義也要包在同名 namespace 裡
#include "mathUtil.h"
namespace mathUtil {
    double square(double x) { return x * x; }
}
// 或不開區塊，直接寫 double mathUtil::square(double x) { return x * x; }
```

兩種寫法效果一樣，後者就像類別的 `Circle::area`。順便記一條：**`namespace` 跟 `class` 不同，可以重複打開**——`.h` 開一次放宣告、`.cpp` 再開一次放定義，編譯器會把同名的合併，不算重複定義。

忘了包（也沒寫 `mathUtil::`）就會定義出一個全域 `square`，`mathUtil::square` 只有宣告沒有實作，連結時報 `undefined reference to 'mathUtil::square(double)'`——正好是上一節的雷區。

### 未命名的命名空間

預設情況下，`.cpp` 裡的全域函式是**跨檔可見**的——別的 `.cpp` 寫個宣告就叫得到，也代表兩個 `.cpp` 各寫一個 `helper` 會在連結時撞成 `multiple definition`。包進未命名的命名空間，它就只剩本檔案看得到：

```cpp
// Circle.cpp
namespace {
    double helper(double x) { return x * 2; }   // 其他 .cpp 看不到這個函式
}
```

順帶一提：匿名 namespace 裡的函式如果**同一個 `.cpp` 裡沒人呼叫**，`-Wall -Wextra` 會提醒 `warning: 'double {anonymous}::helper(double)' defined but not used [-Wunused-function]`。這是正常的——因為編譯器很確定外面也不會有人叫它。把它真的用起來，警告就消失。

### 巢狀命名空間

命名空間可以包命名空間，做更細的分類：

```cpp
#include <iostream>
using namespace std;

namespace school {
    namespace math {
        double square(double x) { return x * x; }
    }
}
// C++17 之後可以直接寫成 namespace school::math { ... }

int main() {
    cout << school::math::square(3) << '\n';
    return 0;
}
```

輸出：

```text
9
```

名字一長就很囉唆，這時可以取別名：`namespace sm = school::math;`，之後寫 `sm::square(3)` 就好。

## 本週重點回顧

- `.h` 放**宣告**、`.cpp` 放**定義**；**class 大括號外的函式實作不要放進 header**（寫在 class 裡面的成員函式是例外，自動算 `inline`，不會撞），兩個 `.cpp` 一起連結會 `multiple definition`，include guard 救不了。
- 每個 header 都要加 **include guard**（`#ifndef` / `#define` / `#endif`）；`#include <...>` 找系統函式庫，`#include "..."` 找自己的檔案。
- **`undefined reference` 是連結階段的錯誤**，意思是「有宣告但找不到實作」——通常是少編譯某個 `.cpp`，或定義時忘了寫 `類別名::`／`namespace 名::`。
- **header 裡絕對不要寫 `using namespace std;`**；Makefile 的相依清單一定要含 header，否則改了 header 不會重編。

## 本週練習題

**Q1. 拆解 BankAccount**
把 10/22〈類別與建構子〉那篇的 `BankAccount`（`deposit`、`withdraw`、`getBalance`、`getOwner`、`print`）拆成 `BankAccount.h`、`BankAccount.cpp`、`main.cpp` 三個檔案，加上 include guard，並寫一份 Makefile 讓 `make` 可以編出執行檔、`make clean` 清乾淨。

<details>
<summary><b>參考解答</b></summary>

**BankAccount.h**

```cpp
#ifndef BANKACCOUNT_H
#define BANKACCOUNT_H

#include <string>

class BankAccount {
private:
    std::string owner;      // header 裡不要 using namespace std
    double balance;

public:
    BankAccount();
    BankAccount(const std::string& name, double init);

    void deposit(double x);
    bool withdraw(double x);

    double getBalance() const;
    std::string getOwner() const;
    void print() const;
};

#endif
```

**BankAccount.cpp**

```cpp
#include "BankAccount.h"
#include <iostream>
#include <iomanip>
using namespace std;

BankAccount::BankAccount() : owner("unknown"), balance(0.0) { }

BankAccount::BankAccount(const string& name, double init)
    : owner(name), balance(init > 0 ? init : 0) { }

void BankAccount::deposit(double x) {
    if (x > 0) balance += x;
}

bool BankAccount::withdraw(double x) {
    if (x <= 0 || x > balance) return false;
    balance -= x;
    return true;
}

double BankAccount::getBalance() const { return balance; }
string BankAccount::getOwner()   const { return owner; }

void BankAccount::print() const {
    cout << owner << ": " << fixed << setprecision(2) << balance << '\n';
}
```

header 寫 `std::string`、`.cpp` 因為有 `using namespace std;` 而寫 `string`，兩者是同一個型別，簽名算一致——編譯器比對的是**型別**，不是字面上的文字。

**main.cpp**

```cpp
#include <iostream>
#include "BankAccount.h"
using namespace std;

int main() {
    BankAccount acc("Yilin", 1000);
    acc.deposit(500);
    if (!acc.withdraw(5000)) cout << "insufficient\n";
    acc.print();
    return 0;
}
```

**Makefile**

```makefile
CXX      := g++
CXXFLAGS := -Wall -Wextra -std=c++17

.PHONY: all clean

all: app

app: main.o BankAccount.o
	$(CXX) -o $@ $^

main.o: main.cpp BankAccount.h
	$(CXX) $(CXXFLAGS) -c $<

BankAccount.o: BankAccount.cpp BankAccount.h
	$(CXX) $(CXXFLAGS) -c $<

clean:
	rm -f *.o app
```

</details>

**Q2. 自己的工具函式庫**
建立 `utils.h` / `utils.cpp`，放進 `namespace utils`，包含 `gcd`、`lcm`、`isPrime`、`reverseNumber` 四個函式，在 `main.cpp` 用 `utils::` 前綴呼叫。規格：參數都是 `int`，`isPrime` 回傳 `bool`、其餘回傳 `int`；`gcd`／`lcm` 要能吃負數（先取絕對值），`lcm(0, x)` 回傳 `0`；`reverseNumber` 保留正負號、反轉後的前導零直接丟掉（`-1230` → `-321`）。`main.cpp` 請依序各印一行：`utils::gcd(24, 36)`、`utils::lcm(4, 6)`、`utils::isPrime(97)`、`utils::reverseNumber(-1230)`，預期輸出是 `12` / `12` / `1` / `-321`。

<details>
<summary><b>參考解答</b></summary>

**utils.h**

```cpp
#ifndef UTILS_H
#define UTILS_H

namespace utils {
    int  gcd(int a, int b);
    int  lcm(int a, int b);
    bool isPrime(int n);
    int  reverseNumber(int n);
}

#endif
```

**utils.cpp**

```cpp
#include "utils.h"

namespace utils {

int gcd(int a, int b) {
    if (a < 0) a = -a;
    if (b < 0) b = -b;
    return (b == 0) ? a : gcd(b, a % b);
}

int lcm(int a, int b) {
    if (a == 0 || b == 0) return 0;
    return a / gcd(a, b) * b;          // 先除再乘，避免中途溢位
}

bool isPrime(int n) {
    if (n < 2) return false;
    for (int i = 2; i * i <= n; i++)
        if (n % i == 0) return false;
    return true;
}

int reverseNumber(int n) {
    int sign = (n < 0) ? -1 : 1;
    if (n < 0) n = -n;
    int r = 0;
    while (n > 0) { r = r * 10 + n % 10; n /= 10; }
    return r * sign;
}

}  // namespace utils
```

**main.cpp**

```cpp
#include <iostream>
#include "utils.h"
using namespace std;

int main() {
    cout << utils::gcd(24, 36) << '\n';        // 12
    cout << utils::lcm(4, 6) << '\n';          // 12
    cout << utils::isPrime(97) << '\n';        // 1
    cout << utils::reverseNumber(-1230) << '\n';   // -321
    return 0;
}
```

`lcm` 寫成 `a / gcd(a,b) * b` 而不是 `a * b / gcd(a,b)`，是為了避免 `a * b` 先溢位——這種小細節在寫函式庫時很重要。

</details>

**Q3. 觀察增量編譯**
用 Q1 的專案做實驗：先 `make`，再只改 `main.cpp` 裡的一行，重新 `make`，觀察哪些檔案被重新編譯；接著只改 `BankAccount.h`，再 `make` 一次，比較差異並解釋原因。

<details>
<summary><b>參考答案</b></summary>

- **只改 `main.cpp`**：只有 `main.o` 被重編，`BankAccount.o` 沒動，最後重新連結。因為 `BankAccount.o` 的相依檔案都沒有變新。
- **只改 `BankAccount.h`**：`main.o` 與 `BankAccount.o` **都會**重編，因為兩條規則都把 `BankAccount.h` 列為相依。
- 如果 Makefile 忘了把 header 寫進相依清單，改 header 時 `make` 會以為沒事做（Q1 的 Makefile 預設目標是 `all`，所以印的是 `make: Nothing to be done for 'all'.`；直接下 `make app` 才會看到 `make: 'app' is up to date.`），編出來的程式就可能不一致——這是很難查的 bug。

</details>

**實驗課題型加練**
下面這題照實驗課歷年課堂練習的題型改寫：三個同名函式各放在自己的 `namespace` 與自己的 `.cpp`，**必須用 Makefile 編譯、執行檔名指定**。這是實驗課檢查分離編譯的標準題，做完就等於期末上機考多檔案題的暖身。

**Q4. 三種輸出格式（`namespace` + 分離編譯）**
讀入一個整數，用三種格式輸出：左右反轉（123 → 321）、二進位（123 → 1111011）、科學記號（123 → 1.230000e+02）。三個功能分別放在 `namespace Reverse`、`Binary`、`Scientific` 裡，**函式都叫 `output`**。檔案拆成：`converter.h`（只放三個宣告）、`reverse.cpp`、`binary.cpp`、`scientific.cpp`（各自實作）、`main.cpp`；Makefile 要能編出名為 `Q4` 的執行檔，`make clean` 要能清乾淨。

```text
輸入： 123
輸出：
reverse:    321
binary:     1111011
scientific: 1.230000e+02
```

<details>
<summary><b>參考解答</b></summary>

**converter.h**

```cpp
#ifndef CONVERTER_H
#define CONVERTER_H

// 三個命名空間裡各有一個同名的 output：拆檔後每個放在自己的 .cpp
namespace Reverse    { void output(int number); }
namespace Binary     { void output(int number); }
namespace Scientific { void output(int number); }

#endif
```

**reverse.cpp**

```cpp
#include <iostream>
#include "converter.h"
using namespace std;

void Reverse::output(int number) {
    int r = 0;
    while (number > 0) {
        r = r * 10 + number % 10;
        number /= 10;
    }
    cout << "reverse:    " << r << '\n';
}
```

**binary.cpp**

```cpp
#include <iostream>
#include <string>
#include "converter.h"
using namespace std;

void Binary::output(int number) {
    string bits;
    if (number == 0) bits = "0";
    while (number > 0) {
        bits = char('0' + number % 2) + bits;   // 餘數接在前面
        number /= 2;
    }
    cout << "binary:     " << bits << '\n';
}
```

**scientific.cpp**

```cpp
#include <iostream>
#include "converter.h"
using namespace std;

void Scientific::output(int number) {
    cout << "scientific: " << scientific << number * 1.0 << '\n';
    cout.unsetf(ios::scientific);               // 用完把格式關掉，不影響後面的輸出
}
```

**main.cpp**

```cpp
#include <iostream>
#include "converter.h"
using namespace std;

int main() {
    int n;
    cin >> n;
    Reverse::output(n);
    Binary::output(n);
    Scientific::output(n);
    return 0;
}
```

**Makefile**

```makefile
CXX = g++
CXXFLAGS = -Wall -Wextra -std=c++17
OBJS = main.o reverse.o binary.o scientific.o

Q4: $(OBJS)
	$(CXX) -o $@ $^

%.o: %.cpp converter.h
	$(CXX) $(CXXFLAGS) -c $<

clean:
	rm -f Q4 $(OBJS)
```

```bash
$ make
g++ -Wall -Wextra -std=c++17 -c main.cpp
g++ -Wall -Wextra -std=c++17 -c reverse.cpp
g++ -Wall -Wextra -std=c++17 -c binary.cpp
g++ -Wall -Wextra -std=c++17 -c scientific.cpp
g++ -o Q4 main.o reverse.o binary.o scientific.o
$ echo 123 | ./Q4
reverse:    321
binary:     1111011
scientific: 1.230000e+02
```

三個 `output` 同名卻不衝突，就是因為各在自己的命名空間，呼叫時寫 `Reverse::output(n)`。實作檔裡函式定義寫成 `void Reverse::output(int number)`，跟成員函式的寫法一樣「用 `::` 說明它屬於誰」。`.h` 只放宣告、不放實作，否則三個 `.cpp` 都 include 它就會重複定義。二進位那段用「餘數接在字串**前面**」（`char('0' + number % 2) + bits`），比先存進陣列再反著印少一個步驟；科學記號用 `cout << scientific`——它跟 09/17 的 `fixed` 是同一類的格式設定，之後印出的小數都會變成 `1.230000e+02` 這種形式（`e+02` 是「乘以 10 的 2 次方」）；整數要先乘 `1.0` 變成 `double` 才會套用。印完用 `cout.unsetf(ios::scientific)` 把這個設定關掉，否則同一支程式後面所有 `double` 都會變成科學記號。

</details>

---

[← 11/19｜指標、動態記憶體與 C 風格字串（Ch 9、Ch 10）](/2026/09/09/nsysu-c-programming/1119-pointers/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [12/03｜檔案輸入輸出（Ch 12） →](/2026/09/09/nsysu-c-programming/1203-file-io/)
