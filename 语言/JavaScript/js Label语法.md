# Label 语法（标签语句）
在 JavaScript 中，label 是一种标识符，可以用于标记语句，通常与 break 或 continue 一起使用在多层循环中：


```js
outerLoop: // 这是一个标签
    for (let i = 0; i < 3; i++) {
        innerLoop:
            for (let j = 0; j < 3; j++) {
                if (i === 1 && j === 1) {
                    break outerLoop; // 跳出外层循环
                }
                console.log(`i=${i}, j=${j}`);
            }
    }

```
