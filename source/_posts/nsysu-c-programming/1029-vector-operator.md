---
title: 10/29｜vector 與運算子重載入門（Ch 7）
date: 2026-09-10
updated: 2026-09-12
permalink: 2026/09/09/nsysu-c-programming/1029-vector-operator/
cover: /images/code-cover.jpg
categories: [程式設計]
tags: [C++, 中山大學, 自學指南]
description: 中山大學 C 程式設計自學指南 Ch 7：vector 的用法、vector 當參數與裝物件，以及運算子重載入門（讓自訂型別也能用 +），附本週練習題與參考解答。
toc: true
comments: true
hidden: true
---

[← 10/22｜類別與建構子（Ch 6–7）](/2026/09/09/nsysu-c-programming/1022-constructors/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [11/05｜期中上機考（範圍 Ch 1–6） →](/2026/09/09/nsysu-c-programming/1105-midterm/)

**這週要會什麼**

```text
vector 基本操作 → vector 傳參 → vector 裝物件 → 運算子重載的概念
```

## `vector`：會自己長大的陣列

陣列最麻煩的地方是「大小要先決定好」。`vector` 解決了這件事：

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> v;              // 空的，長度 0
    v.push_back(3);             // 從尾端加入
    v.push_back(1);
    v.push_back(4);

    cout << v[0] << '\n';       // 3
    cout << v.size() << '\n';   // 3（目前有幾個元素）

    for (size_t i = 0; i < v.size(); i++) cout << v[i] << ' ';
    cout << '\n';
    for (int x : v) cout << x << ' ';        // range-based for
    cout << '\n';
    return 0;
}
```

輸出：

```text
3
3
3 1 4 
3 1 4 
```

迴圈變數宣告成 `size_t`，因為 `v.size()` 回傳的就是 `size_t`——一種不能存負數的整數型別，混用 `int` 會出兩種問題，見雷區①。

`vector<int>` 讀作「裝 int 的 vector」，角括號裡換成別的型別就能裝別的東西：`vector<double>`、`vector<string>`、`vector<Student>`。

**常用成員函式**（上機考只能用文字編輯器，這幾個要背起來）：

| 用法 | 作用 |
| --- | --- |
| `v.push_back(x)` | 尾端加入一個元素 |
| `v.pop_back()` | 移除最後一個元素（**空的時候不能呼叫**，是未定義行為，先用 `empty()` 檢查） |
| `v.size()` | 目前元素個數 |
| `v.empty()` | 是否為空 |
| `v.clear()` | 清空 |
| `v[i]` | 存取第 i 個（**不檢查範圍**） |
| `v.at(i)` | 存取第 i 個（**超出範圍會丟例外**，沒接住例外時程式當場中止，見雷區②） |
| `v.front()` / `v.back()` | 第一個 / 最後一個元素（同樣要求非空） |
| `v.resize(n)` | 改成 n 個元素（變多的補預設值：數值補 0、`string` 補空字串；變少的砍掉） |
| `v.erase(v.begin() + i)` | 刪掉第 i 個元素，後面的往前遞補 |

`v.begin()` 回傳一個叫**迭代器**（iterator）的東西，可以先想成「夾在第 0 格上的書籤」，`v.begin() + i` 就是把書籤往後移到第 i 格。它**不是整數**，不能 `cout` 出來、也不能存進 `int`；這學期只需要會 `v.erase(v.begin() + i)` 這一招。

**建立時就給內容**：

```cpp
vector<int> a(5);            // 五個 0
vector<int> b(5, -1);        // 五個 -1
vector<int> c = {1, 2, 3};   // C++11 直接列出來
vector<vector<int>> grid(3, vector<int>(4, 0));   // 3 個元素、每個都是「4 個 0 的 vector」→ 3 列 4 行
```

二維就是「vector 裡面裝 vector」：`grid` 是 3 列 4 行、全 0，用 `grid[i][j]` 存取，`grid.size()` 是列數、`grid[0].size()` 是行數。規則跟 `b(5, -1)` 一樣（個數 + 每一格的初值），只是初值換成 `vector<int>(4, 0)`——**當場做出一個「4 個 0 的 vector」當初值，沒有取名字**。

> **雷區 ①：`size()` 的型別是 `size_t`（無號整數）**
> ```cpp
> for (int i = 0; i < v.size(); i++)     // warning: comparison of integer expressions of different signedness
> ```
> `-Wall -Wextra` 會警告——**上機考有警告就扣 2 分**。解法二選一：把迴圈變數宣告成 `size_t i`，或寫 `int n = v.size();` 之後用 `i < n`。
>
> 更嚴重的是這種寫法：
> ```cpp
> for (size_t i = 0; i <= v.size() - 1; i++)   // v 為空時 v.size()-1 會變成超大的數字！
> ```
> 無號整數沒有位置存負數，減過頭會從最大值繞回來（像時鐘從 0 點往回撥一格變成 23 點）。所以空 vector 時 `v.size() - 1` 是天文數字，迴圈條件等於永遠成立。不過你實際看到的通常不是「跑不完」而是**當場閃退**——第一圈的 `v[0]` 就已經越界了（實測：迴圈體是空的才會真的無限跑；只要裡面有 `v[i]`，馬上 `Segmentation fault (core dumped)`）。所以「卡住」和「莫名閃退」都要回頭檢查有沒有對 `size()` 做減法。

> **雷區 ②：`v[i]` 不會幫你檢查範圍**
> ```cpp
> vector<int> v;        // size = 0
> v[0] = 5;             // 未定義行為，不一定當掉，但一定是錯的
> ```
> 要加元素**只能用 `push_back`** 或先 `resize`。除錯時把 `v[0]` 改成 `v.at(0)`，程式會**當場中止**並印出：
> ```text
> terminate called after throwing an instance of 'std::out_of_range'
>   what():  vector::_M_range_check: __n (which is 0) >= this->size() (which is 0)
> ```
> 這叫「丟例外（exception）」，怎麼接住不在本學期範圍；重點是 `v[i]` 越界**不保證會出事**——可能讀到垃圾值、可能默默踩壞別的變數、也可能直接當掉，而 `v.at(i)` 一定會讓程式停在出錯的那一刻。

## `vector` 當參數、`vector` 裝物件

```cpp
#include <iostream>
#include <vector>
using namespace std;

