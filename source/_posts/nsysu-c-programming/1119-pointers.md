---
title: 11/19｜指標、動態記憶體與 C 風格字串（Ch 9、Ch 10）
date: 2026-09-10
updated: 2026-09-12
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

**這週要會什麼**

```text
指標是什麼 → nullptr → new / delete 與動態陣列 → 指標與陣列 → 指標的指標
→ 指標當參數 → this 與 -> → 回傳指標的函式 → 淺拷貝 vs 深拷貝（三法則）
→ C 風格字串 → argc / argv
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
    cout << &a << '\n';   // a 的位址
    cout << p  << '\n';   // 同上     ：p 存的就是 a 的位址
    cout << *p << '\n';   // 5       ：「去 p 指的地方，把東西拿出來」

    *p = 10;              // 透過 p 改 a
    cout << a  << '\n';   // 10
    return 0;
}
```

某一次的執行結果：

```text
5
0x7ffe12f045cc
0x7ffe12f045cc
5
10
```

位址預設用**十六進位**印出：`0x` 是十六進位的開頭記號，後面每一位可以是 `0`-`9` 或 `a`-`f`（`a` 代表 10、`f` 代表 15）。數值每次執行都不一樣，也不重要——重要的是**第 2、3 行一定相同**。

執行完 `*p = 10;` 之後，記憶體長這樣：

```text
       變數 a                   指標 p
  ┌──────────────┐       ┌────────────────┐
  │      10      │ ◀─────│ 0x7ffe12f045cc │
  └──────────────┘       └────────────────┘
  位址 0x7ffe12f045cc
```

`p` 這個信箱裡裝的不是數字，是**另一個信箱的編號**——這就是指標的全部。

`*` 和 `&` 各有兩種意思，看它出現在哪裡：

| 寫法 | 出現位置 | 意思 |
| --- | --- | --- |
| `int* p;` | 宣告時 | 「p 是指向 int 的指標」 |
| `&a` | 運算式中 | 取 a 的位址 |
| `*p` | 運算式中 | 取出 p 指的東西（**解參考 dereference**） |
| `int& r = a;` | 宣告時 | r 是 a 的別名（10/01 學過）；同一個 `&`，**宣告時是型別的一部分，運算式裡才是取位址** |

> **雷區 ①：`int* p, q;` 只有 `p` 是指標**
> `int* p;`、`int *p;`、`int * p;` 對編譯器**完全一樣**，空白位置只是排版習慣；關鍵在於 `*` 是跟著**變數名**走的。所以 `int* p, q;` 的意思是「`*p` 是 int、`q` 是 int」——`q` 就變成普通整數了。兩個解法：**一行只宣告一個指標**，或先幫指標型別取個名字——
> ```cpp
> typedef int* IntPtr;      // 傳統寫法：幫「int*」這個型別取一個新名字叫 IntPtr
> using   IntPtr = int*;    // C++11 寫法，意思完全一樣（跟 using namespace std; 只是剛好共用同一個字，用途不同）
> IntPtr p, q;              // 現在 p、q 都是指標
> ```

## 空指標 `nullptr`

```cpp
int* p = nullptr;        // 明確表示「目前不指向任何東西」
if (p != nullptr) cout << *p;    // 使用前一定要檢查
```

- `nullptr` 是 C++11 的寫法，比舊的 `NULL` 或 `0` 安全，**請一律用它**。
- **對空指標解參考**（`*p` 當 `p` 是 `nullptr`）會直接 `Segmentation fault`。

## 動態記憶體：`new` 與 `delete`

10/29 的 `vector` 能邊跑邊長大，靠的就是這節要拆開來看的 `new` 和 `delete`——它讓你在**執行時**才決定要多少記憶體。（**平常寫程式請直接用 `vector`**，學 `new` / `delete` 是為了看懂課本與考題。）

> **記憶體大致分兩塊**：**stack**（堆疊）放區域變數，函式一結束就整批回收；**heap**（堆積，又叫 free store）是 `new` 拿記憶體的地方，除非你 `delete`，否則它一直都在。這就是等一下「`new` 出來的東西可以安全回傳、區域陣列不行」的原因。

