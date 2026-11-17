<script setup lang="ts">
import { createCarrierService } from '~~/domains/carriers/composition'
import type { Carrier } from '~~/domains/carriers/entities/carrier.entity'
import CarrierCard from '~/components/carriers/CarrierCard.vue'

interface Props {
  vehicleCategory: string
  excludeIds?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  excludeIds: () => []
})

const toast = useToast()
const carrierService = createCarrierService()

const carriers = ref<Carrier[]>([])
const loading = ref(true)

const suggestions = computed(() =>
  carriers.value
    .filter((carrier) => !props.excludeIds.includes(carrier.id))
    .sort(
      (a, b) =>
        b.reviewStats.averageRating - a.reviewStats.averageRating ||
        b.reviewStats.totalReviews - a.reviewStats.totalReviews
    )
)

onMounted(async () => {
  const result = await carrierService.findAll({
    vehicleCategory: props.vehicleCategory,
    limit: 50
  })

  if (result.success) {
    carriers.value = result.data.data
  } else {
    toast.error({ title: 'Erro ao carregar fretistas', message: result.error.message })
  }
  loading.value = false
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <p class="text-sm text-gray-600">
      Fretistas com veículo da categoria <strong>{{ vehicleCategory }}</strong
      >, ordenados pela avaliação. Entre em contato para combinar o serviço.
    </p>

    <div v-if="loading" class="flex justify-center py-12">
      <span class="loading loading-spinner loading-lg text-amber-500"></span>
    </div>

    <div v-else-if="suggestions.length === 0" class="text-center py-12 text-gray-500">
      Nenhum fretista com veículo da categoria {{ vehicleCategory }} disponível para sugerir.
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <CarrierCard v-for="carrier in suggestions" :key="carrier.id" :carrier="carrier" />
    </div>
  </div>
</template>
