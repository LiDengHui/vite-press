
<template>
    <div class="container">
        <div class="left">固定宽度 (200px)</div>
        <div class="right">自适应宽度 (自动占满剩余空间)</div>
    </div>
</template>

<style scoped>
.container {
    border: 2px solid #333;
    display: flow-root; /* 父容器BFC解决高度塌陷 */
}
.left {
    float: left;
    width: 200px;
    height: 150px;
    background: lightblue;
}
.right {
    overflow: hidden; /* 触发BFC避免环绕 */
    height: 100px;
    background: lightcoral;
}
</style>