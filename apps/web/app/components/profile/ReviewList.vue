<script setup lang="ts">
import type { Review } from '~~/domains/reviews/entities/review.entity'
import StarRating from '~/components/ui/StarRating.vue'

interface Props {
  reviews: Review[]
  total: number
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  loadMore: []
}>()

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}
</script>

<template>
  <div class="bg-white rounded-xl p-6 shadow-sm">
    <h2 class="text-lg font-bold text-gray-900 mb-4">Avaliações ({{ total }})</h2>

    <div v-if="reviews.length === 0 && !loading" class="text-center py-8 text-gray-500">
      Nenhuma avaliação recebida ainda.
    </div>

    <ul v-else class="divide-y divide-gray-100">
      <li v-for="review in reviews" :key="review.id" class="py-4">
        <div class="flex items-center justify-between gap-3 mb-1">
          <div class="flex items-center gap-2 min-w-0">
            <StarRating :rating="review.rating" size="sm" />
            <a
              v-if="review.reviewer"
              :href="`/users/${review.reviewer.id}`"
              class="text-sm font-medium text-gray-900 hover:text-amber-600 truncate"
            >
              {{ review.reviewer.name }}
            </a>
          </div>
          <span class="text-xs text-gray-500 shrink-0">{{ formatDate(review.createdAt) }}</span>
        </div>

        <p v-if="review.freightTitle" class="text-xs text-gray-500 mb-1">
          Frete: {{ review.freightTitle }}
        </p>
        <p v-if="review.comment" class="text-sm text-gray-700">{{ review.comment }}</p>
        <p v-else class="text-sm text-gray-500 italic">Sem comentário.</p>
      </li>
    </ul>

    <div v-if="loading" class="flex justify-center py-4">
      <span class="loading loading-spinner text-amber-500"></span>
    </div>

    <div v-if="reviews.length < total && !loading" class="flex justify-center mt-4">
      <button class="btn btn-sm btn-outline" @click="emit('loadMore')">Ver mais avaliações</button>
    </div>
  </div>
</template>
