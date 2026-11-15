<script setup lang="ts">
interface Props {
  categories: string[]
}

defineProps<Props>()

const model = defineModel<string | null>()
</script>

<template>
  <div class="flex items-center gap-2">
    <span class="text-sm text-gray-600">Veículo:</span>
    <select
      :value="model || ''"
      class="select select-bordered select-sm bg-white outline-0"
      @change="model = ($event.target as HTMLSelectElement).value || null"
    >
      <option value="">Todas as categorias</option>
      <option v-for="category in categories" :key="category" :value="category">
        {{ category }}
      </option>
    </select>
  </div>
</template>
