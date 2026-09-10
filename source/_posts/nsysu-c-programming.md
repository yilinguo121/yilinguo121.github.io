---
title: 中山大學 C 程式設計 & 實驗課完整自學指南（1151 學期）
date: 2026-09-10
updated: 2026-09-10
cover: /images/code-cover.jpg
categories: [程式設計]
tags: [C++, 中山大學, 自學指南, GCC, Makefile, Ubuntu]
description: 依照國立中山大學 CSE123「C 程式設計」與其實驗課 1151 學期的公開進度表，整理一份可完全自學、不需翻書即可跟上整學期的教學筆記，含環境安裝、GCC / Makefile、每週語法重點與練習題方向。
toc: true
comments: true
mermaid: false
---

> **關於這份筆記**
> 本文依據國立中山大學資工系 CSE123「C 程式設計」（授課老師：柯正雯 副教授）與其對應實驗課 1151 學期的**公開進度表**寫成。內容皆為筆者針對每一週語法重點所整理的**原創說明與自寫範例**，並不轉載教科書 *Absolute C++* (Walter Savitch, 6/e) 內文、圖片、或授課教授自製投影片。若讀者希望取得完整原文與課後習題解答，仍請透過正版管道取得該書。

---

## 前言：這份文件想解決什麼問題

修過中山資工「C 程式設計」的同學都知道兩件事：

1. 教科書是 Pearson 全球版的 *Absolute C++*，用英文，翻起來很厚。
2. 這門課雖然叫「C 程式設計」，實際上教的是 **C++**（從 `cout`、`class`、`vector` 一路到 `inheritance`），只是課名歷史遺留沒改。

對很多大一新生來說，第一次接觸程式又要看原文書相當吃力。這篇文章的目的，是把整學期的公開進度攤開來，用**自寫的範例**與**中文說明**把每一週要學到的觀念交代清楚，讓你就算完全沒翻過那本書，也能照著文章的順序，每週一小塊地把進度追齊。

同時，實驗課（C 程式設計實驗）跟主課的排程是一致的：主課上完某章，實驗課就要在虛擬機的 Ubuntu / g++ / Makefile 環境把該章對應的練習題實作出來。因此本文開頭會先花不少篇幅講**環境**與**Makefile**，之後每一週都會標註對應的實驗課實作方向。

---

## 課程與評分資訊（來自公開 Syllabus）

以下資訊來自公開授課大綱，屬於事實性資訊：

- **課號**：CSE123，1151 學期
- **系所**：中山大學資訊工程學系
- **教科書**：*Absolute C++*, Walter Savitch, 6th Edition (Global Edition), Pearson, 2016
- **評分（主課）**：期中考（上機）30% + 期末考 I（筆試）30% + 期末考 II（上機）40%
- **評分（實驗課）**：課堂實作 60% + 期末考試 40%
- **加分規則**：期末上機成績較期中進步 30 分以上者，學期總分可獲 1–3 分加分

實驗課有一條「軟性但重要」的規則：**課堂實作題全部檢查完可提早離開**——這也是後面每週練習方向會盡量列到位的原因。

---

## Part 0：環境設置（第 1 週前一定要弄完）

實驗課要求所有練習與上機考都在**虛擬機的 Ubuntu 20.04 LTS** + **g++** + **Makefile** 環境完成。以下是我實際安裝時的最短流程。

### 0-1 VirtualBox + Ubuntu 20.04

