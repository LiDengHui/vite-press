<template>
    <SeamlessCarousel :items="items" class="carousel" />
</template>
<script setup lang="ts">
import SeamlessCarousel from './SeamlessCarousel.vue';
import { withBase } from 'vitepress';

const items = [
    {
        image: withBase('/image/1.avif')
    },
    {
        image: withBase('/image/2.avif')
    },
    {
        image: withBase('/image/3.avif')
    }
];
</script>
<style scoped>
.carousel {
    margin: 20px 0;
}
</style>