```cpp
int* p = new int(7);   // 跟系統要一格 int，初始化為 7
cout << *p << '\n';    // 7
delete p;              // 用完要還
p = nullptr;           // 好習慣：還完就把指標清乾淨
```

但 `new` 真正的用途是**動態陣列**：

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

輸入 `3` 再輸入 `10 20 30`，輸出：

```text
60
```

**四條鐵律：**

1. **每個 `new` 都要有一個對應的 `delete`**，否則記憶體洩漏（memory leak）。
2. **`new[]` 配對 `delete[]`**，`new` 配對 `delete`，配錯是未定義行為。
3. **`delete` 之後不要再用那個指標**（**懸空指標 dangling pointer**）——`delete p;` 之後寫 `cout << *p;` 編譯得過、可能還印出看似正常的數字，但那塊記憶體已經還掉了，內容隨時會變。習慣上 `delete` 完馬上 `p = nullptr;`，之後誤用會直接 crash，比印出假資料好抓。
4. **`delete p;` 當 `p` 是 `nullptr` 時什麼都不會發生**（安全的空操作），所以解構子裡不必先寫 `if (p != nullptr)`。注意這跟「對空指標解參考 `*p` 會當掉」是兩回事。

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

## 指標的指標

指標也是變數，自己也住在某個信箱裡、也有位址，那就能再用另一個指標記住它。「指向 `int*` 的指標」型別寫成 `int**`。

兩個關鍵：

- `new T[n]` 回傳的型別是 `T*`：`T` 是 `int` 時 `new int[n]` 回傳 `int*`；`T` 是 `int*` 時 `new int*[n]` 回傳的就是 `int**`——配出來那排格子裡裝的是**指標**，不是整數。
- `a[i]` 取出第 i 個 `int*`（第 i 列的開頭），再 `[j]` 才走到那一列的第 j 格；也就是 `a[i][j]` 等同 `*(*(a + i) + j)`。

最常見的用途是**動態二維陣列**：先配一排指標，每個指標再各自指向一列 int。

```cpp
int n = 2, m = 3;
int** a = new int*[n];                       // 配 n 個 int*
for (int i = 0; i < n; i++) a[i] = new int[m];   // 每列再各配 m 個 int

a[1][2] = 7;                                 // 第 1 列的第 2 格

for (int i = 0; i < n; i++) delete[] a[i];   // 先還內層
delete[] a;                                  // 再還外層
```

```text
   a ──▶ ┌─────────┐
         │ a[0] ───┼──▶ [ ][ ][ ]   ← 第 0 列的 m 個 int
         │ a[1] ───┼──▶ [ ][ ][ ]   ← 第 1 列
         └─────────┘
          n 個 int*
```

## 指標當參數

```cpp
#include <iostream>
using namespace std;

void addOne(int* p) { (*p)++; }      // 括號不能省：沒括號的 *p++ 等於 *(p++)，動到的是「指標」不是「值」

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

11/12 重載 `++` 時用過的 `*this`，現在可以完整解釋了：`this` 是每個成員函式裡都有的隱藏指標，**指向呼叫它的那個物件**；`*this` 就是解參考之後的「物件本身」。

```cpp
class Counter {
private:
    int v;
public:
    Counter(int v = 0) : v(v) { }    // 11/12 那個 Counter，這裡繼續用

    Counter& add(int n) {
        v += n;
        return *this;                // 回傳「自己」，才能串接呼叫
    }
    int get() const { return v; }
};

Counter c;
c.add(3).add(5);        // 因為 add 回傳自己的參考，所以能連著寫
cout << c.get();        // 8
```

## 回傳指標的函式

前面說過「函式不能回傳區域陣列」，因為區域變數住在 stack，函式一結束那塊空間就被收回去。但 `new` 要來的記憶體住在 heap，只認 `delete`，函式結束不會動它，所以可以安全回傳：

```cpp
#include <iostream>
using namespace std;

int* makeSquares(int n) {          // 回傳一個新配置的動態陣列
    int* a = new int[n];
    for (int i = 0; i < n; i++) a[i] = i * i;
    return a;                      // 安全：這塊記憶體在 heap 上
}

