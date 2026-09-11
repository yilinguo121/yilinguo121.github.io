---
title: 10/22｜類別與建構子（Ch 6–7）
date: 2026-09-10
cover: /images/code-cover.jpg
toc: true
comments: true
---

> 本文是〈[中山大學 C 程式設計 & 實驗課完整自學指南](/2026/09/09/nsysu-c-programming/)〉系列的一篇，內容為原創說明與自寫範例，不轉載教科書或授課投影片。
>
> [← 10/15｜結構與類別（Ch 5–6）](/2026/09/09/nsysu-c-programming/1015-struct-class/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [10/29｜vector 與運算子重載入門（Ch 7） →](/2026/09/09/nsysu-c-programming/1029-vector-operator/)

**本頁目錄**：[建構子在解決什麼問題](#建構子在解決什麼問題) ｜ [初始化列表（member initializer list）](#初始化列表member-initializer-list) ｜ [預設建構子非常重要](#預設建構子非常重要) ｜ [C++11：建構子委派](#c11建構子委派) ｜ [一個完整的例子：BankAccount](#一個完整的例子bankaccount) ｜ [`static` 成員：屬於「類別」而不是「物件」](#static-成員屬於類別而不是物件) ｜ [本週練習題](#本週練習題)

**這週要會什麼**

```text
建構子 → 多載建構子 → 初始化列表 → 預設建構子 → const 成員 → static 成員
```

## 建構子在解決什麼問題

上一週的 `Circle` 有個隱患：

```cpp
Circle c;
cout << c.area();     // 忘了 setRadius，r 是垃圾值 → 印出垃圾
```

**建構子（constructor）** 就是為了保證「物件一出生就處於合理狀態」而存在的。

它有三個特徵：

1. 名字**必須與類別完全同名**。
2. **沒有回傳型別**（連 `void` 都不能寫）。
3. 建立物件時**自動被呼叫**，不用也不能手動呼叫。

```cpp
#include <iostream>
using namespace std;

class Circle {
private:
    double r;

public:
    Circle() { r = 1.0; }                  // 預設建構子（無參數）
    Circle(double x) { r = (x >= 0) ? x : 0; }   // 帶一個參數的建構子

    double area() const { return 3.14159265358979 * r * r; }
};

int main() {
    Circle a;          // 自動呼叫 Circle()   → r = 1
    Circle b(5);       // 自動呼叫 Circle(5)  → r = 5
    cout << a.area() << '\n';     // 3.14159
    cout << b.area() << '\n';     // 78.5398
    return 0;
}
```

> **雷區 ①：建立無參數物件時不要加括號**
> ```cpp
> Circle a();      // 這不是建立物件！編譯器認為你在「宣告一個回傳 Circle 的函式 a」
> Circle a;        // 正確
> ```
> 這個坑有個正式名稱叫 *most vexing parse*，症狀是「後面用 `a.area()` 時說 a 不是物件」。

## 初始化列表（member initializer list）

比在大括號裡面指派更好的寫法：

```cpp
Circle(double x) : r(x) { }
//               ^^^^^^ 冒號後面就是初始化列表
```

兩者差別：

| 寫法 | 實際發生的事 |
| --- | --- |
| `Circle(double x) { r = x; }` | 先把 `r` **預設初始化**，再**指派**新值（兩個步驟） |
| `Circle(double x) : r(x) {}` | 直接用 `x` **初始化** `r`（一個步驟，效率較好） |

而且有兩種情況**只能**用初始化列表：

- 成員是 `const`（常數一旦生成就不能指派）
- 成員是**參考**（`int&`，參考必須在誕生時就決定綁誰）

```cpp
class Config {
private:
    const int maxUsers;
public:
    Config(int m) : maxUsers(m) { }      // 唯一可行的寫法
};
```

> **雷區 ②：初始化順序看的是「宣告順序」，不是你寫的順序**
> ```cpp
> class Box {
>     int w;        // 先宣告
>     int h;
> public:
>     Box(int a, int b) : h(b), w(a) { }   // 寫的順序相反
> };
> ```
> 實際初始化順序永遠是 `w` 然後 `h`（依宣告順序）。`-Wall` 會給你 `warning: 'Box::h' will be initialized after ...`——**上機考這就是 2 分**。解法：讓初始化列表的順序跟成員宣告順序一致。

## 預設建構子非常重要

規則：**只要你自己寫了任何一個建構子，編譯器就不再幫你生成無參數的預設建構子。**

```cpp
class Circle {
public:
    Circle(double x) { /* ... */ }     // 只有這一個
};

Circle a;          // 編譯錯誤：no matching function for call to 'Circle::Circle()'
Circle arr[10];    // 也錯：陣列元素需要預設建構子
```

所以請養成習慣：**每個類別都提供一個預設建構子**。

```cpp
class Circle {
private:
    double r;
public:
    Circle() : r(1.0) { }
    Circle(double x) : r(x >= 0 ? x : 0) { }
};
```

也可以用**預設引數**把兩個併成一個（但小心不要跟其他建構子打架）：

```cpp
Circle(double x = 1.0) : r(x >= 0 ? x : 0) { }
```

## C++11：建構子委派

一個建構子可以呼叫另一個建構子，避免重複程式碼：

```cpp
class Circle {
private:
    double r;
public:
    Circle() : Circle(1.0) { }              // 委派給下面那個
    Circle(double x) : r(x >= 0 ? x : 0) { }
};
```

## 一個完整的例子：BankAccount

```cpp
#include <iostream>
#include <iomanip>
#include <string>
using namespace std;

class BankAccount {
private:
    string owner;
    double balance;

public:
    BankAccount() : owner("unknown"), balance(0.0) { }
    BankAccount(const string& name, double init)
        : owner(name), balance(init > 0 ? init : 0) { }

    void deposit(double x) {
        if (x > 0) balance += x;
    }

    bool withdraw(double x) {                 // 回傳是否成功
        if (x <= 0 || x > balance) return false;
        balance -= x;
        return true;
    }

    double getBalance() const { return balance; }
    string getOwner()   const { return owner; }

    void print() const {
        cout << owner << ": " << fixed << setprecision(2) << balance << '\n';
    }
};

int main() {
    BankAccount acc("Yilin", 1000);
    acc.deposit(500);
    if (!acc.withdraw(2000)) cout << "餘額不足\n";
    acc.withdraw(300);
    acc.print();                    // Yilin: 1200.00
    return 0;
}
```

注意 `withdraw` 的設計：**用回傳值告訴呼叫者成功與否**，而不是直接印錯誤訊息。這樣同一個類別在不同程式裡都能用（有的想印中文、有的想印英文、有的想記 log）。

## `static` 成員：屬於「類別」而不是「物件」

```cpp
#include <iostream>
using namespace std;

class Widget {
public:
    static int count;          // 宣告：所有物件「共用」這一個變數
    Widget()  { count++; }
    ~Widget() { count--; }     // 解構子：物件消失時自動呼叫
};

int Widget::count = 0;         // 定義（必須寫在類別外面，只寫一次）

int main() {
    cout << Widget::count << '\n';    // 0（用類別名存取）
    Widget a, b;
    cout << Widget::count << '\n';    // 2
    {
        Widget c;
        cout << Widget::count << '\n';// 3
    }                                  // c 在這裡消失
    cout << Widget::count << '\n';    // 2
    return 0;
}
```

- **一般成員**：每個物件各有一份。
- **`static` 成員**：整個類別只有一份，所有物件共用。典型用途是「統計目前有幾個物件」「產生不重複的流水號」。
- `~Widget()` 是**解構子（destructor）**，物件生命結束時自動呼叫，在指標與繼承那兩節會很重要。

## 本週練習題

**Q1. 幫 Circle 加建構子**
把上週的 `Circle` 改成有預設建構子（半徑 1）與帶參數建構子（負數視為 0），**一律用初始化列表**，並印出兩個物件的面積與周長。

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
using namespace std;

class Circle {
private:
    double r;

public:
    Circle() : r(1.0) { }
    Circle(double x) : r(x >= 0 ? x : 0.0) { }

    double area() const      { return 3.14159265358979 * r * r; }
    double perimeter() const { return 2 * 3.14159265358979 * r; }
};

int main() {
    Circle a;
    Circle b(5);
    cout << fixed << setprecision(4);
    cout << a.area() << ' ' << a.perimeter() << '\n';
    cout << b.area() << ' ' << b.perimeter() << '\n';
    return 0;
}
```

</details>

**Q2. Time 類別**
寫 `class Time`，存時、分、秒（private）。提供建構子（預設 00:00:00）、`addSeconds(int n)`（加上 n 秒，超過 24 小時自動繞回）、`print()`（輸出 `hh:mm:ss`）。

```text
輸入： 23 59 50 20
輸出： 00:00:10
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
using namespace std;

class Time {
private:
    int h, m, s;

public:
    Time() : h(0), m(0), s(0) { }
    Time(int hh, int mm, int ss) : h(0), m(0), s(0) {
        long long total = (static_cast<long long>(hh) * 3600 + mm * 60 + ss) % 86400;
        if (total < 0) total += 86400;
        h = static_cast<int>(total / 3600);
        m = static_cast<int>(total % 3600 / 60);
        s = static_cast<int>(total % 60);
    }

    void addSeconds(int n) {
        long long total = (static_cast<long long>(h) * 3600 + m * 60 + s + n) % 86400;
        if (total < 0) total += 86400;
        h = static_cast<int>(total / 3600);
        m = static_cast<int>(total % 3600 / 60);
        s = static_cast<int>(total % 60);
    }

    void print() const {
        cout << setfill('0')
             << setw(2) << h << ':' << setw(2) << m << ':' << setw(2) << s
             << setfill(' ') << '\n';
    }
};

int main() {
    int hh, mm, ss, n;
    cin >> hh >> mm >> ss >> n;
    Time t(hh, mm, ss);
    t.addSeconds(n);
    t.print();
    return 0;
}
```

**技巧**：把「時分秒」一律換算成「總秒數」再運算，最後換回來，就不用處理一堆進位的 if。這種「統一單位」的想法在很多題目都適用。

</details>

**Q3. Date 類別與合法性檢查**
寫 `class Date`，建構子接受年、月、日，若日期不合法（含閏年判斷）則設為 `2000/1/1`。提供 `print()` 輸出 `YYYY/MM/DD`，以及 `isLeapYear()`。

閏年規則：能被 4 整除但不能被 100 整除，或能被 400 整除。

```text
輸入： 2024 2 30
輸出： 2000/01/01
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
using namespace std;

class Date {
private:
    int y, m, d;

    static bool leap(int year) {
        return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
    }

    static bool valid(int year, int month, int day) {
        if (year < 1 || month < 1 || month > 12 || day < 1) return false;
        int days[13] = {0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
        if (month == 2 && leap(year)) return day <= 29;
        return day <= days[month];
    }

public:
    Date() : y(2000), m(1), d(1) { }
    Date(int year, int month, int day) : y(2000), m(1), d(1) {
        if (valid(year, month, day)) { y = year; m = month; d = day; }
    }

    bool isLeapYear() const { return leap(y); }

    void print() const {
        cout << setfill('0') << setw(4) << y << '/'
             << setw(2) << m << '/' << setw(2) << d
             << setfill(' ') << '\n';
    }
};

int main() {
    int y, m, d;
    cin >> y >> m >> d;
    Date date(y, m, d);
    date.print();
    return 0;
}
```

這裡把 `leap` 與 `valid` 寫成 **private static** 成員函式：它們是類別內部的工具，不需要物件也能用，外面也不該直接呼叫。

</details>

**Q4. 物件計數器**
寫一個 `class Counter`，用 `static` 成員統計「目前存在幾個物件」與「總共建立過幾個物件」，並用一段程式驗證兩者的差別。

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

class Counter {
private:
    static int alive;      // 目前存在的數量
    static int created;    // 累積建立過的數量

public:
    Counter()  { alive++; created++; }
    ~Counter() { alive--; }

    static int getAlive()   { return alive; }
    static int getCreated() { return created; }
};

int Counter::alive = 0;
int Counter::created = 0;

int main() {
    Counter a, b;
    {
        Counter c, d, e;
        cout << "inside : alive=" << Counter::getAlive()
             << " created=" << Counter::getCreated() << '\n';   // 5 5
    }
    cout << "outside: alive=" << Counter::getAlive()
         << " created=" << Counter::getCreated() << '\n';       // 2 5
    return 0;
}
```

`static` 成員函式（如 `getAlive()`）**沒有 `this`**，不能存取一般成員，只能存取 `static` 成員；好處是不需要物件就能呼叫。

</details>

---

[← 10/15｜結構與類別（Ch 5–6）](/2026/09/09/nsysu-c-programming/1015-struct-class/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [10/29｜vector 與運算子重載入門（Ch 7） →](/2026/09/09/nsysu-c-programming/1029-vector-operator/)
