---
title: 中山大學 C 程式設計 & 實驗課完整自學指南（1151 學期）
date: 2026-09-10
updated: 2026-09-11
permalink: 2026/09/09/nsysu-c-programming/
cover: /images/code-cover.jpg
categories: [程式設計]
tags: [C++, 中山大學, 自學指南, GCC, Makefile, Ubuntu]
description: 依照國立中山大學 CSE123「C 程式設計」與其實驗課 1151 學期的公開進度表寫成的自學筆記，共 18 篇。含環境與 Makefile、每週語法講解與常見雷區、逐週原創練習題與參考解答，以及期中／期末模擬考。這一頁是系列總覽與目錄。
toc: true
comments: true
mermaid: false
---

> **關於這份筆記**
> 本文依據國立中山大學資工系 CSE123「C 程式設計」（授課老師：柯正雯 副教授）與其對應實驗課 1151 學期的**公開進度表**寫成。內容皆為筆者針對每一週語法重點所整理的**原創說明、自寫範例與自出練習題**，並不轉載教科書 *Absolute C++* (Walter Savitch, 6/e) 內文、圖片、習題題目或授課教授自製投影片。若讀者希望取得完整原文與課本習題，仍請透過正版管道取得該書。
>
> 文中所有程式碼都在 `g++ -Wall -Wextra -std=c++17` 下實際編譯執行過。

---

## 這份筆記是什麼

修過中山資工「C 程式設計」的同學都知道兩件事：課本是 Pearson 的原文書 *Absolute C++*，一章動輒五六十頁；而這門課雖然叫「C 程式設計」，實際教的是 **C++**。對第一次寫程式的人來說，光是看懂課本就先耗掉大半力氣。

這個系列依照 1151 學期的公開進度表，把**每一週該會什麼、為什麼這樣寫、哪裡會踩雷**用中文講清楚，讓你不用天天翻原文書也跟得上。內容包含：

- **每週一篇**：觀念講解 ＋ 可以直接複製編譯的範例 ＋ 常見雷區 ＋ 我自己出的練習題與參考解答
- **環境與 Makefile**：從 VirtualBox 裝到模組化 Makefile，寫成可以照抄的流程
- **三份模擬考**：期中模擬上機考、期末筆試模擬題、期末模擬上機考，都附解答

所有程式碼都在 `g++ -Wall -Wextra -std=c++17` 下實際編譯執行過，零警告。

**讀法建議**：不要一次讀完。每週上課前讀當週那篇（約 15 分鐘），上課後把練習題做完（60–90 分鐘），是最有效率的用法。

---

## 目錄

