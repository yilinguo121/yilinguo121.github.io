---
title: 11/12｜運算子重載、friend 與 string（Ch 8、Ch 9）
date: 2026-09-10
updated: 2026-09-11
permalink: 2026/09/09/nsysu-c-programming/1112-operator-string/
cover: /images/code-cover.jpg
categories: [程式設計]
tags: [C++, 中山大學, 自學指南]
toc: true
comments: true
hidden: true
---

[← 11/05｜期中上機考（範圍 Ch 1–6）](/2026/09/09/nsysu-c-programming/1105-midterm/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [11/19｜指標、動態記憶體與 C 風格字串（Ch 9、Ch 10） →](/2026/09/09/nsysu-c-programming/1119-pointers/)

> 對應課本習題：Ch8: 1, 4, 5, 8, 9

**這次要會什麼**

```text
成員 vs 非成員運算子 → friend → 重載 << 與 >> → 重載 [] 與 ++ → string 類別
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
| `<<`、`>>`（左邊是 `cout` / `cin`） | **只能非成員** |
| `=`、`[]`、`()`、`->` | C++ 規定**只能成員** |

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

## `friend`：讓外面的函式能看見 private

非成員函式碰不到 `private` 資料。兩個解法：

1. 提供 public 的 getter（比較乾淨，優先考慮）。
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

> **注意**：`friend` 是把封裝**開一個洞**。課本的建議是「能用 getter 就用 getter」，`friend` 留給 `<<`、`>>` 這類無法用成員函式表達的場合。

## 重載 `<<` 與 `>>`

這是最實用的一組，讓你的類別可以直接 `cout << obj`：

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

三個一定要記住的細節：

1. 回傳型別是 **`ostream&`**（參考），不是 `void`——這樣才能串接 `<<`。
2. 第一個參數是 **`ostream& os`**，不能加 `const`（輸出會改變串流狀態）。
3. `operator>>` 的第二個參數**不能加 `const`**（要把讀到的值寫進去）。

## 重載 `[]` 與 `++`

```cpp
class IntArray {
private:
    int data[100];
    int n;
public:
    IntArray() : n(100) { for (int i = 0; i < n; i++) data[i] = 0; }

    int& operator[](int i) { return data[i]; }              // 可讀可寫
    int  operator[](int i) const { return data[i]; }        // const 物件用的版本
};

IntArray a;
a[3] = 7;                 // 因為回傳 int&，所以可以放在等號左邊
cout << a[3];             // 7
```

前置與後置 `++` 的區分方式有點詭異，但考試會考：

```cpp
class Counter {
private:
    int v;
public:
    Counter(int v = 0) : v(v) { }

    Counter& operator++()      { ++v; return *this; }        // 前置 ++c
    Counter  operator++(int)   { Counter old = *this; ++v; return old; }  // 後置 c++
    int get() const { return v; }
};
```

- **前置**：沒有參數，回傳**參考**（改完的自己）。
- **後置**：多一個沒有名字的 `int` 參數（純粹用來區分，不會真的傳值），回傳**改之前的複製品**。
- `*this` 代表「物件自己」，`this` 是指向自己的指標（下一節講指標時會再遇到）。

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
    cout << s.substr(7, 5) << '\n';   // NSYSU（從第 7 個字開始取 5 個）

    if (s.find("NSYSU") != string::npos)      // 找不到會回傳 string::npos
        cout << "found at " << s.find("NSYSU") << '\n';

    string a = "apple", b = "banana";
    if (a < b) cout << a << " comes first\n";   // 字典序比較，可以直接用 < >
    return 0;
}
```

| 用法 | 作用 |
| --- | --- |
| `s.length()` / `s.size()` | 字元數 |
| `s.empty()` | 是否為空字串 |
| `s[i]` / `s.at(i)` | 第 i 個字元 |
| `s.substr(pos, len)` | 取子字串（`len` 省略則取到結尾） |
| `s.find(t)` | 找子字串，回傳位置或 `string::npos` |
| `s.insert(pos, t)` / `s.erase(pos, len)` | 插入 / 刪除 |
| `s + t`、`s += t` | 串接 |
| `==`、`!=`、`<`、`>` | 比較（字典序） |
| `stoi(s)` / `to_string(n)` | 字串與數字互轉（C++11） |

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
> **解法**：中間加一行 `cin.ignore();`（丟掉一個字元），或更保險的
> ```cpp
> cin.ignore(numeric_limits<streamsize>::max(), '\n');   // 需要 #include <limits>
> ```
> 這個坑幾乎每個人都踩過一次，筆試也常考。

**逐字元處理**（需要 `#include <cctype>`）：

| 函式 | 作用 |
| --- | --- |
| `isalpha(c)` | 是否為英文字母 |
| `isdigit(c)` | 是否為數字字元 |
| `isspace(c)` | 是否為空白類字元 |
| `isupper(c)` / `islower(c)` | 是否為大 / 小寫 |
| `toupper(c)` / `tolower(c)` | 轉大 / 小寫 |

> **雷區**：`toupper` 回傳的是 **`int`** 不是 `char`。
> ```cpp
> cout << toupper('a');                      // 印出 65，不是 'A'
> cout << static_cast<char>(toupper('a'));   // 印出 A
> ```

## 本次練習題

**Q1. Money 類別**
寫 `class Money`，用「元」與「分」兩個整數存金額（分為 0–99）。重載 `+`、`-`、`==`、`<<`，讓 `cout << m` 輸出成 `$12.05` 的格式。

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

**設計重點**：金額**不要用 `double` 存**，浮點誤差會讓 `0.1 + 0.2 != 0.3`。改存整數「分」，輸出時再除回來。

</details>

**Q2. 字元統計**
讀入一整行英文句子，統計每個英文字母出現次數（大小寫視為相同），只輸出有出現過的字母。

```text
輸入： Hello NSYSU
輸出：
e:1
h:1
l:2
n:1
o:1
s:2
u:1
y:1
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

    int count[26] = {};
    for (char c : line)
        if (isalpha(static_cast<unsigned char>(c)))
            count[tolower(static_cast<unsigned char>(c)) - 'a']++;

    for (int i = 0; i < 26; i++)
        if (count[i] > 0)
            cout << static_cast<char>('a' + i) << ':' << count[i] << '\n';
    return 0;
}
```

`c - 'a'` 會得到 0–25 的索引，這是處理英文字母最常用的手法。傳給 `isalpha` / `tolower` 前轉成 `unsigned char` 是標準建議做法，避免中文或特殊字元造成未定義行為。

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

    bool ok = true;
    for (size_t i = 0, j = clean.size(); i + 1 < j; i++, j--)
        if (clean[i] != clean[j - 1]) { ok = false; break; }

    cout << (ok ? "yes" : "no") << '\n';
    return 0;
}
```

</details>

**Q4. 單字切割與統計**
讀入一整行，輸出總共有幾個單字，以及最長的單字。單字之間可能有多個空白。

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
讀入位移量 `k` 與一整行文字，把英文字母往後位移 `k` 位（超過 z 繞回 a），其他字元原樣輸出。

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
using namespace std;

int main() {
    int k;
    cin >> k;
    cin.ignore();                     // 吃掉數字後面的換行
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

`for (char& c : line)` 的 `&` 很關鍵——沒有它就只是改複製品，原字串不會變。

</details>

---

[← 11/05｜期中上機考（範圍 Ch 1–6）](/2026/09/09/nsysu-c-programming/1105-midterm/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [11/19｜指標、動態記憶體與 C 風格字串（Ch 9、Ch 10） →](/2026/09/09/nsysu-c-programming/1119-pointers/)