double average(const vector<int>& v) {          // 唯讀 → const 參考
    if (v.empty()) return 0;
    double sum = 0;
    for (int x : v) sum += x;
    return sum / v.size();
}

void doubleAll(vector<int>& v) {                // 要修改 → 一般參考
    for (int& x : v) x *= 2;                    // 寫 int& 才改得到原元素
}

int main() {
    vector<int> a = {1, 2, 3};
    vector<int> b = a;                          // 整包複製一份（陣列做不到）
    b[0] = 99;
    cout << a[0] << ' ' << b[0] << '\n';

    cout << average(a) << '\n';
    doubleAll(a);
    for (int x : a) cout << x << ' ';
    cout << '\n';
    return 0;
}
```

輸出：

```text
1 99
2
2 4 6 
```

兩個重點：

- `vector` 是「一個完整的值」：`b = a` 會整包複製，函式也能直接 `return` 一個區域 `vector`——這跟 10/08 說的「不能回傳區域陣列」剛好相反。
- 傳參數的差別：

| 參數寫法 | 複製與否 | 要不要傳長度 |
| --- | --- | --- |
| 陣列 `int a[]` | 傳第一格位址，一定不複製 | 一定要另外傳 `n` |
| `vector<int>&`、`const vector<int>&` | 加 `&` 不複製；忘了 `&` 整包複製（元素多會很慢） | 不用，函式裡 `v.size()` 自己知道 |

也因為 `vector` 自己記得長度，10/08 那條「函式裡不能對陣列參數用 range-based for」**對 `vector` 不適用**——`vector` 參數照樣可以寫 `for (int x : v)`。

**`vector` 裝物件**：元素是 `struct` 或 `class` 都可以。

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

struct Student { string name; double gpa; };

int main() {
    vector<Student> s;
    s.push_back({"Ann", 3.8});
    s.push_back({"Bob", 4.0});
    for (const Student& st : s) cout << st.name << ' ' << st.gpa << '\n';
    return 0;
}
```

輸出：

```text
Ann 3.8
Bob 4
```

（`4.0` 印成 `4` 是正常的，`cout` 預設不印多餘的小數位。）

