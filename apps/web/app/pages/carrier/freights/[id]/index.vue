<script setup lang="ts">
import { createFreightService } from '~~/domains/freights/composition'
import { createApplicationService } from '~~/domains/applications/composition'
import { createVehicleService } from '~~/domains/vehicles/composition'
import type { Freight } from '~~/domains/freights/entities/freight.entity'
import type { Vehicle } from '~~/domains/vehicles/entities/vehicle.entity'
import FreightImageGallery from '~/components/carrier/FreightImageGallery.vue'
import FreightInfoCards from '~/components/carrier/FreightInfoCards.vue'
import FreightDescription from '~/components/carrier/FreightDescription.vue'
import FreightRoute from '~/components/carrier/FreightRoute.vue'
import ClientProfileCard from '~/components/carrier/ClientProfileCard.vue'
import ProposalForm from '~/components/carrier/ProposalForm.vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const freightService = createFreightService()
const applicationService = createApplicationService()
const vehicleService = createVehicleService()

const freightId = route.params.id as string
const freight = ref<Freight | null>(null)
const vehicles = ref<Vehicle[]>([])
const myApplication = ref<any>(null)
const loading = ref(true)
const submitting = ref(false)
const completing = ref(false)

async function loadFreight() {
  loading.value = true
  const result = await freightService.findOneOpen(freightId)

  if (result.success) {
    freight.value = result.data
    // Carregar candidatura do fretista neste frete
    await loadMyApplication()
  } else {
    toast.error({ title: 'Erro ao carregar frete', message: result.error.message })
    router.push('/carrier')
  }

  loading.value = false
}

async function loadMyApplication() {
  const result = await applicationService.findMyApplications({ freightId: freightId, limit: 1 })
  if (result.success && result.data.data.length > 0) {
    myApplication.value = result.data.data[0]
  }
}

async function completeFreight() {
  if (!myApplication.value) return

  completing.value = true
  const result = await applicationService.complete(myApplication.value.id)
  completing.value = false

  if (result.success) {
    toast.success({ title: 'Frete concluído com sucesso!' })
    await loadFreight()
  } else {
    toast.error({ title: 'Erro ao concluir frete', message: result.error.message })
  }
}

async function loadVehicles() {
  const result = await vehicleService.findAll({ limit: 50 })

  if (result.success) {
    vehicles.value = result.data.data
  } else {
    toast.error({ title: 'Erro ao carregar veículos', message: result.error.message })
  }
}