1. 到 [virtualbox.org](https://www.virtualbox.org/wiki/Downloads) 下載對應作業系統的 VirtualBox（Windows/Mac 都有）。
2. 到 [releases.ubuntu.com/20.04](https://releases.ubuntu.com/20.04/) 下載 **64-bit PC (AMD64) desktop image** 的 `.iso` 檔。務必是 20.04 LTS，因為上機考規定要與助教環境一致。
3. 打開 VirtualBox → **新增（New）** → 名稱隨意（例如 `NSYSU-Ubuntu`）→ 記憶體給 4 GB 以上（電腦夠力就給 8 GB）→ 硬碟建立新的 VDI，**建議 20 GB 以上**（實驗課要留空間裝套件）。
4. 建立完成後，選中虛擬機 → **設定（Settings）** → **儲存（Storage）** → 光碟機空槽 → 選 `.iso` 檔 → 確定。
5. **啟動**，第一次會進入 Ubuntu 安裝流程。安裝語系**建議選英文**，因為中文路徑名日後在 Terminal 會很煩；如果解析度太低按不到 `Continue`，可用 `Alt + F7` 拖曳視窗。
6. 安裝完成、重開機、右上角進 Settings → Displays 把解析度調到符合螢幕的大小，這樣左下角才找得到 Terminal。

### 0-2 安裝 g++ / make

安裝完 Ubuntu 開啟 Terminal，輸入：

```bash
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install g++
sudo apt-get install make
```

`sudo` 會要你輸入密碼（就是安裝 Ubuntu 時設的登入密碼），期間跳出 `[Y/n]` 統統回 `y`。安裝完可以測一下：

```bash
g++ --version
make --version
```

有版本號跑出來就代表沒問題。

### 0-3 第一支 Hello World

在桌面按右鍵 → New Document → Empty Document，改名為 `HelloWorld.cpp`，貼入：

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, NSYSU!" << endl;
    return 0;
}
```

回到 Terminal，切到桌面資料夾：

```bash
cd ~/Desktop
g++ -c HelloWorld.cpp        # 產生 HelloWorld.o
g++ -o HelloWorld HelloWorld.o   # 產生執行檔 HelloWorld
./HelloWorld                 # 執行
```

看到 `Hello, NSYSU!` 就成功了。

### 0-4 你必須會的 Terminal 指令

上機考期間**只能用文字編輯器 + Terminal**，不能用 VS Code、Dev-C++、IDE 內建自動完成、AI 修正。所以下面這些指令請練熟：

| 指令 | 功能 |
| --- | --- |
| `pwd` | 顯示目前所在完整路徑 |
| `ls` | 列出當前目錄的檔案 |
| `ls -al` | 列出所有檔案（含隱藏檔）與詳細資訊 |
| `cd 資料夾名` | 進入子目錄 |
| `cd ..` | 回上一層 |
| `mkdir 名稱` | 建立資料夾 |
| `rm 檔名` | 刪除檔案 |
| `rm -rf 資料夾` | 遞迴刪除資料夾（**小心用**） |
| `mv 來源 目的` | 移動或改名 |
| `cp 來源 目的` | 複製 |
| `find . -name "Q*.cpp"` | 從當前目錄往下找檔名符合的檔案 |
| `nano 檔名` / `vim 檔名` | 用終端機文字編輯器開啟檔案 |

上機考時建議用 `nano`（沒學過 vim 的話），指令列直觀，`Ctrl + O` 存檔、`Ctrl + X` 離開。

### 0-5 Makefile：從零到「模組化」

實驗課與上機考要求**每次交檔都要附一份可用的 Makefile**，能一次編譯當週所有題目。缺 Makefile 或 Makefile 編不過 → **這次分數 0 分**。

#### 最基本版本

假設當週交 Q1.cpp、Q2.cpp、Q3.cpp、Q4.cpp，最直觀的寫法：

```makefile
all: Q1 Q2 Q3 Q4

Q1: Q1.cpp
	g++ -o Q1 Q1.cpp

Q2: Q2.cpp
	g++ -o Q2 Q2.cpp

Q3: Q3.cpp
	g++ -o Q3 Q3.cpp

Q4: Q4.cpp
	g++ -o Q4 Q4.cpp

clean:
	rm -f Q1 Q2 Q3 Q4
```

**重點**：每一條 recipe（規則的動作）前面**必須是 Tab，不能是空格**，這是 Makefile 最常見的雷區。

在 Terminal 執行：

```bash
make            # 產生四個執行檔
make clean      # 刪除四個執行檔
```

#### 模組化版本（實驗課要求）

上面那種寫法題目一多就會爆炸。實驗課要求「模組化」——用變數與 pattern rule 讓 Makefile 自動長出來：

```makefile
CC     := g++
CFLAGS := -Wall -std=c++17
SRCS   := $(wildcard Q*.cpp)
TARGETS:= $(SRCS:.cpp=)

all: $(TARGETS)

# pattern rule: 任何 Qx 都對應到 Qx.cpp
%: %.cpp
	$(CC) $(CFLAGS) -o $@ $<

clean:
	rm -f $(TARGETS)
```

這份 Makefile 會**自動抓取當前目錄下所有 `Q*.cpp`**、把每一支編成同名執行檔。之後只要新增 `Q5.cpp`，`make` 一下就會多出 `Q5`，不用改 Makefile。上機考交檔規則是：

- 檔案命名：`Q題號.cpp`（例如第二題 → `Q2.cpp`），執行檔 `Q題號`
- 全部檔案（含 Makefile）放在**以學號命名的資料夾**（例如 `B153040XXX/`）
- 壓縮成 `學號.zip` 上傳
- **任何 warning 或 error 都會扣 2 分**——所以 `-Wall` 要一起用來提早發現問題

---

## Part 1：上機考規範速讀

除了上面 Makefile 的部分，上機考還有幾條務必記住的規則：

- 桌上只能有筆跟水，背包放教室前
- 上廁所舉手一次一人
- 出現當機**立刻舉手**，不然不延長時間
- 開考 20 分鐘後不能進場
- 結束時**不要關機、也不要關 Ubuntu**
- 只能用 Ubuntu 內建的文字編輯器，用了其他 IDE 或作業系統扣 50%
- 助教考試中只協助**硬體故障**，其他問題不受理

實作上兩個保命習慣：

1. **每寫完一題就 `make` 一次**：警告要當場清掉（`-Wall` 幫忙），別堆到最後。
2. **每寫完一題就 `./Qn` 跑幾組測資**：不要相信「應該對」的直覺。

---

## Part 2：每週教學內容

以下每一節對應**一週上課進度**。我會給出：

- 該週的**觀念地圖**
- **最小可跑範例**（可以直接複製貼上編譯）
- **常見雷區**
- **實驗課練習方向**（自己出題來對應該章重點）

> **符號說明**：下方章節後面括號內的「Ch X」對應 *Absolute C++* 教科書的章號，是公開進度表上有的資訊；不代表本文轉載該章內容。

### 第 1 週：課程介紹 + 環境暖身

第一週通常是老師介紹課程、投影片走大綱，實驗課會帶你把 VirtualBox / Ubuntu / g++ / Makefile 弄起來。

**這週務必做完的三件事：**

1. Part 0 全部走過一次。
2. 能夠靠自己在 Terminal 從空白目錄產出、編譯、執行一支 `HelloWorld.cpp`。
3. 能夠靠自己寫出一份「模組化」的 Makefile。

沒做完這三件事的話，之後每一週的實驗課都會被環境問題拖住。

---

### 第 2 週：C++ 基礎（Ch 1）

這週的關鍵字是**「輸入輸出」+「型別」+「算術」**。

#### 一支程式的骨架

```cpp
#include <iostream>   // 引入 I/O 函式庫
using namespace std;  // 之後不用一直寫 std::

int main() {
    // 你的程式從這裡開始
    return 0;
}
```

- `#include <...>`：前置處理，把標頭檔內容貼進來。
- `main()`：程式進入點，回傳 `int` 給作業系統，`return 0` 代表正常結束。

#### 基本型別

| 型別 | 常用範圍 | 用途 |
| --- | --- | --- |
| `int` | 約 $\pm 2\times 10^9$ | 整數 |
| `long long` | 約 $\pm 9\times 10^{18}$ | 大整數 |
| `double` | 約 15 位有效數字 | 浮點數 |
| `char` | 一個字元 | 'A'、'0'、' ' |
| `bool` | `true` / `false` | 布林值 |
| `string` | 需 `#include <string>` | 字串 |

宣告變數：

```cpp
int age = 18;
double pi = 3.14159;
char grade = 'A';
bool passed = true;
string name = "Yilin";
```

#### 輸入輸出：`cin` 與 `cout`

```cpp
#include <iostream>
using namespace std;

int main() {
    int a, b;
    cout << "請輸入兩個整數：";
    cin >> a >> b;
    cout << "和 = " << a + b << endl;
    return 0;
}
```

- `cout << x`：把 `x` 印到螢幕；`<<` 可以串接。
- `cin >> x`：從鍵盤讀一個值進 `x`；空白或換行為分隔。
- `endl` 換行；等同 `"\n"` + 強制清空緩衝區。

#### 算術與整數除法陷阱

```cpp
cout << 7 / 2 << endl;     // 3   （整數除法）
cout << 7 % 2 << endl;     // 1   （取餘）
cout << 7 / 2.0 << endl;   // 3.5 （只要一邊是浮點，結果就是浮點）
cout << (double)7 / 2 << endl; // 3.5（用 cast 強制轉型）
```

**雷區**：`int a = 5; double b = a / 2;` 得到 2.0 不是 2.5——因為 `a / 2` 先做完整數除法才轉成 `double`。

#### 常數

```cpp
const double PI = 3.14159;
PI = 3.14; // 編譯錯誤：不能改 const
```

#### 實驗課練習方向

1. 讀入身高（公分）與體重（公斤），輸出 BMI 到小數點下兩位。
2. 讀入起始金額、年利率、年數，用單利公式輸出本息合計。
3. 讀入攝氏溫度，輸出對應的華氏溫度（$F = C \times 9/5 + 32$）。

---

### 第 3 週：流程控制 + 函式基礎（Ch 2、Ch 3）

這週分兩塊：**條件與迴圈**，還有**寫自己的函式**。

#### 條件：`if` / `else if` / `else` / `switch`

```cpp
int score;
cin >> score;
if (score >= 90) cout << "A";
else if (score >= 80) cout << "B";
else if (score >= 70) cout << "C";
else cout << "F";
```

`switch` 適合離散選單：

```cpp
char op;
int a, b;
cin >> a >> op >> b;
switch (op) {
    case '+': cout << a + b; break;
    case '-': cout << a - b; break;
    case '*': cout << a * b; break;
    case '/': cout << (b == 0 ? 0 : a / b); break;
    default:  cout << "unknown"; 
}
```

**雷區**：`switch` 忘寫 `break` 會**穿透（fall-through）**，繼續執行下一個 `case`。

#### 布林運算與短路

```cpp
if (a != 0 && b / a > 3) { ... }  // && 短路：a == 0 就不會除法
```

`&&`、`||`、`!` 三個運算子。**小心**：`if (0 < x < 10)` 在 C++ 是先算 `0 < x` 得到布林（0/1），再與 10 比大小，**永遠為真**——要寫 `if (0 < x && x < 10)`。

#### 迴圈：`while`、`do-while`、`for`

```cpp
// 印 1..10
for (int i = 1; i <= 10; i++) cout << i << ' ';

// while
int n = 100, cnt = 0;
while (n > 1) { n /= 2; cnt++; }

// do-while：至少跑一次
int x;
do {
    cin >> x;
} while (x < 0);
```

`break` 跳出整個迴圈；`continue` 跳過本次剩餘、直接進下一輪。

#### 函式：讓程式可以拆

函式的三個要素：**回傳型別**、**函式名**、**參數列表**。

```cpp
#include <iostream>
using namespace std;

int gcd(int a, int b) {
    return b == 0 ? a : gcd(b, a % b);
}

bool isPrime(int n) {
    if (n < 2) return false;
    for (int i = 2; i * i <= n; i++) 
        if (n % i == 0) return false;
    return true;
}

void greet(const string& name) {
    cout << "Hello, " << name << "!\n";
}

int main() {
    cout << gcd(24, 36) << endl;        // 12
    cout << isPrime(17) << endl;        // 1
    greet("NSYSU");
    return 0;
}
```

- 回傳值不是 `void` 時，**每條路徑都要 `return`**，不然是未定義行為（compiler 通常會警告）。
- 遞迴：函式呼叫自己。上面 `gcd` 就是。要有**終止條件**避免無窮遞迴。

#### 區域變數與作用域

```cpp
int x = 10;
{
    int x = 5;      // 內層區塊的 x 蓋掉外層
    cout << x;      // 5
}
cout << x;          // 10
```

`for (int i = 0; ...)` 裡宣告的 `i` 只在迴圈內有效。

#### 實驗課練習方向

1. 印 1..N 內所有的**質數**。
2. 讀 N 個整數，輸出最大、最小、平均。
3. 寫函式 `int fact(int n)` 計算階乘（遞迴 & 非遞迴各一版）。
4. 費氏數列前 N 項。

---

### 第 4 週：參數傳遞與函式重載（Ch 4）

這週的兩個大重點：**call-by-value vs. call-by-reference**、**overloading（同名不同參數）**。

#### call-by-value：改不到外面

```cpp
void addOne(int x) { x = x + 1; }

int main() {
    int a = 5;
    addOne(a);
    cout << a;  // 還是 5
}
```

函式收到的是 `a` 的**複製品**。

#### call-by-reference：可以改外面

參數型別加一個 `&`：

```cpp
void addOne(int& x) { x = x + 1; }

int main() {
    int a = 5;
    addOne(a);
    cout << a;  // 6
}
```

實務範例：`swap`——

```cpp
void swap(int& a, int& b) {
    int t = a; a = b; b = t;
}
```

#### `const` 參考：不想被改的大物件

```cpp
void print(const string& s) {   // 不複製字串、也不允許改
    cout << s;
}
```

大型物件（string、vector、struct）幾乎都用 `const T&` 傳，效率好又安全。

#### 函式重載（Overloading）

同一個函式名、**參數列表不同**（型別不同或個數不同），可以並存：

```cpp
int max(int a, int b) { return a > b ? a : b; }
double max(double a, double b) { return a > b ? a : b; }
int max(int a, int b, int c) { return max(a, max(b, c)); }
```

**注意**：光是回傳型別不同**不算**重載，會編譯錯。

#### 預設引數（Default Arguments）

```cpp
void greet(string name = "world") {
    cout << "Hello, " << name << "!\n";
}
greet();          // Hello, world!
greet("Yilin");   // Hello, Yilin!
```

預設值只能放在**參數列的最右邊**。

#### 實驗課練習方向

1. 寫 `void swap` 交換兩個整數；再重載成交換 double、string。
2. 寫函式一次算出陣列的 min 與 max，透過 reference 回傳兩個值。
3. 重載一個 `area()` 函式：一個參數（正方形）、兩個參數（長方形）、三個參數（三角形海龍公式）。

---

### 第 5 週：陣列（Ch 5）

陣列是把**一群同型別**的變數擺成連續一段。

#### 宣告與存取

```cpp
int a[5] = {3, 1, 4, 1, 5};
cout << a[0] << ' ' << a[4];  // 3 5
a[2] = 100;
```

**索引從 0 開始**、**長度必須是常數**、**越界不會有例外，會直接壞掉**。

#### 用 `for` 迴圈掃陣列

```cpp
const int N = 5;
int a[N] = {3, 1, 4, 1, 5};

int sum = 0;
for (int i = 0; i < N; i++) sum += a[i];

// C++11 的 range-based for
for (int x : a) cout << x << ' ';
```

#### 陣列傳進函式

陣列傳進函式時，**只會傳指標**，函式無法自己知道長度，所以要**額外傳長度**：

```cpp
int sum(const int a[], int n) {
    int s = 0;
    for (int i = 0; i < n; i++) s += a[i];
    return s;
}

int main() {
    int a[5] = {1, 2, 3, 4, 5};
    cout << sum(a, 5);
}
```

`const int a[]` 意思是**答應不改寫這個陣列**——這是好習慣，也讓 compiler 幫你檢查。

#### 排序：Bubble Sort（範例）

```cpp
void bubbleSort(int a[], int n) {
    for (int i = 0; i < n - 1; i++)
        for (int j = 0; j < n - 1 - i; j++)
            if (a[j] > a[j + 1]) {
                int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
            }
}
```

複雜度 $O(n^2)$，只是拿來熟悉陣列，實務上會用後面章節學到的 `std::sort`。

#### 二維陣列

```cpp
int g[3][4] = {
    {1, 2, 3, 4},
    {5, 6, 7, 8},
    {9, 10, 11, 12}
};

for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 4; j++)
        cout << g[i][j] << ' ';
    cout << '\n';
}
```

傳進函式時，**第二維以後必須是常數**：

```cpp
void print(int g[][4], int rows) { ... }
```

#### 實驗課練習方向

1. 讀入 N 個整數存入陣列，反轉後印出。
2. 找出陣列中的最大值與其**索引**。
3. 用 bubble sort 排序後輸出中位數。
4. 讀入一個 $N \times N$ 矩陣，輸出其轉置。

---

### 第 6 週：陣列後半 + 結構與類別（Ch 5–6）

前半週複習陣列（搜尋、排序、部分填滿的陣列），後半週正式進入 **struct 與 class**——這是整學期的關鍵轉折。

#### 部分填滿的陣列

有時你宣告了長度 100 的陣列，但實際只用了 47 個。標準做法：**用另一個 `int size` 記住有效長度**：

```cpp
int a[100];
int size = 0;

void push(int x) {
    if (size < 100) a[size++] = x;
}
```

#### `struct`：把相關資料綁在一起

```cpp
struct Student {
    string name;
    int    id;
    double gpa;
};

int main() {
    Student s;
    s.name = "Yilin";
    s.id   = 113001;
    s.gpa  = 4.0;
    cout << s.name << ' ' << s.gpa;
}
```

也可以在宣告時直接初始化：

```cpp
Student s = {"Yilin", 113001, 4.0};
```

**雷區**：`struct` 定義後面**忘記分號**是很常見的編譯錯誤：

```cpp
struct Student { ... };   // <-- 這個分號別忘
```

#### `class`：把資料與行為綁在一起

`class` 跟 `struct` 幾乎一樣，唯一預設差別是**存取控制**：`class` 預設 `private`，`struct` 預設 `public`。

```cpp
class Circle {
private:
    double r;                       // 資料成員：外部看不到
public:
    void setRadius(double x) {      // Mutator（setter）
        if (x >= 0) r = x;
    }
    double getRadius() const {      // Accessor（getter）
        return r;
    }
    double area() const {
        return 3.14159265 * r * r;
    }
};

int main() {
    Circle c;
    c.setRadius(3);
    cout << c.area();      // 28.274...
}
```

三個關鍵字：

- `private`：只有類別**自己**的成員函式能存取
- `public`：任何人都能存取
- `protected`：自己 + 繼承的子類別能存取（下面 Ch 14 會用到）

**Encapsulation（封裝）** 的精神：**資料 private、透過 public 函式操作**。這樣改資料時可以做檢查（例如上面 `setRadius` 拒絕負數），也讓外部程式不會依賴內部細節。

#### 成員函式後面的 `const`

```cpp
double area() const { ... }
```

意思是「這個函式**不會修改物件狀態**」，是 accessor 的標準寫法。傳 `const Circle&` 進函式時，只有標了 `const` 的成員函式才能被呼叫——這件事在後面幾週會反覆遇到。

#### 實驗課練習方向

1. 定義 `struct Point`，寫函式計算兩點距離。
2. 把「學生資料」寫成 `class`，含姓名、學號、GPA，並提供對應的 setter/getter。
3. 讀入 N 個學生，按 GPA 排序後輸出。

---

### 第 7 週：類別 + 建構子（Ch 6–7）

這週的主題是 **Constructor（建構子）**。

#### 什麼是建構子？

建構子是**與類別同名、沒有回傳型別**的特殊函式，物件被建立時**自動被呼叫**。目的是把物件初始化到「一個合理的狀態」。

```cpp
class Circle {
private:
    double r;
public:
    Circle() { r = 1.0; }              // 預設建構子
    Circle(double x) { r = x; }        // 帶參數的建構子

    double area() const { return 3.14159265 * r * r; }
};

int main() {
    Circle a;         // 呼叫 Circle()，r = 1
    Circle b(5);      // 呼叫 Circle(5)，r = 5
    cout << b.area(); // 78.5398...
}
```

#### 初始化列表（Member Initializer List）

比在 body 裡寫 `r = x;` 更好的寫法：

```cpp
Circle(double x) : r(x) {}
```

當成員是 `const` 或**參考**時，**只能**用初始化列表，不能在 body 裡指定。

#### 預設建構子的重要性

如果你自己寫了任何一個帶參數的建構子，**C++ 就不會幫你自動生成無參的預設建構子**。之後 `Circle a;` 就會編譯失敗。所以**強烈建議**：

> **每個類別都提供一個預設建構子。**

或用 C++11 語法：

```cpp
Circle() : r(1.0) {}
Circle(double x) : r(x) {}
```

#### 一個完整的 BankAccount 範例

```cpp
class BankAccount {
private:
    string owner;
    double balance;
public:
    BankAccount() : owner(""), balance(0.0) {}
    BankAccount(const string& name, double init) 
        : owner(name), balance(init) {}

    void deposit(double x) {
        if (x > 0) balance += x;
    }
    bool withdraw(double x) {
        if (x <= 0 || x > balance) return false;
        balance -= x;
        return true;
    }
    double getBalance() const { return balance; }
    string getOwner()   const { return owner; }
};
```

用法：

```cpp
BankAccount acc("Yilin", 1000);
acc.deposit(500);
if (acc.withdraw(2000)) cout << "OK";
else                    cout << "餘額不足\n";
cout << acc.getBalance();  // 1500
```

#### `static` 成員（補充）

`static` 資料成員屬於**整個類別**，不屬於某個物件。常用於統計「一共建了幾個物件」：

```cpp
class Widget {
public:
    static int count;
    Widget()  { count++; }
    ~Widget() { count--; }
};
int Widget::count = 0;   // 必須在類別外初始化一次
```

#### 實驗課練習方向

1. 幫上一週的 `Circle` 加建構子，改用初始化列表。
2. 實作 `BankAccount`，做出交易紀錄（陣列或 vector 存每次交易金額）。
3. 實作 `Time`（時、分、秒），提供「加幾秒後為幾點」的函式。

---

### 第 8 週：建構子續 + `vector` + 運算子重載入門（Ch 7）

#### `vector`：可以動態長大的陣列

```cpp
#include <vector>
using namespace std;

vector<int> v;         // 空的
v.push_back(3);        // 尾端加入 3
v.push_back(1);
v.push_back(4);
cout << v[0];          // 3
cout << v.size();      // 3

vector<int> w(5, 0);   // 五個 0
vector<int> u = {1, 2, 3, 4, 5};   // C++11 initializer_list
```

比原始陣列好在**不用先決定大小**、**知道自己長度**、**傳進函式時整包傳**：

```cpp
double average(const vector<int>& a) {
    double s = 0;
    for (int x : a) s += x;
    return a.empty() ? 0 : s / a.size();
}
```

**雷區**：`v[100]` 若 `v.size() < 101` 是**未定義行為**（不會爆例外，行為看運氣）。用 `v.at(100)` 會丟例外，比較安全。

#### 運算子重載（Operator Overloading）：概念

有些自訂型別，用內建運算子表達會更直觀。例如向量：

```cpp
class Vec2 {
public:
    double x, y;
    Vec2(double x = 0, double y = 0) : x(x), y(y) {}
};

// 全域函式，回傳新的向量
Vec2 operator+(const Vec2& a, const Vec2& b) {
    return Vec2(a.x + b.x, a.y + b.y);
}
```

用法：

```cpp
Vec2 a(1, 2), b(3, 4);
Vec2 c = a + b;   // c.x = 4, c.y = 6
```

進階寫法會做成 `class` 內的成員函式（下週細講）：

```cpp
class Vec2 {
public:
    double x, y;
    Vec2(double x = 0, double y = 0) : x(x), y(y) {}
    Vec2 operator+(const Vec2& other) const {
        return Vec2(x + other.x, y + other.y);
    }
};
```

#### 實驗課練習方向

1. 讀入 N 個整數存進 `vector<int>`，輸出去除重複後從小到大排序的結果。
2. 用 `vector<double>` 存學生成績，實作 add/remove/average/max。
3. 幫上面的 `Vec2` 加上 `-`、`==`、`*`（純量乘法）等。

---

### 第 9 週：期中考（Ch 1–6）

考試範圍是**基礎語法 + 陣列 + 結構與類別**（不含建構子細節與 vector 以後的內容）。

**準備方向：**

- 熟練變數宣告、輸入輸出、`if`、`for`、`while`、`switch`
- 能寫 call-by-value / reference 兩種函式
- 陣列的宣告、傳參、二維陣列與 nested for
- 能定義 struct/class，寫基本 accessor / mutator
- **編譯無 warning、無 error**，Makefile 交得出來

複習策略：把前 8 週每一節的「實驗課練習方向」全部再做一次，計時做完並用 `-Wall` 檢查。

---

### 第 10 週：運算子重載完整 + `string`（Ch 7 尾、Ch 8）

#### 更完整的運算子重載

成員函式 vs. 非成員函式的抉擇：

- **需要能寫成 `T + something`**（左邊是自訂型別）→ 成員函式或非成員都可以。
- **需要 `something + T`**（左邊是內建型別）→ 只能寫**非成員**函式，因為你不能在 `int` 這個 class 裡加東西。

例如 `Vec2 + double`（純量加法）用成員函式：

```cpp
class Vec2 {
public:
    double x, y;
    Vec2(double x = 0, double y = 0) : x(x), y(y) {}
    Vec2 operator+(double s) const { return Vec2(x + s, y + s); }
};
```

但 `double + Vec2` 就要非成員：

```cpp
Vec2 operator+(double s, const Vec2& v) {
    return Vec2(v.x + s, v.y + s);
}
```

#### `friend`：讓非成員函式能存取 private

```cpp
class Vec2 {
private:
    double x, y;
public:
    Vec2(double x = 0, double y = 0) : x(x), y(y) {}
    friend ostream& operator<<(ostream& os, const Vec2& v);
};

ostream& operator<<(ostream& os, const Vec2& v) {
    os << '(' << v.x << ", " << v.y << ')';
    return os;
}
```

之後就能寫 `cout << myVec;`。

#### `string` 類別

C++ 標準 `string` 幾乎能取代 C 風格字串（`char[]`）：

```cpp
#include <string>
using namespace std;

string s = "Hello";
s += ", NSYSU!";
cout << s.length();     // 13
cout << s.substr(7, 5); // "NSYSU"
cout << s[0];           // 'H'

if (s.find("NSYSU") != string::npos)
    cout << "found";
```

`getline(cin, s)` 讀入一整行（含空白），`cin >> s` 遇到空白就停。**混用時**要小心 `cin >> x;` 後面的 `\n` 殘留在緩衝：

```cpp
int n;
cin >> n;
cin.ignore();            // 吃掉那個 \n
string line;
getline(cin, line);
```

#### 實驗課練習方向

1. 寫個計算器類別 `Calc`：重載 `+`、`-`、`*`、`/`。
2. 讀入一句英文，統計每個字元出現次數（大小寫視為相同）。
3. 判斷一個字串是否為**回文（palindrome）**（忽略大小寫與非字母字元）。

---

### 第 11 週：指標（Ch 9、Ch 10）

指標是很多同學卡關的地方。核心概念只有一個：**指標是「存位址」的變數**。

#### 基本語法

```cpp
int a = 5;
int* p = &a;    // p 存 a 的位址
cout << *p;     // 用 * 取出 p 指的東西：5
*p = 10;        // 透過 p 改 a
cout << a;      // 10
```

- `&a`：`a` 的位址。
- `*p`：`p` 指向的變數。

`int*` 是「指向 int 的指標」的型別；`int** pp;` 是「指向 int 指標的指標」。

#### `nullptr`：不指任何東西

```cpp
int* p = nullptr;
if (p) { ... }        // 空指標，判斷為 false
```

比舊寫法 `NULL` 或 `0` 更安全，是 C++11 的標準。

#### 動態記憶體：`new` / `delete`

```cpp
int* p = new int(42);      // 在 heap 上生一個 int，值為 42
cout << *p;                // 42
delete p;                  // 用完要還

int* arr = new int[100];   // 動態陣列
arr[0] = 1;
delete[] arr;              // 陣列要用 delete[]
```

**雷區**：

- `delete` 之後不能再用那塊記憶體（dangling pointer）。習慣 `p = nullptr;` 收尾。
- 每個 `new` 都必須配一個 `delete`，否則 memory leak。
- `new int[N]` 要用 `delete[]`，不是 `delete`。

#### 指標算術與陣列名的關係

陣列名可以當指標用（指向第 0 個元素）：

```cpp
int a[5] = {10, 20, 30, 40, 50};
int* p = a;          // 等同 &a[0]
cout << *(p + 2);    // 30
cout << p[2];        // 30
```

`p + 1` 是「下一個元素」的位址，不是「位址 + 1 byte」——編譯器會依型別自動乘上 `sizeof(int)`。

#### 指標當參數：改到外面

跟 reference 類似，只是語法比較繁：

```cpp
void addOne(int* p) { (*p)++; }

int main() {
    int a = 5;
    addOne(&a);
    cout << a;   // 6
}
```

現代 C++ 除非要傳「可能是空的物件」，否則用 reference (`int&`) 比 `int*` 直觀安全。

#### 實驗課練習方向

1. 用 `new int[N]` 動態配置陣列、讀 N 個數字、輸出最大最小。
2. 寫一個 `swap` 版本用 `int*` 而非 `int&`。
3. 寫一個 `Deep-copy` 練習：`class MyArray` 內含 `int* data; int n;`，實作建構子、解構子、拷貝建構子（copy constructor），確認 double free 不會發生。

---

### 第 12 週：分離編譯與命名空間（Ch 11）

隨著程式變大，**所有東西都塞在 `main.cpp`** 會變得難維護。這週學怎麼把程式拆成多個檔案。

#### Header 檔（.h）與 Implementation 檔（.cpp）

範例：`Circle.h` 只有宣告：

```cpp
// Circle.h
#ifndef CIRCLE_H
#define CIRCLE_H

class Circle {
private:
    double r;
public:
    Circle();
    Circle(double x);
    double area() const;
};

#endif
```

`Circle.cpp` 是實作：

```cpp
// Circle.cpp
#include "Circle.h"

Circle::Circle() : r(1.0) {}
Circle::Circle(double x) : r(x) {}
double Circle::area() const {
    return 3.14159265 * r * r;
}
```

`main.cpp` 使用：

```cpp
// main.cpp
#include <iostream>
#include "Circle.h"
using namespace std;

int main() {
    Circle c(5);
    cout << c.area();
}
```

#### `#ifndef` / `#define` / `#endif`：Include Guard

如果同一個 header 被引入兩次會編譯錯誤（重複定義）。上面的 `CIRCLE_H` 巨集就是保護——第一次引入時定義 `CIRCLE_H`，第二次就跳過整段。C++ 更現代的寫法是每個 header 開頭放：

```cpp
#pragma once
```

（NSYSU 課程與教科書慣用 `#ifndef` 三行式，考試也建議寫這個。）

#### 編譯多檔案

不用 Makefile 的手動編譯：

```bash
g++ -c Circle.cpp        # 產生 Circle.o
g++ -c main.cpp          # 產生 main.o
g++ -o app main.o Circle.o
```

用 Makefile：

```makefile
CC := g++
CFLAGS := -Wall -std=c++17

app: main.o Circle.o
	$(CC) -o app main.o Circle.o

main.o: main.cpp Circle.h
	$(CC) $(CFLAGS) -c main.cpp

Circle.o: Circle.cpp Circle.h
	$(CC) $(CFLAGS) -c Circle.cpp

clean:
	rm -f *.o app
```

#### 命名空間（Namespace）

避免「兩個函式庫都有 `sort`」這種衝突：

```cpp
namespace math {
    double square(double x) { return x * x; }
}

namespace physics {
    double square(double x) { return x * x * 9.8; }
}

int main() {
    cout << math::square(3);      // 9
    cout << physics::square(3);   // 88.2
}
```

`using namespace std;` 就是把 `std::` 底下的東西全部拉到目前作用域——**在小程式方便，在 header 檔千萬別寫**，因為會污染所有引入這個 header 的檔案。

#### 實驗課練習方向

1. 把前幾週的 `BankAccount` 類別拆成 `BankAccount.h` + `BankAccount.cpp` + `main.cpp`，附 Makefile 編譯。
2. 建立自己的 `namespace utils` 放常用函式（gcd, isPrime, ...）。
3. 寫一份 Makefile 支援多檔案專案，`make` 增量編譯（只重編變動的檔案）。

---

### 第 13 週：Stream 與檔案 I/O（Ch 12）

到目前為止都是從鍵盤讀、往螢幕印。這週學怎麼**讀寫檔案**。

#### 讀檔：`ifstream`

```cpp
#include <fstream>
using namespace std;

int main() {
    ifstream fin("input.txt");
    if (!fin) {                       // 檔案開不起來
        cerr << "cannot open input.txt\n";
        return 1;
    }
    int x, sum = 0;
    while (fin >> x) sum += x;        // 讀到 EOF 就停
    cout << sum;
}
```

`ifstream` 用法幾乎跟 `cin` 一樣，只是換一個對象。

#### 寫檔：`ofstream`

```cpp
ofstream fout("output.txt");
fout << "Hello, file!\n";
fout << 42 << ' ' << 3.14 << endl;
// 離開 scope 時自動 close
```

#### 追加模式

```cpp
ofstream fout("log.txt", ios::app);   // 開檔時附加，不覆蓋
```

#### 逐字元讀：`get` / `put`

```cpp
char c;
while (fin.get(c)) {
    if (c >= 'a' && c <= 'z') c = c - 'a' + 'A';   // 全轉大寫
    fout.put(c);
}
```

#### 判斷 EOF

`while (fin >> x)` 已經幫你判斷了。如果你想手動判斷：

```cpp
while (!fin.eof()) { ... }   // 不推薦：容易多讀一次
```

`fin >> x` 直接當條件比較安全。

#### 格式化輸出

```cpp
#include <iomanip>

cout << fixed << setprecision(3) << 3.14159;   // 3.142
cout << setw(10) << 42;                         // 靠右對齊
```

#### 實驗課練習方向

1. 讀 `input.txt` 內任意數量的整數，輸出總和到 `output.txt`。
2. 寫一支複製檔案的程式（相當於 `cp`）。
3. 讀入一份成績檔（每列：姓名 分數），排序後輸出到另一個檔。

---

### 第 14 週：繼承（Ch 14）

**繼承** = 讓一個新類別「是一個」現有類別，同時能加新的資料或改寫行為。

#### 基本語法

```cpp
class Animal {
public:
    string name;
    Animal(const string& n) : name(n) {}
    void eat() { cout << name << " is eating.\n"; }
};

class Dog : public Animal {
public:
    Dog(const string& n) : Animal(n) {}   // 呼叫父類別建構子
    void bark() { cout << name << " says woof!\n"; }
};

int main() {
    Dog d("Kuro");
    d.eat();   // 繼承自 Animal
    d.bark();  // Dog 自己的
}
```

- `class Dog : public Animal` 表示 Dog **公有繼承** Animal。
- Dog 的建構子透過**初始化列表**呼叫 Animal 的建構子。

#### `public` / `protected` / `private` 繼承

| 父類成員 | `public` 繼承後 | `protected` 繼承後 | `private` 繼承後 |
| --- | --- | --- | --- |
| `public` | `public` | `protected` | `private` |
| `protected` | `protected` | `protected` | `private` |
| `private` | 不可存取 | 不可存取 | 不可存取 |

99% 的時候寫 `public` 繼承——「Dog **是一個** Animal」。

#### 覆寫（Redefinition）父類函式

```cpp
class Animal {
public:
    void speak() { cout << "some sound\n"; }
};

class Dog : public Animal {
public:
    void speak() { cout << "woof\n"; }   // 覆寫掉
};

Dog d;
d.speak();          // woof
d.Animal::speak();  // 明確呼叫父類版本：some sound
```

#### 建構順序與解構順序

- **建構**：先父後子
- **解構**：先子後父

如果類別內部有 `new` 出來的資源，記得寫**解構子（destructor）**：

```cpp
class MyArray {
    int* data;
    int  n;
public:
    MyArray(int n) : n(n), data(new int[n]) {}
    ~MyArray() { delete[] data; }
};
```

#### 「Is-a」vs.「Has-a」

- **Is-a**（繼承）：Dog **是一個** Animal → `class Dog : public Animal`
- **Has-a**（組合）：Car **有一個** Engine → 把 Engine 當成員變數即可

**多數情況下，組合比繼承好用。** 繼承很強，也很容易被濫用。

#### 實驗課練習方向

1. 定義 `Shape` 基類（有 `area()`），派生 `Circle`、`Rectangle`、`Triangle`。
2. 定義 `Employee` 基類（有 name、salary），派生 `Manager`（加 bonus）、`Engineer`（加 overtime）。
3. 練習寫解構子：`class Stack` 用動態陣列實作，析構時要 `delete[]`。

---

### 第 15 週：期末考 I（筆試，Ch 1–12、Ch 14）

筆試常見題型與準備策略：

- **手寫程式片段**：不能用 IDE 自動補全，平常寫 code 就多練不看 reference 手寫類別骨架。
- **看程式碼答輸出**：把每章「雷區」段落再讀一次（整數除法、`switch` 忘 `break`、`==` 與 `=`、指標算術、拷貝建構子…）。
- **選擇 / 填空**：`const` 位置、`static` 差別、繼承 access control 表格。

複習表：

1. 基本語法（Ch 1–2）
2. 函式、參數傳遞、重載（Ch 3–4）
3. 陣列與二維陣列（Ch 5）
4. struct / class / encapsulation（Ch 6）
5. 建構子、初始化列表、static、vector（Ch 7）
6. 運算子重載、friend、`>>`/`<<`（Ch 8）
7. C-string 與 `string`（Ch 9）
8. 指標、`new` / `delete`、動態陣列、拷貝建構子（Ch 10）
9. 分離編譯、header、namespace（Ch 11）
10. Stream 與檔案 I/O（Ch 12）
11. 繼承、覆寫、`protected`、解構子（Ch 14）

**建議節奏**：期中考後就開始每天一章複習，週末做兩章的綜合題目；不要留到最後一週。

---

### 第 16 週：期末考 II（上機考試，Ch 1–12、Ch 14）

這是**佔 40% 的關鍵大魔王**。這一場考完通常直接決定學期分數。

**上機考的加分機制**（來自公開規則）：

> 期末考 II（上機）成績較期中考進步達 30 分以上者，學期總成績可獲加分 1~3 分。

也就是說，就算你期中考砸了，只要期末上機大幅進步，還能救回來。

#### 上機考「當場流程」建議

1. **開場先建學號資料夾 + Makefile**：把 Part 0 的模組化 Makefile 貼好，之後每寫一題只是新增 `Qn.cpp`。
2. **每寫完一題 `make`**：**必須完全沒 warning**（`-Wall` 幫忙）。任何 warning / error 都會被扣 2 分。
3. **每寫完一題跑幾組測資**：至少測一組給定範例、一組邊界（0、負數、單一元素等）。
4. **上廁所前先存檔**、**當機立刻舉手**。
5. **考完不要關機、不要關 Ubuntu**，助教確認繳交成功才離開。

#### 平常怎麼練

- **限時做題**：找一段 90 分鐘，關掉 IDE，只用 `nano` + `g++`，寫兩三題出來。
- **不用網路查函式**：練到不查文件就能寫出 `sort`、`getline`、`ifstream`。
- **練 debug**：故意做出 undefined behavior（dangling pointer、越界、忘記 `break`）看 compiler 的反應。

---

## Part 3：整學期共通建議

1. **每週的實驗課練習題**不要拖：拖到期中前一週補會太痛苦。
2. **每次交檔前 `make clean && make`**：確認在乾淨狀態下能編過。
3. **善用 `-Wall`、`-Wextra`**：把 warning 當 error 看。
4. **保留自己的 code**：期末考前拿自己的舊 code 練，比看範例快。
5. **課程叫「C 程式設計」但實質是 C++**：日後找 C++ 資料時要用 C++ 關鍵字去搜（`class`、`vector`、`ifstream`），不要搜 C 的資料。
6. **教科書是 reference，不是必讀**：本文的目的就是讓你**不需要天天翻書**也能跟上。但真的想深入某個主題（例如 STL 模板、多重繼承細節），*Absolute C++* 對應章節寫得比大部分中文教材完整，值得拿正版來讀。

---

## 附錄 A：常用 g++ 編譯選項

```bash
g++ -Wall -Wextra -std=c++17 -o app main.cpp    # 打開全部警告 + C++17
g++ -g -o app main.cpp                          # 加入 debug 資訊（配合 gdb）
g++ -O2 -o app main.cpp                         # 開優化
g++ -c foo.cpp                                  # 只編到 .o，不 link
```

## 附錄 B：一份可以整學期直接用的模組化 Makefile

```makefile
CC       := g++
CFLAGS   := -Wall -Wextra -std=c++17
SRCS     := $(wildcard Q*.cpp)
TARGETS  := $(SRCS:.cpp=)

.PHONY: all clean

all: $(TARGETS)

%: %.cpp
	$(CC) $(CFLAGS) -o $@ $<

clean:
	rm -f $(TARGETS)
```

放到每週作業資料夾根目錄，`make` 一鍵編譯、`make clean` 一鍵清乾淨。

---

## 結語

這篇文章的用意，不是要**取代**上課或教科書，而是提供一份**中文、原創、可以照著跑**的自學骨幹。實驗課的每一次「檢查完可提早離開」，其實都是一次「你確定學會了」的檢查點——如果你每週都把上面練習方向做完、每次 `make` 都沒 warning，那你就走在很穩的節奏上。

祝各位期中期末都拿到理想的分數。有錯誤或建議歡迎在下方留言指出，我會即時修正。
