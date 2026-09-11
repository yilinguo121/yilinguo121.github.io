---
title: 11/19｜指標、動態記憶體與 C 風格字串（Ch 9、Ch 10）
date: 2026-09-10
updated: 2026-09-11
permalink: 2026/09/09/nsysu-c-programming/1119-pointers/
cover: /images/code-cover.jpg
categories: [程式設計]
tags: [C++, 中山大學, 自學指南]
toc: true
comments: true
hidden: true
---

[← 11/12｜運算子重載、friend 與 string（Ch 8、Ch 9）](/2026/09/09/nsysu-c-programming/1112-operator-string/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [11/26｜分離編譯與命名空間（Ch 11） →](/2026/09/09/nsysu-c-programming/1126-separate-compilation/)

> 對應課本習題：Ch9: 2, 4, 6, 10；Ch10: 1, 3, 4, 8

**這次要會什麼**

```text
指標是什麼 → new / delete → 動態陣列 → 指標與陣列的關係
→ this 與 -> → 淺拷貝 vs 深拷貝 → C 風格字串
```

這是整學期**最多人卡關**的一次，但核心觀念只有一句話：**指標是一個「存位址」的變數**。

## 記憶體、位址、指標

**白話說**：把記憶體想成一整排有編號的信箱，每個變數都住在某個編號的信箱裡。

- `a` 是信箱裡的**內容**。
- `&a` 是信箱的**編號（位址）**。
- **指標**就是「專門用來記某個信箱編號」的變數。

```cpp
#include <iostream>
using namespace std;

int main() {
    int a = 5;
    int* p = &a;          // p 記住 a 的位址

    cout << a  << '\n';   // 5       ：a 的內容
    cout << &a << '\n';   // 0x7ffd… ：a 的位址
    cout << p  << '\n';   // 同上     ：p 存的就是 a 的位址
    cout << *p << '\n';   // 5       ：「去 p 指的地方，把東西拿出來」

    *p = 10;              // 透過 p 改 a
    cout << a  << '\n';   // 10
    return 0;
}
```

```text
      變數 a                 指標 p
   ┌──────────┐          ┌──────────────┐
   │    10    │ ◀────────│ 0x7ffd1234   │
   └──────────┘          └──────────────┘
   位址 0x7ffd1234
```

兩個符號要分清楚：

| 符號 | 出現位置 | 意思 |
| --- | --- | --- |
| `int* p;` | 宣告時 | 「p 是指向 int 的指標」 |
| `&a` | 運算式中 | 取 a 的位址 |
| `*p` | 運算式中 | 取出 p 指的東西（**解參考 dereference**） |
| `int& r = a;` | 宣告時 | r 是 a 的參考（別名），**不是取位址** |

> **雷區 ①：`int* p, q;` 只有 `p` 是指標**
> `q` 是普通的 `int`。想宣告兩個指標要寫 `int *p, *q;`。建議**一行只宣告一個指標**，省得搞混。

## 空指標 `nullptr`

```cpp
int* p = nullptr;        // 明確表示「目前不指向任何東西」
if (p != nullptr) cout << *p;    // 使用前一定要檢查
```

- `nullptr` 是 C++11 的寫法，比舊的 `NULL` 或 `0` 安全，**請一律用它**。
- **對空指標解參考**（`*p` 當 `p` 是 `nullptr`）會直接 `Segmentation fault`。

## 動態記憶體：`new` 與 `delete`

到目前為止的變數，大小都要在編譯時決定。`new` 讓你在**執行時**才決定要多少記憶體：

```cpp
int* p = new int;          // 要一格 int
*p = 42;
cout << *p << '\n';
delete p;                  // 用完要還
p = nullptr;               // 好習慣：還完就把指標清乾淨

int* q = new int(7);       // 要一格並初始化為 7
delete q;
```

**動態陣列**——這才是重點：

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;                  // 執行時才知道要多大

    int* a = new int[n];       // 配置 n 個 int
    for (int i = 0; i < n; i++) cin >> a[i];    // 用法跟普通陣列一模一樣

    int sum = 0;
    for (int i = 0; i < n; i++) sum += a[i];
    cout << sum << '\n';

    delete[] a;                // 陣列要用 delete[]，不是 delete
    a = nullptr;
    return 0;
}
```

**三條鐵律：**

1. **每個 `new` 都要有一個對應的 `delete`**，否則記憶體洩漏（memory leak）。
2. **`new[]` 配對 `delete[]`**，`new` 配對 `delete`，配錯是未定義行為。
3. **`delete` 之後不要再用那個指標**（稱為**懸空指標 dangling pointer**），習慣馬上設成 `nullptr`。

```cpp
int* p = new int(5);
delete p;
cout << *p;        // 危險：記憶體已經還掉了，內容不保證是什麼
```

## 指標與陣列的關係

陣列名稱本身就可以當成「指向第 0 個元素的指標」：

```cpp
int a[5] = {10, 20, 30, 40, 50};
int* p = a;              // 等同 &a[0]

