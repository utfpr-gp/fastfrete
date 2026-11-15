<script setup lang="ts">
interface Props {
  suggestedPrice?: number
  vehicleCategory: string
  dateLabel: string
  distance?: string
}

defineProps<Props>()
</script>

<template>
  <div class="flex gap-4">
    <div v-if="suggestedPrice" class="bg-white rounded-lg p-4">
      <div class="text-xs text-gray-500 mb-1">VALOR SUGERIDO</div>
      <div class="text-lg font-bold text-gray-900">
        {{ suggestedPrice ? `R$ ${suggestedPrice.toFixed(2).replace('.', ',')}` : '—' }}
      </div>
    </div>

    <div class="bg-white rounded-lg p-4">
      <div class="text-xs text-gray-500 mb-1">VEÍCULO</div>
      <div class="text-lg font-bold text-gray-900 flex items-center gap-2">
        <span class="text-amber-500">🚚</span>
        {{ vehicleCategory }}
      </div>
    </div>

    <div class="bg-white rounded-lg p-4">
      <div class="text-xs text-gray-500 mb-1">DATA</div>
      <div class="text-lg font-bold text-gray-900 flex items-center gap-2">
        <span class="text-amber-500">📅</span>
        {{ dateLabel }}
      </div>
    </div>

    <div v-if="distance" class="bg-white rounded-lg p-4">
      <div class="text-xs text-gray-500 mb-1">DISTÂNCIA</div>
      <div class="text-lg font-bold text-gray-900 flex items-center gap-2">
        <span class="text-amber-500">📍</span>
        {{ distance }}
      </div>
    </div>
  </div>
</template>
