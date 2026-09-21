---
title: 12/10｜繼承（Ch 14）
date: 2026-09-10
updated: 2026-09-12
permalink: 2026/09/09/nsysu-c-programming/1210-inheritance/
cover: /images/code-cover.jpg
categories: [程式設計]
tags: [C++, 中山大學, 自學指南]
description: 中山大學 C 程式設計自學指南 Ch 14：繼承、建構子怎麼串、protected、覆寫父類別函式、建構與解構順序、is-a 與 has-a、三種繼承方式與 virtual，附練習題。
toc: true
comments: true
hidden: true
---

[← 12/03｜檔案輸入輸出（Ch 12）](/2026/09/09/nsysu-c-programming/1203-file-io/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [12/17｜期末筆試（範圍 Ch 1–12、Ch 14） →](/2026/09/09/nsysu-c-programming/1217-final-written/)

> 對應課本習題：Ch14: 4, 6, 8

**這週要會什麼**

```text
基底類別與衍生類別 → 建構子怎麼串 → protected → 覆寫成員函式
→ 建構與解構順序 → 哪些不會被繼承 → is-a vs has-a
→（知道就好）三種繼承方式、多重繼承、virtual 預告
```

## 繼承在做什麼

**白話說**：繼承就是「**新類別 = 舊類別 + 額外的東西**」。

假設你要寫 `Dog`、`Cat`、`Bird`，牠們都有名字、都會吃東西。與其把 `name`、`eat()` 抄三遍，不如先寫一個 `Animal`，讓三者去**繼承**它。

```cpp
#include <iostream>
#include <string>
using namespace std;

class Animal {                         // 基底類別（base class，父類別）
protected:                             // 新面孔：外面用不到，但子類別用得到（後面詳談）
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

輸出：

```text
Kuro is eating.
Kuro says woof!
```

`Dog` 什麼都沒寫就有了 `eat()`——**父類別的成員全部都跟著進到 `Dog` 物件裡**，其中 `public` 與 `protected` 的部分 `Dog` 可以直接拿來用（`private` 的也在，只是碰不到，後面詳談）。

### 心裡先有這張圖

```text
Dog d("Kuro") 這個物件的組成（資料存在物件裡，成員函式是整個類別共用一份，不佔物件空間）：
┌─────────────────────┐
│ Animal 的部分       │ ← name = "Kuro"、eat()
├─────────────────────┤
│ Dog 自己新增的部分  │ ← bark()
└─────────────────────┘
```

**Dog 物件裡面真的包著一個完整的 Animal。** 後面的建構順序、拷貝建構子、`Animal::speak()` 全都是從這張圖推出來的，不用死背。

### 衍生類別物件就是一種基底類別物件

既然 `Dog` 裡面包著一個 `Animal`，凡是需要 `Animal` 的地方就都可以給一個 `Dog`：

```cpp
Dog d("Kuro");
Animal* p = &d;      // 合法：Dog 是一種 Animal
Animal& r = d;       // 參考也一樣；void f(const Animal&) 傳 Dog 進去也合法
p->eat();            // Kuro is eating.
```

反過來不行——`Animal` 不見得是 `Dog`，所以不能拿 `Animal*` 去指派給 `Dog*`。這條規則後面會用到兩次（拷貝建構子、文末的 `virtual` 補充），先記著。

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

`protected` 就是為繼承而生的：**對外面是關的，對子孫是開的**。

| 存取層級 | 類別自己 | 衍生類別 | 外部程式 |
| --- | :---: | :---: | :---: |
| `public` | ✓ | ✓ | ✓ |
| `protected` | ✓ | ✓ | ✗ |
| `private` | ✓ | ✗ | ✗ |

> **注意**：即使是子類別，也**碰不到父類別的 `private` 成員**。想讓子類別能直接用，就宣告成 `protected`；或者保持 `private`，讓子類別透過 public 的 getter / setter 存取（封裝比較嚴謹的做法）。

## 覆寫（redefinition）父類別的函式

> **用詞界定**：這裡的「覆寫」是 **redefinition（重新定義）**，只在你用 `Dog` 型別呼叫時有效。課本 Ch15 另有一個搭配 `virtual` 的 **override（覆蓋）**，那個連用 `Animal*` 指標呼叫都會叫到子類別版本——兩件事不一樣，本節只講前者，差別見文末補充。

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

輸出：

```text
woof
some sound
```

`d.Animal::speak()` 要一口氣讀成「對物件 `d`，呼叫 **Animal 那一版的** `speak`」——`Animal::` 是在指定用哪個類別的版本，不是在取 `d` 的成員。在成員函式**內部**要指定父類別版本時不必寫物件，直接寫 `Animal::speak();`（Q4 的 `Stack::push(x)` 就是這種用法）。

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
> class A {
> public:
>     void f(int)    { cout << "A::f(int)\n"; }
>     void f(double) { cout << "A::f(double)\n"; }
> };
>
> class B : public A {
> public:
>     void f(int) { cout << "B::f(int)\n"; }
> };
>
> B b;
> b.f(3.14);      // 印出 B::f(int)——不是 A::f(double)！
> ```
>
> 想把父類別的版本找回來，在 `B` 的 **class 內部**加一行 `using A::f;`（放在你要的存取標籤底下，它就有那個層級）：
>
> ```cpp
> class B : public A {
> public:
>     using A::f;                 // 把父類別所有的 f 重新帶進 B
>     void f(int) { cout << "B::f(int)\n"; }
> };
>
> b.f(3.14);      // 現在印出 A::f(double)
> ```
>
> 這跟 11/26 的 `using std::cout;` 是同一個「using 宣告」家族，只是拉進來的是父類別的成員而不是命名空間成員。

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

為什麼？因為 `Derived` 的建構子裡隨時可能用到 `Base` 的成員（像最前面的 `bark()` 就用了 `name`），所以 `Base` 那塊一定要先準備好；解構時反過來，先拆掉「可能還在用 `Base`」的那一層，`Base` 才敢收工。

那 10/22 學過的「成員物件先建構」插在哪裡？完整順序是 **父類別建構子 → 自己的成員物件（依宣告順序）→ 自己建構子的大括號**，解構完全相反：

```cpp
#include <iostream>
using namespace std;

class Base {
public:
    Base()  { cout << "Base ctor\n"; }
    ~Base() { cout << "Base dtor\n"; }
};

class Engine {
public:
    Engine()  { cout << "Engine ctor\n"; }
    ~Engine() { cout << "Engine dtor\n"; }
};

class Derived : public Base {
private:
    Engine e;                          // 自己的成員物件
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
Engine ctor
Derived ctor
Derived dtor
Engine dtor
Base dtor
```

**這種「答輸出」的題目是筆試常客**，記住順序就送分。

## 哪些東西不會被繼承

- 建構子與解構子（但會被自動呼叫，順序見上一節）
- 指派運算子 `operator=`
- `friend` 關係——**父類別的朋友不會自動變成子類別的朋友**。`Base` 裡宣告了 `friend void print(const Base&);`，`print` 依然看不到 `Derived` 新增的 private 成員（但看得到 `Derived` 裡面屬於 `Base` 的那塊）。

這三條裡最會出事的是 `operator=`：子類別自己寫的那個，**不會自動幫你處理父類別的部分**。所以子類別若有動態配置的資源，除了遵守三法則（解構子、拷貝建構子、指派運算子），還要把父類別那塊交還給父類別：

```cpp
class Derived : public Base {
public:
    // other 是 Derived，但「Derived 是一種 Base」，所以可以直接交給父類別的拷貝建構子
    Derived(const Derived& other) : Base(other) {
        /* 再複製自己新增的成員 */
    }

    Derived& operator=(const Derived& other) {
        if (this == &other) return *this;
        Base::operator=(other);      // 關鍵：先讓父類別指派自己的部分
        /* 再指派自己新增的成員 */
        return *this;
    }
};
```

## is-a 還是 has-a？

這是設計時最重要的判斷：

| 關係 | 判斷句 | 做法 |
| --- | --- | --- |
| **is-a** | 「Dog **是一種** Animal」 | 繼承 |
| **has-a** | 「Car **有一個** Engine」 | 組合（把對方當成員變數） |

```cpp
// has-a：組合
class Engine {
public:
    void start() { cout << "引擎發動\n"; }
};

class Car {
private:
    Engine engine;                      // Car 有一個 Engine
public:
    void start() { engine.start(); }    // 把工作轉給成員物件
};
```

**大多數情況組合比繼承好用**：繼承會讓兩個類別綁得很死（父類別一改，所有子類別都受影響），組合只是「用到對方」，關係鬆得多。**先問自己是不是真的 is-a，不是就別用繼承**。

## 三種繼承方式（背表格就好）

`class B : public A` 之外，還有 `class C : protected A` 與 `class D : private A`，**實務上幾乎不用**，只在筆試的表格題出現。繼承後父類別成員的存取層級會變成：

| 父類別成員 | `public` 繼承後 | `protected` 繼承後 | `private` 繼承後 |
| --- | --- | --- | --- |
| `public` | `public` | `protected` | `private` |
| `protected` | `protected` | `protected` | `private` |
| `private` | 存取不到 | 存取不到 | 存取不到 |

用 `public` 的理由很簡單：只有它表達得出「Dog 是一種 Animal」。

> **別漏掉 `public` 這個字**：繼承方式不寫的話，`class` 預設是 **`private` 繼承**（`struct` 才預設 `public`）。所以 `class D : A { };` 寫完，在 `main` 裡呼叫 `d.f()` 會得到 `error: 'A' is not an accessible base of 'D'`——訊息裡完全沒有「繼承」兩個字，很難聯想到只是少打了 `public`。

## 多重繼承（知道就好）

C++ 允許一個類別同時繼承**多個**父類別，這叫**多重繼承**：

```cpp
#include <iostream>
using namespace std;

class Swimmer {
public:
    void swim() const { cout << "游泳\n"; }
};

class Runner {
public:
    void run() const { cout << "跑步\n"; }
};

class Triathlete : public Swimmer, public Runner {   // 同時繼承兩個
public:
    void compete() const { swim(); run(); }
};

int main() {
    Triathlete t;
    t.compete();
    return 0;
}
```

輸出：

```text
游泳
跑步
```

語法只是把父類別用逗號列出來。但多重繼承有個有名的麻煩：如果兩個父類別又各自繼承自同一個祖父類別，孫子就會拿到**兩份**祖父的資料（俗稱**菱形繼承問題**），要用 `virtual` 繼承才解得掉——超出這學期範圍，實務上也多半改用組合就沒事了。

## 補充：為什麼還有 `virtual`

前面說過「`Animal*` 可以指向一個 `Dog`」。那如果 `Dog` 覆寫了 `speak()`，透過 `Animal*` 呼叫會叫到誰？

```cpp
class Animal { public: void speak() const { cout << "some sound\n"; } };
class Dog : public Animal { public: void speak() const { cout << "woof\n"; } };

Dog d;
Animal* p = &d;     // 用 Animal 指標指向一個 Dog
p->speak();         // 印出 some sound，不是 woof！
```

這是因為一般成員函式在**編譯時**就照「指標的型別」決定要呼叫誰。要讓它依照「物件實際的型別」決定，需要 `virtual` 關鍵字與**多型（polymorphism）**——那是課本 Ch15 的內容，**不在這學期考試範圍**。知道有這回事即可，行有餘力可以自己先看。

（這裡刻意用 `&d` 而不是 `new Dog`：父類別沒有 `virtual` 解構子時，拿 `Animal*` 去 `delete` 一個 `Dog` 會出事，那同樣要等 Ch15 才有解。）

## 本週重點回顧

- **子類別物件裡包著一個完整的父類別物件**，所以 `Animal* p = &dog;` 合法，建構解構順序也是從這裡推出來的。
- **建構先父後子（父類別 → 成員物件 → 自己的大括號），解構完全相反**——筆試送分題；子類別建構子若沒用初始化列表指定，就會去找父類別的預設建構子，找不到就編譯錯誤。
- 子類別**碰不到父類別的 `private`**；想讓子孫用得到就宣告成 `protected`。
- 子類別一旦定義同名函式，父類別的**所有**同名重載版本都會被遮蔽（`using A::f;` 可以救回來）。
- 建構子、解構子、`operator=`、`friend` **不會被繼承**；子類別的 `operator=` 要自己呼叫 `Base::operator=(other)`。
- 先問「B **是一種** A 嗎」，不是就用組合。

## 本週練習題

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

注意初始化列表的順序：`Shape("Circle")` 寫在最前面、後面才是自己的成員。**真正的執行順序永遠是「父類別 → 成員依宣告順序」，跟你寫的順序無關**；但寫反了 `-Wall` 會給 10/22 那個 `[-Wreorder]` 警告，上機考照樣扣分，所以照順序寫就對了。

還有：這裡刻意用三個獨立變數，而**不是** `Shape* shapes[3]`。因為 `area()` 沒有 `virtual`，用 `Shape*` 呼叫一律叫到 `Shape::area()`，三行都會印 `0.00`——就是〈補充：為什麼還有 `virtual`〉講的那件事，要印出真的面積得等 Ch15。

</details>

**Q2. Employee 家族**
`Employee` 有姓名與月薪，提供 `monthlyPay()`。派生 `Manager`（多一筆固定加給）與 `Engineer`（多加班時數 × 時薪）。輸入固定兩行：**第一行是 Manager**（姓名 月薪 加給），**第二行是 Engineer**（姓名 月薪 加班時數 時薪）。讀入後印出每個人的實領金額。

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

這題沒用 `setprecision`——`cout` 印 `double` 預設給 **6 位有效數字**，`60000` 在這個範圍內又剛好是整數，所以印出來就是 `60000` 而不是 `60000.00`。但要小心：超過 6 位就會轉成科學記號，實測 `cout << 1000000.0;` 印的是 `1e+06`。月薪可能破百萬時，加一行 `cout << fixed << setprecision(0);` 才保險（實測會印 `1000000`）。另外 `Manager` 與 `Engineer` 的 `monthlyPay()` 是各自**重新定義**的（算法不同）；透過 `Manager` 物件也叫得到 `Employee` 那一版，只是要寫全名 `m.Employee::monthlyPay()`（正文 `d.Animal::speak()` 那招）；不指定的話 `m.monthlyPay()` 一律是 `Manager` 自己的版本。

</details>

**Q3. 建構解構順序觀察**
寫一組三層繼承（`A` → `B` → `C`），每個建構子與解構子都印一行訊息；再讓 `B` 多一個同樣會印訊息的成員物件 `Logger`。**先在紙上預測輸出順序**，再執行對答案。

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
using namespace std;

class Logger {
public:
    Logger()  { cout << "Logger ctor\n"; }
    ~Logger() { cout << "Logger dtor\n"; }
};

class A {
public:
    A()  { cout << "A ctor\n"; }
    ~A() { cout << "A dtor\n"; }
};

class B : public A {
private:
    Logger log;                   // B 自己的成員物件
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
Logger ctor
B ctor
C ctor
C dtor
B dtor
Logger dtor
A dtor
--- done ---
```

**解釋**：建構時先把繼承鏈最上層蓋好才能蓋下一層；輪到 `B` 時，又是先把它的成員物件 `log` 建好，才進 `B` 建構子的大括號。解構完全相反：先拆最下層，成員物件也是等外層的大括號跑完才拆。

</details>

**Q4. 帶動態記憶體的繼承**
堆疊（stack）是「後進先出」的容器：`push` 把值放到最上面、`pop` 取走最上面那個——先放 10 再放 20，取出來的順序是 20、10；空的時候不能 `pop`，滿的時候不能 `push`。[11/19 Q7](/2026/09/09/nsysu-c-programming/1119-pointers/#本週練習題) 用鏈結串列做過一次，這題改用**動態陣列**、容量固定。寫 `class Stack`（用動態陣列實作，建構子可指定容量，有解構子），再派生 `class TracedStack`，多記錄「**成功** push 進去幾筆」（堆疊滿了被擋下來的不算）。請用容量 3 的 `TracedStack` 連續 push 四個值、印出成功筆數，再把值全部 pop 出來，順便驗證物件消滅時記憶體有正確釋放。

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
        out = data[--n];       // 先把 n 減 1，再用新的 n 當索引；等同 n = n - 1; out = data[n];
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

輸出：

```text
push failed? yes
count = 3
3 2 1 
TracedStack dtor
Stack dtor
```

最後兩行再次印證解構由子到父。注意 `TracedStack` 根本沒寫 `delete[]`，記憶體卻正確釋放了——因為 `~Stack()` 會被自動接著呼叫，這就是「解構子不會被繼承、但會被自動串接」的意思。

`TracedStack::push` 裡呼叫 `Stack::push(x)` 是**明確指定父類別版本**；不加 `Stack::` 就會變成呼叫自己造成無窮遞迴。

</details>

**實驗課題型加練**
以下照實驗課歷年課堂練習的題型改寫。繼承這週實驗課會把 12/03 的讀檔和這週的類別階層接起來（課程系統），再出一題「遊戲角色等級」要你**算出來、不能寫死**。

**Q5. 課程系統**
寫 `class Course`，資料成員 `courseID`、`courseName`、`credits` 都是 **`protected`**，有建構子與 `printInfo()`。再寫兩個衍生類別：`RequiredCourse` 多一個 private 的 `bool isGeneral`（是否通識），`ElectiveCourse` 多一個 private 的 `int maxStudents`（人數上限），各自重新定義 `printInfo()`。從 `courses.txt` 讀入資料並全部印出，格式是「類型;代號;課名;學分;額外欄位」，類型 `R` 是必修（額外欄位 1 = 通識）、`E` 是選修（額外欄位是人數上限）：

```text
R;CSE123;C Programming;3;0
E;GE201;Introduction to Art;2;60
R;MATH101;Calculus I;4;0
E;CSE330;Game Design;3;40
```

```text
輸出：
[Required] CSE123 C Programming (3 credits)
[Elective] GE201 Introduction to Art (2 credits), max 60 students
[Required] MATH101 Calculus I (4 credits)
[Elective] CSE330 Game Design (3 credits), max 40 students
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <fstream>
#include <string>
using namespace std;

class Course {
public:
    Course(const string& i, const string& n, int c) : courseID(i), courseName(n), credits(c) {}
    void printInfo() const {
        cout << courseID << ' ' << courseName << " (" << credits << " credits)";
    }
protected:                        // 子類別要用，所以不是 private
    string courseID, courseName;
    int credits;
};

class RequiredCourse : public Course {
public:
    RequiredCourse(const string& i, const string& n, int c, bool g)
        : Course(i, n, c), isGeneral(g) {}
    void printInfo() const {
        cout << "[Required] ";
        Course::printInfo();                       // 先印共同的部分
        cout << (isGeneral ? ", general education" : "") << '\n';
    }
private:
    bool isGeneral;
};

class ElectiveCourse : public Course {
public:
    ElectiveCourse(const string& i, const string& n, int c, int m)
        : Course(i, n, c), maxStudents(m) {}
    void printInfo() const {
        cout << "[Elective] ";
        Course::printInfo();
        cout << ", max " << maxStudents << " students\n";
    }
private:
    int maxStudents;
};

int main() {
    ifstream fin("courses.txt");
    if (!fin) { cout << "cannot open courses.txt\n"; return 1; }
    string type, id, name, creditText, extraText;
    while (getline(fin, type, ';') && getline(fin, id, ';') && getline(fin, name, ';')
           && getline(fin, creditText, ';') && getline(fin, extraText)) {
        int credits = stoi(creditText), extra = stoi(extraText);
        if (type == "R") {
            RequiredCourse c(id, name, credits, extra == 1);
            c.printInfo();
        } else {
            ElectiveCourse c(id, name, credits, extra);
            c.printInfo();
        }
    }
    return 0;
}
```

衍生類別的 `printInfo` 先呼叫 `Course::printInfo()` 印共同的部分，再補自己的欄位——不要把基底類別的輸出重抄一遍。資料成員用 `protected` 是題目指定的，實務上更常見的是保持 `private`、透過 getter 拿；兩種都要會。讀檔的部分就是 12/03 Q7，多一欄而已。

</details>

**Q6. 三層繼承：實驗課**
承 Q5，新增 `class LabCourse` 繼承自 `RequiredCourse`，多兩個 private 成員：`labRoom`（教室）與 `labHours`（每週時數，等於學分數）。重新定義 `printInfo()` 印課名、教室、時數。從 `courses.txt` 找出所有必修課，逐一讀入教室名稱後建成 `LabCourse`，最後印出全部。

```text
輸入：
EC3021
EC2009
輸出：
room for C Programming? EC3021
room for Calculus I? EC2009
[Lab] C Programming, room EC3021, 3 hours/week
[Lab] Calculus I, room EC2009, 4 hours/week
```

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <fstream>
#include <string>
#include <vector>
using namespace std;

class Course {
public:
    Course(const string& i, const string& n, int c) : courseID(i), courseName(n), credits(c) {}
    void printInfo() const { cout << courseID << ' ' << courseName << " (" << credits << " credits)"; }
    string getName() const { return courseName; }
    int getCredits() const { return credits; }
protected:
    string courseID, courseName;
    int credits;
};

class RequiredCourse : public Course {
public:
    RequiredCourse(const string& i, const string& n, int c, bool g) : Course(i, n, c), isGeneral(g) {}
    void printInfo() const {
        cout << "[Required] "; Course::printInfo();
        cout << (isGeneral ? ", general education" : "") << '\n';
    }
private:
    bool isGeneral;
};

class LabCourse : public RequiredCourse {              // 三層：LabCourse → RequiredCourse → Course
public:
    LabCourse(const RequiredCourse& base, const string& room)
        : RequiredCourse(base), labRoom(room), labHours(credits) {}   // credits 是 protected，可以直接用
    void printInfo() const {
        cout << "[Lab] " << courseName << ", room " << labRoom << ", " << labHours << " hours/week\n";
    }
private:
    string labRoom;
    int labHours;
};

int main() {
    ifstream fin("courses.txt");
    if (!fin) { cout << "cannot open courses.txt\n"; return 1; }
    vector<RequiredCourse> required;
    string type, id, name, creditText, extraText;
    while (getline(fin, type, ';') && getline(fin, id, ';') && getline(fin, name, ';')
           && getline(fin, creditText, ';') && getline(fin, extraText)) {
        if (type == "R")
            required.push_back(RequiredCourse(id, name, stoi(creditText), extraText == "1"));
    }

    vector<LabCourse> labs;
    for (const RequiredCourse& rc : required) {
        cout << "room for " << rc.getName() << "? ";
        string room;
        cin >> room;
        cout << room << '\n';
        labs.push_back(LabCourse(rc, room));
    }
    for (const LabCourse& lab : labs) lab.printInfo();
    return 0;
}
```

`LabCourse` 的建構子收一個現成的 `RequiredCourse`，用 `RequiredCourse(base)` 把它整個複製進基底部分——這是「拿既有物件升級成衍生類別」的標準寫法。`labHours(credits)` 能直接用 `credits`，正是因為它在 `Course` 裡是 `protected`；孫類別一樣看得到。

</details>

**Q7. 遊戲角色經驗值**
寫 `class Character`：成員有名字、等級、經驗值，以及一個 `static const int EXP_LV = 100`。等級與總經驗的換算是 $\text{exp} = (\text{level} - 1)^2 \times 100$（Level 10 是 8100、Level 11 是 10000）。提供：建構子（給名字與初始等級，經驗值**由等級算出**）、`print()` 印 `名字: Level N (目前 exp/下一級門檻)`、`getName()`、`beatMonster(int exp)` 加經驗值並在**跨過門檻時自動升級**（可能一次升好幾級）、`levelUp()`。再寫 `Knight` 與 `Warrior` 繼承它，各自重新定義 `print()` 加上職業名；並重新定義 `bossComing()`：遇到 Boss 時 Knight 掉 3000、Warrior 掉 8000 經驗值（掉到門檻以下要降級）。用 Knight Leo（Lv 5）、Knight Tsukasa（Lv 7）、Warrior Rose（Lv 12）跑下面的劇情，數字都要算出來、不能寫死。

<details>
<summary><b>參考解答</b></summary>

```cpp
#include <iostream>
#include <string>
using namespace std;

class Character {
public:
    Character(const string& n, int lv) : name(n), level(lv), exp(expForLevel(lv)) {}
    void print() const {
        cout << name << ": Level " << level << " (" << exp << "/" << expForLevel(level + 1) << ")\n";
    }
    string getName() const { return name; }
    void beatMonster(int gained) {
        exp += gained;
        while (exp >= expForLevel(level + 1)) levelUp();   // 一次可能升好幾級
    }
    void bossComing() { loseExp(3000); }                   // 預設掉 3000，子類別可以改
protected:
    static const int EXP_LV = 100;
    static int expForLevel(int lv) { return (lv - 1) * (lv - 1) * EXP_LV; }
    void levelUp() { level++; }
    void loseExp(int amount) {
        exp -= amount;
        if (exp < 0) exp = 0;
        while (level > 1 && exp < expForLevel(level)) level--;   // 掉到門檻以下就降級
    }
    string name;
    int level, exp;
};

class Knight : public Character {
public:
    Knight(const string& n, int lv) : Character(n, lv) {}
    void print() const { cout << "Knight "; Character::print(); }
    void bossComing() { loseExp(3000); }
};

class Warrior : public Character {
public:
    Warrior(const string& n, int lv) : Character(n, lv) {}
    void print() const { cout << "Warrior "; Character::print(); }
    void bossComing() { loseExp(8000); }
};

int main() {
    Knight leo("Leo", 5), tsukasa("Tsukasa", 7);
    Warrior rose("Rose", 12);
    leo.print(); tsukasa.print(); rose.print();

    cout << "-- a monster worth 10000 exp appears; Rose beats it\n";
    rose.beatMonster(10000);
    rose.print();

    cout << "-- the monster weakens to 4000 exp; Leo and Tsukasa beat it\n";
    leo.beatMonster(4000); tsukasa.beatMonster(4000);
    leo.print(); tsukasa.print();

    cout << "-- boss comes\n";
    leo.bossComing(); rose.bossComing();
    leo.print(); rose.print();
    return 0;
}
```

輸出：

```text
Knight Leo: Level 5 (1600/2500)
Knight Tsukasa: Level 7 (3600/4900)
Warrior Rose: Level 12 (12100/14400)
-- a monster worth 10000 exp appears; Rose beats it
Warrior Rose: Level 15 (22100/22500)
-- the monster weakens to 4000 exp; Leo and Tsukasa beat it
Knight Leo: Level 8 (5600/6400)
Knight Tsukasa: Level 9 (7600/8100)
-- boss comes
Knight Leo: Level 6 (2600/3600)
Warrior Rose: Level 12 (14100/14400)
```

驗算一下 Rose：Lv 12 起始 12100，加 10000 變 22100；Lv 15 的門檻是 $14^2 \times 100 = 19600$、Lv 16 是 22500，所以停在 Lv 15。`beatMonster` 裡用 `while` 而不是 `if`，一次跨過兩個門檻才會連升兩級。`static const int EXP_LV = 100;` 是 `static` 成員的特例：**整數型別的 `static const` 可以直接在類別裡給值**，不必像 10/22 那樣在類別外再定義一次。`expForLevel` 做成 `static` 函式，因為它只是公式、不需要物件；`levelUp`／`loseExp` 放 `protected`，讓子類別的 `bossComing` 可以呼叫但外面不能亂改等級。

</details>

---

[← 12/03｜檔案輸入輸出（Ch 12）](/2026/09/09/nsysu-c-programming/1203-file-io/) ｜ [回總覽](/2026/09/09/nsysu-c-programming/) ｜ [12/17｜期末筆試（範圍 Ch 1–12、Ch 14） →](/2026/09/09/nsysu-c-programming/1217-final-written/)
