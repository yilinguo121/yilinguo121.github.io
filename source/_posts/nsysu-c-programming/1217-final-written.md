---
title: 12/17｜期末筆試（範圍 Ch 1–12、Ch 14）
date: 2026-09-10
updated: 2026-09-12
permalink: 2026/09/09/nsysu-c-programming/1217-final-written/
cover: /images/code-cover.jpg
categories: [程式設計]
tags: [C++, 中山大學, 自學指南]
toc: true
comments: true
hidden: true
---

[← 12/10｜繼承（Ch 14）](/2026/09/09/nsysu-c-programming/1210-inheritance/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [12/24｜期末上機考（範圍 Ch 1–12、Ch 14） →](/2026/09/09/nsysu-c-programming/1224-final-lab/)

筆試不能開電腦，所以考的是**你腦中有沒有正確的模型**。常見題型有三種：

1. **看程式答輸出**：給一段程式，問印出什麼（最大宗）。
2. **手寫程式片段**：寫一個函式、一個類別的骨架。
3. **觀念選擇 / 填空**：`const` 放哪裡、`static` 的意義、繼承的存取表格。

一週後的 12/24 上機考才考從零把程式寫出來，兩場的準備方式完全不同，這篇只處理前者。**考試時間與佔分比重依課堂公告為準，考前務必確認。**

## 全學期複習清單

括號裡是教過的週次，`→` 是本篇對應的模擬題；某一列後面沒有題號，就自己回那一週翻一次。

| 主題 | 一定要會 |
| --- | --- |
| 基本語法（09/17） | 整數除法、型別轉換（→ 第 1 題）、`setprecision`、未初始化變數 |
| 流程控制（09/24） | `switch` 穿透（→ 第 2 題）、短路求值、`0 < x < 3` 的陷阱（→ 第 3 題）、作用域遮蔽（→ 第 4 題） |
| 函式（10/01） | 傳值 vs 傳參考（→ 第 5 題）、重載規則（→ 第 6 題）、預設引數位置、遞迴終止條件 |
| 陣列（10/08） | 索引從 0、傳進函式只會傳第一格的位址、長度資訊在傳遞過程中消失（11/19）、二維陣列第二維要寫死 |
| struct / class（10/15） | `private` / `public`、封裝、`const` 成員函式（→ 第 12 題） |
| 建構子（10/22） | 初始化列表、預設建構子何時消失、初始化順序依宣告順序（→ 第 12 題） |
| `static`（10/22） | 屬於類別而非物件、要在類別外定義一次（→ 第 8 題） |
| `vector`（10/29） | `push_back` / `size`、`v[i]` 不檢查範圍而 `v.at(i)` 會、`size_t` 與 `int` 比較的警告、傳參要用 `vector<int>&` |
| 運算子重載（10/29、11/12） | 成員 vs 非成員、`<<` 回傳 `ostream&`（→ 第 9 題）、前置後置 `++` |
| 字串（11/12） | `string` 常用函式（→ 第 10 題）、`cin >>` 後接 `getline` 的坑、C-string 要用 `strcmp` |
| 指標（11/19） | `*` 與 `&`、指標算術（→ 第 7 題）、`new`/`delete` 配對、淺拷貝 vs 深拷貝、三法則（→ 第 13 題） |
| 分離編譯（11/26） | header / 實作檔、include guard（→ 快問快答 6）、`undefined reference`（少編一個 `.cpp` 或忘了 `類別名::`）vs `multiple definition`（函式實作寫進 header）、`namespace` 與 `using` 的三種寫法（`using namespace std;` 不可寫在 header） |
| 檔案 I/O（12/03） | 開檔要檢查、`while (fin >> x)`（→ 快問快答 5）、`get`/`put` 與 `>>` 的差別 |
| 繼承（12/10） | `protected`（→ 快問快答 3）、建構解構順序（→ 第 11 題）、覆寫 vs 重載（→ 快問快答 4）、is-a vs has-a |

## 筆試模擬題

> 先自己在紙上把答案寫完，**整份寫完再一起編譯驗證**——考場上沒有電腦，所以練習時也要先把答案定死，不能邊改邊試。以下片段都假設已經 `#include <iostream>`、`#include <string>` 並 `using namespace std;`；沒有寫出 `int main()` 的那幾題裡，第 1、2、3、7、10 題是裸的敘述，要自己包進 `int main() { ... }` 才編得起來；第 12 題是類別與函式的**定義**，要放在 `main` **外面**，再自己補一個建立 `Box` 並呼叫 `show` 的 `main`。

### 看程式答輸出（第 1–11 題）

#### 運算式與流程（Ch 1–Ch 3）

**第 1 題**

```cpp
int a = 7, b = 2;
cout << a / b << '\n';
cout << a % b << '\n';
cout << a / 2.0 << '\n';
cout << static_cast<double>(a) / b << '\n';

int i = 5;
cout << i++ << '\n';
cout << i << '\n';
cout << ++i << '\n';
cout << i-- << '\n';
cout << i << '\n';
```

<details>
<summary><b>答案</b></summary>

```text
3
1
3.5
3.5
5
6
7
7
6
```

前兩行是整數運算；`a / 2.0` 與 `static_cast<double>(a) / b` 只要有一邊是浮點數，整個運算式就用浮點做。
後置（`i++`）先給出舊值再改變；前置（`++i`）先改變再給出新值。

</details>

**第 2 題**

```cpp
int n = 2;
switch (n) {
    case 1: cout << "one ";
    case 2: cout << "two ";
    case 3: cout << "three"; break;
    case 4: cout << "four ";
    default: cout << "other";
}
cout << '\n';
```

<details>
<summary><b>答案</b></summary>

```text
two three
```

從 `case 2` 開始執行，因為沒有 `break` 而穿透到 `case 3`，直到 `case 3` 的 `break` 才停。（這段用 `-Wall -Wextra` 編會跳三個 `warning: this statement may fall through`——那就是編譯器在提醒「這裡少了 `break`」，本題是刻意的。）

</details>

**第 3 題**

```cpp
int x = 5;
if (0 < x < 3) cout << "A\n";
else           cout << "B\n";

int y = 0;
if (y = 2) cout << "C\n";
else       cout << "D\n";
cout << y << '\n';
```

<details>
<summary><b>答案</b></summary>

```text
A
C
2
```

`0 < x < 3` 先算 `0 < 5` 得到 `true`(1)，再算 `1 < 3`。**注意左半邊的結果只會是 0 或 1，兩個都小於 3，所以這條式子對任何 `x` 都成立**，永遠印 A；g++ 自己也會警告 `comparison of constant '3' with boolean expression is always true`。正確寫法是 `0 < x && x < 3`。
`y = 2` 是**指派**不是比較，結果 2 為真 → 印 C，而且 `y` 真的被改成 2。

</details>

**第 4 題**

```cpp
int g = 10;

void f() {
    int g = 20;
    g++;
    cout << g << '\n';
}

int main() {
    f();
    cout << g << '\n';
    {
        int g = 30;
        cout << g << '\n';
    }
    cout << g << '\n';
    return 0;
}
```

<details>
<summary><b>答案</b></summary>

```text
21
10
30
10
```

內層宣告的同名變數會**遮蔽**外層的，離開作用域後外層的變數完全沒受影響。

</details>

#### 函式、陣列與指標（Ch 4–Ch 5、Ch 9）

**第 5 題**

```cpp
void f(int x, int& y) {
    x = x * 2;
    y = y * 2;
}

int main() {
    int a = 3, b = 4;
    f(a, b);
    cout << a << ' ' << b << '\n';
    return 0;
}
```

<details>
<summary><b>答案</b></summary>

```text
3 8
```

`x` 是傳值（複製品，改了沒用），`y` 是傳參考（別名，改得到外面）。**看到 `&` 就是會改到外面**。

</details>

**第 6 題**

```cpp
void f(int x)    { cout << "int "    << x << '\n'; }
void f(double x) { cout << "double " << x << '\n'; }

int main() {
    f('a');
    f(3.0f);
    f(true);
    return 0;
}
```

<details>
<summary><b>答案</b></summary>

```text
int 97
double 3
int 1
```

重載解析偏好**提升**（同族、不失真）多過轉換：`char` 和 `bool` 都提升成 `int`，`float` 提升成 `double`。所以 `'a'` 進 `int` 版（印 `'a'` 的碼 97）、`3.0f` 進 `double` 版、`true` 進 `int` 版（印 1）。

</details>

**第 7 題**

```cpp
int a[5] = {10, 20, 30, 40, 50};
int* p = a + 1;
cout << *p << '\n';
cout << p[2] << '\n';
cout << *(a + 4) - *p << '\n';
cout << a[1] + *(p + 1) << '\n';
```

<details>
<summary><b>答案</b></summary>

```text
20
40
30
50
```

| 寫法 | 等價於 | 值 |
| --- | --- | --- |
| `*p` | `a[1]` | 20 |
| `p[2]` | `a[3]` | 40 |
| `*(a + 4) - *p` | `a[4] - a[1]` | 50 − 20 = 30 |
| `a[1] + *(p + 1)` | `a[1] + a[2]` | 20 + 30 = 50 |

`p = a + 1` 之後，`p[k]` 就是 `a[k+1]`。**把指標運算全部換算回 `a[]` 再算，就不會錯**。

</details>

#### 類別、建構子與運算子重載（Ch 6–Ch 8）

**第 8 題**

```cpp
class Item {
public:
    static int count;
    Item()  { count++; }
    ~Item() { count--; }
};
int Item::count = 0;

int main() {
    Item a;
    {
        Item b, c;
        cout << Item::count << '\n';
    }
    cout << Item::count << '\n';
    Item d;
    cout << Item::count << '\n';
    return 0;
}
```

<details>
<summary><b>答案</b></summary>

```text
3
1
2
```

`a` → 1；進內層再建 `b`、`c` → 3（印 3）；離開內層，`b`、`c` 被解構 → 1（印 1）；再建 `d` → 2（印 2）。**`count` 屬於類別不屬於物件，所有 `Item` 共用同一份**，所以它記的是「現在活著幾個」而不是「總共建過幾個」。

</details>

**第 9 題**

```cpp
class Score {
private:
    int value;
public:
    Score(int v) : value(v) { }
    Score operator+(const Score& rhs) const { return Score(value + rhs.value); }
    int get() const { return value; }
};

ostream& operator<<(ostream& os, const Score& s) { os << '[' << s.get() << ']'; return os; }

int main() {
    Score a(80), b(15);
    cout << a + b << '\n';
    cout << a << b << '\n';
    return 0;
}
```

<details>
<summary><b>答案</b></summary>

```text
[95]
[80][15]
```

`a + b` 呼叫成員版的 `operator+`，做出一個新的 `Score(95)` 再交給 `<<` 印出。
**`<<` 一定要回傳 `ostream&`**：第二行其實是 `((cout << a) << b) << '\n';`，前一次的回傳值要能再被 `<<` 接住，回傳 `void` 的話就編譯不過。

</details>

#### 字串（Ch 9）

**第 10 題**

```cpp
string s = "programming";
cout << s.length() << '\n';
cout << s.substr(3, 4) << '\n';
cout << s.find("gram") << '\n';
cout << (s.find("xyz") == string::npos ? "not found" : "found") << '\n';
```

<details>
<summary><b>答案</b></summary>

```text
11
gram
3
not found
```

- `substr(3, 4)` 從索引 3 開始取 4 個字元；索引從 0 起算：`p(0) r(1) o(2) g(3)`。
- `find` 回傳的是子字串的**起始索引**（不是「有沒有找到」），所以 `find("gram")` 是 3。
- 找不到時回傳 `string::npos`——它是一個**極大的無號數**（這台機器上是 18446744073709551615）。所以**絕對不能寫 `< 0`**：無號數永遠不會小於 0，這個條件恆為 false，`-Wextra` 會直接警告 `comparison of unsigned expression in '< 0' is always false`。至於 `== -1`，因為 `npos` 的定義就是「把 −1 塞進無號型別」，`-1` 比較時會被轉成同一個極大值，**其實會成立**——但 `-Wall` 會丟 `comparison of integer expressions of different signedness` 的警告。結論：**一律寫 `== string::npos` / `!= string::npos`**，別的寫法不是錯就是有警告。

</details>

#### 繼承（Ch 14）

**第 11 題**

```cpp
class A {
public:
    A()  { cout << "+A "; }
    ~A() { cout << "-A"; }
};
class B : public A {
public:
    B()  { cout << "+B "; }
    ~B() { cout << "-B "; }
};

int main() {
    { B obj; }
    cout << '\n';
    return 0;
}
```

<details>
<summary><b>答案</b></summary>

```text
+A +B -B -A
```

建構先父後子，解構先子後父（`+` 是建構、`-` 是解構）。

</details>

### 找出錯誤（第 12–13 題）

**第 12 題**

```cpp
class Box {
private:
    int w, h;
public:
    Box(int a, int b) : h(b), w(a) { }
    int area() { return w * h; }
};

void show(const Box& b) {
    cout << b.area() << '\n';
}
```

<details>
<summary><b>答案</b></summary>

有兩個問題，先看會讓程式**編不起來**的那個：

1. **`area()` 沒有標 `const`**：`show()` 收的是 `const Box&`，const 物件只能呼叫 `const` 成員函式，g++ 會報 `error: passing 'const Box' as 'this' argument discards qualifiers`——這是**編譯失敗**，程式根本跑不起來。
2. **初始化列表順序與宣告順序不一致**：成員宣告是 `w` 在前、`h` 在後，實際初始化順序就一定照宣告走（`w` 再 `h`），但程式碼寫成 `h(b), w(a)`，`-Wall` 會給 `warning: 'Box::h' will be initialized after ... [-Wreorder]`。這題兩個成員都只是複製參數，順序顛倒不影響結果；但如果寫成 `: h(b), w(h * 2)`，`w` 其實**先**被初始化，那時 `h` 還是垃圾值——這才是初始化列表一定要照宣告順序寫的原因。

修正：

```cpp
Box(int a, int b) : w(a), h(b) { }
int area() const { return w * h; }
```

</details>

**第 13 題**

```cpp
class Buffer {
private:
    int* data;
    int  n;
public:
    Buffer(int size) : data(new int[size]), n(size) { }
    ~Buffer() { delete[] data; }
};

int main() {
    Buffer a(10);
    Buffer b = a;      // (1)
    return 0;          // (2)
}
```

<details>
<summary><b>答案</b></summary>

這個類別**只寫了解構子，沒寫拷貝建構子與指派運算子**，違反三法則。

- 在 (1)，編譯器用預設的**淺拷貝**：`b.data` 與 `a.data` 指向同一塊記憶體。
- 在 (2)，`a` 與 `b` 各自解構，對同一塊記憶體 `delete[]` 兩次 → **未定義行為**（實測會直接中止，訊息類似 `free(): double free detected in tcache 2` 或 `double free or corruption`）。

修正方式：補上拷貝建構子與指派運算子，各自配置新記憶體並複製內容（深拷貝）。

</details>

## 觀念快問快答

選擇 / 填空題考的就是這種一句話講得完的規則。八題題目先列在下面，自己回答完再打開對答案：

1. `const` 放在成員函式括號後面是什麼意思？
2. `static` 成員變數為什麼要在類別外再寫一次？
3. `public` 繼承下，父類別的 `protected` 成員在子類別裡是什麼權限？
4. 覆寫（redefinition）與重載（overload）差在哪？
5. `while (fin >> x)` 為什麼比 `while (!fin.eof())` 正確？
6. include guard 沒寫會發生什麼？
7. 三法則是哪三個？
8. `v[i]` 與 `v.at(i)` 差在哪？

<details>
<summary><b>八題答案</b></summary>

1. **`const` 放在成員函式括號後面是什麼意思？** 保證這個函式不會改到成員；`const` 物件（例如 `const Box&` 參數）只能呼叫這種函式。
2. **`static` 成員變數為什麼要在類別外再寫一次？** 類別內那行只是宣告，真正配置記憶體要靠類別外的 `int Item::count = 0;`，整個程式只寫一次，而且那一行不再寫 `static`。
3. **`public` 繼承下，父類別的 `protected` 成員在子類別裡是什麼權限？** 還是 `protected`：子類別內部能用，類別外面不能。
4. **覆寫（redefinition）與重載（overload）差在哪？** 覆寫是子類別用**同名同參數**的版本蓋掉父類別的；重載是同一層裡同名但**參數列不同**的多個版本。
5. **`while (fin >> x)` 為什麼比 `while (!fin.eof())` 正確？** `eof()` 只回答「是不是已經碰到檔尾」，跟「這次讀成功了沒」是兩件事。最常見的情況是最後一筆讀完後 `eof()` 還是 false（檔尾還有個換行），迴圈再跑一圈，`>>` 失敗、`x` 保持舊值，最後一筆被處理兩次；反過來，檔案結尾沒有換行時，最後一筆讀成功的同時 `eof()` 就已經是 true，用它當條件會漏掉那一筆。`fin >> x` 直接拿「這次讀成功了沒」當條件，兩種情況都對。
6. **include guard 沒寫會發生什麼？** 同一個 header 被 include 兩次，類別／結構等於被定義兩次，編譯報 `redefinition of ...`。
7. **三法則是哪三個？** 拷貝建構子、`operator=`、解構子；只要自己寫了其中一個，另外兩個通常也得寫。
8. **`v[i]` 與 `v.at(i)` 差在哪？** `[]` 不檢查範圍，越界是未定義行為（可能沒事、也可能默默踩壞別的資料）；`at()` 會檢查，越界當場中止並印 `terminate called after throwing an instance of 'std::out_of_range'`。

</details>

**填表題：三種繼承方式**（把 ①～④ 填出來）

| 父類別成員 | `public` 繼承後 | `protected` 繼承後 | `private` 繼承後 |
| --- | --- | --- | --- |
| `public` | ① | ② | `private` |
| `protected` | `protected` | ③ | ④ |
| `private` | 存取不到 | 存取不到 | 存取不到 |

<details>
<summary><b>答案</b></summary>

① `public`　② `protected`　③ `protected`　④ `private`

一句話記法：**繼承方式是一個上限**，父類別成員的權限最多只能到那個等級，超過的一律被壓下來；`private` 成員不管用哪種方式繼承都存取不到。

</details>

## 手寫題的準備方式

筆試要你**在紙上**寫出程式片段，沒有編譯器幫你。考前一週抽三天做這件事，每次默寫下面四樣：

1. 一個完整的類別骨架（private 資料、建構子、`const` getter、非 const setter）。
2. 重載 `<<` 的完整簽名與本體。
3. 三法則的三個函式簽名。
4. `while (fin >> x)` 的完整讀檔流程（含開檔檢查）。

<details>
<summary><b>四份標準答案</b></summary>

```cpp
// (1) 類別骨架：private 資料 + 建構子 + const getter + 非 const setter
class Point {
private:
    int x, y;
public:
    Point(int a, int b) : x(a), y(b) { }
    int getX() const { return x; }      // 只讀 → 要有 const
    void setX(int v) { x = v; }         // 要改 → 不能有 const
    friend ostream& operator<<(ostream& os, const Point& p);
};

// (2) 重載 <<：參數收 const 物件參考，回傳 ostream& 才能串接
ostream& operator<<(ostream& os, const Point& p) {
    os << '(' << p.x << ", " << p.y << ')';
    return os;
}
```

```cpp
// (3) 三法則：類別裡有 new 出來的資源，這三個一定要一起寫
class Buffer {
private:
    int* data;
    int  n;
public:
    Buffer(int size);
    Buffer(const Buffer& other);            // 拷貝建構子：參數一定是 const 參考
    Buffer& operator=(const Buffer& rhs);   // 指派：一定回傳自己的參考
    ~Buffer();                              // 解構：delete[] 配 new[]
};
```

```cpp
// (4) 讀檔流程：開檔一定要檢查
#include <iostream>
#include <fstream>
using namespace std;

int main() {
    ifstream fin("data.txt");
    if (!fin) {
        cout << "開檔失敗\n";
        return 1;
    }
    int x, sum = 0;
    while (fin >> x) sum += x;
    fin.close();
    cout << sum << '\n';
    return 0;
}
```

</details>

寫完打進電腦編譯一次，看看漏了分號還是忘了 `const`——這四樣各寫過三遍，考場上就是肌肉記憶。

---

[← 12/10｜繼承（Ch 14）](/2026/09/09/nsysu-c-programming/1210-inheritance/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [12/24｜期末上機考（範圍 Ch 1–12、Ch 14） →](/2026/09/09/nsysu-c-programming/1224-final-lab/)