`push_back({"Ann", 3.8})` 裡的 `{...}` 會依照 `Student` 的**成員宣告順序**（`name`、`gpa`）做出一個暫時的 `Student` 再塞進去——規則跟 10/15 的 `Student t = {...}` 一模一樣，只是這次不先取名字、直接當引數用。用 range-based for 讀物件時寫 `const Student&`，同樣是為了不要每圈複製一個物件。

## 運算子重載：讓自訂型別也能用 `+`

其實你早就在用運算子重載了——`v[i]` 能用在 vector 上、兩個 `string` 能直接用 `==` 比內容（見本篇 Q4），都是標準函式庫替它們定義好的。現在換你替自己的類別做同一件事。

假設有個二維向量類別 `Vec2`。如果只提供 `Vec2 add(const Vec2& a, const Vec2& b)`，那 `a + b + c` 就得寫成 `add(add(a, b), c)`，項數愈多括號疊愈深。C++ 允許你**定義 `+` 對自訂型別的意義**，就能直接寫成 `a + b + c`，這叫**運算子重載（operator overloading）**：

```cpp
#include <iostream>
using namespace std;

class Vec2 {
public:
    double x, y;
    Vec2(double nx = 0, double ny = 0) : x(nx), y(ny) { }

    Vec2 operator+(const Vec2& other) const {   // a + b → a.operator+(b)
        return Vec2(x + other.x, y + other.y);
    }
};

int main() {
    Vec2 a(1, 2), b(3, 4);
    Vec2 c = a + b;                     // 實際上是呼叫 a.operator+(b)
    cout << c.x << ' ' << c.y << '\n';
    return 0;
}
```

輸出：

```text
4 6
```

> **`Vec2(x + other.x, y + other.y)` 是在宣告哪個變數？** 都不是。這是**直接呼叫建構子做出一個沒有名字的 `Vec2`**，做好就馬上當回傳值交出去。跟 `Vec2 c(1, 2);` 的差別只有一個：那個有名字、能重複使用，這個沒名字、用完就消失（前面的 `vector<int>(4, 0)` 也是同一回事）。
>
> 另外初始化列表這裡寫成 `: x(nx), y(ny)`，也可以讓參數跟成員同名寫成 `: x(x), y(y)`——括號**外**是成員、括號**裡**是參數，只是比較容易看花眼。

`a + b` 編譯器會翻成 `a.operator+(b)`：左邊的運算元就是物件自己，所以成員版只要一個參數。參數寫 `const Vec2&` 表示不複製、也不改右邊；函式尾巴的 `const`（10/15 教過）表示不改左邊；回傳的是**新做出來的** `Vec2`——`a`、`b` 都不會變，就像 `1 + 2` 不會改到 1 和 2。

這裡先記住三件事：

1. 函式名字就是 `operator` 加上那個符號：`operator+`、`operator-`、`operator==`。
2. **不能發明新符號**（沒有 `operator**`），也不能改變運算元個數與優先順序。
3. 重載的意義應該符合直覺。把 `+` 定義成減法，語法上合法，但沒有人看得懂你的程式。

> **也可以寫成非成員函式**：把 `Vec2 operator+(const Vec2& a, const Vec2& b)` 放在類別外面，兩個參數分別是左右運算元。但它看不到 `private` 成員（本例的 `x`、`y` 是 `public` 才看得到，`private` 要靠下週的 `friend`），而且**不能跟成員版同時定義**——`a + b` 會變成 ambiguous，g++ 丟 `warning: ISO C++ says that these are ambiguous`，又是 2 分。**這週一律用成員函式版**，非成員版留到下週講 `friend` 與 `k * v`（數字在左邊）時再用。

## 本週重點回顧

- `vector` 是會自己長大的陣列：`push_back` 加、`size()` 問長度、`empty()` 判空，記得 `#include <vector>`。
- `v.size()` 是無號的 `size_t`、`v[i]` 不檢查範圍——迴圈變數宣告成 `size_t`（或先 `int n = v.size();`），條件寫成 `i < v.size()`、`i + 1 < v.size()`，**永遠不要對 `v.size()` 做減法**。
- 傳參數：只讀用 `const vector<int>&`、要改用 `vector<int>&`，忘了 `&` 就整包複製；但 `vector` 可以整包指派，也可以當回傳值。
- **運算子重載**＝定義 `+`、`==` 這些符號對自訂型別的意義，函式名字就是 `operator` 加那個符號；不能發明新符號，也不能改變運算元個數與優先順序。

