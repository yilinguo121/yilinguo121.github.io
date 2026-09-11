---
title: 10/29｜vector 與運算子重載入門（Ch 7）
date: 2026-09-10
updated: 2026-09-11
permalink: 2026/09/09/nsysu-c-programming/1029-vector-operator/
cover: /images/code-cover.jpg
categories: [程式設計]
tags: [C++, 中山大學, 自學指南]
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

**常用成員函式**（上機考不能查資料，這幾個要背起來）：

| 用法 | 作用 |
| --- | --- |
| `v.push_back(x)` | 尾端加入一個元素 |
| `v.pop_back()` | 移除最後一個元素 |
| `v.size()` | 目前元素個數 |
| `v.empty()` | 是否為空 |
| `v.clear()` | 清空 |
| `v[i]` | 存取第 i 個（**不檢查範圍**） |
| `v.at(i)` | 存取第 i 個（**超出範圍會丟例外、程式當場中止**，見雷區②） |
| `v.front()` / `v.back()` | 第一個 / 最後一個元素 |
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
> `-Wall -Wextra` 會警告——**上機考一個警告 2 分**。解法二選一：把迴圈變數宣告成 `size_t i`，或寫 `int n = v.size();` 之後用 `i < n`。
>
> 更嚴重的是這種寫法：
> ```cpp
> for (size_t i = 0; i <= v.size() - 1; i++)   // v 為空時 v.size()-1 會變成超大的數字！
> ```
> 無號整數沒有位置存負數，減過頭會從最大值繞回來（像時鐘從 0 點往回撥一格變成 23 點）。所以空 vector 時 `v.size() - 1` 是天文數字，迴圈會跑到天荒地老。

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
- `v.size()` 是無號的 `size_t`、`v[i]` 不檢查範圍——迴圈條件直接跟 `v.size()` 比（`i < v.size()`、`i + 1 < v.size()`），**永遠不要對 `v.size()` 做減法**。
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
寫 `class ScoreBoard`，內部用 `vector<double>` 存分數，提供 `add(double)`、`size()`、`average()`、`highest()`、`lowest()`。空的時候平均回傳 0。

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
幫 `Vec2` 加上 `+`、`-`、純量乘法（`v * k`）、`==`，並印出結果。

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

**補充**：`a * k` 可以用成員函式，但 `k * a`（數字在左邊）**只能**寫成非成員函式，因為你不能修改 `double` 這個內建型別。下一節會講。

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

---

[← 10/22｜類別與建構子（Ch 6–7）](/2026/09/09/nsysu-c-programming/1022-constructors/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [11/05｜期中上機考（範圍 Ch 1–6） →](/2026/09/09/nsysu-c-programming/1105-midterm/)
