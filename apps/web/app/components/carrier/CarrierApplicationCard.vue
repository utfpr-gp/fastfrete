<script setup lang="ts">
import type { Application } from '~~/domains/applications/entities/application.entity'
import type { Freight } from '~~/domains/freights/entities/freight.entity'

interface Props {
  application: Application
  freight: Freight | null
  loading?: boolean
  withdrawing?: boolean
  completing?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  withdraw: [applicationId: string]
  complete: [applicationId: string]
}>()

function formatPrice(price: string | number) {
  return `R$ ${parseFloat(price.toString()).toFixed(2).replace('.', ',')}`
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

function formatDateTime(date: string | null) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

function getStatusBadge(status: string) {
  const statusMap: Record<string, { label: string; class: string }> = {
    PENDING: { label: 'Pendente', class: 'bg-yellow-100 text-yellow-700' },
    ACCEPTED: { label: 'Aceita', class: 'bg-green-100 text-green-700' },
    REJECTED: { label: 'Rejeitada', class: 'bg-red-100 text-red-700' },
    WITHDRAWN: { label: 'Retirada', class: 'bg-gray-100 text-gray-700' },
    COMPLETED: { label: 'Concluída', class: 'bg-blue-100 text-blue-700' }
  }
  return statusMap[status] || { label: status, class: 'bg-gray-100 text-gray-700' }
}
</script>

<template>
  <div class="bg-white rounded-xl p-5 shadow-sm">
    <!-- Loading freight data -->
    <div v-if="loading" class="flex justify-center py-8">
      <span class="loading loading-spinner loading-md text-amber-500"></span>
    </div>

    <!-- Freight not available (WITHDRAWN/REJECTED) -->
    <div v-else-if="!freight" class="space-y-3">
      <div class="flex justify-between items-start">
        <h3 class="text-lg font-bold text-gray-900 truncate flex-1">Frete indisponível</h3>
        <span class="badge text-xs flex-shrink-0 ml-2" :class="getStatusBadge(application.status).class">
          {{ getStatusBadge(application.status).label }}
        </span>
      </div>
      <div class="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span class="text-gray-500">Valor proposto:</span>
          <span class="ml-1 font-semibold text-gray-900">{{ formatPrice(application.proposedPrice) }}</span>
        </div>
        <div>
          <span class="text-gray-500">Veículo:</span>
          <span class="ml-1 font-medium text-gray-900">{{ application.vehicle?.vehicleCategoryName || 'N/A' }}</span>
        </div>
        <div class="col-span-2">
          <span class="text-gray-500">Enviada em:</span>
          <span class="ml-1 text-gray-900">{{ formatDate(application.createdAt) }}</span>
        </div>
      </div>
      <p class="text-xs text-gray-400 text-center">Detalhes do frete não estão mais disponíveis.</p>
    </div>

    <template v-else>
      <!-- Header: Título + Status -->
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-lg font-bold text-gray-900 truncate flex-1">{{ freight.title }}</h3>
        <span class="badge text-xs shrink-0 ml-2" :class="getStatusBadge(application.status).class">
          {{ getStatusBadge(application.status).label }}
        </span>
      </div>

      <!-- Informações do Frete -->
      <div class="space-y-3 mb-4">
        <!-- Origem -->
        <div class="flex items-start gap-2">
          <span class="text-xs font-semibold text-gray-500 w-16 shrink-0">ORIGEM</span>
          <span class="text-sm text-gray-900">
            {{ freight.originStreet }}, {{ freight.originNumber }} - {{ freight.originDistrict }},
            {{ freight.originCity.name }}
          </span>
        </div>

        <!-- Destino -->
        <div class="flex items-start gap-2">
          <span class="text-xs font-semibold text-gray-500 w-16 shrink-0">DESTINO</span>
          <span class="text-sm text-gray-900">
            {{ freight.destinationStreet }}, {{ freight.destinationNumber }} -
            {{ freight.destinationDistrict }}, {{ freight.destinationCity.name }}
          </span>
        </div>

        <!-- Data do Frete -->
        <div class="flex items-start gap-2">
          <span class="text-xs font-semibold text-gray-500 w-16 shrink-0">DATA</span>
          <span class="text-sm text-gray-900">
            {{
              freight.dateMode === 'IMMEDIATE'
                ? 'O mais rápido possível'
                : freight.dateMode === 'FLEXIBLE'
                  ? freight.availabilityWindow || 'Janela flexível'
                  : formatDateTime(freight.exactDatetime)
            }}
          </span>
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t border-gray-100 my-4"></div>

      <!-- Informações da Proposta -->
      <div class="grid grid-cols-2 gap-3 text-sm mb-4">
        <div>
          <span class="text-gray-500">Valor proposto:</span>
          <span class="ml-1 font-semibold text-gray-900">{{
            formatPrice(application.proposedPrice)
          }}</span>
        </div>
        <div>
          <span class="text-gray-500">Veículo:</span>
          <span class="ml-1 font-medium text-gray-900">{{
            application.vehicle?.vehicleCategoryName || 'N/A'
          }}</span>
        </div>
        <div class="col-span-2">
          <span class="text-gray-500">Enviada em:</span>
          <span class="ml-1 text-gray-900">{{ formatDate(application.createdAt) }}</span>
        </div>
      </div>

      <!-- Botões Centralizados -->
      <div class="flex justify-center gap-2 pt-2">
        <a :href="`/carrier/freights/${freight.id}`" class="btn btn-sm btn-outline"> Ver Frete </a>
        <button
          v-if="application.status === 'PENDING'"
          class="btn btn-sm btn-outline btn-error"
          :disabled="withdrawing"
          @click="emit('withdraw', application.id)"
        >
          <span v-if="withdrawing" class="loading loading-spinner loading-xs"></span>
          <span v-else>Retirar</span>
        </button>
        <button
          v-if="application.status === 'ACCEPTED'"
          class="btn btn-sm bg-amber-500 text-white border-none hover:bg-amber-600"
          :disabled="completing"
          @click="emit('complete', application.id)"
        >
          <span v-if="completing" class="loading loading-spinner loading-xs"></span>
          <span v-else>Concluir Frete</span>
        </button>
      </div>
    </template>
  </div>
</template>
