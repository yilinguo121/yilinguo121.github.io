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

翻譯的動作叫**編譯（compile）**，翻譯失敗叫 **compile error（編譯錯誤）**，通常是你打錯字或少了分號。編譯成功才會產生**執行檔**，然後才能**執行**（run）它。

**② 程式的兩個預設出入口：標準輸入與標準輸出**

- **標準輸入（standard input）**：預設是你的鍵盤。程式用 `cin >> x;` 從這裡拿資料。
- **標準輸出（standard output）**：預設是螢幕。程式用 `cout << x;` 把東西印出來。

`<<` 和 `>>` 各是「兩個符號連寫成的**一個**運算子」，箭頭方向就是資料流動的方向：`cout << 東西` 是東西流向螢幕，`cin >> 變數` 是你鍵盤打的資料流進變數裡。`<<` 還可以一直接下去，`cout << a << b << c;` 就是依序印出三樣東西。（`x`、`a` 這種「用來裝資料的名字」叫**變數**，09/17 那篇會正式教，現在照著看就好。）

這兩個出入口之後都可以換成檔案，很好用，後面〈Terminal 指令〉會教。

**③ 終端機（Terminal）就是「用打字下指令」的視窗**

平常你用滑鼠雙擊圖示開程式；在 Linux 上更常用的是打字：

```bash
cd ~/Desktop        # 「切換到桌面這個資料夾」
ls                  # 「列出這個資料夾裡有什麼」
```

`./` 的意思是「目前這個資料夾」，所以等一下要執行自己編出來的程式，得打 `./HelloWorld` 而不是 `HelloWorld`。少打 `./` 會出現 `command not found`，這是新手最常見的第一個卡關點。

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
   - 語系**選英文**：中文語系的家目錄會叫「桌面／下載／文件」，`cd` 時得切輸入法打中文，之後所有教學與錯誤訊息裡的路徑也都對不上。
   - 如果視窗解析度太小、按不到 `Continue`：按住 **Super（鍵盤上的 Windows 鍵）** 再用滑鼠拖曳視窗（舊版系統是 `Alt`，兩個都試試看），或按 `Alt + F7` 進入移動模式後用方向鍵移動。
   - 安裝類型維持預設（Erase disk and install Ubuntu，這是抹掉**虛擬**硬碟，不會動到你的實體硬碟）。
   - 填使用者名稱與密碼——**這個密碼之後每次 `sudo` 都要用，一定要記得**。
6. 安裝完成重開機後，**先裝 Guest Additions**：虛擬機視窗選單 → 裝置 → 安裝 Guest Additions CD 映像，裝完再重開機一次。沒裝之前能選的解析度很少、畫面小到按不到按鈕；裝完解析度會自動跟著視窗跑，也才能開**雙向剪貼簿**（設定 → 一般 → 進階 → 共用剪貼簿：雙向），把題目文字從主機複製進去。若安裝過程出現找不到 gcc／make 的訊息，先跳到下一節〈安裝 g++ 與 make〉裝好 `build-essential`，再從「裝置 → 安裝 Guest Additions CD 映像」重跑一次。

**兩個之後會感謝自己的設定：**

- **建立快照（Snapshot）**：環境弄好後先照一張快照。之後哪天把系統玩壞了（`sudo rm` 砍錯東西），一鍵還原，不用重裝。
- **共用資料夾**：設定 → 共用資料夾，把主機某個資料夾掛進 Ubuntu，方便把 `.zip` 搬出來上傳。

> 共用剪貼簿與共用資料夾是**平常練習**用的便利設定，上機考當天請遵照現場助教指示。

## 安裝 g++ 與 make

> **以下所有指令都是在虛擬機裡的 Ubuntu 執行**，不是在你原本的 Windows／macOS。之後這篇文章講的「Terminal」一律指 Ubuntu 裡的那個。

開啟 Terminal（左下角九宮格搜尋 `terminal`，或快捷鍵 `Ctrl + Alt + T`），輸入：

```bash
sudo apt-get update && sudo apt-get upgrade
sudo apt-get install build-essential   # 一次裝好 g++、make 與相關工具
```

- `sudo` 代表以系統管理員權限執行，會要求輸入密碼（就是安裝 Ubuntu 時設定的登入密碼）。**輸入密碼時畫面不會有任何顯示，這是正常的**，打完直接按 Enter。
- `&&` 的意思是「左邊的指令成功執行完，才接著做右邊」，所以第一行是先更新套件清單、成功了再升級。
- 中途跳出 `Do you want to continue? [Y/n]` 一律回 `y` 再 Enter。

裝完驗證：

```bash
g++ --version
make --version
```