cout << *p     << '\n';  // 10
cout << *(p+2) << '\n';  // 30
cout << p[2]   << '\n';  // 30（p[i] 就是 *(p+i) 的另一種寫法）
```

**指標算術**：`p + 1` 是「下一個元素」的位址，不是「位址加 1 個 byte」。編譯器會自動乘上 `sizeof(int)`。

這也解釋了為什麼「陣列傳進函式要另外傳長度」——**傳過去的只是一個指標，長度資訊在傳遞過程中就消失了**：

```cpp
void f(int a[], int n);     // 這裡的 int a[] 其實等同 int* a
```

## 指標當參數

```cpp
void addOne(int* p) { (*p)++; }      // 注意括號：*p 先取值再 ++

int main() {
    int a = 5;
    addOne(&a);        // 要傳位址
    cout << a;         // 6
}
```

跟參考（`int&`）效果一樣，只是語法比較囉唆。**現代 C++ 的習慣**：能用參考就用參考，指標留給「可能沒有值（`nullptr`）」或「要做指標算術」的場合。

## `->` 與 `this`

指向物件的指標，取成員要用 `->`：

```cpp
struct Point { int x, y; };

Point p = {1, 2};
Point* ptr = &p;
cout << (*ptr).x << '\n';   // 可以，但很醜
cout << ptr->x   << '\n';   // 同義，標準寫法
```

`this` 是每個成員函式裡都有的隱藏指標，**指向呼叫它的那個物件**：

```cpp
class Counter {
private:
    int v;
public:
    Counter& add(int n) {
        v += n;
        return *this;          // 回傳「自己」，可以串接呼叫
    }
    int get() const { return v; }
};

Counter c;
c.add(3).add(5);              // 因為 add 回傳自己的參考，所以能連著寫
```

## 淺拷貝與深拷貝（本節最重要的觀念）

當類別內部有 `new` 出來的資源時，預設的複製行為會出事：

```cpp
class MyArray {
private:
    int* data;
    int  n;
public:
    MyArray(int size) : data(new int[size]), n(size) { }
    ~MyArray() { delete[] data; }        // 解構子：物件消失時自動還記憶體
};

MyArray a(10);
MyArray b = a;        // 危險！
```

編譯器自動產生的複製行為是**淺拷貝（shallow copy）**：只把 `data` 這個「位址」複製過去，兩個物件指向**同一塊記憶體**。

```text
淺拷貝：
   a.data ──┐
            ├──▶ [ 同一塊記憶體 ]
   b.data ──┘
   → a 和 b 消失時各 delete[] 一次 → 同一塊被還兩次 → 程式崩潰
```

正確做法是**深拷貝（deep copy）**：自己配一塊新的，把內容一個一個抄過去。

```text
深拷貝：
   a.data ──▶ [ 記憶體 A ]
   b.data ──▶ [ 記憶體 B ]（內容相同但各自獨立）
```

要做到這件事，需要自己寫三個函式，合稱 **Rule of Three（三法則）**：

```cpp
#include <iostream>
using namespace std;

class MyArray {
private:
    int* data;
    int  n;

public:
    MyArray(int size) : data(new int[size]), n(size) {
        for (int i = 0; i < n; i++) data[i] = 0;
    }

    // ① 解構子
    ~MyArray() { delete[] data; }

    // ② 拷貝建構子：用一個既有物件建立新物件時呼叫
    MyArray(const MyArray& other) : data(new int[other.n]), n(other.n) {
        for (int i = 0; i < n; i++) data[i] = other.data[i];
    }

    // ③ 指派運算子：已存在的物件被賦值時呼叫
    MyArray& operator=(const MyArray& other) {
        if (this == &other) return *this;       // 自我指派保護：a = a
        delete[] data;                          // 先還掉舊的
        n = other.n;
        data = new int[n];
        for (int i = 0; i < n; i++) data[i] = other.data[i];
        return *this;
    }

    int& operator[](int i) { return data[i]; }
    int  size() const { return n; }
};

