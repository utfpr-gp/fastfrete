<script setup lang="ts">
import type { Application } from '~~/domains/applications/entities/application.entity'
import UserAvatar from '~/components/ui/UserAvatar.vue'

interface Props {
  application: Application
  freightStatus: string
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
  accept: [applicationId: string]
  reject: [applicationId: string]
}>()

function formatPrice(price: string | number) {
  return `R$ ${parseFloat(price.toString()).toFixed(2).replace('.', ',')}`
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}
</script>

<template>
  <div
    class="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
    @click.self="emit('close')"
  >
    <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-start mb-6">
          <h2 class="text-xl font-bold">Detalhes da Proposta</h2>
          <button
            class="btn btn-ghost btn-sm btn-circle"
            @click="emit('close')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="space-y-6">
          <!-- Informações do Fretista -->
          <div class="flex gap-4">
            <UserAvatar size="lg" />

            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 mb-1">Fretista</h3>
              <div class="flex items-center gap-2 mb-2">
                <div class="flex items-center gap-1">
                  <span class="text-yellow-500">⭐⭐⭐⭐⭐</span>
                  <span class="text-sm font-medium">4.8</span>
                </div>
                <span class="text-gray-400">•</span>
                <span class="text-sm text-gray-600">12 avaliações</span>
              </div>
              <p class="text-sm text-gray-600">
                Fretista experiente com avaliações positivas. Disponível para fretes na região de Guarapuava.
              </p>
            </div>
          </div>

          <!-- Veículo -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-sm font-semibold text-gray-700 mb-3">Veículo</h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-500">Categoria:</span>
                <span class="ml-2 font-medium">{{ application.vehicle?.vehicleCategoryName || 'Não informado' }}</span>
              </div>
              <div>
                <span class="text-gray-500">Modelo:</span>
                <span class="ml-2 font-medium">{{ application.vehicle?.model || 'Não informado' }}</span>
              </div>
              <div>
                <span class="text-gray-500">Placa:</span>
                <span class="ml-2 font-medium">{{ application.vehicle?.plate || 'Não informado' }}</span>
              </div>
              <div>
                <span class="text-gray-500">Capacidade:</span>
                <span class="ml-2 font-medium">{{ application.vehicle?.capacityKg || 'Não informado' }} kg</span>
              </div>
            </div>
          </div>

          <!-- Preço Proposto -->
          <div class="bg-amber-50 rounded-lg p-4">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-700">Preço Proposto</span>
              <span class="text-2xl font-bold text-amber-600">
                {{ formatPrice(application.proposedPrice) }}
              </span>
            </div>
          </div>

          <!-- Data da Proposta -->
          <div class="text-sm text-gray-600">
            <span class="font-medium">Proposta enviada em:</span>
            {{ formatDate(application.createdAt) }}
          </div>
        </div>

        <!-- Ações -->
        <div v-if="freightStatus === 'OPEN'" class="flex gap-3 mt-6 pt-6 border-t">
          <button
            class="btn btn-outline btn-error flex-1"
            @click="emit('reject', application.id)"
          >
            Rejeitar Proposta
          </button>
          <button
            class="btn bg-amber-500 text-white border-none hover:bg-amber-600 flex-1"
            @click="emit('accept', application.id)"
          >
            Escolher Fretista
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