只看 `g++ --version` 的**第一行**，長得像下面這樣（Ubuntu 20.04 預設是 9.x，支援 `-std=c++17`）就是成功了：

```text
g++ (Ubuntu 9.4.0-1ubuntu1~20.04.2) 9.4.0
```

看到 `Command 'g++' not found` 就是**沒裝成功**，回去重跑安裝指令。安裝時若出現 `E: Could not get lock /var/lib/dpkg/lock-frontend`，代表背景的自動更新正在跑，等一兩分鐘再試。

## 第一支 Hello World

在 Terminal 裡建檔並打開編輯器（順便練一下剛剛的 `cd`）：

```bash
cd ~/Desktop
nano HelloWorld.cpp
```

`nano` 是 Ubuntu 內建的終端機文字編輯器，檔案不存在就等於新建。把下面的程式碼打進去，打完按 `Ctrl + O` → Enter 存檔、`Ctrl + X` 離開（後面〈Terminal 指令〉會再整理一次快捷鍵）：

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, NSYSU!" << endl;
    return 0;
}
```

編譯並執行：

```bash
g++ -Wall -Wextra -std=c++17 -o HelloWorld HelloWorld.cpp
./HelloWorld
```

```text
Hello, NSYSU!
```

看到這行就成功了。上面那個指令是你之後 99% 的時候會用的寫法，三個選項的意思：

- `-Wall -Wextra`：把編譯器的提醒全部打開（警告在這門課會扣分，平常就該開著）
- `-std=c++17`：用 C++17 這一版的語法規則編譯
- `-o HelloWorld`：指定產生的執行檔叫 `HelloWorld`；不寫 `-o` 的話預設會叫 `a.out`

**逐行解釋這支程式**（現在只要知道每一行大概在幹嘛，不用懂細節）：

| 程式碼 | 意義 |
| --- | --- |
| `#include <iostream>` | 前置處理指令，把標準輸入輸出函式庫的宣告「貼」進來，之後才能用 `cout` / `cin` |
| `int main()` | 程式進入點，作業系統執行你的程式就是呼叫它。`int` 表示這個函式結束時會交回一個整數（所以最後一行才是 `return 0;`），後面的 `()` 是參數列，空的代表不需要外部給資料 |
| `cout << "..." << endl;` | 雙引號中間的文字會原封不動印到螢幕上，引號本身不會出現（想改字就改引號中間，但一定要用英文的 `"`，中文全形引號或單引號都會編譯失敗）；`endl` 換行並清空輸出緩衝區。`<<` 可以一直接下去，所以這行有兩個 `<<`：先送出文字，再送出換行 |

另外兩行先照抄，09/17 那篇會正式解釋：`using namespace std;` 讓你可以寫 `cout` 而不是 `std::cout`（`::` 是兩個冒號連寫，意思是「某某裡面的某某」，`std::cout` 就是「std 這組工具裡的 cout」）；`return 0;` 是回傳 0 給作業系統，表示「正常結束」，非 0 表示發生錯誤。

**兩個一定要記住的符號規則：**

1. **分號 `;`**：每一個「命令」結尾都要加分號，像中文的句號。所以 `cout << ...;`、`using namespace std;`、`return 0;` 結尾都有；`int main() {` 是在「開始一個區塊」不是一個命令，所以沒有。少打分號是初學者最高頻的編譯錯誤（下一節錯誤表的 `expected ';'` 就是它）。
2. **大括號 `{ }`**：`{` 到 `}` 中間包住的是 `main` 的「身體」，程式從 `{` 的下一行一行一行往下執行，執行到 `}` 就結束。大括號永遠成對出現，裡面的程式碼習慣往右縮排四格，方便一眼看出誰跟誰配對。

## 編譯到底發生了什麼事

很多人卡在「錯誤訊息看不懂」，是因為不知道 g++ 其實做了**四件事**：

```text
HelloWorld.cpp
   │  ① 前置處理 Preprocessing   （展開 #include、#define）
   ▼
HelloWorld.i  （#include、#define 都已經被展開掉的原始碼）
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

（`#define` 跟 `#include` 一樣是 `#` 開頭的前置處理指令，用來定義代換用的名字，11/26 做分離編譯那篇才會用到，現在知道它也在第 ① 階段被展開就好。）

想親眼看到中間產物：

```bash
g++ -E HelloWorld.cpp -o HelloWorld.i   # 只做前置處理，產生 .i
g++ -c HelloWorld.cpp                   # 做完 ①②③，產生 HelloWorld.o
g++ -o HelloWorld HelloWorld.o          # ④ 連結，產生執行檔
```

