---
title: 12/03｜檔案輸入輸出（Ch 12）
date: 2026-09-10
updated: 2026-09-11
permalink: 2026/09/09/nsysu-c-programming/1203-file-io/
cover: /images/code-cover.jpg
categories: [程式設計]
tags: [C++, 中山大學, 自學指南]
toc: true
comments: true
hidden: true
---

[← 11/26｜分離編譯與命名空間（Ch 11）](/2026/09/09/nsysu-c-programming/1126-separate-compilation/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [12/10｜繼承（Ch 14） →](/2026/09/09/nsysu-c-programming/1210-inheritance/)

> 對應課本習題：Ch12: 2, 3, 5

**這次要會什麼**

```text
ifstream / ofstream → 檢查開檔成功 → 讀到檔尾 → 追加模式 → 逐字元讀寫 → 格式化 → stringstream
```

## 串流（stream）的概念

**白話說**：串流就是「資料流動的水管」。`cin` 是從鍵盤流進來的水管，`cout` 是流向螢幕的水管。檔案 I/O 做的事只有一件——**把水管的另一端接到檔案上**，語法完全一樣。

| 類別 | 用途 | 類比 |
| --- | --- | --- |
| `ifstream` | 從檔案**讀**（input file stream） | 像 `cin` |
| `ofstream` | 往檔案**寫**（output file stream） | 像 `cout` |
| `fstream` | 可讀可寫 | 兩者皆可 |

都要 `#include <fstream>`。

## 讀檔

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

假設 `input.txt` 內容是 `3 7 11` 與 `20`，輸出：

```text
sum = 41
```

`if (!fin)` 檢查開檔是否成功。**沒檢查就直接讀**的話，檔案不存在時程式會安靜地什麼都不做，你會找 bug 找很久。

另一種寫法是先宣告再開檔：

```cpp
ifstream fin;
fin.open("input.txt");
if (fin.fail()) { /* 錯誤處理 */ }
```

## 寫檔

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

這支程式螢幕上不會有輸出，但會產生 `output.txt`：

```text
Hello, file!
42 3.14
```

- `ofstream fout("out.txt");` 預設會**清空**原本的檔案。
- 想**接在後面**寫，用追加模式：

```cpp
ofstream fout("log.txt", ios::app);     // append
```

常見開檔模式：`ios::in`（讀）、`ios::out`（寫）、`ios::app`（追加）、`ios::binary`（二進位）。多個模式用 `|` 串起來：`ios::in | ios::out`。

## 讀到檔尾的正確寫法

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

## 逐字元讀寫

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

## 格式化輸出（`<iomanip>`）

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

## 檔名由使用者輸入決定

檔名不一定要寫死在程式裡：

```cpp
#include <iostream>
#include <fstream>
#include <string>
using namespace std;

int main() {
    string filename;
    cout << "要讀哪個檔案？";
    cin >> filename;

    ifstream fin(filename);          // C++11 起可以直接吃 string
    if (!fin) {
        cerr << "開不起來：" << filename << '\n';
        return 1;
    }

    string line;
    while (getline(fin, line)) cout << line << '\n';
    return 0;
}
```

> **舊編譯器要注意**：C++11 以前的 `ifstream` 只吃 C 風格字串，得寫成 `fin.open(filename.c_str());`。課本用的是這個舊寫法，Ubuntu 20.04 的 g++ 兩種都吃得下。

## 隨機存取：`seekg` / `tellg`

前面都是「從頭讀到尾」。串流其實有一個**讀取位置指標**，可以自己搬動：

| 函式 | 作用 |
| --- | --- |
| `fin.tellg()` | 目前讀取位置（第幾個 byte） |
| `fin.seekg(n)` | 跳到第 n 個 byte |
| `fin.seekg(n, ios::beg)` | 從檔頭往後 n |
| `fin.seekg(n, ios::end)` | 從檔尾往前（n 用負數） |
| `fout.tellp()` / `fout.seekp(...)` | 寫入位置的對應版本（p = put） |

最常見的用途是**先量出檔案大小**：

```cpp
ifstream fin("input.txt");
fin.seekg(0, ios::end);          // 跳到檔尾
long long size = fin.tellg();    // 此時位置＝檔案長度
fin.seekg(0, ios::beg);          // 記得跳回檔頭再開始讀
cout << "檔案大小 " << size << " bytes\n";
```

這學期只要知道有這件事、看得懂就好，實驗課題目幾乎都是順序讀寫。

## `stringstream`：把字串當串流用

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

輸出：

```text
Yilin total = 283
```

反過來，`ostringstream` 可以把數字組成字串：

```cpp
ostringstream oss;
oss << "score_" << 95;
string s = oss.str();        // "score_95"
```

**組合技**：`getline` 讀一整行 + `istringstream` 拆欄位，是處理「每列欄位數不固定」的資料的標準做法。

## 本節重點回顧

- 檔案串流的用法跟 `cin` / `cout` 幾乎一樣，只是把管子接到檔案上。
- **開檔後一定要檢查** `if (!fin)`，否則檔案不存在時程式會安靜地什麼都不做。
- 讀到檔尾的正確寫法是 `while (fin >> x)` 或 `while (getline(fin, line))`；**用 `while (!fin.eof())` 會多跑一圈**。
- `fin >> c` 會跳過空白，`fin.get(c)` 不會——要原封不動處理檔案內容就用 `get` / `put`。
- `ofstream` 預設會清空檔案，要接在後面寫得用 `ios::app`。
- `setw` 只影響下一個輸出，`fixed`、`setprecision`、`left` / `right` 會一直生效。
- 「`getline` 讀一整行 ＋ `istringstream` 拆欄位」是處理每列欄位數不固定的標準組合。

## 本次練習題

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

[← 11/26｜分離編譯與命名空間（Ch 11）](/2026/09/09/nsysu-c-programming/1126-separate-compilation/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [12/10｜繼承（Ch 14） →](/2026/09/09/nsysu-c-programming/1210-inheritance/)
