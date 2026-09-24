---
title: 10/15｜結構與類別（Ch 5–6）
date: 2026-09-10
updated: 2026-09-12
permalink: 2026/09/09/nsysu-c-programming/1015-struct-class/
cover: /images/code-cover.jpg
categories: [程式設計]
tags: [C++, 中山大學, 自學指南]
description: 中山大學 C 程式設計自學指南 Ch 5–6：struct 的用法、從 struct 到 class、封裝、const 成員函式與在類別外定義成員函式，附本週練習題與參考解答。
toc: true
comments: true
hidden: true
---

[← 10/08｜陣列（Ch 5）](/2026/09/09/nsysu-c-programming/1008-arrays/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [10/22｜類別與建構子（Ch 6–7） →](/2026/09/09/nsysu-c-programming/1022-constructors/)

> 對應課本習題：Ch6: 1, 7, 10, 12

<details>
<summary><b>這幾題各要用到什麼（動手前先看）</b></summary>

主課的上機考幾乎就是這些題目，所以每一題都自己寫過。下表是每題需要的東西（我的歸納，不是題目本文）與本系列對應的練習：

| 課本題號 | 要用到的東西 | 先練 |
| --- | --- | --- |
| Ch6-1 | 三項分數加權、換算成 100 分再分級，用 `struct` 存一筆員工資料 | Q3、Q7 |
| Ch6-7 | 披薩類別：種類／大小用常數、setter／getter、描述與計價各一個成員函式 | Q2、Q7 |
| Ch6-10 | 重量類別內部一律存同一種單位，三種單位的 setter 各自換算——「內部永遠是正規形式」 | Q4 |
| Ch6-12 | 類別成員是字串陣列，從檔案讀清單、隨機挑三樣、選單換貨——Q6 的陣列成員＋09/24 讀檔＋`rand` | Q6、10/29 Q5 |

</details>

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

陣列的元素型別不限於數字，`string name[50];` 就是一排 50 個字串（`string` 不像 `int` 會留垃圾值，沒給初值的每一格都是空字串）。但三個陣列必須「第 i 格代表同一個人」——**只要有一次排序忘了同步交換，資料就全錯了**。`struct` 的作用就是把這些欄位**綁成一包**：

```cpp
struct Student {
    string name;
    int    id;
    double gpa;
};            // ← 這個分號絕對不能忘
```

之後 `Student s[50];` 一個陣列就搞定。

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
    Student s;                    // 照著設計圖做出一個「物件」
    s.name = "Yilin";             // 用 . 存取成員
    s.id   = 113001;
    s.gpa  = 4.0;
    cout << s.name << ' ' << s.gpa << '\n';

    Student t = {"Ann", 113002, 3.8};     // 宣告時直接初始化
    cout << t.name << '\n';
    return 0;
}
```

輸出：

```text
Yilin 4
Ann
```

**型別與物件**：`struct Student { ... };` 定義的是一個**新型別**，等於一張設計圖，本身不佔記憶體；`Student s;` 才照圖做出一個東西，這個東西就叫**物件（object）**。設計圖只有一張，物件可以有無限多個。

**大括號初始化**：裡面的值**依成員宣告的順序**一一對應（`name`、`id`、`gpa`），不能跳過中間的欄位；少寫的欄位會變成 0 或空字串（`-Wextra` 會提醒你漏了）。順序寫錯時，如果型別不相容（例如把 3.8 放進 `int` 的 `id`），g++ 會直接擋下來報 `narrowing conversion`，算是好運；真正危險的是**兩個同型別的欄位對調**（例如兩個 `int`），編譯器一聲都不吭，資料就這樣錯到底。欄位一多時建議一行一行用 `.` 指定。

放進陣列後，`s[3].gpa` 讀作「第 3 位學生的 gpa」——先用 `[]` 從陣列挑出一個 `Student`，再用 `.` 取它的欄位，由左往右讀就對了。

### 巢狀結構

結構裡面放結構也很常見：

```cpp
#include <iostream>
#include <string>
using namespace std;

