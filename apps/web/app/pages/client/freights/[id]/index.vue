<script setup lang="ts">
import { createFreightService } from '~~/domains/freights/composition'
import { createApplicationService } from '~~/domains/applications/composition'
import { createFreightPhotoService } from '~~/domains/freight-photos/composition'
import type { Freight } from '~~/domains/freights/entities/freight.entity'
import type { Application } from '~~/domains/applications/entities/application.entity'
import type { FreightPhoto } from '~~/domains/freight-photos/entities/freight-photo.entity'
import StatusBadge from '~/components/ui/StatusBadge.vue'
import ApplicationCard from '~/components/applications/ApplicationCard.vue'
import PaymentNotice from '~/components/ui/PaymentNotice.vue'
import ProposalModal from '~/components/applications/ProposalModal.vue'
import ReviewModal from '~/components/reviews/ReviewModal.vue'
import { createUserService } from '~~/domains/users/composition'
import type { PublicProfile } from '~~/domains/users/entities/public-profile.entity'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const freightService = createFreightService()
const applicationService = createApplicationService()
const userService = createUserService()
const freightPhotoService = createFreightPhotoService()

const config = useRuntimeConfig()
const freight = ref<Freight | null>(null)
const applications = ref<Application[]>([])
const photos = ref<FreightPhoto[]>([])
const loading = ref(true)
const activeTab = ref<'proposals' | 'find'>('proposals')
const selectedApplication = ref<Application | null>(null)
const freighters = ref<Record<string, PublicProfile>>({})
const showProposalModal = ref(false)
const showReviewModal = ref(false)

const freightId = route.params.id as string

async function loadFreight() {
  loading.value = true
  const result = await freightService.findOne(freightId)

  if (result.success) {
    freight.value = result.data
  } else {
    toast.error({ title: 'Erro ao carregar frete', message: result.error.message })
  }

  loading.value = false
}

async function loadApplications() {
  const result = await applicationService.findByFreight(freightId)

  if (result.success) {
    applications.value = result.data
    await loadFreighters(result.data)
  } else {
    toast.error({ title: 'Erro ao carregar propostas', message: result.error.message })
  }
}

async function loadFreighters(list: Application[]) {
  const missingIds = [...new Set(list.map((a) => a.freighterId))].filter(
    (id) => !freighters.value[id]
  )

  const results = await Promise.all(missingIds.map((id) => userService.getPublicProfile(id)))

  results.forEach((result, index) => {
    const id = missingIds[index]
    if (id && result.success) {
      freighters.value[id] = result.data
    }
  })
}

async function loadPhotos() {
  const result = await freightPhotoService.findByFreight(freightId)

  if (result.success) {
    photos.value = result.data
  }
}

async function acceptApplication(applicationId: string) {
  const result = await applicationService.accept(applicationId)

  if (result.success) {
    toast.success({ title: 'Proposta aceita com sucesso!' })
    await loadFreight()
    await loadApplications()
  } else {
    toast.error({ title: 'Erro ao aceitar proposta', message: result.error.message })
  }
}

async function rejectApplication(applicationId: string) {
  const result = await applicationService.reject(applicationId)

  if (result.success) {
    toast.success({ title: 'Proposta rejeitada com sucesso!' })
    await loadApplications()
  } else {
    toast.error({ title: 'Erro ao rejeitar proposta', message: result.error.message })
  }
}

async function cancelFreight() {
  if (!freight.value) return

  const result = await freightService.cancel(freight.value.id)

  if (result.success) {
    toast.success({ title: 'Frete cancelado com sucesso!' })
    await loadFreight()
  } else {
    toast.error({ title: 'Erro ao cancelar frete', message: result.error.message })
  }
}

async function completeFreight() {
  if (!freight.value?.selectedApplicationId) return

  const result = await applicationService.complete(freight.value.selectedApplicationId)

  if (result.success) {
    toast.success({ title: 'Frete concluído com sucesso!' })
    await loadFreight()
    await loadApplications()
  } else {
    toast.error({ title: 'Erro ao concluir frete', message: result.error.message })
  }
}

function openReviewModal() {
  showReviewModal.value = true
}

function closeReviewModal() {
  showReviewModal.value = false
}

async function onReviewSubmitted() {
  toast.success({ title: 'Avaliação enviada com sucesso!' })
  closeReviewModal()
  await loadFreight() // Recarrega para atualizar hasReviewed
}

function viewProposalDetails(application: Application) {
  selectedApplication.value = application
  showProposalModal.value = true
}

