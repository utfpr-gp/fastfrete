<script setup lang="ts">
interface Props {
  icon: string
  title: string
  value: string
  subtitle?: string
}

defineProps<Props>()
</script>

<template>
  <div class="bg-white rounded-xl p-6 shadow-sm">
    <div class="flex items-start gap-4">
      <div class="text-3xl">{{ icon }}</div>
      <div class="flex-1">
        <p class="text-sm text-gray-600 mb-1">{{ title }}</p>
        <p class="text-2xl font-bold text-gray-900">{{ value }}</p>
        <p v-if="subtitle" class="text-xs text-gray-500 mt-1">{{ subtitle }}</p>
      </div>
    </div>
  </div>
</template>
