---
title: 附錄：編譯選項、Makefile、錯誤訊息與名詞速查
date: 2026-09-10
updated: 2026-09-12
permalink: 2026/09/09/nsysu-c-programming/appendix/
cover: /images/code-cover.jpg
categories: [程式設計]
tags: [C++, 中山大學, 自學指南]
description: 中山大學 C 程式設計自學指南附錄：常用 g++ 編譯選項、整學期通用的 Makefile、語法速查、常見錯誤訊息對照表與名詞速查表。
toc: true
comments: true
hidden: true
---

[← 12/24｜期末上機考（範圍 Ch 1–12、Ch 14）](/2026/09/09/nsysu-c-programming/1224-final-lab/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/)

這一頁是**查的，不是讀的**：忘了編譯指令或 Makefile 怎麼寫 → 〈常用 g++ 編譯選項〉、〈整學期通用的 Makefile〉；編譯或執行冒出看不懂的訊息 → 〈常見錯誤訊息對照表〉；忘記某個語法長怎樣 → 〈語法速查〉；名詞對不上 → 最後的〈名詞速查表〉。

## 常用 g++ 編譯選項

```bash
g++ -std=c++11 -o app main.cpp                  # 學校投影片的標準寫法：指定 C++11、-o 指定執行檔名
g++ -std=c++11 -Wall -Wextra -o app main.cpp    # 練習時加上兩組警告，把可疑寫法唸出來
g++ -c foo.cpp                                  # 只編譯成 .o，不連結
g++ -E foo.cpp -o foo.i                         # 只做前置處理（看 #include 展開的結果）
g++ -g -o app main.cpp                          # 編進行號與變數名，給 gdb 和下一行的 sanitizer 用（編譯錯誤本來就有行號，不必加這個）
g++ -O2 -o app main.cpp                         # 最佳化（本課用不到，除錯時不要開）
g++ -fsanitize=address -g -o app main.cpp       # 執行時偵測陣列越界與記憶體錯誤
```

除錯就用最後這組 `-fsanitize=address -g`：陣列越界、重複 `delete` 會在出事當下停下來並指出第幾行；記憶體洩漏則是等程式跑完才補印一段 `LeakSanitizer: detected memory leaks`，指到當初 `new` 的那一行。交出去的 Makefile 不要留這個選項。

## 整學期通用的 Makefile

放在每週的作業資料夾根目錄，`make` 一鍵編譯（先 `.o` 再連結，就是助教範本的「模組化」形式）、`make clean` 一鍵清乾淨。每一行的意思見[〈環境設置〉](/2026/09/09/nsysu-c-programming/setup/)，這裡只放可以直接貼的成品：

```makefile
# 指定編譯器
CC = g++
# 編譯選項（練習時可改成 -std=c++11 -Wall -Wextra）
FLAG = -std=c++11

all: Q1 Q2 Q3

Q1: Q1.cpp
	$(CC) $(FLAG) -c Q1.cpp
	$(CC) $(FLAG) -o Q1 Q1.o

Q2: Q2.cpp
	$(CC) $(FLAG) -c Q2.cpp
	$(CC) $(FLAG) -o Q2 Q2.o

Q3: Q3.cpp
	$(CC) $(FLAG) -c Q3.cpp
	$(CC) $(FLAG) -o Q3 Q3.o

clean:
	rm -f Q1 Q2 Q3 *.o
```

當週有幾題就寫幾組（`all:` 後面和 `clean:` 那行記得一起補）；執行檔名稱另有規定時，改目標名稱和 `-o` 後面的名字就好。

某一題要拆成多個檔案時（例如 `.h` / `.cpp`），照 11/26 的寫法每個 `.cpp` 一條 `.o` 規則、相依清單列進 `.h`，最後一起連結；把 `Q6` 加進 `all:` 與 `clean:`：

```makefile
Q6: main.o Student.o
	$(CC) $(FLAG) -o Q6 main.o Student.o

main.o: main.cpp Student.h
	$(CC) $(FLAG) -c main.cpp

Student.o: Student.cpp Student.h
	$(CC) $(FLAG) -c Student.cpp
```