function formatDateLabel(freight: Freight): string {
  if (freight.dateMode === 'IMMEDIATE') return 'O mais rápido possível'
  if (freight.dateMode === 'FLEXIBLE') return freight.availabilityWindow || 'Janela flexível'
  if (!freight.exactDatetime) return 'Não informada'

  const date = new Date(freight.exactDatetime)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (date.toDateString() === today.toDateString()) {
    return `Hoje ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }
  if (date.toDateString() === tomorrow.toDateString()) {
    return `Amanhã ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }

  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getPhotoUrl(): string | undefined {
  if (!freight.value?.coverPhoto) return undefined
  const config = useRuntimeConfig()
  return config.public.baseURL + freight.value.coverPhoto
}

function getVehicleOptions() {
  return vehicles.value.map((v) => ({
    id: v.id,
    label: `${v.vehicleCategoryName} - ${v.model}${v.plate ? ` (${v.plate})` : ''}`
  }))
}

async function handleSubmitProposal(data: {
  vehicleId: string
  proposedValue: number
  message?: string
}) {
  if (!freight.value) return

  submitting.value = true
  const result = await applicationService.create(freight.value.id, {
    vehicleId: data.vehicleId,
    proposedValue: data.proposedValue,
    message: data.message
  })
  submitting.value = false

  if (result.success) {
    toast.success({ title: 'Proposta enviada com sucesso!' })
    router.push('/carrier')
  } else if (result.error.code === 409) {
    toast.info({
      title: 'Proposta já enviada',
      message: 'Você já enviou uma proposta para este frete.'
    })
  } else {
    toast.error({ title: 'Erro ao enviar proposta', message: result.error.message })
  }
}

await loadFreight()
await loadVehicles()
</script>

<template>
  <div class="min-h-screen">
    <div v-if="loading" class="flex justify-center py-12">
      <span class="loading loading-spinner loading-lg text-amber-500"></span>
    </div>

    <div v-else-if="freight">
      <!-- Header -->
      <div class="mb-8">
        <button
          class="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          @click="router.back()"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Voltar
        </button>

        <h1 class="text-3xl font-bold text-gray-900">{{ freight.title }}</h1>
        <p class="text-gray-600 mt-2">Detalhes do Frete</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Coluna Principal -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Imagem -->
          <FreightImageGallery :image-url="getPhotoUrl()" :status="freight.status" />

          <!-- Cards de Informação -->
          <FreightInfoCards
            :vehicle-category="freight.vehicleCategory"
            :date-label="formatDateLabel(freight)"
          />

          <!-- Descrição -->
          <FreightDescription :title="freight.title" :description="freight.description" />

          <!-- Roteiro -->
          <FreightRoute
            :origin="{
              label: 'ORIGEM',
              address: `${freight.originDistrict}, ${freight.originNumber}, ${freight.originCity.name} - ${freight.originCity.state}`,
              reference: `Próximo ao ${freight.originStreet}`
            }"
            :destination="{
              label: 'DESTINO',
              address: `${freight.destinationDistrict}, ${freight.destinationNumber}, ${freight.destinationCity.name} - ${freight.destinationCity.state}`,
              reference: `Próximo ao ${freight.destinationStreet}`
            }"
          />

          <!-- Perfil do Cliente -->
          <ClientProfileCard name="Ana S." :rating="4.8" :completed-freights="15" />
        </div>

        <!-- Coluna Lateral -->
        <div class="lg:col-span-1">
          <!-- Candidatura Aceita - Botão Concluir -->
          <div
            v-if="myApplication?.status === 'ACCEPTED'"
            class="bg-white rounded-xl p-6 shadow-sm space-y-4"
          >
            <div class="text-center">
              <div class="text-4xl mb-2">🚚</div>
              <h3 class="text-lg font-bold text-gray-900">Proposta Aceita!</h3>
              <p class="text-sm text-gray-600 mt-1">Você foi escolhido para este frete.</p>
            </div>
            <div class="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
              <span class="text-sm text-green-700 font-medium">Valor proposto:</span>
              <div class="text-xl font-bold text-green-700">
                R$ {{ parseFloat(myApplication.proposedPrice).toFixed(2).replace('.', ',') }}
              </div>
            </div>
            <button
              class="btn bg-amber-500 text-white border-none hover:bg-amber-600 w-full"
              :disabled="completing"
              @click="completeFreight"
            >
              <span v-if="completing" class="loading loading-spinner loading-sm"></span>
              <span v-else>Concluir Frete</span>
            </button>
          </div>

          <!-- Candidatura Pendente -->
          <div
            v-else-if="myApplication?.status === 'PENDING'"
            class="bg-white rounded-xl p-6 shadow-sm text-center"
          >
            <div class="text-4xl mb-2">⏳</div>
            <h3 class="text-lg font-bold text-gray-900">Proposta Enviada</h3>
            <p class="text-sm text-gray-600 mt-1">Aguardando resposta do cliente.</p>
            <div class="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <span class="text-sm text-yellow-700 font-medium">Status: Pendente</span>
            </div>
          </div>

          <!-- Frete não aceita mais propostas -->
          <div
            v-else-if="freight.status !== 'OPEN'"
            class="bg-white rounded-xl p-6 shadow-sm text-center"
          >
            <div class="text-4xl mb-2">🔒</div>
            <h3 class="text-lg font-bold text-gray-900">Frete Indisponível</h3>
            <p class="text-sm text-gray-600 mt-1">Este frete não está mais aceitando propostas.</p>
            <div class="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-3">
              <span class="text-sm text-gray-700 font-medium">Status: {{ freight.status }}</span>
            </div>
          </div>

          <!-- Sem Candidatura e Frete OPEN - Formulário -->
          <ProposalForm
            v-else
            :vehicles="getVehicleOptions()"
            :loading="submitting"
            @submit="handleSubmitProposal"
          />
        </div>
      </div>
    </div>
  </div>
</template>
