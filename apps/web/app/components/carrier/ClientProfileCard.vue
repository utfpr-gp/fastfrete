<script setup lang="ts">
interface Props {
  name: string
  rating: number
  totalReviews: number
  completedFreights: number
}

defineProps<Props>()
</script>

<template>
  <div class="bg-white rounded-xl p-6 flex items-center justify-between">
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
        <svg class="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </div>

      <div>
        <div class="font-semibold text-gray-900">{{ name }}</div>
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <template v-if="totalReviews > 0">
            <span class="text-amber-500">★ {{ rating.toFixed(1) }}</span>
            <span class="text-gray-400">({{ totalReviews }})</span>
          </template>
          <span v-else>Sem avaliações</span>
          <span>•</span>
          <span>{{ completedFreights }} fretes concluídos</span>
        </div>
      </div>
    </div>
  </div>
</template>