## 語法速查（建議印出來）

上機考在實驗課的虛擬機上考。**能不能上網查語法、能不能帶紙本，開學第一堂一定要先跟老師或助教確認**；若允許帶紙本，這一節可以印出來帶去。

**讀法**：底下的 `型別`、`成員`、`回傳型別`、`名稱`、`Name` 這類中文代稱與 `...` 都是**佔位符**，要換成自己的內容，照打一定編譯失敗；其餘英文關鍵字與符號（`class`、`const`、`:`、`;`、`&`）要一字不差照打。

### 標頭檔：什麼時候要 include 什麼

| 標頭檔 | 提供什麼 |
| --- | --- |
| `<iostream>` | `cin`、`cout`、`cerr`、`endl` |
| `<iomanip>` | `setw`、`setprecision`、`setfill`（`fixed`、`defaultfloat`、`left`、`right` 其實 `<iostream>` 就有，一起 include 也不會錯） |
| `<string>` | `string` 類別、`getline`、`stoi`、`to_string` |
| `<vector>` | `vector` |
| `<algorithm>` | `sort`、`max`、`min`、`swap` |
| `<cmath>` | `sqrt`、`pow`、`fabs`（浮點絕對值）、`ceil`、`floor`、`round` |
| `<cstdlib>` | `rand`、`srand`、`abs`（整數絕對值）、`exit(n)`（在任何函式裡都能立刻結束整個程式，離開碼是 `n`；但它**不會跑區域物件的解構子**，所以在 `main` 裡還是用 `return n;`） |
| `<ctime>` | `time`（配合 `srand`） |
| `<cctype>` | `isalpha`、`isdigit`、`toupper`、`tolower` |
| `<climits>` | `INT_MAX`、`INT_MIN` |
| `<limits>` | `numeric_limits`（配合 `cin.ignore`） |
| `<cstring>` | `strlen`、`strcpy`、`strcat`、`strcmp`（C 風格字串） |
| `<fstream>` | `ifstream`、`ofstream` |
| `<sstream>` | `istringstream`、`ostringstream` |
| `<cassert>` | `assert` |

### 輸入輸出

```cpp
cin >> a >> b;                       // 依序讀兩個值，空白與換行都會自動跳過
while (cin >> x) { }                 // 讀到沒東西為止

cin.ignore(numeric_limits<streamsize>::max(), '\n');  // 需 <limits>；清掉前一個 cin >> 留下的換行
getline(cin, line);                  // 再讀一整行

cout << fixed << setprecision(2) << x;   // 小數點後兩位（會一直生效）
cout << setw(8) << x;                    // 欄寬 8，只影響下一個輸出
cout << setfill('0') << setw(2) << h;    // 補零
cout << left << setw(10) << name;        // 靠左對齊
```

### 流程控制

```cpp
if (cond) { } else if (cond) { } else { }

switch (n) { case 1: ...; break; default: ...; }

for (int i = 0; i < n; i++) { }
for (int x : arr) { }                // range-based，改值要寫 int&
while (cond) { }
do { } while (cond);
```

### 函式

```cpp
回傳型別 名稱(參數列);               // 宣告（prototype），結尾有分號
int  f(int x);                       // 傳值：改不到外面
void g(int& x);                      // 傳參考：改得到外面
void h(const string& s);             // 唯讀又不複製
void k(int a[], int n);              // 陣列一定要另外傳長度
double area(double w, double h = 1); // 預設引數只能放最右邊
```

### 陣列 / vector / string

```cpp
int a[5] = {};                       // 全 0
const int N = 100; int a[N];         // 大小要是常數
for (int i = 0; i < n; i++) ...      // 索引 0 ~ n-1

vector<int> v;                       // 動態陣列
v.push_back(x); v.size(); v.empty(); v.clear();
v[i];                                // 不檢查範圍，越界是未定義行為
v.at(i);                             // 會檢查，越界丟 out_of_range 例外
v.front();  v.back();
for (size_t i = 0; i < v.size(); i++) ...

string s = "abc";
s.length();  s.substr(pos, len);  s.find(t);   // 找不到回傳 string::npos
s += t;  s[0];  s == t;  s < t;
stoi(s);  to_string(n);
```