| 章節 | 這篇在講什麼 |
| --- | --- |
| **[環境設置：把工具鏈準備好](/2026/09/09/nsysu-c-programming/setup/)** | VirtualBox、Ubuntu 20.04、g++、終端機指令、Makefile 從零到模組化 |
| **[09/10｜課程介紹與環境暖身](/2026/09/09/nsysu-c-programming/0910-intro/)** | 開學第一件事：把環境弄好，並自我檢測 |
| **[09/17｜C++ 基礎（Ch 1）](/2026/09/09/nsysu-c-programming/0917-cpp-basics/)** | 型別、變數、輸入輸出、算術與整數除法陷阱 |
| **[09/24｜流程控制與函式基礎（Ch 2、Ch 3）](/2026/09/09/nsysu-c-programming/0924-flow-control/)** | if / switch / 迴圈、自訂函式、遞迴、作用域 |
| **[10/01｜參數傳遞與函式重載（Ch 4）](/2026/09/09/nsysu-c-programming/1001-parameters/)** | 傳值 vs 傳參考、const 參考、重載、預設引數 |
| **[10/08｜陣列（Ch 5）](/2026/09/09/nsysu-c-programming/1008-arrays/)** | 一維與二維陣列、越界、陣列傳參、搜尋與排序 |
| **[10/15｜結構與類別（Ch 5–6）](/2026/09/09/nsysu-c-programming/1015-struct-class/)** | struct、class、封裝、public / private、const 成員函式 |
| **[10/22｜類別與建構子（Ch 6–7）](/2026/09/09/nsysu-c-programming/1022-constructors/)** | 建構子、初始化列表、預設建構子、static 成員 |
| **[10/29｜vector 與運算子重載入門（Ch 7）](/2026/09/09/nsysu-c-programming/1029-vector-operator/)** | vector 常用操作、傳參、運算子重載的概念 |
| **[11/05｜期中上機考（範圍 Ch 1–6）](/2026/09/09/nsysu-c-programming/1105-midterm/)** | 複習清單＋一份 90 分鐘模擬上機考（附解答） |
| **[11/12｜運算子重載、friend 與 string（Ch 8、Ch 9）](/2026/09/09/nsysu-c-programming/1112-operator-string/)** | 成員 vs 非成員、friend、重載 << >>、string 類別 |
| **[11/19｜指標、動態記憶體與 C 風格字串（Ch 9、Ch 10）](/2026/09/09/nsysu-c-programming/1119-pointers/)** | 指標、new / delete、深拷貝與三法則、C-string |
| **[11/26｜分離編譯與命名空間（Ch 11）](/2026/09/09/nsysu-c-programming/1126-separate-compilation/)** | header / 實作檔、include guard、多檔案 Makefile、namespace |
| **[12/03｜檔案輸入輸出（Ch 12）](/2026/09/09/nsysu-c-programming/1203-file-io/)** | ifstream / ofstream、讀到檔尾、格式化、stringstream |
| **[12/10｜繼承（Ch 14）](/2026/09/09/nsysu-c-programming/1210-inheritance/)** | 衍生類別、protected、覆寫、建構解構順序、is-a vs has-a |
| **[12/17｜期末筆試（範圍 Ch 1–12、Ch 14）](/2026/09/09/nsysu-c-programming/1217-final-written/)** | 全學期複習表＋12 題「看程式答輸出」模擬題 |
| **[12/24｜期末上機考（範圍 Ch 1–12、Ch 14）](/2026/09/09/nsysu-c-programming/1224-final-lab/)** | 應考流程＋一份 120 分鐘模擬上機考（附解答） |
| **[附錄：編譯選項、Makefile、錯誤訊息與名詞速查](/2026/09/09/nsysu-c-programming/appendix/)** | g++ 選項、通用 Makefile、常見錯誤訊息對照表、名詞速查表 |

