import{F as e,b as t,m as n,p as r}from"./chunks/plugin-vue_export-helper.Cyk5UgWo.js";const i=JSON.parse(`{"title":"防抖","description":"","frontmatter":{},"headers":[],"relativePath":"语言/JavaScript/题库/防抖.md","filePath":"语言/JavaScript/题库/防抖.md","lastUpdated":1751812369000}`),a={name:`语言/JavaScript/题库/防抖.md`};function o(t,i,a,o,s,c){return e(),n(`div`,null,i[0]||=[r(`<h1 id="防抖" tabindex="-1">防抖 <a class="header-anchor" href="#防抖" aria-label="Permalink to “防抖”">​</a></h1><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>function debounce( fn ,ms) {</span></span>
<span class="line"><span>    let timer;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    return (...args) =&gt; {</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>        if(timer) {</span></span>
<span class="line"><span>            clearTimeout(timer);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        timer = setTimeout(()=&gt;{</span></span>
<span class="line"><span>              fn(...args)</span></span>
<span class="line"><span>        , ms)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol><li>多少时间内如果执行相同的函数，则不执行该操作，</li></ol>`,3)])}var s=t(a,[[`render`,o]]);export{i as __pageData,s as default};