int main() {
    int* arr = makeSquares(5);
    for (int i = 0; i < 5; i++) cout << arr[i] << ' ';
    cout << '\n';

    delete[] arr;                  // 呼叫端負責歸還！
    return 0;
}
```

輸出：

```text
0 1 4 9 16
```

> **責任歸屬**：記憶體是函式配的，卻要呼叫端 `delete[]`。寫這種函式一定要在註解裡寫明「**呼叫端負責釋放**」，不然漏掉就是洩漏。

## 淺拷貝與深拷貝（本節最重要的觀念）

當類別內部有 `new` 出來的資源時，預設的複製行為會出事。下面這個 `MyArray` 其實就是簡化版的 `vector`——`vector` 內部做的正是這些事：

```cpp
#include <iostream>
using namespace std;

class MyArray {
private:
    int* data;
    int  n;
public:
    MyArray(int size) : data(new int[size]), n(size) { }
    ~MyArray() { delete[] data; }        // 解構子：物件消失時自動還記憶體
};

int main() {
    MyArray a(10);
    MyArray b = a;       // 危險！
    return 0;            // ← 崩潰發生在這一行之後
}
```

編譯器自動產生的複製行為是**淺拷貝（shallow copy）**：只把 `data` 這個「位址」複製過去，兩個物件指向**同一塊記憶體**。正確做法是**深拷貝（deep copy）**：自己配一塊新的，把內容一個一個抄過去。

```text
淺拷貝（預設）：              深拷貝（自己寫）：
  a.data ──┐                   a.data ──▶ [ 記憶體 A ]
           ├──▶ [ 同一塊 ]     b.data ──▶ [ 記憶體 B ]
  b.data ──┘                              （內容相同、各自獨立）
  → 兩邊各 delete[] 一次
  → 同一塊被還兩次 → 崩潰
```

實際跑上面那段程式，終端機會看到：

```text
free(): double free detected in tcache 2
Aborted (core dumped)
```

注意崩潰的**時機**：`a`、`b` 活著時完全正常，是**離開 `main`、兩個解構子各跑一次 `delete[]`** 的那一刻才爆炸——出事的地方離寫錯的地方很遠，所以難抓。（10/22 說解構子「真正重要的用途留到指標那節」，就是指這個。）

要做深拷貝，需要自己寫三個函式，合稱 **Rule of Three（三法則）**。

> 其中**拷貝建構子**是新東西：長得像建構子，但參數是 `const 自己的型別&`。它在三種場合被自動呼叫：
> ① `MyArray b = a;` 或 `MyArray b(a);`　② 物件**傳值**進函式時　③ 函式**回傳物件**時（這條課本與考題會寫，但實測印不出來——g++ 會把回傳值直接就地建構在呼叫端，省掉這次複製）。
> 這也是為什麼 10/01 說「大物件要用 `const&` 傳」——不然每次呼叫都做一次深拷貝。

下面是補完版（比上面那個壞掉的版本多了初始化、`operator[]`、`size()`，方便驗證）：

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

    // ③ 指派運算子：已存在的物件被重新指派時呼叫
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

三個容易被跳過的細節：

- `operator=` 回傳 `MyArray&` 並 `return *this`，是為了讓 `a = b = c` 能成立——跟 11/12 講 `<<` 要回傳 `ostream&` 同一個理由。
- `if (this == &other)` 不能省。`other` 是參考（別名），`&other` 取到的就是**它代表的那個物件**的位址；兩個指標用 `==` 比是在問「指向同一個地方嗎」。少了這行，`a = a;` 會先 `delete[]` 掉自己的 `data`，再從**已經還掉的記憶體**抄回來，抄到垃圾。
- **為什麼 `other.data` 碰得到 private？** `private` 管的是「哪段程式碼」能碰，不是「哪個物件」能碰。只要程式寫在 `MyArray` 類別裡面，就看得見**任何一個** `MyArray` 物件的 private 成員，包括參數傳進來的別人——所以拷貝建構子不需要 `friend`。

**口訣：只要類別裡有 `new`，就要想到「解構子、拷貝建構子、指派運算子」這三個。** 少寫任何一個，程式都可能在某個時候莫名崩潰。

## C 風格字串（C-string）

在 `string` 類別出現之前，C++ 用「以 `'\0'` 結尾的 char 陣列」表示字串：

```cpp
#include <iostream>
#include <cstring>
using namespace std;

