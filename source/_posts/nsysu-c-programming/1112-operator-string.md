---
title: 11/12｜運算子重載、friend 與 string（Ch 8、Ch 9）
date: 2026-09-10
updated: 2026-09-12
permalink: 2026/09/09/nsysu-c-programming/1112-operator-string/
cover: /images/code-cover.jpg
categories: [程式設計]
tags: [C++, 中山大學, 自學指南]
description: 中山大學 C 程式設計自學指南 Ch 8–9：成員與非成員運算子、friend、重載輸出入運算子、[] 與 ++、functor、建構子造成的自動型別轉換，以及 string 類別，附練習題。
toc: true
comments: true
hidden: true
---

[← 11/05｜期中上機考（範圍 Ch 1–6）](/2026/09/09/nsysu-c-programming/1105-midterm/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [11/19｜指標、動態記憶體與 C 風格字串（Ch 9、Ch 10） →](/2026/09/09/nsysu-c-programming/1119-pointers/)

> 對應課本習題：Ch8: 1, 4, 5, 8, 9（Ch9 的 string 部分以本篇練習題為主）

<details>
<summary><b>這幾題各要用到什麼（動手前先看）</b></summary>

主課的上機考幾乎就是這些題目，所以每一題都自己寫過。下表是每題需要的東西（我的歸納，不是題目本文）與本系列對應的練習：

| 課本題號 | 要用到的東西 | 先練 |
| --- | --- | --- |
| Ch8-1 | Money 加上 `<`／`<=`／`>`／`>=`，再加一個「算百分比、回傳 Money」的 `const` 成員函式 | Q1、Q6 |
| Ch8-4 | 字元陣列類別：`operator[]` 回傳 `char&`、幾個不同的建構子 | Q2 |
| Ch8-5 | 二維向量類別，`*` 重載成內積（回傳整數） | 10/29 Q3 |
| Ch8-8 | 溫度類別重載 `==`、`<<`、`>>` | 正文〈重載 << 與 >>〉、Q6 |
| Ch8-9 | 用 vector 存內容的類別，`+` 合併兩個物件回傳新物件 | Q7、10/29 Q2 |

</details>

**這週要會什麼**

```text
成員 vs 非成員 → friend → << >> → [] 與 ++ → 一元與 () → 不能重載的運算子 → explicit → string
```

## 成員函式還是非成員函式？

同一個 `+`，有兩種寫法：

```cpp
// (A) 成員函式：a + b 會被翻譯成 a.operator+(b)
class Money {
public:
    Money operator+(const Money& rhs) const;
};

// (B) 非成員函式：a + b 會被翻譯成 operator+(a, b)
Money operator+(const Money& lhs, const Money& rhs);
```

**判斷原則**：

| 情況 | 用哪一種 |
| --- | --- |
| 左邊一定是自己的類別（`m + m`） | 兩種都可以 |
| 左邊可能是內建型別（`2.0 * v`） | **只能非成員**（你沒辦法在 `double` 裡面加函式） |
| `<<`、`>>`（左邊是 `cout` / `cin`） | **只能非成員**（左邊是 `cout`，你也沒辦法去改標準函式庫） |
| `=`、`[]`、`()`、`->` | C++ 規定**只能成員** |

（`->` 是「用指標取成員」的符號，它和 `=` 的重載都跟指標、深拷貝綁在一起，11/19 才會講；這裡只要記得「它們只能是成員」。）

```cpp
#include <iostream>
using namespace std;

class Vec2 {
public:
    double x, y;
    Vec2(double x = 0, double y = 0) : x(x), y(y) { }
    Vec2 operator*(double k) const { return Vec2(x * k, y * k); }   // v * 2
};

Vec2 operator*(double k, const Vec2& v) { return v * k; }           // 2 * v

int main() {
    Vec2 v(1, 2);
    Vec2 a = v * 2;      // 成員版
    Vec2 b = 2 * v;      // 非成員版（內部再呼叫成員版，不重複寫邏輯）
    cout << a.x << ' ' << b.y << '\n';   // 2 4
    return 0;
}
```

輸出：

```text
2 4
```

10/29 說非成員版「不能跟成員版同時定義」，指的是**左右運算元型別相同**的那一組（`v + v` 同時有成員與非成員版才會 ambiguous）。這裡兩個版本左邊的型別不一樣（一個是 `Vec2`、一個是 `double`），編譯器分得出來，所以可以並存——這正是讓 `2 * v` 也能用的標準做法。

## `friend`：讓外面的函式能看見 private

非成員函式碰不到 `private` 資料。兩個解法：

1. 提供 public 的 getter。
2. 把該函式宣告為 **`friend`（夥伴）**，破例讓它存取 private。

```cpp
class Vec2 {
private:
    double x, y;
public:
    Vec2(double x = 0, double y = 0) : x(x), y(y) { }
    friend Vec2 operator+(const Vec2& a, const Vec2& b);   // 宣告為夥伴
};

Vec2 operator+(const Vec2& a, const Vec2& b) {
    return Vec2(a.x + b.x, a.y + b.y);      // 可以直接碰 private 的 x, y
}
```

`friend` 寫在類別裡面（放 public 或 private 區都可以，效果相同），但它**不是成員函式**——定義時不寫 `Vec2::`，也不能加 `const` 後綴。

順帶一提：課本會把 `operator+` 的回傳型別寫成 `const Vec2`（`const Vec2 operator+(const Vec2& a, const Vec2& b);`），理由是可以擋掉 `(a + b) = c;` 這種合法但毫無意義的寫法。現代 C++ 因為妨礙最佳化已不建議，但**課本與考試是這個寫法**，知道理由即可。

**`friend` 也可以整個類別一起給**：在 `Engine` 裡寫 `friend class Car;`，`Car` 的所有成員函式就都能碰 `Engine` 的 private（單向的，`Engine` 看不到 `Car` 的）。真實情況給 `Engine` 一個 getter 通常更好，這個寫法認得就好。

## 重載 `<<` 與 `>>`

這是最實用的一組，讓你的類別可以直接 `cout << obj`。動手之前先補兩個新東西：

- `cout` 其實是一個**物件**，它的型別叫 `ostream`（輸出串流），`cin` 的型別叫 `istream`，兩個名字都住在 `<iostream>` 裡。`cout << v` 會被翻譯成 `operator<<(cout, v)`，所以參數 `ostream& os` 接到的就是 `cout` 本人，函式裡對 `os` 做的事就等於對 `cout` 做。
- **回傳型別也可以寫成參考**：`Vec2 f()` 回傳的是一份複製品，`Vec2& f()` 回傳的是**本人的別名（就是 10/01 的參考，只是從參數換到回傳值）**，所以它能放在等號左邊，也能被下一個 `<<` 繼續使用——`return os;` 交回去的就是 `cout` 本人。唯一的規定：被回傳的東西必須比函式活得久，**不能回傳區域變數的參考**。

```cpp
#include <iostream>
using namespace std;

class Vec2 {
private:
    double x, y;
public:
    Vec2(double x = 0, double y = 0) : x(x), y(y) { }
    friend ostream& operator<<(ostream& os, const Vec2& v);
    friend istream& operator>>(istream& is, Vec2& v);
};

ostream& operator<<(ostream& os, const Vec2& v) {
    os << '(' << v.x << ", " << v.y << ')';
    return os;                       // 回傳 os，才能串接 cout << a << b
}

istream& operator>>(istream& is, Vec2& v) {
    is >> v.x >> v.y;
    return is;
}

int main() {
    Vec2 v;
    cin >> v;                        // 輸入 3 4
    cout << v << " and " << v << '\n';   // (3, 4) and (3, 4)
    return 0;
}
```

```text
輸入：3 4
輸出：
(3, 4) and (3, 4)
```

三個一定要記住的細節：

1. 回傳型別是 **`ostream&`** 不是 `void`，結尾 `return os;`。
2. 第一個參數是 **`ostream& os`**，不能加 `const`（輸出會改變串流狀態）。
3. `operator>>` 的第二個參數**不能加 `const`**（要把讀到的值寫進去）。

## 重載 `[]` 與 `++`

```cpp
#include <iostream>
using namespace std;

class IntArray {
private:
    int data[100];
    int n;
public:
    IntArray() : n(100) { for (int i = 0; i < n; i++) data[i] = 0; }

    int& operator[](int i) { return data[i]; }              // 可讀可寫
    int  operator[](int i) const { return data[i]; }        // const 物件用的版本
};

int main() {
    IntArray a;
    a[3] = 7;                 // 因為回傳 int&，所以可以放在等號左邊
    cout << a[3] << '\n';
    return 0;
}
```

輸出：

```text
7
```

這兩個 `operator[]` 參數一模一樣、只差尾巴的 `const`，但這是**合法的重載**——成員函式後面的 `const` 也算簽章的一部分：一般物件呼叫上面那個（可以改），`const` 物件呼叫下面那個（只能讀）。

前置與後置 `++` 的區分方式有點詭異，但考試會考。先講一個新東西：在成員函式裡，`*this` 就是「這個物件自己」，所以 `return *this;` 是「把改完的自己交回去」，`Counter old = *this;` 是「照著自己複製一份存成 `old`」。（`this` 本身是一個指標，11/19 會正式講，這裡先把 `*this` 當成「自己」這個代名詞記起來就好。）

```cpp
#include <iostream>
using namespace std;

class Counter {
private:
    int v;
public:
    Counter(int v = 0) : v(v) { }

    Counter& operator++()      { ++v; return *this; }        // 前置 ++c
    Counter  operator++(int)   { Counter old = *this; ++v; return old; }  // 後置 c++
    int get() const { return v; }
};

int main() {
    Counter c(5), d(5);
    cout << (++c).get() << ' ' << c.get() << '\n';   // 前置：回傳改完的
    cout << (d++).get() << ' ' << d.get() << '\n';   // 後置：回傳改之前的
    return 0;
}
```

輸出：

```text
6 6
5 6
```

- **前置**：沒有參數，回傳**參考**（改完的自己），所以兩個數字都是 6。
- **後置**：多一個沒有名字的 `int` 參數，純粹用來跟前置版本區分（編譯器會傳 `0` 進去，但沒人會去用它，所以連名字都不取），回傳**改之前的複製品**，所以印出 5 和 6。

## 一元運算子與 functor

**一元運算子**（只有一個運算元，例如負號）寫成成員函式時**不需要參數**，因為運算元就是物件自己：

```cpp
#include <iostream>
using namespace std;

class Vec2 {
public:
    double x, y;
    Vec2(double x = 0, double y = 0) : x(x), y(y) { }

    Vec2 operator-() const { return Vec2(-x, -y); }   // 一元負號：-v
};

int main() {
    Vec2 v(3, -4);
    Vec2 w = -v;
    cout << w.x << ' ' << w.y << '\n';
    return 0;
}
```

輸出：

```text
-3 4
```

**重載函式呼叫運算子 `()`**：讓物件可以「像函式一樣被呼叫」，這種物件叫 **functor（函式物件）**：

```cpp
#include <iostream>
using namespace std;

class Adder {
private:
    int base;
public:
    Adder(int b) : base(b) { }
    int operator()(int x) const { return base + x; }   // 重載 ()
};

int main() {
    Adder add5(5);
    cout << add5(3) << '\n';      // 看起來像函式呼叫，其實是 add5.operator()(3)
    cout << add5(10) << '\n';
    return 0;
}
```

輸出：

```text
8
15
```

## 哪些運算子不能重載

| 運算子 | 情況 |
| --- | --- |
| `.`、`::`、`?:`、`sizeof` | **完全不能重載** |
| `&&`、`\|\|`、`,` | 語法上可以重載，但**千萬不要** |

為什麼 `&&`、`||` 不能碰？因為內建版本有**短路特性（左邊決定結果就不算右邊）**，而重載之後會變成一般的函式呼叫，**兩邊一定都會被求值**——原本靠短路做的防呆（`if (i < v.size() && v[i] > 0)`，左邊不成立時右邊根本不會去碰 `v[i]`）就全部失效了。

## 建構子也會被拿來做「自動型別轉換」

只要**呼叫時可以只給一個引數**的建構子（單參數，或第二個之後的參數都有預設值），編譯器就會自動拿它做隱式轉換：

```cpp
#include <iostream>
using namespace std;

class Money {
private:
    int dollars;
public:
    Money(int d) : dollars(d) { }          // 單參數建構子
    Money operator+(const Money& rhs) const { return Money(dollars + rhs.dollars); }
    void print() const { cout << "$" << dollars << '\n'; }
};

void pay(const Money& m) { m.print(); }

int main() {
    Money m(50);
    pay(Money(100));
    pay(100);            // 100 被自動轉成 Money(100)！
    (m + 100).print();   // 這裡的 100 也被轉成 Money(100)，再交給 operator+
    return 0;
}
```

輸出：

```text
$100
$100
$150
```

`pay(100)` 和 `m + 100` 裡的 `100` 都被悄悄轉成了 `Money(100)`。方便，但也容易出事（打錯字傳了個數字進去卻默默通過編譯）。不想要這個行為，在建構子前面加 `explicit`：

```cpp
explicit Money(int d) : dollars(d) { }   // 加了之後 pay(100); 就會編譯錯誤
```

## `string` 類別

`string` 是類別不是基本型別，要 `#include <string>`。常用操作：

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string s = "Hello";
    s += ", NSYSU!";              // 串接
    cout << s << '\n';            // Hello, NSYSU!
    cout << s.length() << '\n';   // 13（size() 也一樣）
    cout << s[0] << '\n';         // H
    cout << s.substr(7, 5) << '\n';   // NSYSU（從索引 7、也就是第 8 個字元 N 開始取 5 個）

    if (s.find("NSYSU") != string::npos)      // 找不到會回傳 string::npos
        cout << "found at " << s.find("NSYSU") << '\n';

    string a = "apple", b = "banana";
    if (a < b) cout << a << " comes first\n";   // 字典序比較，==、!=、<、> 都能直接用
    return 0;
}
```

輸出：

```text
Hello, NSYSU!
13
H
NSYSU
found at 7
apple comes first
```

`substr(pos, len)` 的 `len` 省略就是取到結尾。`find` 找到時回傳「第一次出現的索引」，找不到時回傳 `string::npos`——它是一個**極大的無號數，不是 −1**（10/29 雷區①的同一件事），所以判斷一定要寫 `!= string::npos`。寫成 `>= 0` 永遠成立（無號數不可能小於 0）；寫成 `!= -1` 在 g++ 上其實會動——`-1` 轉成無號數剛好就是 `npos`（12/17 第 10 題會考這個轉換）——但那是在依賴型別轉換的巧合，還會招來有號／無號比較的警告，所以一律寫 `npos`。上面沒示範到、但一樣常用的：

| 用法 | 作用 |
| --- | --- |
| `s.empty()` | 是否為空字串 |
| `s[i]` / `s.at(i)` | 第 i 個字元；`s[i]` **不檢查範圍（同 `vector`）**，`s.at(i)` **會檢查**，越界丟例外 |
| `s + t`、`s += t`、`s += c` | 串接；`+=` 右邊可以是字串、字面值或**單一字元**，都是接在尾端 |
| `s.clear()` | 清空字串 |
| `s.insert(pos, t)` / `s.erase(pos, len)` | 插入 / 刪除 |
| `stoi(s)` / `to_string(n)` | 字串與數字互轉（C++11） |
| `string(n, c)` | 由 `n` 個字元 `c` 組成的字串，例如 `string(3, '-')` 是 `"---"` |

**輸入字串的兩種方式**：

```cpp
string word, line;
cin >> word;             // 讀「一個詞」，遇到空白就停
getline(cin, line);      // 讀「一整行」，含空白，讀到換行為止
```

> **雷區：`cin >>` 之後接 `getline` 會讀到空行**
> ```cpp
> int n;
> cin >> n;                 // 讀走數字，但把後面的換行 '\n' 留在輸入緩衝區
> string line;
> getline(cin, line);       // 馬上遇到那個 '\n'，讀到空字串就結束
> ```
> **解法**：最簡單是中間加一行 `cin.ignore();`（只丟掉一個字元——數字後面直接接換行時剛好夠，多打了空白就失效），保險的寫法是
> ```cpp
> cin.ignore(numeric_limits<streamsize>::max(), '\n');   // 需要 #include <limits>
> ```
> `cin.ignore(n, ch)` 是「最多丟掉 n 個字元，一遇到 ch 就停」；`numeric_limits<streamsize>::max()` 只是「這種計數能表示的最大數字」的官方寫法，整句等於「丟到換行為止、不設上限」。名字很長，照抄即可。這個坑幾乎每個人都踩過一次，筆試也常考。

**逐字元處理**（需要 `#include <cctype>`）：

