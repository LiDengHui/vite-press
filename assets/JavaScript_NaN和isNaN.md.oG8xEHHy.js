import{_ as a,c as N,o as t,a3 as n}from"./chunks/framework.DWgr2bMN.js";const m=JSON.parse('{"title":"NaN和isNaN","description":"","frontmatter":{"title":"NaN和isNaN","date":"2019-08-05T16:29:13.000Z","tags":null},"headers":[],"relativePath":"JavaScript/NaN和isNaN.md","filePath":"JavaScript/NaN和isNaN.md","lastUpdated":1749107541000}'),r={name:"JavaScript/NaN和isNaN.md"};function p(o,e,i,s,c,d){return t(),N("div",null,e[0]||(e[0]=[n(`<p>今天判断一个值是不是NaN，遇到一个很诡异的问题</p><p><img src="https://raw.githubusercontent.com/LiDengHui/images/master/img20190805172639.png" alt="20190805172639.png"></p><p>从图中可以看出isNaN在判断数字类型string和bool的时候都将其转换成了数字，所以严格类型判断需要先判断data是不是一个number类型<code>(typeof data === &#39;number)</code>然后在判断他是不是一个是不是一个数字</p><p>但是看起来很完美，这只是表现，我看了一下NaN的定义</p><p>NaN（NotaNumber，非数）是计算机科学中数值数据类型的一类值，表示未定义或不可表示的值。常在浮点数运算中使用。首次引入NaN的是1985年的IEEE 754浮点数标准。</p><p>首先NaN是一个数，且是一个不可能的数。</p><p>返回NaN的运算有如下三种：</p><pre><code>1. 至少有一个参数是NaN的运算 
2. 不定式
    下列除法运算：0/0、∞/∞、∞/−∞、−∞/∞、−∞/−∞
    下列乘法运算：0×∞、0×−∞
    下列加法运算：∞ + (−∞)、(−∞) + ∞
    下列减法运算：∞ - ∞、(−∞) - (−∞)
3. 产生复数结果的实数运算。例如：
    对负数进行开偶次方的运算
    对负数进行对数运算
    对正弦或余弦到达域以外的数进行反正弦或反余弦运算 [1] 
</code></pre><p>在Chrome里有一种情况<code>数与一个undefined或者一个非纯数字符串相互运算</code> 也会产生<code>NaN</code></p><p><img src="https://raw.githubusercontent.com/LiDengHui/images/master/img20190805170014.png" alt="20190805170014.png"></p><p>原因isNaN判断的时候会将<code>data</code>进行<code>Number</code>类型转换</p><pre><code>Number(undefined) = NaN
Number(&quot;12343&quot;) = 12343
Number(&quot;12343A&quot;) = NaN
Number(&quot;true&quot;) = 1
Number({}) = NaN
Number([]) = 0
Number([1]) = 1
Number([1,2,3]) = NaN
</code></pre><p>然后再去判断,总之很坑很坑</p>`,13)]))}const _=a(r,[["render",p]]);export{m as __pageData,_ as default};