function closeProposalModal() {
  showProposalModal.value = false
  selectedApplication.value = null
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

onMounted(async () => {
  await loadFreight()
  await loadApplications()
  await loadPhotos()
})
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="grid grid-cols-3 mb-6">
      <button class="btn btn-ghost btn-circle" @click="navigateTo('/client')">
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

      <h1 class="text-xl font-bold text-center">{{ freight?.title || 'Carregando...' }}</h1>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <span class="loading loading-spinner loading-lg text-amber-500"></span>
    </div>

    <div v-else-if="freight" class="space-y-6">
      <!-- Card Principal do Frete -->
      <div class="bg-white rounded-xl p-6 shadow-sm">
        <div class="flex justify-between items-start mb-4">
          <div></div>
          <StatusBadge :status="freight.status" />
        </div>

        <div class="flex gap-6 items-center">
          <!-- Imagem do Item -->
          <div
            class="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
          >
            <img
              v-if="photos.length > 0"
              :src="config.public.baseURL + photos[0].url"
              :alt="freight.title"
              class="w-full h-full object-cover"
            />
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-24 w-24 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>

          <!-- Informações -->
          <div class="flex-1">
            <div class="space-y-3">
              <div class="flex items-start gap-2">
                <span class="text-xs font-semibold text-gray-500 w-20">TÍTULO</span>
                <span class="text-sm text-gray-900">{{ freight.title }}</span>
              </div>

              <div class="flex items-start gap-2">
                <span class="text-xs font-semibold text-gray-500 w-20">DESCRIÇÃO</span>
                <span class="text-sm text-gray-900">{{ freight.description }}</span>
              </div>

              <div class="flex items-start gap-2">
                <span class="text-xs font-semibold text-gray-500 w-20">VEÍCULO</span>
                <span class="text-sm text-gray-900">{{ freight.vehicleCategory }}</span>
              </div>

              <div class="flex items-start gap-2">
                <span class="text-xs font-semibold text-gray-500 w-20">ROTA</span>
                <div class="text-sm text-gray-900 space-y-1">
                  <div>
                    📍 De: {{ freight.originStreet }}, {{ freight.originDistrict }} -
                    {{ freight.originCity.name }}
                  </div>
                  <div>
                    📍 Para: {{ freight.destinationStreet }}, {{ freight.destinationDistrict }} -
                    {{ freight.destinationCity.name }}
                  </div>
                </div>
              </div>

              <div class="flex items-start gap-2">
                <span class="text-xs font-semibold text-gray-500 w-20">DATA</span>
                <span class="text-sm text-gray-900">
                  {{
                    freight.dateMode === 'IMMEDIATE'
                      ? 'O mais rápido possível'
                      : freight.exactDatetime
                        ? formatDate(freight.exactDatetime)
                        : 'Não informada'
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Ações do Frete -->
      <div
        v-if="
          freight.status === 'OPEN' ||
          freight.status === 'NEGOTIATING' ||
          freight.status === 'COMPLETED'
        "
        class="flex gap-3"
      >
        <button
          v-if="freight.status === 'OPEN'"
          class="btn btn-outline flex-1"
          @click="router.push(`/client/freights/${freight.id}/edit`)"
        >
          Editar Frete
        </button>
        <button
          v-if="freight.status === 'OPEN' || freight.status === 'NEGOTIATING'"
          class="btn btn-outline btn-error flex-1"
          @click="cancelFreight"
        >
          Cancelar Frete
        </button>
        <button
          v-if="freight.status === 'NEGOTIATING' && freight.selectedApplicationId"
          class="btn bg-amber-500 text-white border-none hover:bg-amber-600 flex-1"
          @click="completeFreight"
        >
          Concluir Frete
        </button>
        <button
          v-if="freight.status === 'COMPLETED' && !freight.hasReviewed"
          class="btn bg-amber-500 text-white border-none hover:bg-amber-600 flex-1"
          @click="openReviewModal"
        >
          Avaliar Fretista
        </button>
        <span
          v-if="freight.status === 'COMPLETED' && freight.hasReviewed"
          class="text-sm text-gray-500 italic flex-1 text-center"
        >
          ✓ Fretista Avaliado
        </span>
      </div>

      <!-- Tabs -->
      <div class="border-b border-gray-200">
        <div class="flex gap-6">
          <button
            class="pb-3 text-sm font-medium border-b-2 transition-colors"
            :class="
              activeTab === 'proposals'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            "
            @click="activeTab = 'proposals'"
          >
            Propostas Recebidas ({{ applications.length }})
          </button>
          <button
            class="pb-3 text-sm font-medium border-b-2 transition-colors"
            :class="
              activeTab === 'find'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            "
            @click="activeTab = 'find'"
          >
            Encontrar Fretistas
          </button>
        </div>
      </div>

      <!-- Lista de Propostas -->
      <div v-if="activeTab === 'proposals'" class="space-y-4">
        <PaymentNotice />
        <ApplicationCard
          v-for="application in applications"
          :key="application.id"
          :application="application"
          :freight-status="freight.status"
          :freighter="freighters[application.freighterId]"
          @view-details="viewProposalDetails"
          @accept="acceptApplication"
          @reject="rejectApplication"
        />

        <div v-if="applications.length === 0" class="text-center py-12 text-gray-500">
          Nenhuma proposta recebida ainda.
        </div>
      </div>

      <!-- Encontrar Fretistas -->
      <div v-if="activeTab === 'find'" class="text-center py-12 text-gray-500">
        Funcionalidade em desenvolvimento.
      </div>
    </div>

    <!-- Modal de Detalhes da Proposta -->
    <ProposalModal
      v-if="showProposalModal && selectedApplication && freight"
      :application="selectedApplication"
      :freight-status="freight.status"
      :freighter="freighters[selectedApplication.freighterId]"
      @close="closeProposalModal"
      @accept="
        (id) => {
          acceptApplication(id)
          closeProposalModal()
        }
      "
      @reject="
        (id) => {
          rejectApplication(id)
          closeProposalModal()
        }
      "
    />

    <!-- Modal de Avaliação -->
    <ReviewModal
      v-if="showReviewModal && freight"
      :freight-id="freight.id"
      @close="closeReviewModal"
      @submitted="onReviewSubmitted"
    />
  </div>
</template>
