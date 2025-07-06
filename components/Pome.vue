<template>
    <div class="poem">
        <h1>静夜思</h1>
        <div class="author">
            <span>李白</span>
            <span class="year">701</span>
            <span class="to">~</span>
            <span class="year">762</span>
        </div>
        <p>床前明月光</p>
        <p>疑是地上霜</p>
        <p>举头望明月</p>
        <p>低头思故乡</p>
    </div>

</template>
<style>


.poem {
    color: #333;
    font-size: 1.4em;

    writing-mode: vertical-rl; /* 书写方向水平 */
    margin: 30px auto;
}
.year {
    text-orientation: upright;  /* 字符全部直立 */
    text-combine-upright: all; /* 如"2023"会水平显示 */

}
.author {
    text-align: end;
    color: #aaa;
    font-size: 0.8em;
}

</style>
<script setup lang="ts">
</script>