| 函式 | 作用 |
| --- | --- |
| `isalpha(c)` | 是否為英文字母 |
| `isdigit(c)` | 是否為數字字元 |
| `isspace(c)` | 是否為空白類字元 |
| `isupper(c)` / `islower(c)` | 是否為大 / 小寫 |
| `toupper(c)` / `tolower(c)` | 轉大 / 小寫 |

這些函式規定只吃 0–255 的值，而 `char` 在多數系統上**可以是負數**（遇到中文或特殊符號就會），傳負數是未定義行為。所以標準做法是先轉成 `unsigned char`（「不會是負數的 `char`」）再傳：`isalpha(static_cast<unsigned char>(c))`——後面的練習題會一直這樣寫。

> **雷區**：`toupper` 回傳的是 **`int`** 不是 `char`。
> ```cpp
> cout << toupper('a');                      // 印出 65，不是 'A'
> cout << static_cast<char>(toupper('a'));   // 印出 A
> ```

## 本週重點回顧

- 左邊可能是內建型別（`2 * v`）或是 `cout`／`cin` 的運算子，**只能是非成員函式**；`=`、`[]`、`()`、`->` **只能是成員函式**。
- 重載 `<<` 的三件事：回傳 `ostream&`、第一個參數是 `ostream&`（不加 const）、結尾 `return os;`。
- 前置 `++` 沒有參數、回傳**參考（改完的自己）**；後置 `++` 多一個沒名字的 `int`、回傳**改之前的複製品**。
- `friend` 是在封裝上開洞，**能用 getter 就用 getter**，留給 `<<`、`>>` 這種非成員不可的場合。
- `&&`、`||`、`,` 語法上能重載但**千萬別做**，會失去短路特性。
- **只要「呼叫時可以只給一個引數」的建構子，編譯器就會拿它做隱式轉換**（`pay(100)` 會變成 `pay(Money(100))`）；不想要就在建構子前加 `explicit`——單參數建構子加 `explicit` 是預設習慣。
- `string` 常用：`length()`／`size()`、`substr(pos, len)`、`find(t)`（找不到回 `string::npos`）、`s[i]` 不檢查範圍而 `s.at(i)` 會，`+`／`+=` 串接，`<` `==` 直接做字典序比較。
- `cin >> x;` 之後接 `getline` 會讀到空行，中間要 `cin.ignore(numeric_limits<streamsize>::max(), '\n')` 把那一行剩下的東西全丟掉；`toupper` / `tolower` 回傳的是 **`int`**，要印出字元得自己轉回 `char`。

