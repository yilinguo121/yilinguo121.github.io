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

> 對應課本習題：Ch7: 1, 5, 6, 8, 11（課綱在 11/05 那週才發，但內容就是 10/22、10/29 教的）

<details>
<summary><b>這幾題各要用到什麼（動手前先看）</b></summary>

主課的上機考幾乎就是這些題目，所以每一題都自己寫過。下表是每題需要的東西（我的歸納，不是題目本文）與本系列對應的練習：

| 課本題號 | 要用到的東西 | 先練 |
| --- | --- | --- |
| Ch7-1 | 顏色類別：預設／字元／整數三個建構子、輸入輸出函式、回傳「下一個顏色」的物件 | 10/22 Q1、Q3 |
| Ch7-5 | 繞圈淘汰到剩最後一個——`vector` + `erase`，索引繞圈用 `%` | Q6、12/24 Q2 |
| Ch7-6 | 訂單類別內含 `vector<Pizza>`：加披薩、印全部與總價——類別裡包 vector | Q2 |
| Ch7-8 | 讀分數進 vector 直到 -1，找最大值後畫直方圖 | Q4、10/08 Q4 |
| Ch7-11 | 玩家類別（姓名、分數）＋建構子，vector 存十位並排序 | Q2、10/15 Q3 |

</details>

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
以下三題的**題型**取自去年（2025）第 8 週實驗課的課堂練習（今年的投影片還沒出，題目可能會換）：`vector` 裝 `struct` 做一個選單程式、`vector` 排序與刪除、還有幫自訂類別重載 `+`（成員函式版這週就能寫；`<`、`==` 那種要寫成非成員函式的，需要下週的 `friend`，放在 11/12 的練習）。題目不是我原創的：練的東西跟去年那幾題一樣，但題目本身、規則、範例資料和解答都是我自己重寫的，不是原題。

**Q5. 待辦清單（`vector` + 選單）**
定義 `struct Task { int priority; string title; bool done; }`，用 `vector<Task>` 存待辦事項。反覆讀入指令：`1 優先度 事項名稱` 新增（優先度要在 1–5，否則印 `priority must be 1-5` 且不新增）、`2 事項名稱` 標記完成、`3 事項名稱` 刪除、`4` 列出全部（完成的前面印 `[x]`、沒完成的印 `[ ]`）與筆數，`0` 結束。事項名稱可以含空白、一路到行尾；找不到名稱印 `no such task`。

事項名稱含空白，要用 `getline(cin, title)` 讀**到行尾**；但 `cin >> p` 讀完優先度後，它後面那個空白還留在輸入裡，直接 `getline` 會把那個空白也讀進名稱開頭，所以中間要先 `cin.ignore();` 把它丟掉。（這個坑 11/12 會完整解釋，這裡先照抄。）

```text
輸入：
1 3 buy milk
1 9 write report
1 1 write report
4
2 buy milk
3 call mom
4
0
輸出：
added
priority must be 1-5
added
[ ] P3 buy milk
[ ] P1 write report
(2 tasks)
done: buy milk
no such task
[x] P3 buy milk
[ ] P1 write report
(2 tasks)
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <string>
#include <vector>
using namespace std;

struct Task { int priority; string title; bool done; };

int find(const vector<Task>& v, const string& title) {     // 找不到回傳 -1
    for (size_t i = 0; i < v.size(); i++)
        if (v[i].title == title) return i;
    return -1;
}

int main() {
    vector<Task> todo;
    int cmd;
    while (cin >> cmd && cmd != 0) {
        string title;
        if (cmd == 1) {
            int p;
            cin >> p;
            cin.ignore();                 // 丟掉優先度後面那一個空白，getline 才不會多讀
            getline(cin, title);          // 讀一整行（可含空白）當事項名稱
            if (p < 1 || p > 5) {
                cout << "priority must be 1-5\n";
                continue;                 // 這筆不加
            }
            Task t = { p, title, false };
            todo.push_back(t);
            cout << "added\n";
        } else if (cmd == 2) {
            cin.ignore();
            getline(cin, title);
            int i = find(todo, title);
            if (i == -1) cout << "no such task\n";
            else { todo[i].done = true; cout << "done: " << title << '\n'; }
        } else if (cmd == 3) {
            cin.ignore();
            getline(cin, title);
            int i = find(todo, title);
            if (i == -1) cout << "no such task\n";
            else { todo.erase(todo.begin() + i); cout << "deleted\n"; }
        } else if (cmd == 4) {
            for (const Task& t : todo)
                cout << (t.done ? "[x] " : "[ ] ") << 'P' << t.priority << ' ' << t.title << '\n';
            cout << "(" << todo.size() << " tasks)\n";
        }
    }
    return 0;
}
```

