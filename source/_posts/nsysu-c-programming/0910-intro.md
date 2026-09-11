---
title: 09/10｜課程介紹與環境暖身
date: 2026-09-10
updated: 2026-09-11
permalink: 2026/09/09/nsysu-c-programming/0910-intro/
cover: /images/code-cover.jpg
categories: [程式設計]
tags: [C++, 中山大學, 自學指南]
toc: false
comments: true
hidden: true
---

[← 環境設置](/2026/09/09/nsysu-c-programming/setup/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [09/17｜C++ 基礎（Ch 1） →](/2026/09/09/nsysu-c-programming/0917-cpp-basics/)

第一週主課是課程介紹，實驗課則會帶你把 VirtualBox / Ubuntu / g++ / Makefile 弄起來。

**這週務必做完的三件事：**

1. [〈環境設置〉](/2026/09/09/nsysu-c-programming/setup/)整段從頭到尾走一次，包含 Guest Additions 與快照。
2. 能靠自己在 Terminal 從空白目錄產出、編譯、執行一支 `HelloWorld.cpp`，**不看筆記**。
3. 能靠自己寫出[〈Makefile：從零到模組化〉](/2026/09/09/nsysu-c-programming/setup/#makefile從零到模組化)那份 Makefile，**不複製貼上**。

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

[← 環境設置](/2026/09/09/nsysu-c-programming/setup/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [09/17｜C++ 基礎（Ch 1） →](/2026/09/09/nsysu-c-programming/0917-cpp-basics/)