struct Date { int year, month, day; };

struct Employee {
    string name;
    Date   hireDate;      // 一個 Employee 裡面有一個 Date
};

int main() {
    Employee e;
    e.name = "Amy";
    e.hireDate.year = 2026;      // 一層一層點下去
    cout << e.name << ' ' << e.hireDate.year << '\n';
    return 0;
}
```

輸出：

```text
Amy 2026
```

> **雷區 ①：`struct` 定義後面忘記分號**
> ```cpp
> struct Date { int year, month, day; }     // ← 少了分號
>
> Date d;
> ```
> g++ 通常會說 `error: expected ';' after struct definition` 並指在 `}` 那一行；但下一行剛好在宣告變數時（如上），訊息會變成 `expected initializer before 'd'` 並**指到下一行**。只要錯誤指在一個看起來完全沒問題的地方，第一件事就是往上檢查分號。

## `struct` 傳進函式

先跟上週的陣列分清楚。陣列：傳進函式只傳第一格位址、不複製，也不能當回傳值（上週講過）；還有一件上週沒特別提的——**兩個陣列不能用 `=` 互相指派**。**`struct` 三件事全部相反**：`b = a;` 會把每個欄位各複製一份、可以整包當參數傳、也可以整包當回傳值。正因為會複製一整包，大的結構才要用 `const&`：

```cpp
void printStudent(const Student& s) {          // 不複製、不修改
    cout << s.id << ' ' << s.name << ' ' << s.gpa << '\n';
}

void giveBonus(Student& s, double delta) {     // 要修改就不能加 const
    s.gpa += delta;
}
```

另外兩件事實際跑一次：

```cpp
#include <iostream>
#include <string>
using namespace std;

struct Student {
    string name;
    int    id;
    double gpa;
};

Student makeStudent() {
    Student s = {"Ann", 113002, 3.8};
    return s;              // 可以：整包複製一份回去（區域陣列不行，區域 struct 可以）
}

int main() {
    Student a = makeStudent();
    Student b = a;         // 每個欄位各複製一份
    b.gpa = 0;             // 改 b 完全不會動到 a
    cout << a.gpa << ' ' << b.gpa << '\n';
    return 0;
}
```

輸出：

```text
3.8 0
```

順帶一提，`string` 雖然裝的是一串字元，但它是**類別**不是陣列，所以跟 `struct` 一樣可以 `a = b;` 整包指派、整包傳參、整包當回傳值——這也是課程一律用 `string` 而不用 `char` 陣列的原因之一。

## `class`：把資料鎖起來

`struct` 的欄位預設誰都能改：

```cpp
Student s;
s.gpa = -999;      // 沒有人擋得住
```

`class` 和 `struct` 的大括號裡除了資料，還能直接放函式，這種函式叫**成員函式（member function）**。成員函式裡直接寫成員名字就能用那個物件的資料，不必當參數傳進去。

**存取權限**：

- `private`：只有這個類別**自己的成員函式**能碰。
- `public`：任何人都能碰。

（還有第三個 `protected`，講繼承時才會用到，這週先忽略。）

寫法是 `public:`——關鍵字後面加一個冒號、自成一行。它是**標籤**不是敘述，所以不加分號；從它以下的每個成員都套用這個權限，**直到下一個標籤為止**。最常見的就是 `private:` 放資料、`public:` 放函式。

所以擋住 `s.gpa = -999;` 的是 **`private` 這個關鍵字**，不是 `class`——`struct` 裡面一樣能寫 `private`，`class` 只是**預設**就是 private 而已（`struct` 預設是 `public`），除此之外兩者完全一樣。實務慣例很簡單：**只是把幾個欄位綁成一包、沒有檢查邏輯的用 `struct`；有 private 資料 ＋ 一組函式當對外介面的用 `class`。**

## 第一個類別：`Circle`

```cpp
#include <iostream>
using namespace std;

