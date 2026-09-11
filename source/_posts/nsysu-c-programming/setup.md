---
title: 環境設置：把工具鏈準備好
date: 2026-09-10
updated: 2026-09-11
permalink: 2026/09/09/nsysu-c-programming/setup/
cover: /images/code-cover.jpg
categories: [程式設計]
tags: [C++, 中山大學, 自學指南]
toc: true
comments: true
hidden: true
---

[回總覽](/2026/09/09/nsysu-c-programming/) ｜ [09/10｜課程介紹與環境暖身 →](/2026/09/09/nsysu-c-programming/0910-intro/)

實驗課與上機考都在**虛擬機的 Ubuntu 20.04 LTS** + **g++** + **Makefile** 環境完成。這一段請在第一次實驗課前先自己做一遍，課堂上就不會耗掉整個下午。

## 給完全沒寫過程式的人：先建立三個概念

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

## 安裝 VirtualBox 與 Ubuntu 20.04

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

## 安裝 g++ 與 make

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

## 第一支 Hello World

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

## 編譯到底發生了什麼事

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

**分離編譯**（[後面〈分離編譯與命名空間〉那一節](/2026/09/09/nsysu-c-programming/1126-separate-compilation/)）就是刻意把 ③ 與 ④ 拆開：每個 `.cpp` 各自編成 `.o`，改一個檔只要重編那一個，最後再一起連結。Makefile 存在的理由就是自動化這件事。

## 你必須會的 Terminal 指令

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

## Makefile：從零到模組化

實驗課與上機考要求**每次交檔都要附一份可用的 Makefile**，能一次編譯當週所有題目。**Makefile 編不過 → 這次 0 分**，這是白紙黑字寫在規範上的。

### Makefile 的三個組成

```makefile
目標(target): 相依檔案(prerequisites)
<Tab>	執行的指令(recipe)
```

`make` 的運作邏輯只有一句話：**如果「相依檔案」比「目標」新，就執行下面的指令**。所以改了 `Q1.cpp`，`make` 就只重編 `Q1`，沒改的不會重編——這叫**增量編譯**。

### 最基本版本

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

### 加入變數與 `.PHONY`

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

### 模組化版本（實驗課要求的形式）

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

### 驗證你的 Makefile 真的能用

交出去之前一定要做這個檢查：

```bash
make clean && make
```

在**乾淨狀態**下重編一次。很多人是「之前編好的執行檔還在」，Makefile 其實早就壞了卻不知道。

### 繳交規則整理

- `.cpp` 命名：`Q題號.cpp`（第二題 → `Q2.cpp`）
- 執行檔命名：`Q題號`（第二題 → `Q2`）
- 所有檔案（**含 Makefile**）放在**以學號命名的資料夾**下（例如 `B153040XXX/`）
- 壓縮成 zip，檔名為 `學號.zip`（例如 `B153040XXX.zip`）
- 繳交時需確認 Makefile 能成功編譯，**否則以 0 分計算**
- **任何編譯警告（warning）或錯誤（error）都扣 2 分** → 所以 `-Wall -Wextra` 要平常就開著，別等到考試才發現一堆警告

期中、期末兩場上機考用的是同一套環境與同一套規則，只是多了「只能用純文字編輯器、不能用 IDE 與自動補全」這條。也就是說，**考場上沒有任何工具會提醒你少打分號**，平常練習時就該習慣。

> **什麼是 warning？** 編譯器覺得「這樣寫合法，但你八成寫錯了」時給的提醒——程式還是會編譯成功，所以很容易被忽略。例如宣告了變數卻沒用到、把 `==` 打成 `=`。一個警告 2 分，非常好賺也非常好賠。

### 兩個保命習慣

1. **每寫完一題就 `make` 一次**：警告當場清掉，不要堆到最後十分鐘才發現有五個警告（= 10 分沒了）。
2. **每寫完一題就 `./Qn` 跑幾組測資**：至少跑「題目給的範例」＋「邊界情況」（0、負數、只有一個元素、剛好等於上限）。不要相信「應該對」的直覺。

---

[回總覽](/2026/09/09/nsysu-c-programming/) ｜ [09/10｜課程介紹與環境暖身 →](/2026/09/09/nsysu-c-programming/0910-intro/)
