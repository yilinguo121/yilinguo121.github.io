---
title: 12/03｜檔案輸入輸出（Ch 12）
date: 2026-09-10
updated: 2026-09-12
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

**這週要會什麼**

```text
ifstream / ofstream → 檢查開檔 → 讀到檔尾 → 追加模式 → get / put 逐字元 → 對齊輸出 → getline + stringstream 拆欄位
```

## 串流（stream）的概念

**白話說**：串流就是「資料流動的水管」。`cin` 是從鍵盤流進來的水管，`cout` 是流向螢幕的水管。檔案 I/O 做的事只有一件——**把水管的另一端接到檔案上**，語法完全一樣。

| 類別 | 用途 | 類比 |
| --- | --- | --- |
| `ifstream` | 從檔案**讀**（input file stream） | 像 `cin` |
| `ofstream` | 往檔案**寫**（output file stream） | 像 `cout` |

都要 `#include <fstream>`。（還有可讀可寫的 `fstream`，這學期用不到。）

「語法完全一樣」不是比喻：`ofstream` 就是**一種** `ostream`，所以你在 11/12 自己重載的 `operator<<(ostream& os, const Vec2& v)`，拿去寫檔案 `fout << v;` 完全不用改（`ifstream` 與 `istream` 同理）。「是一種」的意思 12/10 講繼承時會說清楚。

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

`input.txt` 內容與輸出：

```text
input.txt:
3 7 11
20

輸出：
sum = 41
```

- `cerr` 就是 09/17 提過的**標準錯誤輸出**：一樣印到螢幕，但不緩衝、專門用來印錯誤訊息。
- `if (!fin)` 檢查開檔是否成功。**沒檢查就直接讀**的話，`while (fin >> x)` 一圈都不會跑，上面那支會若無其事地印出 `sum = 0`——看起來像個正常答案，你根本不會發現檔案壓根沒打開。開不起來最常見的原因不是程式寫錯，是**檔案不在你執行 `./a.out` 的那個資料夾**——程式裡的 `"input.txt"` 找的是「目前工作目錄」底下的檔案；先 `ls` 確認兩個在一起再重跑。

> **為什麼串流可以當條件？**
> 兩件事。(1) `fin >> x` 的**回傳值是 `fin` 自己**，所以 `>>` 才能一路串下去寫成 `fin >> a >> b`——這就是 11/12 你親手寫過的「`operator>>` 要回傳 `istream&`」。(2) 串流身上記著一個**狀態**（上一次讀寫成功了沒），被放進 `if` / `while` 的括號裡時會自動變成 `true`（狀態正常）或 `false`（讀失敗、到檔尾、格式不合）。
> 所以 `while (fin >> x)` 讀作「這次真的讀到一個 int 就繼續」，`!fin` 讀作「串流狀態不正常」。這就是 09/24 說「串流能當條件，原理 12/03 再講」的那件事。

另一種寫法是先宣告再開檔：

```cpp
ifstream fin;
fin.open("input.txt");
if (fin.fail()) { /* 錯誤處理 */ }
```

`fin.fail()` 問的是「上一個動作失敗了嗎」，在開檔檢查上跟 `!fin` 同一件事，挑一種寫就好（課本兩種都有）。分開寫真正的用途是**同一個串流要換檔案重開**（先 `close()` 再 `open()`）；檔名等程式跑起來才決定並不需要分開寫——後面〈檔名由使用者輸入決定〉那支就是直接 `ifstream fin(filename);`。

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

- `ofstream fout("output.txt");` **檔案不存在會自動新建**（這點跟 `ifstream` 相反），存在的話預設會**清空**（本來的內容就沒了）。所以 `ofstream` 開檔失敗通常是資料夾沒有寫入權限，不是檔案不見。
- `fout.close();`：寫完要**在同一支程式裡再讀回來**時一定要先 `close()`，否則資料可能還卡在緩衝區裡、讀到的是空檔；單純寫完就結束程式可以不寫。
- 想**接在後面**寫，用追加模式：

