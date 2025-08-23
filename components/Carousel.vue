<template>
    <SeamlessCarousel :items="items" class="carousel" />
</template>
<script setup lang="ts">
import SeamlessCarousel from './SeamlessCarousel.vue';
import { withBase } from 'vitepress';

const items = [
    {
        title: "title1",
        image: withBase('/image/1.avif')
    },
    {
        title: "title2",
        image: withBase('/image/2.avif')
    },
    {
        title: "title3",
        image: withBase('/image/3.avif')
    }
];
</script>
<style scoped>
.carousel {
    margin: 20px 0;
}
</style>