## 本週練習題

**Q1. Money 類別**
寫 `class Money` 表示金額，內部怎麼存由你決定，但**不要用 `double`**。重載 `+`、`-`、`==`、`<<`，讓 `cout << m` 把 12 元 5 分印成 `$12.05`（分一律補滿兩位）。

主程式依序讀入四個整數 `d1 c1 d2 c2`，代表兩筆金額 a（d1 元 c1 分）與 b（d2 元 c2 分），輸出三行：`a + b`、`a - b`、以及 `a == b` 時印 `equal`／否則印 `not equal`。

```text
輸入： 12 50 3 75
輸出：
$16.25
$8.75
not equal
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
using namespace std;

class Money {
private:
    long long cents;                     // 統一換算成「分」來存，最不容易錯

public:
    Money(int dollars = 0, int c = 0) : cents(dollars * 100LL + c) { }

    friend Money operator+(const Money& a, const Money& b);
    friend Money operator-(const Money& a, const Money& b);
    friend bool  operator==(const Money& a, const Money& b);
    friend ostream& operator<<(ostream& os, const Money& m);
};

Money operator+(const Money& a, const Money& b) {
    Money r;
    r.cents = a.cents + b.cents;
    return r;
}
Money operator-(const Money& a, const Money& b) {
    Money r;
    r.cents = a.cents - b.cents;
    return r;
}
bool operator==(const Money& a, const Money& b) { return a.cents == b.cents; }

ostream& operator<<(ostream& os, const Money& m) {
    long long v = m.cents < 0 ? -m.cents : m.cents;
    if (m.cents < 0) os << '-';
    os << '$' << v / 100 << '.' << setfill('0') << setw(2) << v % 100 << setfill(' ');
    return os;
}

int main() {
    int d1, c1, d2, c2;
    cin >> d1 >> c1 >> d2 >> c2;
    Money a(d1, c1), b(d2, c2);
    cout << a + b << '\n';
    cout << a - b << '\n';
    cout << (a == b ? "equal" : "not equal") << '\n';
    return 0;
}
```