```cpp
ofstream fout("log.txt", ios::app);     // append
```

`ios` 是所有串流共同的祖先類別，`::` 就是 10/15 的「屬於」，所以 `ios::app` ＝「`ios` 裡那個叫 `app`（append）的旗標」。常用的只有三個：`ios::in`（讀）、`ios::out`（寫，預設清空）、`ios::app`（接在後面寫）；`ios::binary` 是給圖片影音用的，這學期用不到。要一次指定好幾種模式就用 `|` 串起來，例如 `ofstream fout("log.txt", ios::out | ios::app);`。這個 `|` 跟 09/24 的邏輯 `||`（兩根）不是同一個東西，這學期照抄就好。

## 讀到檔尾的正確寫法

```cpp
// ✅ 正確：把讀取動作本身當條件（前面求和那支用的 while (fin >> x) 就是這招）
string line;
while (getline(fin, line)) { /* 處理 line */ }

// ❌ 常見錯誤：用 eof() 當條件
while (!fin.eof()) {
    fin >> x;              // 讀到檔尾時這次讀取失敗，x 保持舊值
    cout << x << ' ';
}
```

❌ 那段拿上面的 `input.txt` 去跑，實際印出：

```text
3 7 11 20 20
```

原因：文字檔最後幾乎一定有一個換行。讀完 `20` 之後 `eof()` 還是 false，於是迴圈又跑一圈——這次 `fin >> x` 只吃到換行就碰到檔尾、讀取失敗，`x` 沒被改到，最後一筆就被印了兩次。**請一律用 `while (fin >> x)` 或 `while (getline(fin, line))`。**

> **混用 `>>` 和 `getline` 一樣會中招**：`fin >> id;` 之後直接 `getline(fin, line)` 會讀到空字串，因為 `>>` 把數字後面的換行留在管子裡。解法跟 11/12 的 `cin` 版一模一樣——中間插一行 `fin.ignore();`。

## 逐字元讀寫

下面這支把 `input.txt` 一個字元不漏地抄進 `output.txt`，順便把小寫轉大寫（`toupper` 要 `#include <cctype>`）：

```cpp
#include <fstream>
#include <cctype>
using namespace std;

int main() {
    ifstream fin("input.txt");
    ofstream fout("output.txt");
    if (!fin || !fout) return 1;

    char c;
    while (fin.get(c)) {              // get 連空白與換行都會讀進來
        c = static_cast<char>(toupper(static_cast<unsigned char>(c)));  // 11/12 教過的寫法
        fout.put(c);
    }
    return 0;
}
```

`input.txt` 是 `Hello, World!` 時，`output.txt` 就是 `HELLO, WORLD!`。

- `fin >> c` 會**跳過空白**；`fin.get(c)` **不會**。要原封不動處理檔案內容就用 `get` / `put`。
- `fin.ignore(n, ch)`：丟掉 n 個字元或丟到遇見 `ch` 為止——就是 11/12 的 `cin.ignore()`，前面說的換行殘留就靠它清掉。
- `fin.peek()`：偷看下一個字元但不取走（這學期用不到，知道有就好）。

## 格式化輸出（`<iomanip>`）

**只有 `setw(n)` 只影響下一個輸出，其他都會一直生效到你改掉為止。**

