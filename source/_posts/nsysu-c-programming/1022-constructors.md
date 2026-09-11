---
title: 10/22｜類別與建構子（Ch 6–7）
date: 2026-09-10
updated: 2026-09-11
permalink: 2026/09/09/nsysu-c-programming/1022-constructors/
cover: /images/code-cover.jpg
categories: [程式設計]
tags: [C++, 中山大學, 自學指南]
toc: true
comments: true
hidden: true
---

[← 10/15｜結構與類別（Ch 5–6）](/2026/09/09/nsysu-c-programming/1015-struct-class/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [10/29｜vector 與運算子重載入門（Ch 7） →](/2026/09/09/nsysu-c-programming/1029-vector-operator/)

**這週要會什麼**

```text
建構子 → 重載建構子 → 初始化列表 → 預設建構子與委派 → 組合（成員是物件）→ 解構子 → static 成員
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
3. **建立物件時自動被呼叫**。`Circle b(5);` 的 `(5)` 就是交給建構子的引數；建構子只在物件誕生的那一刻自動跑一次，之後不能像一般成員函式那樣寫 `b.Circle();` 再叫它一次。

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

輸出：

```text
3.14159
78.5398
```

同一個類別可以有好幾個建構子，靠**參數的個數與型別**決定用哪一個——這就是 [10/01 學過的函式重載](/2026/09/09/nsysu-c-programming/1001-parameters/)，只是套用在建構子上。

> **雷區 ①：建立無參數物件時不要加括號**
> ```cpp
> Circle a();      // 這不是建立物件！編譯器認為你在「宣告一個回傳 Circle 的函式 a」
> Circle a;        // 正確
> ```
> g++ 會先給警告 `warning: empty parentheses were disambiguated as a function declaration [-Wvexing-parse]`，接著在用到 `a` 的地方報 `error: request for member 'area' in 'a', which is of non-class type 'Circle()'`。看到 `non-class type 'Circle()'` 這種**帶括號的型別名**，就是踩到這個坑了。課本上的名稱是 *most vexing parse*。

## 初始化列表（member initializer list）

建構子還有一種寫法：**在大括號之前**就把成員的值交代掉。在大括號裡寫 `r = x;` 是「先生出一個 `r`，再把 `x` 蓋上去」；初始化列表 `: r(x)` 是「直接拿 `x` 把 `r` 生出來」，少一個步驟——而且有兩種成員只能這樣寫（等一下說）。

```cpp
class Circle {
    double r;
public:
    Circle(double x) : r(x) { }      // 冒號到大括號中間，就是初始化列表
};
```

多個成員用逗號隔開。成員是 `int`、`double` 這類內建型別時兩種寫法效果一樣，但**建議一律用初始化列表**——習慣養成了，之後遇到下面幾種成員才不會卡住；成員是**物件**（例如 `string owner`）時差別才明顯：`{ owner = name; }` 是先做一個空字串、再整個蓋掉，`: owner(name)` 是直接用 `name` 生出字串。

有兩種情況**只能**用初始化列表：

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
> 實際初始化順序永遠是 `w` 然後 `h`（依宣告順序）。`-Wall`（實際觸發的旗標叫 `-Wreorder`）會給你 `warning: 'Box::h' will be initialized after ...`——**上機考這就是 2 分**。解法：讓初始化列表的順序跟成員宣告順序一致。

## 自己寫了建構子，預設建構子就沒了

規則：**只要你自己寫了任何一個建構子，編譯器就不再幫你生成無參數的預設建構子。**

```cpp
class Circle {
private:
    double r;
public:
    Circle(double x) : r(x >= 0 ? x : 0) { }   // 只有這一個
};

Circle a;          // 編譯錯誤：no matching function for call to 'Circle::Circle()'
Circle arr[10];    // 也錯，訊息一模一樣：陣列要建 10 個元素，每個都得呼叫預設建構子
```

什麼時候一定要有預設建構子？兩種情況：**(1)** 要宣告陣列，像 `Circle arr[10];`；**(2)** 這個類別被當成別的類別的成員，而對方的建構子沒在初始化列表裡寫它。除此之外不補也活得下去（後面 `Car` 裡的 `Engine` 就是靠初始化列表活下來的）。要補就加一行 `Circle() : r(1.0) { }`。

也可以改用**預設引數**，一個建構子兼兩用：

```cpp
Circle(double x = 1.0) : r(x >= 0 ? x : 0) { }
```

但用了這招就**不要再留一個無參數建構子**，否則 `Circle a;` 兩個都配得上，編譯器會報 `error: call of overloaded 'Circle()' is ambiguous`。二選一。

**更漂亮的做法：建構子委派（C++11）**——讓一個建構子去呼叫另一個，共用的邏輯只寫一次：

```cpp
class Circle {
    double r;
public:
    Circle() : Circle(1.0) { }                 // 委派給下面那個建構子
    Circle(double x) : r(x >= 0 ? x : 0) { }   // 檢查負數的邏輯只寫在這裡
};
```

執行順序是：先整個跑完 `Circle(double)`，回來才跑 `Circle()` 自己的大括號。委派時初始化列表裡**不能再寫別的成員**，`Circle() : Circle(1.0), r(2.0) { }` 會報 `error: mem-initializer for 'Circle::r' follows constructor delegation`。

三個做法怎麼選：兩個建構子有共同邏輯就用**委派**；沒有共同邏輯，補一個獨立的預設建構子最單純；**預設引數**只適合完全同一套邏輯的情況。

> **補充：類別的大括號裡是一個整體**。成員函式（含建構子）彼此可以互相呼叫，**不受先後順序限制**，也不必像 09/24 那樣另外寫原型——上面 `Circle()` 委派給寫在它下面的 `Circle(double)` 完全合法。而且呼叫同類別的其他成員函式不用寫「物件.」，直接寫函式名就好，它會作用在「呼叫我的那個物件」身上，跟直接寫成員變數名是同一回事（Q2 的建構子就這樣呼叫 `addSeconds`）。

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
    acc.print();
    cout << acc.getOwner() << " 的餘額是 " << acc.getBalance() << '\n';
    return 0;
}
```

輸出：

```text
餘額不足
Yilin: 1200.00
Yilin 的餘額是 1200.00
```

1000 存 500 再領 300，所以是 1200。注意 `withdraw` 的設計：**用回傳值告訴呼叫者成功與否**，而不是直接印錯誤訊息。這樣同一個類別在不同程式裡都能用——要印中文、印英文還是寫 log，交給呼叫者決定。回傳值也**可以不接**：`acc.withdraw(300);` 這一行就是知道一定成功，直接把回傳的 `bool` 丟掉，語法上完全合法，`-Wall` 也不會唸（它只管沒用到的**變數**，不管沒用到的回傳值）。

另外注意：`print()` 裡的 `fixed << setprecision(2)` 會**一直留在 `cout` 上（0917 講過）**，所以最後一行的 `getBalance()` 也印成 `1200.00`；不想影響後面就補一句 `cout << defaultfloat << setprecision(6);`——`defaultfloat` 是 `fixed` 的反向開關（跟 `left`／`right` 一樣是 `cout` 的設定，寫進 `cout <<` 就生效、不必加括號），`6` 則是 `cout` 原本的預設有效位數。**只寫 `defaultfloat` 不夠**：`setprecision(2)` 會留著，2 從「小數兩位」變成「有效位數兩位」，`1200` 會被印成 `1.2e+03`。

> **補充：`inline`**。上面 `deposit`、`withdraw` 這些都寫在 `class` 裡面，順帶講一個名詞：寫在 `class` 定義**裡面**的成員函式自動就是 `inline`，編譯器可能把函式內容直接展開在呼叫處，省掉跳來跳去的成本。類別外面的短函式可以自己加 `inline` 建議編譯器，但那只是建議，不要為了效能到處亂加。

## 成員也可以是另一個類別的物件

資料成員不一定是 `int`、`double`，也可以是別的類別的物件：

```cpp
#include <iostream>
#include <string>
using namespace std;

class Engine {
private:
    int horsepower;
public:
    Engine(int hp) : horsepower(hp) { }
    void start() const { cout << horsepower << " 匹馬力，引擎發動\n"; }
};

class Car {
private:
    string name;
    Engine engine;               // Car 裡面「有一個」Engine
public:
    Car(const string& n, int hp) : name(n), engine(hp) { }   // 用初始化列表建構成員
    void start() const { cout << name << "："; engine.start(); }
};

int main() {
    Car c("Civic", 180);
    c.start();
    return 0;
}
```

輸出：

```text
Civic：180 匹馬力，引擎發動
```

兩件事要記住：

1. **成員物件會先被建構，才輪到外層類別建構子的大括號**。所以 `Car` 建構子的大括號裡可以放心用 `engine`（例如直接呼叫 `engine.start()`），它已經初始化完畢。物件消失時順序相反：先跑外層 `Car` 的解構子，才輪到成員 `engine`（解構子是下一節的主題）。
2. 上面的 `Engine` **只有帶參數的建構子、沒有預設建構子**，所以 `Car` **一定要**在初始化列表裡寫 `engine(hp)`，不能省略——因為編譯器不知道該怎麼生出那個成員。

這種「A 裡面有一個 B」的寫法叫**組合（composition）**，[講繼承那一節](/2026/09/09/nsysu-c-programming/1210-inheritance/)會拿它跟繼承比較。

> **補充**：類別裡面還可以再定義類別（**巢狀類別**），用在只有這個類別內部才用得到的小結構。這學期用不到，知道有這個名詞就好。

## 解構子：物件消失時自動呼叫

**解構子（destructor）** 的名字是 `~` 加上類別名（`~Widget()`），沒有參數、沒有回傳型別，一個類別只能有一個；物件生命結束時（離開所在區塊、或程式結束）**自動**被呼叫，就像區域變數離開區塊就消失一樣。下一節先拿它做「物件消失時計數減一」，真正重要的用途（歸還記憶體）留到[指標那一節](/2026/09/09/nsysu-c-programming/1119-pointers/)。

## `static` 成員：屬於「類別」而不是「物件」

```cpp
#include <iostream>
using namespace std;

class Widget {
private:
    static int count;              // 宣告：所有物件「共用」這一個變數

public:
    Widget()  { count++; }         // 每建立一個物件，就把共用的 count 加 1
    ~Widget() { count--; }         // 解構子：物件消失時自動呼叫，count 減 1
    static int getCount() { return count; }
};

int Widget::count = 0;             // 定義：寫在類別外面，整個程式只寫一次

int main() {
    cout << Widget::getCount() << '\n';     // 0（不需要物件就能呼叫）
    Widget a, b;
    cout << Widget::getCount() << '\n';     // 2
    {
        Widget c;
        cout << Widget::getCount() << '\n'; // 3
    }                                       // c 在這裡消失，count 減回 2
    cout << Widget::getCount() << '\n';     // 2
    return 0;
}
```

輸出：

```text
0
2
3
2
```

- **一般成員**每個物件各有一份；**`static` 成員**整個類別只有一份，所有物件共用。典型用途是「統計目前有幾個物件」「產生不重複的流水號」。
- **為什麼要在類別外面多寫 `int Widget::count = 0;`**？因為 `class` 只是藍圖，不會真的配置記憶體；`static` **資料**成員必須在**檔案最外層**（不能寫在 `main` 裡）安排真正的位置並給初值，整個程式只寫這一次，而且這一行**不可以再寫一次 `static`**。它雖然寫在類別外面，卻是這個成員的**定義**，所以是 `private` 的唯一例外，不會被權限擋下來——在 `main` 裡寫 `Widget::count` 才會報 `is private within this context`。
- **`static` 成員函式**：函式前面加 `static`（例如 `getCount()`）。它不是對著某個物件呼叫的，裡面沒有「我是哪個物件」這個資訊，所以**只能碰 `static` 成員**；好處是不必先有物件，寫成 `Widget::getCount()`。（成員函式寫在類別裡就結束了，不用像資料成員那樣在類別外再定義一次。）

## 本週重點回顧

- 建構子**與類別同名、沒有回傳型別、建立物件時自動呼叫**；同名不同參數就是**重載**。
- `Circle a();` 是宣告函式，不是建立物件；無參數就寫 `Circle a;`。
- 初始化列表優先，`const` 與參考成員**只能**用它；初始化順序依**宣告順序**（寫反會有 `-Wreorder` 警告）。
- 自己寫了任何建構子，預設建構子就沒了；要宣告陣列或被別人當成員時記得補一個（或用**建構子委派**共用邏輯）。
- 成員可以是別的類別的物件（**組合**）：成員先建構，才輪到外層建構子的大括號；解構順序相反。
- 解構子 `~類別名()` 在物件生命結束時自動呼叫。
- `static` **資料**成員全類別共用、必須在類別外定義一次；`static` 成員函式不必有物件就能呼叫，但只能碰 `static` 成員。

## 本週練習題

**Q1. 委派建構子**
把 `Circle` 改寫成：預設建構子用**建構子委派**呼叫帶參數版本（預設半徑 1，負數視為 0），提供 `area()` 與 `perimeter()`；在 `main` 裡分別用預設建構子與半徑 5 各建一個物件，每個物件印出面積與周長各一行，輸出到小數第四位。

```text
輸出：
3.1416 6.2832
78.5398 31.4159
```

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
    Circle() : Circle(1.0) { }                   // 委派給下面那個建構子
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

「負數視為 0」這段共同邏輯只寫在帶參數的建構子裡，預設建構子委派過去就自動享有，不必抄第二遍。

</details>

**Q2. Time 類別**
寫 `class Time`，存時、分、秒（private）。提供**預設建構子**（00:00:00）與 `Time(int h, int m, int s)` 兩個建構子、`addSeconds(int n)`（加上 n 秒，超過 24 小時自動繞回）、`print()`（輸出 `hh:mm:ss`）。輸入四個整數：時、分、秒、要加的秒數。

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
        addSeconds(hh * 3600 + mm * 60 + ss);   // 直接借用 addSeconds 的換算
    }

    void addSeconds(int n) {
        int total = (h * 3600 + m * 60 + s + n) % 86400;
        h = total / 3600;
        m = (total % 3600) / 60;
        s = total % 60;
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

**技巧**：把「時分秒」一律換算成「總秒數」再運算，最後換回來，就不用處理一堆進位的 if。`(total % 3600) / 60` 的括號其實可以省略（`%` 和 `/` 優先順序相同，同一層由左到右算），但加上去比較不會看錯。另外注意建構子直接呼叫了 `addSeconds`——同一個類別的成員函式互相呼叫不用寫「物件.」，重複的邏輯只寫一個地方。

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

`leap` 與 `valid` 寫成 **private static** 成員函式：它們是類別內部的工具，外面不該直接呼叫；寫成 `static` 是因為它們只靠參數算答案、不必碰任何物件的資料（這兩個函式寫在類別裡就結束了，不用在類別外再定義一次）。

</details>

**Q4. 物件計數器**
寫一個 `class Counter`，用 `static` 成員統計「目前存在幾個物件」與「總共建立過幾個物件」，並用一段程式驗證兩者的差別。

```text
輸出：
inside : alive=5 created=5
outside: alive=2 created=5
```

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
             << " created=" << Counter::getCreated() << '\n';
    }
    cout << "outside: alive=" << Counter::getAlive()
         << " created=" << Counter::getCreated() << '\n';
    return 0;
}
```

離開內層區塊時 `c`、`d`、`e` 的解構子把 `alive` 減回 2，但 `created` 只加不減，所以還是 5。

</details>

---

[← 10/15｜結構與類別（Ch 5–6）](/2026/09/09/nsysu-c-programming/1015-struct-class/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [10/29｜vector 與運算子重載入門（Ch 7） →](/2026/09/09/nsysu-c-programming/1029-vector-operator/)
