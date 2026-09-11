---
title: 中山大學 C 程式設計 & 實驗課完整自學指南（1151 學期）
date: 2026-09-10
updated: 2026-09-11
cover: /images/code-cover.jpg
categories: [程式設計]
tags: [C++, 中山大學, 自學指南, GCC, Makefile, Ubuntu]
description: 依照國立中山大學 CSE123「C 程式設計」與其實驗課 1151 學期的公開進度表，整理一份可完全自學、不需翻書即可跟上整學期的教學筆記。含環境安裝、GCC / Makefile 原理、每週語法深入講解、常見雷區、逐週原創練習題與參考解答，以及期中／期末模擬考。
toc: true
comments: true
mermaid: false
---

> **關於這份筆記**
> 本文依據國立中山大學資工系 CSE123「C 程式設計」（授課老師：柯正雯 副教授）與其對應實驗課 1151 學期的**公開進度表**寫成。內容皆為筆者針對每一週語法重點所整理的**原創說明、自寫範例與自出練習題**，並不轉載教科書 *Absolute C++* (Walter Savitch, 6/e) 內文、圖片、習題題目或授課教授自製投影片。若讀者希望取得完整原文與課本習題，仍請透過正版管道取得該書。
>
> 文中所有程式碼都在 `g++ -Wall -Wextra -std=c++17` 下實際編譯執行過。

---

## 前言：這份文件想解決什麼問題

修過中山資工「C 程式設計」的同學都知道兩件事：

1. 教科書是 Pearson 全球版的 *Absolute C++*，英文、很厚，一章動輒五六十頁。
2. 這門課雖然叫「C 程式設計」，實際教的是 **C++**（從 `cout`、`class`、`vector` 一路到 `inheritance`），只是課名沿用歷史名稱。

對大一新生來說，第一次接觸程式又要看原文書相當吃力；而實驗課的節奏更現實——**當週講完就要在 Ubuntu + g++ + Makefile 環境把題目寫出來、給助教檢查**，檢查完才能走。卡在環境、卡在 Makefile、卡在「書上寫的我看不懂」，一個下午就沒了。

所以這篇文章想做的事很單純：

- 把整學期的公開進度攤開，**每一週該會什麼、為什麼這樣寫、哪裡會踩雷**，用中文講清楚。
- 每一週附上**我自己出的練習題**（含輸入輸出範例與參考解答），難度貼近實驗課實作題。
- 把**環境、Makefile、上機考流程**寫成可以照抄的 SOP，讓你不要死在非程式問題上。
- 附上**期中模擬上機考、期末筆試模擬題、期末模擬上機考**，讓你考前有東西可以練。

讀法建議：**不要一次讀完**。每週上課前讀當週那一節（15 分鐘），上課後把練習題做完（60–90 分鐘），就是最有效率的用法。

---

## 課程與評分資訊（來自公開 Syllabus）

以下屬於公開授課大綱上的事實性資訊：

- **課號**：CSE123，1151 學期
- **系所**：國立中山大學資訊工程學系
- **教科書**：*Absolute C++*, Walter Savitch, 6th Edition (Global Edition), Pearson, 2016（ISBN 978-1-292-09859-3）
- **評分（主課）**：期中考（上機）30% + 期末考 I（筆試）30% + 期末考 II（上機）40%
- **評分（實驗課）**：課堂實作 60% + 期末考試 40%
- **加分規則**：期末上機（Final Exam II）成績較期中考進步達 30 分以上者，學期總分可獲 1–3 分加分
- **成績調整規則**：學期總成績視情況調整；若有同學於成績公告後在期限內「公開具名」反應對調整有意見，則全班以原始分數送出

> 助教資訊、Office Hour 與聯絡信箱請以課程公告 / Syllabus 上的版本為準，這裡不轉載個人聯絡方式。

### 整學期進度表

下表是我把公開 Syllabus 的日期、主題與課本習題編號整理成的對照表。**點「課程內容」欄的連結可以直接跳到該週的教學段落**：

