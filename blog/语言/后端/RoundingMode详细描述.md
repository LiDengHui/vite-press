# RoundingMode 详细描述
在 Java 中，`RoundingMode` 是一个枚举类（位于 `java.math` 包中），用于精确控制数值计算中的舍入行为。它通常与 `BigDecimal` 类配合使用，处理金融或科学计算中需要精确舍入的场景。以下是详细说明和示例：

---

### **RoundingMode 的枚举值**
Java 提供了 8 种舍入模式：

| 枚举值             | 行为描述                                    | 示例（保留 0 位小数）                 |
|-----------------|-----------------------------------------|------------------------------|
| **UP**          | 远离零方向舍入（绝对值增大）                          | `2.5 → 3`<br>`-1.6 → -2`     |
| **DOWN**        | 向零方向舍入（直接截断，绝对值减小）                      | `2.5 → 2`<br>`-1.6 → -1`     |
| **CEILING**     | 向正无穷方向舍入（正数同 UP，负数同 DOWN）               | `2.5 → 3`<br>`-1.6 → -1`     |
| **FLOOR**       | 向负无穷方向舍入（正数同 DOWN，负数同 UP）               | `2.5 → 2`<br>`-1.6 → -2`     |
| **HALF_UP**     | 四舍五入（≥0.5 进位）                           | `2.5 → 3`<br>`-1.5 → -2`     |
| **HALF_DOWN**   | 五舍六入（>0.5 进位）                           | `2.5 → 2`<br>`2.6 → 3`       |
| **HALF_EVEN**   | 银行家舍入法（向最接近的偶数舍入，解决 HALF_UP 的统计偏差）      | `2.5 → 2`（偶）<br>`3.5 → 4`（奇） |
| **UNNECESSARY** | 断言操作无需舍入（若需舍入则抛出 `ArithmeticException`） | `2.0 → 2`<br>`2.5 → 异常`      |

---

### **使用示例**
```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class RoundingModeDemo {
    public static void main(String[] args) {
        BigDecimal num = new BigDecimal("2.5");

        // HALF_UP (四舍五入)
        System.out.println("HALF_UP: " + num.setScale(0, RoundingMode.HALF_UP)); // 3

        // HALF_DOWN (五舍六入)
        System.out.println("HALF_DOWN: " + num.setScale(0, RoundingMode.HALF_DOWN)); // 2

        // HALF_EVEN (银行家舍入)
        System.out.println("HALF_EVEN: " + num.setScale(0, RoundingMode.HALF_EVEN)); // 2 (向偶数舍入)

        // CEILING (向正无穷舍入)
        BigDecimal negativeNum = new BigDecimal("-1.6");
        System.out.println("CEILING: " + negativeNum.setScale(0, RoundingMode.CEILING)); // -1

        // UNNECESSARY (无需舍入则成功，否则异常)
        try {
            BigDecimal exactNum = new BigDecimal("2.0");
            System.out.println("UNNECESSARY: " + exactNum.setScale(0, RoundingMode.UNNECESSARY)); // 2
            num.setScale(0, RoundingMode.UNNECESSARY); // 抛出 ArithmeticException
        } catch (ArithmeticException e) {
            System.out.println("需要舍入时使用 UNNECESSARY 会抛出异常");
        }
    }
}
```

---

### **关键场景建议**
1. **金融计算**  
   优先使用 **`HALF_EVEN`**（银行家舍入），符合 IEEE 754 标准，避免统计偏差。

2. **常规四舍五入**  
   使用 **`HALF_UP`**（如成绩计算、货币显示）。

3. **强制截断小数**  
   使用 **`DOWN`**（如库存单位取整）。

4. **精确校验**  
   **`UNNECESSARY`** 用于确保计算结果无需舍入（如财务校验）。

---

### **注意事项**
- `RoundingMode` 替代了旧版 `BigDecimal.ROUND_XXX` 常量（Java 5+ 推荐用枚举）。
- 浮点数类型（`float`/`double`）的运算**不适用** `RoundingMode`，需用 `BigDecimal`。
- 舍入模式的选择直接影响精度，需严格匹配业务需求。

通过合理使用 `RoundingMode`，可避免传统四舍五入的误差累积问题（尤其在金融领域）。