## 本週練習題

**Q1. 去重排序**
讀入 `n` 與 `n` 個整數，存進 `vector<int>`，輸出**去除重複後由小到大**的結果。

```text
輸入：
7
5 3 5 1 3 9 1
輸出： 1 3 5 9
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> v;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        bool found = false;
        for (int y : v) if (y == x) { found = true; break; }
        if (!found) v.push_back(x);          // 沒出現過才收進來
    }

    for (size_t i = 0; i + 1 < v.size(); i++) {       // 選擇排序，同 10/08
        size_t minIdx = i;
        for (size_t j = i + 1; j < v.size(); j++)
            if (v[j] < v[minIdx]) minIdx = j;
        int t = v[i]; v[i] = v[minIdx]; v[minIdx] = t;
    }

    for (size_t i = 0; i < v.size(); i++)
        cout << v[i] << (i + 1 == v.size() ? '\n' : ' ');
    return 0;
}
```

（條件寫 `i + 1 < v.size()` 而不是 `i < v.size() - 1`，理由見雷區①。）

</details>

**Q2. 成績統計類別**
寫 `class ScoreBoard`，內部用 `vector<double>` 存分數，提供 `add(double)`、`size()`、`average()`、`highest()`、`lowest()`。空的時候平均回傳 0。`main` 讀入 `n` 與 `n` 個分數（0–100），照下面格式印出四行，其中平均、最高、最低都**固定兩位小數**（`fixed << setprecision(2)`）。

```text
輸入：
5
88 92 75 100 63
輸出：
count = 5
avg = 83.60
max = 100.00
min = 63.00
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
#include <vector>
using namespace std;

class ScoreBoard {
private:
    vector<double> scores;

public:
    void add(double s) { scores.push_back(s); }
    size_t size() const { return scores.size(); }

    double average() const {
        if (scores.empty()) return 0;
        double sum = 0;
        for (double s : scores) sum += s;
        return sum / scores.size();
    }
    double highest() const {
        if (scores.empty()) return 0;
        double best = scores[0];
        for (double s : scores) if (s > best) best = s;
        return best;
    }
    double lowest() const {
        if (scores.empty()) return 0;
        double worst = scores[0];
        for (double s : scores) if (s < worst) worst = s;
        return worst;
    }
};

int main() {
    int n;
    cin >> n;
    ScoreBoard sb;
    for (int i = 0; i < n; i++) { double s; cin >> s; sb.add(s); }

    cout << "count = " << sb.size() << '\n';
    cout << fixed << setprecision(2);
    cout << "avg = " << sb.average() << '\n';
    cout << "max = " << sb.highest() << '\n';
    cout << "min = " << sb.lowest() << '\n';
    return 0;
}
```

</details>

**Q3. Vec2 的四則運算**
幫 `Vec2` 加上 `+`、`-`、純量乘法（`v * k`）、`==`。讀入五個數 `ax ay bx by k`，組成 `a = (ax, ay)`、`b = (bx, by)`，依序各印一行：`a + b`、`a - b`、`a * k`（格式都是 `(x, y)`），最後一行印 `a == b` 的結果——相等印 `equal`，否則印 `not equal`。

```text
輸入： 1 2 3 4 2
輸出：
(4, 6)
(-2, -2)
(2, 4)
not equal
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

class Vec2 {
public:
    double x, y;
    Vec2(double nx = 0, double ny = 0) : x(nx), y(ny) { }

    Vec2 operator+(const Vec2& o) const { return Vec2(x + o.x, y + o.y); }
    Vec2 operator-(const Vec2& o) const { return Vec2(x - o.x, y - o.y); }
    Vec2 operator*(double k)      const { return Vec2(x * k, y * k); }
    bool operator==(const Vec2& o) const { return x == o.x && y == o.y; }

    void print() const { cout << '(' << x << ", " << y << ")\n"; }
};

int main() {
    double ax, ay, bx, by, k;
    cin >> ax >> ay >> bx >> by >> k;
    Vec2 a(ax, ay), b(bx, by);

    (a + b).print();
    (a - b).print();
    (a * k).print();
    cout << (a == b ? "equal" : "not equal") << '\n';
    return 0;
}
```

