<script setup lang="ts">
import type { Freight } from '~~/domains/freights/entities/freight.entity'
import { formatStreetAddress } from '~/support/address'
import { formatCurrency } from '~/support/price'
import { formatFreightSchedule } from '~/support/schedule'

interface Props {
  freight: Freight
}

defineProps<Props>()

const config = useRuntimeConfig()

function formatCreatedAt(date: string) {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
    <!-- Image area -->
    <div class="relative h-48 bg-gray-200">
      <img
        v-if="freight.coverPhoto"
        :src="config.public.baseURL + freight.coverPhoto"
        :alt="freight.title"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-gray-500">
        <span class="text-6xl">📦</span>
      </div>

      <!-- Badge -->
      <div class="absolute top-3 left-3">
        <span class="badge bg-amber-500 text-gray-900 border-none text-xs"> DISPONÍVEL AGORA </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-5">
      <div class="flex justify-between items-start mb-3">
        <h3 class="text-lg font-bold text-gray-900 flex-1">
          {{ freight.title }}
        </h3>
      </div>

      <div class="space-y-2 text-sm text-gray-600 mb-4">
        <!-- Endereço de origem -->
        <div class="flex items-start gap-2">
          <span class="text-green-500 mt-0.5">📍</span>
          <div class="text-xs">
            <div class="font-medium text-gray-700">Retirada</div>
            <div>
              {{
                formatStreetAddress(
                  freight.originStreet,
                  freight.originNumber,
                  freight.originDistrict
                )
              }}
            </div>
            <div>{{ freight.originCity.name }} - {{ freight.originCity.state }}</div>
          </div>
        </div>

        <!-- Endereço de destino -->
        <div class="flex items-start gap-2">
          <span class="text-red-500 mt-0.5">📍</span>
          <div class="text-xs">
            <div class="font-medium text-gray-700">Entrega</div>
            <div>
              {{
                formatStreetAddress(
                  freight.destinationStreet,
                  freight.destinationNumber,
                  freight.destinationDistrict
                )
              }}
            </div>
            <div>{{ freight.destinationCity.name }} - {{ freight.destinationCity.state }}</div>
          </div>
        </div>

        <!-- Agendamento -->
        <div class="flex items-center gap-2">
          <span>📅</span>
          <span>{{ formatFreightSchedule(freight) }}</span>
        </div>

        <!-- Veículo -->
        <div class="flex items-center gap-2">
          <span>🚗</span>
          <span>{{ freight.vehicleCategory }}</span>
        </div>

        <!-- Valor sugerido -->
        <div class="flex items-center gap-2">
          <span>💰</span>
          <span v-if="freight.suggestedPrice" class="font-semibold text-gray-900">
            {{ formatCurrency(freight.suggestedPrice) }}
            <span class="font-normal text-gray-500">sugerido</span>
          </span>
          <span v-else class="text-gray-500">Valor a combinar</span>
        </div>

        <!-- Data de criação -->
        <div class="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t">
          <span>🕐</span>
          <span>Criado em {{ formatCreatedAt(freight.createdAt) }}</span>
        </div>
      </div>

      <a
        :href="`/carrier/freights/${freight.id}`"
        class="btn bg-amber-500 text-gray-900 border-none hover:bg-amber-400 w-full"
      >
        Ver Detalhes e Propor
      </a>
    </div>
  </div>
</template>
