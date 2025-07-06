<template>
    <SeamlessCarousel :items="items" />
</template>
<script setup lang="ts">
import SeamlessCarousel from './SeamlessCarousel.vue';
import { withBase } from 'vitepress'
const items = [
    {
        image: withBase("/image/1.svg"),
    },
    {
        image: withBase("/image/2.svg"),
    },
    {
        image: withBase("/image/3.svg"),
    },
];
</script>