**設計重點**：金額**不要用 `double` 存**，浮點誤差會讓 `0.1 + 0.2 != 0.3`。改存整數「分」，輸出時再除回來。`100LL` 的 `LL` 表示「這個 100 是 `long long`」，這樣乘法會直接用 `long long` 算，不會先在 `int` 裡算到溢位。

</details>

**Q2. 幫 Money 加上 `[]` 與 `++`**
延續 Q1 的 `Money`，加上 `operator[]`（`m[0]` 回傳「元」、`m[1]` 回傳「分」）與前置／後置 `operator++`（每次加一元）。

主程式讀入一筆金額（元、分），輸出三行：先用 `m[0]`、`m[1]` 印出 `12 dollars 50 cents`；再印 `++m` 的回傳值與 `m` 現在的值（同一行、空格隔開）；最後印 `m++` 的回傳值與 `m` 現在的值，用來對照前置與後置的差別。

```text
輸入： 12 50
輸出：
12 dollars 50 cents
$13.50 $13.50
$13.50 $14.50
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
using namespace std;

class Money {
private:
    long long cents;

public:
    Money(int dollars = 0, int c = 0) : cents(dollars * 100LL + c) { }

    int operator[](int i) const {                   // [] 只能是成員函式
        return i == 0 ? static_cast<int>(cents / 100)
                      : static_cast<int>(cents % 100);
    }

    Money& operator++()    { cents += 100; return *this; }                   // 前置
    Money  operator++(int) { Money old = *this; cents += 100; return old; }  // 後置

    friend ostream& operator<<(ostream& os, const Money& m);
};

ostream& operator<<(ostream& os, const Money& m) {          // 跟 Q1 同一份：負數也印得對
    long long v = m.cents < 0 ? -m.cents : m.cents;
    if (m.cents < 0) os << '-';
    os << '$' << v / 100 << '.' << setfill('0') << setw(2) << v % 100 << setfill(' ');
    return os;
}

int main() {
    int d, c;
    cin >> d >> c;
    Money m(d, c);
    cout << m[0] << " dollars " << m[1] << " cents\n";

    Money r1 = ++m;              // 前置：回傳改完的自己
    cout << r1 << ' ' << m << '\n';
    Money r2 = m++;              // 後置：回傳改之前的複製品
    cout << r2 << ' ' << m << '\n';
    return 0;
}
```

