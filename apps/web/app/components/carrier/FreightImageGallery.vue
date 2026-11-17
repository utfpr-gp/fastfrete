<script setup lang="ts">
interface Props {
  imageUrl?: string
  status: string
}

defineProps<Props>()

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
  <div class="relative rounded-xl overflow-hidden bg-gray-100 h-80">
    <img v-if="imageUrl" :src="imageUrl" alt="Frete" class="w-full h-full object-cover" />
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
  </div>
</template>
