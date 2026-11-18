<script setup lang="ts">
import { createFreightService } from '~~/domains/freights/composition'
import type { Freight } from '~~/domains/freights/entities/freight.entity'
import { createCityService } from '~~/domains/cities/composition'
import type { City } from '~~/domains/cities/entities/city.entity'
import type {
  FreightOrderBy,
  FreightsFilterDto
} from '~~/domains/freights/dtos/freights-filter.dto'
import { createApplicationService } from '~~/domains/applications/composition'
import { createUserService } from '~~/domains/users/composition'
import type { PublicProfileStats } from '~~/domains/users/entities/public-profile.entity'
import { useAuthStore } from '~~/stores/auth'
import { VEHICLE_CATEGORIES } from '~/support/vehicle-categories'
import MetricCard from '~/components/carrier/MetricCard.vue'
import CategoryFilter from '~/components/carrier/CategoryFilter.vue'
import CityFilter from '~/components/carrier/CityFilter.vue'
import FreightOpportunityCard from '~/components/carrier/FreightOpportunityCard.vue'

const route = useRoute()
const router = useRouter()
const { user } = useAuthStore()
const freightService = createFreightService()
const cityService = createCityService()
const applicationService = createApplicationService()
const userService = createUserService()

const freights = ref<Freight[]>([])
const cities = ref<City[]>([])
const loading = ref(true)
const stats = ref<PublicProfileStats | null>(null)
const inProgressCount = ref<number | null>(null)

const ratingValue = computed(() => {
  if (!stats.value) return '—'
  if (stats.value.totalReviews === 0) return 'Sem avaliações'
  return `${stats.value.averageRating.toFixed(1)} / 5.0`
})

const ratingSubtitle = computed(() => {
  const total = stats.value?.totalReviews ?? 0
  return `Baseado em ${total} avaliaç${total === 1 ? 'ão' : 'ões'}`
})

const completedValue = computed(() => String(stats.value?.completedFreights ?? '—'))

const inProgressValue = computed(() => {
  if (inProgressCount.value === null) return '—'
  return `${inProgressCount.value} aceito${inProgressCount.value === 1 ? '' : 's'}`
})

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

const selectedCity = computed({
  get: () => (route.query.city as string) || null,
  set: (value) => {
    const query = { ...route.query }
    if (value) {
      query.city = value
    } else {
      delete query.city
    }
    router.push({ query })
  }
})

const compatibleOnly = computed({
  get: () => route.query.compatible !== '0',
  set: (value) => {
    const query = { ...route.query }
    if (value) {
      delete query.compatible
    } else {
      query.compatible = '0'
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
  const filter: FreightsFilterDto = {
    limit: 50,
    compatibleOnly: compatibleOnly.value
  }
  if (selectedCategory.value) {
    filter.vehicleCategory = selectedCategory.value
  }
  if (selectedCity.value) {
    filter.cityId = selectedCity.value
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

async function loadCities() {
  const result = await cityService.findAll()

  if (result.success) {
    cities.value = result.data
  }
}

async function loadMetrics() {
  const [profile, accepted] = await Promise.all([
    user?.id ? userService.getPublicProfile(user.id) : null,
    applicationService.findMyApplications({ status: 'ACCEPTED', limit: 1 })
  ])
  if (profile?.success) stats.value = profile.data.stats
  if (accepted.success) inProgressCount.value = accepted.data.meta.total
}

watch(
  () => [route.query.category, route.query.orderBy, route.query.city, route.query.compatible],
  () => {
    loadFreights()
  }
)

await Promise.all([loadCities(), loadFreights(), loadMetrics()])
</script>

<template>
  <div class="min-h-screen">
    <main>
      <!-- Saudação -->
      <div class="mb-8">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              👋 {{ getGreeting() }}, {{ user?.name || 'Fretista' }}!
            </h1>
            <p class="text-gray-600 mt-2">
              Confira as oportunidades de frete para o seu veículo hoje.
            </p>
          </div>
          <a href="/carrier/applications" class="btn btn-outline btn-sm"> Minhas Candidaturas </a>
          <a href="/carrier/vehicles" class="btn btn-outline btn-sm"> Meus Veículos </a>
        </div>
      </div>

      <!-- Métricas -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          icon="✅"
          title="Fretes concluídos"
          :value="completedValue"
          subtitle="Total na plataforma"
        />
        <MetricCard
          icon="🚚"
          title="Em andamento"
          :value="inProgressValue"
          subtitle="Candidaturas aceitas"
        />
        <MetricCard
          icon="⭐"
          title="Sua avaliação"
          :value="ratingValue"
          :subtitle="ratingSubtitle"
        />
      </div>

      <!-- Filtros e Ordenação -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div class="flex flex-wrap items-center gap-4">
          <CategoryFilter v-model="selectedCategory" :categories="[...VEHICLE_CATEGORIES]" />
          <CityFilter v-model="selectedCity" :cities="cities" />
          <label class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              v-model="compatibleOnly"
              type="checkbox"
              class="checkbox checkbox-sm checkbox-warning"
            />
            Somente compatíveis com meus veículos
          </label>
        </div>

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
          Não há fretes disponíveis para os filtros selecionados no momento.
        </p>
        <p v-if="compatibleOnly" class="text-sm text-gray-500 mt-2">
          Só aparecem fretes compatíveis com seus veículos ativos.
          <a href="/carrier/vehicles" class="text-amber-600 hover:text-amber-700 font-medium"
            >Gerenciar veículos</a
          >
        </p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FreightOpportunityCard v-for="freight in freights" :key="freight.id" :freight="freight" />
      </div>
    </main>
  </div>
</template>