- 完全沒寫過程式的話，請從[環境設置](/2026/09/09/nsysu-c-programming/setup/)照順序讀下來，看到不懂的名詞就查[附錄的名詞速查表](/2026/09/09/nsysu-c-programming/appendix/#名詞速查表)。
- 已經寫過其他語言的話，可以只看每篇的「常見雷區」與練習題，遇到不熟的語法再回頭看講解。
- 每題練習都有**參考解答**（點開「參考解答」展開）。請先自己寫過再看。

---

## 整學期進度表

課本是 *Absolute C++*, Walter Savitch, 6/e（Global Edition）。主課成績是**期中上機 30% ＋ 期末筆試 30% ＋ 期末上機 40%**，期末上機比期中進步 30 分以上還可以加 1–3 分——換句話說，**期中考砸了不是世界末日**。

下表的「課程內容」可以直接點進該週的頁面：

| 日期 | 課程內容 | 課本指定習題 |
| --- | --- | --- |
| 09/10 | [Introduction to the Course](/2026/09/09/nsysu-c-programming/0910-intro/) | — |
| 09/17 | [C++ Basics](/2026/09/09/nsysu-c-programming/0917-cpp-basics/) | Ch1: 6, 8, 13；Ch2: 2, 4, 7, 8 |
| 09/24 | [C++ Basics；Function Basics](/2026/09/09/nsysu-c-programming/0924-flow-control/) | Ch3: 1, 5, 10, 11, 13 |
| 10/01 | [Parameters and Overloading](/2026/09/09/nsysu-c-programming/1001-parameters/) | Ch4: 3, 7, 8, 9, 14, 17 |
| 10/08 | [Function Overloading；Arrays](/2026/09/09/nsysu-c-programming/1008-arrays/) | Ch5: 4, 8, 10, 14, 17 |
| 10/15 | [Arrays；Structures and Classes](/2026/09/09/nsysu-c-programming/1015-struct-class/) | Ch6: 1, 7, 10, 12 |
| 10/22 | [Structures and Classes；Constructors](/2026/09/09/nsysu-c-programming/1022-constructors/) | — |
| 10/29 | [Constructors；Vectors；Operator Overloading](/2026/09/09/nsysu-c-programming/1029-vector-operator/) | — |
| 11/05 | **[Midterm Exam（上機，Ch1–Ch6）](/2026/09/09/nsysu-c-programming/1105-midterm/)** | Ch7: 1, 5, 6, 8, 11 |
| 11/12 | [Operator Overloading；String](/2026/09/09/nsysu-c-programming/1112-operator-string/) | Ch8: 1, 4, 5, 8, 9 |
| 11/19 | [Pointers](/2026/09/09/nsysu-c-programming/1119-pointers/) | Ch9: 2, 4, 6, 10；Ch10: 1, 3, 4, 8 |
| 11/26 | [Separate Compilation and Namespaces](/2026/09/09/nsysu-c-programming/1126-separate-compilation/) | Ch11: 1, 3 |
| 12/03 | [Streams and File I/O](/2026/09/09/nsysu-c-programming/1203-file-io/) | Ch12: 2, 3, 5 |
| 12/10 | [Inheritance](/2026/09/09/nsysu-c-programming/1210-inheritance/) | Ch14: 4, 6, 8 |
| 12/17 | **[Final Exam I（筆試，Ch1–Ch12、Ch14）](/2026/09/09/nsysu-c-programming/1217-final-written/)** | — |
| 12/24 | **[Final Exam II（上機，Ch1–Ch12、Ch14）](/2026/09/09/nsysu-c-programming/1224-final-lab/)** | — |

三個從這張表就能讀出來的重點：

1. **期中只考到 Ch6**，也就是基礎語法、函式、陣列、struct / class，**不含建構子**。很多人考前拚命讀建構子，方向錯了。
2. **Ch13（Recursion）與 Ch15 之後（多型、template、STL、例外處理）都不在考試範圍**。遞迴本身 Ch3 就教過、仍然會考，但 `virtual` 不會考。
3. Ch7（建構子、vector、運算子重載）的習題到期中考那週才發，代表**這塊是期末的重點**。

---

## 幾個提醒

1. **練習題不要拖**：實驗課的分數是當場檢查給的，補不回來。
2. **每次交檔前 `make clean && make`**：確認在乾淨狀態下能編過。很多人是舊的執行檔還在，Makefile 早就壞了卻不知道。
3. **把 warning 當 error**：平常就用 `-Wall -Wextra` 編譯。上機考一個警告 2 分，五個就是 10 分。
4. **保留自己寫過的程式**：期末複習時拿自己的舊 code 來練，比重看範例快得多。
5. **搜資料要用 C++ 的關鍵字**（`class`、`vector`、`ifstream`），搜到 C 語言的 `printf`、`malloc` 教學會愈看愈亂。

---

## 結語

這個系列不是要取代上課或教科書，而是提供一份**中文、原創、可以照著跑**的自學骨幹。

真的只記得一件事的話，請記這個：**每寫完一小段就編譯一次、跑一次測資。** 這個習慣可以解決這門課九成的痛苦。

內容如果有錯誤或可以補充的地方，歡迎在下方留言告訴我，我會即時修正。
