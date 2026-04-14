<script setup lang="ts">
import { ref, computed } from 'vue'

const a = ref(0)
const b = ref(0)
const sum = computed(() => a.value + b.value)
</script>

<template>
  <div>
    <input v-model.number="a" type="number" /> + <input v-model.number="b" type="number" /> = {{ sum }}
  </div>
</template>