### 類別骨架（含分離編譯）

```cpp
// ── Name.h：只放宣告，不寫 using namespace std ──
#ifndef NAME_H
#define NAME_H
class Name {
private:
    型別 成員;
    static 型別 計數;                // static 宣告：全類別共用一份
public:
    Name();                          // 預設建構子
    Name(型別 x);                    // 帶參數建構子
    ~Name();                         // 解構子（有 new 才需要）
    Name(const Name& o);             // 拷貝建構子（有 new 才需要）
    Name& operator=(const Name& o);  // 指派運算子（有 new 才需要）

    型別 getX() const;               // 唯讀函式一律加 const
    void setX(型別 x);
};
#endif

// ── Name.cpp：開頭 #include "Name.h"，再寫定義 ──
Name::Name() : 成員(初值) { }        // 類別外定義要寫 Name::
型別 Name::計數 = 初值;              // static 成員的定義，整個程式只寫一次
```

### 運算子重載

```cpp
// ── 寫在 class 裡 ──
Vec2 operator+(const Vec2& o) const;   // 成員函式：左邊一定是自己
Vec2& operator++();                    // 前置 ++v
Vec2  operator++(int);                 // 後置 v++，那個 int 只是用來區分
friend ostream& operator<<(ostream& os, const Vec2& v);   // 非成員：左邊是 cout，要 friend 才看得到 private
// 拆成 .h / .cpp 時，.h 裡沒有 using namespace std，這一行要改寫成
//   friend std::ostream& operator<<(std::ostream& os, const Vec2& v);
// 少了 std:: 會報 error: 'ostream' does not name a type

// ── 寫在 class 外 ──
ostream& operator<<(ostream& os, const Vec2& v) {
    os << '(' << v.x << ',' << v.y << ')';
    return os;                         // 回傳 os 才能一直 << 接下去
}
```

### 指標與動態記憶體

```cpp
int  a = 5;
int* p = &a;        // 取位址
*p = 10;            // 解參考

int* arr = new int[n];
delete[] arr;  arr = nullptr;

int** g = new int*[n];                          // int** 是「指向 int* 的指標」：先配 n 個指標當列首
for (int i = 0; i < n; i++) g[i] = new int[m];  // 每一列再各配 m 個 int
for (int i = 0; i < n; i++) delete[] g[i];      // 釋放順序與配置相反：先內層
delete[] g;                                     // 再外層
```

### 檔案 I/O

```cpp
ifstream fin("input.txt");
if (!fin) { cerr << "open failed\n"; return 1; }
while (fin >> x) { }                  // 或 while (getline(fin, line))

ofstream fout("out.txt", ios::app);   // 第二引數省略＝整個蓋掉重寫，寫 ios::app＝接在檔尾
if (!fout) { cerr << "open failed\n"; return 1; }   // 寫檔一樣要檢查
fout << x << '\n';

istringstream iss(line);              // 拆一行的欄位
while (iss >> token) { }
getline(iss, field, ',');             // 用逗號分隔（CSV）
```

### 繼承

```cpp
class Base {
protected:
    型別 成員;                        // 子類別碰得到，外面碰不到
public:
    Base(型別 x) : 成員(x) { }
};

class Derived : public Base {
private:
    型別 自己的成員;
public:
    Derived(型別 x, 型別 y) : Base(x), 自己的成員(y) { }   // 先呼叫父類別建構子
};
// 建構：先父後子　解構：先子後父
```

## 常見錯誤訊息對照表

**編譯錯誤（compile error）**

