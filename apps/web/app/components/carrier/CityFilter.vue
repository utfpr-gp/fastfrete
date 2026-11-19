<script setup lang="ts">
import type { City } from '~~/domains/cities/entities/city.entity'

interface Props {
  cities: City[]
}

defineProps<Props>()

const model = defineModel<string | null>()
</script>

<template>
  <div class="flex items-center gap-2">
    <span class="text-sm text-gray-600">Cidade:</span>
    <select
      :value="model || ''"
      class="select select-bordered select-sm bg-white outline-0"
      @change="model = ($event.target as HTMLSelectElement).value || null"
    >
      <option value="">Todas as cidades</option>
      <option v-for="city in cities" :key="city.id" :value="city.id">
        {{ city.name }}
      </option>
    </select>
  </div>
</template>