| 日期 | 課程內容 | 課本指定習題 |
| --- | --- | --- |
| 09/10 | [Introduction to the Course](#0910課程介紹與環境暖身) | — |
| 09/17 | [C++ Basics](#0917c-基礎ch-1) | Ch1: 6, 8, 13；Ch2: 2, 4, 7, 8 |
| 09/24 | [C++ Basics；Function Basics](#0924流程控制與函式基礎ch-2-ch-3) | Ch3: 1, 5, 10, 11, 13 |
| 10/01 | [Parameters and Overloading](#1001參數傳遞與函式重載ch-4) | Ch4: 3, 7, 8, 9, 14, 17 |
| 10/08 | [Function Overloading；Arrays](#1008陣列ch-5) | Ch5: 4, 8, 10, 14, 17 |
| 10/15 | [Arrays；Structures and Classes](#1015結構與類別ch-56) | Ch6: 1, 7, 10, 12 |
| 10/22 | [Structures and Classes；Constructors](#1022類別與建構子ch-67) | — |
| 10/29 | [Constructors；Vectors；Operator Overloading](#1029vector-與運算子重載入門ch-7) | — |
| 11/05 | **[Midterm Exam（上機，Ch1–Ch6）](#1105期中上機考範圍-ch-16)** | Ch7: 1, 5, 6, 8, 11 |
| 11/12 | [Operator Overloading；String](#1112運算子重載-friend-與-stringch-8-ch-9) | Ch8: 1, 4, 5, 8, 9 |
| 11/19 | [Pointers](#1119指標-動態記憶體與-c-風格字串ch-9-ch-10) | Ch9: 2, 4, 6, 10；Ch10: 1, 3, 4, 8 |
| 11/26 | [Separate Compilation and Namespaces](#1126分離編譯與命名空間ch-11) | Ch11: 1, 3 |
| 12/03 | [Streams and File I/O](#1203檔案輸入輸出ch-12) | Ch12: 2, 3, 5 |
| 12/10 | [Inheritance](#1210繼承ch-14) | Ch14: 4, 6, 8 |
| 12/17 | **[Final Exam I（筆試，Ch1–Ch12、Ch14）](#1217期末筆試範圍-ch-112-ch-14)** | — |
| 12/24 | **[Final Exam II（上機，Ch1–Ch12、Ch14）](#1224期末上機考範圍-ch-112-ch-14)** | — |

幾個從這張表就能讀出來的重點：

1. **Ch13（Recursion）不在考試範圍**，但遞迴本身在 Ch3 就教過，仍然會考；不考的是 Ch13 那些進階遞迴設計（mutual recursion、遞迴 binary search 的形式化分析）。
2. **Ch15 以後（多型、virtual function、template、STL、例外處理）完全不在這學期範圍**。也就是說 `virtual` 關鍵字不會考，但你如果自己先學不吃虧。
3. **期中只考到 Ch6**，也就是「基礎語法 + 函式 + 陣列 + struct/class」，**不含建構子**。很多人考前拚命讀建構子，方向錯了。
4. 進度表上「10/29 才正式上 Vector / Operator Overloading」，但 Ch7 的習題是在期中考那週才發——代表這部分是期末的重點。

### 實驗課大致怎麼上（重點摘要）

以下是我把課程公告內容**整理成自己的話**的重點摘要，只寫「會影響你怎麼準備」的部分；**正式規範一律以課程公告與助教當場說明為準**。

- **課堂上沒有網路可用**，但可以帶紙本課本，也可以跟同學討論。
- **用電腦教室的電腦**寫，不是自己的筆電；教室內不吃不喝、不玩遊戲、不用手機，討論小聲點。
- 這是**系必修**，缺席太多會直接影響及格與否；要請假走正式流程並讓助教知道。
- 題目寫完**叫助教檢查**，檢查過才算分；**當週題目全部通過就可以先走**。
- 助教**下午四點就停止檢查**，所以別把題目全留到最後一小時。

> 「沒有網路 + 可以帶紙本書」這個組合對準備方式影響最大：**你不能 Google、不能問 AI**。所以平常練習時就要逼自己不查資料寫出 `getline`、`ifstream`、`sort` 這些東西——這也是本文每次介紹函式時，都會把**完整用法寫出來**的原因，方便你印出來或抄成小抄（課堂上可帶紙本）。

### 程式要怎麼交（重點摘要）

- 環境固定：**VirtualBox 虛擬機 + Ubuntu 20.04 + g++**，不能換編譯器。
- 當週有幾題就寫幾個檔，檔名是 `Q1.cpp`、`Q2.cpp`、`Q3.cpp`……依此類推。
- 要附一份 **Makefile**，`make` 一次就能把當週所有題目編成 `Q1`、`Q2`、`Q3`…… 等執行檔，而且寫法要「模組化」（後面〈Makefile：從零到模組化〉會從零教到會）。

> **名詞先解釋（之後會一直用到）**
> - **虛擬機**：在你現在的電腦裡「再開一台電腦」的軟體。這台假電腦裡跑 Ubuntu，壞掉也不會影響你原本的系統。
> - **Ubuntu**：一套 Linux 作業系統，課程指定的版本是 20.04。
> - **編譯器（compiler）**：把你寫的 C++ 原始碼翻譯成電腦看得懂的機器碼的程式，這門課用的是 **g++**。
> - **執行檔**：翻譯完成、可以直接執行的檔案。在 Linux 裡用 `./檔名` 執行。
> - **Makefile**：一份「編譯說明書」。寫好之後只要打 `make`，它就照著把所有程式編譯好，不用每題都手打一長串指令。

---

## 環境設置：第一次上實驗課前先弄好

實驗課與上機考都在**虛擬機的 Ubuntu 20.04 LTS** + **g++** + **Makefile** 環境完成。這一段請在第一次實驗課前先自己做一遍，課堂上就不會耗掉整個下午。

### 給完全沒寫過程式的人：先建立三個概念

如果你這學期之前沒碰過程式，先花三分鐘把下面三件事看懂，後面會順很多。

**① 程式是「文字檔」，電腦看不懂，要先翻譯**

你寫的 C++ 程式就是一個普通的文字檔（副檔名 `.cpp`），裡面是人看得懂的英文。電腦只認得 0 和 1，所以中間需要一個翻譯官：**編譯器（compiler）**。這門課的編譯器叫 **g++**。

```text
你寫的 HelloWorld.cpp  ──(g++ 翻譯)──▶  HelloWorld（執行檔，電腦看得懂）
```

翻譯的動作叫**編譯（compile）**，翻譯失敗叫 **compile error（編譯錯誤）**，通常是你打錯字或少了分號。編譯成功才會產生**執行檔**，然後才能**執行（run）**它。

**② 程式跟你溝通的兩條管子：標準輸入與標準輸出**

- **標準輸入（standard input）**：預設是你的鍵盤。程式用 `cin >> x;` 從這裡拿資料。
- **標準輸出（standard output）**：預設是螢幕。程式用 `cout << x;` 把東西印出來。

之後會看到 `./Q1 < in.txt`，意思就是「把鍵盤這條管子換成 `in.txt` 這個檔案」，程式本身完全不用改。

**③ 終端機（Terminal）就是「用打字下指令」的視窗**

平常你用滑鼠雙擊圖示開程式；在 Linux 上更常用的是打字：

```bash
cd ~/Desktop        # 「切換到桌面這個資料夾」
ls                  # 「列出這個資料夾裡有什麼」
g++ -o Q1 Q1.cpp    # 「把 Q1.cpp 編譯成名為 Q1 的執行檔」
./Q1                # 「執行目前資料夾裡的 Q1」
```

`./` 的意思是「目前這個資料夾」。少打它會出現 `command not found`，這是新手最常見的第一個卡關點。

看懂這三件事，就可以開始裝環境了。

### 安裝 VirtualBox 與 Ubuntu 20.04

1. 到 [virtualbox.org/wiki/Downloads](https://www.virtualbox.org/wiki/Downloads) 下載對應主機作業系統的 VirtualBox（Windows / macOS / Linux 都有），安裝過程一路「下一步」即可；中途跳出要安裝網路介面卡驅動的詢問，選「是」。
2. 到 [releases.ubuntu.com/20.04](https://releases.ubuntu.com/20.04/) 下載 **64-bit PC (AMD64) desktop image**，會得到一個約 3 GB 的 `.iso` 光碟映像檔。**務必是 20.04 LTS**，因為上機考規定要與助教環境一致。
3. 打開 VirtualBox → **新增（New）**：
   - 名稱：例如 `NSYSU-CPP`
   - 類型：Linux / 版本：Ubuntu (64-bit)
   - 記憶體：**依自身電腦調整**，實體 8 GB 的機器給 4 GB、16 GB 的給 8 GB
   - 硬碟：建立新的虛擬硬碟（VDI，動態配置），**建議 20 GB 以上**
4. 選中剛建立的虛擬機 → **設定（Settings）** → **儲存（Storage）** → 點「空」的光碟機 → 右邊光碟圖示 → **選擇虛擬光碟檔案** → 選剛剛下載的 `.iso` → 確定。
5. **啟動**，第一次開機會進入 Ubuntu 安裝流程：
   - 語系**建議選英文**。中文語系會把家目錄變成「桌面 / 下載 / 文件」，之後在 Terminal `cd 桌面` 打中文很煩。
   - 如果視窗解析度太小、按不到 `Continue`，按住 `Alt` 再用滑鼠拖曳視窗（`Alt + F7` 也可以進入移動模式）。
   - 安裝類型維持預設（Erase disk and install Ubuntu，這是抹掉**虛擬**硬碟，不會動到你的實體硬碟）。
   - 填使用者名稱與密碼——**這個密碼之後每次 `sudo` 都要用，一定要記得**。
6. 安裝完成重開機，右上角選單 → **Settings → Displays**，把解析度調到符合你的螢幕，這樣左下角的應用程式選單才好按，才找得到 Terminal。

**三個會讓你之後很爽的設定（強烈建議做）：**

- **安裝 Guest Additions**：虛擬機視窗選單 → 裝置 → 安裝 Guest Additions CD 映像，之後可以自動調整解析度、開啟**雙向剪貼簿**（設定 → 一般 → 進階 → 共用剪貼簿：雙向）。寫作業時能從主機複製題目文字進去，省很多時間。
- **建立快照（Snapshot）**：環境弄好後先照一張快照。之後哪天把系統玩壞了（`sudo rm` 砍錯東西），一鍵還原，不用重裝。
- **共用資料夾**：設定 → 共用資料夾，把主機某個資料夾掛進 Ubuntu，方便把 `.zip` 搬出來上傳。

> 注意：**上機考當天只能用 Ubuntu 與 Ubuntu 內的文字編輯器**。共用剪貼簿與共用資料夾是平常練習的便利設定，考試時請遵照現場助教指示。

### 安裝 g++ 與 make

開啟 Terminal（左下角九宮格搜尋 `terminal`，或快捷鍵 `Ctrl + Alt + T`），輸入：

```bash
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install g++
sudo apt-get install make
```

- `sudo` 代表以系統管理員權限執行，會要求輸入密碼（就是安裝 Ubuntu 時設定的登入密碼）。**輸入密碼時畫面不會有任何顯示，這是正常的**，打完直接按 Enter。
- 中途跳出 `Do you want to continue? [Y/n]` 一律回 `y` 再 Enter。

裝完驗證：

```bash
g++ --version
make --version
```

有版本號跑出來就成功（Ubuntu 20.04 預設的 g++ 是 9.x，支援 `-std=c++17`）。

如果出現 `E: Could not get lock /var/lib/dpkg/lock-frontend`，代表背景的自動更新正在跑，等一兩分鐘再試，或重開機後再執行。

### 第一支 Hello World

在桌面按右鍵 → **New Document → Empty Document**，改名為 `HelloWorld.cpp`（注意副檔名要是 `.cpp`），用文字編輯器打開，貼入：

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, NSYSU!" << endl;
    return 0;
}
```

回到 Terminal：

```bash
cd ~/Desktop
g++ -c HelloWorld.cpp              # 編譯，產生 HelloWorld.o
g++ -o HelloWorld HelloWorld.o     # 連結，產生執行檔 HelloWorld
./HelloWorld                       # 執行
```

看到 `Hello, NSYSU!` 就成功了。

也可以一行完成（平常最常用的寫法）：

```bash
g++ -Wall -Wextra -std=c++17 -o HelloWorld HelloWorld.cpp
./HelloWorld
```

**逐行解釋這支程式：**

| 程式碼 | 意義 |
| --- | --- |
| `#include <iostream>` | 前置處理指令，把標準輸入輸出函式庫的宣告「貼」進來，之後才能用 `cout` / `cin` |
| `using namespace std;` | 把 `std` 命名空間拉進來，讓你可以寫 `cout` 而不是 `std::cout` |
| `int main()` | 程式進入點。作業系統執行你的程式，就是呼叫這個函式 |
| `cout << "..." << endl;` | 把字串送到標準輸出，`endl` 換行並清空輸出緩衝區 |
| `return 0;` | 回傳 0 給作業系統，表示「正常結束」。非 0 表示發生錯誤 |

### 編譯到底發生了什麼事

很多人卡在「錯誤訊息看不懂」，是因為不知道 g++ 其實做了**四件事**：

```text
HelloWorld.cpp
   │  ① 前置處理 Preprocessing   （展開 #include、#define）
   ▼
HelloWorld.i  （純 C++ 原始碼，沒有任何 # 開頭的東西）
   │  ② 編譯 Compilation         （語法檢查、產生組合語言）
   ▼
HelloWorld.s  （組合語言）
   │  ③ 組譯 Assembly            （轉成機器碼）
   ▼
HelloWorld.o  （目的檔 object file，還不能執行）
   │  ④ 連結 Linking             （把多個 .o 與函式庫接起來）
   ▼
HelloWorld    （執行檔）
```

想親眼看到中間產物：

```bash
g++ -E HelloWorld.cpp -o HelloWorld.i   # 只做前置處理
g++ -S HelloWorld.cpp                   # 產生 .s 組合語言
g++ -c HelloWorld.cpp                   # 產生 .o
g++ -o HelloWorld HelloWorld.o          # 連結
```

**為什麼要懂這個？** 因為錯誤訊息的類型直接告訴你卡在哪一關：

| 訊息長相 | 發生階段 | 常見原因 |
| --- | --- | --- |
| `fatal error: xxx.h: No such file or directory` | ① 前置處理 | header 檔名打錯、路徑不對 |
| `error: expected ';' before '}' token` | ② 編譯 | 少分號、括號沒配對 |
| `error: 'xxx' was not declared in this scope` | ② 編譯 | 變數沒宣告、忘了 `#include`、拼錯字 |
| `undefined reference to 'foo()'` | ④ 連結 | 函式只有宣告沒有定義、少編譯某個 `.cpp` |
| `Segmentation fault (core dumped)` | 執行時期 | 陣列越界、解參考空指標、無窮遞迴 |

**分離編譯**（後面〈分離編譯與命名空間〉那一節）就是刻意把 ③ 與 ④ 拆開：每個 `.cpp` 各自編成 `.o`，改一個檔只要重編那一個，最後再一起連結。Makefile 存在的理由就是自動化這件事。

### 你必須會的 Terminal 指令

上機考期間**只能用文字編輯器 + Terminal**，不能用 VS Code、Dev-C++、任何 IDE 的自動完成或 AI 修正。所以下面這些請練到反射動作：

| 指令 | 功能 |
| --- | --- |
| `pwd` | 顯示目前所在的完整路徑（迷路時第一個下的指令） |
| `ls` | 列出當前目錄的檔案 |
| `ls -al` | 列出所有檔案（含隱藏檔）與權限、大小、時間 |
| `cd 資料夾名` | 進入子目錄（打前幾個字按 `Tab` 可自動補完） |
| `cd ..` | 回上一層 |
| `cd ~` | 回家目錄 |
| `mkdir 名稱` | 建立資料夾 |
| `rmdir 名稱` | 移除**空**資料夾 |
| `rm 檔名` | 刪除檔案 |
| `rm -i 檔名` | 刪除前逐一確認（比較安全） |
| `rm -rf 資料夾` | 遞迴強制刪除整個資料夾（**下這個指令前先 `pwd` 確認位置**） |
| `mv 來源 目的` | 移動或改名 |
| `cp 來源 目的` | 複製檔案；`cp -r` 複製資料夾 |
| `cat 檔名` | 把檔案內容印到畫面 |
| `find . -name "Q*.cpp"` | 從當前目錄往下找符合的檔案 |
| `du -h` / `df -h` | 看資料夾佔用空間 / 看硬碟剩餘空間 |
| `zip -r 學號.zip 學號/` | 把資料夾壓縮成 zip（繳交用） |
| `nano 檔名` | 用終端機文字編輯器開檔 |

**`nano` 速成**（上機考如果不會 vim，就用它）：

| 按鍵 | 功能 |
| --- | --- |
| `Ctrl + O` → Enter | 存檔（Write Out） |
| `Ctrl + X` | 離開 |
| `Ctrl + K` | 剪下整行 |
| `Ctrl + U` | 貼上 |
| `Ctrl + W` | 搜尋 |
| `Ctrl + _` | 跳到指定行號（配合編譯錯誤訊息的行號很好用） |
| `Alt + U` | 復原 |

**一個能省你大量時間的技巧：用檔案餵測資。** 每次手動打輸入很慢，改成：

```bash
nano in.txt          # 把測資存成檔案
./Q1 < in.txt        # 用檔案當標準輸入
./Q1 < in.txt > out.txt   # 順便把輸出存起來
diff out.txt ans.txt      # 跟預期答案比對，沒輸出就代表完全一樣
```

`< 檔案` 叫做**輸入重導向**，`> 檔案` 是輸出重導向。這招在實驗課逐題檢查時特別好用——助教說「換一組測資試試」，你改 `in.txt` 再跑一次就好。

### Makefile：從零到模組化

實驗課與上機考要求**每次交檔都要附一份可用的 Makefile**，能一次編譯當週所有題目。**Makefile 編不過 → 這次 0 分**，這是白紙黑字寫在規範上的。

#### Makefile 的三個組成

```makefile
目標(target): 相依檔案(prerequisites)
<Tab>	執行的指令(recipe)
```

`make` 的運作邏輯只有一句話：**如果「相依檔案」比「目標」新，就執行下面的指令**。所以改了 `Q1.cpp`，`make` 就只重編 `Q1`，沒改的不會重編——這叫**增量編譯**。

#### 最基本版本

假設當週交 `Q1.cpp` ~ `Q4.cpp`，最直觀的寫法：

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

執行：

```bash
make            # 產生四個執行檔（make 預設做第一個 target，也就是 all）
make Q2         # 只編 Q2
make clean      # 刪除四個執行檔
```

> **最常見的錯誤：`Makefile:3: *** missing separator. Stop.`**
> 意思是「指令那一行的開頭不是 Tab」。Makefile 規定 recipe 前面**必須是一個 Tab 字元，不能是空格**。很多編輯器會自動把 Tab 轉成空格——在 `nano` 裡按 `Alt + Shift + 3`（顯示行號）+ 手動確認，或直接設定編輯器不要展開 Tab。

#### 加入變數與 `.PHONY`

```makefile
CC     := g++
CFLAGS := -Wall -Wextra -std=c++17

.PHONY: all clean

all: Q1 Q2 Q3 Q4

Q1: Q1.cpp
	$(CC) $(CFLAGS) -o Q1 Q1.cpp
```

- `CC`、`CFLAGS` 是變數，用 `$(CC)` 取值。要改編譯選項只要改一個地方。
- `.PHONY: all clean` 告訴 make「`all` 和 `clean` 不是真的檔案名稱」。否則哪天資料夾裡剛好有個叫 `clean` 的檔案，`make clean` 就會說「clean is up to date」什麼都不做。

#### 模組化版本（實驗課要求的形式）

題目一多，上面那種寫法就會一直複製貼上。用**自動變數**與 **pattern rule** 讓它自己長出來：

```makefile
CC      := g++
CFLAGS  := -Wall -Wextra -std=c++17
SRCS    := $(wildcard Q*.cpp)
TARGETS := $(SRCS:.cpp=)

.PHONY: all clean

all: $(TARGETS)

# pattern rule：任何 Qx 都對應到 Qx.cpp
%: %.cpp
	$(CC) $(CFLAGS) -o $@ $<

clean:
	rm -f $(TARGETS)
```

拆解一下語法：

| 語法 | 意義 |
| --- | --- |
| `$(wildcard Q*.cpp)` | 展開成目前目錄下所有符合 `Q*.cpp` 的檔名 |
| `$(SRCS:.cpp=)` | 字串替換：把每個 `.cpp` 結尾去掉，`Q1.cpp` → `Q1` |
| `%: %.cpp` | pattern rule，`%` 是萬用字元，代表「任何目標都由同名的 `.cpp` 產生」 |
| `$@` | 自動變數：目前的**目標**名稱（`Q1`） |
| `$<` | 自動變數：**第一個相依檔案**（`Q1.cpp`） |
| `$^` | 自動變數：**所有**相依檔案（多檔案專案會用到） |

之後新增 `Q5.cpp`，直接 `make` 就會多出 `Q5`，**完全不用改 Makefile**——這就是「模組化」的意思。

#### 驗證你的 Makefile 真的能用

交出去之前一定要做這個檢查：

```bash
make clean && make
```

在**乾淨狀態**下重編一次。很多人是「之前編好的執行檔還在」，Makefile 其實早就壞了卻不知道。

#### 繳交規則整理

- `.cpp` 命名：`Q題號.cpp`（第二題 → `Q2.cpp`）
- 執行檔命名：`Q題號`（第二題 → `Q2`）
- 所有檔案（**含 Makefile**）放在**以學號命名的資料夾**下（例如 `B153040XXX/`）
- 壓縮成 zip，檔名為 `學號.zip`（例如 `B153040XXX.zip`）
- 繳交時需確認 Makefile 能成功編譯，**否則以 0 分計算**
- **任何編譯警告（warning）或錯誤（error）都扣 2 分** → 所以 `-Wall -Wextra` 要平常就開著，別等到考試才發現一堆警告

---

## 上機考怎麼考（重點摘要）

期中、期末兩場都是**上機考**——不是紙筆寫程式，是當場在 Ubuntu 裡寫、編譯、跑、繳交。以下同樣是我整理成自己的話的重點，**正式規範以課程公告與考場宣布為準**。

**環境與工具**

考場環境跟平常上課一樣：VirtualBox 裡的 Ubuntu 20.04，編譯器只能用 g++，要用 Makefile 編譯。**只能用純文字編輯器**（例如 Ubuntu 內建的 Text Editor 或終端機裡的 `nano`）——不能用 VS Code、Dev-C++ 這類 IDE，也不能用任何自動補全或 AI 輔助功能。換句話說，**沒有工具會提醒你少打分號**，這點平常就要習慣。

**考場紀律**

不能用手機、隨身碟、智慧手錶；桌面只留筆和水，包包放教室前面；上廁所舉手、一次一人。電腦當掉要**立刻舉手**，自己默默重開不會補時間。遲到超過一段時間就不能進場，考完**先不要關機**，跟助教確認檔案收到了才離開。考試中助教只處理硬體問題，程式問題一律不回答。

**會被扣分的地方（這部分請一定要記）**

| 情況 | 後果 |
| --- | --- |
| Makefile 編譯不過 | 該次 **0 分** |
| 每一個編譯警告（warning）或錯誤 | **扣 2 分** |
| 用了指定環境以外的 IDE / 作業系統 | 扣**總成績 50%** |

> **什麼是 warning？** 編譯器覺得「這樣寫合法，但你八成寫錯了」時給的提醒，程式還是會編譯成功。例如宣告了變數卻沒用到、`if (x = 5)` 把 `=` 打成 `==`。平常請一律用 `g++ -Wall -Wextra` 編譯，把警告當錯誤看待，考場才不會被一個個扣 2 分。

### 兩個保命習慣

1. **每寫完一題就 `make` 一次**：警告當場清掉，不要堆到最後十分鐘才發現有五個警告（= 10 分沒了）。
2. **每寫完一題就 `./Qn` 跑幾組測資**：至少跑「題目給的範例」＋「邊界情況」（0、負數、只有一個元素、剛好等於上限）。不要相信「應該對」的直覺。

---

## 每週教學內容

以下每一節對應**一週上課進度**，每節包含：

- **這週要會什麼**（觀念地圖）
- **詳細講解 + 可直接編譯的最小範例**
- **常見雷區**（這些幾乎都是筆試「看程式答輸出」的考點）
- **本週練習題**（我自己出的題目，附輸入輸出範例與參考解答）

**怎麼使用這一段**

- 如果你**完全沒寫過程式**：每一節請照順序讀，看到不懂的名詞先往回翻或查文末的文末的〈名詞速查表〉，不要跳著讀。
- 如果你**寫過其他語言**：可以只看「常見雷區」與練習題，遇到不熟的語法再回頭看講解。
- 每一題練習都有**參考解答**（點開「參考解答」即可展開）。請**先自己寫過再看**，直接看答案等於沒練。

> **關於「Ch X」**：章節標題括號中的「Ch X」是課本 *Absolute C++* 的章號，只是讓你對照進度用；本文的說明、範例、練習題全部是我自己寫的，不含課本內容。

---

### 09/10｜課程介紹與環境暖身

第一週主課是課程介紹，實驗課則會帶你把 VirtualBox / Ubuntu / g++ / Makefile 弄起來。

**這週務必做完的三件事：**

1. 〈環境設置〉整段從頭到尾走一次，包含 Guest Additions 與快照。
2. 能靠自己在 Terminal 從空白目錄產出、編譯、執行一支 `HelloWorld.cpp`，**不看筆記**。
3. 能靠自己寫出〈Makefile：從零到模組化〉那份 Makefile，**不複製貼上**。

沒做完這三件事，之後每一週的實驗課都會被環境問題拖住，而實驗課的分數是**當場檢查**給的，拖不起。

**自我檢測**：在 Terminal 完成下面這串，中間不查資料：

```bash
mkdir -p ~/week01/B1130xxxxx && cd ~/week01/B1130xxxxx
nano Q1.cpp          # 寫一支印出自己學號的程式
nano Makefile        # 寫模組化 Makefile
make && ./Q1
make clean && ls     # 確認執行檔被清乾淨
cd .. && zip -r B1130xxxxx.zip B1130xxxxx/
```

全部一次做完不卡關，你的環境就準備好了。

---

### 09/17｜C++ 基礎（Ch 1）

> 對應課本習題：Ch1: 6, 8, 13；Ch2: 2, 4, 7, 8

**這週要會什麼**

```text
程式骨架 → 變數與型別 → 輸入輸出 → 算術運算 → 型別轉換 → 常數與風格
```

#### 一支程式的骨架

```cpp
#include <iostream>   // ① 前置處理：引入函式庫的宣告
using namespace std;  // ② 命名空間：之後不用一直寫 std::

int main() {          // ③ 程式進入點
    // 你的程式從這裡開始
    return 0;         // ④ 回傳 0 給作業系統＝正常結束
}
```

#### 識別字（identifier）命名規則

- 只能由**英文字母、數字、底線** `_` 組成，且**不能以數字開頭**。
- **大小寫有別**：`Total`、`total`、`TOTAL` 是三個不同的變數。
- 不能使用**保留字**：`int`、`class`、`return`、`for`、`if`、`new`、`delete`……
- 命名習慣：變數與函式用 `camelCase`（`totalScore`）或 `snake_case`（`total_score`），類別用 `PascalCase`（`BankAccount`），常數用全大寫（`MAX_SIZE`）。**整份程式挑一種、保持一致**，筆試改考卷的人會看風格。

#### 基本型別

| 型別 | 典型大小 | 範圍 / 精度 | 用途 |
| --- | --- | --- | --- |
| `int` | 4 bytes | 約 $\pm 2.1 \times 10^9$ | 整數 |
| `long long` | 8 bytes | 約 $\pm 9.2 \times 10^{18}$ | 大整數 |
| `unsigned int` | 4 bytes | $0 \sim 4.29 \times 10^9$ | 非負整數 |
| `short` | 2 bytes | 約 $\pm 3.2 \times 10^4$ | 省空間的小整數 |
| `float` | 4 bytes | 約 7 位有效數字 | 單精度浮點 |
| `double` | 8 bytes | 約 15 位有效數字 | 浮點數（**預設用這個**） |
| `char` | 1 byte | 一個字元 | `'A'`、`'0'`、`' '` |
| `bool` | 1 byte | `true` / `false` | 布林值 |
| `string` | 不定 | 需 `#include <string>` | 字串（類別，不是基本型別） |

想在自己機器上確認實際大小：

```cpp
#include <iostream>
#include <climits>
using namespace std;

int main() {
    cout << "sizeof(int)    = " << sizeof(int) << " bytes\n";
    cout << "sizeof(double) = " << sizeof(double) << " bytes\n";
    cout << "INT_MAX = " << INT_MAX << '\n';
    cout << "INT_MIN = " << INT_MIN << '\n';
    return 0;
}
```

#### 宣告與初始化

```cpp
int age = 18;               // 宣告同時初始化（建議）
double pi = 3.14159;
char grade = 'A';           // 單引號是字元
bool passed = true;
string name = "Yilin";      // 雙引號是字串

int a, b, c;                // 一次宣告多個（都還沒初始化）
int x{5};                   // C++11 大括號初始化
```

> **雷區 ①：未初始化的變數**
> ```cpp
> int sum;            // 沒給初值
> for (int i = 1; i <= 10; i++) sum += i;
> cout << sum;        // 結果是垃圾值，每次執行可能不同
> ```
> C++ **不會**幫區域變數自動歸零。累加器一定要 `int sum = 0;`。
> 補充一個實測細節：這種錯誤要加上最佳化選項才抓得到，`g++ -Wall -O2` 會給 `warning: 'sum' is used uninitialized`，只寫 `-Wall` 反而不會提醒你。所以**不要依賴編譯器**，宣告變數時就順手給初值。

#### 賦值相容性與隱式轉換

```cpp
int    i = 3.99;    // i = 3，小數部分被「截斷」而不是四捨五入
double d = 5;       // d = 5.0，沒問題
char   c = 65;      // c = 'A'（65 是 'A' 的 ASCII 碼）
int    n = 'A';     // n = 65
bool   b = 42;      // b = true（非 0 皆為 true）
```

`double → int` 會**損失精度**，`-Wconversion` 會警告。要明確表達「我知道我在做什麼」，用 cast：

```cpp
double d = 3.99;
int i = static_cast<int>(d);   // 現代 C++ 寫法（推薦）
int j = (int)d;                // C 風格，課本也用，考試兩種都可
```

#### 字面值與跳脫序列

```cpp
42        // int
42L       // long
42u       // unsigned
3.14      // double
3.14f     // float
'A'       // char
"Hello"   // C-string 字面值
true      // bool
```

常用跳脫序列：

| 寫法 | 意義 |
| --- | --- |
| `\n` | 換行 |
| `\t` | Tab |
| `\\` | 反斜線本身 |
| `\"` | 雙引號 |
| `\'` | 單引號 |
| `\0` | 空字元（字串結尾標記，Ch9 會用到） |

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

- `cout << x`：把 `x` 送到標準輸出，`<<` 可以一直串接。
- `cin >> x`：從標準輸入讀一個值。**會自動跳過前置的空白與換行**，讀到下一個空白為止。
- `endl` = 換行 + **強制清空緩衝區**；`'\n'` 只換行。大量輸出時用 `'\n'` 比較快。
- `cerr` 是**標準錯誤輸出**，不緩衝，用來印錯誤訊息：`cerr << "cannot open file\n";`

**格式化輸出**（需要 `#include <iomanip>`）：

```cpp
#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    double x = 3.14159265;
    cout << fixed << setprecision(2) << x << '\n';   // 3.14
    cout << setw(10) << 42 << "|\n";                 // 靠右對齊寬度 10
    cout << left << setw(10) << 42 << "|\n";         // 靠左對齊
    return 0;
}
```

- `fixed` + `setprecision(n)`：固定小數點後 `n` 位。**這是實驗課題目最常要求的格式**。
- 只寫 `setprecision(n)` 而沒有 `fixed` 的話，`n` 代表**有效位數**而不是小數位數，兩者不一樣。
- `setw(n)` **只對下一個輸出有效**，`fixed`、`setprecision` 則會一直生效。

#### 算術運算與整數除法陷阱

```cpp
cout << 7 / 2 << '\n';           // 3    整數 ÷ 整數 = 整數（無條件捨去）
cout << 7 % 2 << '\n';           // 1    取餘數
cout << 7 / 2.0 << '\n';         // 3.5  只要一邊是浮點，結果就是浮點
cout << (double)7 / 2 << '\n';   // 3.5
cout << -7 / 2 << '\n';          // -3   C++11 起向 0 取整
cout << -7 % 2 << '\n';          // -1   餘數與被除數同號
```

> **雷區 ②：整數除法**
> ```cpp
> int a = 5;
> double b = a / 2;      // b = 2.0，不是 2.5！
> ```
> `a / 2` 兩邊都是 `int`，先算出整數 2，才轉成 `double`。正確寫法：`double b = a / 2.0;` 或 `double b = static_cast<double>(a) / 2;`。
> **平均分數算錯**幾乎都是這個原因，是實驗課最常見的扣分點。

`%` 只能用在**整數**。`5.5 % 2` 直接編譯錯誤。

#### 遞增遞減與求值順序

```cpp
int i = 5;
cout << i++;   // 印出 5，之後 i 變 6（後置：先用值，再加）
cout << ++i;   // i 先變 7，印出 7（前置：先加，再用值）
```

> **雷區 ③：同一個運算式裡改同一個變數**
> ```cpp
> int i = 1;
> int x = i++ + i++;    // 結果未定義，不同編譯器可能給不同答案
> ```
> 不要寫這種程式。筆試若出現，答案通常是「undefined behavior」。

#### 常數

```cpp
const double PI = 3.14159265358979;
const int MAX_SIZE = 100;
// PI = 3.14;   // 編譯錯誤：assignment of read-only variable
```

用 `const` 具名常數的好處：**改一個地方就全改**、**編譯器會擋住誤改**、**程式自我說明**（看到 `MAX_SIZE` 比看到 `100` 清楚）。課本與課程都建議用 `const` 而非 `#define`。

#### 註解與程式風格

```cpp
// 單行註解

/* 多行註解
   可以跨很多行 */
```

筆試會看程式可讀性，實驗課助教檢查時也會看。三個基本要求：**縮排一致**（一層 4 個空格或 1 個 Tab，別混用）、**變數名有意義**、**關鍵步驟有註解**。

#### 本週練習題

> 全部題目都用 `g++ -Wall -Wextra -std=c++17` 編譯，確認**零警告**。

**Q1. BMI 計算**
讀入身高（公分，浮點數）與體重（公斤，浮點數），輸出 BMI 到小數點後兩位。

$$\text{BMI} = \frac{\text{體重(kg)}}{\text{身高(m)}^2}$$

```text
輸入： 175.5 68.2
輸出： BMI = 22.14
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    double cm, kg;
    cin >> cm >> kg;
    double m = cm / 100.0;          // 注意 100.0 而非 100
    double bmi = kg / (m * m);
    cout << "BMI = " << fixed << setprecision(2) << bmi << '\n';
    return 0;
}
```

</details>

**Q2. 秒數轉時分秒**
讀入一個非負整數 `n`（秒），輸出格式為 `hh:mm:ss`，不足兩位補 0。

```text
輸入： 3725
輸出： 01:02:05
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
    int h = n / 3600;
    int m = (n % 3600) / 60;
    int s = n % 60;
    cout << setfill('0')
         << setw(2) << h << ':'
         << setw(2) << m << ':'
         << setw(2) << s << '\n';
    return 0;
}
```

`setfill('0')` 把補位字元從空白改成 `0`；`setw(2)` 要對**每一個**輸出各寫一次，因為它只影響下一次輸出。

</details>

**Q3. 找零錢**
讀入一個整數金額（元），用 500、100、50、10、5、1 元由大到小找零，輸出每種各幾張／幾個。

```text
輸入： 1268
輸出：
500: 2
100: 2
50: 1
10: 1
5: 1
1: 3
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

int main() {
    int money;
    cin >> money;
    const int COINS[6] = {500, 100, 50, 10, 5, 1};
    for (int i = 0; i < 6; i++) {
        cout << COINS[i] << ": " << money / COINS[i] << '\n';
        money %= COINS[i];
    }
    return 0;
}
```

沒學陣列也可以寫六次 `money / 500; money %= 500;`，但用陣列（下下週）會乾淨很多。

</details>

**Q4. 溫度轉換表**
讀入起始攝氏溫度 `a`、結束溫度 `b`、間隔 `d`（皆為整數），輸出從 `a` 到 `b`（含）每隔 `d` 度的攝氏與華氏對照，華氏取小數點後一位。

$$F = C \times \frac{9}{5} + 32$$

```text
輸入： 0 100 25
輸出：
0C = 32.0F
25C = 77.0F
50C = 122.0F
75C = 167.0F
100C = 212.0F
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    int a, b, d;
    cin >> a >> b >> d;
    cout << fixed << setprecision(1);
    for (int c = a; c <= b; c += d) {
        double f = c * 9.0 / 5.0 + 32;    // 9.0 / 5.0，不是 9 / 5！
        cout << c << "C = " << f << "F\n";
    }
    return 0;
}
```

如果寫成 `c * 9 / 5 + 32`，因為先乘後除其實也會對；但寫成 `c * (9 / 5) + 32` 就會變成 `c * 1 + 32`，整個錯。養成「浮點運算就寫 `.0`」的習慣。

</details>

**Q5. 數字拆解**
讀入一個三位數正整數，分別輸出它的百位、十位、個位數字，以及三個數字的和。

```text
輸入： 472
輸出：
4 7 2
sum = 13
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int h = n / 100;
    int t = n / 10 % 10;
    int u = n % 10;
    cout << h << ' ' << t << ' ' << u << '\n';
    cout << "sum = " << h + t + u << '\n';
    return 0;
}
```

`n / 10 % 10` 的運算順序是由左到右（`/` 與 `%` 同優先級），先除再取餘。

</details>

---

### 09/24｜流程控制與函式基礎（Ch 2、Ch 3）

> 對應課本習題：Ch3: 1, 5, 10, 11, 13

**這週要會什麼**

```text
布林運算式 → if / switch → while / do-while / for → break / continue
            → 預定義函式 → 自訂函式 → 遞迴 → 作用域
```

這是整學期**份量最重的一次進度**，兩章塞在一起。如果只能挑一週認真做練習，就是這週。

#### 布林運算式

比較運算子：`==`、`!=`、`<`、`<=`、`>`、`>=`
邏輯運算子：`&&`（且）、`||`（或）、`!`（非）

```cpp
bool inRange = (0 <= x && x <= 100);
bool isWeekend = (day == 6 || day == 7);
bool notEmpty = !s.empty();
```

**優先順序**（由高到低）：`!` > 算術運算子 > 比較運算子 > `&&` > `||` > `=`
不確定就**加括號**，沒有人會因為你多加括號扣分。

> **雷區 ①：連續不等式**
> ```cpp
> if (0 < x < 10)   // 永遠為真！
> ```
> C++ 會先算 `0 < x`，得到 `true`(1) 或 `false`(0)，再拿 1 或 0 去跟 10 比——`1 < 10` 與 `0 < 10` 都成立。正確寫法：`if (0 < x && x < 10)`。

> **雷區 ②：`=` 寫成 `==`**
> ```cpp
> if (x = 5) { ... }   // 這是「把 5 指派給 x」，結果 5 非 0 → 永遠為真
> ```
> `-Wall` 會提示 `warning: suggest parentheses around assignment used as truth value`。看到這個警告 99% 是打錯字。

> **雷區 ③：整數可以當布林用**
> ```cpp
> int n = 0;
> if (n) cout << "yes";    // 不會印，因為 0 == false
> if (-3) cout << "yes";   // 會印，非 0 皆為 true
> ```
> 這在讀別人程式碼時常見（`while (n)` 等同 `while (n != 0)`），自己寫則建議寫清楚。

**短路求值（short-circuit evaluation）**：

```cpp
if (a != 0 && b / a > 3)  { ... }   // a == 0 時右邊「不會被執行」，避免除以 0
if (i < n && arr[i] > 0)  { ... }   // 先確認索引合法，再存取陣列
```

`&&` 左邊為 `false` 就不算右邊；`||` 左邊為 `true` 就不算右邊。**順序寫反就會當掉**，這是很實用的防呆技巧。

#### 分支：`if` / `else if` / `else`

```cpp
int score;
cin >> score;
if (score >= 90)      cout << 'A';
else if (score >= 80) cout << 'B';
else if (score >= 70) cout << 'C';
else if (score >= 60) cout << 'D';
else                  cout << 'F';
```

多路 `if-else` 是**由上而下**逐一檢查，第一個成立就結束，所以條件要**由嚴格排到寬鬆**。如果把 `score >= 60` 寫在第一個，95 分也會拿 D。

**複合敘述（compound statement）**：只有一行時可以不加大括號，但**建議一律加**：

```cpp
if (x > 0)
    cout << "positive";
    cout << "!!!";        // 陷阱：這行「不在」if 裡面，永遠會執行
```

#### `switch`

```cpp
char op;
int a, b;
cin >> a >> op >> b;
switch (op) {
    case '+': cout << a + b; break;
    case '-': cout << a - b; break;
    case '*': cout << a * b; break;
    case '/':
        if (b == 0) cout << "divide by zero";
        else        cout << a / b;
        break;
    default:  cout << "unknown operator";
}
```

規則：

- `switch` 的條件必須是**整數型別或字元或列舉**，**不能是 `double` 或 `string`**。
- `case` 後面必須是**常數**。
- 沒寫 `break` 會**穿透（fall-through）**到下一個 `case`。

> **雷區 ④：忘記 `break`**
> ```cpp
> switch (n) {
>     case 1: cout << "one";
>     case 2: cout << "two"; break;
> }
> // n == 1 時會印出 "onetwo"
> ```
> 有時穿透是刻意的（多個 case 共用同一段程式），這時建議加註解 `// fall through`。

**列舉型別（enum）**，適合搭配 `switch`：

```cpp
enum Weekday { MON, TUE, WED, THU, FRI };   // MON=0, TUE=1, ...
enum class Color { RED, GREEN, BLUE };      // C++11 強型別列舉

Weekday d = WED;
if (d == WED) cout << "Wednesday";
Color c = Color::RED;                       // 強型別必須加 Color::
```

**條件運算子（三元運算子）**：

```cpp
int maxVal = (a > b) ? a : b;      // 等同 if-else 的簡寫
cout << (n % 2 == 0 ? "even" : "odd");
```

#### 迴圈

```cpp
// while：先判斷再執行，可能一次都不跑
int n = 100, cnt = 0;
while (n > 1) { n /= 2; cnt++; }

// do-while：先執行再判斷，至少跑一次（適合輸入驗證）
int x;
do {
    cout << "請輸入正整數：";
    cin >> x;
} while (x <= 0);

// for：初始化、條件、更新寫在一起
for (int i = 1; i <= 10; i++) cout << i << ' ';
```

`for` 的三個部分都可以省略，`for (;;)` 就是無窮迴圈。

**巢狀迴圈**（九九乘法表）：

```cpp
for (int i = 1; i <= 9; i++) {
    for (int j = 1; j <= 9; j++)
        cout << i << "*" << j << "=" << i * j << '\t';
    cout << '\n';
}
```

> **雷區 ⑤：`for` 後面多一個分號**
> ```cpp
> for (int i = 0; i < 10; i++);     // 注意這個分號
>     cout << i;                     // 這行只執行一次，而且 i 已超出作用域 → 編譯錯
> ```

> **雷區 ⑥：無窮迴圈**
> ```cpp
> for (int i = 0; i != 10; i += 3)  { ... }   // i = 0,3,6,9,12,... 永遠跳過 10
> ```
> 迴圈條件用 `<`、`<=` 比用 `!=` 安全。另外浮點數也不要拿來當迴圈計數器（`for (double d = 0; d != 1.0; d += 0.1)` 因為精度誤差不會停）。

**`break` 與 `continue`**：

```cpp
for (int i = 1; i <= 100; i++) {
    if (i % 3 != 0) continue;    // 不是 3 的倍數就跳過本輪剩下的部分
    if (i > 30) break;           // 超過 30 就整個跳出迴圈
    cout << i << ' ';
}
// 印出 3 6 9 12 15 18 21 24 27 30
```

`break` 只跳出**最內層**的迴圈。想跳出雙層迴圈，用旗標變數或把它包成函式直接 `return`。

#### 從檔案讀入（Ch2 尾）

課本在 Ch2 最後就介紹了 `ifstream`，後面〈檔案輸入輸出〉那一節會完整講，這裡先知道長相：

```cpp
#include <fstream>
ifstream fin("input.txt");
int x;
while (fin >> x) { /* ... */ }
```

#### 預定義函式

```cpp
#include <cmath>     // 數學函式
#include <cstdlib>   // rand, srand, abs, exit
#include <ctime>     // time
```

| 函式 | 功能 | 範例 |
| --- | --- | --- |
| `sqrt(x)` | 平方根 | `sqrt(16.0)` → `4.0` |
| `pow(x, y)` | $x^y$ | `pow(2, 10)` → `1024` |
| `abs(n)` / `fabs(x)` | 整數 / 浮點絕對值 | `abs(-3)` → `3` |
| `ceil(x)` / `floor(x)` | 無條件進位 / 捨去 | `ceil(3.2)` → `4.0` |
| `round(x)` | 四捨五入 | `round(3.5)` → `4.0` |
| `max(a, b)` / `min(a, b)` | 較大 / 較小值（`<algorithm>`） | `max(3, 7)` → `7` |

**亂數**：

```cpp
#include <iostream>
#include <cstdlib>
#include <ctime>
using namespace std;

int main() {
    srand(time(nullptr));            // 用目前時間當種子，每次執行結果不同
    int dice = rand() % 6 + 1;       // 1 ~ 6
    int r = rand() % 100;            // 0 ~ 99
    cout << dice << ' ' << r << '\n';
    return 0;
}
```

`srand` 整支程式**只呼叫一次**（放在 `main` 開頭）。放在迴圈裡每次都重設種子，反而會一直拿到同一個數。

#### 自訂函式

函式的三要素：**回傳型別**、**函式名**、**參數列表**。

```cpp
#include <iostream>
using namespace std;

// 函式「定義」：有 body
int gcd(int a, int b) {
    return (b == 0) ? a : gcd(b, a % b);     // 遞迴
}

bool isPrime(int n) {
    if (n < 2) return false;
    for (int i = 2; i * i <= n; i++)
        if (n % i == 0) return false;
    return true;
}

void greet(const string& name) {             // void：不回傳值
    cout << "Hello, " << name << "!\n";
}

int main() {
    cout << gcd(24, 36) << '\n';     // 12
    cout << isPrime(17) << '\n';     // 1（true 印出來是 1）
    greet("NSYSU");
    return 0;
}
```

**函式原型（prototype）**：如果想把 `main` 放在最前面，就要先「宣告」函式：

```cpp
int gcd(int a, int b);       // 宣告（prototype），注意結尾有分號

int main() {
    cout << gcd(24, 36);
    return 0;
}

int gcd(int a, int b) {      // 定義寫在後面
    return (b == 0) ? a : gcd(b, a % b);
}
```

宣告時參數名可以省略：`int gcd(int, int);` 也合法。

**要點：**

- 回傳型別不是 `void` 時，**每一條執行路徑都要 `return`**。漏掉的話 `-Wall` 會警告 `control reaches end of non-void function`，執行結果是垃圾值。
- `void` 函式可以用 `return;`（沒有值）提早結束。
- **參數（parameter）** 是函式定義裡的變數名，**引數（argument）** 是呼叫時實際傳進去的值。筆試喜歡考這組名詞。

> **雷區 ⑦：引數順序寫反**
> ```cpp
> double areaOfRect(double width, double height);
> areaOfRect(3.0, 5.0);    // 編譯器不會幫你檢查你到底哪個是寬哪個是高
> ```
> 型別相同時**編譯器完全幫不上忙**，只能靠命名與註解。

**前置條件與後置條件（precondition / postcondition）**：課本強調的文件習慣，筆試可能考名詞：

```cpp
// Precondition:  n >= 0
// Postcondition: 回傳 n!
int factorial(int n);
```

#### 遞迴

遞迴函式必須有兩個部分：

1. **終止條件（base case）**：不再呼叫自己的情況。
2. **遞迴步驟**：呼叫自己，但問題規模要**變小**。

```cpp
int factorial(int n) {
    if (n <= 1) return 1;            // base case
    return n * factorial(n - 1);     // recursive step
}
```

追蹤 `factorial(4)`：

```text
factorial(4) = 4 * factorial(3)
             = 4 * (3 * factorial(2))
             = 4 * (3 * (2 * factorial(1)))
             = 4 * (3 * (2 * 1)) = 24
```

> **雷區 ⑧：無窮遞迴**
> 忘記 base case 或問題沒變小，會一直往下呼叫直到**堆疊溢位（stack overflow）**，執行時出現 `Segmentation fault`。

#### 作用域（scope）

```cpp
int g = 100;              // 全域變數（盡量少用）

int main() {
    int x = 10;           // 區域變數，只在 main 內有效
    {
        int x = 5;        // 內層區塊的新變數，遮蔽外層的 x
        cout << x;        // 5
    }
    cout << x;            // 10
    for (int i = 0; i < 3; i++) { /* i 只在這個 for 內有效 */ }
    // cout << i;         // 編譯錯誤：'i' was not declared in this scope
    return 0;
}
```

- **區域變數**在函式（或區塊）結束時消失，不同函式裡的同名變數互不相干。
- **全域常數**（`const double PI = 3.14159;`）可以接受；**全域變數**則會讓程式難以追蹤，課本與業界都建議避免。
- **程序抽象（procedural abstraction）**：使用函式的人只需要知道「它做什麼」，不需要知道「它怎麼做」——這就是把程式拆成函式的目的。

#### 本週練習題

**Q1. 質數列印**
讀入正整數 `n`，輸出 2 到 `n` 之間（含）所有質數，以空白分隔，最後換行。

```text
輸入： 20
輸出： 2 3 5 7 11 13 17 19
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

bool isPrime(int n) {
    if (n < 2) return false;
    for (int i = 2; i * i <= n; i++)      // 只需檢查到 sqrt(n)
        if (n % i == 0) return false;
    return true;
}

int main() {
    int n;
    cin >> n;
    bool first = true;
    for (int i = 2; i <= n; i++) {
        if (!isPrime(i)) continue;
        if (!first) cout << ' ';
        cout << i;
        first = false;
    }
    cout << '\n';
    return 0;
}
```

`i * i <= n` 比 `i <= sqrt(n)` 好：不用引入浮點運算，也沒有精度問題。

</details>

**Q2. 階乘（兩種寫法）**
寫出 `int factIter(int n)`（迴圈版）與 `int factRec(int n)`（遞迴版），讀入 `n`（0 ≤ n ≤ 12）後兩種都印一次，確認結果相同。

```text
輸入： 5
輸出：
iterative: 120
recursive: 120
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

int factIter(int n) {
    int result = 1;
    for (int i = 2; i <= n; i++) result *= i;
    return result;
}

int factRec(int n) {
    if (n <= 1) return 1;
    return n * factRec(n - 1);
}

int main() {
    int n;
    cin >> n;
    cout << "iterative: " << factIter(n) << '\n';
    cout << "recursive: " << factRec(n) << '\n';
    return 0;
}
```

為什麼限制 n ≤ 12？因為 `13! = 6227020800` 已經超過 `int` 的上限（約 21 億），會溢位。需要更大就換 `long long`（可到 20!）。

</details>

**Q3. 數字反轉與回文判斷**
讀入一個正整數，輸出它反轉後的數字，並判斷是否為回文數。

```text
輸入： 12321
輸出：
reversed: 12321
palindrome: yes
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

int reverseNumber(int n) {
    int r = 0;
    while (n > 0) {
        r = r * 10 + n % 10;    // 取個位數，接到 r 的尾巴
        n /= 10;                // 去掉個位數
    }
    return r;
}

int main() {
    int n;
    cin >> n;
    int r = reverseNumber(n);
    cout << "reversed: " << r << '\n';
    cout << "palindrome: " << (r == n ? "yes" : "no") << '\n';
    return 0;
}
```

</details>

**Q4. 成績等第（`switch` 版）**
讀入 0–100 的整數分數，用 **`switch`** 輸出等第（90↑ A、80↑ B、70↑ C、60↑ D、其餘 F）。分數不在 0–100 範圍時輸出 `invalid`。

```text
輸入： 87
輸出： B
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

int main() {
    int score;
    cin >> score;
    if (score < 0 || score > 100) {
        cout << "invalid\n";
        return 0;
    }
    switch (score / 10) {          // 關鍵：把 0~100 壓成 0~10
        case 10:
        case 9:  cout << "A\n"; break;
        case 8:  cout << "B\n"; break;
        case 7:  cout << "C\n"; break;
        case 6:  cout << "D\n"; break;
        default: cout << "F\n";
    }
    return 0;
}
```

`case 10:` 後面故意不寫 `break`，讓 100 分穿透到 `case 9` 的處理——這是**刻意**的 fall-through。

</details>

**Q5. 猜數字**
程式用 `rand()` 產生 1–100 的秘密數字，重複讀入玩家的猜測，提示 `too high` / `too low`，猜中則印出 `correct in k guesses` 並結束。

```text
（互動範例）
50  → too high
25  → too low
37  → correct in 3 guesses
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <cstdlib>
#include <ctime>
using namespace std;

int main() {
    srand(time(nullptr));              // 整支程式只呼叫一次
    int secret = rand() % 100 + 1;
    int guess = 0, count = 0;
    do {
        cin >> guess;
        count++;
        if (guess > secret)      cout << "too high\n";
        else if (guess < secret) cout << "too low\n";
    } while (guess != secret);
    cout << "correct in " << count << " guesses\n";
    return 0;
}
```

用 `do-while` 而不是 `while`，因為「至少要先讀一次猜測」——這就是 `do-while` 的典型使用時機。

</details>

**Q6. 費氏數列**
讀入 `n`，輸出費氏數列前 `n` 項（$F_1 = 1, F_2 = 1$），以空白分隔。請用**迴圈**寫，並想想為什麼這題不該用單純遞迴。

```text
輸入： 10
輸出： 1 1 2 3 5 8 13 21 34 55
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    long long prev = 0, cur = 1;       // cur 是第 1 項
    for (int i = 1; i <= n; i++) {
        if (i > 1) cout << ' ';
        cout << cur;
        long long next = prev + cur;
        prev = cur;
        cur = next;
    }
    cout << '\n';
    return 0;
}
```

**為什麼不用純遞迴？** `fib(n) = fib(n-1) + fib(n-2)` 會把同一個子問題重複算無數次，時間複雜度是指數級的 $O(1.618^n)$，`n = 45` 就要跑很久。迴圈版是 $O(n)$。

</details>

---

### 10/01｜參數傳遞與函式重載（Ch 4）

> 對應課本習題：Ch4: 3, 7, 8, 9, 14, 17

**這週要會什麼**

```text
傳值 vs 傳參考 → const 參考 → 函式重載 → 預設引數 → 用 assert 測試
```

這週的觀念很小，但**筆試超愛考**：給你一段程式，問呼叫函式之後外面的變數變成多少。

#### 傳值（call-by-value）：函式改不到外面

```cpp
#include <iostream>
using namespace std;

void addOne(int x) { x = x + 1; }    // x 是「複製品」

int main() {
    int a = 5;
    addOne(a);
    cout << a << '\n';               // 還是 5！
    return 0;
}
```

**白話說**：呼叫 `addOne(a)` 時，電腦把 `a` 的值**影印一份**給函式。函式在影本上塗改，正本完全沒事。

```text
main:      a = 5
            │ 複製
            ▼
addOne:    x = 5  →  x = 6   （函式結束，x 消失）
main:      a 還是 5
```

#### 傳參考（call-by-reference）：函式可以改到外面

在參數型別後面加一個 `&`：

```cpp
#include <iostream>
using namespace std;

void addOne(int& x) { x = x + 1; }   // x 是 a 的「別名」

int main() {
    int a = 5;
    addOne(a);
    cout << a << '\n';               // 6
    return 0;
}
```

**白話說**：`int& x` 不是複製，而是**替 `a` 取了一個小名**。在函式裡叫 `x`，改的就是外面的 `a` 本人。

```text
main:      a = 5
            ▲
            │ 同一塊記憶體，只是換個名字叫 x
addOne:    x = 6   →   main 的 a 也變成 6
```

經典應用——交換兩個變數：

```cpp
void swapValues(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
}
```

如果參數少了 `&`，這個函式就完全沒有效果——這是初學者最常見的錯誤之一。

**什麼時候用哪一種？**

| 情況 | 建議寫法 |
| --- | --- |
| 只是要讀取，資料很小（`int`、`double`、`char`） | 傳值 `int x` |
| 需要在函式裡修改呼叫端的變數 | 傳參考 `int& x` |
| 只是要讀取，但資料很大（`string`、`vector`、大 `struct`） | 傳 const 參考 `const string& s` |
| 需要「回傳兩個以上的結果」 | 用參考參數接結果 |

#### `const` 參考：又快又安全

```cpp
void print(const string& s) {   // 不複製字串，也保證不會被改
    cout << s << '\n';
    // s = "oops";              // 編譯錯誤：s 是 const
}
```

複製一個長字串或大陣列很花時間，用 `&` 可以避免複製；再加上 `const`，等於對呼叫者宣告「**我保證不動你的東西**」。大型物件幾乎一律用 `const T&`，這是 C++ 的標準習慣，課本也反覆強調。

#### 混合參數列表

一個函式可以同時有傳值與傳參考的參數：

```cpp
// 把 score 加上 bonus 分（上限 100），回傳是否被上限截斷
bool addBonus(int& score, int bonus) {
    score += bonus;
    if (score > 100) { score = 100; return true; }
    return false;
}
```

> **雷區 ①：不小心宣告了同名的區域變數**
> ```cpp
> void setTo100(int& x) {
>     int x2 = 100;      // 打算改外面，卻只改了自己的區域變數
>     x2 = x2;           // 什麼都沒做
> }
> ```
> 課本稱為 *inadvertent local variable*。症狀是「函式明明跑了，外面的值卻沒變」。

#### 函式重載（overloading）

**同一個函式名字**，只要**參數列表不同**（型別不同或個數不同），就可以同時存在：

```cpp
#include <iostream>
using namespace std;

int    myMax(int a, int b)       { return a > b ? a : b; }
double myMax(double a, double b) { return a > b ? a : b; }
int    myMax(int a, int b, int c){ return myMax(a, myMax(b, c)); }

int main() {
    cout << myMax(3, 7) << '\n';          // 呼叫第一個
    cout << myMax(3.5, 7.25) << '\n';     // 呼叫第二個
    cout << myMax(3, 7, 5) << '\n';       // 呼叫第三個
    return 0;
}
```

編譯器根據**你傳進去的引數型別與個數**決定呼叫哪一個，這叫**多載解析（overload resolution）**，順序大致是：

1. 找**完全吻合**的版本。
2. 找只需要**自動型別提升**（`char`→`int`、`float`→`double`）就能吻合的。
3. 找需要**一般型別轉換**（`int`→`double`、`double`→`int`）的。
4. 都找不到或**同時有兩個一樣好**→ 編譯錯誤 `call of overloaded ... is ambiguous`。

> **雷區 ②：只有回傳型別不同，不算重載**
> ```cpp
> int  f(int x);
> double f(int x);     // 編譯錯誤
> ```
> 因為呼叫 `f(3);` 時編譯器無從判斷你要哪一個。

> **雷區 ③：自動轉型造成模稜兩可**
> ```cpp
> void show(int x);
> void show(double x);
> show('A');     // char 可以轉 int，也可以轉 double
> ```
> 這個例子實際上會選 `int`（型別提升優先），但類似情形很容易變成 ambiguous。寫重載時**讓參數型別差異明顯**。

#### 預設引數（default arguments）

```cpp
#include <iostream>
using namespace std;

void greet(string name = "world", char mark = '!') {
    cout << "Hello, " << name << mark << '\n';
}

int main() {
    greet();                 // Hello, world!
    greet("NSYSU");          // Hello, NSYSU!
    greet("NSYSU", '?');     // Hello, NSYSU?
    return 0;
}
```

規則：

- 有預設值的參數**必須放在參數列最右邊**（不然呼叫時無法判斷你省略了哪一個）。
- 預設值只在**宣告**那裡寫一次；如果宣告與定義分開寫，**不要在定義再寫一次**。

#### 用 `assert` 檢查前置條件

`assert` 是「這件事一定要成立，不成立就讓程式當場停下來」的除錯工具：

```cpp
#include <iostream>
#include <cassert>
using namespace std;

double divide(double a, double b) {
    assert(b != 0);          // 前置條件：分母不能是 0
    return a / b;
}

int main() {
    cout << divide(10, 4) << '\n';
    // divide(1, 0);         // 執行時會中止並印出檔名行號
    return 0;
}
```

編譯時加上 `-DNDEBUG` 就會把所有 `assert` 關掉（正式版不做檢查）。實驗課寫作業時放幾個 `assert` 很好用，但**繳交前確認它不會誤觸發**。

#### 測試技巧：stub 與 driver

- **Stub（樁）**：某個函式還沒寫好，先給一個假的實作（例如固定回傳 0），讓其他部分能先編譯、先測。
- **Driver（驅動程式）**：寫一個小 `main` 專門測試某一個函式，測完再把它接回大程式。

```cpp
// driver：專門測 isPrime
int main() {
    int tests[] = {1, 2, 3, 4, 17, 25, 97};
    for (int t : tests)
        cout << t << " -> " << (isPrime(t) ? "prime" : "not prime") << '\n';
    return 0;
}
```

這兩個名詞筆試可能考定義，實務上也真的好用：**與其整支寫完才編譯，不如寫一個函式測一個**。

#### 本週練習題

**Q1. 交換與排序三個數**
寫 `void swapValues(int& a, int& b)`，再用它把讀入的三個整數由小到大排序輸出。

```text
輸入： 5 2 9
輸出： 2 5 9
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

void swapValues(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
}

int main() {
    int a, b, c;
    cin >> a >> b >> c;
    if (a > b) swapValues(a, b);
    if (b > c) swapValues(b, c);
    if (a > b) swapValues(a, b);      // 三次比較足以排好三個數
    cout << a << ' ' << b << ' ' << c << '\n';
    return 0;
}
```

</details>

**Q2. 一次回傳最大值與最小值**
寫 `void minMax(int a, int b, int c, int& mn, int& mx)`，用參考參數把三個數的最小值與最大值帶回呼叫端。

```text
輸入： 7 3 10
輸出： min = 3, max = 10
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

void minMax(int a, int b, int c, int& mn, int& mx) {
    mn = a;
    if (b < mn) mn = b;
    if (c < mn) mn = c;
    mx = a;
    if (b > mx) mx = b;
    if (c > mx) mx = c;
}

int main() {
    int a, b, c, mn, mx;
    cin >> a >> b >> c;
    minMax(a, b, c, mn, mx);
    cout << "min = " << mn << ", max = " << mx << '\n';
    return 0;
}
```

**為什麼要這樣寫？** 一個函式只能 `return` 一個值，要一次帶回兩個結果，最直接的做法就是用參考參數。

</details>

**Q3. 重載 `area`**
寫三個同名函式 `area`：
- 一個參數 → 正方形面積
- 兩個參數 → 長方形面積
- 三個參數 → 三角形面積（海龍公式）

海龍公式：$s = \frac{a+b+c}{2}$，面積 $= \sqrt{s(s-a)(s-b)(s-c)}$

```text
輸入： 3 4 5
輸出：
square(3)      = 9.00
rect(3, 4)     = 12.00
triangle(3,4,5)= 6.00
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
#include <cmath>
using namespace std;

double area(double side) { return side * side; }
double area(double w, double h) { return w * h; }
double area(double a, double b, double c) {
    double s = (a + b + c) / 2.0;
    return sqrt(s * (s - a) * (s - b) * (s - c));
}

int main() {
    double a, b, c;
    cin >> a >> b >> c;
    cout << fixed << setprecision(2);
    cout << "square(" << a << ")      = " << area(a) << '\n';
    cout << "rect(" << a << ", " << b << ")     = " << area(a, b) << '\n';
    cout << "triangle(" << a << "," << b << "," << c << ")= " << area(a, b, c) << '\n';
    return 0;
}
```

</details>

**Q4. 帶預設值的利息計算**
寫 `double compound(double principal, double rate = 0.02, int years = 1)`，計算複利本利和 $P(1+r)^n$，並示範三種呼叫方式。

```text
輸入： 10000
輸出：
default      : 10200.00
rate 5%      : 10500.00
5% for 3 yr  : 11576.25
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
#include <cmath>
using namespace std;

double compound(double principal, double rate = 0.02, int years = 1) {
    return principal * pow(1 + rate, years);
}

int main() {
    double p;
    cin >> p;
    cout << fixed << setprecision(2);
    cout << "default      : " << compound(p) << '\n';
    cout << "rate 5%      : " << compound(p, 0.05) << '\n';
    cout << "5% for 3 yr  : " << compound(p, 0.05, 3) << '\n';
    return 0;
}
```

</details>

**Q5. 找出傳值的 bug**
下面這支程式想把兩個數字交換後印出，但輸出不對。請指出原因並修正。

```cpp
#include <iostream>
using namespace std;

void mySwap(int a, int b) {
    int t = a; a = b; b = t;
}

int main() {
    int x = 1, y = 2;
    mySwap(x, y);
    cout << x << ' ' << y << '\n';   // 期望 2 1，實際 1 2
    return 0;
}
```

<details>
<summary><b>參考解答</b></summary>

參數是**傳值**，函式拿到的是 `x`、`y` 的複製品，交換的是複製品，正本沒有改變。把參數改成**傳參考**即可：

```cpp
void mySwap(int& a, int& b) {
    int t = a; a = b; b = t;
}
```

這題就是筆試最愛出的題型：**看到 `&` 就是會改到外面，沒有 `&` 就不會**。

</details>

---

### 10/08｜陣列（Ch 5）

> 對應課本習題：Ch5: 4, 8, 10, 14, 17

**這週要會什麼**

```text
陣列宣告 → 索引與越界 → 用迴圈掃描 → 陣列與函式 → 搜尋與排序 → 二維陣列
```

#### 陣列是什麼

**白話說**：陣列就是**一排編號的格子**，每一格放同一種型別的資料。宣告 `int a[5];` 就是要了五個連續的整數格子，編號 **0 到 4**。

```text
        a[0]  a[1]  a[2]  a[3]  a[4]
      ┌─────┬─────┬─────┬─────┬─────┐
   a  │  3  │  1  │  4  │  1  │  5  │
      └─────┴─────┴─────┴─────┴─────┘
```

```cpp
int a[5] = {3, 1, 4, 1, 5};
cout << a[0] << ' ' << a[4] << '\n';   // 3 5
a[2] = 100;                            // 改第三格
```

初始化的幾種寫法：

```cpp
int a[5] = {3, 1, 4, 1, 5};   // 完整給
int b[5] = {1, 2};            // 剩下自動補 0 → {1,2,0,0,0}
int c[5] = {};                // 全部是 0
int d[]  = {1, 2, 3};         // 不寫大小，編譯器自己數成 3
int e[5];                     // 完全沒初始化 → 裡面是垃圾值
```

> **雷區 ①：索引從 0 開始，最後一格是 `n-1`**
> `int a[5];` 合法索引是 `a[0]` ~ `a[4]`，**`a[5]` 不存在**。

> **雷區 ②：越界不會有人擋你**
> ```cpp
> int a[5] = {};
> a[10] = 999;      // 編譯得過、可能不會當掉，但你已經踩到別人的記憶體
> ```
> C++ **不檢查陣列邊界**。症狀可能是「另一個變數的值莫名其妙變了」，或是執行到一半 `Segmentation fault`。這是 C/C++ 最惡名昭彰的坑，寫迴圈時務必確認條件是 `i < n` 而不是 `i <= n`。

> **雷區 ③：陣列大小必須是常數**
> ```cpp
> int n;
> cin >> n;
> int a[n];        // 標準 C++ 不允許（g++ 有擴充所以編得過，但別依賴）
> ```
> 正解有兩種：宣告一個夠大的固定陣列（`const int MAX = 1000; int a[MAX];`），或用後面會教的 `vector`（10/29）與 `new`（11/19）。

#### 用迴圈掃陣列

```cpp
const int N = 5;
int a[N] = {3, 1, 4, 1, 5};

int sum = 0;
for (int i = 0; i < N; i++) sum += a[i];      // 標準寫法

for (int x : a) cout << x << ' ';             // C++11 range-based for
```

`for (int x : a)` 讀作「對 `a` 裡的每一個元素 `x`」。**注意**：`x` 是複製品，改 `x` 不會改到陣列；要改就寫 `for (int& x : a) x *= 2;`。

**用 `const int N` 而不是直接寫 5**：陣列大小改成 10 時只要改一個地方，迴圈條件自動跟著對。這是課本一再強調的習慣。

#### 陣列傳進函式

陣列傳進函式時**不會複製整個陣列**，傳的是「第一格的位址」。後果是：

1. 函式**可以改到**原陣列（就算沒寫 `&`）。
2. 函式**不知道陣列多長**，所以一定要**額外傳長度**。

```cpp
#include <iostream>
using namespace std;

int sumArray(const int a[], int n) {   // const：保證不修改
    int s = 0;
    for (int i = 0; i < n; i++) s += a[i];
    return s;
}

void doubleAll(int a[], int n) {       // 沒有 const：打算修改
    for (int i = 0; i < n; i++) a[i] *= 2;
}

int main() {
    int a[5] = {1, 2, 3, 4, 5};
    cout << sumArray(a, 5) << '\n';    // 15
    doubleAll(a, 5);
    cout << sumArray(a, 5) << '\n';    // 30
    return 0;
}
```

寫 `const int a[]` 的意義：**告訴讀者與編譯器「這個函式只讀不寫」**，寫錯了編譯器會直接擋下來。

#### 部分填滿的陣列

實務上常見狀況：宣告了 100 格，實際只用了 47 格。做法是**另外用一個變數記住有效長度**：

```cpp
const int MAX = 100;
int a[MAX];
int size = 0;                 // 目前用了幾格

void push(int a[], int& size, int value) {
    if (size < MAX) a[size++] = value;      // 先用 size 當索引，再讓 size 加 1
}
```

之後所有迴圈都寫 `for (int i = 0; i < size; i++)`，不是 `i < MAX`。

#### 線性搜尋

```cpp
// 找 target，找到回傳索引，找不到回傳 -1
int search(const int a[], int n, int target) {
    for (int i = 0; i < n; i++)
        if (a[i] == target) return i;
    return -1;
}
```

回傳 `-1` 代表「找不到」是很常見的約定，因為 `-1` 不可能是合法索引。

#### 排序

**選擇排序（selection sort）**：每一輪找出剩下元素中最小的，換到前面。

```cpp
void selectionSort(int a[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++)
            if (a[j] < a[minIdx]) minIdx = j;
        if (minIdx != i) {
            int t = a[i]; a[i] = a[minIdx]; a[minIdx] = t;
        }
    }
}
```

**氣泡排序（bubble sort）**：相鄰兩兩比較，把大的往後推。

```cpp
void bubbleSort(int a[], int n) {
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - 1 - i; j++)
            if (a[j] > a[j + 1]) {
                int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
                swapped = true;
            }
        if (!swapped) break;          // 這一輪沒換過 → 已經排好，提早結束
    }
}
```

兩者都是 $O(n^2)$：資料量 10 倍，時間約 100 倍。實務上會用標準函式庫的 `sort`（`#include <algorithm>`，`sort(a, a + n);`），但**實驗課要你手寫是為了練陣列操作**，不要偷懶直接用 `sort` 交作業。

#### 二維陣列

**白話說**：二維陣列就是「表格」，`g[i][j]` 是第 `i` 列第 `j` 行。

```cpp
int g[3][4] = {
    {1,  2,  3,  4},
    {5,  6,  7,  8},
    {9, 10, 11, 12}
};

for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 4; j++)
        cout << g[i][j] << '\t';
    cout << '\n';
}
```

傳進函式時，**第二維（以及之後每一維）的大小必須寫死**，因為編譯器要靠它算出每一列從哪裡開始：

```cpp
void printGrid(const int g[][4], int rows) {
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < 4; j++) cout << g[i][j] << ' ';
        cout << '\n';
    }
}
```

#### 本週練習題

**Q1. 讀入與反轉**
讀入 `n`（`n ≤ 100`）與 `n` 個整數，反轉後輸出。

```text
輸入：
5
1 2 3 4 5
輸出： 5 4 3 2 1
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

int main() {
    const int MAX = 100;
    int a[MAX], n;
    cin >> n;
    for (int i = 0; i < n; i++) cin >> a[i];

    for (int i = 0; i < n / 2; i++) {        // 只要跑一半
        int t = a[i];
        a[i] = a[n - 1 - i];
        a[n - 1 - i] = t;
    }
    for (int i = 0; i < n; i++) cout << a[i] << " \n"[i == n - 1];
    return 0;
}
```

最後一行的 `" \n"[i == n - 1]` 是個小技巧：條件成立時取字串的第 1 個字元（換行），否則取第 0 個（空白）。覺得難懂就寫成一般的 `if`，考試時清楚比炫技重要。

</details>

**Q2. 最大值與其索引**
讀入 `n` 與 `n` 個整數，輸出最大值以及它**第一次出現**的索引（從 0 起算）。

```text
輸入：
6
3 9 2 9 1 4
輸出： max = 9 at index 1
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

int main() {
    const int MAX = 100;
    int a[MAX], n;
    cin >> n;
    for (int i = 0; i < n; i++) cin >> a[i];

    int best = 0;                        // 先假設第 0 格最大
    for (int i = 1; i < n; i++)
        if (a[i] > a[best]) best = i;    // 用 > 而非 >=，才會保留「第一次出現」

    cout << "max = " << a[best] << " at index " << best << '\n';
    return 0;
}
```

</details>

**Q3. 排序後求中位數**
讀入 `n` 與 `n` 個整數，手寫排序後輸出中位數（`n` 為奇數取正中間，偶數取中間兩數的平均，保留一位小數）。

```text
輸入：
4
7 1 3 9
輸出： median = 5.0
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
using namespace std;

void bubbleSort(int a[], int n) {
    for (int i = 0; i < n - 1; i++)
        for (int j = 0; j < n - 1 - i; j++)
            if (a[j] > a[j + 1]) {
                int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
            }
}

int main() {
    const int MAX = 100;
    int a[MAX], n;
    cin >> n;
    for (int i = 0; i < n; i++) cin >> a[i];
    bubbleSort(a, n);

    double median;
    if (n % 2 == 1) median = a[n / 2];
    else            median = (a[n / 2 - 1] + a[n / 2]) / 2.0;   // 記得 2.0

    cout << "median = " << fixed << setprecision(1) << median << '\n';
    return 0;
}
```

</details>

**Q4. 分數長條圖**
讀入 `n` 個 0–100 的分數，統計各區間人數（0–59、60–69、70–79、80–89、90–100），用 `*` 畫出長條圖。

```text
輸入：
6
55 62 78 85 91 88
輸出：
  0- 59: *
 60- 69: *
 70- 79: *
 80- 89: **
 90-100: *
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    int n, score;
    int count[5] = {};                    // 全部初始化為 0
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> score;
        if (score < 60)      count[0]++;
        else if (score < 70) count[1]++;
        else if (score < 80) count[2]++;
        else if (score < 90) count[3]++;
        else                 count[4]++;
    }
    const int lo[5] = {0, 60, 70, 80, 90};
    const int hi[5] = {59, 69, 79, 89, 100};
    for (int i = 0; i < 5; i++) {
        cout << setw(3) << lo[i] << '-' << setw(3) << hi[i] << ": ";
        for (int j = 0; j < count[i]; j++) cout << '*';
        cout << '\n';
    }
    return 0;
}
```

`int count[5] = {};` 這行很重要：**計數用的陣列一定要歸零**，否則加到垃圾值上面。

</details>

**Q5. 矩陣轉置**
讀入 `n`、`m` 與一個 $n \times m$ 的矩陣，輸出它的轉置（$m \times n$）。

```text
輸入：
2 3
1 2 3
4 5 6
輸出：
1 4
2 5
3 6
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

const int MAX = 50;

int main() {
    int a[MAX][MAX], n, m;
    cin >> n >> m;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            cin >> a[i][j];

    for (int j = 0; j < m; j++) {          // 轉置＝把迴圈順序對調
        for (int i = 0; i < n; i++) {
            if (i > 0) cout << ' ';
            cout << a[i][j];
        }
        cout << '\n';
    }
    return 0;
}
```

</details>

**Q6. 矩陣相乘**
讀入 $n \times m$ 矩陣 A 與 $m \times p$ 矩陣 B，輸出 $A \times B$。

```text
輸入：
2 2 2
1 2
3 4
5 6
7 8
輸出：
19 22
43 50
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

const int MAX = 50;

int main() {
    int A[MAX][MAX], B[MAX][MAX], C[MAX][MAX] = {};
    int n, m, p;
    cin >> n >> m >> p;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++) cin >> A[i][j];
    for (int i = 0; i < m; i++)
        for (int j = 0; j < p; j++) cin >> B[i][j];

    for (int i = 0; i < n; i++)
        for (int j = 0; j < p; j++) {
            C[i][j] = 0;
            for (int k = 0; k < m; k++)      // 三層迴圈是標準做法
                C[i][j] += A[i][k] * B[k][j];
        }

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < p; j++) {
            if (j > 0) cout << ' ';
            cout << C[i][j];
        }
        cout << '\n';
    }
    return 0;
}
```

矩陣相乘的定義：$C_{ij} = \sum_{k} A_{ik} \times B_{kj}$，也就是「A 的第 i 列」跟「B 的第 j 行」對應相乘再相加。

</details>

---

### 10/15｜結構與類別（Ch 5–6）

> 對應課本習題：Ch6: 1, 7, 10, 12

**這週要會什麼**

```text
struct → 成員存取 → struct 傳參 → class → public / private → 封裝 → const 成員函式
```

這是整學期**最關鍵的轉折**：從「一堆變數與函式」進到「物件」。之後每一週都建立在這個觀念上，卡住的話請務必補起來。

#### 為什麼需要 `struct`

假設要處理 50 位學生的姓名、學號、成績，只用陣列會變成這樣：

```cpp
string name[50];
int    id[50];
double gpa[50];
```

三個陣列必須「第 i 格代表同一個人」——**只要有一次排序忘了同步交換，資料就全錯了**。`struct` 的作用就是把這些欄位**綁成一包**：

```cpp
struct Student {
    string name;
    int    id;
    double gpa;
};            // ← 這個分號絕對不能忘
```

之後 `Student s[50];` 一個陣列就搞定，排序時整包一起搬，不可能錯開。

#### 使用 `struct`

```cpp
#include <iostream>
#include <string>
using namespace std;

struct Student {
    string name;
    int    id;
    double gpa;
};

int main() {
    Student s;                    // 宣告一個 Student 變數（叫做「物件」）
    s.name = "Yilin";             // 用 . 存取成員
    s.id   = 113001;
    s.gpa  = 4.0;
    cout << s.name << ' ' << s.gpa << '\n';

    Student t = {"Ann", 113002, 3.8};     // 宣告時直接初始化
    cout << t.name << '\n';
    return 0;
}
```

> **雷區 ①：`struct` 定義後面忘記分號**
> ```cpp
> struct Student {
>     string name;
> }            // ← 少了分號
> int main() { ... }
> ```
> 錯誤訊息會是莫名其妙的 `error: expected initializer before 'int'`，而且**指到下一行**。看到「錯誤指在一個看起來沒問題的地方」，第一件事就是往上檢查有沒有漏分號。

**巢狀結構**（結構裡放結構）也很常見：

```cpp
struct Date { int year, month, day; };

struct Employee {
    string name;
    Date   hireDate;      // 一個 Employee 裡面有一個 Date
};

Employee e;
e.hireDate.year = 2026;   // 一層一層點下去
```

**結構傳進函式**：預設是**傳值（整包複製）**，所以大結構要用 `const&`：

```cpp
void printStudent(const Student& s) {          // 不複製、不修改
    cout << s.id << ' ' << s.name << ' ' << s.gpa << '\n';
}

void giveBonus(Student& s, double delta) {     // 要修改就不能加 const
    s.gpa += delta;
}
```

#### 從 `struct` 到 `class`

`struct` 有個問題：**任何人都能亂改裡面的值**。

```cpp
Student s;
s.gpa = -999;      // 沒有人擋得住
```

`class` 解決的就是這件事。它跟 `struct` 幾乎一樣，差別只有**預設的存取權限**：

| | 預設權限 |
| --- | --- |
| `struct` | `public`（誰都能存取） |
| `class` | `private`（只有自己的成員函式能存取） |

**存取權限三個關鍵字**：

- `private`：只有這個類別**自己的成員函式**能碰。
- `public`：任何人都能碰。
- `protected`：自己 + **繼承它的子類別**能碰（講到繼承時會用到）。

```cpp
#include <iostream>
using namespace std;

class Circle {
private:
    double r;                            // 資料成員：外面看不到

public:
    void setRadius(double x) {           // mutator（設定值，俗稱 setter）
        if (x >= 0) r = x;               // 可以在這裡做檢查！
        else        r = 0;
    }
    double getRadius() const {           // accessor（讀取值，俗稱 getter）
        return r;
    }
    double area() const {
        return 3.14159265358979 * r * r;
    }
};

int main() {
    Circle c;
    c.setRadius(3);
    // c.r = -5;                         // 編譯錯誤：r 是 private，改不到
    cout << c.area() << '\n';            // 28.2743
    return 0;
}
```

#### 封裝（encapsulation）是什麼、為什麼

**白話說**：把資料藏起來（`private`），只留幾個開關（`public` 函式）給外界用。

三個實際好處：

1. **可以檢查**：`setRadius` 能擋掉負數，資料永遠是合法的。
2. **可以改實作**：哪天你想把半徑改成存直徑，只要 `getRadius()` 回傳 `d/2`，**所有用到這個類別的程式都不用改**。
3. **好找 bug**：半徑變成奇怪的值時，只可能是那幾個 public 函式做的，不用翻遍整份程式。

課本給的檢驗標準很實用：**如果把所有資料成員的名字全改掉，只需要改類別內部就能編譯過，那封裝就做對了。**

#### 成員函式後面的 `const`

```cpp
double area() const { return 3.14159 * r * r; }
//              ^^^^^ 承諾：這個函式不會修改物件
```

加了 `const` 的成員函式，**編譯器會擋住你在裡面改任何資料成員**。為什麼重要？因為：

```cpp
void show(const Circle& c) {
    cout << c.area();        // 只有標了 const 的成員函式才能被呼叫
}
```

如果 `area()` 沒寫 `const`，這裡就會編譯錯誤 `passing 'const Circle' as 'this' argument discards qualifiers`。**規則很簡單：所有「只讀不寫」的成員函式都加 `const`**，養成習慣就不會被這個錯誤訊息卡住。

#### 在類別外面定義成員函式

類別裡面只留宣告、實作寫在外面，是比較正式的寫法（之後把程式拆成多個檔案時一定會用到）：

```cpp
class Circle {
private:
    double r;
public:
    void   setRadius(double x);
    double area() const;
};

void Circle::setRadius(double x) {      // Circle:: 表示「這是 Circle 的成員」
    r = (x >= 0) ? x : 0;
}

double Circle::area() const {           // 定義時 const 也要跟著寫
    return 3.14159265358979 * r * r;
}
```

`::` 叫做**範圍解析運算子（scope resolution operator）**，意思是「這個名字屬於哪裡」。

#### 本週練習題

**Q1. Point 與兩點距離**
定義 `struct Point { double x, y; };`，寫函式計算兩點距離，讀入兩點座標後輸出，保留三位小數。

```text
輸入： 0 0 3 4
輸出： distance = 5.000
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
#include <cmath>
using namespace std;

struct Point {
    double x, y;
};

double distance(const Point& a, const Point& b) {
    double dx = a.x - b.x;
    double dy = a.y - b.y;
    return sqrt(dx * dx + dy * dy);
}

int main() {
    Point p, q;
    cin >> p.x >> p.y >> q.x >> q.y;
    cout << "distance = " << fixed << setprecision(3)
         << distance(p, q) << '\n';
    return 0;
}
```

</details>

**Q2. 學生類別**
寫一個 `class Student`，資料成員為姓名、學號、GPA（皆 private），提供各自的 setter / getter 以及 `print()`。GPA 只接受 0.0–4.3，超出範圍就設為 0。

```text
輸入： Yilin 113001 4.0
輸出： 113001 Yilin 4.00
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
#include <string>
using namespace std;

class Student {
private:
    string name;
    int    id;
    double gpa;

public:
    void setName(const string& n) { name = n; }
    void setId(int i)             { id = i; }
    void setGpa(double g)         { gpa = (g >= 0.0 && g <= 4.3) ? g : 0.0; }

    string getName() const { return name; }
    int    getId()   const { return id; }
    double getGpa()  const { return gpa; }

    void print() const {
        cout << id << ' ' << name << ' '
             << fixed << setprecision(2) << gpa << '\n';
    }
};

int main() {
    string n; int i; double g;
    cin >> n >> i >> g;

    Student s;
    s.setName(n);
    s.setId(i);
    s.setGpa(g);
    s.print();
    return 0;
}
```

</details>

**Q3. 依 GPA 排序**
讀入 `n` 位學生（姓名、學號、GPA），依 GPA **由高到低**排序後輸出；GPA 相同時依學號由小到大。

```text
輸入：
3
Ann 113002 3.8
Bob 113003 4.0
Cat 113001 4.0
輸出：
113001 Cat 4.00
113003 Bob 4.00
113002 Ann 3.80
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
#include <string>
using namespace std;

struct Student {
    string name;
    int    id;
    double gpa;
};

// 回傳 true 代表 a 應該排在 b 前面
bool higher(const Student& a, const Student& b) {
    if (a.gpa != b.gpa) return a.gpa > b.gpa;
    return a.id < b.id;
}

int main() {
    const int MAX = 100;
    Student s[MAX];
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) cin >> s[i].name >> s[i].id >> s[i].gpa;

    for (int i = 0; i < n - 1; i++)                 // 選擇排序
        for (int j = i + 1; j < n; j++)
            if (higher(s[j], s[i])) {
                Student t = s[i]; s[i] = s[j]; s[j] = t;   // 整包交換
            }

    cout << fixed << setprecision(2);
    for (int i = 0; i < n; i++)
        cout << s[i].id << ' ' << s[i].name << ' ' << s[i].gpa << '\n';
    return 0;
}
```

**重點**：把比較規則抽成 `higher()` 函式，排序邏輯就不會被一長串條件式塞爆——而且交換時是 `Student t = s[i];` **整包一起搬**，不可能發生欄位錯開。

</details>

**Q4. 分數類別（Fraction）**
寫一個 `class Fraction`，存分子與分母（private），提供 `set(分子, 分母)`、`print()`（自動約分並處理負號）、`toDouble()`。分母為 0 時視為 `1`。

```text
輸入： 6 -8
輸出：
-3/4
-0.750
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
using namespace std;

int gcd(int a, int b) {
    if (a < 0) a = -a;
    if (b < 0) b = -b;
    return (b == 0) ? a : gcd(b, a % b);
}

class Fraction {
private:
    int num, den;

public:
    void set(int n, int d) {
        if (d == 0) d = 1;
        if (d < 0) { n = -n; d = -d; }      // 負號統一放在分子
        int g = gcd(n, d);
        if (g != 0) { n /= g; d /= g; }
        num = n;
        den = d;
    }
    void print() const { cout << num << '/' << den << '\n'; }
    double toDouble() const { return static_cast<double>(num) / den; }
};

int main() {
    int n, d;
    cin >> n >> d;
    Fraction f;
    f.set(n, d);
    f.print();
    cout << fixed << setprecision(3) << f.toDouble() << '\n';
    return 0;
}
```

這題把「約分」與「負號正規化」放在 `set()` 裡，外面不管傳什麼進來，物件內部永遠是最簡分數——**這就是封裝的價值**。

</details>

---

### 10/22｜類別與建構子（Ch 6–7）

**這週要會什麼**

```text
建構子 → 多載建構子 → 初始化列表 → 預設建構子 → const 成員 → static 成員
```

#### 建構子在解決什麼問題

上一週的 `Circle` 有個隱患：

```cpp
Circle c;
cout << c.area();     // 忘了 setRadius，r 是垃圾值 → 印出垃圾
```

**建構子（constructor）** 就是為了保證「物件一出生就處於合理狀態」而存在的。

它有三個特徵：

1. 名字**必須與類別完全同名**。
2. **沒有回傳型別**（連 `void` 都不能寫）。
3. 建立物件時**自動被呼叫**，不用也不能手動呼叫。

```cpp
#include <iostream>
using namespace std;

class Circle {
private:
    double r;

public:
    Circle() { r = 1.0; }                  // 預設建構子（無參數）
    Circle(double x) { r = (x >= 0) ? x : 0; }   // 帶一個參數的建構子

    double area() const { return 3.14159265358979 * r * r; }
};

int main() {
    Circle a;          // 自動呼叫 Circle()   → r = 1
    Circle b(5);       // 自動呼叫 Circle(5)  → r = 5
    cout << a.area() << '\n';     // 3.14159
    cout << b.area() << '\n';     // 78.5398
    return 0;
}
```

> **雷區 ①：建立無參數物件時不要加括號**
> ```cpp
> Circle a();      // 這不是建立物件！編譯器認為你在「宣告一個回傳 Circle 的函式 a」
> Circle a;        // 正確
> ```
> 這個坑有個正式名稱叫 *most vexing parse*，症狀是「後面用 `a.area()` 時說 a 不是物件」。

#### 初始化列表（member initializer list）

比在大括號裡面指派更好的寫法：

```cpp
Circle(double x) : r(x) { }
//               ^^^^^^ 冒號後面就是初始化列表
```

兩者差別：

| 寫法 | 實際發生的事 |
| --- | --- |
| `Circle(double x) { r = x; }` | 先把 `r` **預設初始化**，再**指派**新值（兩個步驟） |
| `Circle(double x) : r(x) {}` | 直接用 `x` **初始化** `r`（一個步驟，效率較好） |

而且有兩種情況**只能**用初始化列表：

- 成員是 `const`（常數一旦生成就不能指派）
- 成員是**參考**（`int&`，參考必須在誕生時就決定綁誰）

```cpp
class Config {
private:
    const int maxUsers;
public:
    Config(int m) : maxUsers(m) { }      // 唯一可行的寫法
};
```

> **雷區 ②：初始化順序看的是「宣告順序」，不是你寫的順序**
> ```cpp
> class Box {
>     int w;        // 先宣告
>     int h;
> public:
>     Box(int a, int b) : h(b), w(a) { }   // 寫的順序相反
> };
> ```
> 實際初始化順序永遠是 `w` 然後 `h`（依宣告順序）。`-Wall` 會給你 `warning: 'Box::h' will be initialized after ...`——**上機考這就是 2 分**。解法：讓初始化列表的順序跟成員宣告順序一致。

#### 預設建構子非常重要

規則：**只要你自己寫了任何一個建構子，編譯器就不再幫你生成無參數的預設建構子。**

```cpp
class Circle {
public:
    Circle(double x) { /* ... */ }     // 只有這一個
};

Circle a;          // 編譯錯誤：no matching function for call to 'Circle::Circle()'
Circle arr[10];    // 也錯：陣列元素需要預設建構子
```

所以請養成習慣：**每個類別都提供一個預設建構子**。

```cpp
class Circle {
private:
    double r;
public:
    Circle() : r(1.0) { }
    Circle(double x) : r(x >= 0 ? x : 0) { }
};
```

也可以用**預設引數**把兩個併成一個（但小心不要跟其他建構子打架）：

```cpp
Circle(double x = 1.0) : r(x >= 0 ? x : 0) { }
```

#### C++11：建構子委派

一個建構子可以呼叫另一個建構子，避免重複程式碼：

```cpp
class Circle {
private:
    double r;
public:
    Circle() : Circle(1.0) { }              // 委派給下面那個
    Circle(double x) : r(x >= 0 ? x : 0) { }
};
```

#### 一個完整的例子：BankAccount

```cpp
#include <iostream>
#include <iomanip>
#include <string>
using namespace std;

class BankAccount {
private:
    string owner;
    double balance;

public:
    BankAccount() : owner("unknown"), balance(0.0) { }
    BankAccount(const string& name, double init)
        : owner(name), balance(init > 0 ? init : 0) { }

    void deposit(double x) {
        if (x > 0) balance += x;
    }

    bool withdraw(double x) {                 // 回傳是否成功
        if (x <= 0 || x > balance) return false;
        balance -= x;
        return true;
    }

    double getBalance() const { return balance; }
    string getOwner()   const { return owner; }

    void print() const {
        cout << owner << ": " << fixed << setprecision(2) << balance << '\n';
    }
};

int main() {
    BankAccount acc("Yilin", 1000);
    acc.deposit(500);
    if (!acc.withdraw(2000)) cout << "餘額不足\n";
    acc.withdraw(300);
    acc.print();                    // Yilin: 1200.00
    return 0;
}
```

注意 `withdraw` 的設計：**用回傳值告訴呼叫者成功與否**，而不是直接印錯誤訊息。這樣同一個類別在不同程式裡都能用（有的想印中文、有的想印英文、有的想記 log）。

#### `static` 成員：屬於「類別」而不是「物件」

```cpp
#include <iostream>
using namespace std;

class Widget {
public:
    static int count;          // 宣告：所有物件「共用」這一個變數
    Widget()  { count++; }
    ~Widget() { count--; }     // 解構子：物件消失時自動呼叫
};

int Widget::count = 0;         // 定義（必須寫在類別外面，只寫一次）

int main() {
    cout << Widget::count << '\n';    // 0（用類別名存取）
    Widget a, b;
    cout << Widget::count << '\n';    // 2
    {
        Widget c;
        cout << Widget::count << '\n';// 3
    }                                  // c 在這裡消失
    cout << Widget::count << '\n';    // 2
    return 0;
}
```

- **一般成員**：每個物件各有一份。
- **`static` 成員**：整個類別只有一份，所有物件共用。典型用途是「統計目前有幾個物件」「產生不重複的流水號」。
- `~Widget()` 是**解構子（destructor）**，物件生命結束時自動呼叫，在指標與繼承那兩節會很重要。

#### 本週練習題

**Q1. 幫 Circle 加建構子**
把上週的 `Circle` 改成有預設建構子（半徑 1）與帶參數建構子（負數視為 0），**一律用初始化列表**，並印出兩個物件的面積與周長。

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
using namespace std;

class Circle {
private:
    double r;

public:
    Circle() : r(1.0) { }
    Circle(double x) : r(x >= 0 ? x : 0.0) { }

    double area() const      { return 3.14159265358979 * r * r; }
    double perimeter() const { return 2 * 3.14159265358979 * r; }
};

int main() {
    Circle a;
    Circle b(5);
    cout << fixed << setprecision(4);
    cout << a.area() << ' ' << a.perimeter() << '\n';
    cout << b.area() << ' ' << b.perimeter() << '\n';
    return 0;
}
```

</details>

**Q2. Time 類別**
寫 `class Time`，存時、分、秒（private）。提供建構子（預設 00:00:00）、`addSeconds(int n)`（加上 n 秒，超過 24 小時自動繞回）、`print()`（輸出 `hh:mm:ss`）。

```text
輸入： 23 59 50 20
輸出： 00:00:10
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
using namespace std;

class Time {
private:
    int h, m, s;

public:
    Time() : h(0), m(0), s(0) { }
    Time(int hh, int mm, int ss) : h(0), m(0), s(0) {
        long long total = (static_cast<long long>(hh) * 3600 + mm * 60 + ss) % 86400;
        if (total < 0) total += 86400;
        h = static_cast<int>(total / 3600);
        m = static_cast<int>(total % 3600 / 60);
        s = static_cast<int>(total % 60);
    }

    void addSeconds(int n) {
        long long total = (static_cast<long long>(h) * 3600 + m * 60 + s + n) % 86400;
        if (total < 0) total += 86400;
        h = static_cast<int>(total / 3600);
        m = static_cast<int>(total % 3600 / 60);
        s = static_cast<int>(total % 60);
    }

    void print() const {
        cout << setfill('0')
             << setw(2) << h << ':' << setw(2) << m << ':' << setw(2) << s
             << setfill(' ') << '\n';
    }
};

int main() {
    int hh, mm, ss, n;
    cin >> hh >> mm >> ss >> n;
    Time t(hh, mm, ss);
    t.addSeconds(n);
    t.print();
    return 0;
}
```

**技巧**：把「時分秒」一律換算成「總秒數」再運算，最後換回來，就不用處理一堆進位的 if。這種「統一單位」的想法在很多題目都適用。

</details>

**Q3. Date 類別與合法性檢查**
寫 `class Date`，建構子接受年、月、日，若日期不合法（含閏年判斷）則設為 `2000/1/1`。提供 `print()` 輸出 `YYYY/MM/DD`，以及 `isLeapYear()`。

閏年規則：能被 4 整除但不能被 100 整除，或能被 400 整除。

```text
輸入： 2024 2 30
輸出： 2000/01/01
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
using namespace std;

class Date {
private:
    int y, m, d;

    static bool leap(int year) {
        return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
    }

    static bool valid(int year, int month, int day) {
        if (year < 1 || month < 1 || month > 12 || day < 1) return false;
        int days[13] = {0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
        if (month == 2 && leap(year)) return day <= 29;
        return day <= days[month];
    }

public:
    Date() : y(2000), m(1), d(1) { }
    Date(int year, int month, int day) : y(2000), m(1), d(1) {
        if (valid(year, month, day)) { y = year; m = month; d = day; }
    }

    bool isLeapYear() const { return leap(y); }

    void print() const {
        cout << setfill('0') << setw(4) << y << '/'
             << setw(2) << m << '/' << setw(2) << d
             << setfill(' ') << '\n';
    }
};

int main() {
    int y, m, d;
    cin >> y >> m >> d;
    Date date(y, m, d);
    date.print();
    return 0;
}
```

這裡把 `leap` 與 `valid` 寫成 **private static** 成員函式：它們是類別內部的工具，不需要物件也能用，外面也不該直接呼叫。

</details>

**Q4. 物件計數器**
寫一個 `class Counter`，用 `static` 成員統計「目前存在幾個物件」與「總共建立過幾個物件」，並用一段程式驗證兩者的差別。

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

class Counter {
private:
    static int alive;      // 目前存在的數量
    static int created;    // 累積建立過的數量

public:
    Counter()  { alive++; created++; }
    ~Counter() { alive--; }

    static int getAlive()   { return alive; }
    static int getCreated() { return created; }
};

int Counter::alive = 0;
int Counter::created = 0;

int main() {
    Counter a, b;
    {
        Counter c, d, e;
        cout << "inside : alive=" << Counter::getAlive()
             << " created=" << Counter::getCreated() << '\n';   // 5 5
    }
    cout << "outside: alive=" << Counter::getAlive()
         << " created=" << Counter::getCreated() << '\n';       // 2 5
    return 0;
}
```

`static` 成員函式（如 `getAlive()`）**沒有 `this`**，不能存取一般成員，只能存取 `static` 成員；好處是不需要物件就能呼叫。

</details>

---

### 10/29｜vector 與運算子重載入門（Ch 7）

**這次要會什麼**

```text
vector 基本操作 → vector 傳參 → vector 裝物件 → 運算子重載的概念
```

#### `vector`：會自己長大的陣列

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

#### `vector` 傳進函式

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

#### `vector` 裝物件

```cpp
struct Student { string name; double gpa; };

vector<Student> v;
v.push_back({"Ann", 3.8});        // C++11 可以直接用大括號建
v.push_back({"Bob", 4.0});
for (const Student& s : v) cout << s.name << ' ' << s.gpa << '\n';
```

`const Student&` 而不是 `Student`：避免每一圈都複製一個物件。

#### 運算子重載：讓自訂型別也能用 `+`

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

#### 本次練習題

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

### 11/05｜期中上機考（範圍 Ch 1–6）

期中考是**上機考**，範圍到 Ch6，也就是：

```text
基本語法 → 流程控制 → 函式與參數傳遞 → 陣列（含二維） → struct / class
```

**不包含**建構子、`vector`、運算子重載、指標、檔案 I/O、繼承。

#### 考前一週的複習清單

把下面每一項都做到「不看筆記能寫出來」：

- [ ] 讀入不定數量的整數直到 EOF（`while (cin >> x)`）
- [ ] `fixed << setprecision(n)` 控制小數位數
- [ ] `setw` + `setfill('0')` 補零對齊
- [ ] 寫一個回傳 `bool` 的判斷函式（質數、回文、閏年）
- [ ] 用 `int&` 參數一次帶回兩個結果
- [ ] 函式重載三個版本
- [ ] 一維陣列：讀入、反轉、找最大值與索引、手寫排序
- [ ] 二維陣列：讀入、印出、轉置、每列每行求和
- [ ] `struct`：定義、陣列、傳進函式、整包交換
- [ ] `class`：private 資料 + public setter/getter + `const` 成員函式
- [ ] 從零寫出模組化 Makefile，`make clean && make` 通過且**零警告**

#### 模擬上機考（建議計時 90 分鐘）

規則比照正式考試：只用文字編輯器、只用 `g++`、附 Makefile、檔名 `Q1.cpp` ~ `Q5.cpp`、資料夾以學號命名。

**Q1. 平均與標準差**
讀入 `n` 與 `n` 個整數，輸出平均與**母體**標準差，各保留兩位小數。

$$\mu = \frac{1}{n}\sum x_i, \qquad \sigma = \sqrt{\frac{1}{n}\sum (x_i - \mu)^2}$$

```text
輸入：
5
2 4 4 4 5
輸出：
mean = 3.80
sd = 0.98
```

**Q2. 完全數**
讀入 `n`，輸出 1 到 `n` 之間所有的完全數（除了自己以外的因數總和等於自己，例如 6 = 1+2+3）。請把「判斷是否為完全數」寫成獨立函式。

```text
輸入： 500
輸出： 6 28 496
```

**Q3. 矩陣的行列總和**
讀入 `n`、`m` 與矩陣，輸出每一列的和與每一行的和。

```text
輸入：
2 3
1 2 3
4 5 6
輸出：
row sums: 6 15
col sums: 5 7 9
```

**Q4. 圖書資料**
定義 `struct Book { string title; string author; int year; double price; };`，讀入 `n` 本書，輸出：
1. 價格最高的書名
2. 依出版年由舊到新排序後的完整清單

**Q5. 矩形類別**
寫 `class Rectangle`，private 資料為寬高，提供 setter（負數視為 0）、`area()`、`perimeter()`、`isSquare()`，全部唯讀函式都要加 `const`。讀入寬高後印出三個結果。

<details>
<summary><b>Q1 參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
#include <cmath>
using namespace std;

int main() {
    const int MAX = 1000;
    int a[MAX], n;
    cin >> n;
    double sum = 0;
    for (int i = 0; i < n; i++) { cin >> a[i]; sum += a[i]; }

    double mean = sum / n;
    double var = 0;
    for (int i = 0; i < n; i++) var += (a[i] - mean) * (a[i] - mean);
    var /= n;

    cout << fixed << setprecision(2);
    cout << "mean = " << mean << '\n';
    cout << "sd = " << sqrt(var) << '\n';
    return 0;
}
```

</details>

<details>
<summary><b>Q2 參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

bool isPerfect(int n) {
    if (n < 2) return false;
    int sum = 1;                       // 1 一定是因數（n > 1 時）
    for (int i = 2; i * i <= n; i++) {
        if (n % i != 0) continue;
        sum += i;
        if (i != n / i) sum += n / i;  // 成對加入，注意平方數只加一次
    }
    return sum == n;
}

int main() {
    int n;
    cin >> n;
    bool first = true;
    for (int i = 2; i <= n; i++)
        if (isPerfect(i)) { if (!first) cout << ' '; cout << i; first = false; }
    cout << '\n';
    return 0;
}
```

</details>

<details>
<summary><b>Q3 參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

const int MAX = 100;

int main() {
    int a[MAX][MAX], n, m;
    cin >> n >> m;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++) cin >> a[i][j];

    cout << "row sums:";
    for (int i = 0; i < n; i++) {
        int s = 0;
        for (int j = 0; j < m; j++) s += a[i][j];
        cout << ' ' << s;
    }
    cout << '\n';

    cout << "col sums:";
    for (int j = 0; j < m; j++) {
        int s = 0;
        for (int i = 0; i < n; i++) s += a[i][j];
        cout << ' ' << s;
    }
    cout << '\n';
    return 0;
}
```

</details>

<details>
<summary><b>Q4 參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
#include <string>
using namespace std;

struct Book {
    string title;
    string author;
    int    year;
    double price;
};

int main() {
    const int MAX = 100;
    Book b[MAX];
    int n;
    cin >> n;
    for (int i = 0; i < n; i++)
        cin >> b[i].title >> b[i].author >> b[i].year >> b[i].price;

    int best = 0;
    for (int i = 1; i < n; i++) if (b[i].price > b[best].price) best = i;
    cout << "most expensive: " << b[best].title << '\n';

    for (int i = 0; i < n - 1; i++)                 // 依年份排序
        for (int j = 0; j < n - 1 - i; j++)
            if (b[j].year > b[j + 1].year) {
                Book t = b[j]; b[j] = b[j + 1]; b[j + 1] = t;
            }

    cout << fixed << setprecision(2);
    for (int i = 0; i < n; i++)
        cout << b[i].year << ' ' << b[i].title << ' '
             << b[i].author << ' ' << b[i].price << '\n';
    return 0;
}
```

</details>

<details>
<summary><b>Q5 參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
using namespace std;

class Rectangle {
private:
    double w, h;

public:
    void setWidth(double x)  { w = (x >= 0) ? x : 0; }
    void setHeight(double x) { h = (x >= 0) ? x : 0; }

    double area() const      { return w * h; }
    double perimeter() const { return 2 * (w + h); }
    bool   isSquare() const  { return w == h; }
};

int main() {
    double w, h;
    cin >> w >> h;
    Rectangle r;
    r.setWidth(w);
    r.setHeight(h);

    cout << fixed << setprecision(2);
    cout << "area = " << r.area() << '\n';
    cout << "perimeter = " << r.perimeter() << '\n';
    cout << "square? " << (r.isSquare() ? "yes" : "no") << '\n';
    return 0;
}
```

**小提醒**：這題沒有建構子（期中範圍不含），所以 `w`、`h` 在 setter 被呼叫前是垃圾值。正式寫程式時請一定要加建構子；期中考則照範圍寫即可。

</details>

---

### 11/12｜運算子重載、friend 與 string（Ch 8、Ch 9）

> 對應課本習題：Ch8: 1, 4, 5, 8, 9

**這次要會什麼**

```text
成員 vs 非成員運算子 → friend → 重載 << 與 >> → 重載 [] 與 ++ → string 類別
```

#### 成員函式還是非成員函式？

同一個 `+`，有兩種寫法：

```cpp
// (A) 成員函式：a + b 會被翻譯成 a.operator+(b)
class Money {
public:
    Money operator+(const Money& rhs) const;
};

// (B) 非成員函式：a + b 會被翻譯成 operator+(a, b)
Money operator+(const Money& lhs, const Money& rhs);
```

**判斷原則**：

| 情況 | 用哪一種 |
| --- | --- |
| 左邊一定是自己的類別（`m + m`） | 兩種都可以 |
| 左邊可能是內建型別（`2.0 * v`） | **只能非成員**（你沒辦法在 `double` 裡面加函式） |
| `<<`、`>>`（左邊是 `cout` / `cin`） | **只能非成員** |
| `=`、`[]`、`()`、`->` | C++ 規定**只能成員** |

```cpp
#include <iostream>
using namespace std;

class Vec2 {
public:
    double x, y;
    Vec2(double x = 0, double y = 0) : x(x), y(y) { }
    Vec2 operator*(double k) const { return Vec2(x * k, y * k); }   // v * 2
};

Vec2 operator*(double k, const Vec2& v) { return v * k; }           // 2 * v

int main() {
    Vec2 v(1, 2);
    Vec2 a = v * 2;      // 成員版
    Vec2 b = 2 * v;      // 非成員版（內部再呼叫成員版，不重複寫邏輯）
    cout << a.x << ' ' << b.y << '\n';   // 2 4
    return 0;
}
```

#### `friend`：讓外面的函式能看見 private

非成員函式碰不到 `private` 資料。兩個解法：

1. 提供 public 的 getter（比較乾淨，優先考慮）。
2. 把該函式宣告為 **`friend`（夥伴）**，破例讓它存取 private。

```cpp
class Vec2 {
private:
    double x, y;
public:
    Vec2(double x = 0, double y = 0) : x(x), y(y) { }
    friend Vec2 operator+(const Vec2& a, const Vec2& b);   // 宣告為夥伴
};

Vec2 operator+(const Vec2& a, const Vec2& b) {
    return Vec2(a.x + b.x, a.y + b.y);      // 可以直接碰 private 的 x, y
}
```

`friend` 寫在類別裡面（放 public 或 private 區都可以，效果相同），但它**不是成員函式**——定義時不寫 `Vec2::`，也不能加 `const` 後綴。

> **注意**：`friend` 是把封裝**開一個洞**。課本的建議是「能用 getter 就用 getter」，`friend` 留給 `<<`、`>>` 這類無法用成員函式表達的場合。

#### 重載 `<<` 與 `>>`

這是最實用的一組，讓你的類別可以直接 `cout << obj`：

```cpp
#include <iostream>
using namespace std;

class Vec2 {
private:
    double x, y;
public:
    Vec2(double x = 0, double y = 0) : x(x), y(y) { }
    friend ostream& operator<<(ostream& os, const Vec2& v);
    friend istream& operator>>(istream& is, Vec2& v);
};

ostream& operator<<(ostream& os, const Vec2& v) {
    os << '(' << v.x << ", " << v.y << ')';
    return os;                       // 回傳 os，才能串接 cout << a << b
}

istream& operator>>(istream& is, Vec2& v) {
    is >> v.x >> v.y;
    return is;
}

int main() {
    Vec2 v;
    cin >> v;                        // 輸入 3 4
    cout << v << " and " << v << '\n';   // (3, 4) and (3, 4)
    return 0;
}
```

三個一定要記住的細節：

1. 回傳型別是 **`ostream&`**（參考），不是 `void`——這樣才能串接 `<<`。
2. 第一個參數是 **`ostream& os`**，不能加 `const`（輸出會改變串流狀態）。
3. `operator>>` 的第二個參數**不能加 `const`**（要把讀到的值寫進去）。

#### 重載 `[]` 與 `++`

```cpp
class IntArray {
private:
    int data[100];
    int n;
public:
    IntArray() : n(100) { for (int i = 0; i < n; i++) data[i] = 0; }

    int& operator[](int i) { return data[i]; }              // 可讀可寫
    int  operator[](int i) const { return data[i]; }        // const 物件用的版本
};

IntArray a;
a[3] = 7;                 // 因為回傳 int&，所以可以放在等號左邊
cout << a[3];             // 7
```

前置與後置 `++` 的區分方式有點詭異，但考試會考：

```cpp
class Counter {
private:
    int v;
public:
    Counter(int v = 0) : v(v) { }

    Counter& operator++()      { ++v; return *this; }        // 前置 ++c
    Counter  operator++(int)   { Counter old = *this; ++v; return old; }  // 後置 c++
    int get() const { return v; }
};
```

- **前置**：沒有參數，回傳**參考**（改完的自己）。
- **後置**：多一個沒有名字的 `int` 參數（純粹用來區分，不會真的傳值），回傳**改之前的複製品**。
- `*this` 代表「物件自己」，`this` 是指向自己的指標（下一節講指標時會再遇到）。

#### `string` 類別

`string` 是類別不是基本型別，要 `#include <string>`。常用操作：

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string s = "Hello";
    s += ", NSYSU!";              // 串接
    cout << s << '\n';            // Hello, NSYSU!
    cout << s.length() << '\n';   // 13（size() 也一樣）
    cout << s[0] << '\n';         // H
    cout << s.substr(7, 5) << '\n';   // NSYSU（從第 7 個字開始取 5 個）

    if (s.find("NSYSU") != string::npos)      // 找不到會回傳 string::npos
        cout << "found at " << s.find("NSYSU") << '\n';

    string a = "apple", b = "banana";
    if (a < b) cout << a << " comes first\n";   // 字典序比較，可以直接用 < >
    return 0;
}
```

| 用法 | 作用 |
| --- | --- |
| `s.length()` / `s.size()` | 字元數 |
| `s.empty()` | 是否為空字串 |
| `s[i]` / `s.at(i)` | 第 i 個字元 |
| `s.substr(pos, len)` | 取子字串（`len` 省略則取到結尾） |
| `s.find(t)` | 找子字串，回傳位置或 `string::npos` |
| `s.insert(pos, t)` / `s.erase(pos, len)` | 插入 / 刪除 |
| `s + t`、`s += t` | 串接 |
| `==`、`!=`、`<`、`>` | 比較（字典序） |
| `stoi(s)` / `to_string(n)` | 字串與數字互轉（C++11） |

**輸入字串的兩種方式**：

```cpp
string word, line;
cin >> word;             // 讀「一個詞」，遇到空白就停
getline(cin, line);      // 讀「一整行」，含空白，讀到換行為止
```

> **雷區：`cin >>` 之後接 `getline` 會讀到空行**
> ```cpp
> int n;
> cin >> n;                 // 讀走數字，但把後面的換行 '\n' 留在輸入緩衝區
> string line;
> getline(cin, line);       // 馬上遇到那個 '\n'，讀到空字串就結束
> ```
> **解法**：中間加一行 `cin.ignore();`（丟掉一個字元），或更保險的
> ```cpp
> cin.ignore(numeric_limits<streamsize>::max(), '\n');   // 需要 #include <limits>
> ```
> 這個坑幾乎每個人都踩過一次，筆試也常考。

**逐字元處理**（需要 `#include <cctype>`）：

| 函式 | 作用 |
| --- | --- |
| `isalpha(c)` | 是否為英文字母 |
| `isdigit(c)` | 是否為數字字元 |
| `isspace(c)` | 是否為空白類字元 |
| `isupper(c)` / `islower(c)` | 是否為大 / 小寫 |
| `toupper(c)` / `tolower(c)` | 轉大 / 小寫 |

> **雷區**：`toupper` 回傳的是 **`int`** 不是 `char`。
> ```cpp
> cout << toupper('a');                      // 印出 65，不是 'A'
> cout << static_cast<char>(toupper('a'));   // 印出 A
> ```

#### 本次練習題

**Q1. Money 類別**
寫 `class Money`，用「元」與「分」兩個整數存金額（分為 0–99）。重載 `+`、`-`、`==`、`<<`，讓 `cout << m` 輸出成 `$12.05` 的格式。

```text
輸入： 12 50 3 75
輸出：
$16.25
$8.75
not equal
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
using namespace std;

class Money {
private:
    long long cents;                     // 統一換算成「分」來存，最不容易錯

public:
    Money(int dollars = 0, int c = 0) : cents(dollars * 100LL + c) { }

    friend Money operator+(const Money& a, const Money& b);
    friend Money operator-(const Money& a, const Money& b);
    friend bool  operator==(const Money& a, const Money& b);
    friend ostream& operator<<(ostream& os, const Money& m);
};

Money operator+(const Money& a, const Money& b) {
    Money r;
    r.cents = a.cents + b.cents;
    return r;
}
Money operator-(const Money& a, const Money& b) {
    Money r;
    r.cents = a.cents - b.cents;
    return r;
}
bool operator==(const Money& a, const Money& b) { return a.cents == b.cents; }

ostream& operator<<(ostream& os, const Money& m) {
    long long v = m.cents < 0 ? -m.cents : m.cents;
    if (m.cents < 0) os << '-';
    os << '$' << v / 100 << '.' << setfill('0') << setw(2) << v % 100 << setfill(' ');
    return os;
}

int main() {
    int d1, c1, d2, c2;
    cin >> d1 >> c1 >> d2 >> c2;
    Money a(d1, c1), b(d2, c2);
    cout << a + b << '\n';
    cout << a - b << '\n';
    cout << (a == b ? "equal" : "not equal") << '\n';
    return 0;
}
```

**設計重點**：金額**不要用 `double` 存**，浮點誤差會讓 `0.1 + 0.2 != 0.3`。改存整數「分」，輸出時再除回來。

</details>

**Q2. 字元統計**
讀入一整行英文句子，統計每個英文字母出現次數（大小寫視為相同），只輸出有出現過的字母。

```text
輸入： Hello NSYSU
輸出：
e:1
h:1
l:2
n:1
o:1
s:2
u:1
y:1
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <string>
#include <cctype>
using namespace std;

int main() {
    string line;
    getline(cin, line);

    int count[26] = {};
    for (char c : line)
        if (isalpha(static_cast<unsigned char>(c)))
            count[tolower(static_cast<unsigned char>(c)) - 'a']++;

    for (int i = 0; i < 26; i++)
        if (count[i] > 0)
            cout << static_cast<char>('a' + i) << ':' << count[i] << '\n';
    return 0;
}
```

`c - 'a'` 會得到 0–25 的索引，這是處理英文字母最常用的手法。傳給 `isalpha` / `tolower` 前轉成 `unsigned char` 是標準建議做法，避免中文或特殊字元造成未定義行為。

</details>

**Q3. 回文判斷（忽略大小寫與標點）**
讀入一整行，判斷去掉非字母字元、忽略大小寫後是否為回文。

```text
輸入： A man, a plan, a canal: Panama
輸出： yes
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <string>
#include <cctype>
using namespace std;

int main() {
    string line;
    getline(cin, line);

    string clean;
    for (char c : line)
        if (isalpha(static_cast<unsigned char>(c)))
            clean += static_cast<char>(tolower(static_cast<unsigned char>(c)));

    bool ok = true;
    for (size_t i = 0, j = clean.size(); i + 1 < j; i++, j--)
        if (clean[i] != clean[j - 1]) { ok = false; break; }

    cout << (ok ? "yes" : "no") << '\n';
    return 0;
}
```

</details>

**Q4. 單字切割與統計**
讀入一整行，輸出總共有幾個單字，以及最長的單字。單字之間可能有多個空白。

```text
輸入： the quick  brown   fox
輸出：
words = 4
longest = quick
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string line;
    getline(cin, line);

    int count = 0;
    string longest, cur;
    for (size_t i = 0; i <= line.size(); i++) {
        if (i < line.size() && line[i] != ' ') {
            cur += line[i];
        } else if (!cur.empty()) {            // 遇到分隔且手上有字 → 收成一個單字
            count++;
            if (cur.size() > longest.size()) longest = cur;
            cur.clear();
        }
    }

    cout << "words = " << count << '\n';
    cout << "longest = " << longest << '\n';
    return 0;
}
```

迴圈條件寫 `i <= line.size()` 是刻意的：多跑一圈當作「字串結尾」，讓最後一個單字也能被收走。

</details>

**Q5. 簡易凱撒加密**
讀入位移量 `k` 與一整行文字，把英文字母往後位移 `k` 位（超過 z 繞回 a），其他字元原樣輸出。

```text
輸入：
3
Hello, World!
輸出： Khoor, Zruog!
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <string>
#include <cctype>
using namespace std;

int main() {
    int k;
    cin >> k;
    cin.ignore();                     // 吃掉數字後面的換行
    string line;
    getline(cin, line);

    k = ((k % 26) + 26) % 26;         // 讓負的位移也能正常運作
    for (char& c : line) {
        if (islower(static_cast<unsigned char>(c)))
            c = static_cast<char>('a' + (c - 'a' + k) % 26);
        else if (isupper(static_cast<unsigned char>(c)))
            c = static_cast<char>('A' + (c - 'A' + k) % 26);
    }
    cout << line << '\n';
    return 0;
}
```

`for (char& c : line)` 的 `&` 很關鍵——沒有它就只是改複製品，原字串不會變。

</details>

---

### 11/19｜指標、動態記憶體與 C 風格字串（Ch 9、Ch 10）

> 對應課本習題：Ch9: 2, 4, 6, 10；Ch10: 1, 3, 4, 8

**這次要會什麼**

```text
指標是什麼 → new / delete → 動態陣列 → 指標與陣列的關係
→ this 與 -> → 淺拷貝 vs 深拷貝 → C 風格字串
```

這是整學期**最多人卡關**的一次，但核心觀念只有一句話：**指標是一個「存位址」的變數**。

#### 記憶體、位址、指標

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

#### 空指標 `nullptr`

```cpp
int* p = nullptr;        // 明確表示「目前不指向任何東西」
if (p != nullptr) cout << *p;    // 使用前一定要檢查
```

- `nullptr` 是 C++11 的寫法，比舊的 `NULL` 或 `0` 安全，**請一律用它**。
- **對空指標解參考**（`*p` 當 `p` 是 `nullptr`）會直接 `Segmentation fault`。

#### 動態記憶體：`new` 與 `delete`

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

#### 指標與陣列的關係

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

#### 指標當參數

```cpp
void addOne(int* p) { (*p)++; }      // 注意括號：*p 先取值再 ++

int main() {
    int a = 5;
    addOne(&a);        // 要傳位址
    cout << a;         // 6
}
```

跟參考（`int&`）效果一樣，只是語法比較囉唆。**現代 C++ 的習慣**：能用參考就用參考，指標留給「可能沒有值（`nullptr`）」或「要做指標算術」的場合。

#### `->` 與 `this`

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

#### 淺拷貝與深拷貝（本節最重要的觀念）

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

#### C 風格字串（C-string）

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

#### 本次練習題

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

### 11/26｜分離編譯與命名空間（Ch 11）

> 對應課本習題：Ch11: 1, 3

**這次要會什麼**

```text
header 檔與實作檔 → include guard → 多檔案編譯與連結 → Makefile 增量編譯 → namespace
```

#### 為什麼要拆檔

當程式長到幾百行，全部塞在 `main.cpp` 會有三個問題：

1. 改一個小地方就要重編整份，很慢。
2. 多人合作時同時改同一個檔，一定衝突。
3. 寫好的類別想在別的專案重用，只能複製貼上。

解法是把每個類別拆成兩個檔案：

| 檔案 | 放什麼 | 類比 |
| --- | --- | --- |
| `Circle.h`（header，標頭檔） | **宣告**：類別有哪些成員、函式長什麼樣 | 產品說明書 |
| `Circle.cpp`（implementation，實作檔） | **定義**：函式實際怎麼做 | 工廠內部作業 |

使用者只要 `#include "Circle.h"` 就知道怎麼用，完全不必看實作。

#### 實際範例

**`Circle.h`**

```cpp
#ifndef CIRCLE_H
#define CIRCLE_H

class Circle {
private:
    double r;

public:
    Circle();
    Circle(double x);
    double area() const;
    double perimeter() const;
    void   setRadius(double x);
    double getRadius() const;
};

#endif
```

**`Circle.cpp`**

```cpp
#include "Circle.h"

const double PI = 3.14159265358979;

Circle::Circle() : r(1.0) { }
Circle::Circle(double x) : r(x >= 0 ? x : 0) { }

double Circle::area() const      { return PI * r * r; }
double Circle::perimeter() const { return 2 * PI * r; }
void   Circle::setRadius(double x) { r = (x >= 0) ? x : 0; }
double Circle::getRadius() const   { return r; }
```

**`main.cpp`**

```cpp
#include <iostream>
#include <iomanip>
#include "Circle.h"
using namespace std;

int main() {
    Circle c(5);
    cout << fixed << setprecision(4);
    cout << c.area() << ' ' << c.perimeter() << '\n';
    return 0;
}
```

**注意 `#include` 的兩種括號**：

- `#include <iostream>`：**角括號**用於系統／標準函式庫。
- `#include "Circle.h"`：**雙引號**用於你自己寫的檔案（先找目前目錄）。

#### Include guard：`#ifndef` / `#define` / `#endif`

如果同一個 header 被引入兩次（例如 `main.cpp` 引了 `A.h` 和 `B.h`，而兩者都引了 `Circle.h`），類別就會被定義兩次 → `error: redefinition of 'class Circle'`。

```cpp
#ifndef CIRCLE_H     // 如果還沒定義過 CIRCLE_H 這個名字
#define CIRCLE_H     // 就定義它

/* ... 類別內容 ... */

#endif               // 結束
```

第二次引入時 `CIRCLE_H` 已經存在，整段就被跳過。**每個 header 都要寫**，巨集名稱通常用檔名大寫加底線。

現代寫法只要一行：

```cpp
#pragma once
```

兩者效果相同。課本與課程習慣用 `#ifndef` 三行式，**考試建議寫這個版本**。

#### 多檔案怎麼編譯

手動編譯（了解原理用）：

```bash
g++ -c Circle.cpp        # 產生 Circle.o
g++ -c main.cpp          # 產生 main.o
g++ -o app main.o Circle.o    # 連結成執行檔
```

`-c` 的意思是「只編譯，不連結」。每個 `.cpp` 各自變成一個 `.o`，最後一次連結起來。

> **雷區：`undefined reference to 'Circle::area()'`**
> 這是**連結階段**的錯誤，代表「有宣告但找不到實作」。最常見原因：
> 1. 忘了把 `Circle.cpp` 一起編譯（只 `g++ -o app main.cpp`）。
> 2. 定義時忘了寫 `Circle::`，變成定義了一個全域函式。
> 3. 函式簽名不一致（header 寫 `const`，cpp 忘了寫）。

#### 多檔案的 Makefile

```makefile
CC     := g++
CFLAGS := -Wall -Wextra -std=c++17

.PHONY: all clean

all: app

app: main.o Circle.o
	$(CC) -o app main.o Circle.o

main.o: main.cpp Circle.h
	$(CC) $(CFLAGS) -c main.cpp

Circle.o: Circle.cpp Circle.h
	$(CC) $(CFLAGS) -c Circle.cpp

clean:
	rm -f *.o app
```

**為什麼 `main.o` 要把 `Circle.h` 列為相依？** 因為 `main.cpp` 引入了它——改了 `Circle.h` 卻沒重編 `main.o`，就會編出前後不一致的程式。把 header 列進相依清單，`make` 才知道要重編。

用自動變數可以寫得更短：

```makefile
app: main.o Circle.o
	$(CC) -o $@ $^        # $@ = app，$^ = main.o Circle.o

%.o: %.cpp
	$(CC) $(CFLAGS) -c $<
```

#### 命名空間（namespace）

當兩個函式庫都定義了 `sort` 或 `Node`，名字就會撞在一起。命名空間就是幫名字加上「姓氏」：

```cpp
#include <iostream>
using namespace std;

namespace mathUtil {
    double square(double x) { return x * x; }
}

namespace physicsUtil {
    double square(double x) { return x * x * 9.8; }
}

int main() {
    cout << mathUtil::square(3) << '\n';      // 9
    cout << physicsUtil::square(3) << '\n';   // 88.2
    return 0;
}
```

**三種使用方式**：

```cpp
std::cout << "A";              // ① 每次都寫全名（最明確）
using std::cout;               // ② using 宣告：只把 cout 拉進來
using namespace std;           // ③ using 指令：把整個 std 拉進來（最方便，也最髒）
```

> **重要規則：`using namespace std;` 絕對不要寫在 header 檔裡。**
> 因為所有引入這個 header 的檔案都會被影響，等於強迫別人接受你的選擇，名稱衝突的風險會傳染出去。**header 裡請乖乖寫 `std::string`**。

**未命名的命名空間**：只在這個檔案內可見，用來隱藏內部工具函式：

```cpp
// Circle.cpp
namespace {
    double helper(double x) { return x * 2; }   // 其他 .cpp 看不到這個函式
}
```

#### 本次練習題

**Q1. 拆解 BankAccount**
把前面寫過的 `BankAccount` 拆成 `BankAccount.h`、`BankAccount.cpp`、`main.cpp` 三個檔案，加上 include guard，並寫一份 Makefile 讓 `make` 可以編出執行檔、`make clean` 清乾淨。

<details>
<summary><b>參考解答</b></summary>

**BankAccount.h**

```cpp
#ifndef BANKACCOUNT_H
#define BANKACCOUNT_H

#include <string>

class BankAccount {
private:
    std::string owner;      // header 裡不要 using namespace std
    double balance;

public:
    BankAccount();
    BankAccount(const std::string& name, double init);

    void deposit(double x);
    bool withdraw(double x);

    double getBalance() const;
    std::string getOwner() const;
    void print() const;
};

#endif
```

**BankAccount.cpp**

```cpp
#include "BankAccount.h"
#include <iostream>
#include <iomanip>
using namespace std;

BankAccount::BankAccount() : owner("unknown"), balance(0.0) { }

BankAccount::BankAccount(const string& name, double init)
    : owner(name), balance(init > 0 ? init : 0) { }

void BankAccount::deposit(double x) {
    if (x > 0) balance += x;
}

bool BankAccount::withdraw(double x) {
    if (x <= 0 || x > balance) return false;
    balance -= x;
    return true;
}

double BankAccount::getBalance() const { return balance; }
string BankAccount::getOwner()   const { return owner; }

void BankAccount::print() const {
    cout << owner << ": " << fixed << setprecision(2) << balance << '\n';
}
```

**main.cpp**

```cpp
#include <iostream>
#include "BankAccount.h"
using namespace std;

int main() {
    BankAccount acc("Yilin", 1000);
    acc.deposit(500);
    if (!acc.withdraw(5000)) cout << "insufficient\n";
    acc.print();
    return 0;
}
```

**Makefile**

```makefile
CC     := g++
CFLAGS := -Wall -Wextra -std=c++17

.PHONY: all clean

all: app

app: main.o BankAccount.o
	$(CC) -o $@ $^

main.o: main.cpp BankAccount.h
	$(CC) $(CFLAGS) -c $<

BankAccount.o: BankAccount.cpp BankAccount.h
	$(CC) $(CFLAGS) -c $<

clean:
	rm -f *.o app
```

</details>

**Q2. 自己的工具函式庫**
建立 `utils.h` / `utils.cpp`，放進 `namespace utils`，包含 `gcd`、`lcm`、`isPrime`、`reverseNumber` 四個函式，在 `main.cpp` 用 `utils::` 前綴呼叫。

<details>
<summary><b>參考解答</b></summary>

**utils.h**

```cpp
#ifndef UTILS_H
#define UTILS_H

namespace utils {
    int  gcd(int a, int b);
    int  lcm(int a, int b);
    bool isPrime(int n);
    int  reverseNumber(int n);
}

#endif
```

**utils.cpp**

```cpp
#include "utils.h"

namespace utils {

int gcd(int a, int b) {
    if (a < 0) a = -a;
    if (b < 0) b = -b;
    return (b == 0) ? a : gcd(b, a % b);
}

int lcm(int a, int b) {
    if (a == 0 || b == 0) return 0;
    return a / gcd(a, b) * b;          // 先除再乘，避免中途溢位
}

bool isPrime(int n) {
    if (n < 2) return false;
    for (int i = 2; i * i <= n; i++)
        if (n % i == 0) return false;
    return true;
}

int reverseNumber(int n) {
    int sign = (n < 0) ? -1 : 1;
    if (n < 0) n = -n;
    int r = 0;
    while (n > 0) { r = r * 10 + n % 10; n /= 10; }
    return r * sign;
}

}  // namespace utils
```

**main.cpp**

```cpp
#include <iostream>
#include "utils.h"
using namespace std;

int main() {
    cout << utils::gcd(24, 36) << '\n';        // 12
    cout << utils::lcm(4, 6) << '\n';          // 12
    cout << utils::isPrime(97) << '\n';        // 1
    cout << utils::reverseNumber(-1230) << '\n';   // -321
    return 0;
}
```

`lcm` 寫成 `a / gcd(a,b) * b` 而不是 `a * b / gcd(a,b)`，是為了避免 `a * b` 先溢位——這種小細節在寫函式庫時很重要。

</details>

**Q3. 觀察增量編譯**
用 Q1 的專案做實驗：先 `make`，再只改 `main.cpp` 裡的一行，重新 `make`，觀察哪些檔案被重新編譯；接著只改 `BankAccount.h`，再 `make` 一次，比較差異並解釋原因。

<details>
<summary><b>參考答案</b></summary>

- **只改 `main.cpp`**：只有 `main.o` 被重編，`BankAccount.o` 沒動，最後重新連結。因為 `BankAccount.o` 的相依檔案都沒有變新。
- **只改 `BankAccount.h`**：`main.o` 與 `BankAccount.o` **都會**重編，因為兩條規則都把 `BankAccount.h` 列為相依。
- 如果 Makefile 忘了把 header 寫進相依清單，改 header 時 `make` 會以為沒事做（顯示 `make: 'app' is up to date.`），編出來的程式就可能不一致——這是很難查的 bug。

</details>

---

### 12/03｜檔案輸入輸出（Ch 12）

> 對應課本習題：Ch12: 2, 3, 5

**這次要會什麼**

```text
ifstream / ofstream → 檢查開檔成功 → 讀到檔尾 → 追加模式 → 逐字元讀寫 → 格式化 → stringstream
```

#### 串流（stream）的概念

**白話說**：串流就是「資料流動的水管」。`cin` 是從鍵盤流進來的水管，`cout` 是流向螢幕的水管。檔案 I/O 做的事只有一件——**把水管的另一端接到檔案上**，語法完全一樣。

| 類別 | 用途 | 類比 |
| --- | --- | --- |
| `ifstream` | 從檔案**讀**（input file stream） | 像 `cin` |
| `ofstream` | 往檔案**寫**（output file stream） | 像 `cout` |
| `fstream` | 可讀可寫 | 兩者皆可 |

都要 `#include <fstream>`。

#### 讀檔

```cpp
#include <iostream>
#include <fstream>
using namespace std;

int main() {
    ifstream fin("input.txt");
    if (!fin) {                          // 一定要檢查！
        cerr << "cannot open input.txt\n";
        return 1;                        // 回傳非 0 表示程式異常結束
    }

    int x, sum = 0;
    while (fin >> x) sum += x;           // 讀不到東西（檔尾或格式錯）就結束

    cout << "sum = " << sum << '\n';
    fin.close();                         // 也可以不寫，物件消滅時會自動關
    return 0;
}
```

`if (!fin)` 檢查開檔是否成功。**沒檢查就直接讀**的話，檔案不存在時程式會安靜地什麼都不做，你會找 bug 找很久。

另一種寫法是先宣告再開檔：

```cpp
ifstream fin;
fin.open("input.txt");
if (fin.fail()) { /* 錯誤處理 */ }
```

#### 寫檔

```cpp
#include <fstream>
#include <iomanip>
using namespace std;

int main() {
    ofstream fout("output.txt");
    if (!fout) return 1;

    fout << "Hello, file!\n";
    fout << 42 << ' ' << fixed << setprecision(2) << 3.14159 << '\n';
    fout.close();
    return 0;
}
```

- `ofstream fout("out.txt");` 預設會**清空**原本的檔案。
- 想**接在後面**寫，用追加模式：

```cpp
ofstream fout("log.txt", ios::app);     // append
```

常見開檔模式：`ios::in`（讀）、`ios::out`（寫）、`ios::app`（追加）、`ios::binary`（二進位）。多個模式用 `|` 串起來：`ios::in | ios::out`。

#### 讀到檔尾的正確寫法

```cpp
// ✅ 正確：把讀取動作本身當條件
while (fin >> x) { /* 處理 x */ }

// ✅ 正確：讀整行
string line;
while (getline(fin, line)) { /* 處理 line */ }

// ❌ 常見錯誤：用 eof() 當條件
while (!fin.eof()) {
    fin >> x;          // 讀到檔尾時這次讀取失敗，x 保持舊值
    cout << x;         // 最後一筆會被印兩次！
}
```

原因：`eof()` 是「**已經讀失敗之後**」才會變成 true，所以用它當條件一定會多跑一圈。**請一律用 `while (fin >> x)` 或 `while (getline(fin, line))`。**

#### 逐字元讀寫

```cpp
char c;
while (fin.get(c)) {          // get 連空白與換行都會讀進來
    if (c >= 'a' && c <= 'z') c = c - 'a' + 'A';
    fout.put(c);
}
```

- `fin >> c` 會**跳過空白**；`fin.get(c)` **不會**。要原封不動處理檔案內容就用 `get` / `put`。
- `fin.peek()`：偷看下一個字元但不取走。
- `fin.ignore(n, ch)`：略過 n 個字元或直到遇到 `ch`。

#### 格式化輸出（`<iomanip>`）

| 操作子 | 作用 | 持續性 |
| --- | --- | --- |
| `setw(n)` | 設定欄寬 | **只影響下一個輸出** |
| `setfill(c)` | 補位字元 | 持續 |
| `setprecision(n)` | 精度 | 持續 |
| `fixed` | 固定小數點表示法 | 持續 |
| `left` / `right` | 靠左 / 靠右對齊 | 持續 |
| `showpoint` | 強制顯示小數點 | 持續 |

```cpp
cout << left << setw(10) << "Name" << right << setw(8) << "Score" << '\n';
cout << left << setw(10) << "Yilin" << right << setw(8)
     << fixed << setprecision(1) << 95.5 << '\n';
```

輸出：

```text
Name         Score
Yilin         95.5
```

做出這種對齊的表格是實驗課很常見的要求。

#### `stringstream`：把字串當串流用

需要 `#include <sstream>`。最常用在「解析一行資料」：

```cpp
#include <iostream>
#include <sstream>
#include <string>
using namespace std;

int main() {
    string line = "Yilin 95 88 100";
    istringstream iss(line);           // 把字串包成可以 >> 的串流

    string name;
    int score, sum = 0;
    iss >> name;
    while (iss >> score) sum += score;

    cout << name << " total = " << sum << '\n';   // Yilin total = 283
    return 0;
}
```

反過來，`ostringstream` 可以把數字組成字串：

```cpp
ostringstream oss;
oss << "score_" << 95;
string s = oss.str();        // "score_95"
```

**組合技**：`getline` 讀一整行 + `istringstream` 拆欄位，是處理「每列欄位數不固定」的資料的標準做法。

#### 本次練習題

> 以下題目請自己先用 `nano input.txt` 建一個測試檔。

**Q1. 檔案求和**
讀取 `input.txt` 中任意數量的整數，把總和與平均寫進 `output.txt`。

```text
input.txt:
3 7 11
20

output.txt:
sum = 41
avg = 10.25
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <fstream>
#include <iomanip>
using namespace std;

int main() {
    ifstream fin("input.txt");
    if (!fin) { cerr << "cannot open input.txt\n"; return 1; }

    ofstream fout("output.txt");
    if (!fout) { cerr << "cannot open output.txt\n"; return 1; }

    int x, n = 0;
    long long sum = 0;
    while (fin >> x) { sum += x; n++; }

    fout << "sum = " << sum << '\n';
    if (n > 0) fout << "avg = " << fixed << setprecision(2)
                    << static_cast<double>(sum) / n << '\n';
    return 0;
}
```

</details>

**Q2. 檔案複製（相當於 `cp`）**
把 `input.txt` 一字不差地複製成 `copy.txt`（含空白與換行）。

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <fstream>
using namespace std;

int main() {
    ifstream fin("input.txt");
    ofstream fout("copy.txt");
    if (!fin || !fout) { cerr << "open failed\n"; return 1; }

    char c;
    while (fin.get(c)) fout.put(c);     // 一定要用 get/put，不能用 >>
    return 0;
}
```

如果改用 `while (fin >> c)`，所有空白與換行都會消失——這題就是在考 `>>` 與 `get` 的差別。

</details>

**Q3. 成績檔排序**
`scores.txt` 每一列是「姓名 分數」。讀進來後依分數由高到低排序，輸出到 `sorted.txt`，並在螢幕印出平均分數。

```text
scores.txt:
Ann 88
Bob 95
Cat 73

sorted.txt:
Bob 95
Ann 88
Cat 73
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <fstream>
#include <iomanip>
#include <vector>
#include <string>
using namespace std;

struct Record {
    string name;
    int score;
};

int main() {
    ifstream fin("scores.txt");
    if (!fin) { cerr << "cannot open scores.txt\n"; return 1; }

    vector<Record> v;
    Record r;
    while (fin >> r.name >> r.score) v.push_back(r);

    for (size_t i = 0; i + 1 < v.size(); i++)
        for (size_t j = i + 1; j < v.size(); j++)
            if (v[j].score > v[i].score) { Record t = v[i]; v[i] = v[j]; v[j] = t; }

    ofstream fout("sorted.txt");
    long long sum = 0;
    for (const Record& x : v) {
        fout << x.name << ' ' << x.score << '\n';
        sum += x.score;
    }

    if (!v.empty())
        cout << "average = " << fixed << setprecision(2)
             << static_cast<double>(sum) / v.size() << '\n';
    return 0;
}
```

</details>

**Q4. CSV 解析**
`data.csv` 每列格式為 `姓名,國文,英文,數學`。讀入後輸出每個人的總分與平均，並對齊成表格。

```text
data.csv:
Ann,90,85,95
Bob,70,80,75

輸出：
Ann        270   90.00
Bob        225   75.00
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <fstream>
#include <sstream>
#include <iomanip>
#include <string>
using namespace std;

int main() {
    ifstream fin("data.csv");
    if (!fin) { cerr << "cannot open data.csv\n"; return 1; }

    string line;
    while (getline(fin, line)) {
        if (line.empty()) continue;

        istringstream iss(line);
        string name, field;
        getline(iss, name, ',');          // 以逗號為分隔讀出姓名

        int sum = 0, n = 0;
        while (getline(iss, field, ',')) {
            sum += stoi(field);           // 字串轉整數
            n++;
        }

        cout << left << setw(10) << name
             << right << setw(5) << sum
             << setw(8) << fixed << setprecision(2)
             << (n ? static_cast<double>(sum) / n : 0.0) << '\n';
    }
    return 0;
}
```

`getline(iss, field, ',')` 的第三個參數是**自訂分隔字元**——這就是解析 CSV 的標準做法。

</details>

**Q5. 詞頻統計**
讀入 `text.txt`，統計每個單字出現次數（忽略大小寫與標點），輸出出現次數最多的前三名。

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <cctype>
using namespace std;

struct Word {
    string text;
    int    count;
};

int main() {
    ifstream fin("text.txt");
    if (!fin) { cerr << "cannot open text.txt\n"; return 1; }

    vector<Word> words;
    string raw;
    while (fin >> raw) {
        string w;
        for (char c : raw)                        // 去掉標點、轉小寫
            if (isalpha(static_cast<unsigned char>(c)))
                w += static_cast<char>(tolower(static_cast<unsigned char>(c)));
        if (w.empty()) continue;

        bool found = false;
        for (Word& x : words)
            if (x.text == w) { x.count++; found = true; break; }
        if (!found) words.push_back({w, 1});
    }

    for (size_t i = 0; i + 1 < words.size(); i++)      // 依次數由多到少排序
        for (size_t j = i + 1; j < words.size(); j++)
            if (words[j].count > words[i].count) {
                Word t = words[i]; words[i] = words[j]; words[j] = t;
            }

    for (size_t i = 0; i < words.size() && i < 3; i++)
        cout << words[i].text << ' ' << words[i].count << '\n';
    return 0;
}
```

這題用「線性搜尋 + vector」是 $O(n^2)$，資料量大會很慢。學過 `map` 之後會快很多，但那是這學期範圍外的東西，實驗課用這個寫法就夠。

</details>

---

### 12/10｜繼承（Ch 14）

> 對應課本習題：Ch14: 4, 6, 8

**這次要會什麼**

```text
基底類別與衍生類別 → 建構子怎麼串 → protected → 覆寫成員函式
→ 建構與解構順序 → is-a vs has-a
```

#### 繼承在做什麼

**白話說**：繼承就是「**新類別 = 舊類別 + 額外的東西**」。

假設你要寫 `Dog`、`Cat`、`Bird`，牠們都有名字、都會吃東西。與其把 `name`、`eat()` 抄三遍，不如先寫一個 `Animal`，讓三者去**繼承**它。

```cpp
#include <iostream>
#include <string>
using namespace std;

class Animal {                         // 基底類別（base class，父類別）
protected:
    string name;

public:
    Animal(const string& n) : name(n) { }
    void eat() const { cout << name << " is eating.\n"; }
};

class Dog : public Animal {            // 衍生類別（derived class，子類別）
public:
    Dog(const string& n) : Animal(n) { }      // 呼叫父類別的建構子
    void bark() const { cout << name << " says woof!\n"; }
};

int main() {
    Dog d("Kuro");
    d.eat();     // 繼承來的
    d.bark();    // 自己的
    return 0;
}
```

重點三句話：

1. `class Dog : public Animal` 就是「Dog 公開繼承 Animal」。
2. Dog **自動擁有** Animal 的所有 public 與 protected 成員。
3. Dog 的建構子要用**初始化列表**呼叫 Animal 的建構子。

#### 建構子怎麼串

**父類別的建構子一定會先跑**。如果你沒有明確指定要呼叫哪一個，編譯器會自動呼叫父類別的**預設建構子**——沒有的話就編譯錯誤。

```cpp
class Animal {
public:
    Animal(const string& n) { }        // 只有這一個，沒有預設建構子
};

class Dog : public Animal {
public:
    Dog() { }        // 編譯錯誤：no matching function for call to 'Animal::Animal()'
};
```

正確寫法：

```cpp
class Dog : public Animal {
public:
    Dog(const string& n) : Animal(n) { }    // 明確指定
};
```

#### `protected` 是什麼

| 存取層級 | 類別自己 | 衍生類別 | 外部程式 |
| --- | :---: | :---: | :---: |
| `public` | ✓ | ✓ | ✓ |
| `protected` | ✓ | ✓ | ✗ |
| `private` | ✓ | ✗ | ✗ |

`protected` 就是為繼承而生的：**對外面是關的，對子孫是開的**。

> **注意**：即使是子類別，也**碰不到父類別的 `private` 成員**。想讓子類別能直接用，就宣告成 `protected`；或者保持 `private`，讓子類別透過 public 的 getter / setter 存取（封裝比較嚴謹的做法）。

#### 三種繼承方式

```cpp
class B : public A { };      // 幾乎都用這個
class C : protected A { };   // 少見
class D : private A { };     // 少見
```

繼承後，成員的存取層級會變成：

| 父類別成員 | `public` 繼承後 | `protected` 繼承後 | `private` 繼承後 |
| --- | --- | --- | --- |
| `public` | `public` | `protected` | `private` |
| `protected` | `protected` | `protected` | `private` |
| `private` | 存取不到 | 存取不到 | 存取不到 |

**99% 的情況都寫 `public` 繼承**，因為那才表達「Dog 是一種 Animal」。另外兩種請當作筆試表格背一下就好。

#### 覆寫（redefinition）父類別的函式

子類別可以定義一個跟父類別同名的函式，把它蓋掉：

```cpp
#include <iostream>
using namespace std;

class Animal {
public:
    void speak() const { cout << "some sound\n"; }
};

class Dog : public Animal {
public:
    void speak() const { cout << "woof\n"; }          // 覆寫
};

int main() {
    Dog d;
    d.speak();             // woof
    d.Animal::speak();     // some sound（明確指定用父類別版本）
    return 0;
}
```

> **覆寫（redefine）vs 重載（overload）——筆試愛考**
>
> | | 覆寫 | 重載 |
> | --- | --- | --- |
> | 發生在哪 | 父子類別之間 | 同一個作用域內 |
> | 函式簽名 | **完全相同** | **必須不同** |
> | 效果 | 子類別的版本蓋掉父類別的 | 同名函式並存 |
>
> 有個陷阱：**子類別只要定義了同名函式，父類別的所有同名重載版本都會被遮蔽**。
> ```cpp
> class A { public: void f(int); void f(double); };
> class B : public A { public: void f(int); };
>
> B b;
> b.f(3.14);      // 呼叫的是 B::f(int)，不是 A::f(double)！
> ```
> 想把父類別的版本找回來，可以在 B 裡寫 `using A::f;`。

#### 建構與解構的順序

- **建構**：先父後子（先蓋地基再蓋房子）
- **解構**：先子後父（拆房子的順序相反）

```cpp
#include <iostream>
using namespace std;

class Base {
public:
    Base()  { cout << "Base ctor\n"; }
    ~Base() { cout << "Base dtor\n"; }
};

class Derived : public Base {
public:
    Derived()  { cout << "Derived ctor\n"; }
    ~Derived() { cout << "Derived dtor\n"; }
};

int main() {
    Derived d;
    return 0;
}
```

輸出：

```text
Base ctor
Derived ctor
Derived dtor
Base dtor
```

**這種「答輸出」的題目是筆試常客**，記住順序就送分。

#### 哪些東西不會被繼承

- 建構子與解構子（但會被自動呼叫）
- 指派運算子 `operator=`
- `friend` 關係

子類別若有自己動態配置的資源，一樣要遵守三法則（解構子、拷貝建構子、指派運算子），而且要記得**把父類別的部分也處理好**：

```cpp
class Derived : public Base {
public:
    Derived(const Derived& other) : Base(other) {     // 先讓父類別複製自己的部分
        /* 再複製自己新增的成員 */
    }
};
```

#### is-a 還是 has-a？

這是設計時最重要的判斷：

| 關係 | 問法 | 做法 | 例子 |
| --- | --- | --- | --- |
| **is-a** | 「B **是一種** A 嗎？」 | 繼承 | Dog **是一種** Animal |
| **has-a** | 「B **有一個** A 嗎？」 | 組合（把 A 當成員變數） | Car **有一個** Engine |

```cpp
// has-a：組合
class Engine { public: void start(); };

class Car {
private:
    Engine engine;            // Car 有一個 Engine
public:
    void start() { engine.start(); }
};
```

**大多數情況組合比繼承好用**。繼承會讓兩個類別綁得很死（父類別一改，所有子類別都受影響），而組合只是「用到對方」，關係鬆得多。課本的建議也是：**先問自己是不是真的 is-a，不是就別用繼承**。

#### 補充：為什麼還有 `virtual`

你可能會好奇：把 `Dog` 物件存進 `Animal*` 指標，呼叫 `speak()` 會叫到誰？

```cpp
Animal* p = new Dog();
p->speak();          // 印出 "some sound"（父類別的版本），不是 "woof"
```

這是因為一般成員函式是**編譯時**就決定要呼叫誰。要讓它依照「物件實際的型別」決定，需要 `virtual` 關鍵字與**多型（polymorphism）**——那是課本 Ch15 的內容，**不在這學期考試範圍**。知道有這回事即可，行有餘力可以自己先看。

#### 本次練習題

**Q1. Shape 家族**
定義基底類別 `Shape`（有 `name` 與 `area()`，面積預設回傳 0），派生 `Circle`、`Rectangle`、`Triangle` 各自覆寫 `area()`。讀入三種圖形的參數後分別印出名稱與面積。

```text
輸入： 3 4 5 3 4
（半徑 3；長 4 寬 5；底 3 高 4）
輸出：
Circle 28.27
Rectangle 20.00
Triangle 6.00
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <iomanip>
#include <string>
using namespace std;

class Shape {
protected:
    string name;
public:
    Shape(const string& n) : name(n) { }
    string getName() const { return name; }
    double area() const { return 0; }
};

class Circle : public Shape {
private:
    double r;
public:
    Circle(double radius) : Shape("Circle"), r(radius) { }
    double area() const { return 3.14159265358979 * r * r; }
};

class Rectangle : public Shape {
private:
    double w, h;
public:
    Rectangle(double width, double height)
        : Shape("Rectangle"), w(width), h(height) { }
    double area() const { return w * h; }
};

class Triangle : public Shape {
private:
    double b, h;
public:
    Triangle(double base, double height)
        : Shape("Triangle"), b(base), h(height) { }
    double area() const { return b * h / 2.0; }
};

int main() {
    double r, w, h, tb, th;
    cin >> r >> w >> h >> tb >> th;

    Circle c(r);
    Rectangle rect(w, h);
    Triangle t(tb, th);

    cout << fixed << setprecision(2);
    cout << c.getName()    << ' ' << c.area()    << '\n';
    cout << rect.getName() << ' ' << rect.area() << '\n';
    cout << t.getName()    << ' ' << t.area()    << '\n';
    return 0;
}
```

注意初始化列表的順序：`Shape("Circle")` 要寫在最前面（父類別先建構），後面才是自己的成員。

</details>

**Q2. Employee 家族**
`Employee` 有姓名與月薪，提供 `monthlyPay()`。派生 `Manager`（多一筆固定加給）與 `Engineer`（多加班時數 × 時薪）。讀入資料後印出每個人的實領金額。

```text
輸入：
Ann 50000 10000
Bob 45000 20 500
輸出：
Ann 60000
Bob 55000
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <string>
using namespace std;

class Employee {
protected:
    string name;
    double baseSalary;
public:
    Employee(const string& n, double s) : name(n), baseSalary(s) { }
    string getName() const { return name; }
    double monthlyPay() const { return baseSalary; }
};

class Manager : public Employee {
private:
    double allowance;
public:
    Manager(const string& n, double s, double a)
        : Employee(n, s), allowance(a) { }
    double monthlyPay() const { return baseSalary + allowance; }
};

class Engineer : public Employee {
private:
    int    overtimeHours;
    double hourlyRate;
public:
    Engineer(const string& n, double s, int h, double r)
        : Employee(n, s), overtimeHours(h), hourlyRate(r) { }
    double monthlyPay() const { return baseSalary + overtimeHours * hourlyRate; }
};

int main() {
    string n1, n2;
    double s1, a1, s2, r2;
    int h2;
    cin >> n1 >> s1 >> a1;
    cin >> n2 >> s2 >> h2 >> r2;

    Manager m(n1, s1, a1);
    Engineer e(n2, s2, h2, r2);

    cout << m.getName() << ' ' << m.monthlyPay() << '\n';
    cout << e.getName() << ' ' << e.monthlyPay() << '\n';
    return 0;
}
```

</details>

**Q3. 建構解構順序觀察**
自己寫一組三層繼承（`A` → `B` → `C`），每個建構子與解構子都印一行訊息，執行後把輸出順序寫下來並解釋。

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

class A {
public:
    A()  { cout << "A ctor\n"; }
    ~A() { cout << "A dtor\n"; }
};

class B : public A {
public:
    B()  { cout << "B ctor\n"; }
    ~B() { cout << "B dtor\n"; }
};

class C : public B {
public:
    C()  { cout << "C ctor\n"; }
    ~C() { cout << "C dtor\n"; }
};

int main() {
    cout << "--- create ---\n";
    { C c; }                      // 大括號結束時 c 被解構
    cout << "--- done ---\n";
    return 0;
}
```

輸出：

```text
--- create ---
A ctor
B ctor
C ctor
C dtor
B dtor
A dtor
--- done ---
```

**解釋**：建構時必須先把繼承鏈最上層的部分蓋好，才能蓋下一層；解構則完全相反，先拆最下層，最後才拆地基。

</details>

**Q4. 帶動態記憶體的繼承**
寫 `class Stack`（用動態陣列實作，有解構子），再派生 `class TracedStack`，多記錄「總共 push 過幾次」。驗證物件消滅時記憶體有正確釋放。

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

class Stack {
protected:
    int* data;
    int  n;
    int  cap;

public:
    Stack(int capacity = 10)
        : data(new int[capacity]), n(0), cap(capacity) { }

    ~Stack() { delete[] data; cout << "Stack dtor\n"; }

    Stack(const Stack& o) : data(new int[o.cap]), n(o.n), cap(o.cap) {
        for (int i = 0; i < n; i++) data[i] = o.data[i];
    }

    Stack& operator=(const Stack& o) {
        if (this == &o) return *this;
        delete[] data;
        n = o.n; cap = o.cap;
        data = new int[cap];
        for (int i = 0; i < n; i++) data[i] = o.data[i];
        return *this;
    }

    bool push(int x) {
        if (n >= cap) return false;
        data[n++] = x;
        return true;
    }
    bool pop(int& out) {
        if (n == 0) return false;
        out = data[--n];
        return true;
    }
    bool empty() const { return n == 0; }
    int  size()  const { return n; }
};

class TracedStack : public Stack {
private:
    int pushCount;

public:
    TracedStack(int capacity = 10) : Stack(capacity), pushCount(0) { }
    ~TracedStack() { cout << "TracedStack dtor\n"; }

    bool push(int x) {
        if (Stack::push(x)) { pushCount++; return true; }   // 先做父類別的事
        return false;
    }
    int getPushCount() const { return pushCount; }
};

int main() {
    TracedStack s(3);
    s.push(1); s.push(2); s.push(3);
    cout << "push failed? " << (s.push(4) ? "no" : "yes") << '\n';
    cout << "count = " << s.getPushCount() << '\n';

    int v;
    while (s.pop(v)) cout << v << ' ';
    cout << '\n';
    return 0;
}
```

輸出最後兩行會是 `TracedStack dtor` 接著 `Stack dtor`——再次印證解構順序是由子到父。

`TracedStack::push` 裡呼叫 `Stack::push(x)` 是**明確指定父類別版本**；不加 `Stack::` 就會變成呼叫自己造成無窮遞迴。

</details>

---

### 12/17｜期末筆試（範圍 Ch 1–12、Ch 14）

筆試不能開電腦，所以考的是**你腦中有沒有正確的模型**。常見題型有三種：

1. **看程式答輸出**：給一段程式，問印出什麼（最大宗）。
2. **手寫程式片段**：寫一個函式、一個類別的骨架。
3. **觀念選擇 / 填空**：`const` 放哪裡、`static` 的意義、繼承的存取表格。

#### 全學期複習清單

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

#### 筆試模擬題：看程式答輸出

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

#### 手寫題的準備方式

筆試要你**在紙上**寫出程式片段，沒有編譯器幫你。建議考前一週每天做這件事：

1. 拿一張白紙，寫出一個完整的類別骨架（含 private 資料、建構子、`const` 成員函式）。
2. 寫出重載 `<<` 的完整簽名（`ostream& operator<<(ostream& os, const T& obj)`）。
3. 寫出三法則的三個函式簽名。
4. 寫出 `while (fin >> x)` 的完整讀檔流程（含開檔檢查）。

寫完再打進電腦編譯，看看哪裡漏了分號、哪裡忘了 `const`。**紙上寫過三次，考場就不會忘。**

---

### 12/24｜期末上機考（範圍 Ch 1–12、Ch 14）

這是**佔學期 40% 的關鍵一場**，通常直接決定學期成績。而且還有一個好消息：

> 期末上機成績較期中進步達 30 分以上者，學期總成績可獲加分 1~3 分。

也就是說，**期中考砸了也還有救**，這場好好考回來，分數與加分一起拿。

#### 當天的建議流程

1. **開場三分鐘先把架子搭好**：
   ```bash
   mkdir B1130xxxxx && cd B1130xxxxx
   nano Makefile        # 貼上模組化 Makefile
   ```
   之後每題只是新增 `Qn.cpp`，`make` 一下全部編好。
2. **先掃一遍所有題目**，從最有把握的開始寫，不要卡在第一題。
3. **每寫完一題就 `make` 並跑測資**，警告當場清掉。
4. **時間剩 15 分鐘時停止寫新功能**，改成：`make clean && make` 確認乾淨重編沒問題 → 打包 → 繳交 → 找助教確認。
5. 打包指令先練熟：
   ```bash
   cd ..
   zip -r B1130xxxxx.zip B1130xxxxx/
   ```

#### 模擬上機考（建議計時 120 分鐘）

比照正式規則：只用文字編輯器、附 Makefile、檔名 `Q1.cpp` ~ `Q6.cpp`、零警告。

**Q1. 分數類別與運算子重載**
寫 `class Fraction`，支援 `+`、`-`、`*`、`/`、`==`、`<`，以及 `<<`、`>>`。結果一律化為最簡分數，負號放分子。讀入兩個分數後輸出四則運算結果。

```text
輸入： 1 2 1 3
輸出：
5/6
1/6
1/6
3/2
```

**Q2. 動態陣列類別**
寫 `class IntList`，內部用 `int*` 動態配置，支援 `add(int)`（容量不足自動加倍）、`remove(int value)`（刪除第一個符合的）、`get(int index)`、`size()`，並正確實作三法則。讀入指令操作後輸出最終內容。

**Q3. 檔案統計**
讀取 `grades.txt`（每列：`姓名 國文 英文 數學`），輸出到 `report.txt`：每人的總分與平均（兩位小數、欄位對齊），最後一列印全班各科平均。

**Q4. 字串處理**
讀入一整行英文句子，輸出：
1. 單字數
2. 把每個單字的首字母改成大寫後的句子
3. 反轉整個句子的單字順序

```text
輸入： hello world from nsysu
輸出：
4
Hello World From Nsysu
nsysu from world hello
```

**Q5. 繼承：交通工具**
`Vehicle` 有名稱與輪子數，提供 `describe()`。派生 `Car`（多載客數）與 `Truck`（多載重噸數），各自覆寫 `describe()`。讀入資料後印出描述。

**Q6. 綜合：學生管理系統**
把 `class Student`（姓名、學號、三科成績）拆成 `Student.h` / `Student.cpp`，`main.cpp` 讀入 `n` 位學生，依平均由高到低排序後輸出。**必須用 Makefile 編譯多檔案專案。**

<details>
<summary><b>Q1 參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

class Fraction {
private:
    int num, den;

    static int gcd(int a, int b) {
        if (a < 0) a = -a;
        if (b < 0) b = -b;
        return (b == 0) ? a : gcd(b, a % b);
    }

    void normalize() {
        if (den == 0) den = 1;
        if (den < 0) { num = -num; den = -den; }
        int g = gcd(num, den);
        if (g != 0) { num /= g; den /= g; }
    }

public:
    Fraction(int n = 0, int d = 1) : num(n), den(d) { normalize(); }

    Fraction operator+(const Fraction& o) const {
        return Fraction(num * o.den + o.num * den, den * o.den);
    }
    Fraction operator-(const Fraction& o) const {
        return Fraction(num * o.den - o.num * den, den * o.den);
    }
    Fraction operator*(const Fraction& o) const {
        return Fraction(num * o.num, den * o.den);
    }
    Fraction operator/(const Fraction& o) const {
        return Fraction(num * o.den, den * o.num);
    }
    bool operator==(const Fraction& o) const {
        return num == o.num && den == o.den;
    }
    bool operator<(const Fraction& o) const {
        return num * o.den < o.num * den;        // 分母已保證為正
    }

    friend ostream& operator<<(ostream& os, const Fraction& f) {
        os << f.num << '/' << f.den;
        return os;
    }
    friend istream& operator>>(istream& is, Fraction& f) {
        is >> f.num >> f.den;
        f.normalize();
        return is;
    }
};

int main() {
    Fraction a, b;
    cin >> a >> b;
    cout << a + b << '\n';
    cout << a - b << '\n';
    cout << a * b << '\n';
    cout << a / b << '\n';
    return 0;
}
```

</details>

<details>
<summary><b>Q2 參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

class IntList {
private:
    int* data;
    int  n, cap;

    void grow() {
        int newCap = (cap == 0) ? 4 : cap * 2;
        int* tmp = new int[newCap];
        for (int i = 0; i < n; i++) tmp[i] = data[i];
        delete[] data;
        data = tmp;
        cap = newCap;
    }

public:
    IntList() : data(nullptr), n(0), cap(0) { }
    ~IntList() { delete[] data; }

    IntList(const IntList& o) : data(new int[o.cap]), n(o.n), cap(o.cap) {
        for (int i = 0; i < n; i++) data[i] = o.data[i];
    }

    IntList& operator=(const IntList& o) {
        if (this == &o) return *this;
        delete[] data;
        n = o.n; cap = o.cap;
        data = new int[cap];
        for (int i = 0; i < n; i++) data[i] = o.data[i];
        return *this;
    }

    void add(int x) {
        if (n == cap) grow();
        data[n++] = x;
    }

    bool remove(int value) {
        for (int i = 0; i < n; i++)
            if (data[i] == value) {
                for (int j = i; j + 1 < n; j++) data[j] = data[j + 1];
                n--;
                return true;
            }
        return false;
    }

    int get(int i) const { return data[i]; }
    int size() const { return n; }
};

int main() {
    IntList list;
    string cmd;
    while (cin >> cmd && cmd != "END") {
        if (cmd == "ADD") { int x; cin >> x; list.add(x); }
        else if (cmd == "DEL") {
            int x; cin >> x;
            if (!list.remove(x)) cout << "not found\n";
        }
    }
    for (int i = 0; i < list.size(); i++)
        cout << list.get(i) << (i + 1 == list.size() ? '\n' : ' ');
    return 0;
}
```

</details>

<details>
<summary><b>Q3 參考解答</b></summary>

```cpp
#include <iostream>
#include <fstream>
#include <iomanip>
#include <vector>
#include <string>
using namespace std;

struct Student {
    string name;
    int    ch, en, ma;
};

int main() {
    ifstream fin("grades.txt");
    if (!fin) { cerr << "cannot open grades.txt\n"; return 1; }

    vector<Student> v;
    Student s;
    while (fin >> s.name >> s.ch >> s.en >> s.ma) v.push_back(s);

    ofstream fout("report.txt");
    if (!fout) { cerr << "cannot open report.txt\n"; return 1; }

    fout << left << setw(12) << "Name" << right << setw(6) << "Total"
         << setw(9) << "Average" << '\n';
    fout << fixed << setprecision(2);

    long long sumCh = 0, sumEn = 0, sumMa = 0;
    for (const Student& x : v) {
        int total = x.ch + x.en + x.ma;
        fout << left << setw(12) << x.name
             << right << setw(6) << total
             << setw(9) << total / 3.0 << '\n';
        sumCh += x.ch; sumEn += x.en; sumMa += x.ma;
    }

    if (!v.empty()) {
        int n = static_cast<int>(v.size());
        fout << left << setw(12) << "SUBJECT-AVG"
             << right << setw(8) << static_cast<double>(sumCh) / n
             << setw(8) << static_cast<double>(sumEn) / n
             << setw(8) << static_cast<double>(sumMa) / n << '\n';
    }
    return 0;
}
```

</details>

<details>
<summary><b>Q4 參考解答</b></summary>

```cpp
#include <iostream>
#include <sstream>
#include <vector>
#include <string>
#include <cctype>
using namespace std;

int main() {
    string line;
    getline(cin, line);

    istringstream iss(line);
    vector<string> words;
    string w;
    while (iss >> w) words.push_back(w);

    cout << words.size() << '\n';

    for (size_t i = 0; i < words.size(); i++) {
        string t = words[i];
        if (!t.empty())
            t[0] = static_cast<char>(toupper(static_cast<unsigned char>(t[0])));
        cout << t << (i + 1 == words.size() ? '\n' : ' ');
    }

    for (size_t i = words.size(); i > 0; i--)
        cout << words[i - 1] << (i == 1 ? '\n' : ' ');
    return 0;
}
```

用 `istringstream` 拆單字比自己一個字元一個字元判斷空白乾淨得多，而且多個連續空白也能自動處理。

</details>

<details>
<summary><b>Q5 參考解答</b></summary>

```cpp
#include <iostream>
#include <string>
using namespace std;

class Vehicle {
protected:
    string name;
    int    wheels;

public:
    Vehicle(const string& n, int w) : name(n), wheels(w) { }
    void describe() const {
        cout << name << " has " << wheels << " wheels.\n";
    }
};

class Car : public Vehicle {
private:
    int seats;
public:
    Car(const string& n, int w, int s) : Vehicle(n, w), seats(s) { }
    void describe() const {
        cout << name << ": " << wheels << " wheels, " << seats << " seats.\n";
    }
};

class Truck : public Vehicle {
private:
    double tons;
public:
    Truck(const string& n, int w, double t) : Vehicle(n, w), tons(t) { }
    void describe() const {
        cout << name << ": " << wheels << " wheels, " << tons << " tons.\n";
    }
};

int main() {
    string n1, n2;
    int w1, s1, w2;
    double t2;
    cin >> n1 >> w1 >> s1;
    cin >> n2 >> w2 >> t2;

    Car c(n1, w1, s1);
    Truck t(n2, w2, t2);
    c.describe();
    t.describe();
    return 0;
}
```

</details>

<details>
<summary><b>Q6 參考解答</b></summary>

**Student.h**

```cpp
#ifndef STUDENT_H
#define STUDENT_H

#include <string>

class Student {
private:
    std::string name;
    int id;
    int scores[3];

public:
    Student();
    Student(const std::string& n, int i, int a, int b, int c);

    double average() const;
    int    total() const;
    std::string getName() const;
    int    getId() const;
    void   print() const;
};

#endif
```

**Student.cpp**

```cpp
#include "Student.h"
#include <iostream>
#include <iomanip>
using namespace std;

Student::Student() : name("unknown"), id(0) {
    scores[0] = scores[1] = scores[2] = 0;
}

Student::Student(const string& n, int i, int a, int b, int c)
    : name(n), id(i) {
    scores[0] = a; scores[1] = b; scores[2] = c;
}

int Student::total() const { return scores[0] + scores[1] + scores[2]; }
double Student::average() const { return total() / 3.0; }
string Student::getName() const { return name; }
int Student::getId() const { return id; }

void Student::print() const {
    cout << left << setw(12) << name << right << setw(8) << id
         << setw(6) << total()
         << setw(9) << fixed << setprecision(2) << average() << '\n';
}
```

**main.cpp**

```cpp
#include <iostream>
#include <vector>
#include "Student.h"
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<Student> v;
    for (int i = 0; i < n; i++) {
        string name;
        int id, a, b, c;
        cin >> name >> id >> a >> b >> c;
        v.push_back(Student(name, id, a, b, c));
    }

    for (size_t i = 0; i + 1 < v.size(); i++)
        for (size_t j = i + 1; j < v.size(); j++)
            if (v[j].average() > v[i].average()) {
                Student t = v[i]; v[i] = v[j]; v[j] = t;
            }

    for (const Student& s : v) s.print();
    return 0;
}
```

**Makefile**

```makefile
CC     := g++
CFLAGS := -Wall -Wextra -std=c++17

.PHONY: all clean

all: Q6

Q6: main.o Student.o
	$(CC) -o $@ $^

main.o: main.cpp Student.h
	$(CC) $(CFLAGS) -c $<

Student.o: Student.cpp Student.h
	$(CC) $(CFLAGS) -c $<

clean:
	rm -f *.o Q6
```

</details>

---

## 整學期共通建議

1. **練習題不要拖**：實驗課的分數是當場檢查給的，補不回來；拖到期中前一週再補會非常痛苦。
2. **每次交檔前 `make clean && make`**：確認在乾淨狀態下能編過。很多人是「舊的執行檔還在」，Makefile 早就壞了卻不知道。
3. **把 warning 當 error**：平常就用 `-Wall -Wextra` 編譯，看到警告當場處理。上機考一個警告 2 分，五個就是 10 分。
4. **保留自己的程式碼**：期末複習時拿自己的舊 code 來練，比重看範例快得多。建議每週一個資料夾，學期末就是一份完整的複習教材。
5. **這門課叫「C 程式設計」但教的是 C++**：之後上網找資料要用 C++ 的關鍵字搜（`class`、`vector`、`ifstream`），搜到 C 語言的 `printf`、`malloc` 教學會愈看愈亂。
6. **課本是 reference 不是必讀**：本文的目的就是讓你不用天天翻書也能跟上。但如果想深入某個主題（STL、多重繼承細節、例外處理），*Absolute C++* 對應章節寫得比大部分中文教材完整，值得拿正版來讀。
7. **先讓程式跑起來，再讓它漂亮**：實驗課檢查的是「功能正確」。先寫出能過測資的版本，有時間再整理。
8. **看不懂錯誤訊息時，從第一個錯誤開始看**：C++ 的錯誤常常會連鎖爆出幾十行，但通常**只有第一個是真的**，修完再重編。

---

## 附錄

### 常用 g++ 編譯選項

```bash
g++ -Wall -Wextra -std=c++17 -o app main.cpp   # 開全部警告 + 指定 C++17（平常就用這個）
g++ -g -o app main.cpp                          # 加入除錯資訊（配合 gdb）
g++ -O2 -o app main.cpp                         # 開最佳化（跑比較快）
g++ -c foo.cpp                                  # 只編譯成 .o，不連結
g++ -E foo.cpp -o foo.i                         # 只做前置處理（看 #include 展開的結果）
g++ -fsanitize=address -g -o app main.cpp       # 執行時偵測陣列越界與記憶體錯誤
```

最後一個 `-fsanitize=address` 特別推薦：程式跑起來會幫你抓出越界存取、記憶體洩漏、重複釋放，並且**直接告訴你錯在第幾行**。平常除錯用它，交作業前再拿掉。

### 整學期通用的 Makefile

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

### 常見錯誤訊息對照表

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

### 名詞速查表

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

## 結語

這篇文章的用意不是要**取代**上課或教科書，而是提供一份**中文、原創、可以照著跑**的自學骨幹。

實驗課那條「當週題目全部檢查完可以提早離開」的規則，其實就是一個很誠實的檢查點：**如果你每週都能在課堂內把題目寫完、`make` 沒有任何警告，那你的進度就是穩的。** 反過來說，如果常常拖到最後或靠同學帶，期末上機考那 40% 會很難看。

真的只記得一件事的話，請記這個：**每寫完一小段就編譯一次、跑一次測資。** 這個習慣可以解決這門課九成的痛苦。

祝各位期中期末都拿到理想的分數。內容如果有錯誤或可以補充的地方，歡迎在下方留言告訴我，我會即時修正。