`(a + b).print();` 是對那個**沒有名字的暫時 `Vec2`** 直接呼叫成員函式，等同於 `Vec2 t = a + b; t.print();` 兩行。

`operator==` 這裡為了簡潔直接比 `double`；實務上浮點數要寫成 `fabs(x - o.x) < 1e-9 && fabs(y - o.y) < 1e-9`（`#include <cmath>`），理由是 09/24 講過的精度誤差。（`1e-9` 是**科學記號**寫法：1 乘以 10 的 -9 次方 = 0.000000001，`1e6` 就是 1000000。）

**補充**：`a * k` 可以用成員函式，但 `k * a`（數字在左邊）**只能**寫成非成員函式，因為你不能修改 `double` 這個內建型別——寫法見 [11/12](/2026/09/09/nsysu-c-programming/1112-operator-string/)。

</details>

**Q4. 動態名單**
用 `vector<string>` 做一個名單，支援指令：`ADD 名字`、`DEL 名字`、`LIST`、`END`。`DEL` 不存在的名字要印 `not found`。

```text
輸入：
ADD Ann
ADD Bob
DEL Cat
LIST
END
輸出：
not found
Ann
Bob
```

> 提示：刪掉中間某一個元素用 `v.erase(v.begin() + i)`。
>
> 要一直讀到輸入結束，可以把 `cin >> cmd` 直接**當條件**用：它讀完會回傳 `cin` 自己，當條件時代表「**這次讀成功了嗎**」，讀到輸入結束（終端機按 <kbd>Ctrl</kbd>+<kbd>D</kbd>）或型別不合就是 `false`。`>>` 比 `&&` 先算，所以 `while (cin >> cmd && cmd != "END")` 等於 `while ((cin >> cmd) && (cmd != "END"))`。

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

int main() {
    vector<string> names;
    string cmd;
    while (cin >> cmd && cmd != "END") {
        if (cmd == "ADD") {
            string name;
            cin >> name;
            names.push_back(name);
        } else if (cmd == "DEL") {
            string name;
            cin >> name;
            bool removed = false;
            for (size_t i = 0; i < names.size(); i++) {
                if (names[i] == name) {
                    names.erase(names.begin() + i);   // 用迭代器指定位置
                    removed = true;
                    break;
                }
            }
            if (!removed) cout << "not found\n";
        } else if (cmd == "LIST") {
            for (const string& s : names) cout << s << '\n';
        }
    }
    return 0;
}
```

`string` 可以直接用 `==`、`!=` 比**內容**（`<`、`>` 是字典序）——這也是標準函式庫幫你重載好的運算子。

</details>

**實驗課題型加練**
以下照實驗課歷年課堂練習的題型改寫。這週實驗課的固定組合是「`vector` 裝 `struct` 做一個選單程式」與「幫 `Date` 類別重載比較運算子和 `+`」。

**Q5. 日記本（`vector` + 選單）**
定義 `struct Diary { int year, month, day; string note; }`，用 `vector<Diary>` 存日記。反覆讀入指令：`1` 寫日記（讀日期與一整行內容）、`2` 讀日期並顯示那天的內容、`3` 讀日期並刪除、`4` 列出所有日記的日期與筆數，`0` 結束。日期不合法要重新輸入。

日記內容含空白，要用 `getline(cin, note)` 讀**一整行**；但 `cin >> d` 讀完日期後，那行結尾的換行還留在輸入裡，直接 `getline` 會讀到空字串，所以中間要先 `cin.ignore();` 把那個換行丟掉。（這個坑 11/12 會完整解釋，這裡先照抄。）

```text
輸入：
1
2026 9 10 first C++ class
1
2026 2 30
2026 9 17 learned cin and cout
4
2
2026 9 17
3
2026 9 10
4
0
輸出：
saved
invalid date, again
saved
2026/9/10
2026/9/17
(2 entries)
learned cin and cout
deleted
2026/9/17
(1 entries)
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <string>
#include <vector>
using namespace std;

struct Diary { int year, month, day; string note; };

bool validDate(int y, int m, int d) {
    if (y < 1 || m < 1 || m > 12 || d < 1) return false;
    int days[] = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
    if ((y % 4 == 0 && y % 100 != 0) || y % 400 == 0) days[1] = 29;
    return d <= days[m - 1];
}

