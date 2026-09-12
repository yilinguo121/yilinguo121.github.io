---
title: 12/24｜期末上機考（範圍 Ch 1–12、Ch 14）
date: 2026-09-10
updated: 2026-09-12
permalink: 2026/09/09/nsysu-c-programming/1224-final-lab/
cover: /images/code-cover.jpg
categories: [程式設計]
tags: [C++, 中山大學, 自學指南]
toc: true
comments: true
hidden: true
---

[← 12/17｜期末筆試（範圍 Ch 1–12、Ch 14）](/2026/09/09/nsysu-c-programming/1217-final-written/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [附錄 →](/2026/09/09/nsysu-c-programming/appendix/)

這是**佔學期 40% 的關鍵一場**，通常直接決定學期成績。而且還有一個好消息：

> 期末上機成績較期中進步達 30 分以上者，學期總成績可獲加分 1~3 分。

也就是說，**期中考砸了也還有救**，這場好好考回來，分數與加分一起拿。

## 當天的流程

流程與期中完全一樣，[〈11/05 期中上機考〉的「上機考當天的流程」](/2026/09/09/nsysu-c-programming/1105-midterm/#上機考當天的流程)那五步請照著做：開場先搭 Makefile 架子 → 先掃過所有題目 → 每題寫完就 `make` 並跑範例 → 剩 15 分鐘停止寫新功能、`make clean && make` 確認乾淨重編 → 打包後找助教確認。

期末這場只有三點不同：

1. **題數與時間依課堂公告為準**，這份模擬考照六題 120 分鐘設計。時間是**總量**參考、不是順序（順序照上面第 2 步，從最有把握的開始）：Q5 約 10 分鐘，Q2、Q4 各 15 分鐘，Q1、Q3 各 20 分鐘，Q6 最久 25 分鐘，留 15 分鐘機動與重編打包。題數一多，「先掃過所有題目再決定順序」就比期中更重要——把會的先寫完，比卡在一題硬想划算得多。
2. **範圍涵蓋 Ch1–Ch12 與 Ch14**，題目很可能要你同時用到類別、指標與檔案 I/O。看到題目先想「這題要用哪幾樣」，再動手。
3. **可能出現多檔案題**（把類別拆成 `.h` / `.cpp`）。那種題目的 Makefile 規則跟平常的模組化版本不同，[〈11/26 分離編譯與命名空間〉](/2026/09/09/nsysu-c-programming/1126-separate-compilation/)的「多檔案的 Makefile」那一節有可以直接抄的寫法（注意 `.o` 規則一定要把 `.h` 列進相依），考前務必確認自己寫得出來。〈環境設置〉那份 `%: %.cpp` 的模組化版本在這種題目上沒用——它假設一個 `.cpp` 產生一個執行檔，Q6 沒有 `Q6.cpp` 可對應。

## 模擬上機考（建議計時 120 分鐘）

比照正式規則：只用文字編輯器、附 Makefile、零警告。單檔題的檔名是 `Q1.cpp` ~ `Q5.cpp`、執行檔同名；Q6 是多檔案題，檔案是 `Student.h`／`Student.cpp`／`main.cpp`，Makefile 要能編出名為 `Q6` 的執行檔。

**Q1. 分數類別與運算子重載**
寫 `class Fraction`，支援 `+`、`-`、`*`、`/`、`==`、`<`，以及 `<<`、`>>`。結果一律化為最簡分數，負號放分子。讀入兩個分數後，依序輸出四則運算結果、是否相等（`equal` / `not equal`）、以及大小比較（`a < b` / `a >= b`），共六行。

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

**Q5. 繼承：交通工具**
`Vehicle` 有名稱與輪子數，提供 `describe()`。派生 `Car`（多載客數）與 `Truck`（多載重噸數），各自覆寫 `describe()`。先讀一行 `車名 輪子數 載客數`（Car），再讀一行 `車名 輪子數 噸數`（Truck），各自印出描述。

```text
輸入：
Civic 4 5
Hino 6 3.5
輸出：
Civic: 4 wheels, 5 seats.
Hino: 6 wheels, 3.5 tons.
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
        if (den == 0) den = 1;      // 只在 b 是 0（除以零）時會走到；題目沒要求處理，這裡先把它壓成合法值避免當掉。真要嚴謹應該在 operator/ 裡檢查 o.num == 0 並回報錯誤
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
CXX      := g++
CXXFLAGS := -Wall -Wextra -std=c++17

.PHONY: all clean

all: Q6

Q6: main.o Student.o
	$(CXX) -o $@ $^

main.o: main.cpp Student.h
	$(CXX) $(CXXFLAGS) -c $<

Student.o: Student.cpp Student.h
	$(CXX) $(CXXFLAGS) -c $<

clean:
	rm -f *.o Q6
```

</details>

## 對完答案之後

六題全對、`make` 零警告、`make clean && make` 乾淨重編，這場就穩了。哪一題寫不出來，回去補對應的那一篇：

- Q1 → [11/12 運算子重載、friend 與 string](/2026/09/09/nsysu-c-programming/1112-operator-string/)：`+ - * /`、比較運算子、`<<` 與 `>>` 要寫成 friend
- Q2 → [11/19 指標、動態記憶體與 C 風格字串](/2026/09/09/nsysu-c-programming/1119-pointers/)：`new[]`／`delete[]` 與三法則
- Q3 → [12/03 檔案輸入輸出](/2026/09/09/nsysu-c-programming/1203-file-io/)：`ifstream`／`ofstream`、開檔檢查、`setw` 對齊
- Q4 → 同上（`istringstream` 拆單字）＋ [11/12](/2026/09/09/nsysu-c-programming/1112-operator-string/)：`string` 的操作
- Q5 → [12/10 繼承](/2026/09/09/nsysu-c-programming/1210-inheritance/)：`protected`、建構子怎麼串、覆寫成員函式
- Q6 → [11/26 分離編譯與命名空間](/2026/09/09/nsysu-c-programming/1126-separate-compilation/)：`.h`／`.cpp` 拆檔、include guard、多檔案 Makefile

---

[← 12/17｜期末筆試（範圍 Ch 1–12、Ch 14）](/2026/09/09/nsysu-c-programming/1217-final-written/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [附錄 →](/2026/09/09/nsysu-c-programming/appendix/)
