<script setup lang="ts">
import { createFreightService } from '~~/domains/freights/composition'
import type { Freight } from '~~/domains/freights/entities/freight.entity'

const toast = useToast()
const freightService = createFreightService()

const freights = ref<Freight[]>([])
const loading = ref(false)

async function loadFreights() {
  loading.value = true
  const result = await freightService.findAll({
    limit: 10
  })

  if (result.success) {
    freights.value = result.data.data
  } else {
    toast.error({ title: 'Erro ao carregar fretes', message: result.error.message })
  }

  loading.value = false
}

await loadFreights()
</script>

<template>
  <div class="flex flex-col gap-10">
    <div class="flex justify-between">
      <h1 class="text-2xl font-bold">Meus Fretes Ativos</h1>
      <a class="text-amber-500">Ver histórico de fretes</a>
    </div>

    <div v-if="loading" class="bg-white rounded-xl p-12 flex justify-center">
      <span class="loading loading-spinner loading-lg text-amber-500"></span>
    </div>

    <div
      v-else-if="freights.length === 0"
      class="bg-white rounded-xl p-12 flex flex-col items-center gap-3"
    >
      <img src="~/assets/images/no-freights.png" alt="sem fretes" class="w-96 clip" />
      <div class="font-bold text-2xl">Nenhum frete ativo</div>
      <div>Você não tem fretes ativos no momento. Solicite um no frete</div>
      <a href="/client/freights/create" class="btn bg-amber-500 text-white rounded-2xl"
        >Publicar Anúncio</a
      >
    </div>

    <div v-else class="flex flex-col gap-4">
      <div
        v-for="freight in freights"
        :key="freight.id"
        class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="flex justify-between items-start mb-3">
          <h3 class="text-xl font-bold">{{ freight.title }}</h3>
          <span
            class="badge"
            :class="freight.status === 'OPEN' ? 'badge-primary' : 'badge-warning'"
          >
            {{ freight.status === 'OPEN' ? 'Aberto' : 'Negociando' }}
          </span>
        </div>

        <p class="text-gray-600 mb-4 line-clamp-2">{{ freight.description }}</p>

        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div class="font-semibold text-gray-700 mb-1">Origem</div>
            <div class="text-gray-600">
              {{ freight.originDistrict }}, {{ freight.originCity.name }}
            </div>
            <div class="text-gray-500 text-xs">
              {{ freight.originStreet }}, {{ freight.originNumber }}
            </div>
          </div>

          <div>
            <div class="font-semibold text-gray-700 mb-1">Destino</div>
            <div class="text-gray-600">
              {{ freight.destinationDistrict }}, {{ freight.destinationCity.name }}
            </div>
            <div class="text-gray-500 text-xs">
              {{ freight.destinationStreet }}, {{ freight.destinationNumber }}
            </div>
          </div>
        </div>

        <div class="mt-4 flex items-center gap-4 text-sm text-gray-500">
          <div class="flex items-center gap-1">
            <span class="font-medium">Categoria:</span>
            {{ freight.vehicleCategory }}
          </div>
          <div class="flex items-center gap-1">
            <span class="font-medium">Criado em:</span>
            {{ new Date(freight.createdAt).toLocaleDateString('pt-BR') }}
          </div>
        </div>

        <div class="mt-4 flex gap-2">
          <a
            :href="`/client/freights/${freight.id}`"
            class="btn btn-sm bg-amber-500 text-white border-none hover:bg-amber-600"
          >
            Ver detalhes
          </a>
          <a :href="`/client/freights/${freight.id}/edit`" class="btn btn-sm btn-outline">
            Editar
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
