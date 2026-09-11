---
title: 附錄：編譯選項、Makefile、錯誤訊息與名詞速查
date: 2026-09-10
updated: 2026-09-11
permalink: 2026/09/09/nsysu-c-programming/appendix/
cover: /images/code-cover.jpg
categories: [程式設計]
tags: [C++, 中山大學, 自學指南]
toc: true
comments: true
hidden: true
---

[← 12/24｜期末上機考（範圍 Ch 1–12、Ch 14）](/2026/09/09/nsysu-c-programming/1224-final-lab/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/)

## 常用 g++ 編譯選項

```bash
g++ -Wall -Wextra -std=c++17 -o app main.cpp   # 開全部警告 + 指定 C++17（平常就用這個）
g++ -g -o app main.cpp                          # 加入除錯資訊（配合 gdb）
g++ -O2 -o app main.cpp                         # 開最佳化（跑比較快）
g++ -c foo.cpp                                  # 只編譯成 .o，不連結
g++ -E foo.cpp -o foo.i                         # 只做前置處理（看 #include 展開的結果）
g++ -fsanitize=address -g -o app main.cpp       # 執行時偵測陣列越界與記憶體錯誤
```

最後一個 `-fsanitize=address` 特別推薦：程式跑起來會幫你抓出越界存取、記憶體洩漏、重複釋放，並且**直接告訴你錯在第幾行**。平常除錯用它，交作業前再拿掉。

## 整學期通用的 Makefile

放在每週的作業資料夾根目錄，`make` 一鍵編譯、`make clean` 一鍵清乾淨：

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

如果當週某一題需要多個檔案（例如拆成 `.h` / `.cpp`），就在下面另外加一條專屬規則：

```makefile
Q6: main.o Student.o
	$(CC) -o $@ $^

main.o: main.cpp Student.h
	$(CC) $(CFLAGS) -c $<

Student.o: Student.cpp Student.h
	$(CC) $(CFLAGS) -c $<
```

## 常見錯誤訊息對照表

**編譯錯誤（compile error）**

| 訊息 | 意思 | 常見原因 |
| --- | --- | --- |
| `expected ';' before ...` | 少了分號 | `struct`/`class` 結尾漏分號、上一行忘了分號 |
| `'xxx' was not declared in this scope` | 用了不存在的名字 | 變數沒宣告、拼錯字、忘了 `#include`、超出作用域 |
| `expected initializer before '...'` | 語法在更前面就斷了 | **往上一行找**，通常是漏分號或括號沒配對 |
| `no matching function for call to ...` | 找不到符合的函式版本 | 參數型別或個數不對、缺預設建構子 |
| `call of overloaded ... is ambiguous` | 有兩個一樣好的候選 | 重載版本的參數型別太相近 |
| `passing 'const X' as 'this' argument discards qualifiers` | 對 const 物件呼叫了非 const 函式 | 唯讀成員函式忘了加 `const` |
| `invalid conversion from 'int' to 'int*'` | 型別不合 | 忘了 `&` 或多寫了 `*` |
| `redefinition of 'class X'` | 同一個東西定義兩次 | header 忘了 include guard |
| `fatal error: xxx.h: No such file or directory` | 找不到檔案 | 檔名拼錯、`<>` 與 `""` 用錯 |

**連結錯誤（link error）**

| 訊息 | 意思 | 常見原因 |
| --- | --- | --- |
| `undefined reference to 'foo()'` | 有宣告但找不到實作 | 少編譯某個 `.cpp`、定義時忘了寫 `類別名::`、簽名不一致 |
| `undefined reference to 'main'` | 找不到主程式 | 拼成 `Main`、或整個專案沒有 `main` |
| `multiple definition of 'x'` | 同一個東西定義多次 | 把變數或函式的**定義**寫在 header 裡 |

**執行時期錯誤（runtime error）**

| 現象 | 意思 | 常見原因 |
| --- | --- | --- |
| `Segmentation fault (core dumped)` | 存取了不該碰的記憶體 | 陣列越界、對 `nullptr` 解參考、無窮遞迴 |
| `free(): double free detected` / `double free or corruption` | 同一塊記憶體被釋放兩次 | 淺拷貝沒補三法則、`delete` 寫兩次 |
| `std::bad_alloc` | 記憶體配置失敗 | `new` 要的量太大（常見於變數沒初始化） |
| 程式卡住不動 | 無窮迴圈 | 迴圈變數沒更新、條件用 `!=` 剛好跳過 |
| 輸出多一筆或少一筆 | 讀檔邏輯錯 | 用 `while (!fin.eof())` 當條件 |

**Makefile 錯誤**

| 訊息 | 意思 |
| --- | --- |
| `missing separator` | recipe 前面用了空格，必須是 **Tab** |
| `No rule to make target 'Q3.cpp'` | 檔名打錯，或檔案不在這個目錄 |
| `make: 'app' is up to date.` | 相依關係沒寫對，make 以為不用重編（改 header 時最常見） |

## 名詞速查表

| 名詞 | 白話解釋 |
| --- | --- |
| **編譯（compile）** | 把 `.cpp` 翻譯成電腦看得懂的機器碼 |
| **連結（link）** | 把多個 `.o` 與函式庫接成一個執行檔 |
| **執行檔** | 編譯連結完成、可以直接跑的檔案，Linux 用 `./檔名` 執行 |
| **標準輸入 / 輸出** | 程式預設的輸入來源（鍵盤）與輸出去處（螢幕） |
| **變數** | 有名字的儲存格，可以放一個值 |
| **型別** | 這個格子裝什麼種類的資料（整數、小數、字元……） |
| **函式（function）** | 一段有名字、可以重複呼叫的程式 |
| **參數 / 引數** | 參數是函式定義裡的變數名；引數是呼叫時實際傳進去的值 |
| **傳值 / 傳參考** | 傳複製品（改不到外面）／傳本人的別名（改得到外面） |
| **重載（overload）** | 同名函式、不同參數列表並存 |
| **陣列** | 一排編號的同型別格子，編號從 0 開始 |
| **越界（out of range）** | 存取了陣列合法範圍以外的格子，C++ 不會幫你擋 |
| **結構（struct）** | 把幾個相關欄位綁成一包的自訂型別 |
| **類別（class）** | 資料 + 操作資料的函式綁在一起；預設成員是 private |
| **物件（object）** | 由類別產生出來的實體變數 |
| **封裝（encapsulation）** | 資料設成 private，只開放少數 public 函式操作 |
| **建構子（constructor）** | 與類別同名、沒有回傳型別，物件誕生時自動執行 |
| **解構子（destructor）** | `~類別名`，物件消失時自動執行，用來還資源 |
| **初始化列表** | 建構子參數列後面用 `: 成員(值)` 直接初始化成員 |
| **`static` 成員** | 屬於整個類別、所有物件共用的一份 |
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