// 一直讀到合法日期為止
void readDate(int& y, int& m, int& d) {
    while (true) {
        cin >> y >> m >> d;
        if (validDate(y, m, d)) return;
        cout << "invalid date, again\n";
    }
}

int find(const vector<Diary>& v, int y, int m, int d) {   // 找不到回傳 -1
    for (size_t i = 0; i < v.size(); i++)
        if (v[i].year == y && v[i].month == m && v[i].day == d) return i;
    return -1;
}

int main() {
    vector<Diary> diary;
    int cmd;
    while (cin >> cmd && cmd != 0) {
        int y, m, d;
        if (cmd == 1) {
            readDate(y, m, d);
            Diary e = { y, m, d, "" };
            cin.ignore();                 // 丟掉日期後面那個換行，getline 才不會讀到空行
            getline(cin, e.note);         // 讀一整行（可含空白）當日記內容
            diary.push_back(e);
            cout << "saved\n";
        } else if (cmd == 2) {
            readDate(y, m, d);
            int i = find(diary, y, m, d);
            if (i == -1) cout << "no entry\n";
            else         cout << diary[i].note << '\n';
        } else if (cmd == 3) {
            readDate(y, m, d);
            int i = find(diary, y, m, d);
            if (i == -1) cout << "no entry\n";
            else { diary.erase(diary.begin() + i); cout << "deleted\n"; }
        } else if (cmd == 4) {
            for (const Diary& e : diary)
                cout << e.year << '/' << e.month << '/' << e.day << '\n';
            cout << "(" << diary.size() << " entries)\n";
        }
    }
    return 0;
}
```

三個可以重複用的零件：`validDate` 判斷合法、`readDate` 用參考參數「一直讀到合法為止」、`find` 回傳索引（找不到 `-1`）。指令 2 和 3 都先 `find` 再決定，刪除用 `erase(begin() + i)`。選單程式的骨架就是 `while (cin >> cmd && cmd != 0)` 包一串 `if / else if`，期末上機考的大題也是這個形狀。

</details>

**Q6. `vector` 排序與刪除**
讀入數量與數字存進 `vector<int>`，用選擇排序排好，每次**交換**後印一次；接著反覆讀入要刪除的數字（只刪第一個相同的，找不到印 `not found`），讀到 `-1` 停；最後印剩下的數字與 `size()`。

```text
輸入：
5
7 -2 7 4 1
7
99
-2
-1
輸出：
round 1: -2 7 7 4 1
round 2: -2 1 7 4 7
round 3: -2 1 4 7 7
99 not found
remaining: 1 4 7
size: 3
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <vector>
using namespace std;

void print(const vector<int>& v) {
    for (size_t i = 0; i < v.size(); i++) cout << v[i] << (i + 1 < v.size() ? " " : "\n");
}

int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (int i = 0; i < n; i++) cin >> v[i];

    for (int i = 0; i + 1 < n; i++) {               // 選擇排序
        int minIdx = i;
        for (int j = i + 1; j < n; j++)
            if (v[j] < v[minIdx]) minIdx = j;
        if (minIdx != i) {
            int t = v[i]; v[i] = v[minIdx]; v[minIdx] = t;
            cout << "round " << i + 1 << ": ";
            print(v);
        }
    }

    int x;
    while (cin >> x && x != -1) {                    // 要刪的數字，-1 停
        bool found = false;
        for (size_t i = 0; i < v.size(); i++) {
            if (v[i] == x) {
                v.erase(v.begin() + i);               // 只刪第一個相同的
                found = true;
                break;
            }
        }
        if (!found) cout << x << " not found\n";
    }
    cout << "remaining: ";
    print(v);
    cout << "size: " << v.size() << '\n';
    return 0;
}
```

跟 10/08 的 Q9 幾乎一樣，差別只在容器換成 `vector`、索引型別用 `size_t`、刪除用 `erase`。`erase` 之後後面的元素會往前補，所以 `break` 掉不要繼續掃——不然 `i` 會跳過補上來的那一個。

</details>

**Q7. 日期的 `<`、`>`、`==`**
`class Date` 的年月日是 private。用**非成員函式**重載 `<`、`>`、`==`（參數都是 `const Date&`），需要的話宣告成 `friend`。讀入三個日期，印出前兩組的比較結果，並找出最早的一天。

```text
輸入：
2026 9 10
2026 9 10
2025 12 25
輸出：
2026/9/10 == 2026/9/10
2026/9/10 > 2025/12/25
earliest: 2025/12/25
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

