---
title: NaN和isNaN
date: 2019-08-05 16:29:13
tags:
---

今天判断一个值是不是NaN，遇到一个很诡异的问题

![20190805172639.png](https://raw.githubusercontent.com/LiDengHui/images/master/img20190805172639.png)

从图中可以看出isNaN在判断数字类型string和bool的时候都将其转换成了数字，所以严格类型判断需要先判断data是不是一个number类型`(typeof data === 'number)`然后在判断他是不是一个是不是一个数字

但是看起来很完美，这只是表现，我看了一下NaN的定义

NaN（NotaNumber，非数）是计算机科学中数值数据类型的一类值，表示未定义或不可表示的值。常在浮点数运算中使用。首次引入NaN的是1985年的IEEE 754浮点数标准。

首先NaN是一个数，且是一个不可能的数。

返回NaN的运算有如下三种：

    1. 至少有一个参数是NaN的运算 
    2. 不定式
        下列除法运算：0/0、∞/∞、∞/−∞、−∞/∞、−∞/−∞
        下列乘法运算：0×∞、0×−∞
        下列加法运算：∞ + (−∞)、(−∞) + ∞
        下列减法运算：∞ - ∞、(−∞) - (−∞)
    3. 产生复数结果的实数运算。例如：
        对负数进行开偶次方的运算
        对负数进行对数运算
        对正弦或余弦到达域以外的数进行反正弦或反余弦运算 [1] 

在Chrome里有一种情况`数与一个undefined或者一个非纯数字符串相互运算` 也会产生`NaN`

![20190805170014.png](https://raw.githubusercontent.com/LiDengHui/images/master/img20190805170014.png)

原因isNaN判断的时候会将`data`进行`Number`类型转换

    Number(undefined) = NaN
    Number("12343") = 12343
    Number("12343A") = NaN
    Number("true") = 1
    Number({}) = NaN
    Number([]) = 0
    Number([1]) = 1
    Number([1,2,3]) = NaN

然后再去判断,总之很坑很坑