**設計重點**：`[]` 只能寫成成員函式，所以不必 `friend`。前置 `++` 回傳 `Money&`（改完的自己），所以 `r1` 和 `m` 都是 `$13.50`；後置 `++` 先把自己複製成 `old` 再改，交回去的是那份複製品，所以 `r2` 停在 `$13.50`，而 `m` 已經是 `$14.50`。

</details>

**Q3. 回文判斷（忽略大小寫與標點）**
讀入一整行，判斷去掉非字母字元、忽略大小寫後是否為回文。

```text
輸入： A man, a plan, a canal: Panama
輸出： yes
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <string>
#include <cctype>
using namespace std;

int main() {
    string line;
    getline(cin, line);

    string clean;
    for (char c : line)
        if (isalpha(static_cast<unsigned char>(c)))
            clean += static_cast<char>(tolower(static_cast<unsigned char>(c)));

    int i = 0, j = static_cast<int>(clean.size()) - 1;
    bool ok = true;
    while (i < j) {
        if (clean[i] != clean[j]) { ok = false; break; }
        i++;
        j--;
    }

    cout << (ok ? "yes" : "no") << '\n';
    return 0;
}
```

**設計重點**：`i` 從頭、`j` 從尾往中間夾，碰頭（`i >= j`）就代表全部對上了。這裡用 `int` 而不是 `size_t`，是因為空字串時 `size() - 1` 在無號型別會變成超大的數字（10/29 的雷區①）。

</details>

**Q4. 單字切割與統計**
讀入一整行，輸出總共有幾個單字，以及最長的單字（**長度相同時輸出最先出現的那一個**）。單字之間可能有多個空白。輸出兩行，格式固定為 `words = 個數` 與 `longest = 單字`。

```text
輸入： the quick  brown   fox
輸出：
words = 4
longest = quick
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string line;
    getline(cin, line);

    int count = 0;
    string longest, cur;
    for (size_t i = 0; i <= line.size(); i++) {
        if (i < line.size() && line[i] != ' ') {
            cur += line[i];
        } else if (!cur.empty()) {            // 遇到分隔且手上有字 → 收成一個單字
            count++;
            if (cur.size() > longest.size()) longest = cur;
            cur.clear();
        }
    }

    cout << "words = " << count << '\n';
    cout << "longest = " << longest << '\n';
    return 0;
}
```

