<script setup lang="ts">
import type { PublicProfileVehicle } from '~~/domains/users/entities/public-profile.entity'

interface Props {
  vehicles: PublicProfileVehicle[]
}

defineProps<Props>()
</script>

<template>
  <div class="bg-white rounded-xl p-6 shadow-sm">
    <h2 class="text-lg font-bold text-gray-900 mb-4">Veículos</h2>

    <div v-if="vehicles.length === 0" class="text-sm text-gray-500">
      Nenhum veículo ativo cadastrado.
    </div>

    <ul v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <li v-for="vehicle in vehicles" :key="vehicle.id" class="rounded-lg bg-gray-50 p-4">
        <div class="text-xs font-semibold text-gray-500 mb-1">
          {{ vehicle.vehicleCategoryName.toUpperCase() }}
        </div>
        <div class="font-medium text-gray-900">{{ vehicle.model }}</div>
        <div class="text-sm text-gray-600">Capacidade: {{ vehicle.capacityKg }} kg</div>
      </li>
    </ul>
  </div>
</template>