打開 `HelloWorld.i` 會看到好幾萬行——因為整個 `<iostream>` 被原地貼了進來，這就是 `#include` 實際在做的事（裡面的 `# 1 "HelloWorld.cpp"` 是編譯器留的行號標記，不是你的程式碼）。`g++ -S HelloWorld.cpp` 則會產生組合語言 `.s`，好奇可以看看，這門課不會用到。

**為什麼要懂這個？** 因為錯誤訊息的類型直接告訴你卡在哪一關。這張表現在不用背，遇到訊息回來對就好：

| 訊息長相 | 發生階段 | 常見原因 |
| --- | --- | --- |
| `fatal error: xxx.h: No such file or directory` | ① 前置處理 | `#include` 後面的檔名打錯，或那個檔案不在該找得到的地方 |
| `error: expected ';' before '}' token` | ② 編譯 | 少分號、大括號沒成對 |
| `error: 'xxx' was not declared in this scope` | ② 編譯 | 這個名字沒先宣告過、忘了 `#include`、拼錯字 |
| `undefined reference to 'foo()'` | ④ 連結 | 你用了某個東西，但它的內容根本沒被編進來。看到它就知道是「連結」這關出事，不是語法錯（11/26 那篇會詳細講） |
| `Segmentation fault (core dumped)` | 執行時期 | 程式動到不該動的記憶體（陣列越界、空指標、無窮遞迴），這些名詞後面幾篇會學到 |

**分離編譯**（[後面〈分離編譯與命名空間〉那一節](/2026/09/09/nsysu-c-programming/1126-separate-compilation/)）就是刻意把「產生 `.o`（①②③）」與「連結成執行檔（④）」拆成兩步：每個 `.cpp` 各自 `g++ -c` 編成 `.o`，改一個檔只要重編那一個，最後再一起連結。Makefile 存在的理由就是自動化這件事。

## 你必須會的 Terminal 指令

兩場上機考**只能用文字編輯器 + Terminal**，不能用 VS Code、Dev-C++ 或任何 IDE 的自動完成——**考場上沒有任何工具會提醒你少打分號**。下面這些請練到反射動作：

| 指令 | 功能 |
| --- | --- |
| `pwd` | 顯示目前所在的完整路徑（迷路時第一個下的指令） |
| `ls` ／ `ls -al` | 列出當前目錄的檔案 ／ 連隱藏檔、權限、大小、時間一起列 |
| `cd 資料夾名` | 進入子目錄（打前幾個字按 `Tab` 可自動補完） |
| `cd ..` ／ `cd ~` | 回上一層 ／ 回家目錄 |
| `mkdir 名稱` | 建立資料夾 |
| `nano 檔名` | 用終端機文字編輯器開檔（檔案不存在就是新建） |
| `g++ -Wall -Wextra -std=c++17 -o Q1 Q1.cpp` ／ `./Q1` | 編譯 `Q1.cpp` 產生執行檔 `Q1` ／ 執行它 |
| 刪除／搬移／複製 | `rm 檔名`、`rm -rf 資料夾`（**下這個指令前先 `pwd` 確認位置**）、`mv 來源 目的`（也可用來改名）、`cp 來源 目的`（`cp -r` 複製資料夾） |
| `zip -r 學號.zip 學號/` | 把資料夾壓縮成 zip（繳交必用） |

其他指令（`cat`、`find`、`du`……）用到再查就好，不用背。

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
nano in.txt               # 把測資存成檔案
./Q1 < in.txt             # 用檔案當標準輸入
./Q1 < in.txt > out.txt   # 順便把輸出存起來
diff out.txt ans.txt      # ans.txt 是你自己照題目範例打的預期答案；diff 什麼都沒印就代表兩個檔一字不差
```

`< 檔案` 叫**輸入重導向**（把「標準輸入」從鍵盤換成檔案），`> 檔案` 是輸出重導向。助教說「換一組測資試試」時，你改 `in.txt` 再跑一次就好。

## Makefile：從零到模組化

實驗課與上機考要求**每次交檔都要附一份可用的 Makefile**，能一次編譯當週所有題目（編不過就是 0 分，扣分規則見文末）。

### Makefile 的三個組成

```makefile
目標(target): 相依檔案(prerequisites)
<Tab>	執行的指令(recipe)
```

`make` 的運作邏輯就兩句話：

1. **目標檔案不存在 → 執行下面的指令。**
2. **目標存在，但相依檔案比它新 → 也執行。** 兩者都不是就什麼都不做，印出 `Nothing to be done`。

所以第一次 `make` 會把執行檔通通編出來；之後改了 `Q1.cpp` 再 `make`，畫面上只會印一行指令——只有 `Q1` 被重編，`Q2`–`Q4` 完全沒動。這叫**增量編譯**：四題的時候感覺不出差別，但一個專案有三十個檔案時，這是「等 1 秒」和「等 1 分鐘」的差別。

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

連續下兩次 `make`，就能親眼看到上面那兩句話：

```text
$ make
g++ -o Q1 Q1.cpp
g++ -o Q2 Q2.cpp
g++ -o Q3 Q3.cpp
g++ -o Q4 Q4.cpp
$ make
make: Nothing to be done for 'all'.
```

> **最常見的錯誤：`Makefile:3: *** missing separator. Stop.`**
> 意思是「指令那一行的開頭不是 Tab」。Makefile 規定 recipe 前面**必須是一個 Tab 字元，不能是空格**，而很多編輯器會自動把 Tab 換成空格。要確認就在 Terminal 下 `cat -A Makefile`：行首顯示 `^I` 的才是 Tab，顯示成一堆空白的就是被換掉了。修法是把那行開頭的空白全刪掉、重打一個 Tab（在 `nano` 裡直接按 Tab 鍵不會被展開成空格，可以放心）。

### 加入變數與 `.PHONY`

```makefile
CXX      := g++
CXXFLAGS := -Wall -Wextra -std=c++17

