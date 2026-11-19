<script setup lang="ts">
interface Props {
  images?: string[]
  status: string
}

const props = withDefaults(defineProps<Props>(), {
  images: () => []
})

const currentIndex = ref(0)

const currentImage = computed(() => props.images[currentIndex.value])
const hasMultiple = computed(() => props.images.length > 1)

watch(
  () => props.images,
  () => {
    currentIndex.value = 0
  }
)

function previous() {
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
}

function next() {
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    OPEN: 'DISPONÍVEL',
    NEGOTIATING: 'NEGOCIANDO',
    IN_PROGRESS: 'EM ANDAMENTO',
    COMPLETED: 'CONCLUÍDO',
    CANCELLED: 'CANCELADO'
  }
  return labels[status] || status
}

function getStatusClass(status: string): string {
  const classes: Record<string, string> = {
    OPEN: 'bg-green-100 text-green-700',
    NEGOTIATING: 'bg-yellow-100 text-yellow-700',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    COMPLETED: 'bg-gray-100 text-gray-700',
    CANCELLED: 'bg-red-100 text-red-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="relative rounded-xl overflow-hidden bg-gray-100 h-80">
      <img
        v-if="currentImage"
        :src="currentImage"
        :alt="`Foto ${currentIndex + 1} de ${images.length} do frete`"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <svg class="w-24 h-24 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      </div>

      <div class="absolute top-4 left-4">
        <span class="px-3 py-1 rounded-full text-xs font-semibold" :class="getStatusClass(status)">
          {{ getStatusLabel(status) }}
        </span>
      </div>

      <template v-if="hasMultiple">
        <button
          type="button"
          class="btn btn-circle btn-sm absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 border-none"
          aria-label="Foto anterior"
          @click="previous"
        >
          ‹
        </button>
        <button
          type="button"
          class="btn btn-circle btn-sm absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 border-none"
          aria-label="Próxima foto"
          @click="next"
        >
          ›
        </button>
        <span
          class="absolute bottom-3 right-3 px-2 py-1 rounded-full bg-black/60 text-white text-xs"
        >
          {{ currentIndex + 1 }} / {{ images.length }}
        </span>
      </template>
    </div>

    <div v-if="hasMultiple" class="flex gap-2">
      <button
        v-for="(image, index) in images"
        :key="image"
        type="button"
        class="w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors"
        :class="index === currentIndex ? 'border-amber-500' : 'border-transparent opacity-70'"
        :aria-label="`Ver foto ${index + 1}`"
        :aria-current="index === currentIndex"
        @click="currentIndex = index"
      >
        <img :src="image" alt="" class="w-full h-full object-cover" />
      </button>
    </div>
  </div>
</template>
