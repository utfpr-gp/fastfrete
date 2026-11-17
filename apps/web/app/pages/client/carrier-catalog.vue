<script setup lang="ts">
import { createCarrierService } from '~~/domains/carriers/composition'
import type { Carrier } from '~~/domains/carriers/entities/carrier.entity'
import CarrierCard from '~/components/carriers/CarrierCard.vue'
import PaymentNotice from '~/components/ui/PaymentNotice.vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const carrierService = createCarrierService()

const carriers = ref<Carrier[]>([])
const loading = ref(false)
const total = ref(0)

const VEHICLE_CATEGORIES = [
  'Moto',
  'Van',
  'Carro',
  'Caminhonete',
  'Caminhão 3/4',
  'Caminhão Toco',
  'Caminhão Truck'
]

const selectedCategory = computed({
  get: () => (route.query.vehicleCategory as string) || null,
  set: (value) => {
    const query = { ...route.query }
    if (value) {
      query.vehicleCategory = value
    } else {
      delete query.vehicleCategory
    }
    router.push({ query })
  }
})

async function loadCarriers() {
  loading.value = true
  const result = await carrierService.findAll({
    vehicleCategory: selectedCategory.value || undefined,
    limit: 50
  })

  if (result.success) {
    carriers.value = result.data.data
    total.value = result.data.total
  } else {
    toast.error({ title: 'Erro ao carregar fretistas', message: result.error.message })
  }

  loading.value = false
}

watch(
  () => route.query.vehicleCategory,
  () => {
    loadCarriers()
  }
)

await loadCarriers()
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <button class="btn btn-ghost btn-circle" @click="router.push('/client')">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <h1 class="text-2xl font-bold">Fretistas Disponíveis</h1>
    </div>

    <!-- Filter -->
    <div class="bg-white rounded-xl p-4 shadow-sm">
      <div class="flex items-center gap-4">
        <label for="vehicleCategory" class="text-sm font-medium text-gray-700 whitespace-nowrap">
          Filtrar por veículo:
        </label>
        <select
          id="vehicleCategory"
          class="select select-bordered w-full max-w-xs"
          :value="selectedCategory || ''"
          @change="selectedCategory = ($event.target as HTMLSelectElement).value || null"
        >
          <option value="">Todas as categorias</option>
          <option v-for="category in VEHICLE_CATEGORIES" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
    </div>

    <PaymentNotice />

    <!-- Loading -->
    <div v-if="loading" class="bg-white rounded-xl p-12 flex justify-center">
      <span class="loading loading-spinner loading-lg text-amber-500"></span>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="carriers.length === 0"
      class="bg-white rounded-xl p-12 flex flex-col items-center gap-3"
    >
      <div class="text-6xl">🚚</div>
      <div class="font-bold text-xl">Nenhum fretista encontrado</div>
      <div v-if="selectedCategory" class="text-gray-500">
        Não há fretistas com {{ selectedCategory }} cadastrados no momento.
      </div>
      <div v-else class="text-gray-500">Nenhum fretista cadastrado ainda.</div>
      <button
        v-if="selectedCategory"
        class="btn btn-outline btn-sm"
        @click="selectedCategory = null"
      >
        Limpar filtro
      </button>
    </div>

    <!-- Results -->
    <div v-else>
      <div class="text-sm text-gray-500 mb-4">
        {{ total }} fretista{{ total !== 1 ? 's' : '' }} encontrado{{ total !== 1 ? 's' : '' }}
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <CarrierCard v-for="carrier in carriers" :key="carrier.id" :carrier="carrier" />
      </div>
    </div>
  </div>
</template>
