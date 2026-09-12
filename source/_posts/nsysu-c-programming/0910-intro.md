---
title: 09/10｜課程介紹與環境暖身
date: 2026-09-10
updated: 2026-09-12
permalink: 2026/09/09/nsysu-c-programming/0910-intro/
cover: /images/code-cover.jpg
categories: [程式設計]
tags: [C++, 中山大學, 自學指南]
toc: true
comments: true
hidden: true
---

[← 環境設置](/2026/09/09/nsysu-c-programming/setup/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [09/17｜C++ 基礎（Ch 1） →](/2026/09/09/nsysu-c-programming/0917-cpp-basics/)

第一週主課是課程介紹，實驗課則會帶你把 VirtualBox / Ubuntu / g++ / Makefile 弄起來。這一篇講四件事：這門課實際在教什麼、整學期怎麼走、這週該做完什麼、以及第一次編譯失敗時怎麼辦。

## 這門課到底在教什麼

課名寫「C 程式設計」，但**整學期教的是 C++**。課名是舊的，內容不是——別因為課名跑去學 C。

C++ 幾乎把 C 的語法整套收了進來，所以**你不用先學 C 再學 C++**，直接學 C++ 就好。C++ 多的是 C 沒有的東西，最重要的是**類別（class）**：把資料和操作它的動作包成一組，例如把一個學生的姓名、三科成績，跟「算平均」這個動作包成一個叫 `Student` 的東西，假設班上有位同學的資料就存成一個 `Student`、取名叫 `ming`，之後要算他的平均就寫 `ming.average()`（示意寫法。`.` 唸作「的」，左邊是哪一個學生、右邊是要他做的事；後面那對空的 `()` 表示「執行這個動作，不用另外給資料」。10/15 起會正式教）。

實務上的差別列成一張表。**現在看不懂是正常的**，09/17 起會一項一項教：

| 做同一件事 | C 的寫法 | C++ 的寫法（這門課用這個） |
| --- | --- | --- |
| 印東西到螢幕 | `printf("%d\n", x);` | `cout << x << '\n';` |
| 從鍵盤讀資料 | `scanf("%d", &x);` | `cin >> x;` |
| 字串 | `char s[100];` | `string s;` |
| 動態要記憶體 | `malloc` / `free` | `new` / `delete` |

幾個符號先各給一句解釋：

- `'\n'` 是**換行字元**，作用跟 Hello World 用過的 `endl` 幾乎一樣（差別 09/17 講）。C++ **單引號包一個字元、雙引號包一串字串**；`\n` 夾在雙引號裡也一樣是換行（像左欄的 `"%d\n"`），只是變成那串字裡的一個字。
- `string s;` 是**宣告一個叫 `s` 的字串變數**（要多加 `#include <string>`），長度自動調整；C 得自己先開一塊放 100 個字元的空間，那就是 `char s[100];`（`char` 是「一個字元」的型別，中括號 `[100]` 是「連續一排 100 個」，10/08 講陣列）。「動態要記憶體」＝程式跑到一半才決定要多少空間（[11/19](/2026/09/09/nsysu-c-programming/1119-pointers/) 才會用到），這門課用 `new` / `delete`，不用 `malloc` / `free`。
- 左欄的 `%d` 是「這裡填一個整數」的佔位符；`&x` 的 `&` 是「取出 x 放在記憶體的哪一格」（那一格的編號叫**記憶體位址**，11/19 會正式講）。C++ 的 `&x` 是同一個意思（11/19 講指標時會用到），`&` 另外還有「傳參考」的用法（10/01 教）；現在認得出左欄是 C 就夠了。

**所以查資料時請用 C++ 的關鍵字搜**（`cout`、`cin`、`class`）。搜到的頁面整篇在用 `printf`、`scanf`、`malloc`，那是 C 的教學，語法對不上，愈看愈亂。

## 整學期的地圖

如果覺得進度表看起來很雜，可以先記住它其實只有三大塊：

```text
① 基本功（9 月–10 月初）    變數、判斷、迴圈、函式、陣列
        ↓  把一堆散落的變數和函式收納起來
② 物件（10 月中–11 月中）   struct / class ｜ 建構子、vector、運算子重載
        ↓  搞懂資料實際存在記憶體的哪裡
③ 進階（11 月中–12 月）     指標與動態記憶體、分離編譯、檔案 I/O、繼承
```

期中考（11/05）考 Ch1–6，也就是 ① 全部，加上 ② 只到 struct / class（圖裡 `｜` 的左邊）為止——**建構子、`vector`、運算子重載都不考**，留到期末。而 ① 的東西後面每一週都會用到，基本功沒打穩，②③ 會非常痛苦。

## 第一週實際要做的事

**任務 ①：環境驗收。** 把[〈環境設置〉](/2026/09/09/nsysu-c-programming/setup/)整段從頭到尾走一次，包含 Guest Additions 與快照。走完之後用下面這串驗收，**全部自己一個字一個字敲，不要複製貼上**（Makefile 記不起來就開〈環境設置〉照著看，但要自己打；其他步驟盡量別查。`B153040XXX` 四個地方全部換成你自己的學號）：

```bash
mkdir -p ~/week01/B153040XXX && cd ~/week01/B153040XXX
nano Q1.cpp          # 寫一支印出自己學號的程式
nano Makefile        # 寫模組化 Makefile（recipe 那行開頭記得按 Tab，不是空白）
make && ./Q1
make clean && ls     # 執行檔應該被清乾淨
cd .. && zip -r B153040XXX.zip B153040XXX/
```

一個沒教過的符號：`mkdir -p` 的 `-p` 表示**連中間不存在的上層資料夾一起建**，所以 `week01` 沒建過也沒關係。`&&`〈環境設置〉講過，所以 `make && ./Q1` 就是「編譯成功才執行」，失敗就會停在那裡不會亂跑（09/24 會教 C++ 裡的 `&&`，意思一樣是「兩個都成立才算成立」，只是寫在 `if` 的條件裡，不是寫在指令之間）。另外，指令後面 `#` 開頭的中文是寫給你看的說明，**不用跟著打**——這個 `#` 是 Terminal 的註解符號，跟 C++ 裡 `#include` 的 `#` 沒有關係。

**過關的樣子**：`make` 印出一行 `g++ -Wall -Wextra -std=c++17 -o Q1 Q1.cpp` 而且沒有任何紅字；`./Q1` 印出你的學號；`make clean` 會先印一行 `rm -f Q1`（make 在回報它刪掉了什麼），接著 `ls` 的結果只剩 `Makefile` 和 `Q1.cpp`，`Q1` 不見了。任何一步跟這不一樣，回〈環境設置〉對一次。

**任務 ②：把 `HelloWorld.cpp` 主動弄壞三次**，看懂訊息再改回來，做法見下一節。兩件都做完這週才算過關——環境沒弄好，之後每一週的實驗課都會被拖住，而實驗課的分數是**當場檢查**給的，拖不起。

## 第一次編譯失敗時怎麼辦

編譯錯誤（compile error）不是「我不會寫程式」的證據，寫很多年的人也每天在遇到；重點是學會讀訊息，而最快的方法是**主動把程式弄壞**。下面三種是第一個月最常見的錯誤，拿〈環境設置〉那支 `HelloWorld.cpp` 一個一個試，每次編譯一遍、看完訊息再改回來。

**訊息一律從上往下讀**，下面每個例子都會照著順序一行一行帶。

**① 刪掉 `cout` 那行結尾的分號**

```text
HelloWorld.cpp: In function ‘int main()’:
HelloWorld.cpp:5:36: error: expected ‘;’ before ‘return’
    5 |     cout << "Hello, NSYSU!" << endl
      |                                    ^
      |                                    ;
    6 |     return 0;
      |     ~~~~~~
```

由上往下：

1. `HelloWorld.cpp: In function ‘int main()’:`——**標題行**，說接下來的錯誤發生在 `main` 裡面。本身不是錯誤。
2. `HelloWorld.cpp:5:36: error: expected ‘;’ before ‘return’`——**這行才是重點**。格式固定是 `檔名:行號:欄號: error: 說明`，所以是第 5 行、第 36 個字元附近，少了一個分號。
3. `    5 |     cout << "Hello, NSYSU!" << endl`——把你的第 5 行原樣印出來，讓你不用切回編輯器對照。
4. `      |                                    ^`——`^` 指到第 36 欄，也就是上一行說的位置。
5. `      |                                    ;`——g++ 直接告訴你「這裡補一個 `;`」。
6. `    6 |     return 0;` 與底下的 `~~~~~~`——順便把**相關的下一行**也印出來。這排是 `~` 不是 `^`，意思是「參考用」，**不是叫你改這裡**。

所以實際讀法只有兩步：**看第 2 行知道哪一行哪一欄 → 看第 4 行的 `^` 確認位置 → 動手**。中間那些框線都是輔助。

**② 把 `cout` 拼成 `cuot`**

```text
HelloWorld.cpp: In function ‘int main()’:
HelloWorld.cpp:5:5: error: ‘cuot’ was not declared in this scope
    5 |     cuot << "Hello, NSYSU!" << endl;
      |     ^~~~
```

由上往下：

1. 同樣是標題行，跳過。
2. `error: ‘cuot’ was not declared in this scope`——「這個名字我沒看過」。第一週看到它，九成是**拼錯字**或**忘了 `#include`**。
3. 你的第 5 行。
4. `^~~~`——`^` 是頭、`~` 是身體，整串標出的是**同一個字**（`cuot` 四個字母），告訴你問題出在這個名字上。

**③ 刪掉整行 `using namespace std;`**

這次會噴 17 行。先看前 9 行：

```text
HelloWorld.cpp: In function ‘int main()’:
HelloWorld.cpp:4:5: error: ‘cout’ was not declared in this scope; did you mean ‘std::cout’?
    4 |     cout << "Hello, NSYSU!" << endl;
      |     ^~~~
      |     std::cout
In file included from HelloWorld.cpp:1:
/usr/include/c++/15/iostream:65:18: note: ‘std::cout’ declared here
   65 |   extern ostream cout;          ///< Linked to standard output
      |                  ^~~~
```

由上往下：

1. 標題行，跳過。
2. `error: ‘cout’ was not declared in this scope; did you mean ‘std::cout’?`——**第一個也是唯一要修的錯誤**。跟例 ② 一樣是「沒看過這個名字」，但 g++ 多問了一句「你是不是要寫 `std::cout`？」——這就是答案。
3. 你的第 4 行。
4. `^~~~` 標出 `cout` 這個字。
5. `std::cout`——g++ 建議的替代寫法。
6. `In file included from HelloWorld.cpp:1:`——**分隔標題**，表示「以下要講的東西來自你第 1 行 `#include` 進來的檔案」。從這行開始，話題已經離開你的程式了。
7. `note: ‘std::cout’ declared here`——**`note:` 不是錯誤**，只是補充「真正的 `cout` 定義在這裡」。不用修，也不算一個錯。
8. `65 |   extern ostream cout;   ///< Linked to standard output`——C++ 函式庫自己的原始碼。`///<` 之後的英文是**註解**（`//` 之後到行尾編譯器整段忽略），整學期用不到。
9. `^~~~` 標出函式庫裡的 `cout`。

剩下的 8 行是**同樣的結構再來一次**，只是把 `cout` 換成 `endl`——因為你一行程式用了兩個 `std` 裡的名字。修好一個（把 `using namespace std;` 加回去），兩個一起消失。

**所以看到滿螢幕訊息，只要做兩件事**：

- **只看檔名是自己 `.cpp` 的那幾行**。路徑長得像 `/usr/include/c++/15/...` 的是函式庫原始碼，跳過（`c++/` 後面的數字是 g++ 版本，我這台是 15、虛擬機的 Ubuntu 20.04 是 9，行號也不一樣，不用對）。
- **永遠先修最上面那個 `error:`**，存檔、重編、再看剩下幾個。不要一次想修五個——它們常常是同一個原因造成的。

三種標籤的差別記一下就好：`error:` 要修、`note:` 是補充說明、`檔名: In function ...:` 和 `In file included from ...:` 是分隔標題。

**兩條順手的規則**

- `expected ‘;’ before ‘X’` 就是「**`X` 前面少了分號**」，要補的位置在 `X` 之前。例 ① 的 `^` 剛好落在第 5 行行尾；但漏分號的地方如果在行中間（例如 `int x = 5` 後面），g++ 會把箭頭指到**下一行的開頭**，訊息變成 `expected ‘,’ or ‘;’ before ‘cout’`，這時要補的是**上一行的行尾**。行號指的是「編譯器發現不對勁的地方」，不一定是你打錯字的那一行。
- `#` 開頭的 `#include` 結尾**不用**分號（分號規則〈環境設置〉講過）。

**另一種長得不一樣的：連結錯誤**

```text
/usr/bin/ld: /tmp/ccnifCRm.o: in function ‘main’:
link.cpp:(.text+0x9): undefined reference to ‘foo()’
collect2: error: ld returned 1 exit status
```

三行、開頭是 `/usr/bin/ld:`、結尾是 `collect2: error:`，中間那行有檔名卻**連行號都沒有**（`(.text+0x9)` 是機器碼裡的位置，不是你的第 9 行）。這是[〈環境設置〉的第 ④ 關](/2026/09/09/nsysu-c-programming/setup/#編譯到底發生了什麼事)講的連結階段出問題，第一週通常不會遇到。

**編過了不代表對。** 編譯器只檢查文法，不檢查你想做的事對不對——把加法寫成減法，它一個字都不會說。

遇到這篇沒提到的錯誤訊息，先查[附錄的常見錯誤訊息對照表](/2026/09/09/nsysu-c-programming/appendix/#常見錯誤訊息對照表)。

## 本週重點回顧

- 課名是 C，教的是 **C++**；找資料要用 C++ 的關鍵字。整學期只有三塊：基本功 → 物件 → 進階，期中考只考到 ② 的 struct / class 為止。
- 這週兩件任務：把環境弄到「不用想就能編譯執行」，以及主動把 `HelloWorld.cpp` 弄壞三次。
- 讀編譯錯誤只要一招：**先修最上面那一個**，而且只看檔名是自己 `.cpp` 的那幾行。

---

[← 環境設置](/2026/09/09/nsysu-c-programming/setup/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [09/17｜C++ 基礎（Ch 1） →](/2026/09/09/nsysu-c-programming/0917-cpp-basics/)
