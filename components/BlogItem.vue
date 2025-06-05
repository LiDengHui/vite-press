<template>
<div>
  {{title}}
</div>
</template>
<script setup>
defineProps({
  title: String,
  link: String,
  description: String,
  img: String,
})
</script>
<style  scoped>

</style>