迴圈條件寫 `i <= line.size()` 是刻意的：多跑一圈當作「字串結尾」，讓最後一個單字也能被收走。

</details>

**Q5. 簡易凱撒加密**
讀入位移量 `k`（第一行，**可能是負數，也可能大於 26**）與一整行文字（第二行），把英文字母往後位移 `k` 位（超過 z 繞回 a），其他字元原樣輸出。

```text
輸入：
3
Hello, World!
輸出： Khoor, Zruog!
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <string>
#include <cctype>
#include <limits>
using namespace std;

int main() {
    int k;
    cin >> k;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');   // 丟掉數字那一行剩下的東西（含換行）
    string line;
    getline(cin, line);

    k = ((k % 26) + 26) % 26;         // 讓負的位移也能正常運作
    for (char& c : line) {
        if (islower(static_cast<unsigned char>(c)))
            c = static_cast<char>('a' + (c - 'a' + k) % 26);
        else if (isupper(static_cast<unsigned char>(c)))
            c = static_cast<char>('A' + (c - 'A' + k) % 26);
    }
    cout << line << '\n';
    return 0;
}
```

`for (char& c : line)` 的 `&` 很關鍵——沒有它就只是改複製品，原字串不會變。`ignore` 用的是正文那個「丟到換行為止」的完整寫法：單獨一個 `cin.ignore()` 只丟一個字元，數字後面若多打了空白，`getline` 就會讀到那些空白而不是下一行。

</details>

**實驗課題型加練**
Q6、Q7 的**題型**取自去年（2025）第 8、9 週實驗課的課堂練習（今年的投影片還沒出，題目可能會換）：先用一題「非成員函式＋`friend` 的比較運算子」暖身（10/29 留下來的題），再做運算子重載這週的招牌題「分數類別」——四則運算全部重載成成員函式、`<<` `>>` 用 `friend`，然後在 `main` 直接寫數學算式。題目不是我原創的：練的東西跟去年那幾題一樣，但題目本身、要算的式子、範例資料和解答都是我自己重寫的，不是原題。Q8–Q11 的字串題型取自歷年考古題，題目敘述與範例資料是重寫過的。

**Q6. 版本號的 `<`、`>`、`==`**
`class Version` 存主版號、次版號、修訂號三個整數（private），印成 `2.10.0` 這樣。用**非成員函式**重載 `<`、`>`、`==`（參數都是 `const Version&`），需要的話宣告成 `friend`；比較規則是先比主版號、相同再比次版號、再比修訂號（都是**數字**比較，所以 `2.10.0` 比 `2.9.7` 新）。讀入三個版本號（每個三個整數），印出前兩組的比較結果，並找出最新的版本。

```text
輸入：
2 10 0
2 9 7
2 10 0
輸出：
2.10.0 > 2.9.7
2.9.7 < 2.10.0
newest: 2.10.0
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

class Version {
public:
    Version(int a, int b, int c) : major(a), minor(b), patch(c) {}
    void print() const { cout << major << '.' << minor << '.' << patch; }
    friend bool operator<(const Version& a, const Version& b);
    friend bool operator==(const Version& a, const Version& b);
private:
    int major, minor, patch;
};

bool operator<(const Version& a, const Version& b) {
    if (a.major != b.major) return a.major < b.major;
    if (a.minor != b.minor) return a.minor < b.minor;
    return a.patch < b.patch;
}
bool operator==(const Version& a, const Version& b) {
    return a.major == b.major && a.minor == b.minor && a.patch == b.patch;
}
bool operator>(const Version& a, const Version& b) { return b < a; }   // 反過來問就好，不用 friend

int main() {
    int a, b, c;
    cin >> a >> b >> c; Version v1(a, b, c);
    cin >> a >> b >> c; Version v2(a, b, c);
    cin >> a >> b >> c; Version v3(a, b, c);
    v1.print(); cout << (v1 < v2 ? " < " : v1 == v2 ? " == " : " > "); v2.print(); cout << '\n';
    v2.print(); cout << (v2 < v3 ? " < " : v2 == v3 ? " == " : " > "); v3.print(); cout << '\n';

    Version newest = v1;                     // 找最新的版本
    if (v2 > newest) newest = v2;
    if (v3 > newest) newest = v3;
    cout << "newest: "; newest.print(); cout << '\n';
    return 0;
}
```

只有 `<` 和 `==` 真的需要碰 private 成員，所以只有它們是 `friend`；`>` 直接寫成 `b < a`，一行搞定又不用開後門。「先比第一欄、相同再比下一欄」這種**逐欄比較**的寫法，日期、成績排名都適用；這題故意放 `2.10.0` 跟 `2.9.7`，是因為把版本號當字串比會得到相反的答案（`"2.10"` 的第三個字元 `'1'` 小於 `'9'`），只有一欄一欄用整數比才對。

</details>

