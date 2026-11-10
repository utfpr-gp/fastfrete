<script setup lang="ts">
defineProps<{
  label?: string
  id: string
  required?: boolean
}>()
</script>

<template>
  <label v-if="label" :for="id" class="block text-sm font-medium">
    {{ label }} <span v-if="required" class="text-red-500">*</span>
  </label>
</template>
