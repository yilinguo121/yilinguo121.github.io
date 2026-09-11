---
title: 10/15｜結構與類別（Ch 5–6）
date: 2026-09-10
cover: /images/code-cover.jpg
toc: true
comments: true
---

> 本文是〈[中山大學 C 程式設計 & 實驗課完整自學指南](/2026/09/09/nsysu-c-programming/)〉系列的一篇，內容為原創說明與自寫範例，不轉載教科書或授課投影片。
>
> [← 10/08｜陣列（Ch 5）](/2026/09/09/nsysu-c-programming/1008-arrays/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [10/22｜類別與建構子（Ch 6–7） →](/2026/09/09/nsysu-c-programming/1022-constructors/)

> 對應課本習題：Ch6: 1, 7, 10, 12

**本頁目錄**：[為什麼需要 `struct`](#為什麼需要-struct) ｜ [使用 `struct`](#使用-struct) ｜ [從 `struct` 到 `class`](#從-struct-到-class) ｜ [封裝（encapsulation）是什麼、為什麼](#封裝encapsulation是什麼-為什麼) ｜ [成員函式後面的 `const`](#成員函式後面的-const) ｜ [在類別外面定義成員函式](#在類別外面定義成員函式) ｜ [本週練習題](#本週練習題)

**這週要會什麼**

```text
struct → 成員存取 → struct 傳參 → class → public / private → 封裝 → const 成員函式
```

這是整學期**最關鍵的轉折**：從「一堆變數與函式」進到「物件」。之後每一週都建立在這個觀念上，卡住的話請務必補起來。

## 為什麼需要 `struct`

假設要處理 50 位學生的姓名、學號、成績，只用陣列會變成這樣：

```cpp
string name[50];
int    id[50];
double gpa[50];
```

三個陣列必須「第 i 格代表同一個人」——**只要有一次排序忘了同步交換，資料就全錯了**。`struct` 的作用就是把這些欄位**綁成一包**：

```cpp
struct Student {
    string name;
    int    id;
    double gpa;
};            // ← 這個分號絕對不能忘
```

之後 `Student s[50];` 一個陣列就搞定，排序時整包一起搬，不可能錯開。

## 使用 `struct`

```cpp
#include <iostream>
#include <string>
using namespace std;

struct Student {
    string name;
    int    id;
    double gpa;
};

int main() {
    Student s;                    // 宣告一個 Student 變數（叫做「物件」）
    s.name = "Yilin";             // 用 . 存取成員
    s.id   = 113001;
    s.gpa  = 4.0;
    cout << s.name << ' ' << s.gpa << '\n';

    Student t = {"Ann", 113002, 3.8};     // 宣告時直接初始化
    cout << t.name << '\n';
    return 0;
}
```

> **雷區 ①：`struct` 定義後面忘記分號**
> ```cpp
> struct Student {
>     string name;
> }            // ← 少了分號
> int main() { ... }
> ```
> 錯誤訊息會是莫名其妙的 `error: expected initializer before 'int'`，而且**指到下一行**。看到「錯誤指在一個看起來沒問題的地方」，第一件事就是往上檢查有沒有漏分號。

**巢狀結構**（結構裡放結構）也很常見：

```cpp
struct Date { int year, month, day; };

struct Employee {
    string name;
    Date   hireDate;      // 一個 Employee 裡面有一個 Date
};

Employee e;
e.hireDate.year = 2026;   // 一層一層點下去
```

**結構傳進函式**：預設是**傳值（整包複製）**，所以大結構要用 `const&`：

```cpp
void printStudent(const Student& s) {          // 不複製、不修改
    cout << s.id << ' ' << s.name << ' ' << s.gpa << '\n';
}

void giveBonus(Student& s, double delta) {     // 要修改就不能加 const
    s.gpa += delta;
}
```

## 從 `struct` 到 `class`

`struct` 有個問題：**任何人都能亂改裡面的值**。

```cpp
Student s;
s.gpa = -999;      // 沒有人擋得住
```

`class` 解決的就是這件事。它跟 `struct` 幾乎一樣，差別只有**預設的存取權限**：

| | 預設權限 |
| --- | --- |
| `struct` | `public`（誰都能存取） |
| `class` | `private`（只有自己的成員函式能存取） |

**存取權限三個關鍵字**：

- `private`：只有這個類別**自己的成員函式**能碰。
- `public`：任何人都能碰。
- `protected`：自己 + **繼承它的子類別**能碰（講到繼承時會用到）。

```cpp
#include <iostream>
using namespace std;

class Circle {
private:
    double r;                            // 資料成員：外面看不到

public:
    void setRadius(double x) {           // mutator（設定值，俗稱 setter）
        if (x >= 0) r = x;               // 可以在這裡做檢查！
        else        r = 0;
    }
    double getRadius() const {           // accessor（讀取值，俗稱 getter）
        return r;
    }
    double area() const {
        return 3.14159265358979 * r * r;
    }
};

int main() {
    Circle c;
    c.setRadius(3);
    // c.r = -5;                         // 編譯錯誤：r 是 private，改不到
    cout << c.area() << '\n';            // 28.2743
    return 0;
}
```

## 封裝（encapsulation）是什麼、為什麼

**白話說**：把資料藏起來（`private`），只留幾個開關（`public` 函式）給外界用。

三個實際好處：

1. **可以檢查**：`setRadius` 能擋掉負數，資料永遠是合法的。
2. **可以改實作**：哪天你想把半徑改成存直徑，只要 `getRadius()` 回傳 `d/2`，**所有用到這個類別的程式都不用改**。
3. **好找 bug**：半徑變成奇怪的值時，只可能是那幾個 public 函式做的，不用翻遍整份程式。

課本給的檢驗標準很實用：**如果把所有資料成員的名字全改掉，只需要改類別內部就能編譯過，那封裝就做對了。**

## 成員函式後面的 `const`

```cpp
double area() const { return 3.14159 * r * r; }
//              ^^^^^ 承諾：這個函式不會修改物件
```

加了 `const` 的成員函式，**編譯器會擋住你在裡面改任何資料成員**。為什麼重要？因為：

```cpp
void show(const Circle& c) {
    cout << c.area();        // 只有標了 const 的成員函式才能被呼叫
}
```

如果 `area()` 沒寫 `const`，這裡就會編譯錯誤 `passing 'const Circle' as 'this' argument discards qualifiers`。**規則很簡單：所有「只讀不寫」的成員函式都加 `const`**，養成習慣就不會被這個錯誤訊息卡住。

## 在類別外面定義成員函式

類別裡面只留宣告、實作寫在外面，是比較正式的寫法（之後把程式拆成多個檔案時一定會用到）：

```cpp
class Circle {
private:
    double r;
public:
    void   setRadius(double x);
    double area() const;
};

void Circle::setRadius(double x) {      // Circle:: 表示「這是 Circle 的成員」
    r = (x >= 0) ? x : 0;
}

double Circle::area() const {           // 定義時 const 也要跟著寫
    return 3.14159265358979 * r * r;
}
```

`::` 叫做**範圍解析運算子（scope resolution operator）**，意思是「這個名字屬於哪裡」。

## 本週練習題

**Q1. Point 與兩點距離**
定義 `struct Point { double x, y; };`，寫函式計算兩點距離，讀入兩點座標後輸出，保留三位小數。

```text
輸入： 0 0 3 4
輸出： distance = 5.000
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
#include <cmath>
using namespace std;

struct Point {
    double x, y;
};

double distance(const Point& a, const Point& b) {
    double dx = a.x - b.x;
    double dy = a.y - b.y;
    return sqrt(dx * dx + dy * dy);
}

int main() {
    Point p, q;
    cin >> p.x >> p.y >> q.x >> q.y;
    cout << "distance = " << fixed << setprecision(3)
         << distance(p, q) << '\n';
    return 0;
}
```

</details>

**Q2. 學生類別**
寫一個 `class Student`，資料成員為姓名、學號、GPA（皆 private），提供各自的 setter / getter 以及 `print()`。GPA 只接受 0.0–4.3，超出範圍就設為 0。

```text
輸入： Yilin 113001 4.0
輸出： 113001 Yilin 4.00
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
#include <string>
using namespace std;

class Student {
private:
    string name;
    int    id;
    double gpa;

public:
    void setName(const string& n) { name = n; }
    void setId(int i)             { id = i; }
    void setGpa(double g)         { gpa = (g >= 0.0 && g <= 4.3) ? g : 0.0; }

    string getName() const { return name; }
    int    getId()   const { return id; }
    double getGpa()  const { return gpa; }

    void print() const {
        cout << id << ' ' << name << ' '
             << fixed << setprecision(2) << gpa << '\n';
    }
};

int main() {
    string n; int i; double g;
    cin >> n >> i >> g;

    Student s;
    s.setName(n);
    s.setId(i);
    s.setGpa(g);
    s.print();
    return 0;
}
```

</details>

**Q3. 依 GPA 排序**
讀入 `n` 位學生（姓名、學號、GPA），依 GPA **由高到低**排序後輸出；GPA 相同時依學號由小到大。

```text
輸入：
3
Ann 113002 3.8
Bob 113003 4.0
Cat 113001 4.0
輸出：
113001 Cat 4.00
113003 Bob 4.00
113002 Ann 3.80
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
#include <string>
using namespace std;

struct Student {
    string name;
    int    id;
    double gpa;
};

// 回傳 true 代表 a 應該排在 b 前面
bool higher(const Student& a, const Student& b) {
    if (a.gpa != b.gpa) return a.gpa > b.gpa;
    return a.id < b.id;
}

int main() {
    const int MAX = 100;
    Student s[MAX];
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) cin >> s[i].name >> s[i].id >> s[i].gpa;

    for (int i = 0; i < n - 1; i++)                 // 選擇排序
        for (int j = i + 1; j < n; j++)
            if (higher(s[j], s[i])) {
                Student t = s[i]; s[i] = s[j]; s[j] = t;   // 整包交換
            }

    cout << fixed << setprecision(2);
    for (int i = 0; i < n; i++)
        cout << s[i].id << ' ' << s[i].name << ' ' << s[i].gpa << '\n';
    return 0;
}
```

**重點**：把比較規則抽成 `higher()` 函式，排序邏輯就不會被一長串條件式塞爆——而且交換時是 `Student t = s[i];` **整包一起搬**，不可能發生欄位錯開。

</details>

**Q4. 分數類別（Fraction）**
寫一個 `class Fraction`，存分子與分母（private），提供 `set(分子, 分母)`、`print()`（自動約分並處理負號）、`toDouble()`。分母為 0 時視為 `1`。

```text
輸入： 6 -8
輸出：
-3/4
-0.750
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
using namespace std;

int gcd(int a, int b) {
    if (a < 0) a = -a;
    if (b < 0) b = -b;
    return (b == 0) ? a : gcd(b, a % b);
}

class Fraction {
private:
    int num, den;

public:
    void set(int n, int d) {
        if (d == 0) d = 1;
        if (d < 0) { n = -n; d = -d; }      // 負號統一放在分子
        int g = gcd(n, d);
        if (g != 0) { n /= g; d /= g; }
        num = n;
        den = d;
    }
    void print() const { cout << num << '/' << den << '\n'; }
    double toDouble() const { return static_cast<double>(num) / den; }
};

int main() {
    int n, d;
    cin >> n >> d;
    Fraction f;
    f.set(n, d);
    f.print();
    cout << fixed << setprecision(3) << f.toDouble() << '\n';
    return 0;
}
```

這題把「約分」與「負號正規化」放在 `set()` 裡，外面不管傳什麼進來，物件內部永遠是最簡分數——**這就是封裝的價值**。

</details>

---

[← 10/08｜陣列（Ch 5）](/2026/09/09/nsysu-c-programming/1008-arrays/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [10/22｜類別與建構子（Ch 6–7） →](/2026/09/09/nsysu-c-programming/1022-constructors/)
