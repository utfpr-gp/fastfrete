<script setup lang="ts">
import { createFreightService } from '~~/domains/freights/composition'
import type { AdminFreight, FreightStatus } from '~~/domains/freights/entities/freight.entity'
import AdminNav from '~/components/admin/AdminNav.vue'
import StatusBadge from '~/components/ui/StatusBadge.vue'

const STATUS_OPTIONS: { value: FreightStatus; label: string }[] = [
  { value: 'OPEN', label: 'Aguardando propostas' },
  { value: 'NEGOTIATING', label: 'Negociando' },
  { value: 'IN_PROGRESS', label: 'Em andamento' },
  { value: 'COMPLETED', label: 'Concluído' },
  { value: 'CANCELLED', label: 'Cancelado' }
]

const route = useRoute()
const router = useRouter()
const toast = useToast()
const freightService = createFreightService()

const freights = ref<AdminFreight[]>([])
const loading = ref(true)
const total = ref(0)
const totalPages = ref(0)

function updateQuery(changes: Record<string, string | null>) {
  const merged = { ...route.query, ...changes }
  const query = Object.fromEntries(Object.entries(merged).filter(([, value]) => value))
  router.push({ query })
}

const search = computed(() => (route.query.search as string) || '')
const filterStatus = computed(() => (route.query.status as FreightStatus) || null)
const currentPage = computed(() => Number(route.query.page) || 1)

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

async function loadFreights() {
  loading.value = true
  const result = await freightService.findAllAdmin({
    search: search.value || undefined,
    status: filterStatus.value || undefined,
    page: currentPage.value,
    limit: 10
  })

  if (result.success) {
    freights.value = result.data.data
    total.value = result.data.meta.total
    totalPages.value = result.data.meta.totalPages
  } else {
    toast.error({ title: 'Erro ao carregar fretes', message: result.error.message })
  }
  loading.value = false
}

watch(() => [route.query.search, route.query.status, route.query.page], loadFreights)

onMounted(loadFreights)
</script>

<template>
  <div class="flex flex-col gap-6">
    <h1 class="text-2xl font-bold">Gestão de Fretes</h1>

    <AdminNav />

    <div class="bg-white rounded-xl p-4 shadow-sm">
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex-1 min-w-48">
          <input
            type="text"
            placeholder="Buscar por título..."
            class="input input-bordered w-full"
            :value="search"
            @change="
              updateQuery({ search: ($event.target as HTMLInputElement).value.trim(), page: '1' })
            "
          />
        </div>
        <select
          class="select select-bordered"
          :value="filterStatus || ''"
          @change="
            updateQuery({ status: ($event.target as HTMLSelectElement).value || null, page: '1' })
          "
        >
          <option value="">Todos os status</option>
          <option v-for="option in STATUS_OPTIONS" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="bg-white rounded-xl p-12 flex justify-center">
      <span class="loading loading-spinner loading-lg text-amber-500"></span>
    </div>

    <div
      v-else-if="freights.length === 0"
      class="bg-white rounded-xl p-12 flex flex-col items-center gap-3"
    >
      <div class="text-6xl">📦</div>
      <div class="font-bold text-xl">Nenhum frete encontrado</div>
      <div class="text-gray-500">Tente ajustar os filtros de busca.</div>
    </div>

    <div v-else>
      <div class="text-sm text-gray-500 mb-4">
        {{ total }} frete{{ total !== 1 ? 's' : '' }} encontrado{{ total !== 1 ? 's' : '' }}
      </div>

      <div class="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Cliente</th>
              <th>Categoria</th>
              <th>Status</th>
              <th>Propostas</th>
              <th>Criado em</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="freight in freights" :key="freight.id" class="hover">
              <td class="font-medium">{{ freight.title }}</td>
              <td>
                <a :href="`/users/${freight.clientId}`" class="hover:text-amber-600">
                  {{ freight.clientName }}
                </a>
              </td>
              <td>{{ freight.vehicleCategory }}</td>
              <td><StatusBadge :status="freight.status" /></td>
              <td>{{ freight.applicationsCount }}</td>
              <td>{{ formatDate(freight.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="totalPages > 1" class="flex justify-center mt-4">
        <div class="join">
          <button
            class="join-item btn btn-sm"
            :disabled="currentPage <= 1"
            @click="updateQuery({ page: String(currentPage - 1) })"
          >
            «
          </button>
          <button class="join-item btn btn-sm">Página {{ currentPage }} de {{ totalPages }}</button>
          <button
            class="join-item btn btn-sm"
            :disabled="currentPage >= totalPages"
            @click="updateQuery({ page: String(currentPage + 1) })"
          >
            »
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
