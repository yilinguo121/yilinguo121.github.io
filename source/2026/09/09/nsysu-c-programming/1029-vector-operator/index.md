---
title: 10/29｜vector 與運算子重載入門（Ch 7）
date: 2026-09-10
cover: /images/code-cover.jpg
toc: true
__post: true
comments: true
---

> 本文是〈[中山大學 C 程式設計 & 實驗課完整自學指南](/2026/09/09/nsysu-c-programming/)〉系列的一篇，內容為原創說明與自寫範例，不轉載教科書或授課投影片。
>
> [← 10/22｜類別與建構子（Ch 6–7）](/2026/09/09/nsysu-c-programming/1022-constructors/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [11/05｜期中上機考（範圍 Ch 1–6） →](/2026/09/09/nsysu-c-programming/1105-midterm/)

**這次要會什麼**

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

`vector<int>` 讀作「裝 int 的 vector」，角括號裡換成別的型別就能裝別的東西：`vector<double>`、`vector<string>`、`vector<Student>`。

**常用成員函式**（這些請背起來，考試不能查）：

| 用法 | 作用 |
| --- | --- |
| `v.push_back(x)` | 尾端加入一個元素 |
| `v.pop_back()` | 移除最後一個元素 |
| `v.size()` | 目前元素個數 |
| `v.empty()` | 是否為空 |
| `v.clear()` | 清空 |
| `v[i]` | 存取第 i 個（**不檢查範圍**） |
| `v.at(i)` | 存取第 i 個（**超出範圍會丟例外**） |
| `v.front()` / `v.back()` | 第一個 / 最後一個元素 |
| `v.resize(n)` | 改成 n 個元素 |

**建立時就給內容**：

```cpp
vector<int> a(5);            // 五個 0
vector<int> b(5, -1);        // 五個 -1
vector<int> c = {1, 2, 3};   // C++11 直接列出來
vector<vector<int>> grid(3, vector<int>(4, 0));   // 3×4 的二維 vector，全 0
```

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
> 無號數 `0 - 1` 不是 `-1`，而是最大值。空 vector 就會跑出天文數字次迴圈。

> **雷區 ②：`v[i]` 不會幫你檢查範圍**
> ```cpp
> vector<int> v;        // size = 0
> v[0] = 5;             // 未定義行為，不一定當掉，但一定是錯的
> ```
> 要加元素**只能用 `push_back`** 或先 `resize`。除錯時可以改用 `v.at(0)`，它會丟出例外讓你知道錯在哪。

## `vector` 傳進函式

```cpp
double average(const vector<int>& v) {          // 唯讀 → const 參考
    if (v.empty()) return 0;
    double sum = 0;
    for (int x : v) sum += x;
    return sum / v.size();
}

void doubleAll(vector<int>& v) {                // 要修改 → 一般參考
    for (int& x : v) x *= 2;                    // 注意 int& 才改得到
}
```

**跟陣列最大的差別**：`vector` 傳進函式時如果沒寫 `&`，會**整包複製**（很慢），而且函式**不需要另外傳長度**，自己 `size()` 就知道了。

## `vector` 裝物件

```cpp
struct Student { string name; double gpa; };

vector<Student> v;
v.push_back({"Ann", 3.8});        // C++11 可以直接用大括號建
v.push_back({"Bob", 4.0});
for (const Student& s : v) cout << s.name << ' ' << s.gpa << '\n';
```

`const Student&` 而不是 `Student`：避免每一圈都複製一個物件。

## 運算子重載：讓自訂型別也能用 `+`

假設要寫一個二維向量類別，如果只能這樣用就太醜了：

```cpp
Vec2 c = add(a, b);      // 可以，但不直覺
```

C++ 允許你**定義 `+` 對自訂型別的意義**，這就叫**運算子重載（operator overloading）**：

```cpp
#include <iostream>
using namespace std;

class Vec2 {
public:
    double x, y;
    Vec2(double x = 0, double y = 0) : x(x), y(y) { }
};

// 寫成「非成員函式」：兩個參數分別是 + 的左右兩邊
Vec2 operator+(const Vec2& a, const Vec2& b) {
    return Vec2(a.x + b.x, a.y + b.y);
}

int main() {
    Vec2 a(1, 2), b(3, 4);
    Vec2 c = a + b;                     // 實際上是呼叫 operator+(a, b)
    cout << c.x << ' ' << c.y << '\n';  // 4 6
    return 0;
}
```

也可以寫成**成員函式**，此時左邊的運算元就是物件自己：

```cpp
class Vec2 {
public:
    double x, y;
    Vec2(double x = 0, double y = 0) : x(x), y(y) { }

    Vec2 operator+(const Vec2& other) const {   // a + b → a.operator+(b)
        return Vec2(x + other.x, y + other.y);
    }
};
```

兩種寫法的取捨、`<<` 的重載與 `friend`，下一次進度會完整講。這裡先記住三件事：

1. 函式名字就是 `operator` 加上那個符號：`operator+`、`operator-`、`operator==`。
2. **不能發明新符號**（沒有 `operator**`），也不能改變運算元個數與優先順序。
3. 重載的意義應該符合直覺。把 `+` 定義成減法，語法上合法，但沒有人看得懂你的程式。

## 本次練習題

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

    for (size_t i = 0; i + 1 < v.size(); i++)          // 選擇排序
        for (size_t j = i + 1; j < v.size(); j++)
            if (v[j] < v[i]) { int t = v[i]; v[i] = v[j]; v[j] = t; }

    for (size_t i = 0; i < v.size(); i++)
        cout << v[i] << (i + 1 == v.size() ? '\n' : ' ');
    return 0;
}
```

注意迴圈條件寫成 `i + 1 < v.size()` 而不是 `i < v.size() - 1`：後者在 vector 為空時會因為無號數減法而爆掉。

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
    Vec2(double x = 0, double y = 0) : x(x), y(y) { }

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

`names.erase(names.begin() + i)` 會刪掉第 `i` 個元素，後面的元素往前遞補。`names.begin()` 是「指向第一個元素」的東西，叫做**迭代器（iterator）**，這學期不深入，會用這一招就夠。

</details>

---

[← 10/22｜類別與建構子（Ch 6–7）](/2026/09/09/nsysu-c-programming/1022-constructors/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [11/05｜期中上機考（範圍 Ch 1–6） →](/2026/09/09/nsysu-c-programming/1105-midterm/)