int main() {
    MyArray a(3);
    a[0] = 10;

    MyArray b = a;      // 呼叫拷貝建構子（深拷貝）
    b[0] = 99;

    cout << a[0] << ' ' << b[0] << '\n';   // 10 99 → 互不影響，正確！
    return 0;
}
```

**口訣：只要類別裡有 `new`，就要想到「解構子、拷貝建構子、指派運算子」這三個。** 少寫任何一個，程式都可能在某個時候莫名崩潰——而且崩潰的地方通常離錯誤的地方很遠，超難除錯。

> **拷貝建構子什麼時候被呼叫？**
> 1. `MyArray b = a;` 或 `MyArray b(a);`
> 2. 把物件**傳值**進函式時
> 3. 函式**回傳物件**時
> 這也是為什麼大物件要用 `const&` 傳遞——避免每次呼叫都做一次深拷貝。

## C 風格字串（C-string）

在 `string` 類別出現之前，C++ 用「以 `'\0'` 結尾的 char 陣列」表示字串：

```cpp
#include <iostream>
#include <cstring>
using namespace std;

int main() {
    char s[20] = "Hello";       // 實際佔 6 格：'H','e','l','l','o','\0'

    cout << strlen(s) << '\n';  // 5（不含結尾的 '\0'）
    cout << s << '\n';          // Hello

    char t[20];
    strcpy(t, s);               // 複製，不能寫 t = s
    strcat(t, " NSYSU");        // 接在後面
    cout << t << '\n';          // Hello NSYSU

    if (strcmp(s, t) == 0) cout << "same\n";
    else                   cout << "different\n";
    return 0;
}
```

| 函式（需 `<cstring>`） | 作用 |
| --- | --- |
| `strlen(s)` | 長度（不含 `'\0'`） |
| `strcpy(dest, src)` | 複製 |
| `strcat(dest, src)` | 串接 |
| `strcmp(a, b)` | 比較，相同回傳 0；`a < b` 回傳負數 |

> **雷區 ②：C-string 不能用 `=` 和 `==`**
> ```cpp
> char a[10] = "abc", b[10];
> b = a;              // 編譯錯誤
> if (a == b) { }     // 編譯得過，但比的是「位址」不是內容！
> ```
> 一定要用 `strcpy` 和 `strcmp`。**這就是 `string` 類別存在的理由**——它讓 `=`、`==`、`+` 都正常運作。

> **雷區 ③：陣列大小要夠**
> `char s[5] = "Hello";` 會溢位（需要 6 格放 `'\0'`）。`strcpy`、`strcat` 都**不檢查目標空間夠不夠**，這是 C 語言最經典的安全漏洞來源。

**兩者互轉**：

```cpp
string cpp = "Hello";
const char* c = cpp.c_str();     // string → C-string
string back = c;                 // C-string → string（直接指派即可）
```

## 本次練習題

**Q1. 動態陣列的統計**
讀入 `n`，用 `new int[n]` 配置陣列，讀入 `n` 個數字後輸出最大值、最小值與平均（兩位小數），最後正確釋放記憶體。

```text
輸入：
5
3 7 1 9 4
輸出：
max = 9
min = 1
avg = 4.80
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    int n;
    cin >> n;
    if (n <= 0) return 0;

    int* a = new int[n];
    for (int i = 0; i < n; i++) cin >> a[i];

    int mx = a[0], mn = a[0];
    double sum = 0;
    for (int i = 0; i < n; i++) {
        if (a[i] > mx) mx = a[i];
        if (a[i] < mn) mn = a[i];
        sum += a[i];
    }

    cout << "max = " << mx << '\n';
    cout << "min = " << mn << '\n';
    cout << "avg = " << fixed << setprecision(2) << sum / n << '\n';

    delete[] a;
    return 0;
}
```

</details>

**Q2. 用指標寫 swap**
寫 `void swapPtr(int* a, int* b)`，用指標交換兩個變數，並與參考版本比較差異。

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

void swapPtr(int* a, int* b) {
    int t = *a;
    *a = *b;
    *b = t;
}

void swapRef(int& a, int& b) {
    int t = a;
    a = b;
    b = t;
}

int main() {
    int x = 1, y = 2;
    swapPtr(&x, &y);            // 呼叫時要加 &
    cout << x << ' ' << y << '\n';   // 2 1

    swapRef(x, y);              // 呼叫時什麼都不用加
    cout << x << ' ' << y << '\n';   // 1 2
    return 0;
}
```

**差別整理**：指標版在函式內要寫 `*`、呼叫時要寫 `&`，而且可以傳 `nullptr`；參考版兩邊都乾淨，但一定要綁到某個實際存在的變數。

</details>