const double PI = 3.14159265358979;

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
        return PI * r * r;
    }
};

int main() {
    Circle c;
    c.setRadius(3);
    // c.r = -5;                         // 編譯錯誤：r 是 private，改不到
    cout << c.area() << '\n';
    return 0;
}
```

輸出：

```text
28.2743
```

`c.setRadius(3)` 讀作「叫 `c` 去執行它的 `setRadius`，把 3 交給它」——`.` 也用來**呼叫成員函式**，`c.area()` 沒有引數但括號不能省。`area()` 裡的 `r` 既沒宣告也不是參數，它就是 `c` 自己的那一份；再宣告一個 `Circle d;`，`d.area()` 算的就是 `d` 的 `r`——同一段程式碼，每個物件各有一份資料。

注意 `Circle c;` 之後 `r` 還是垃圾值（編譯器有時抓得到、有時抓不到，不能指望它），一定要先 `setRadius` 才能用。想讓物件「一出生就合法」，需要的是**建構子**——下週的主題。

> **雷區 ②：`class` 忘了寫 `public:`**
> ```cpp
> class Circle {
>     double r;
>     void setRadius(double x);   // 忘了寫 public:，整個類別都是 private
> };
> ```
> 呼叫時會出現 `error: 'void Circle::setRadius(double)' is private within this context`，下面還跟一行 `note: declared private here`。看到 `is private within this context`，九成是漏了 `public:`。

## 封裝（encapsulation）

**白話說**：把資料藏起來（`private`），只留幾個開關（`public` 函式）給外界用。

三個實際好處：

1. **可以檢查**：`setRadius` 擋掉負數，資料永遠合法。
2. **可以改實作**：只要 public 函式的行為不變，內部怎麼改（改存直徑、成員改名）都不影響外面。
3. **好找 bug**：資料變成怪值，兇手只可能在那幾個 public 函式裡。

## 成員函式後面的 `const`

```cpp
double area() const { return PI * r * r; }
//              ^^^^^ 承諾：這個函式不會修改物件
```

加了 `const` 的成員函式，**編譯器會擋住你在裡面改任何資料成員**。為什麼重要？因為：

```cpp
void show(const Circle& c) {
    cout << c.area();        // 只有標了 const 的成員函式才能被呼叫
}
```

如果 `area()` 沒寫 `const`，這裡就會編譯錯誤 `passing 'const Circle' as 'this' argument discards qualifiers`（訊息裡的 `this` 就是「呼叫這個成員函式的那個物件」，11/19 講指標時才正式介紹；現在認得這串訊息＝「const 物件被交給了沒標 const 的成員函式」就夠了）。**規則很簡單：所有「只讀不寫」的成員函式都加 `const`**。

## 在類別外面定義成員函式

類別裡面只留宣告、實作寫在外面。好處是類別本體變成一張目錄，一眼看得完有哪些成員，實作再長也撐不爆它（之後把程式拆成多個檔案時一定會這樣寫）：

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

double Circle::area() const {           // 宣告有 const，定義就一定要跟著寫
    return PI * r * r;
}
```

`::` 叫做**範圍解析運算子（scope resolution operator）**，意思是「這個名字屬於哪裡」。**`const` 宣告與定義兩邊都要寫**：只寫一邊會被當成兩個不同的函式，g++ 給 `error: no declaration matches 'double Circle::area()'`。

## 本週重點回顧

- `struct` / `class` 定義的**大括號後面要加分號**，忘了會出現指在別行的怪錯誤。
- `struct` 預設 `public`、`class` 預設 `private`；把資料設 private、只留少數 public 函式當介面，就是**封裝**。
- **所有只讀不寫的成員函式都加 `const`**，否則接不了 `const 物件&`。
- struct / class 傳參是整包複製（跟陣列相反），大的要用 `const&`；類別外定義成員函式要寫 `類別名::`。

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

