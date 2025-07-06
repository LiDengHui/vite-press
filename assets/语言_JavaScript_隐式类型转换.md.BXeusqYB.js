import{_ as e,c as o,o as a,a7 as t}from"./chunks/framework.t6yJIVLk.js";const m=JSON.parse('{"title":"隐式类型转换","description":"","frontmatter":{"title":"隐式类型转换","date":"2019-08-05T17:32:30.000Z","tags":null},"headers":[],"relativePath":"语言/JavaScript/隐式类型转换.md","filePath":"语言/JavaScript/隐式类型转换.md","lastUpdated":1750738239000}'),l={name:"语言/JavaScript/隐式类型转换.md"};function r(u,n,s,c,i,d){return a(),o("div",null,n[0]||(n[0]=[t(`<h2 id="字符串连接符与算数运算符" tabindex="-1">字符串连接符与算数运算符 <a class="header-anchor" href="#字符串连接符与算数运算符" aria-label="Permalink to “字符串连接符与算数运算符”">​</a></h2><pre><code>/*
*
* 1. 字符串连接符(+)：会把其他数据类型调用String() 方法转换成字符串然后拼接
* 2. 算数运算符：会把其他数据类型调用Number() 方法转成数字然后做加法计算
*/
// 字符串连接符号
console.log(1 + &#39;true&#39;) // 1true
console.log(1 + true) // 2
// Number(undefined) = NaN
console.log(1 + undefined) //NaN
//Number(null) = 0
console.log(1 + null) // 1
</code></pre><h2 id="关系运算符" tabindex="-1">关系运算符 <a class="header-anchor" href="#关系运算符" aria-label="Permalink to “关系运算符”">​</a></h2><p>会把其他数据类型转换成number之后再比较关系</p><pre><code>//关系运算符有一边是字符串时，会将其他数据类型使用Number转换，然后比较
console.log(&#39;2&#39; &gt; 10) // false
//两边都为字符串时，用Number转换，但是要用Uncode码来比较&#39;2&#39;.charCodeAt() = 50
console.log(&#39;2&#39; &gt; &#39;10&#39;) // true
//多字符串时从左往右依次比较
console.log(&quot;abc&quot;&gt;&quot;b&quot;) // false
//特殊情况
console.log(undefined == undefined) // true
console.log(undefined == null) //true
console.log(null == null) // true
//NaN与任何数比较都是false
console.log(NaN == NaN) // false  
</code></pre><h2 id="复杂类型在隐式转换时-先转换成string-然后在转换成number运算" tabindex="-1">复杂类型在隐式转换时，先转换成String，然后在转换成Number运算 <a class="header-anchor" href="#复杂类型在隐式转换时-先转换成string-然后在转换成number运算" aria-label="Permalink to “复杂类型在隐式转换时，先转换成String，然后在转换成Number运算”">​</a></h2><p><img src="https://raw.githubusercontent.com/LiDengHui/images/master/img20190805223243.png" alt="20190805223243.png" data-zoomable="true" loading="lazy"></p><pre><code>var a = ???
if (a == 1 &amp;&amp; a == 2 &amp;&amp; a == 3) {
  console.log(1)
}
// 如何完善a,才能打印1

/*
* 复杂数据类型转number顺序如下
* 1. 先使用valueOf()方法获取其原始值，如果原始值不是number类型，则使用toString()方法转String
* 2. 再将toString转成number运算
*/
// 先将左边数组转成string，然后右边也是string，则转成unicode编码运算
console.log([1,2] == &#39;1,2&#39;) // true
console.log([1,2].valueOf()) //[1,2]
console.log([1,2].toString())// 1,2

var a = {};
console.log(a == &quot;[object Object]&quot;) // true
console.log(a.valueOf().toStirng()) // [object Object]

// 重写对象的valueOf方法使其每次加一返回
var a = {
  i:1,
  valueOf: function(){
    return ++a.i
  }
}

if(a == 1 &amp;&amp; a == 2 &amp;&amp; a == 3) {
  console.log(&quot;1&quot;)
}
</code></pre><h2 id="逻辑非隐式转换与关系运算符隐式转换搞混淆" tabindex="-1">逻辑非隐式转换与关系运算符隐式转换搞混淆 <a class="header-anchor" href="#逻辑非隐式转换与关系运算符隐式转换搞混淆" aria-label="Permalink to “逻辑非隐式转换与关系运算符隐式转换搞混淆”">​</a></h2><pre><code>/*
* 1. 关系运算符: 将其他数据类型转换成数字
* 2. 逻辑非: 将其他数据类型使用Boolean转换成Boolean
* 一下8种情况都会转换成false,其他都是true
* 0, -0, NaN, undefined, null, &quot;&quot;, false, document.all()
*/
// [].valueOf.toString() 
// Number(&#39;&#39;) = 0
console.log([] == 0) // true
//![]看成布尔表达式 ![] == false;
console.log(![] == 0) // true
// {} 与 !{} 比较
// {}.valueOf().toString() 为 [object Object]
// !{} = false
// Number(&quot;[object Object]&quot;) == Number(false) 
// 最后NaN == 0
console.log({} == !{}) // false;
// 引用数据类型存储在栈中，比较的是堆栈地址
console.log({} == {}) //false

// [].valueOf().toString() 为 “”
// ![] 为 false
// Number(&quot;&quot;) == Number(&quot;false&quot;) 都为0
console.log([] == ![]) // true
// 引用数据类型存储在栈中，比较的是堆栈地址
console.log([] == []) // false
</code></pre>`,10)]))}const f=e(l,[["render",r]]);export{m as __pageData,f as default};