class Date {
public:
    Date(int y, int m, int d) : year(y), month(m), day(d) {}
    void print() const { cout << year << '/' << month << '/' << day; }
    friend bool operator<(const Date& a, const Date& b);
    friend bool operator==(const Date& a, const Date& b);
private:
    int year, month, day;
};

bool operator<(const Date& a, const Date& b) {
    if (a.year != b.year)   return a.year < b.year;
    if (a.month != b.month) return a.month < b.month;
    return a.day < b.day;
}
bool operator==(const Date& a, const Date& b) {
    return a.year == b.year && a.month == b.month && a.day == b.day;
}
bool operator>(const Date& a, const Date& b) { return b < a; }   // 反過來問就好，不用 friend

int main() {
    int y, m, d;
    cin >> y >> m >> d; Date a(y, m, d);
    cin >> y >> m >> d; Date b(y, m, d);
    cin >> y >> m >> d; Date c(y, m, d);
    a.print(); cout << (a < b ? " < " : a == b ? " == " : " > "); b.print(); cout << '\n';
    b.print(); cout << (b < c ? " < " : b == c ? " == " : " > "); c.print(); cout << '\n';

    Date earliest = a;                       // 找最早的一天
    if (b < earliest) earliest = b;
    if (c < earliest) earliest = c;
    cout << "earliest: "; earliest.print(); cout << '\n';
    return 0;
}
```

只有 `<` 和 `==` 真的需要碰 private 成員，所以只有它們是 `friend`；`>` 直接寫成 `b < a`，一行搞定又不用開後門。比較日期是「先比年、年相同比月、月相同比日」，這個「逐欄比較」的寫法字串、版本號都適用。

</details>

**Q8. 日期加天數（重載 `+`）**
承 Q7，用**成員函式**重載 `+`：`today + n` 回傳 `n` 天後的日期，原物件不變，要正確處理月底、年底與閏年。讀入的日期不合法要重新輸入。

```text
輸入：
2024 2 30
2024 2 27
5
輸出：
invalid date, again
2024/2/27 + 5 days = 2024/3/3
```

```text
輸入：
2026 12 25
10
輸出： 2026/12/25 + 10 days = 2027/1/4
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

class Date {
public:
    Date(int y, int m, int d) : year(y), month(m), day(d) {}
    bool isValid() const {
        return month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth(year, month);
    }
    Date operator+(int days) const {          // 回傳新日期，自己不變
        Date r(year, month, day);          // 從自己複製一份出來改
        for (int i = 0; i < days; i++) {      // 一天一天往後推
            r.day++;
            if (r.day > daysInMonth(r.year, r.month)) {
                r.day = 1;
                r.month++;
                if (r.month > 12) { r.month = 1; r.year++; }
            }
        }
        return r;
    }
    void print() const { cout << year << '/' << month << '/' << day; }
private:
    int year, month, day;
    static int daysInMonth(int y, int m) {
        int days[] = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
        bool leap = (y % 4 == 0 && y % 100 != 0) || y % 400 == 0;
        return (m == 2 && leap) ? 29 : days[m - 1];
    }
};

int main() {
    int y, m, d;
    while (true) {
        cin >> y >> m >> d;
        if (Date(y, m, d).isValid()) break;
        cout << "invalid date, again\n";
    }
    Date today(y, m, d);
    int n;
    cin >> n;
    Date later = today + n;
    today.print(); cout << " + " << n << " days = "; later.print(); cout << '\n';
    return 0;
}
```

`operator+` 是 `const` 成員：從自己複製一份 `r`，改的是 `r`，最後回傳它——這就是「`a + b` 不該改 `a`」的意思。一天一天往後推雖然慢，但月底、年底、閏年三種進位都由同一段程式處理，不容易寫錯；`daysInMonth` 做成 private 的 `static` 函式，因為它不需要任何物件的資料。

</details>

---

[← 10/22｜類別與建構子（Ch 6–7）](/2026/09/09/nsysu-c-programming/1022-constructors/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [11/05｜期中上機考（範圍 Ch 1–6） →](/2026/09/09/nsysu-c-programming/1105-midterm/)