int main() {
    char s[20] = "Hello";       // 實際佔 6 格：'H','e','l','l','o','\0'

    cout << strlen(s) << '\n';  // strlen 不含結尾的 '\0'
    cout << s << '\n';

    char t[20];
    strcpy(t, s);               // 複製，不能寫 t = s
    strcat(t, " NSYSU");        // 接在後面
    cout << t << '\n';

    if (strcmp(s, t) == 0) cout << "same\n";
    else                   cout << "different\n";
    return 0;
}
```

輸出：

```text
5
Hello
Hello NSYSU
different
```

> **雷區 ②：`cout` 對 `char*` 是特例**
> 本篇第一節 `cout << p;` 印的是位址，但 `s`、`t` 這種 `char*` 或 char 陣列，`cout` 會從那個位址一路印到 `'\0'` 為止，也就是印出**整串字**。想看它的位址得寫 `cout << (void*)s;`。

| 函式（需 `<cstring>`） | 作用 |
| --- | --- |
| `strlen(s)` | 長度（不含 `'\0'`） |
| `strcpy(dest, src)` | 複製 |
| `strcat(dest, src)` | 串接 |
| `strcmp(a, b)` | 比較，相同回傳 0；`a < b` 回傳負數 |

**`const` 放在指標前面**：`const char* s` 讀作「s 指向的內容不可以被改」，跟 10/08 的 `const int a[]` 是同一件事（`int a[]` 本來就等同 `int* a`）。所以 `strcpy(char* dest, const char* src)` 裡，要被寫入的 `dest` 不能加 `const`，只被讀取的 `src` 要加。字串字面值 `"Hello"` 存在唯讀區，用指標接它一定要寫 `const char* s = "Hello";`。

> **雷區 ③：C-string 不能用 `=` 和 `==`**
> ```cpp
> char a[10] = "abc", b[10];
> b = a;              // 編譯錯誤
> if (a == b) { }     // 編譯得過，但比的是「位址」不是內容！
> ```
> 一定要用 `strcpy` 和 `strcmp`。**這就是 `string` 類別存在的理由**——它讓 `=`、`==`、`+` 都正常運作。

> **雷區 ④：陣列大小要夠**
> `char s[5] = "Hello";` 連編譯都過不了——g++ 會報 `error: initializer-string for 'char [5]' is too long`，因為 `"Hello"` 連同結尾的 `'\0'` 要 6 格。真正危險的是編譯器擋不住的那種：`char s[5];` 之後 `strcpy(s, "Hello");` 編譯一聲不響，執行時卻把第 6 個位元組寫到別人家去。`strcpy`、`strcat` 都**不檢查目標空間夠不夠**，這是 C 語言最經典的安全漏洞來源。

**兩者互轉**（這段用到 `string` 和 `strlen`，兩個 include 都要：`#include <string>`、`#include <cstring>`）：

```cpp
string cpp = "Hello";
const char* c = cpp.c_str();     // string → C-string
string back = c;                 // C-string → string（直接指派即可）
cout << strlen(c) << ' ' << back.size() << '\n';   // 5 5
```

`c_str()` 回傳的 `const char*` 指向 `string` 內部那份以 `'\0'` 結尾的資料：**只能讀不能改，也不需要、更不可以 `delete`**；`cpp` 一改動或消失它就失效，別留著到處用。（12/03 開檔案時還會再遇到它。）

## 命令列參數：`argc` 與 `argv`

到目前為止 `main` 都寫成 `int main()`，其實它可以接收你在終端機上打的參數：

```cpp
#include <iostream>
using namespace std;

int main(int argc, char* argv[]) {
    cout << "argc = " << argc << '\n';
    for (int i = 0; i < argc; i++)
        cout << "argv[" << i << "] = " << argv[i] << '\n';
    return 0;
}
```

編譯成 `demo` 之後執行 `./demo hello 123`，輸出：

```text
argc = 3
argv[0] = ./demo
argv[1] = hello
argv[2] = 123
```