**Q7. 分數類別（完整版）**
寫 `class Fraction`，private 存分子與分母。用**成員函式**重載 `+`、`-`、`*`、`/` 與一元負號 `-`，用 **`friend`** 重載 `>>`（讀「分子 分母」）與 `<<`（印成 `a/b`）。`main` 用 `cin >> a >> b` 讀兩個分數後，算出並印出這三個式子：`A * B - A`、`(A + B) / B`、`-(A - B) * B`。分母保持正數、結果請約分；分母為 0（含除以分子為 0 的分數）印 `zero denominator` 並結束。輸入的分子分母都在 ±10000 以內。

```text
輸入：
1 2
3 4
輸出：
A = 1/2, B = 3/4
A * B - A = -1/8
(A + B) / B = 5/3
-(A - B) * B = 3/16
```

```text
輸入：
2 -6
5 3
輸出：
A = -1/3, B = 5/3
A * B - A = -2/9
(A + B) / B = 4/5
-(A - B) * B = 10/3
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <cstdlib>          // exit
using namespace std;

int gcd(int a, int b) {                  // 輾轉相除法（迴圈版）
    while (b != 0) { int r = a % b; a = b; b = r; }
    return a;
}

class Fraction {
public:
    Fraction(int n = 0, int d = 1) : num(n), den(d) { normalize(); }
    Fraction operator+(const Fraction& o) const { return Fraction(num * o.den + o.num * den, den * o.den); }
    Fraction operator-(const Fraction& o) const { return Fraction(num * o.den - o.num * den, den * o.den); }
    Fraction operator*(const Fraction& o) const { return Fraction(num * o.num, den * o.den); }
    Fraction operator/(const Fraction& o) const { return Fraction(num * o.den, den * o.num); }
    Fraction operator-() const { return Fraction(-num, den); }     // 一元負號：沒有參數
    friend istream& operator>>(istream& in, Fraction& f);
    friend ostream& operator<<(ostream& out, const Fraction& f);
private:
    int num, den;
    void normalize() {                       // 分母保持正數，並約分
        if (den == 0) { cerr << "zero denominator\n"; exit(1); }   // 不合法就直接結束，不要改成別的值
        if (den < 0) { num = -num; den = -den; }
        int g = gcd(num < 0 ? -num : num, den);
        if (g > 1) { num /= g; den /= g; }
    }
};

istream& operator>>(istream& in, Fraction& f) {
    in >> f.num >> f.den;
    f.normalize();
    return in;
}
ostream& operator<<(ostream& out, const Fraction& f) {
    return out << f.num << '/' << f.den;
}

int main() {
    Fraction a, b;
    cin >> a >> b;
    cout << "A = " << a << ", B = " << b << '\n';
    cout << "A * B - A = " << a * b - a << '\n';
    cout << "(A + B) / B = " << (a + b) / b << '\n';
    cout << "-(A - B) * B = " << -(a - b) * b << '\n';
    return 0;
}
```

看 `main` 那三行：**重載好之後，分數就能像 `int` 一樣寫進算式**，而且 `*`、`/` 比 `+`、`-` 先算的規則自動成立——優先順序是跟著運算子符號走的，重載改不了；`-(A - B) * B` 的一元負號則作用在括號那一項上，再跟 `B` 相乘。一元負號 `operator-()` 沒有參數，跟二元的 `operator-(const Fraction&)` 靠參數個數區分。所有運算子都透過建構子產生新物件，`normalize()` 在建構子裡統一處理正負號與約分，就不用在每個運算子裡各寫一次。兩個新面孔：`cerr` 是 09/17 提過的**標準錯誤輸出**（印錯誤訊息用，用法跟 `cout` 一樣）；`exit(1)` 會**立刻結束整支程式**，括號裡的 1 是交給作業系統的離開碼、代表異常結束——它在 `<cstdlib>` 裡，跟 `main` 的 `return 1;` 效果類似，差別是在任何函式裡都能用。

</details>

**Q8. 字母出現次數**
讀入一整行文字，統計每個英文字母出現幾次，大小寫視為相同，只印出現過的字母（依 a–z 順序）。

```text
輸入： Hello NSYSU, hello C++!
輸出：
c: 1
e: 2
h: 2
l: 4
n: 1
o: 2
s: 2
u: 1
y: 1
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <string>
#include <cctype>
using namespace std;

int main() {
    string line;
    getline(cin, line);
    int count[26] = {};                         // 26 個字母各一格，全部歸零
    for (char c : line) {
        unsigned char u = static_cast<unsigned char>(c);   // 正文講過：cctype 的函式要餵 unsigned char
        if (isalpha(u)) count[tolower(u) - 'a']++;         // 'a' 進第 0 格、'b' 第 1 格…
    }
    for (int i = 0; i < 26; i++)
        if (count[i] > 0)
            cout << static_cast<char>('a' + i) << ": " << count[i] << '\n';
    return 0;
}
```

「26 個字母各一格」的計數陣列是這類題目的標準解：`tolower(c) - 'a'` 把字母對應到 0–25。印的時候 `'a' + i` 算出來是 `int`，要 `static_cast<char>` 轉回字元才會印出字母而不是數字（本週正文提過 `toupper` / `tolower` 同樣的坑）。

</details>

**Q9. 整理多餘空白**
反覆讀入整行文字直到輸入結束（終端機按 <kbd>Ctrl</kbd>+<kbd>D</kbd>），去掉開頭與結尾的空白、把單字之間連續的空白壓成一個，用中括號框起來印出（方便看出頭尾沒有空白）。

