---
title: 12/10｜繼承（Ch 14）
date: 2026-09-10
cover: /images/code-cover.jpg
toc: true
__post: true
comments: true
---

> 本文是〈[中山大學 C 程式設計 & 實驗課完整自學指南](/2026/09/09/nsysu-c-programming/)〉系列的一篇，內容為原創說明與自寫範例，不轉載教科書或授課投影片。
>
> [← 12/03｜檔案輸入輸出（Ch 12）](/2026/09/09/nsysu-c-programming/1203-file-io/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [12/17｜期末筆試（範圍 Ch 1–12、Ch 14） →](/2026/09/09/nsysu-c-programming/1217-final-written/)

> 對應課本習題：Ch14: 4, 6, 8

**這次要會什麼**

```text
基底類別與衍生類別 → 建構子怎麼串 → protected → 覆寫成員函式
→ 建構與解構順序 → is-a vs has-a
```

## 繼承在做什麼

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

## 建構子怎麼串

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

## `protected` 是什麼

| 存取層級 | 類別自己 | 衍生類別 | 外部程式 |
| --- | :---: | :---: | :---: |
| `public` | ✓ | ✓ | ✓ |
| `protected` | ✓ | ✓ | ✗ |
| `private` | ✓ | ✗ | ✗ |

`protected` 就是為繼承而生的：**對外面是關的，對子孫是開的**。

> **注意**：即使是子類別，也**碰不到父類別的 `private` 成員**。想讓子類別能直接用，就宣告成 `protected`；或者保持 `private`，讓子類別透過 public 的 getter / setter 存取（封裝比較嚴謹的做法）。

## 三種繼承方式

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

## 覆寫（redefinition）父類別的函式

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

## 建構與解構的順序

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

## 哪些東西不會被繼承

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

## is-a 還是 has-a？

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

## 補充：為什麼還有 `virtual`

你可能會好奇：把 `Dog` 物件存進 `Animal*` 指標，呼叫 `speak()` 會叫到誰？

```cpp
Animal* p = new Dog();
p->speak();          // 印出 "some sound"（父類別的版本），不是 "woof"
```

這是因為一般成員函式是**編譯時**就決定要呼叫誰。要讓它依照「物件實際的型別」決定，需要 `virtual` 關鍵字與**多型（polymorphism）**——那是課本 Ch15 的內容，**不在這學期考試範圍**。知道有這回事即可，行有餘力可以自己先看。

## 本次練習題

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

[← 12/03｜檔案輸入輸出（Ch 12）](/2026/09/09/nsysu-c-programming/1203-file-io/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [12/17｜期末筆試（範圍 Ch 1–12、Ch 14） →](/2026/09/09/nsysu-c-programming/1217-final-written/)
