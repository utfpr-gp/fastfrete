<script setup lang="ts">
import { createAdminDashboardService } from '~~/domains/admin-dashboard/composition'
import type { AdminMetrics } from '~~/domains/admin-dashboard/entities/admin-metrics.entity'
import MetricCard from '~/components/carrier/MetricCard.vue'

const toast = useToast()
const dashboardService = createAdminDashboardService()

const metrics = ref<AdminMetrics | null>(null)
const loading = ref(true)

function formatRating(rating: number, total: number) {
  return total > 0 ? rating.toFixed(1) : '—'
}

onMounted(async () => {
  const result = await dashboardService.getMetrics()

  if (result.success) {
    metrics.value = result.data
  } else {
    toast.error({ title: 'Erro ao carregar métricas', message: result.error.message })
  }
  loading.value = false
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <h1 class="text-2xl font-bold">Painel Administrativo</h1>

    <div v-if="loading" class="bg-white rounded-xl p-12 flex justify-center">
      <span class="loading loading-spinner loading-lg text-amber-500"></span>
    </div>

    <div v-else-if="!metrics" class="bg-white rounded-xl p-12 text-center text-gray-500">
      Não foi possível carregar as métricas.
    </div>

    <template v-else>
      <section class="flex flex-col gap-3">
        <h2 class="text-lg font-bold text-gray-900">Usuários</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard icon="👥" title="Total de usuários" :value="String(metrics.users.total)" />
          <MetricCard icon="🧑" title="Clientes" :value="String(metrics.users.customers)" />
          <MetricCard icon="🚚" title="Fretistas" :value="String(metrics.users.carriers)" />
          <MetricCard icon="🚫" title="Suspensos" :value="String(metrics.users.suspended)" />
        </div>
      </section>

      <section class="flex flex-col gap-3">
        <h2 class="text-lg font-bold text-gray-900">Fretes</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <a href="/admin/freights">
            <MetricCard icon="📦" title="Total de fretes" :value="String(metrics.freights.total)" />
          </a>
          <a href="/admin/freights?status=OPEN">
            <MetricCard
              icon="🟢"
              title="Aguardando propostas"
              :value="String(metrics.freights.open)"
            />
          </a>
          <a href="/admin/freights?status=NEGOTIATING">
            <MetricCard
              icon="🟡"
              title="Negociando"
              :value="String(metrics.freights.negotiating)"
            />
          </a>
          <a href="/admin/freights?status=IN_PROGRESS">
            <MetricCard
              icon="🔵"
              title="Em andamento"
              :value="String(metrics.freights.inProgress)"
            />
          </a>
          <a href="/admin/freights?status=COMPLETED">
            <MetricCard icon="✅" title="Concluídos" :value="String(metrics.freights.completed)" />
          </a>
          <a href="/admin/freights?status=CANCELLED">
            <MetricCard icon="❌" title="Cancelados" :value="String(metrics.freights.cancelled)" />
          </a>
        </div>
      </section>

      <section class="flex flex-col gap-3">
        <h2 class="text-lg font-bold text-gray-900">Candidaturas</h2>
        <div class="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <MetricCard icon="📨" title="Total" :value="String(metrics.applications.total)" />
          <MetricCard icon="⏳" title="Pendentes" :value="String(metrics.applications.pending)" />
          <MetricCard icon="🤝" title="Aceitas" :value="String(metrics.applications.accepted)" />
          <MetricCard icon="🙅" title="Rejeitadas" :value="String(metrics.applications.rejected)" />
          <MetricCard icon="↩️" title="Retiradas" :value="String(metrics.applications.withdrawn)" />
          <MetricCard
            icon="🏁"
            title="Concluídas"
            :value="String(metrics.applications.completed)"
          />
        </div>
      </section>

      <section class="flex flex-col gap-3">
        <h2 class="text-lg font-bold text-gray-900">Avaliações</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MetricCard
            icon="💬"
            title="Total de avaliações"
            :value="String(metrics.reviews.total)"
          />
          <MetricCard
            icon="⭐"
            title="Nota média"
            :value="formatRating(metrics.reviews.averageRating, metrics.reviews.total)"
          />
        </div>
      </section>
    </template>
  </div>
</template>
