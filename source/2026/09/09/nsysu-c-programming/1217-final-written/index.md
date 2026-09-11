---
title: 12/17｜期末筆試（範圍 Ch 1–12、Ch 14）
date: 2026-09-10
cover: /images/code-cover.jpg
toc: true
__post: true
comments: true
---

> 本文是〈[中山大學 C 程式設計 & 實驗課完整自學指南](/2026/09/09/nsysu-c-programming/)〉系列的一篇，內容為原創說明與自寫範例，不轉載教科書或授課投影片。
>
> [← 12/10｜繼承（Ch 14）](/2026/09/09/nsysu-c-programming/1210-inheritance/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [12/24｜期末上機考（範圍 Ch 1–12、Ch 14） →](/2026/09/09/nsysu-c-programming/1224-final-lab/)

筆試不能開電腦，所以考的是**你腦中有沒有正確的模型**。常見題型有三種：

1. **看程式答輸出**：給一段程式，問印出什麼（最大宗）。
2. **手寫程式片段**：寫一個函式、一個類別的骨架。
3. **觀念選擇 / 填空**：`const` 放哪裡、`static` 的意義、繼承的存取表格。

## 全學期複習清單

| 主題 | 一定要會 |
| --- | --- |
| 基本語法 | 整數除法、型別轉換、`setprecision`、未初始化變數 |
| 流程控制 | `switch` 穿透、短路求值、`0 < x < 10` 的陷阱 |
| 函式 | 傳值 vs 傳參考、重載規則、預設引數位置、遞迴終止條件 |
| 陣列 | 索引從 0、傳進函式會退化成指標、二維陣列第二維要寫死 |
| struct / class | `private` / `public`、封裝、`const` 成員函式 |
| 建構子 | 初始化列表、預設建構子何時消失、初始化順序依宣告順序 |
| `static` | 屬於類別而非物件、要在類別外定義一次 |
| 運算子重載 | 成員 vs 非成員、`<<` 回傳 `ostream&`、前置後置 `++` |
| 字串 | `string` 常用函式、`cin >>` 後接 `getline` 的坑、C-string 要用 `strcmp` |
| 指標 | `*` 與 `&`、`new`/`delete` 配對、淺拷貝 vs 深拷貝、三法則 |
| 分離編譯 | header / 實作檔、include guard、連結錯誤的意義 |
| 檔案 I/O | 開檔要檢查、`while (fin >> x)`、`get`/`put` 與 `>>` 的差別 |
| 繼承 | `protected`、建構解構順序、覆寫 vs 重載、is-a vs has-a |

## 筆試模擬題：看程式答輸出

> 先自己在紙上寫答案，再展開對照。**不要直接編譯**——筆試沒有電腦。

**第 1 題**

```cpp
int a = 7, b = 2;
cout << a / b << '\n';
cout << a % b << '\n';
cout << a / 2.0 << '\n';
cout << static_cast<double>(a) / b << '\n';
```

<details>
<summary><b>答案</b></summary>

```text
3
1
3.5
3.5
```

前兩行是整數運算；後兩行只要有一邊是浮點數，整個運算式就用浮點做。

</details>

**第 2 題**

```cpp
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
5
6
7
7
6
```

後置（`i++`）先給出舊值再改變；前置（`++i`）先改變再給出新值。

</details>

**第 3 題**

```cpp
int n = 2;
switch (n) {
    case 1: cout << "one ";
    case 2: cout << "two ";
    case 3: cout << "three "; break;
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

從 `case 2` 開始執行，因為沒有 `break` 而穿透到 `case 3`，直到 `case 3` 的 `break` 才停。

</details>

**第 4 題**

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

**第 5 題**

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

`b`、`c` 在內層大括號結束時被解構，`count` 減回 1。

</details>

**第 6 題**

```cpp
class A {
public:
    A()  { cout << "A( "; }
    ~A() { cout << "~A "; }
};
class B : public A {
public:
    B()  { cout << "B( "; }
    ~B() { cout << "~B "; }
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
A( B( ~B ~A 
```

建構先父後子，解構先子後父。

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

`p` 指向 `a[1]`，所以 `p[2]` 就是 `a[3]`。最後一行是 `20 + a[2] = 20 + 30`。

</details>

**第 8 題**

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

`0 < x < 3` 先算 `0 < 5` 得到 `true`(1)，再算 `1 < 3` 成立 → 印 A。
`y = 2` 是**指派**不是比較，結果 2 為真 → 印 C，而且 `y` 真的被改成 2。

</details>

**第 9 題**

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

`substr(3, 4)` 從索引 3 開始取 4 個字元。索引從 0 起算：`p(0) r(1) o(2) g(3)`。

</details>

**第 10 題**

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

**第 11 題：找出錯誤**

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

有兩個問題：

1. **初始化列表順序與宣告順序不一致**：成員宣告是 `w` 在前、`h` 在後，實際初始化順序也會是 `w`、`h`，但程式碼寫成 `h(b), w(a)`。`-Wall` 會給 `warning: 'Box::h' will be initialized after ... [-Wreorder]`——上機考一個警告 2 分。
2. **`area()` 沒有標 `const`**：`show()` 的參數是 `const Box&`，只能呼叫 `const` 成員函式，這裡會**編譯錯誤**。

修正：

```cpp
Box(int a, int b) : w(a), h(b) { }
int area() const { return w * h; }
```

</details>

**第 12 題：找出錯誤**

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

## 手寫題的準備方式

筆試要你**在紙上**寫出程式片段，沒有編譯器幫你。建議考前一週每天做這件事：

1. 拿一張白紙，寫出一個完整的類別骨架（含 private 資料、建構子、`const` 成員函式）。
2. 寫出重載 `<<` 的完整簽名（`ostream& operator<<(ostream& os, const T& obj)`）。
3. 寫出三法則的三個函式簽名。
4. 寫出 `while (fin >> x)` 的完整讀檔流程（含開檔檢查）。

寫完再打進電腦編譯，看看哪裡漏了分號、哪裡忘了 `const`。**紙上寫過三次，考場就不會忘。**

---

[← 12/10｜繼承（Ch 14）](/2026/09/09/nsysu-c-programming/1210-inheritance/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [12/24｜期末上機考（範圍 Ch 1–12、Ch 14） →](/2026/09/09/nsysu-c-programming/1224-final-lab/)
