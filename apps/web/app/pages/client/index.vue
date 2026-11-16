<script setup lang="ts">
import { createFreightService } from '~~/domains/freights/composition'
import { createApplicationService } from '~~/domains/applications/composition'
import type { Freight } from '~~/domains/freights/entities/freight.entity'
import FreightCard from '~/components/freights/FreightCard.vue'

const toast = useToast()
const freightService = createFreightService()
const applicationService = createApplicationService()

const freights = ref<Freight[]>([])
const proposalsCount = ref<Record<string, number>>({})
const loading = ref(false)
const activeTab = ref<'active' | 'history'>('active')

const activeFreights = computed(() =>
  freights.value.filter(
    (f) => f.status === 'OPEN' || f.status === 'NEGOTIATING' || f.status === 'IN_PROGRESS'
  )
)

const historyFreights = computed(() =>
  freights.value.filter((f) => f.status === 'COMPLETED' || f.status === 'CANCELLED')
)

async function loadFreights() {
  loading.value = true
  const result = await freightService.findAll({ limit: 50 })

  if (result.success) {
    freights.value = result.data.data

    for (const freight of freights.value) {
      const applicationsResult = await applicationService.findByFreight(freight.id)
      if (applicationsResult.success) {
        proposalsCount.value[freight.id] = applicationsResult.data.length
      }
    }
  } else {
    toast.error({ title: 'Erro ao carregar fretes', message: result.error.message })
  }

  loading.value = false
}

await loadFreights()
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Meus Fretes</h1>
    </div>

    <!-- Tabs -->
    <div class="border-b border-gray-200">
      <div class="flex gap-6">
        <button
          class="pb-3 text-sm font-medium border-b-2 transition-colors"
          :class="
            activeTab === 'active'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          "
          @click="activeTab = 'active'"
        >
          Ativos ({{ activeFreights.length }})
        </button>
        <button
          class="pb-3 text-sm font-medium border-b-2 transition-colors"
          :class="
            activeTab === 'history'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          "
          @click="activeTab = 'history'"
        >
          Histórico ({{ historyFreights.length }})
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="bg-white rounded-xl p-12 flex justify-center">
      <span class="loading loading-spinner loading-lg text-amber-500"></span>
    </div>

    <!-- Tab: Ativos -->
    <template v-else-if="activeTab === 'active'">
      <div
        v-if="activeFreights.length === 0"
        class="bg-white rounded-xl p-12 flex flex-col items-center gap-3"
      >
        <img src="~/assets/images/no-freights.png" alt="sem fretes" class="w-96 clip" />
        <div class="font-bold text-2xl">Nenhum frete ativo</div>
        <div>Você não tem fretes ativos no momento. Comece criando sua primeira solicitação.</div>
        <a href="/client/freights/create" class="btn bg-amber-500 text-white rounded-2xl">
          Publicar Anúncio
        </a>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FreightCard
          v-for="freight in activeFreights"
          :key="freight.id"
          :freight="freight"
          :proposals-count="proposalsCount[freight.id]"
        />
      </div>
    </template>

    <!-- Tab: Histórico -->
    <template v-else-if="activeTab === 'history'">
      <div
        v-if="historyFreights.length === 0"
        class="bg-white rounded-xl p-12 flex flex-col items-center gap-3"
      >
        <div class="font-bold text-xl">Nenhum frete no histórico</div>
        <div>Seus fretes concluídos e cancelados aparecerão aqui.</div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FreightCard
          v-for="freight in historyFreights"
          :key="freight.id"
          :freight="freight"
          :proposals-count="proposalsCount[freight.id]"
        />
      </div>
    </template>
  </div>
</template>
