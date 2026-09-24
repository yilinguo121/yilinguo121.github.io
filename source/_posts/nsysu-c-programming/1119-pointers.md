---
title: 11/19｜指標、動態記憶體與 C 風格字串（Ch 9、Ch 10）
date: 2026-09-10
updated: 2026-09-12
permalink: 2026/09/09/nsysu-c-programming/1119-pointers/
cover: /images/code-cover.jpg
categories: [程式設計]
tags: [C++, 中山大學, 自學指南]
description: 中山大學 C 程式設計自學指南 Ch 9–10：指標與位址、nullptr、new／delete 動態記憶體、指標與陣列、-> 與 this、淺拷貝與深拷貝、C 風格字串與 argc／argv。
toc: true
comments: true
hidden: true
---

[← 11/12｜運算子重載、friend 與 string（Ch 8、Ch 9）](/2026/09/09/nsysu-c-programming/1112-operator-string/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [11/26｜分離編譯與命名空間（Ch 11） →](/2026/09/09/nsysu-c-programming/1126-separate-compilation/)

> 對應課本習題：Ch9: 2, 4, 6, 10；Ch10: 1, 3, 4, 8

<details>
<summary><b>這幾題各要用到什麼（動手前先看）</b></summary>

主課的上機考幾乎就是這些題目，所以每一題都自己寫過。下表是每題需要的東西（我的歸納，不是題目本文）與本系列對應的練習：

| 課本題號 | 要用到的東西 | 先練 |
| --- | --- | --- |
| Ch9-2 | 逐字元依種類做不同的轉換——`cctype`、`%` | 11/12 Q5、Q8 |
| Ch9-4 | 把一行裡符合條件的單字換掉，大小寫要保留——切單字、`substr` | 11/12 Q4 |
| Ch9-6 | 每行用固定的分隔符拆成兩欄再重排——`find`／`substr`＋讀檔 | 11/12 Q10、12/03 Q7 |
| Ch9-10 | 問答類別（題目、答案、金額）放進 vector 逐題比對——類別＋`string ==` | 10/29 Q2 |
| Ch10-1 | 二維動態陣列類別：`double*` 加列數行數、建構子、存取函式、`friend` 的 `+` | Q4、Q3 |
| Ch10-3 | 頭尾兩個指標往中間掃 C 字串數單字——指標算術 | 正文〈指標與陣列〉、Q5 |
| Ch10-4 | 類別含動態字串陣列：指派運算子、解構子——三法則 | Q3 |
| Ch10-8 | 類別含動態陣列與拷貝建構子，建立多個物件——三法則 | Q3 |

</details>

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

陣列名稱在大多數運算式裡會**自動轉成**「指向第 0 個元素的指標」（陣列和指標仍是不同型別：`sizeof(a)` 是整個陣列的大小，`sizeof(p)` 只是一個指標的大小）：

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

> 進階補充：`operator=` 更講究的寫法是**先 `new` 好新的、抄完，最後才 `delete[]` 舊的**——萬一 `new` 失敗（丟出例外），物件還保有原本的資料，不會留下一個指向已釋放記憶體的 `data`。本課程範圍內上面的寫法就可以。

## C 風格字串（C-string）

在 `string` 類別出現之前，C++ 用「以 `'\0'` 結尾的 char 陣列」表示字串：

```cpp
#include <iostream>
#include <cstring>
using namespace std;

int main() {
    char s[20] = "Hello";       // 陣列有 20 格；"Hello" 加結尾的 '\0' 用掉 6 格

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

`main` 可以寫成 `int main(int argc, char* argv[])`，接收你在終端機上打的參數：執行 `./demo hello 123` 時，`argc` 是 3（參數個數，程式名自己算一個，所以至少是 1），`argv` 是一排 C 風格字串——`argv[0]` 是 `"./demo"`、`argv[1]` 是 `"hello"`、`argv[2]` 是 `"123"`。參數進來都是字串，要當數字用得自己轉（`atoi(argv[2])`，在 `<cstdlib>`）。這學期的題目都從 `cin` 讀輸入，認得這個寫法就好。

## 本週重點回顧

- 指標就是**存位址的變數**：`&a` 取位址、`*p` 取出指向的內容；`int* p, q;` 只有 `p` 是指標。
- **`new` 配 `delete`、`new[]` 配 `delete[]`**，漏掉就洩漏、配錯就是未定義行為；`delete` 後把指標設成 `nullptr`（而 `delete nullptr` 本身是安全的空操作）。
- 陣列名在運算式裡會自動轉成指向第 0 格的指標（兩者型別仍不同，`sizeof` 的結果不一樣），`p[i]` 等於 `*(p + i)`；`p + 1` 是「下一個元素」而不是「下一個 byte」。`int**` 是「指向 `int*` 的指標」，動態二維陣列就靠它。
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

**差別**：指標版函式內要寫 `*`、呼叫時要寫 `&`。指標型別雖然能表示「沒指向任何東西」（`nullptr`），但這個 `swapPtr` 一進來就解參考，**兩個參數都必須指向真正存在的變數**，傳 `nullptr` 會直接 Segmentation fault——想允許空值就得自己先 `if (a == nullptr)` 檢查。參考版兩邊都乾淨，而且參考天生不會是空的，這正是 10/01 推薦用參考的理由。

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
    // 標準規定要把字元當 unsigned char 比（char 可能有負值），而且只保證正負號
    return static_cast<unsigned char>(a[i]) - static_cast<unsigned char>(b[i]);
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

**實驗課題型加練**
Q6–Q8、Q10 的**題型**取自去年（2025）第 9、10 週實驗課的課堂練習（今年的投影片還沒出，題目可能會換），Q9 是我自己出的補充題。去年指標這週實驗課出了**鏈結串列（linked list）**的堆疊與佇列——這個資料結構課本要到 Ch17 才教，但實驗課直接拿它來練 `new`／`delete` 和 `->`，所以這裡先用兩題把它講完。題目不是我原創的：練的東西跟去年那幾題一樣，但數值、規則、範例資料和解答都是我自己重寫的，不是原題。

**Q6. 給值與給址的差別**
宣告 `int i1 = 3, i2 = 5, i3 = 7` 與三個指標 `p1`、`p2`、`p3` 分別指向它們。依序執行 `p2 = p1`、`*p1 = *p3`、`i3 = 20`、`p3 = p2`，每一步之後印出三個變數的值與三個指標指到的值，最後判斷 `p1 == p3` 與 `*p2 == i2` 是否成立。要能口頭說明每一步發生了什麼。

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

void show(const char* step, int i1, int i2, int i3, int* p1, int* p2, int* p3) {
    cout << step << "  i1=" << i1 << " i2=" << i2 << " i3=" << i3
         << "  *p1=" << *p1 << " *p2=" << *p2 << " *p3=" << *p3 << '\n';
}

int main() {
    int i1 = 3, i2 = 5, i3 = 7;
    int *p1 = &i1, *p2 = &i2, *p3 = &i3;
    show("start    ", i1, i2, i3, p1, p2, p3);
    p2 = p1;    show("p2 = p1  ", i1, i2, i3, p1, p2, p3);   // 改「指向」：p2 現在指著 i1，i2 沒動
    *p1 = *p3;  show("*p1 = *p3", i1, i2, i3, p1, p2, p3);   // 透過 p1 改值：改到的是 i1
    i3 = 20;    show("i3 = 20  ", i1, i2, i3, p1, p2, p3);   // 改「值」：p3 指的那格跟著變
    p3 = p2;    show("p3 = p2  ", i1, i2, i3, p1, p2, p3);   // 三個指標現在都指著 i1
    cout << "p1 == p3 ? " << (p1 == p3 ? "yes" : "no") << '\n';
    cout << "*p2 == i2 ? " << (*p2 == i2 ? "yes" : "no") << '\n';
    return 0;
}
```

輸出：

```text
start      i1=3 i2=5 i3=7  *p1=3 *p2=5 *p3=7
p2 = p1    i1=3 i2=5 i3=7  *p1=3 *p2=3 *p3=7
*p1 = *p3  i1=7 i2=5 i3=7  *p1=7 *p2=7 *p3=7
i3 = 20    i1=7 i2=5 i3=20  *p1=7 *p2=7 *p3=20
p3 = p2    i1=7 i2=5 i3=20  *p1=7 *p2=7 *p3=7
p1 == p3 ? yes
*p2 == i2 ? no
```

四句話對應四種操作：`p2 = p1` 改**指向**，`i2` 完全沒動，只是沒人指著它了；`*p1 = *p3` 透過指標改**值**，改到的是 `i1`（此時 `p2` 也指著 `i1`，所以 `*p2` 跟著變）；`i3 = 20` 直接改值，`p3` 指的那格跟著變；`p3 = p2` 之後三個指標都指著 `i1`，所以 `p1 == p3` 為真（比的是位址），而 `*p2` 是 `i1` 的 7、不是 `i2` 的 5。實驗課檢查時常會被指著某一行問「這時候 p2 指誰」，要答得出來。

</details>

**Q7. 用鏈結串列做堆疊**
**鏈結串列**是「每個節點除了存資料，還存一個指向下一個節點的指標」的資料結構：

```cpp
struct Node {
    int value;
    Node* next;     // 指向下一個節點；最後一個節點的 next 是 nullptr
};
```

節點不放在陣列裡，而是需要時 `new` 一個、用 `next` 串起來，所以長度不必事先決定。**堆疊（stack）**是「後進先出」：只從同一端放入（push）與取出（pop）。用鏈結串列實作時只要記住最頂端的節點 `top`：push 是「新節點的 `next` 指向舊的 `top`，再把 `top` 換成新節點」；pop 是「`top` 往下移一格，把原本的頂端 `delete`」。

寫 `class Stack`，提供 `push(int)`、`pop()`（空的回傳 `false`）、`display()`（從頂端印到底），並在解構子釋放所有節點。不能用陣列或 `vector`。反覆讀入 `push 值`／`pop`，每次操作後印出內容，`end` 結束。

```text
輸入：
push 1
push 5
push 4
pop
pop
pop
pop
end
輸出：
top -> 1
top -> 5 1
top -> 4 5 1
top -> 5 1
top -> 1
top ->
empty
top ->
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <string>
using namespace std;

struct Node {
    int value;
    Node* next;          // 指向下一個節點；最後一個節點是 nullptr
};

class Stack {
public:
    Stack() : top(nullptr) {}
    ~Stack() {                            // 物件消失時把所有節點還給系統
        while (top != nullptr) pop();
    }
    void push(int v) {
        Node* n = new Node;               // 配一個新節點
        n->value = v;
        n->next = top;                    // 新節點壓在原本的頂端上面
        top = n;                          // 頂端換成新節點
    }
    bool pop() {                          // 空的就回傳 false
        if (top == nullptr) return false;
        Node* old = top;
        top = top->next;                  // 頂端往下移一格
        delete old;                       // 再釋放原本的頂端
        return true;
    }
    void display() const {
        cout << "top ->";
        for (Node* p = top; p != nullptr; p = p->next) cout << ' ' << p->value;
        cout << '\n';
    }
private:
    Node* top;
};

int main() {
    Stack s;
    string cmd;
    while (cin >> cmd && cmd != "end") {
        if (cmd == "push") { int v; cin >> v; s.push(v); }
        else if (cmd == "pop") { if (!s.pop()) cout << "empty\n"; }
        s.display();
    }
    return 0;
}
```

三個最容易寫錯的細節：`push` 裡**先** `n->next = top` **再** `top = n`，順序反了舊的串列就丟了；`pop` 先用 `old` 記住頂端、移動 `top`，最後才 `delete old`——`delete` 完再去讀 `top->next` 就是本篇雷區的懸空指標；解構子把 `pop` 呼叫到空為止，程式結束時才不會漏記憶體。走訪用 `for (Node* p = top; p != nullptr; p = p->next)`，這個形狀之後所有鏈結串列題都一樣。

</details>

**Q8. 用鏈結串列做佇列**
**佇列（queue）**是「先進先出」：從尾巴放入、從頭取出，所以要同時記住 `head` 和 `tail` 兩個指標。寫 `class Queue`，介面與 Q7 相同（`push`、`pop`、`display`、解構子），不能用陣列或 `vector`。

```text
輸入：
push 1
push 5
push 4
pop
push 9
pop
pop
pop
end
輸出：
head -> 1 <- tail
head -> 1 5 <- tail
head -> 1 5 4 <- tail
head -> 5 4 <- tail
head -> 5 4 9 <- tail
head -> 4 9 <- tail
head -> 9 <- tail
head -> <- tail
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <string>
using namespace std;

struct Node {
    int value;
    Node* next;
};

class Queue {
public:
    Queue() : head(nullptr), tail(nullptr) {}
    ~Queue() { while (head != nullptr) pop(); }
    void push(int v) {                       // 從尾巴進
        Node* n = new Node;
        n->value = v;
        n->next = nullptr;
        if (tail == nullptr) head = tail = n;   // 原本是空的：頭尾都是它
        else { tail->next = n; tail = n; }      // 接在尾巴後面，尾巴往後移
    }
    bool pop() {                             // 從頭出
        if (head == nullptr) return false;
        Node* old = head;
        head = head->next;
        if (head == nullptr) tail = nullptr;    // 拿光了：尾巴也要清掉
        delete old;
        return true;
    }
    void display() const {
        cout << "head ->";
        for (Node* p = head; p != nullptr; p = p->next) cout << ' ' << p->value;
        cout << " <- tail\n";
    }
private:
    Node* head;
    Node* tail;
};

int main() {
    Queue q;
    string cmd;
    while (cin >> cmd && cmd != "end") {
        if (cmd == "push") { int v; cin >> v; q.push(v); }
        else if (cmd == "pop") { if (!q.pop()) cout << "empty\n"; }
        q.display();
    }
    return 0;
}
```

跟堆疊只差兩個邊界狀況，也正是最容易寫錯的地方：**推進空佇列**時 `head` 和 `tail` 都要指向新節點（不然 `tail->next` 會對 `nullptr` 解參考）；**取出最後一個**之後 `tail` 也要清成 `nullptr`，否則它指著已經 `delete` 的節點，下一次 `push` 就寫到壞掉的記憶體。

</details>

**Q9. 迷你資料庫（`char**`）**
第一行是資料筆數 `n`。接著是指令：`INSERT 長度` 換行後接一個那個長度的字串，或 `OUTPUT`（把所有資料**倒序**印出並結束）。限制：只能用 `char**` 與 `new` 配置空間，**不能用任何陣列宣告**（`char rows[100][100]`、`char* rows[100]` 都不行）。

```text
輸入：
3
INSERT 3
abc
INSERT 5
abcde
INSERT 6
abcdef
OUTPUT
輸出：
abcdef
abcde
abc
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <cstring>
using namespace std;

int main() {
    int n;
    cin >> n;
    char** rows = new char*[n];            // n 個「指向字串的指標」
    int count = 0;
    char cmd[16];
    while (cin >> cmd) {
        if (strcmp(cmd, "INSERT") == 0) {
            int len;
            cin >> len;
            rows[count] = new char[len + 1];   // +1 給結尾的 '\0'
            cin >> rows[count];
            count++;
        } else if (strcmp(cmd, "OUTPUT") == 0) {
            for (int i = count - 1; i >= 0; i--) cout << rows[i] << '\n';
            break;
        }
    }
    for (int i = 0; i < count; i++) delete[] rows[i];   // 先內層
    delete[] rows;                                      // 再外層
    return 0;
}
```

`char** rows` 是「指向（指向字元的指標）的指標」：外層 `new char*[n]` 配 `n` 個指標，每收到一筆再 `new char[len + 1]` 配那一筆的空間，`+1` 是給 `'\0'`。`cin >> rows[count]` 會把一個單字（讀到空白為止）連同結尾的 `'\0'` 寫進 char 陣列——它不檢查空間夠不夠，所以一定要先配好 `len + 1` 格。釋放順序跟本週 Q4 的二維陣列一樣：先每一列、再外層。這題的重點就是把「陣列的陣列」換成「指標的指標」寫一次。

</details>

**Q10. 關鍵字計數（`strtok`）**
第一行是一段英文（不超過 10000 字元），之後每行一個關鍵字（最多 10 個），讀到輸入結束。印出每個關鍵字在文章中出現幾次：必須整個單字相同（`make` 不算 `makefile`）、不分大小寫。單字的定義：字母、數字和單引號以外的字元（空白、`, . ; : ! ? " ( ) -`）都算分隔符號，所以 `don't` 是一個字、`well-known` 是兩個字。請用 C 風格字串與 `<cstring>` 處理。

`<cstring>` 有一個切單字的工具 `strtok(字串, 分隔字元集合)`：第一次呼叫傳入字串，它會把第一個單字的結尾改成 `'\0'` 並回傳單字開頭；之後每次傳 `nullptr` 就接著切下一個，切完回傳 `nullptr`。它會**直接改壞原字串**，所以要切的字串不能是 `const`。

```text
輸入：
Make once, run once; then make clean and make again. Don't forget the Makefile!
make
once
don't
makefile
clean
file
輸出：
make: 3
once: 2
don't: 1
makefile: 1
clean: 1
file: 0
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <cstring>
#include <cctype>
using namespace std;

void toLower(char* s) {
    for (int i = 0; s[i] != '\0'; i++)
        s[i] = static_cast<char>(tolower(static_cast<unsigned char>(s[i])));   // 11/12 講過的寫法
}

int main() {
    const int MAX_TEXT = 10001, MAX_KEY = 10, MAX_LEN = 51;
    const char* SEP = " ,.;:!?\"()-";        // 這些字元都算分隔；單引號不在裡面
    char text[MAX_TEXT];
    cin.getline(text, MAX_TEXT);           // 第一行整段文字
    toLower(text);

    char keys[MAX_KEY][MAX_LEN];
    int k = 0;
    while (k < MAX_KEY && cin >> keys[k]) { toLower(keys[k]); k++; }

    int count[MAX_KEY] = {};
    // strtok 會把 text 沿著分隔字元切開，每呼叫一次交出下一個單字
    char* word = strtok(text, SEP);
    while (word != nullptr) {
        for (int i = 0; i < k; i++)
            if (strcmp(word, keys[i]) == 0) count[i]++;
        word = strtok(nullptr, SEP);       // 傳 nullptr 表示「接著上次的位置切」
    }
    for (int i = 0; i < k; i++) cout << keys[i] << ": " << count[i] << '\n';
    return 0;
}
```

先把文章和關鍵字**全部轉小寫**，比較就只剩 `strcmp`。`cin.getline(text, MAX_TEXT)` 是 C 風格字串版的 `getline`（讀進 `char` 陣列、要給上限）。分隔字元集合 `SEP` 裡的 `\"` 是跳脫的雙引號；單引號故意不放進去，`don't` 才會是一個字。`makefile` 只算 1 次而 `make` 算 3 次，就是「整個單字相同才算」的意思——`strtok` 切出來的是完整的單字，`strcmp` 比的是整個字串。

</details>

---

[← 11/12｜運算子重載、friend 與 string（Ch 8、Ch 9）](/2026/09/09/nsysu-c-programming/1112-operator-string/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [11/26｜分離編譯與命名空間（Ch 11） →](/2026/09/09/nsysu-c-programming/1126-separate-compilation/)