兩個可以重複用的零件：`find` 依名稱回傳索引（找不到 `-1`），指令 2 和 3 都先 `find` 再決定；刪除用 `erase(begin() + i)`。優先度不合法時名稱還是要先讀掉（不然那些字會留在輸入裡變成下一個指令），再 `continue` 跳過新增。選單程式的骨架就是 `while (cin >> cmd && cmd != 0)` 包一串 `if / else if`，期末上機考的大題也是這個形狀。

</details>

**Q6. `vector` 排序與刪除**
反覆讀入整數存進 `vector<int>`，讀到 `0` 為止（不先給數量）。用選擇排序排成**由大到小**，每次**交換**後印一次；接著讀入一個門檻值，把所有小於門檻的數字刪掉；最後印剩下的數字與 `size()`。

```text
輸入：
7 -2 7 4 1 0
4
輸出：
swap 1 <-> 2: 7 7 -2 4 1
swap 2 <-> 3: 7 7 4 -2 1
swap 3 <-> 4: 7 7 4 1 -2
kept (>= 4): 7 7 4
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
    vector<int> v;
    int x;
    while (cin >> x && x != 0) v.push_back(x);       // 讀到 0 為止，不用先給數量

    int n = v.size();
    for (int i = 0; i + 1 < n; i++) {                 // 選擇排序，由大到小
        int maxIdx = i;
        for (int j = i + 1; j < n; j++)
            if (v[j] > v[maxIdx]) maxIdx = j;
        if (maxIdx != i) {
            int t = v[i]; v[i] = v[maxIdx]; v[maxIdx] = t;
            cout << "swap " << i << " <-> " << maxIdx << ": ";
            print(v);
        }
    }

    int limit;
    cin >> limit;
    size_t i = 0;
    while (i < v.size()) {
        if (v[i] < limit) v.erase(v.begin() + i);     // 刪掉之後 i 不動，後面的會補上來
        else i++;
    }
    cout << "kept (>= " << limit << "): ";
    print(v);
    cout << "size: " << v.size() << '\n';
    return 0;
}
```

跟 10/08 的 Q9 幾乎一樣，差別只在容器換成 `vector`（所以不用先知道數量，`push_back` 會自己長大）、索引型別用 `size_t`、刪除用 `erase`。刪除那段故意用 `while` 而不是 `for`：`erase` 之後後面的元素會往前補到同一個位置，所以**刪掉時 `i` 不能加**，不然會跳過補上來的那一個。

</details>

**Q7. 時間加分鐘（重載 `+`）**
寫 `class Time`（時、分 private，24 小時制），用**成員函式**重載 `+`：`now + n` 回傳 `n` 分鐘後的時間，原物件不變；跨過午夜要繞回 `00:00`，並記下跨了幾天。讀入的時間不合法（時不在 0–23 或分不在 0–59）要重新輸入。時、分都印成兩位。

```text
輸入：
23 50
25
輸出： 23:50 + 25 min = 00:15 (+1 day)
```

```text
輸入：
25 0
9 5
130
輸出：
invalid time, again
09:05 + 130 min = 11:15
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
using namespace std;

class Time {
public:
    Time(int h, int m) : hour(h), minute(m), days(0) {}
    bool isValid() const {
        return hour >= 0 && hour < 24 && minute >= 0 && minute < 60;
    }
    Time operator+(int minutes) const {         // 回傳新時間，自己不變
        int total = hour * 60 + minute + minutes;   // 先全部換成「從 0:00 起算幾分鐘」
        Time r(total / 60 % 24, total % 60);
        r.days = total / (24 * 60);             // 跨了幾個午夜
        return r;
    }
    int dayOffset() const { return days; }
    void print() const {
        cout << setfill('0') << setw(2) << hour << ':' << setw(2) << minute;
    }
private:
    int hour, minute;
    int days;                                   // 這個時間是幾天後的
};

int main() {
    int h, m;
    while (true) {
        cin >> h >> m;
        if (Time(h, m).isValid()) break;
        cout << "invalid time, again\n";
    }
    Time now(h, m);
    int n;
    cin >> n;
    Time later = now + n;
    now.print(); cout << " + " << n << " min = "; later.print();
    if (later.dayOffset() == 1) cout << " (+1 day)";
    else if (later.dayOffset() > 1) cout << " (+" << later.dayOffset() << " days)";
    cout << '\n';
    return 0;
}
```

`operator+` 是 `const` 成員：把自己換算成「從 0:00 起算的總分鐘數」、加上 `n`，再拆回時、分做成一個**新的** `Time` 回傳——這就是「`a + b` 不該改 `a`」的意思。`total / 60 % 24` 先算出總小時數再對 24 取餘就是繞回午夜；`total / (24 * 60)` 是跨了幾天。輸入 `8 0` 與 `3000` 會印 `08:00 + 3000 min = 10:00 (+2 days)`，可以拿來驗算。

</details>

---

[← 10/22｜類別與建構子（Ch 6–7）](/2026/09/09/nsysu-c-programming/1022-constructors/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [11/05｜期中上機考（範圍 Ch 1–6） →](/2026/09/09/nsysu-c-programming/1105-midterm/)
