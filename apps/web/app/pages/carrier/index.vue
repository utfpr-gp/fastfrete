<script setup lang="ts">
import { createFreightService } from '~~/domains/freights/composition'
import type { Freight } from '~~/domains/freights/entities/freight.entity'
import type { FreightOrderBy } from '~~/domains/freights/dtos/freights-filter.dto'
import { useAuthStore } from '~~/stores/auth'
import { VEHICLE_CATEGORIES } from '~/support/vehicle-categories'
import MetricCard from '~/components/carrier/MetricCard.vue'
import CategoryFilter from '~/components/carrier/CategoryFilter.vue'
import FreightOpportunityCard from '~/components/carrier/FreightOpportunityCard.vue'

const route = useRoute()
const router = useRouter()
const { user } = useAuthStore()
const freightService = createFreightService()

const freights = ref<Freight[]>([])
const loading = ref(true)

const selectedCategory = computed({
  get: () => (route.query.category as string) || null,
  set: (value) => {
    const query = { ...route.query }
    if (value) {
      query.category = value
    } else {
      delete query.category
    }
    router.push({ query })
  }
})

const sortBy = computed({
  get: () => (route.query.orderBy as FreightOrderBy) || 'recent',
  set: (value) => {
    const query = { ...route.query }
    if (value && value !== 'recent') {
      query.orderBy = value
    } else {
      delete query.orderBy
    }
    router.push({ query })
  }
})

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

async function loadFreights() {
  loading.value = true
  const filter: { limit: number; vehicleCategory?: string; orderBy?: FreightOrderBy } = {
    limit: 50
  }
  if (selectedCategory.value) {
    filter.vehicleCategory = selectedCategory.value
  }
  if (sortBy.value) {
    filter.orderBy = sortBy.value
  }
  const result = await freightService.findAllOpen(filter)

  if (result.success) {
    freights.value = result.data.data
  }

  loading.value = false
}

watch(
  () => [route.query.category, route.query.orderBy],
  () => {
    loadFreights()
  }
)

await loadFreights()
</script>

<template>
  <div class="min-h-screen">
    <main>
      <!-- Saudação -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">
          👋 {{ getGreeting() }}, {{ user?.name || 'Fretista' }}!
        </h1>
        <p class="text-gray-600 mt-2">Confira as oportunidades de frete para o seu veículo hoje.</p>
      </div>

      <!-- Métricas -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard icon="💰" title="Ganhos da semana" value="R$ 420,00" subtitle="Esta semana" />
        <MetricCard icon="🚚" title="Próximos fretes" value="2 agendados" subtitle="Esta semana" />
        <MetricCard
          icon="⭐"
          title="Sua avaliação"
          value="4.9 / 5.0"
          subtitle="Baseado em 12 avaliações"
        />
      </div>

      <!-- Filtros e Ordenação -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <CategoryFilter v-model="selectedCategory" :categories="[...VEHICLE_CATEGORIES]" />

        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-600">Ordenar por:</span>
          <select v-model="sortBy" class="select select-bordered select-sm bg-white outline-0">
            <option value="recent">Mais Recentes</option>
            <option value="oldest">Mais Antigos</option>
          </select>
        </div>
      </div>

      <!-- Grid de Fretes -->
      <div v-if="loading" class="flex justify-center py-12">
        <span class="loading loading-spinner loading-lg text-amber-500"></span>
      </div>

      <div v-else-if="freights.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">📦</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Nenhum frete disponível</h3>
        <p class="text-gray-600">
          Não há fretes disponíveis para a categoria selecionada no momento.
        </p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FreightOpportunityCard v-for="freight in freights" :key="freight.id" :freight="freight" />
      </div>
    </main>
  </div>
</template>
