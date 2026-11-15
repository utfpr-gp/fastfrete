<script setup lang="ts">
import { createReviewService } from '~~/domains/reviews/composition'
import type { Review } from '~~/domains/reviews/entities/review.entity'

interface Props {
  freightId: string
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
  submitted: [review: Review]
}>()

const reviewService = createReviewService()

const rating = ref(5)
const comment = ref('')
const submitting = ref(false)

const ratingLabel = computed(() => {
  const labels: Record<number, string> = {
    1: 'Péssimo',
    2: 'Ruim',
    3: 'Regular',
    4: 'Bom',
    5: 'Excelente'
  }
  return labels[rating.value] || ''
})

function resetForm() {
  rating.value = 5
  comment.value = ''
}

async function submitReview() {
  const props = getCurrentInstance()?.props as Props
  if (!props?.freightId) return

  submitting.value = true

  const result = await reviewService.create(props.freightId, {
    rating: rating.value,
    comment: comment.value || undefined
  })

  submitting.value = false

  if (result.success) {
    resetForm()
    emit('submitted', result.data)
  } else {
    const toast = useToast()
    toast.error({ title: 'Erro ao enviar avaliação', message: result.error.message })
  }
}
</script>

<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="emit('close')"
  >
    <div class="bg-white rounded-xl max-w-md w-full">
      <div class="p-6">
        <div class="flex justify-between items-start mb-6">
          <h2 class="text-xl font-bold">Avaliar Fretista</h2>
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
          <!-- Rating -->
          <div>
            <label class="text-sm font-medium text-gray-700 mb-2 block">Nota</label>
            <div class="flex gap-2">
              <button
                v-for="star in 5"
                :key="star"
                type="button"
                class="text-3xl transition-transform hover:scale-110"
                :class="star <= rating ? 'text-yellow-400' : 'text-gray-300'"
                @click="rating = star"
              >
                ★
              </button>
            </div>
            <p class="text-sm text-gray-500 mt-1">
              {{ ratingLabel }}
            </p>
          </div>

          <!-- Comment -->
          <div>
            <label class="text-sm font-medium text-gray-700 mb-2 block">
              Comentário <span class="text-gray-400">(opcional)</span>
            </label>
            <textarea
              v-model="comment"
              class="textarea textarea-bordered w-full"
              placeholder="Conte como foi sua experiência..."
              rows="3"
            ></textarea>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 mt-6 pt-6 border-t">
          <button
            class="btn btn-outline flex-1"
            :disabled="submitting"
            @click="emit('close')"
          >
            Cancelar
          </button>
          <button
            class="btn bg-amber-500 text-white border-none hover:bg-amber-600 flex-1"
            :disabled="submitting"
            @click="submitReview"
          >
            <span v-if="submitting" class="loading loading-spinner loading-sm"></span>
            <span v-else>Enviar Avaliação</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
