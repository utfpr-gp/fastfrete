<script setup lang="ts">
defineProps<{
  message?: string
}>()
</script>

<template>
  <span v-if="message" class="block text-xs text-red-500 font-medium">
    {{ message }}
  </span>
</template>
