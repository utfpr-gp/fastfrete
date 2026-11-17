<script setup lang="ts">
import type { Freight } from '~~/domains/freights/entities/freight.entity'
import StatusBadge from '~/components/ui/StatusBadge.vue'
import { formatCurrency } from '~/support/price'

interface Props {
  freight: Freight
  proposalsCount?: number
}

defineProps<Props>()

function formatDate(date: string | null) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}
</script>

<template>
  <div class="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
    <div class="flex justify-between items-start mb-3">
      <h3 class="text-lg font-bold text-gray-900 truncate">{{ freight.title }}</h3>
      <StatusBadge :status="freight.status" />
    </div>

    <div class="mb-3">
      <span class="badge badge-outline text-xs">{{ freight.vehicleCategory }}</span>
    </div>

    <div class="space-y-2 text-sm text-gray-600 mb-3">
      <div class="flex items-center gap-1 truncate">
        <span class="text-gray-500">📍</span>
        <span
          >De: {{ freight.originStreet }}, {{ freight.originDistrict }} -
          {{ freight.originCity.name }}</span
        >
      </div>
      <div class="flex items-center gap-1 truncate">
        <span class="text-gray-500">📍</span>
        <span
          >Para: {{ freight.destinationStreet }}, {{ freight.destinationDistrict }} -
          {{ freight.destinationCity.name }}</span
        >
      </div>
      <div v-if="freight.suggestedPrice" class="flex items-center gap-1 text-nowrap">
        <span class="text-gray-500">💰</span>
        <span>Valor sugerido: {{ formatCurrency(freight.suggestedPrice) }}</span>
      </div>
      <div class="flex items-center gap-1 text-nowrap">
        <span class="text-gray-500">📅</span>
        <span>{{
          freight.dateMode === 'IMMEDIATE'
            ? 'O mais rápido possível'
            : formatDate(freight.exactDatetime)
        }}</span>
      </div>
    </div>

    <div class="text-sm text-gray-500 mb-4">{{ proposalsCount ?? 0 }} {{ (proposalsCount ?? 0) === 1 ? 'proposta recebida' : 'propostas recebidas' }}</div>

    <a
      :href="`/client/freights/${freight.id}`"
      class="btn btn-sm bg-amber-500 text-gray-900 border-none hover:bg-amber-400 w-full"
    >
      Ver Detalhes
    </a>
  </div>
</template>