**Q3. 深拷貝練習**
完成 `class IntVector`：內部用 `int*` 與 `size`，支援 `push_back`（滿了就把容量加倍）、`operator[]`、`size()`，並正確實作解構子、拷貝建構子與指派運算子。寫一段 `main` 驗證複製後兩個物件互不影響。

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

class IntVector {
private:
    int* data;
    int  n;          // 目前元素個數
    int  cap;        // 容量

    void grow() {
        int newCap = (cap == 0) ? 1 : cap * 2;
        int* tmp = new int[newCap];
        for (int i = 0; i < n; i++) tmp[i] = data[i];
        delete[] data;
        data = tmp;
        cap = newCap;
    }

public:
    IntVector() : data(nullptr), n(0), cap(0) { }

    ~IntVector() { delete[] data; }

    IntVector(const IntVector& o) : data(new int[o.cap]), n(o.n), cap(o.cap) {
        for (int i = 0; i < n; i++) data[i] = o.data[i];
    }

    IntVector& operator=(const IntVector& o) {
        if (this == &o) return *this;
        delete[] data;
        n = o.n;
        cap = o.cap;
        data = new int[cap];
        for (int i = 0; i < n; i++) data[i] = o.data[i];
        return *this;
    }

    void push_back(int x) {
        if (n == cap) grow();
        data[n++] = x;
    }

    int& operator[](int i)      { return data[i]; }
    int  operator[](int i) const{ return data[i]; }
    int  size() const           { return n; }
};

int main() {
    IntVector a;
    for (int i = 1; i <= 5; i++) a.push_back(i * 10);

    IntVector b = a;        // 拷貝建構
    b[0] = 999;

    cout << a[0] << ' ' << b[0] << '\n';       // 10 999

    IntVector c;
    c = a;                  // 指派
    c[1] = 777;
    cout << a[1] << ' ' << c[1] << '\n';       // 20 777
    return 0;
}
```

注意 `grow()` 是 private：它是內部實作細節，外面不需要知道也不該呼叫。另外 `new IntVector(0 容量)` 時 `new int[0]` 是合法的（回傳一個不能解參考但可以 `delete[]` 的指標）。

</details>

**Q4. 動態二維陣列**
讀入 `n`、`m`，用「指標的指標」配置 $n \times m$ 的二維陣列，讀入內容後輸出每列總和，最後正確釋放。

```text
輸入：
2 3
1 2 3
4 5 6
輸出：
6
15
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;

    int** a = new int*[n];                 // 先配「n 個 int* 」
    for (int i = 0; i < n; i++) a[i] = new int[m];   // 每列再各配 m 個 int

    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++) cin >> a[i][j];

    for (int i = 0; i < n; i++) {
        int s = 0;
        for (int j = 0; j < m; j++) s += a[i][j];
        cout << s << '\n';
    }

    for (int i = 0; i < n; i++) delete[] a[i];   // 釋放順序與配置相反
    delete[] a;
    return 0;
}
```

**記憶法**：配置是「先外層再內層」，釋放是「先內層再外層」——先把外層砍掉就找不到內層了。

</details>

**Q5. 不用 `<cstring>` 自己實作**
自己寫 `int myStrlen(const char* s)`、`void myStrcpy(char* dest, const char* src)`、`int myStrcmp(const char* a, const char* b)`，並驗證結果與標準函式一致。

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <cstring>
using namespace std;

int myStrlen(const char* s) {
    int n = 0;
    while (s[n] != '\0') n++;
    return n;
}

void myStrcpy(char* dest, const char* src) {
    int i = 0;
    while (src[i] != '\0') { dest[i] = src[i]; i++; }
    dest[i] = '\0';                 // 千萬別忘了補結尾
}

int myStrcmp(const char* a, const char* b) {
    int i = 0;
    while (a[i] != '\0' && a[i] == b[i]) i++;
    return a[i] - b[i];             // 相同時兩邊都是 '\0'，差為 0
}

int main() {
    const char* s = "Hello";
    char t[20];

    cout << myStrlen(s) << ' ' << strlen(s) << '\n';
    myStrcpy(t, s);
    cout << t << '\n';
    cout << myStrcmp("abc", "abd") << ' ' << strcmp("abc", "abd") << '\n';
    return 0;
}
```

寫過這三個函式之後，你會非常清楚「C 風格字串就是一段以 `'\0'` 結尾的 char 陣列」這句話的意思。

</details>

---

[← 11/12｜運算子重載、friend 與 string（Ch 8、Ch 9）](/2026/09/09/nsysu-c-programming/1112-operator-string/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [11/26｜分離編譯與命名空間（Ch 11） →](/2026/09/09/nsysu-c-programming/1126-separate-compilation/)
