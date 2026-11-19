<script setup lang="ts">
interface Props {
  status: string
}

const props = defineProps<Props>()

const statusConfig = computed(() => {
  const statusMap: Record<string, { label: string; class: string }> = {
    OPEN: { label: 'Aguardando Propostas', class: 'bg-green-100 text-green-700' },
    NEGOTIATING: { label: 'Negociando', class: 'bg-yellow-100 text-yellow-700' },
    IN_PROGRESS: { label: 'Em Andamento', class: 'bg-blue-100 text-blue-700' },
    COMPLETED: { label: 'Concluído', class: 'bg-gray-100 text-gray-700' },
    CANCELLED: { label: 'Cancelado', class: 'bg-red-100 text-red-700' }
  }

  return statusMap[props.status] || { label: props.status, class: 'bg-gray-100 text-gray-700' }
})
</script>

<template>
  <span class="badge text-sm" :class="statusConfig.class">
    {{ statusConfig.label }}
  </span>
</template>
