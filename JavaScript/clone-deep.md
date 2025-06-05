---
title: cloneDeep
tags:
  - js
categories:
  - 技术文档
  - 前端
  - js
date: 2020-08-09 21:46:34
---


# 普通Clone

# RegexClone

```js
function cloneReg(target, isDeep) {
    var regFlag = /\w*$/;
    var result = new target.constructor(target.source, regFlag.exec(target));
    if (isDeep) {
        result.lastIndex = 0;
    } else {
        result.lastIndex = target.lastIndex;
    }
    return result;
}

var regex = /yideng/g;

var reg2 = cloneReg(regex, true);

console.log(reg2.test("yideng"));
console.log(reg2.test("yideng"));
console.log(reg2.test("yideng"));
console.log(reg2.test("yideng"));
console.log(reg2.test("yideng"));
```

# Buffer克隆

```js
const allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;
const buf = Buffer.from("laoyuan");

function cloneBuffer(buffer, isDeep) {
    if (!isDeep) {
        return buffer.slice();
    }
    const length = buffer.length,
        result = allocUnsafe
            ? allocUnsafe(length)
            : new buffer.constructor(length);

    return result;
}

const buf2 = cloneBuffer(buf, true);

buf2.write("nodejs");
buf2.write("22");

console.log("buf", buf.toString("utf-8"));
console.log("buf2", buf2.toString("utf-8"));

```