| 訊息 | 怎麼修 |
| --- | --- |
| `expected ';' after class definition` | `class` / `struct` 的右大括號後面漏了分號，補成 `};` |
| `expected ';' before 'X'` 或 `expected ',' or ';' before 'X'` | 上一行敘述結尾漏了分號，`X` 就是下一行的第一個字 |
| `expected initializer before '...'` | 語法在更前面就斷了：**往上一行找**漏掉的分號或沒配對的括號 |
| `'xxx' was not declared in this scope` | 檢查：變數沒宣告、拼錯字、忘了 `#include`、超出作用域 |
| `no matching function for call to ...` | 參數型別或個數跟宣告對不上；建立物件時出現多半是少了預設建構子 |
| `call of overloaded ... is ambiguous` | 兩個重載版本一樣符合，把參數型別改明確（或加 cast） |
| `passing 'const X' as 'this' argument discards qualifiers` | 對 const 物件呼叫了非 const 函式：那個唯讀成員函式後面補 `const` |
| `invalid conversion from 'int' to 'int*'` | 型別不合，多半是漏了 `&` 或多寫了 `*` |
| `redefinition of 'class X'` | header 忘了 include guard，補 `#ifndef` / `#define` / `#endif` |
| `fatal error: xxx.h: No such file or directory` | 檔名拼錯，或自己寫的 header 用了 `<>`（應該用 `""`） |
| `'X::a' is private within this context` | 從類別外面碰到 private 成員：漏了 `public:`，或應該改走 getter／setter |
| `no match for 'operator<<' (operand types are 'std::ostream' and 'X')` | 自訂型別還沒重載 `<<`，或重載了卻忘了在 class 裡宣告成 `friend` |

**警告（warning）——一個扣 2 分，不能放著不管**

| 訊息 | 怎麼修 |
| --- | --- |
| `unused variable 'x'` / `unused parameter 'x'` | 宣告了卻沒用到：刪掉它，或確認是不是漏寫了那段程式 |
| `'x' is used uninitialized` | 變數宣告完沒給初值就拿來用，補上初值 |
| `comparison of integer expressions of different signedness` | `int i` 拿去跟 `v.size()` 比：迴圈變數改成 `size_t i` |

**連結錯誤（link error）**

| 訊息 | 怎麼修 |
| --- | --- |
| `undefined reference to 'foo()'` | 檢查三件事：(1) 那個 `.cpp` 有沒有一起編 (2) 定義時漏寫 `類別名::` (3) 宣告與定義的簽名不一致 |
| `undefined reference to 'Widget::count'` | `static` 成員忘了在類別外定義，補上 `int Widget::count = 0;` |
| `undefined reference to 'main'` | 拼成 `Main`，或整個專案根本沒有 `main` |
| `multiple definition of 'x'` | 變數或函式的**定義**被寫進 header 了：只留宣告，定義搬到 `.cpp` |

**執行時期錯誤（runtime error）**

| 現象 | 怎麼修 |
| --- | --- |
| `Segmentation fault (core dumped)` | 陣列越界、對 `nullptr` 解參考、無窮遞迴；用 `-fsanitize=address -g` 重編會直接指出第幾行 |
| `free(): double free detected` / `double free or corruption` | 同一塊記憶體被釋放兩次：淺拷貝沒補三法則，或 `delete` 寫了兩次 |
| `std::bad_array_new_length` | 完整訊息是 `terminate called after throwing an instance of 'std::bad_array_new_length'`。`new T[n]` 的 `n` 是負數或算到溢位——最常見就是 `int n;` 忘了 `cin >> n` 就 `new int[n]` |
| `std::bad_alloc` | 要不到那麼多記憶體：最常見是 `new` 後面的數量算錯（乘法算爆、負數轉成超大的無號數）；虛擬機的記憶體本來就少，不必到 GB 等級就可能失敗 |
| 程式卡住不動 | 兩種可能：**程式正在等你輸入**——`cin >>` 沒東西可讀就停在那裡，看起來跟當掉一樣，先打個值按 Enter 或改用 `./Q1 < in.txt` 餵檔案；不然就是無窮迴圈：迴圈變數沒更新，或條件用 `!=` 剛好跳過 |
| 輸出多一筆或少一筆 | 讀檔用了 `while (!fin.eof())`，改成 `while (fin >> x)` 或 `while (getline(fin, line))` |
| `terminate called after throwing an instance of 'std::out_of_range'` | `v.at(i)` / `s.at(i)` 越界；下一行的 `what():` 會直接告訴你索引是多少、長度是多少 |
| `Assertion 'cond' failed.` | `assert(cond)` 沒通過；前面的 `檔名:行號:` 就是那個 `assert` 的位置 |

