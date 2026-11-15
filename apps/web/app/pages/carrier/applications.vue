<script setup lang="ts">
import { createApplicationService } from '~~/domains/applications/composition'
import { createFreightService } from '~~/domains/freights/composition'
import type { Application } from '~~/domains/applications/entities/application.entity'
import type { Freight } from '~~/domains/freights/entities/freight.entity'
import CarrierApplicationCard from '~/components/carrier/CarrierApplicationCard.vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const applicationService = createApplicationService()
const freightService = createFreightService()

const applications = ref<Application[]>([])
const freights = ref<Record<string, Freight>>({})
const loadingFreights = ref<Record<string, boolean>>({})
const loading = ref(true)
const withdrawing = ref<string | null>(null)

const statusFilter = computed({
  get: () => (route.query.status as string) || null,
  set: (value) => {
    const query = { ...route.query }
    if (value) {
      query.status = value
    } else {
      delete query.status
    }
    router.push({ query })
  }
})

const filteredApplications = computed(() => {
  if (!statusFilter.value) return applications.value
  return applications.value.filter((a) => a.status === statusFilter.value)
})

async function loadApplications() {
  loading.value = true
  const result = await applicationService.findMyApplications({ limit: 50 })

  if (result.success) {
    applications.value = result.data.data
    // Load freight data for each application
    for (const app of applications.value) {
      loadFreightForApplication(app.id, app.freightId)
    }
  } else {
    toast.error({ title: 'Erro ao carregar candidaturas', message: result.error.message })
  }

  loading.value = false
}

async function loadFreightForApplication(applicationId: string, freightId: string) {
  if (freights.value[freightId]) return // Already loaded

  loadingFreights.value[applicationId] = true
  const result = await freightService.findOneOpen(freightId)

  if (result.success) {
    freights.value[freightId] = result.data
  }

  loadingFreights.value[applicationId] = false
}

async function withdrawApplication(applicationId: string) {
  withdrawing.value = applicationId
  const result = await applicationService.withdraw(applicationId)

  if (result.success) {
    toast.success({ title: 'Candidatura retirada com sucesso!' })
    await loadApplications()
  } else {
    toast.error({ title: 'Erro ao retirar candidatura', message: result.error.message })
  }

  withdrawing.value = null
}

async function completeApplication(applicationId: string) {
  const result = await applicationService.complete(applicationId)

  if (result.success) {
    toast.success({ title: 'Frete concluído com sucesso!' })
    await loadApplications()
  } else {
    toast.error({ title: 'Erro ao concluir frete', message: result.error.message })
  }
}

const statusOptions = [
  { label: 'Todas', value: '' },
  { label: 'Pendentes', value: 'PENDING' },
  { label: 'Aceitas', value: 'ACCEPTED' },
  { label: 'Rejeitadas', value: 'REJECTED' },
  { label: 'Retiradas', value: 'WITHDRAWN' },
  { label: 'Concluídas', value: 'COMPLETED' }
]

await loadApplications()
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Minhas Candidaturas</h1>
      <a href="/carrier" class="btn btn-sm btn-outline">Ver Fretes Disponíveis</a>
    </div>

    <!-- Filter -->
    <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
      <button
        v-for="option in statusOptions"
        :key="option.value"
        class="btn btn-sm"
        :class="
          statusFilter === option.value || (!statusFilter && !option.value)
            ? 'bg-amber-500 text-white border-none'
            : 'btn-outline'
        "
        @click="statusFilter = option.value || null"
      >
        {{ option.label }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <span class="loading loading-spinner loading-lg text-amber-500"></span>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredApplications.length === 0"
      class="bg-white rounded-xl p-12 flex flex-col items-center gap-3"
    >
      <div class="text-5xl">📋</div>
      <div class="font-bold text-xl">Nenhuma candidatura encontrada</div>
      <div class="text-gray-500 text-center">
        {{
          statusFilter
            ? 'Não há candidaturas com este status.'
            : 'Você ainda não se candidatou a nenhum frete.'
        }}
      </div>
      <a href="/carrier" class="btn bg-amber-500 text-white border-none hover:bg-amber-600 mt-2">
        Explorar Fretes
      </a>
    </div>

    <!-- Applications List (2 columns) -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <CarrierApplicationCard
        v-for="application in filteredApplications"
        :key="application.id"
        :application="application"
        :freight="freights[application.freightId] || null"
        :loading="loadingFreights[application.id]"
        @withdraw="withdrawApplication"
        @complete="completeApplication"
      />
    </div>
  </div>
</template>
