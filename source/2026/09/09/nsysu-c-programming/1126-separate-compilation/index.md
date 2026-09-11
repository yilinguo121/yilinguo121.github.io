---
title: 11/26｜分離編譯與命名空間（Ch 11）
date: 2026-09-10
cover: /images/code-cover.jpg
toc: true
comments: true
---

> 本文是〈[中山大學 C 程式設計 & 實驗課完整自學指南](/2026/09/09/nsysu-c-programming/)〉系列的一篇，內容為原創說明與自寫範例，不轉載教科書或授課投影片。
>
> [← 11/19｜指標、動態記憶體與 C 風格字串（Ch 9、Ch 10）](/2026/09/09/nsysu-c-programming/1119-pointers/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [12/03｜檔案輸入輸出（Ch 12） →](/2026/09/09/nsysu-c-programming/1203-file-io/)

> 對應課本習題：Ch11: 1, 3

**本頁目錄**：[為什麼要拆檔](#為什麼要拆檔) ｜ [實際範例](#實際範例) ｜ [Include guard：`#ifndef` / `#define` / `#endif`](#include-guardifndef-define-endif) ｜ [多檔案怎麼編譯](#多檔案怎麼編譯) ｜ [多檔案的 Makefile](#多檔案的-makefile) ｜ [命名空間（namespace）](#命名空間namespace) ｜ [本次練習題](#本次練習題)

**這次要會什麼**

```text
header 檔與實作檔 → include guard → 多檔案編譯與連結 → Makefile 增量編譯 → namespace
```

## 為什麼要拆檔

當程式長到幾百行，全部塞在 `main.cpp` 會有三個問題：

1. 改一個小地方就要重編整份，很慢。
2. 多人合作時同時改同一個檔，一定衝突。
3. 寫好的類別想在別的專案重用，只能複製貼上。

解法是把每個類別拆成兩個檔案：

| 檔案 | 放什麼 | 類比 |
| --- | --- | --- |
| `Circle.h`（header，標頭檔） | **宣告**：類別有哪些成員、函式長什麼樣 | 產品說明書 |
| `Circle.cpp`（implementation，實作檔） | **定義**：函式實際怎麼做 | 工廠內部作業 |

使用者只要 `#include "Circle.h"` 就知道怎麼用，完全不必看實作。

## 實際範例

**`Circle.h`**

```cpp
#ifndef CIRCLE_H
#define CIRCLE_H

class Circle {
private:
    double r;

public:
    Circle();
    Circle(double x);
    double area() const;
    double perimeter() const;
    void   setRadius(double x);
    double getRadius() const;
};

#endif
```

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

**注意 `#include` 的兩種括號**：

- `#include <iostream>`：**角括號**用於系統／標準函式庫。
- `#include "Circle.h"`：**雙引號**用於你自己寫的檔案（先找目前目錄）。

## Include guard：`#ifndef` / `#define` / `#endif`

如果同一個 header 被引入兩次（例如 `main.cpp` 引了 `A.h` 和 `B.h`，而兩者都引了 `Circle.h`），類別就會被定義兩次 → `error: redefinition of 'class Circle'`。

```cpp
#ifndef CIRCLE_H     // 如果還沒定義過 CIRCLE_H 這個名字
#define CIRCLE_H     // 就定義它

/* ... 類別內容 ... */

#endif               // 結束
```

第二次引入時 `CIRCLE_H` 已經存在，整段就被跳過。**每個 header 都要寫**，巨集名稱通常用檔名大寫加底線。

現代寫法只要一行：

```cpp
#pragma once
```

兩者效果相同。課本與課程習慣用 `#ifndef` 三行式，**考試建議寫這個版本**。

## 多檔案怎麼編譯

手動編譯（了解原理用）：

```bash
g++ -c Circle.cpp        # 產生 Circle.o
g++ -c main.cpp          # 產生 main.o
g++ -o app main.o Circle.o    # 連結成執行檔
```

`-c` 的意思是「只編譯，不連結」。每個 `.cpp` 各自變成一個 `.o`，最後一次連結起來。

> **雷區：`undefined reference to 'Circle::area()'`**
> 這是**連結階段**的錯誤，代表「有宣告但找不到實作」。最常見原因：
> 1. 忘了把 `Circle.cpp` 一起編譯（只 `g++ -o app main.cpp`）。
> 2. 定義時忘了寫 `Circle::`，變成定義了一個全域函式。
> 3. 函式簽名不一致（header 寫 `const`，cpp 忘了寫）。

## 多檔案的 Makefile

```makefile
CC     := g++
CFLAGS := -Wall -Wextra -std=c++17

.PHONY: all clean

all: app

app: main.o Circle.o
	$(CC) -o app main.o Circle.o

main.o: main.cpp Circle.h
	$(CC) $(CFLAGS) -c main.cpp

Circle.o: Circle.cpp Circle.h
	$(CC) $(CFLAGS) -c Circle.cpp

clean:
	rm -f *.o app
```

**為什麼 `main.o` 要把 `Circle.h` 列為相依？** 因為 `main.cpp` 引入了它——改了 `Circle.h` 卻沒重編 `main.o`，就會編出前後不一致的程式。把 header 列進相依清單，`make` 才知道要重編。

用自動變數可以寫得更短：

```makefile
app: main.o Circle.o
	$(CC) -o $@ $^        # $@ = app，$^ = main.o Circle.o

%.o: %.cpp
	$(CC) $(CFLAGS) -c $<
```

## 命名空間（namespace）

當兩個函式庫都定義了 `sort` 或 `Node`，名字就會撞在一起。命名空間就是幫名字加上「姓氏」：

```cpp
#include <iostream>
using namespace std;

namespace mathUtil {
    double square(double x) { return x * x; }
}

namespace physicsUtil {
    double square(double x) { return x * x * 9.8; }
}

int main() {
    cout << mathUtil::square(3) << '\n';      // 9
    cout << physicsUtil::square(3) << '\n';   // 88.2
    return 0;
}
```

**三種使用方式**：

```cpp
std::cout << "A";              // ① 每次都寫全名（最明確）
using std::cout;               // ② using 宣告：只把 cout 拉進來
using namespace std;           // ③ using 指令：把整個 std 拉進來（最方便，也最髒）
```

> **重要規則：`using namespace std;` 絕對不要寫在 header 檔裡。**
> 因為所有引入這個 header 的檔案都會被影響，等於強迫別人接受你的選擇，名稱衝突的風險會傳染出去。**header 裡請乖乖寫 `std::string`**。

**未命名的命名空間**：只在這個檔案內可見，用來隱藏內部工具函式：

```cpp
// Circle.cpp
namespace {
    double helper(double x) { return x * 2; }   // 其他 .cpp 看不到這個函式
}
```

## 本次練習題

**Q1. 拆解 BankAccount**
把前面寫過的 `BankAccount` 拆成 `BankAccount.h`、`BankAccount.cpp`、`main.cpp` 三個檔案，加上 include guard，並寫一份 Makefile 讓 `make` 可以編出執行檔、`make clean` 清乾淨。

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
CC     := g++
CFLAGS := -Wall -Wextra -std=c++17

.PHONY: all clean

all: app

app: main.o BankAccount.o
	$(CC) -o $@ $^

main.o: main.cpp BankAccount.h
	$(CC) $(CFLAGS) -c $<

BankAccount.o: BankAccount.cpp BankAccount.h
	$(CC) $(CFLAGS) -c $<

clean:
	rm -f *.o app
```

</details>

**Q2. 自己的工具函式庫**
建立 `utils.h` / `utils.cpp`，放進 `namespace utils`，包含 `gcd`、`lcm`、`isPrime`、`reverseNumber` 四個函式，在 `main.cpp` 用 `utils::` 前綴呼叫。

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
- 如果 Makefile 忘了把 header 寫進相依清單，改 header 時 `make` 會以為沒事做（顯示 `make: 'app' is up to date.`），編出來的程式就可能不一致——這是很難查的 bug。

</details>

---

[← 11/19｜指標、動態記憶體與 C 風格字串（Ch 9、Ch 10）](/2026/09/09/nsysu-c-programming/1119-pointers/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [12/03｜檔案輸入輸出（Ch 12） →](/2026/09/09/nsysu-c-programming/1203-file-io/)
