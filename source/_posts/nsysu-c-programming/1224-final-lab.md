---
title: 12/24｜期末上機考（範圍 Ch 1–12、Ch 14）
date: 2026-09-10
updated: 2026-09-12
permalink: 2026/09/09/nsysu-c-programming/1224-final-lab/
cover: /images/code-cover.jpg
categories: [程式設計]
tags: [C++, 中山大學, 自學指南]
description: 中山大學 C 程式設計自學指南的期末上機考準備（範圍 Ch 1–12、Ch 14）：當天流程，以及兩份建議計時 120 分鐘的模擬上機考與解答。
toc: true
comments: true
hidden: true
---

[← 12/17｜期末筆試（範圍 Ch 1–12、Ch 14）](/2026/09/09/nsysu-c-programming/1217-final-written/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [附錄 →](/2026/09/09/nsysu-c-programming/appendix/)

這是主課**佔學期 40% 的關鍵一場**，通常直接決定學期成績（實驗課的期末上機考是另一場、另外算分，題型見文末〈實驗課期末上機考模擬〉）。而且還有一個好消息：

> 期末上機比期中考進步 30 分以上，學期總成績可以加 1 到 3 分（依課程大綱）。

也就是說，**期中考砸了也還有救**，這場好好考回來，分數與加分一起拿。

## 當天的流程

流程與期中完全一樣，[〈11/05 期中上機考〉的「上機考當天的流程」](/2026/09/09/nsysu-c-programming/1105-midterm/#上機考當天的流程)那五步請照著做：開場先搭 Makefile 架子 → 先掃過所有題目 → 每題寫完就 `make` 並跑範例 → 剩 15 分鐘停止寫新功能、`make clean && make` 確認乾淨重編 → 打包後找助教確認。

期末這場只有三點不同：

1. **題數與時間依課堂公告為準**，這份模擬考照六題 120 分鐘設計。時間是**總量**參考、不是順序（順序照上面第 2 步，從最有把握的開始）：Q5 約 10 分鐘，Q2、Q4 各 15 分鐘，Q1、Q3 各 20 分鐘，Q6 最久 25 分鐘，留 15 分鐘機動與重編打包。題數一多，「先掃過所有題目再決定順序」就比期中更重要——把會的先寫完，比卡在一題硬想划算得多。
2. **範圍涵蓋 Ch1–Ch12 與 Ch14**，題目很可能要你同時用到類別、指標與檔案 I/O。看到題目先想「這題要用哪幾樣」，再動手。
3. **可能出現多檔案題**（把類別拆成 `.h` / `.cpp`）。那種題目的 Makefile 規則跟平常的模組化版本不同，[〈11/26 分離編譯與命名空間〉](/2026/09/09/nsysu-c-programming/1126-separate-compilation/)的「多檔案的 Makefile」那一節有可以直接抄的寫法（注意 `.o` 規則一定要把 `.h` 列進相依），考前務必確認自己寫得出來。〈環境設置〉那份 Makefile 是「一題兩行」，Q6 有兩個 `.cpp` 要先各自編成 `.o` 再一起連結，照〈11/26〉的寫法多寫幾條規則（[附錄](/2026/09/09/nsysu-c-programming/appendix/#整學期通用的-makefile)有可以直接抄的版本）。

## 模擬上機考（建議計時 120 分鐘）

比照正式規則：只用文字編輯器、附 Makefile、零警告。單檔題的檔名是 `Q1.cpp` ~ `Q5.cpp`、執行檔同名；Q6 是多檔案題，檔案是 `Student.h`／`Student.cpp`／`main.cpp`，Makefile 要能編出名為 `Q6` 的執行檔。

**Q1. 分數類別與運算子重載**
寫 `class Fraction`，支援 `+`、`-`、`*`、`/`、`==`、`<`，以及 `<<`、`>>`。結果一律化為最簡分數，負號放分子；分母為 0（包括除以 0）時印 `zero denominator` 並結束程式。輸入的分子分母都在 `int` 範圍內，中間乘積要用 `long long` 算。讀入兩個分數後，依序輸出四則運算結果、是否相等（`equal` / `not equal`）、以及大小比較（`a < b` / `a >= b`），共六行。

```text
輸入： 1 2 1 3
輸出：
5/6
1/6
1/6
3/2
not equal
a >= b
```

**Q2. 動態陣列類別**
寫 `class IntList`，內部用 `int*` 動態配置，支援 `add(int)`（容量不足自動加倍）、`remove(int value)`（刪除第一個符合的）、`get(int index)`、`size()`，並正確實作三法則。

輸入是一連串指令，`ADD x` 加入 `x`、`DEL x` 刪掉第一個等於 `x` 的元素、`END` 結束。`DEL` 找不到就印一行 `not found`。全部讀完後把串列內容印成一行，數字之間用一個空格隔開。

```text
輸入：
ADD 3
ADD 5
ADD 7
DEL 5
DEL 9
END
輸出：
not found
3 7
```

**Q3. 檔案統計**
讀取 `grades.txt`（每列：`姓名 國文 英文 數學`），輸出到 `report.txt`：每人的各科成績、總分與平均（兩位小數、欄位對齊），最後一列印全班各科平均。

```text
grades.txt：
Alice 90 85 77
Bob 60 72 88
Charlie 100 95 91

report.txt：
Name             CH     EN     MA   Total  Average
Alice            90     85     77     252    84.00
Bob              60     72     88     220    73.33
Charlie         100     95     91     286    95.33
SUBJECT-AVG   83.33  84.00  85.33
```

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

**Q5. 繼承：商品**
`Product` 有名稱與價格（整數），提供 `describe()`。派生 `Food`（多保存天數）與 `Gadget`（多保固月數），各自覆寫 `describe()`。先讀一行 `名稱 價格 保存天數`（Food），再讀一行 `名稱 價格 保固月數`（Gadget），各自印出描述。

```text
輸入：
Milk 45 7
Phone 19900 24
輸出：
Milk: $45, keep for 7 days.
Phone: $19900, 24-month warranty.
```

**Q6. 綜合：學生管理系統**
把 `class Student`（姓名、學號、三科成績）拆成 `Student.h` / `Student.cpp`，`main.cpp` 先讀 `n`，再讀 `n` 列 `姓名 學號 國文 英文 數學`，依平均由高到低排序後，每人印一列：姓名、學號、總分、平均（兩位小數、欄位對齊）。**必須用 Makefile 編譯多檔案專案，`make` 要能產生執行檔 `Q6`、`make clean` 要清乾淨。**

```text
輸入：
3
Alice 1001 90 85 77
Bob 1002 60 72 88
Cara 1003 100 95 91
輸出：
Cara            1003   286    95.33
Alice           1001   252    84.00
Bob             1002   220    73.33
```

<details>
<summary><b>Q1 參考解答</b></summary>

```cpp
#include <iostream>
#include <cstdlib>          // exit
using namespace std;

class Fraction {
private:
    long long num, den;      // 兩個 int 範圍的數相乘不會超過 long long，中間乘積才安全

    static long long gcd(long long a, long long b) {
        if (a < 0) a = -a;
        if (b < 0) b = -b;
        return (b == 0) ? a : gcd(b, a % b);
    }

    void normalize() {
        if (den == 0) {             // 讀入分母 0，或除以一個分子為 0 的分數，都會走到這裡
            cerr << "zero denominator\n";
            exit(1);                // 除以零不能靠改分母混過去，直接結束
        }
        if (den < 0) { num = -num; den = -den; }
        long long g = gcd(num, den);
        if (g != 0) { num /= g; den /= g; }
    }

public:
    Fraction(long long n = 0, long long d = 1) : num(n), den(d) { normalize(); }

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
    cout << (a == b ? "equal" : "not equal") << '\n';
    cout << (a < b ? "a < b" : "a >= b") << '\n';
    return 0;
}
```

</details>

<details>
<summary><b>Q2 參考解答</b></summary>

```cpp
#include <iostream>
#include <string>
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

    fout << left << setw(12) << "Name" << right
         << setw(7) << "CH" << setw(7) << "EN" << setw(7) << "MA"
         << setw(8) << "Total" << setw(9) << "Average" << '\n';
    fout << fixed << setprecision(2);

    long long sumCh = 0, sumEn = 0, sumMa = 0;
    for (const Student& x : v) {
        int total = x.ch + x.en + x.ma;
        fout << left << setw(12) << x.name << right
             << setw(7) << x.ch << setw(7) << x.en << setw(7) << x.ma
             << setw(8) << total << setw(9) << total / 3.0 << '\n';
        sumCh += x.ch; sumEn += x.en; sumMa += x.ma;
    }

    if (!v.empty()) {
        int n = static_cast<int>(v.size());
        fout << left << setw(12) << "SUBJECT-AVG" << right
             << setw(7) << static_cast<double>(sumCh) / n
             << setw(7) << static_cast<double>(sumEn) / n
             << setw(7) << static_cast<double>(sumMa) / n << '\n';
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

class Product {
protected:
    string name;
    int    price;

public:
    Product(const string& n, int p) : name(n), price(p) { }
    void describe() const {
        cout << name << ": $" << price << ".\n";
    }
};

class Food : public Product {
private:
    int days;
public:
    Food(const string& n, int p, int d) : Product(n, p), days(d) { }
    void describe() const {
        cout << name << ": $" << price << ", keep for " << days << " days.\n";
    }
};

class Gadget : public Product {
private:
    int warranty;
public:
    Gadget(const string& n, int p, int w) : Product(n, p), warranty(w) { }
    void describe() const {
        cout << name << ": $" << price << ", " << warranty << "-month warranty.\n";
    }
};

int main() {
    string n1, n2;
    int p1, d1, p2, w2;
    cin >> n1 >> p1 >> d1;
    cin >> n2 >> p2 >> w2;

    Food f(n1, p1, d1);
    Gadget g(n2, p2, w2);
    f.describe();
    g.describe();
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
#include <string>
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
CC = g++
FLAG = -std=c++11

all: Q6

Q6: main.o Student.o
	$(CC) $(FLAG) -o Q6 main.o Student.o

main.o: main.cpp Student.h
	$(CC) $(FLAG) -c main.cpp

Student.o: Student.cpp Student.h
	$(CC) $(FLAG) -c Student.cpp

clean:
	rm -f *.o Q6
```

</details>

## 實驗課期末上機考模擬（另一場考試）

實驗課的期末考是另一場（佔實驗課成績 40%，時間看助教公告），題型照每週練習題的形狀與我看過的幾份歷年考古題出（題目敘述、資料與解答是我重寫的，不是原題）：括號配對、翻牌順序、讀檔排序、字典統計、通訊錄管理。五題建議 120 分鐘，同樣要求 Makefile 與零警告；Q3、Q5 會讀寫檔案，測試檔請自己照範例建立。

**Q1. 括號配對**
反覆讀入只含 `()[]{}` 的字串直到輸入結束，判斷括號是否合法配對（同型別、順序正確）。**必須自己用鏈結串列實作堆疊**（11/19 Q7 那個），不能用 `vector` 代替。

```text
輸入：
()
()[]{}
(]
([)]
{[]}
((
輸出：
() -> valid
()[]{} -> valid
(] -> invalid
([)] -> invalid
{[]} -> valid
(( -> invalid
```

**Q2. 翻牌順序**
一疊牌上寫著互不相同的整數。翻牌規則：翻開最上面一張並拿走；若還有牌，把下一張移到牌堆**最底**；重複直到翻完。請輸出一種牌的初始排列，使翻出來的順序是**由小到大**。

```text
輸入：
6
9 4 6 1 8 2
輸出： 1 6 2 9 4 8
```

**Q3. 學生檔多鍵排序**
`students.txt` 每行「學號 姓名 國文 英文 數學」（姓名不含空白）：

```text
B113040007 Ivy 88 92 75
B113040002 Leo 70 65 98
B113040011 Ann 95 80 84
B113040005 Max 60 77 90
```

讀入 `struct` 陣列後，反覆讀入模式：1 依學號遞增、2 依姓名 A→Z、3／4／5 依國／英／數**遞減**，`0` 結束；每次用**氣泡排序**排好後印出全部。交換要透過接收 `Student*` 的函式完成。

```text
輸入： 1 2 5 0
輸出（節錄模式 5）：
sorted by mode 5:
B113040002 Leo    70  65  98
B113040005 Max    60  77  90
B113040011 Ann    95  80  84
B113040007 Ivy    88  92  75
```

**Q4. 單字字典**
讀入一段只含英文字母與空白的文字（讀到輸入結束），大小寫視為同一個字，統計每個不同單字出現幾次，依字母順序印出（全部小寫），最後印不同單字的數量。不能用 `map`。

```text
輸入： Tea tea COFFEE milk Milk tea juice
輸出：
coffee: 1
juice: 1
milk: 2
tea: 3
unique words: 4
```

**Q5. 通訊錄管理**
`contacts.txt` 每行「編號 姓名 年齡 電話」。反覆讀入指令：`1 編號 姓名 年齡 電話` 新增（編號重複印 `id exists`）、`2 編號` 刪除、`3 姓名` 搜尋並印出符合者、`4 編號 姓名 年齡 電話` 修改、`5` 列出全部、`0` 結束；找不到就印 `Not found`。**每個動作都要先從檔案讀、改完寫回檔案**，程式重跑後資料還在。

```text
contacts.txt（初始）：
1 Amy 20 0912345678
2 Ben 22 0987654321

輸入：
5
1 3 Cleo 19 0955000111
3 Ben
4 2 Ben 23 0987654321
2 1
2 9
5
0
輸出：
1 Amy 20 0912345678
2 Ben 22 0987654321
added
2 Ben 22 0987654321
updated
deleted
Not found
2 Ben 23 0987654321
3 Cleo 19 0955000111
```

<details>
<summary><b>Q1 參考解答</b></summary>

```cpp
#include <iostream>
#include <string>
using namespace std;

struct Node { char value; Node* next; };

class Stack {
public:
    Stack() : top(nullptr) {}
    ~Stack() { while (!empty()) pop(); }
    void push(char c) {
        Node* n = new Node;
        n->value = c;
        n->next = top;
        top = n;
    }
    char pop() {                          // 呼叫前要先確認不是空的
        Node* old = top;
        char c = old->value;
        top = old->next;
        delete old;
        return c;
    }
    bool empty() const { return top == nullptr; }
private:
    Node* top;
};

bool balanced(const string& s) {
    Stack st;
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') {
            st.push(c);
        } else {
            if (st.empty()) return false;              // 沒有東西可以配
            char open = st.pop();
            if ((c == ')' && open != '(') ||
                (c == ']' && open != '[') ||
                (c == '}' && open != '{')) return false;
        }
    }
    return st.empty();                                 // 有剩下沒關的也不行
}

int main() {
    string s;
    while (cin >> s)
        cout << s << " -> " << (balanced(s) ? "valid" : "invalid") << '\n';
    return 0;
}
```

**考點與常見扣分**：三種不合法要分開想——右括號來了但堆疊是空的、型別對不上、字串掃完堆疊還有東西。`pop` 之前一定先 `empty()`，否則對 `nullptr` 解參考直接 Segmentation fault。堆疊類別跟 11/19 Q7 幾乎相同，只是 `pop` 改成回傳彈出的字元。

</details>

<details>
<summary><b>Q2 參考解答</b></summary>

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> deck(n);
    for (int i = 0; i < n; i++) cin >> deck[i];

    // 由小到大排序（選擇排序）：翻出來的順序就是這個
    for (int i = 0; i + 1 < n; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++)
            if (deck[j] < deck[minIdx]) minIdx = j;
        int t = deck[i]; deck[i] = deck[minIdx]; deck[minIdx] = t;
    }

    // 用「位置」來模擬翻牌：pos 是還沒被填的位置，照題目規則輪流「拿走一個、把下一個移到最後」
    vector<int> pos;
    for (int i = 0; i < n; i++) pos.push_back(i);
    vector<int> result(n);
    for (int card : deck) {
        result[pos[0]] = card;                 // 這張牌要放在「下一個被翻到」的位置
        pos.erase(pos.begin());
        if (!pos.empty()) {                    // 下一個位置移到最後（對應「把下一張放到牌堆底」）
            pos.push_back(pos[0]);
            pos.erase(pos.begin());
        }
    }
    for (int i = 0; i < n; i++) cout << result[i] << (i + 1 < n ? " " : "\n");
    return 0;
}
```

**考點與常見扣分**：這題直接想「初始排列」很難，換個角度：翻牌的規則其實是在決定「第幾張會在什麼**位置**被翻到」，跟牌面無關。所以用一個位置的清單 `pos` 模擬翻牌（拿走第一個、把下一個移到最後），依序把最小的牌填進被翻到的位置就好。`erase(begin())` 加 `push_back` 就是「把第一個移到最後」。

</details>

<details>
<summary><b>Q3 參考解答</b></summary>

```cpp
#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <iomanip>
using namespace std;

struct Student { string id, name; int chinese, english, math; };

void swapStudent(Student* a, Student* b) {      // 題目要求：用指標交換
    Student t = *a; *a = *b; *b = t;
}

// mode 1 學號遞增、2 姓名 A→Z、3/4/5 國英數遞減
bool outOfOrder(const Student& x, const Student& y, int mode) {
    switch (mode) {
        case 1: return x.id > y.id;
        case 2: return x.name > y.name;
        case 3: return x.chinese < y.chinese;
        case 4: return x.english < y.english;
        default: return x.math < y.math;
    }
}

void bubbleSort(vector<Student>& v, int mode) {
    for (size_t pass = 0; pass + 1 < v.size(); pass++)
        for (size_t i = 0; i + 1 < v.size() - pass; i++)
            if (outOfOrder(v[i], v[i + 1], mode)) swapStudent(&v[i], &v[i + 1]);
}

void printAll(const vector<Student>& v) {
    for (const Student& s : v)
        cout << s.id << ' ' << left << setw(5) << s.name << right
             << setw(4) << s.chinese << setw(4) << s.english << setw(4) << s.math << '\n';
}

int main() {
    ifstream fin("students.txt");
    if (!fin) { cout << "cannot open students.txt\n"; return 1; }
    vector<Student> v;
    Student s;
    while (fin >> s.id >> s.name >> s.chinese >> s.english >> s.math) v.push_back(s);

    int mode;
    while (cin >> mode && mode != 0) {
        if (mode < 1 || mode > 5) { cout << "unknown mode\n"; continue; }
        bubbleSort(v, mode);
        cout << "sorted by mode " << mode << ":\n";
        printAll(v);
    }
    return 0;
}
```

完整輸出：

```text
sorted by mode 1:
B113040002 Leo    70  65  98
B113040005 Max    60  77  90
B113040007 Ivy    88  92  75
B113040011 Ann    95  80  84
sorted by mode 2:
B113040011 Ann    95  80  84
B113040007 Ivy    88  92  75
B113040002 Leo    70  65  98
B113040005 Max    60  77  90
sorted by mode 5:
B113040002 Leo    70  65  98
B113040005 Max    60  77  90
B113040011 Ann    95  80  84
B113040007 Ivy    88  92  75
```

**考點與常見扣分**：五種排序共用同一個氣泡排序，只把「這兩個順序有沒有錯」抽成 `outOfOrder(x, y, mode)`，不要複製五份排序程式。`swapStudent(&v[i], &v[i+1])` 取的是 `vector` 元素的位址，函式裡用 `*a`、`*b` 整包交換。字串的 `>` 直接就是字典序比較。

</details>

<details>
<summary><b>Q4 參考解答</b></summary>

```cpp
#include <iostream>
#include <string>
#include <vector>
#include <cctype>
using namespace std;

struct Entry { string word; int count; };

int main() {
    vector<Entry> dict;
    string w;
    while (cin >> w) {
        for (char& c : w)                            // 不分大小寫：全部轉小寫
            c = static_cast<char>(tolower(static_cast<unsigned char>(c)));
        bool found = false;
        for (Entry& e : dict)
            if (e.word == w) { e.count++; found = true; break; }
        if (!found) {
            Entry e = { w, 1 };
            dict.push_back(e);
        }
    }
    // 依字母順序排（string 的 < 就是字典序）
    for (size_t i = 0; i + 1 < dict.size(); i++)
        for (size_t j = i + 1; j < dict.size(); j++)
            if (dict[j].word < dict[i].word) { Entry t = dict[i]; dict[i] = dict[j]; dict[j] = t; }
    for (const Entry& e : dict) cout << e.word << ": " << e.count << '\n';
    cout << "unique words: " << dict.size() << '\n';
    return 0;
}
```

**考點與常見扣分**：「不同單字」的表用 `vector<Entry>` 自己維護：每讀一個字先線性搜尋有沒有出現過，有就 `count++`、沒有就 `push_back`。`for (char& c : w)` 的 `&` 讓迴圈能改到原字串裡的字元，少了 `&` 轉小寫會轉在複本上。排序的比較條件是 `dict[j].word < dict[i].word`，`string` 的 `<` 就是字母順序。

</details>

<details>
<summary><b>Q5 參考解答</b></summary>

```cpp
#include <iostream>
#include <fstream>
#include <string>
#include <vector>
using namespace std;

struct Contact { int id; string name; int age; string phone; };
const string FILE_NAME = "contacts.txt";

vector<Contact> load() {
    vector<Contact> v;
    ifstream fin(FILE_NAME);                     // 檔案不存在就當成空名單
    Contact c;
    while (fin >> c.id >> c.name >> c.age >> c.phone) v.push_back(c);
    return v;
}

void save(const vector<Contact>& v) {
    ofstream fout(FILE_NAME);                    // 整個檔案重寫一遍
    for (const Contact& c : v) fout << c.id << ' ' << c.name << ' ' << c.age << ' ' << c.phone << '\n';
}

int indexOf(const vector<Contact>& v, int id) {  // 找不到回傳 -1
    for (size_t i = 0; i < v.size(); i++) if (v[i].id == id) return i;
    return -1;
}

void print(const Contact& c) {
    cout << c.id << ' ' << c.name << ' ' << c.age << ' ' << c.phone << '\n';
}

int main() {
    int cmd;
    while (cin >> cmd && cmd != 0) {
        vector<Contact> v = load();              // 每個動作都「讀檔 → 改 → 寫回」
        if (cmd == 1) {                          // 新增
            Contact c;
            cin >> c.id >> c.name >> c.age >> c.phone;
            if (indexOf(v, c.id) != -1) { cout << "id exists\n"; continue; }
            v.push_back(c);
            save(v);
            cout << "added\n";
        } else if (cmd == 2) {                   // 刪除
            int id; cin >> id;
            int i = indexOf(v, id);
            if (i == -1) { cout << "Not found\n"; continue; }
            v.erase(v.begin() + i);
            save(v);
            cout << "deleted\n";
        } else if (cmd == 3) {                   // 依姓名搜尋
            string name; cin >> name;
            bool any = false;
            for (const Contact& c : v)
                if (c.name == name) { print(c); any = true; }
            if (!any) cout << "Not found\n";
        } else if (cmd == 4) {                   // 修改
            int id; cin >> id;
            int i = indexOf(v, id);
            if (i == -1) { cout << "Not found\n"; continue; }
            cin >> v[i].name >> v[i].age >> v[i].phone;
            save(v);
            cout << "updated\n";
        } else if (cmd == 5) {                   // 列出全部
            for (const Contact& c : v) print(c);
        }
    }
    return 0;
}
```

**考點與常見扣分**：把「讀檔」「寫檔」「找編號」各抽成函式後，五個指令每個只剩三四行。寫回檔案時用 `ofstream` 預設模式**整個重寫**（不是 `ios::app`），才不會愈寫愈長。`load()` 對不存在的檔案不會報錯、只是讀不到東西，所以第一次執行也能用。這個題型出自我看過的一份主課期末考考古題（敘述與資料是重寫的），也是這門課「struct + vector + 檔案 + 選單」四樣東西的總結。

</details>

## 對完答案之後

六題全對、`make` 零警告、`make clean && make` 乾淨重編，這場就穩了。哪一題寫不出來，回去補對應的那一篇：

- Q1 → [11/12 運算子重載、friend 與 string](/2026/09/09/nsysu-c-programming/1112-operator-string/)：`+ - * /`、比較運算子、`<<` 與 `>>` 只能是非成員函式（用 friend 直接讀 private，或透過 getter 都可以）
- Q2 → [11/19 指標、動態記憶體與 C 風格字串](/2026/09/09/nsysu-c-programming/1119-pointers/)：`new[]`／`delete[]` 與三法則
- Q3 → [12/03 檔案輸入輸出](/2026/09/09/nsysu-c-programming/1203-file-io/)：`ifstream`／`ofstream`、開檔檢查、`setw` 對齊
- Q4 → 同上（`istringstream` 拆單字）＋ [11/12](/2026/09/09/nsysu-c-programming/1112-operator-string/)：`string` 的操作
- Q5 → [12/10 繼承](/2026/09/09/nsysu-c-programming/1210-inheritance/)：`protected`、建構子怎麼串、覆寫成員函式
- Q6 → [11/26 分離編譯與命名空間](/2026/09/09/nsysu-c-programming/1126-separate-compilation/)：`.h`／`.cpp` 拆檔、include guard、多檔案 Makefile

---

[← 12/17｜期末筆試（範圍 Ch 1–12、Ch 14）](/2026/09/09/nsysu-c-programming/1217-final-written/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [附錄 →](/2026/09/09/nsysu-c-programming/appendix/)
