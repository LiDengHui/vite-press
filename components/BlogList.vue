<script setup>
import BlogItem from "./BlogItem.vue";
defineProps({
  list: ()=> {return []}
})
</script>

<template>
<BlogItem v-for="(item, index) in  list" :key="index" :item="item">
</BlogItem>
</template>

<style scoped>

</style>