| 操作子 | 作用 |
| --- | --- |
| `setw(n)` | 設定欄寬 |
| `setfill(c)` | 補位字元 |
| `setprecision(n)` | 搭配 `fixed` ＝**小數點後 n 位**；沒有 `fixed` 時是**有效位數** n 位（10/22 那個 `1.2e+03` 的坑） |
| `fixed` | 固定小數點表示法 |
| `left` / `right` | 靠左 / 靠右對齊 |
| `showpoint` | 強制顯示小數點 |

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

    ifstream fin(filename);
    if (!fin) {
        cerr << "開不起來：" << filename << '\n';
        return 1;
    }

    string line;
    while (getline(fin, line)) cout << line << '\n';
    return 0;
}
```

> 課本寫的是舊寫法 `fin.open(filename.c_str());`（C++11 以前的 `ifstream` 只吃 C 風格字串），兩種在 Ubuntu 的 g++ 都能編。

## 隨機存取：`seekg` / `tellg`

串流內部有一個「現在讀到第幾個 byte」的位置指標：`fin.tellg()` 問位置，`fin.seekg(...)` 換位置。最常見的用途是量檔案大小：

```cpp
fin.seekg(0, ios::end);          // 跳到檔尾
long long size = fin.tellg();    // 此時位置＝檔案長度
fin.seekg(0, ios::beg);          // 記得跳回檔頭再開始讀
```

這學期看得懂就好，實驗課題目幾乎都是順序讀寫。

## `stringstream`：把字串當串流用

需要 `#include <sstream>`。命名規則跟檔案串流一模一樣：`istringstream`（從字串**讀**，像 `ifstream`）、`ostringstream`（往字串**寫**，像 `ofstream`）、`stringstream`（可讀可寫）。

什麼時候需要它？檔案每一列的欄位數如果不固定（有人考三科、有人考五科），`fin >> a >> b >> c` 沒辦法知道哪裡換行。做法是：**先用 `getline` 抓一整列，再把這個字串包成串流慢慢拆**。

```cpp
#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
using namespace std;

int main() {
    ifstream fin("grades.txt");
    if (!fin) { cerr << "cannot open grades.txt\n"; return 1; }

    string line;
    while (getline(fin, line)) {            // 先抓一整列
        istringstream iss(line);            // 再把這一列包成可以 >> 的串流
        string name;
        int score, sum = 0;
        iss >> name;
        while (iss >> score) sum += score;  // 這一列有幾科就加幾科
        cout << name << " total = " << sum << '\n';
    }
    return 0;
}
```

`grades.txt` 內容與輸出：

```text
grades.txt:
Yilin 95 88 100
Ann 70 80

輸出：
Yilin total = 283
Ann total = 150
```

欄位改用逗號之類的符號隔開時，`getline` 的**第三個參數**可以自訂分隔字元（這就是解析 CSV 的標準做法）：

```cpp
istringstream iss("Ann,90,85");
string field;
while (getline(iss, field, ',')) cout << field << '\n';   // 印出 Ann / 90 / 85 三行
```

反過來，`ostringstream` 可以把數字組成字串：

```cpp
ostringstream oss;
oss << "score_" << 95;
string s = oss.str();        // "score_95"
```

## 本週重點回顧

- 開檔後一定要 `if (!fin)`；開不起來通常不是程式錯，是檔案沒跟 `a.out` 放在同一個資料夾。
- 讀到檔尾用 `while (fin >> x)` 或 `while (getline(fin, line))`，**永遠不要用 `eof()`**；`>>` 之後要接 `getline` 記得先 `fin.ignore()`。
- 要保留空白與換行就用 `get` / `put`，`>>` 會把空白吃掉。
- 每列欄位數不固定 → `getline` 抓整列 ＋ `istringstream` 拆欄位；逗號分隔就用三參數 `getline`。

## 本週練習題

> 以下題目請先 `cd` 到你放程式的資料夾，再用 `nano input.txt` 建一個測試檔。

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

螢幕：
average = 85.33
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
Ann         270   90.00
Bob         225   75.00
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
             << (n > 0 ? static_cast<double>(sum) / n : 0.0) << '\n';
    }
    return 0;
}
```

拆欄位用的就是前面講的三參數 `getline`；`n > 0` 是在防「這一列一個分數都沒有」時除以 0。

</details>

**Q5. 詞頻統計**
讀入 `text.txt`，統計每個單字出現次數（忽略大小寫與標點），輸出出現次數最多的前三名。同票時輸出順序不拘；單字不足三個就有幾個印幾個。

```text
text.txt:
The cat, the CAT and a dog. The dog!
cat cat

輸出：
cat 4
the 3
dog 2
```

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