double dist(const Point& a, const Point& b) {   // 不叫 distance：標準函式庫已經有同名的
    double dx = a.x - b.x;
    double dy = a.y - b.y;
    return sqrt(dx * dx + dy * dy);
}

int main() {
    Point p, q;
    cin >> p.x >> p.y >> q.x >> q.y;
    cout << "distance = " << fixed << setprecision(3)
         << dist(p, q) << '\n';
    return 0;
}
```

</details>

**Q2. 學生類別**
寫一個 `class Student`，資料成員為姓名、學號、GPA（皆 private），提供各自的 setter / getter 以及 `print()`。GPA 只接受 0.0–4.3，超出範圍就設為 0。印完資料後，若 GPA ≥ 3.5 再多印一行 `honor roll`。

```text
輸入： Yilin 113001 4.0
輸出：
113001 Yilin 4.00
honor roll
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
    if (s.getGpa() >= 3.5) cout << "honor roll\n";
    return 0;
}
```

`print()` 在類別內部可以直接寫 `id`、`name`；`main` 想拿 GPA 出來判斷卻只能透過 `getGpa()`——這就是 getter 存在的理由。`setName` 裡的 `name = n;` 會把整個字串複製一份給資料成員。另外 `cin >> n`（`n` 是 `string`）只讀到**下一個空白為止**，所以這種題目的姓名不能含空白；要連空白一起讀整行得用 `getline`，11/12 會講。

</details>

**Q3. 依 GPA 排序**
讀入 `n` 位學生（姓名、學號、GPA，n ≤ 100），依 GPA **由高到低**排序後輸出；GPA 相同時依學號由小到大。

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
    if (n > MAX) n = MAX;
    for (int i = 0; i < n; i++) cin >> s[i].name >> s[i].id >> s[i].gpa;

    for (int i = 0; i < n - 1; i++) {                       // 選擇排序
        int bestIdx = i;
        for (int j = i + 1; j < n; j++)
            if (higher(s[j], s[bestIdx])) bestIdx = j;
        if (bestIdx != i) {
            Student t = s[i]; s[i] = s[bestIdx]; s[bestIdx] = t;   // 整包交換
        }
    }

    cout << fixed << setprecision(2);
    for (int i = 0; i < n; i++)
        cout << s[i].id << ' ' << s[i].name << ' ' << s[i].gpa << '\n';
    return 0;
}
```

**重點**：排序骨架和上週的選擇排序一模一樣，只換兩件事——比較規則換成 `higher()`（抽成函式，排序邏輯才不會被一長串條件式塞爆），交換對象從一個 `int` 換成一整包 `Student`。另外 `a.gpa != b.gpa` 比的是讀進來的原值、沒經過運算所以安全；一般**算出來**的浮點數不要這樣比相等。

</details>

**Q4. 分數類別（Fraction）**
寫一個 `class Fraction`，存分子與分母（private），提供 `set(分子, 分母)`、`print()`（自動約分並處理負號）、`toDouble()`。分母為 0 不是合法分數：`set` 回傳 `false`，主程式印 `invalid` 結束。

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
    bool set(int n, int d) {
        if (d == 0) return false;           // 除以零不能靠改分母混過去，回報失敗
        if (d < 0) { n = -n; d = -d; }      // 負號統一放在分子
        int g = gcd(n, d);                  // d 已保證 >= 1，所以 g 一定 >= 1
        n /= g;
        d /= g;
        num = n;
        den = d;
        return true;
    }
    void print() const { cout << num << '/' << den << '\n'; }
    double toDouble() const { return static_cast<double>(num) / den; }
};