**Makefile 錯誤**

| 訊息 | 怎麼修 |
| --- | --- |
| `missing separator` | recipe 開頭必須是 **Tab** 不能是空格；用 `cat -A Makefile` 確認行首是 `^I` |
| `No rule to make target 'Q3.cpp'` | 檔名打錯，或檔案不在這個目錄 |
| `make: 'Q1' is up to date.` / `make: Nothing to be done for 'all'.` | 沒改過檔案時這兩句都正常（直接打 `make` 會看到後者，`make Q1` 會看到前者）；**剛改過檔案卻還看到它**，才是相依關係漏寫（最常見：改了 `.h`，但規則沒把 `.h` 列為相依） |

## 名詞速查表

| 名詞 | 白話解釋 |
| --- | --- |
| **連結（link）** | 把多個 `.o` 與函式庫接成一個執行檔 |
| **參數 / 引數** | 參數是函式定義裡的變數名；引數是呼叫時實際傳進去的值 |
| **傳值 / 傳參考** | 傳複製品（改不到外面）／傳本人的別名（改得到外面） |
| **重載（overload）** | 同名函式、不同參數列表並存 |
| **越界（out of range）** | 存取了陣列合法範圍以外的格子，C++ 不會幫你擋 |
| **未定義行為（UB）** | 標準沒規定該產生什麼結果的寫法（越界、`delete` 兩次、用未初始化的變數…）：可能看起來正常、可能當掉、換台電腦又是另一個答案 |
| **結構（struct）** | 把幾個相關欄位綁成一包的自訂型別 |
| **類別（class）** | 資料 + 操作資料的函式綁在一起；預設成員是 private |
| **封裝（encapsulation）** | 資料設成 private，只開放少數 public 函式操作 |
| **建構子（constructor）** | 與類別同名、沒有回傳型別，物件誕生時自動執行 |
| **解構子（destructor）** | `~類別名`，物件消失時自動執行，用來還資源 |
| **初始化列表** | 建構子參數列後面用 `: 成員(值)` 直接初始化成員 |
| **`static` 成員** | 屬於整個類別、所有物件共用的一份；宣告寫在類別裡，定義要寫在類別外 |
| **運算子重載** | 定義 `+`、`<<` 等符號對自訂型別的意義 |
| **`friend`** | 破例允許某個外部函式存取 private 成員 |
| **指標（pointer）** | 存放「記憶體位址」的變數 |
| **解參考（dereference）** | 用 `*p` 取出指標所指的內容 |
| **`new` / `delete`** | 執行時向系統要記憶體 / 把記憶體還回去 |
| **記憶體洩漏** | `new` 了卻沒 `delete`，記憶體一直被佔著 |
| **懸空指標** | 指向已經被釋放的記憶體的指標 |
| **淺拷貝 / 深拷貝** | 只複製位址（兩者共用同一塊）／另外配一塊並複製內容 |
| **三法則（Rule of Three）** | 有 `new` 的類別要自己寫解構子、拷貝建構子、指派運算子 |
| **標頭檔（header）** | `.h` 檔，放宣告，給別的檔案 `#include` |
| **include guard** | `#ifndef`/`#define`/`#endif`，防止同一個 header 被重複引入 |
| **命名空間（namespace）** | 幫名字加上「姓氏」，避免不同函式庫的名稱相撞 |
| **串流（stream）** | 資料流動的管道，`cin`/`cout`/`ifstream`/`ofstream` 都是 |
| **繼承（inheritance）** | 新類別 = 舊類別 + 額外的東西 |
| **`protected`** | 對外面關閉、對子類別開放的存取層級 |
| **覆寫（redefine）** | 子類別定義同名同簽名的函式，蓋掉父類別的版本 |
| **is-a / has-a** | 「是一種」用繼承；「有一個」用組合（當成員變數） |

---

[← 12/24｜期末上機考（範圍 Ch 1–12、Ch 14）](/2026/09/09/nsysu-c-programming/1224-final-lab/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/)