- `argc`（argument count）：參數個數，**至少是 1**。
- `argv`（argument vector）：`char* argv[]` 從名字往外讀——`argv` 是陣列（`[]`），每格的型別是 `char*`，也就是剛學的 C 風格字串。所以它就是「一排字串」，`strlen`、`strcmp` 都能直接用在 `argv[i]` 上；寫成等價的 `char** argv` 也可以。`argv[0]` 永遠是程式自己的名字。
- 參數進來都是**字串**，要當數字用得自己轉：`atoi(argv[1])`（吃 C 風格字串，需 `#include <cstdlib>`，轉不出來回傳 0）或 `stoi(argv[1])`（吃 `string`，需 `#include <string>`，轉不出來會丟例外）。

## 本週重點回顧

- 指標就是**存位址的變數**：`&a` 取位址、`*p` 取出指向的內容；`int* p, q;` 只有 `p` 是指標。
- **`new` 配 `delete`、`new[]` 配 `delete[]`**，漏掉就洩漏、配錯就是未定義行為；`delete` 後把指標設成 `nullptr`（而 `delete nullptr` 本身是安全的空操作）。
- 陣列名就是指向第 0 格的指標，`p[i]` 等於 `*(p + i)`；`p + 1` 是「下一個元素」而不是「下一個 byte」。`int**` 是「指向 `int*` 的指標」，動態二維陣列就靠它。
- 預設的複製是**淺拷貝（兩個物件共用同一塊記憶體，會 double free）**；**只要類別裡有 `new`，就要自己寫解構子、拷貝建構子、指派運算子**（三法則）做深拷貝。
- C 風格字串是以 `'\0'` 結尾的 char 陣列，**不能用 `=` 和 `==`**，要用 `strcpy` / `strcmp`；`const char*` 表示「指到的內容不能改」。

## 本週練習題

**Q1. 動態陣列的統計**
讀入 `n`（`1 ≤ n ≤ 1000`），用 `new int[n]` 配置陣列，讀入 `n` 個數字後輸出最大值、最小值與平均（兩位小數），最後正確釋放記憶體。

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

**差別**：指標版函式內要寫 `*`、呼叫時要寫 `&`，好處是可以傳 `nullptr`；參考版兩邊都乾淨，代價是一定要綁到某個實際存在的變數。

</details>

**Q3. 深拷貝練習**
完成 `class IntVector`：內部用一個 `int*` 加上兩個整數——**目前元素個數**與**容量**（兩者不同：容量是已經配好的格子數，元素個數是真正塞了幾格），支援 `push_back`（滿了就把容量加倍）、`operator[]`、`size()`，並正確實作解構子、拷貝建構子與指派運算子。寫一段 `main` 驗證複製後兩個物件互不影響。

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

三個說明：

- `data[n++] = x;` 等同於兩行 `data[n] = x;  n++;`——後置 `++` 的值是**加之前**的 `n`，所以是「寫進目前的最後一格之後，長度再加一」。看不習慣就拆成兩行，完全等價。
- `grow()` 是 private：它是內部實作細節，外面不需要知道也不該呼叫。
- 拷貝一個空的 `IntVector` 時，`new int[o.cap]` 會執行到 `new int[0]`——這是合法的，會拿到一個不能解參考、但可以 `delete[]` 的指標，所以不用特別加判斷。

</details>

**Q4. 動態二維陣列**
讀入 `n`、`m`，用〈指標的指標〉那節的方法配置 $n \times m$ 的二維陣列，讀入內容後輸出每列總和，最後正確釋放。

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

    int** a = new int*[n];                 // 先配「n 個 int*」
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
自己寫 `int myStrlen(const char* s)`、`void myStrcpy(char* dest, const char* src)`、`int myStrcmp(const char* a, const char* b)`，並驗證結果與標準函式的**正負號**一致。

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
    return a[i] - b[i];   // 標準只保證正負號：小於回負、等於回 0、大於回正，數值不保證相同
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

三個函式的骨架都是「從頭走到 `'\0'` 為止」——`myStrcpy` 最容易錯的是忘記最後補 `dest[i] = '\0'`。

</details>

---

[← 11/12｜運算子重載、friend 與 string（Ch 8、Ch 9）](/2026/09/09/nsysu-c-programming/1112-operator-string/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [11/26｜分離編譯與命名空間（Ch 11） →](/2026/09/09/nsysu-c-programming/1126-separate-compilation/)
