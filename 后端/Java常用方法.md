# java常用方法

## Math工具类

| 函数                   | 参数类型    | 说明                         | 示例                           |
|----------------------|---------|----------------------------|------------------------------|
| `abs(x)`             | 所有标量/向量 | 绝对值                        | `abs(-2.5) = 2.5`            |
| `sign(x)`            | 所有标量/向量 | 符号函数，返回 `1` 或 `-1`         | `sign(5) = 1, sign(-3) = -1` |
| `floor(x)`           | 所有标量/向量 | 向下取整                       | `floor(3.7) = 3`             |
| `ceil(x)`            | 所有标量/向量 | 向上取整                       | `ceil(3.1) = 4`              |
| `round(x)`           | 所有标量/向量 | 四舍五入                       | `round(3.5) = 4`             |
| `trunc(x)`           | 所有标量/向量 | 截断小数部分，返回整数部分              | `trunc(3.7) = 3`             |
| `mod(x, y)`          | 标量/向量   | 取模运算，返回 `x` 除以 `y` 的余数     | `mod(7, 3) = 1`              |
| `min(x, y)`          | 标量/向量   | 取最小值                       | `min(3, 5) = 3`              |
| `max(x, y)`          | 标量/向量   | 取最大值                       | `max(3, 5) = 5`              |
| `clamp(x, min, max)` | 标量/向量   | 限制 `x` 在 `[min, max]` 范围内  | `clamp(3.5, 2, 4) = 3.5`     |
| `mix(x, y, a)`       | 标量/向量   | 线性插值，返回 `x` 和 `y` 的混合值     | `mix(2, 8, 0.5) = 5`         |
| `cbrt(x)`            | 所有标量/向量 | 立方根                        | `cbrt(27) = 3`               |
| `sqrt(x)`            | 所有标量/向量 | 平方根                        | `sqrt(4) = 2`                |
| `hypot(x, y)`        | 所有标量/向量 | 直角三角形的斜边长度                 | `hypot(3, 4) = 5`            |
| `exp(x)`             | 所有标量/向量 | 指数函数，返回 `e^x`              | `exp(1) = 2.71828...`        |
| `exp2(x)`            | 所有标量/向量 | 指数函数，返回 `2^x`              | `exp2(2) = 4`                |
| `log(x)`             | 所有标量/向量 | 自然对数，返回 `ln(x)`            | `log(e) = 1`                 |
| `log2(x)`            | 所有标量/向量 | 以 2 为底的对数                  | `log2(8) = 3`                |
| `log10(x)`           | 所有标量/向量 | 以 10 为底的对数                 | `log10(100) = 2`             |
| `sin(x)`             | 所有标量/向量 | 正弦函数，返回 `-1` 到 `1` 的值      | `sin(0) = 0`                 |
| `cos(x)`             | 所有标量/向量 | 余弦函数，返回 `-1` 到 `1` 的值      | `cos(0) = 1`                 |
| `tan(x)`             | 所有标量/向量 | 正切函数，返回 `-∞` 到 `∞` 的值      | `tan(0) = 0`                 |
| `asin(x)`            | 所有标量/向量 | 反正弦函数，返回 `-π/2` 到 `π/2` 的值 | `asin(0) = 0`                |
| `acos(x)`            | 所有标量/向量 | 反余弦函数，返回 `0` 到 `π` 的值      | `acos(1) = 0`                |
| `atan(y, x)`         | 所有标量/向量 | 反正切函数，返回 `-π` 到 `π` 的值     | `atan(1, 1) = π/4`           |
| `atan2(y, x)`        | 所有标量/向量 | 反正切函数，返回 `-π` 到 `π` 的值     | `atan2(1, 1) = π/4`          |


## Runtime 方法

| 函数                      | 返回值类型   | 说明                       | 示例                                                |
|:------------------------|:--------|:-------------------------|:--------------------------------------------------|
| `exit(int status)`      | void    | 停止虚拟机                    | Runtime.getRuntime().exit(0);                     |
| `availableProcessors()` | int     | 获取CPU线程数                 | Runtime.getRuntime().availableProcessors()        |
| `maxMemory()`           | long    | JVM能从系统中获取总内存大小（单位Byte）  | Runtime.getRuntime().maxMemory()                  |
| `totalMemory()`         | long    | JVM已经从系统中获取总内存大小（单位Byte） | Runtime.getRuntime().totalMemory()                |
| `freeMemory()`          | long    | JVM剩余内存大小（单位Byte）        | Runtime.getRuntime().freeMemory()                 |
| `exec(String command)`  | Process | 运行cmd命令                  | Runtime.getRuntime().exec('shutdown -s -t 18000') |


## Object类

| 函数                   | 返回值类型   | 说明         | 示例             |
|:---------------------|:--------|:-----------|:---------------|
| `toString()`         | Object  | 返回字符串的表示形式 | obj.toString() |
| `equals(Object obj)` | boolean | 比较两个对象是否相等 | obj.           |
| `clone(int a)`       | object  | 对象克隆       |                |

## Objects工具

| 函数                           | 返回值类型   | 说明         | 示例                         |
|:-----------------------------|:--------|:-----------|:---------------------------|
| `toString(Object a)`         | String  | 返回字符串的表示形式 | Objects.toString(obj)      |
| `equals(Object a, Object b)` | boolean | 比较两个对象是否相等 | Objects.equals(obj1, obj2) |
| `isNull(Object a)`           | boolean | 判断对象是否为空   | Objects.isNull(obj)        |
| `nonNull(Object a)`          | boolean | 判断对象是否不为空  | Objects.nonNull(obj)       |
| `hash(Object... values)`     | int     | 计算对象的哈希值   | Objects.hash(obj1, obj2)   |    
