<script setup lang="ts">
import type { PublicProfile } from '~~/domains/users/entities/public-profile.entity'
import UserAvatar from '~/components/ui/UserAvatar.vue'
import StarRating from '~/components/ui/StarRating.vue'

interface Props {
  profile: PublicProfile
}

const props = defineProps<Props>()

const roleLabel = computed(() => (props.profile.roleType === 'CARRIER' ? 'Fretista' : 'Cliente'))

const completedLabel = computed(() =>
  props.profile.roleType === 'CARRIER' ? 'fretes realizados' : 'fretes concluídos'
)

const memberSince = computed(() =>
  new Date(props.profile.memberSince).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric'
  })
)
</script>

<template>
  <div class="bg-white rounded-xl p-6 shadow-sm">
    <div class="flex flex-col sm:flex-row sm:items-center gap-6">
      <UserAvatar size="lg" :alt="profile.name" />

      <div class="flex-1">
        <div class="flex flex-wrap items-center gap-3 mb-1">
          <h1 class="text-2xl font-bold text-gray-900">{{ profile.name }}</h1>
          <span class="badge badge-outline">{{ roleLabel }}</span>
          <span v-if="profile.status === 'SUSPENDED'" class="badge badge-error text-white"
            >Suspenso</span
          >
        </div>
        <p class="text-sm text-gray-500">{{ profile.cityName }} • Membro desde {{ memberSince }}</p>
      </div>

      <div class="grid grid-cols-2 gap-6 text-center">
        <div>
          <template v-if="profile.stats.totalReviews > 0">
            <div class="text-2xl font-bold text-gray-900">
              {{ profile.stats.averageRating.toFixed(1) }}
            </div>
            <StarRating :rating="profile.stats.averageRating" size="sm" />
            <div class="text-xs text-gray-500">
              {{ profile.stats.totalReviews }}
              {{ profile.stats.totalReviews === 1 ? 'avaliação' : 'avaliações' }}
            </div>
          </template>
          <template v-else>
            <div class="text-sm text-gray-500">Sem avaliações</div>
          </template>
        </div>
        <div>
          <div class="text-2xl font-bold text-gray-900">{{ profile.stats.completedFreights }}</div>
          <div class="text-xs text-gray-500">{{ completedLabel }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
