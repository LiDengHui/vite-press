# BigInteger 的基本使用与原理

## 一、BigInteger 是什么？
`BigInteger` 是 Java 中用于表示**任意大小整数**的类（位于 `java.math` 包中）。它解决了基本数据类型（如 `int`、`long`）的数值范围限制：
- `int`：`-2^31` 到 `2^31-1`（约 ±21 亿）
- `long`：`-2^63` 到 `2^63-1`（约 ±9e18）
  **当数值超过这些范围时，必须使用 `BigInteger`**。

---

## 二、基本使用
### 1. 创建 BigInteger 对象
```java
// 方式1：通过字符串（最常用）
BigInteger big1 = new BigInteger("123456789012345678901234567890");

// 方式2：通过 long 类型
BigInteger big2 = BigInteger.valueOf(1234567890L);

// 方式3：通过字节数组（二进制补码形式）
byte[] bytes = {0x12, 0x34, 0x56};
BigInteger big3 = new BigInteger(bytes);
```

### 2. 常用运算方法
```java
BigInteger a = new BigInteger("100");
BigInteger b = new BigInteger("25");

// 加法
BigInteger sum = a.add(b); // 125

// 减法
BigInteger diff = a.subtract(b); // 75

// 乘法
BigInteger product = a.multiply(b); // 2500

// 除法
BigInteger quotient = a.divide(b); // 4

// 取余
BigInteger remainder = a.remainder(b); // 0

// 幂运算
BigInteger power = a.pow(3); // 1000000

// 最大公约数
BigInteger gcd = a.gcd(b); // 25

// 比较大小
int cmp = a.compareTo(b); // 1 (a > b)
boolean isEqual = a.equals(b); // false
```

### 3. 类型转换
```java
long val = big2.longValue(); // 转为 long（可能丢失精度）
int intVal = big2.intValue(); // 转为 int（可能丢失精度）
String str = big1.toString(); // 转为十进制字符串
String hex = big1.toString(16); // 转为十六进制字符串
```

---

## 三、核心原理
### 1. 内部存储结构
- **基于 `int[]` 数组**：`BigInteger` 将大整数拆分成多个 32 位整数（称为 `mag` 数组）存储。
- **符号单独存储**：通过 `int signum` 字段表示正负（`1`=正，`-1`=负，`0`=零）。
- **示例**：  
  数字 `12345678901234567890` 在内部可能存储为：  
  `signum = 1`，  
  `mag = [0x12, 0x34, 0x56, 0x78, 0x90]`（实际为紧凑二进制形式）。

### 2. 关键算法优化
1. **加法/减法**：  
   模拟手工竖式计算，处理进位/借位，时间复杂度 **O(n)**。

2. **乘法**：
    - **普通乘法**：O(n²)（小数字时使用）
    - **Karatsuba 算法**：分治策略，O(n^1.585)（中等数字）
    - **Toom-Cook 算法**：更高效的分治，O(n^1.465)（大数字）
    - **Schönhage–Strassen 算法**：基于 FFT，O(n log n)（极大数字，Java 9+ 支持）

3. **除法**：  
   使用 **Knuth 算法**（模拟手工长除法），时间复杂度 O(n²)。

4. **模运算**：  
   通过 **Barrett Reduction** 或 **Montgomery Multiplication** 优化模幂运算（用于密码学）。
### 3. 不可变性（Immutable）
- 所有运算**返回新对象**，原始对象不变。
- 优点：线程安全、易于缓存。
- 缺点：频繁运算可能产生大量临时对象。

---

## 四、性能注意事项
1. **运算速度远慢于基本类型**：  
   一次 `BigInteger.add()` 可能比 `int` 加法慢 **100~1000 倍**。
2. **内存占用较高**：  
   每个 `BigInteger` 对象需存储数组和对象头（约 16~40 字节额外开销）。
3. **最佳实践**：
    - 避免在循环中频繁创建临时对象。
    - 优先使用基本类型，仅在必要时转换。

---

## 五、典型应用场景
1. 密码学（RSA 密钥、大素数生成）
2. 高精度科学计算
3. 金融领域（超大金额计算）
4. 算法竞赛（处理超出 `long` 范围的问题）

## 示例代码：计算 100!（阶乘）
```java
BigInteger factorial = BigInteger.ONE;
for (int i = 1; i <= 100; i++) {
    factorial = factorial.multiply(BigInteger.valueOf(i));
}
System.out.println(factorial); // 输出 9332621544...（共 158 位）
```

> **注意**：`BigInteger` 无固定大小限制，仅受 JVM 内存约束（通常可处理数百万位的数字）。

```java
public class BigInteger extends Number implements Comparable<BigInteger> {
    /**
     * The signum of this BigInteger: -1 for negative, 0 for zero, or
     * 1 for positive.  Note that the BigInteger zero <em>must</em> have
     * a signum of 0.  This is necessary to ensures that there is exactly one
     * representation for each BigInteger value.
     */
    final int signum;

    /**
     * The magnitude of this BigInteger, in <i>big-endian</i> order: the
     * zeroth element of this array is the most-significant int of the
     * magnitude.  The magnitude must be "minimal" in that the most-significant
     * int ({@code mag[0]}) must be non-zero.  This is necessary to
     * ensure that there is exactly one representation for each BigInteger
     * value.  Note that this implies that the BigInteger zero has a
     * zero-length mag array.
     */
    final int[] mag;
}
```

```java
public static BigInteger valueOf(long val) {
    // If -MAX_CONSTANT < val < MAX_CONSTANT, return stashed constant
    if (val == 0)
        return ZERO;
    if (val > 0 && val <= MAX_CONSTANT)
        return posConst[(int) val];
    else if (val < 0 && val >= -MAX_CONSTANT)
        return negConst[(int) -val];

    return new BigInteger(val);
}
```

```java
public boolean equals(Object x) {
        // This test is just an optimization, which may or may not help
        if (x == this)
            return true;

        if (!(x instanceof BigInteger xInt))
            return false;

        if (xInt.signum != signum)
            return false;

        int[] m = mag;
        int len = m.length;
        int[] xm = xInt.mag;
        if (len != xm.length)
            return false;

        for (int i = 0; i < len; i++)
            if (xm[i] != m[i])
                return false;

        return true;
    }

```