.PHONY: all clean

all: Q1 Q2 Q3 Q4

Q1: Q1.cpp
	$(CXX) $(CXXFLAGS) -o Q1 Q1.cpp

# Q2、Q3、Q4 同理

clean:
	rm -f Q1 Q2 Q3 Q4
```

- `CXX`、`CXXFLAGS` 是變數，`:=` 是 Makefile 的「把這個名字設成某個值」寫法（跟規則那行 `目標:` 的冒號是兩回事），設好之後用 `$(CXX)` 取值，要改編譯選項只要改一個地方。名字請照慣例：C++ 用 `CXX`／`CXXFLAGS`，C 才用 `CC`／`CFLAGS`，取對了 make 的內建規則才不會跟你打架。
- `.PHONY: all clean` 告訴 make「`all` 和 `clean` 不是真的檔案名稱」。否則哪天資料夾裡剛好有個叫 `clean` 的檔案，`make clean` 就會說「clean is up to date」什麼都不做。

### 模組化版本（實驗課要求的形式）

題目一多，上面那種寫法就會一直複製貼上。用**自動變數**與 **pattern rule** 讓它自己長出來：

```makefile
CXX      := g++
CXXFLAGS := -Wall -Wextra -std=c++17
SRCS     := $(wildcard Q*.cpp)
TARGETS  := $(SRCS:.cpp=)

.PHONY: all clean

all: $(TARGETS)

# pattern rule：任何 Qx 都對應到 Qx.cpp
%: %.cpp
	$(CXX) $(CXXFLAGS) -o $@ $<

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

交出去之前一定要在**乾淨狀態**下重編一次，確認沒問題後再清掉執行檔、回上一層壓縮：

```bash
make clean && make          # 全部刪掉重編一次
make clean && cd .. && zip -r 學號.zip 學號/
```

很多人是「之前編好的執行檔還在」，Makefile 其實早就壞了卻不知道。

## 繳交規則與評分

- `.cpp` 命名 `Q題號.cpp`、Makefile 產生的執行檔命名 `Q題號`（第二題 → `Q2.cpp`、`Q2`）
- 所有檔案（**含 Makefile**）放在**以學號命名的資料夾**下（例如 `B153040XXX/`），壓縮成 `學號.zip`
- **壓縮前先 `make clean`**：zip 裡只放 `.cpp` 和 `Makefile`，不要塞執行檔和 `.o`
- Makefile 必須能成功編譯，**否則以 0 分計算**
- **任何編譯警告（warning）或錯誤（error）都扣 2 分**，所以 `-Wall -Wextra` 平常就要開著
- 每寫完一題就 `make` 一次把警告當場清掉，再 `./Qn < in.txt` 跑一次題目附的範例，不要相信「應該對」的直覺

> **什麼是 warning？** 編譯器覺得「這樣寫合法，但你八成寫錯了」時給的提醒——程式還是會編譯成功，所以很容易被忽略。例如宣告了變數卻沒用到，或是把 `==`（比較兩個值是不是一樣）打成 `=`（把右邊的值存進左邊）；這兩個符號長得像但意思完全不同，09/17 那篇會正式介紹。

---

[回總覽](/2026/09/09/nsysu-c-programming/) ｜ [09/10｜課程介紹與環境暖身 →](/2026/09/09/nsysu-c-programming/0910-intro/)
