<script setup lang="ts">
import type { Carrier } from '~~/domains/carriers/entities/carrier.entity'

interface Props {
  carrier: Carrier
}

defineProps<Props>()

function whatsappUrl(phone: string) {
  const cleaned = phone.replace(/\D/g, '')
  return `https://wa.me/${cleaned}`
}

function phoneUrl(phone: string) {
  const cleaned = phone.replace(/[^\d+]/g, '')
  return `tel:${cleaned}`
}

function formatRating(rating: number): string {
  return rating.toFixed(1)
}
</script>

<template>
  <div class="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
    <!-- Header -->
    <div class="flex items-start justify-between mb-3">
      <div>
        <a :href="`/users/${carrier.id}`" class="hover:text-amber-600">
          <h3 class="text-lg font-bold text-gray-900">{{ carrier.name }}</h3>
        </a>
        <p class="text-sm text-gray-500">{{ carrier.cityName }}</p>
      </div>
      <div v-if="carrier.reviewStats.totalReviews > 0" class="flex items-center gap-1">
        <span class="text-yellow-500">⭐</span>
        <span class="text-sm font-medium">{{
          formatRating(carrier.reviewStats.averageRating)
        }}</span>
        <span class="text-xs text-gray-500">({{ carrier.reviewStats.totalReviews }})</span>
      </div>
    </div>

    <!-- Vehicles -->
    <div class="mb-4">
      <div class="text-xs font-semibold text-gray-500 mb-2">VEÍCULOS</div>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="vehicle in carrier.vehicles"
          :key="vehicle.id"
          class="badge badge-outline text-xs"
        >
          {{ vehicle.vehicleCategoryName }} — {{ vehicle.model }} ({{ vehicle.capacityKg }}kg)
        </span>
      </div>
    </div>

    <!-- Contact Buttons -->
    <div class="grid grid-cols-2 gap-2">
      <a :href="phoneUrl(carrier.phoneNumber)" class="btn btn-sm btn-outline w-full"> Ligar </a>
      <a
        :href="whatsappUrl(carrier.phoneNumber)"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-sm bg-green-500 text-white border-none hover:bg-green-600 w-full"
      >
        WhatsApp
      </a>
    </div>
  </div>
</template>