int main() {
    int n, d;
    cin >> n >> d;
    Fraction f;
    if (!f.set(n, d)) {
        cout << "invalid\n";
        return 0;
    }
    f.print();
    cout << fixed << setprecision(3) << f.toDouble() << '\n';
    return 0;
}
```

`-n` 是**一元負號（只有一個運算元）**，意思是「n 的相反數」，跟 `7 - 2` 的減法不同用法。這題把「約分」與「負號正規化」放在 `set()` 裡，外面不管傳什麼進來，物件內部永遠是最簡分數——**這就是封裝的價值**。分母 0 用回傳值回報、由呼叫端決定怎麼辦（10/22 的 `withdraw` 也是這個設計），不要偷偷改成別的值假裝合法。

</details>

**實驗課題型加練**
以下三題的**題型**取自去年（2025）第 6 週實驗課的課堂練習（今年的投影片還沒出，題目可能會換）：巢狀 `struct`（結構裡放結構）、`class` 裡放陣列並自己算統計、還有一題「計算類」把輸入、計算、輸出拆成三個成員函式。題目不是我原創的：練的東西跟去年那幾題一樣，但題目本身、規則、範例資料和解答都是我自己重寫的，不是原題。

**Q5. 兩線段是否平行（巢狀結構）**
定義 `struct Point { int x, y; }` 與 `struct Segment { Point p1, p2; }`（結構的成員本身是另一個結構）。讀入 A、B、C、D 四個點，AB 與 CD 各是一條線段，印出兩條線段的方向向量（終點減起點）與它們的**外積** $x_1 y_2 - y_1 x_2$；外積為 0 就印 `parallel`，否則印 `not parallel`。

```text
輸入：
0 0 2 1
3 3 7 5
輸出：
AB = (2, 1)
CD = (4, 2)
cross = 0
parallel
```

```text
輸入：
0 0 2 1
3 3 1 7
輸出：
AB = (2, 1)
CD = (-2, 4)
cross = 10
not parallel
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

struct Point { int x, y; };
struct Segment { Point p1, p2; };        // 巢狀結構：成員本身也是 struct

Point direction(const Segment& s) {      // 線段的方向向量（終點減起點）
    Point v = { s.p2.x - s.p1.x, s.p2.y - s.p1.y };
    return v;
}

int main() {
    Segment ab, cd;
    cin >> ab.p1.x >> ab.p1.y >> ab.p2.x >> ab.p2.y;
    cin >> cd.p1.x >> cd.p1.y >> cd.p2.x >> cd.p2.y;
    Point u = direction(ab), v = direction(cd);
    cout << "AB = (" << u.x << ", " << u.y << ")\n";
    cout << "CD = (" << v.x << ", " << v.y << ")\n";
    int cross = u.x * v.y - u.y * v.x;
    cout << "cross = " << cross << '\n';
    cout << (cross == 0 ? "parallel" : "not parallel") << '\n';
    return 0;
}
```

巢狀結構的存取就是多寫一層點：`ab.p1.x`。`direction` 接收 `const Segment&`、回傳一個 `Point`，示範結構可以像一般型別一樣進出函式。這題常見的錯是外積寫成 `u.x * v.x + u.y * v.y`——那是內積（判斷垂直用的），不是外積。

</details>

**Q6. 一週步數（陣列成員）**
寫 `class StepLog`，private 有一個長度 7 的整數陣列，存一週七天的步數；public 提供 `set(day, steps)`、`get(day)`、`total()`、`bestDay()`（走最多的那天，同分取最早的）、`lowest()`、`daysReached(goal)`（有幾天達到目標）。讀入七天的步數與一個目標值後，印出總步數、平均、最佳的一天、最低步數、達標天數；**統計要自己用迴圈算，不能呼叫函式庫**。

```text
輸入：
6500 12000 8000 4000 9100 12000 7300
8000
輸出：
total: 58900
average: 8414.29
best day: 2 (12000 steps)
lowest: 4000
days reaching 8000: 4
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

const int DAYS = 7;

