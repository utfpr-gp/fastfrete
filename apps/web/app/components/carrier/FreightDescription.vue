<script setup lang="ts">
interface Props {
  title: string
  description: string
  tags?: string[]
}

defineProps<Props>()
</script>

<template>
  <div class="bg-white rounded-xl p-6">
    <h2 class="text-xl font-bold text-gray-900 mb-3">{{ title }}</h2>
    <p class="text-gray-600 leading-relaxed mb-4">{{ description }}</p>

    <div v-if="tags && tags.length > 0" class="flex flex-wrap gap-2">
      <span
        v-for="tag in tags"
        :key="tag"
        class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
      >
        {{ tag }}
      </span>
    </div>
  </div>
</template>
