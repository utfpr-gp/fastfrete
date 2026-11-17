<script setup lang="ts">
import type { Application } from '~~/domains/applications/entities/application.entity'
import type { PublicProfile } from '~~/domains/users/entities/public-profile.entity'
import UserAvatar from '~/components/ui/UserAvatar.vue'
import StarRating from '~/components/ui/StarRating.vue'

interface Props {
  application: Application
  freightStatus: string
  freighter?: PublicProfile | null
}

defineProps<Props>()

const emit = defineEmits<{
  viewDetails: [application: Application]
  accept: [applicationId: string]
  reject: [applicationId: string]
}>()

function formatPrice(price: string | number) {
  return `R$ ${parseFloat(price.toString()).toFixed(2).replace('.', ',')}`
}
</script>

<template>
  <div class="bg-white rounded-xl p-6 shadow-sm">
    <div class="flex gap-4">
      <UserAvatar size="md" />

      <div class="flex-1">
        <div class="flex justify-between items-start mb-2">
          <div>
            <h3 class="font-semibold text-gray-900">{{ freighter?.name ?? 'Fretista' }}</h3>
            <div
              v-if="freighter && freighter.stats.totalReviews > 0"
              class="flex items-center gap-1 text-sm text-gray-600"
            >
              <StarRating :rating="freighter.stats.averageRating" size="sm" />
              <span>{{ freighter.stats.averageRating.toFixed(1) }}</span>
              <span class="text-gray-400">•</span>
              <span>{{ freighter.stats.totalReviews }} avaliações</span>
            </div>
            <div v-else class="text-sm text-gray-500">Sem avaliações</div>
          </div>

          <div class="text-right">
            <div class="text-xs text-gray-500 mb-1">Preço Proposto</div>
            <div class="text-xl font-bold text-gray-900">
              {{ formatPrice(application.proposedPrice) }}
            </div>
          </div>
        </div>

        <div class="mb-3">
          <div class="text-xs font-semibold text-gray-500 mb-1">
            VEÍCULO: {{ application.vehicle?.vehicleCategoryName || 'Não informado' }}
          </div>
          <p class="text-sm text-gray-600 line-clamp-2">
            {{ application.message || 'Sem mensagem do fretista.' }}
          </p>
        </div>

        <div class="flex justify-between items-center gap-2">
          <div class="flex gap-4">
            <button
              class="text-sm text-amber-600 hover:text-amber-700 font-medium"
              @click="emit('viewDetails', application)"
            >
              Ver Proposta
            </button>
            <a
              :href="`/users/${application.freighterId}`"
              class="text-sm text-amber-600 hover:text-amber-700 font-medium"
            >
              Ver Perfil
            </a>
          </div>

          <div v-if="freightStatus === 'OPEN'" class="flex gap-2">
            <button
              class="btn btn-sm btn-outline btn-error"
              @click="emit('reject', application.id)"
            >
              Rejeitar
            </button>
            <button
              class="btn btn-sm bg-amber-500 text-white border-none hover:bg-amber-600"
              @click="emit('accept', application.id)"
            >
              Escolher Fretista
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