class StepLog {
public:
    void set(int day, int steps) { record[day] = steps; }
    int get(int day) const { return record[day]; }
    int total() const {
        int sum = 0;
        for (int i = 0; i < DAYS; i++) sum += record[i];
        return sum;
    }
    int bestDay() const {                    // 走最多的那天（同分取最早的）
        int best = 0;
        for (int i = 1; i < DAYS; i++) if (record[i] > record[best]) best = i;
        return best;
    }
    int lowest() const {
        int low = record[0];
        for (int i = 1; i < DAYS; i++) if (record[i] < low) low = record[i];
        return low;
    }
    int daysReached(int goal) const {        // 有幾天達標
        int count = 0;
        for (int i = 0; i < DAYS; i++) if (record[i] >= goal) count++;
        return count;
    }
private:
    int record[DAYS];
};

int main() {
    StepLog week;
    for (int i = 0; i < DAYS; i++) {
        int s;
        cin >> s;
        week.set(i, s);
    }
    int goal;
    cin >> goal;
    cout << "total: " << week.total() << '\n';
    cout << "average: " << static_cast<double>(week.total()) / DAYS << '\n';
    cout << "best day: " << week.bestDay() + 1 << " (" << week.get(week.bestDay()) << " steps)\n";
    cout << "lowest: " << week.lowest() << '\n';
    cout << "days reaching " << goal << ": " << week.daysReached(goal) << '\n';
    return 0;
}
```

陣列當資料成員時，成員函式可以直接用它，不必再把陣列當參數傳來傳去——這正是「把資料和操作包在一起」的好處。平均要先 `static_cast<double>` 再除，否則整數除法會把 8414.29 截成 8414。`bestDay` 回傳的是**索引**（0 起算），印的時候才加 1 變成「第幾天」；比較時用 `>` 而不是 `>=`，同分才會留住最早的那天。所有不改資料的函式都加 `const`。

</details>

**Q7. 週薪計算**
寫 `class Salary`，private 存一週七天的每日工時；`set()` 讀入七個整數，`calculate()` 算薪水，`show()` 印出結果。計算規則：每天前 8 小時時薪 200；第 9、10 小時時薪乘 1.25；第 11 小時起乘 1.5。輸出要先列出三種時段各累積了幾小時，再印薪水（小數一位）。`main` 固定是：

```cpp
Salary sa;
sa.set();
sa.calculate();
sa.show();
```

```text
輸入： 8 9 10 11 8 0 0
輸出：
regular: 40 h, extra: 5 h, overtime: 1 h
salary: 9550.0
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
using namespace std;

const int DAYS = 7;
const int RATE = 200;      // 基本時薪

class Salary {
public:
    void set() {
        for (int i = 0; i < DAYS; i++) cin >> hours[i];
    }
    void calculate() {
        normal = extra = overtime = 0;
        for (int i = 0; i < DAYS; i++) {
            int h = hours[i];
            if (h > 10) { overtime += h - 10; h = 10; }   // 第 11 小時起
            if (h > 8)  { extra += h - 8; h = 8; }        // 第 9、10 小時
            normal += h;                                  // 前 8 小時
        }
        total = normal * RATE + extra * RATE * 1.25 + overtime * RATE * 1.5;
    }
    void show() const {
        cout << "regular: " << normal << " h, extra: " << extra << " h, overtime: " << overtime << " h\n";
        cout << fixed << setprecision(1);
        cout << "salary: " << total << '\n';
    }
private:
    int hours[DAYS];
    int normal, extra, overtime;   // 三種時段的小時數
    double total;
};

int main() {
    Salary sa;
    sa.set();
    sa.calculate();
    sa.show();
    return 0;
}
```

「先扣超過 10 的、再扣超過 8 的、剩下是正常時數」由高往低剝，每天三行就分完。時薪、天數這種固定值放在檔案開頭的 `const`，題目換了時薪只改一處。`set`／`calculate`／`show` 三段式是這門課從這週開始一路用到期末的物件寫法：**輸入、計算、輸出分開**，每個函式只做一件事。

</details>

---

[← 10/08｜陣列（Ch 5）](/2026/09/09/nsysu-c-programming/1008-arrays/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [10/22｜類別與建構子（Ch 6–7） →](/2026/09/09/nsysu-c-programming/1022-constructors/)
