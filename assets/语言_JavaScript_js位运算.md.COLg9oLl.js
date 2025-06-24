import{_ as e,c as t,o as a,a6 as p}from"./chunks/framework.mq8cK8gF.js";const i=JSON.parse('{"title":"js位运算","description":"js 位运算","frontmatter":{"title":"js位运算","date":"2016-11-21T11:35:45.000Z","tags":["javascript","算法"],"categories":"技术文档","description":"js 位运算"},"headers":[],"relativePath":"语言/JavaScript/js位运算.md","filePath":"语言/JavaScript/js位运算.md","lastUpdated":null}'),r={name:"语言/JavaScript/js位运算.md"};function o(c,n,m,u,d,s){return a(),t("div",null,n[0]||(n[0]=[p(`<p>我们可能很少在编程中用位运算，如果没深入学习，可能也很难理解。平时的数值运算，其实是要先转换成二进制再进行运算的，而位运算就是直接进行二进制运算，所以位运算的执行效率肯定是更高的。下面通过一些实例来加深对位运算的理解。</p><h1 id="按位与" tabindex="-1">按位与(&amp;) <a class="header-anchor" href="#按位与" aria-label="Permalink to “按位与(&amp;)”">​</a></h1><p>&amp;&amp;运算符我们都知道，只有两个都为真，结果才为真。&amp;道理是一样的，只有两个数的值为1时，才返回1。例如1和3的按位与操作：</p><pre><code>			    0001
			 &amp;  0011
			---------
			    0001
</code></pre><p>只有对应的数为1时，结果才为1，其他都为0。判断一个数是奇数还是偶数，我们会用求余数来判断：</p><pre><code>    function assert(n) {
            if (n % 2 === 1) {
        console.log(&quot;n是奇数&quot;);
        } else {
        console.log(&quot;n是偶数&quot;);
        }
    }
    assert(3); // &quot;n是奇数&quot;
</code></pre><p>我们也可以用一个数和1进行按位&amp;操作来判断，而且速度更快：</p><pre><code>    function assert(n) {
    if (n &amp; 1) {
        console.log(&quot;n是奇数&quot;);
    } else {
        console.log(&quot;n是偶数&quot;);
    }
    }
    assert(3); // &quot;n是奇数&quot;
</code></pre><p>下面是位运算过程：</p><pre><code>			 1 = 0001
			 3 = 0011
			 --------
		     &amp; = 0001
</code></pre><p>奇数的二进制码的最后一位数肯定是1，而1只有最后一位为1，按位&amp;操作之后，结果肯定只有最后一位数为1。而偶数的二进制表示的最后一位数是0，和1进行按位&amp;操作，结果所有位数都为0。</p><h1 id="按位或" tabindex="-1">按位或(|) <a class="header-anchor" href="#按位或" aria-label="Permalink to “按位或(|)”">​</a></h1><p>|与||操作符的道理也是一样的，只要两个数中有一个数为1，结果就为1，其他则为0。</p><pre><code>				0001
			 |  0011
			---------
			    0011
</code></pre><p>对浮点数向下求整，我们会用下面的方法：</p><pre><code>    var num = Math.floor(1.1); // 1
</code></pre><p>我们也可以用位运算来求整：</p><pre><code>    var num = 1.1 | 0; // 1
</code></pre><p>其实浮点数是不支持位运算的，所以会先把1.1转成整数1再进行位运算，就好像是对浮点数向下求整。所以1|0的结果就是1。</p><h1 id="按位非" tabindex="-1">按位非(~) <a class="header-anchor" href="#按位非" aria-label="Permalink to “按位非(~)”">​</a></h1><p>按位非就是求二进制的反码：</p><pre><code>    var num = 1; // 二进制 00000000000000000000000000000001
    var num1 = ~num; // 二进制 11111111111111111111111111111110
</code></pre><p>我们知道，js中的数字默认是有符号的。有符号的32位二进制的最高位也就是第一位数字代表着正负，1代表负数，0代表整数。那到底 等于多少呢？最高位为1代表负数，负数的二进制转化为十进制：符号位不变，其他位取反加1。取反之后为 ，加1之后为 ，十进制为-2。</p><h1 id="按位异或" tabindex="-1">按位异或(^) <a class="header-anchor" href="#按位异或" aria-label="Permalink to “按位异或(^)”">​</a></h1><p>按位异或是两个数中只有一个1时返回1，其他情况返回0。</p><pre><code>			    0001
			 ^  0011
			---------
			    0010
</code></pre><p>数字与数字本身按位异或操作得到的是0，因为每两个对应的数字都相同，所以最后返回的都是0。</p><p>我们经常会需要调换两个数字的值：</p><pre><code>    var num1 = 1, num2 = 2, temp;
    temp = num1;
    num1 = num2; // 2
    num2 = temp; // 1
</code></pre><p>如果装逼一点的话，可以这样：</p><pre><code>    var num1 = 1, num2 = 2;
    num1 = [num2, num2 = num1][0];
    console.log(num1); // 2
    console.log(num2); // 1
</code></pre><p>如果想再装的稳一点的话，可以这样：</p><pre><code>    var num1 = 1, num2 = 2;
    num1 ^= num2; // num1 = num1 ^ num2 = 1 ^ 2 = 3
    num2 ^= num1; // num2 = num2 ^ (num1 ^ num2) = 2 ^ (1 ^ 2) = 1
    num1 ^= num2; // num1 = num1 ^ num2 = 3 ^ 1 = 2
    console.log(num1); // 2
    console.log(num2); // 1
</code></pre><h1 id="有符号左移" tabindex="-1">有符号左移(&lt;&lt;) <a class="header-anchor" href="#有符号左移" aria-label="Permalink to “有符号左移(&lt;&lt;)”">​</a></h1><p>有符号左移会将32位二进制数的所有位向左移动指定位数。如：</p><pre><code>    var num = 2; // 二进制10
    num = num &lt;&lt; 5; // 二进制1000000，十进制64
</code></pre><p>如果要求2的n次方，可以这样：</p><pre><code>    function power(n) {
        return 1 &lt;&lt; n;
    }

    power(5); // 32
</code></pre><p>1的二进制是01，左移5位就是0100000，十进制就是2的5次方32。</p><h1 id="有符号右移" tabindex="-1">有符号右移(&gt;&gt;) <a class="header-anchor" href="#有符号右移" aria-label="Permalink to “有符号右移(&gt;&gt;)”">​</a></h1><p>有符号右移会将32位二进制数的所有位向右移动指定位数。如：</p><pre><code>    var num = 64; // 二进制1000000
    num = num &gt;&gt; 5; // 二进制10，十进制2
</code></pre><p>求一个数的二分之一：</p><pre><code>var num = 64 &gt;&gt; 1; // 32
</code></pre><p>有符号左移与右移不会影响符号位。</p><h1 id="无符号右移" tabindex="-1">无符号右移(&gt;&gt;&gt;) <a class="header-anchor" href="#无符号右移" aria-label="Permalink to “无符号右移(&gt;&gt;&gt;)”">​</a></h1><p>正数的无符号右移与有符号右移结果是一样的。负数的无符号右移会把符号位也一起移动，而且无符号右移会把负数的二进制码当成正数的二进制码：</p><pre><code>    var num = -64; // 11111111111111111111111111000000
    num = num &gt;&gt;&gt; 5; // 134217726
</code></pre><p>所以，我们可以利用无符号右移来判断一个数的正负：</p><pre><code>    function isPos(n) {
    return (n === (n &gt;&gt;&gt; 0)) ? true : false; 	
    }

    isPos(-1); // false
    isPos(1); // true
</code></pre><p>-1&gt;&gt;&gt;0虽然没有向右移动位数，但-1的二进制码已经变成了正数的二进制码：</p><p>所以-1&gt;&gt;&gt;0的值为4294967295。</p><p>总结</p><p>以上的例子在平常可能会比较容易用到或看到，也是属于比较容易理解的。一些比较复杂的、难理解的，我觉得应该尽量少用，因为会给阅读者带来困难，也会给自己带来麻烦。</p>`,54)]))}const h=e(r,[["render",o]]);export{i as __pageData,h as default};