```text
輸入：
   keep it   simple  
make   clean  and   make  again
輸出：
[keep it simple]
[make clean and make again]
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <string>
using namespace std;

string tidy(const string& s) {
    string out;
    bool pendingSpace = false;                  // 「前面有空白還沒放進去」
    for (char c : s) {
        if (c == ' ') {
            pendingSpace = true;                // 先記著，等看到下一個字再決定
        } else {
            if (pendingSpace && !out.empty()) out += ' ';   // 開頭的空白不要
            out += c;
            pendingSpace = false;
        }
    }
    return out;                                 // 結尾的空白自然被丟掉
}

int main() {
    string line;
    while (getline(cin, line))                 // getline 也能當條件：讀到一行就繼續，輸入結束就停（同 10/29 Q4 的 cin >> cmd）
        cout << '[' << tidy(line) << "]\n";
    return 0;
}
```

一個旗標 `pendingSpace` 解決三種情況：開頭的空白（`out` 還是空的，不放）、中間連續空白（只在遇到下一個字時放一個）、結尾空白（迴圈結束就丟掉了）。逐字元掃一遍、用 `+=` 接到新字串，比在原字串上 `erase` 來 `erase` 去簡單得多。

</details>

**Q10. 九宮格鍵盤**
早期手機的九宮格按鍵：2 = `abc`、3 = `def`、4 = `ghi`、5 = `jkl`、6 = `mno`、7 = `pqrs`、8 = `tuv`、9 = `wxyz`。要打出一個字母得按同一鍵好幾下（`h` 是 4 鍵按兩下）。反覆讀入小寫單字，把每個字母改寫成「字母 + 按幾下」印出。

```text
輸入：
hello
nsysu
zoo
輸出：
h2e2l3l3o3
n2s4y3s4u2
z4o3o3
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    const string keys[8] = {"abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
    string word;
    while (cin >> word) {
        string code;
        for (char c : word) {
            for (int k = 0; k < 8; k++) {
                size_t pos = keys[k].find(c);               // 在第 k 個按鍵上是第幾個字母？
                if (pos != string::npos) {                  // npos 代表「找不到」
                    code += c;
                    code += to_string(pos + 1);             // 按幾下：位置 + 1
                    break;
                }
            }
        }
        cout << code << '\n';
    }
    return 0;
}
```

把八個鍵的字母存成 `string` 陣列，對每個字母用 `find` 找它在哪個鍵的第幾個位置：位置是 0 起算，按的次數就是位置 + 1。`find` 找不到回傳 `string::npos`，本週正文講過要拿它來比、不能拿 `-1` 比。`to_string` 把整數變成字串才能用 `+=` 接上去。

</details>

**Q11. 羅馬數字**
反覆讀入 1–3999 的整數，轉成羅馬數字（I=1、V=5、X=10、L=50、C=100、D=500、M=1000；4 寫成 IV、9 寫成 IX、40 是 XL、90 是 XC、400 是 CD、900 是 CM），讀到 `0` 結束，範圍外印 `out of range`。請用 `switch` 做判斷。

```text
輸入：
4
27
1994
3999
0
輸出：
4 = IV
27 = XXVII
1994 = MCMXCIV
3999 = MMMCMXCIX
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <string>
using namespace std;

// 把 0~9 的一位數轉成羅馬數字；one/five/ten 是這一位對應的三個符號
string digitToRoman(int d, char one, char five, char ten) {
    string s;
    switch (d) {
        case 1: s = string(1, one); break;              // I
        case 2: s = string(2, one); break;              // II
        case 3: s = string(3, one); break;              // III
        case 4: s = string(1, one) + five; break;       // IV
        case 5: s = string(1, five); break;             // V
        case 6: s = string(1, five) + one; break;       // VI
        case 7: s = string(1, five) + string(2, one); break;
        case 8: s = string(1, five) + string(3, one); break;
        case 9: s = string(1, one) + ten; break;        // IX
        default: break;                                 // 0：空字串
    }
    return s;
}

int main() {
    int n;
    while (true) {
        cin >> n;
        if (n == 0) break;
        if (n < 1 || n > 3999) { cout << "out of range\n"; continue; }
        string r = digitToRoman(n / 1000, 'M', '?', '?')      // 千位最多 3，只會用到 M
                 + digitToRoman(n / 100 % 10, 'C', 'D', 'M')
                 + digitToRoman(n / 10 % 10, 'X', 'L', 'C')
                 + digitToRoman(n % 10, 'I', 'V', 'X');
        cout << n << " = " << r << '\n';
    }
    return 0;
}
```

關鍵觀察：個位、十位、百位的規則**一模一樣**，只是符號不同（I V X → X L C → C D M）。所以只寫一個「一位數 → 羅馬」的函式，把三個符號當參數傳進去，呼叫四次接起來。`string(3, one)` 是「由 3 個 `one` 組成的字串」，本週正文 `string` 那節的建構子之一。

</details>

---

[← 11/05｜期中上機考（範圍 Ch 1–6）](/2026/09/09/nsysu-c-programming/1105-midterm/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [11/19｜指標、動態記憶體與 C 風格字串（Ch 9、Ch 10） →](/2026/09/09/nsysu-c-programming/1119-pointers/)
