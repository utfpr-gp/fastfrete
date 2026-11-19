<script setup lang="ts">
import { createVehicleService } from '~~/domains/vehicles/composition'
import type { Vehicle } from '~~/domains/vehicles/entities/vehicle.entity'
import type { VehicleCategory } from '~~/domains/vehicles/repositories/vehicle.repository.interface'
import type { CreateVehicleDto } from '~~/domains/vehicles/dtos/create-vehicle.dto'

const toast = useToast()
const vehicleService = createVehicleService()

const vehicles = ref<Vehicle[]>([])
const categories = ref<VehicleCategory[]>([])
const loading = ref(true)
const showFormModal = ref(false)
const editingVehicle = ref<Vehicle | null>(null)
const submitting = ref(false)
const deleting = ref<string | null>(null)

const form = ref<CreateVehicleDto>({
  vehicleCategoryId: '',
  model: '',
  plate: '',
  capacityKg: 0,
  color: ''
})

async function loadVehicles() {
  loading.value = true
  const result = await vehicleService.findAll({ limit: 50 })

  if (result.success) {
    vehicles.value = result.data.data
  } else {
    toast.error({ title: 'Erro ao carregar veículos', message: result.error.message })
  }

  loading.value = false
}

async function loadCategories() {
  const result = await vehicleService.findAllCategories()
  if (result.success) {
    categories.value = result.data
  }
}

function openCreateModal() {
  editingVehicle.value = null
  form.value = { vehicleCategoryId: '', model: '', plate: '', capacityKg: 0, color: '' }
  showFormModal.value = true
}

function openEditModal(vehicle: Vehicle) {
  editingVehicle.value = vehicle
  form.value = {
    vehicleCategoryId: vehicle.vehicleCategoryId,
    model: vehicle.model,
    plate: vehicle.plate || '',
    capacityKg: parseFloat(vehicle.capacityKg),
    color: vehicle.color || ''
  }
  showFormModal.value = true
}

function closeFormModal() {
  showFormModal.value = false
  editingVehicle.value = null
}

async function submitForm() {
  if (!form.value.vehicleCategoryId || !form.value.model || !form.value.capacityKg) {
    toast.error({ title: 'Preencha todos os campos obrigatórios' })
    return
  }

  submitting.value = true

  if (editingVehicle.value) {
    const result = await vehicleService.update(editingVehicle.value.id, form.value)
    if (result.success) {
      toast.success({ title: 'Veículo atualizado com sucesso!' })
      closeFormModal()
      await loadVehicles()
    } else {
      toast.error({ title: 'Erro ao atualizar veículo', message: result.error.message })
    }
  } else {
    const result = await vehicleService.create(form.value)
    if (result.success) {
      toast.success({ title: 'Veículo cadastrado com sucesso!' })
      closeFormModal()
      await loadVehicles()
    } else {
      toast.error({ title: 'Erro ao cadastrar veículo', message: result.error.message })
    }
  }

  submitting.value = false
}

async function toggleActive(vehicle: Vehicle) {
  const result = await vehicleService.update(vehicle.id, { active: !vehicle.active })
  if (result.success) {
    toast.success({ title: vehicle.active ? 'Veículo desativado' : 'Veículo ativado' })
    await loadVehicles()
  } else {
    toast.error({ title: 'Erro ao alterar status', message: result.error.message })
  }
}

async function deleteVehicle(vehicle: Vehicle) {
  if (!confirm(`Tem certeza que deseja excluir o veículo ${vehicle.model}?`)) return

  deleting.value = vehicle.id
  const result = await vehicleService.delete(vehicle.id)

  if (result.success) {
    toast.success({ title: 'Veículo excluído com sucesso!' })
    await loadVehicles()
  } else {
    toast.error({ title: 'Erro ao excluir veículo', message: result.error.message })
  }

  deleting.value = null
}

await loadCategories()
await loadVehicles()
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <a class="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4" href="/carrier">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Voltar
      </a>
    </div>

    <div class="flex items-center gap-4 mb-6">
      <h1 class="text-2xl font-bold flex-1">Meus Veículos</h1>
      <button
        class="btn bg-amber-500 text-gray-900 border-none hover:bg-amber-400"
        @click="openCreateModal"
      >
        Cadastrar Veículo
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <span class="loading loading-spinner loading-lg text-amber-500"></span>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="vehicles.length === 0"
      class="bg-white rounded-xl p-12 flex flex-col items-center gap-3"
    >
      <div class="text-5xl">🚗</div>
      <div class="font-bold text-xl">Nenhum veículo cadastrado</div>
      <div class="text-gray-500 text-center">
        Cadastre seu primeiro veículo para começar a se candidatar a fretes.
      </div>
      <button
        class="btn bg-amber-500 text-gray-900 border-none hover:bg-amber-400 mt-2"
        @click="openCreateModal"
      >
        Cadastrar Veículo
      </button>
    </div>

    <!-- Vehicles List -->
    <div v-else class="space-y-4">
      <div
        v-for="vehicle in vehicles"
        :key="vehicle.id"
        class="bg-white rounded-xl p-5 shadow-sm"
        :class="{ 'opacity-60': !vehicle.active }"
      >
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h3 class="text-lg font-bold text-gray-900">{{ vehicle.model }}</h3>
              <span
                class="badge text-xs"
                :class="
                  vehicle.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                "
              >
                {{ vehicle.active ? 'Ativo' : 'Inativo' }}
              </span>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <span class="text-gray-500">Categoria:</span>
                <span class="ml-1 font-medium text-gray-900">{{
                  vehicle.vehicleCategoryName
                }}</span>
              </div>
              <div>
                <span class="text-gray-500">Placa:</span>
                <span class="ml-1 font-medium text-gray-900">{{ vehicle.plate || '—' }}</span>
              </div>
              <div>
                <span class="text-gray-500">Capacidade:</span>
                <span class="ml-1 font-medium text-gray-900">{{ vehicle.capacityKg }} kg</span>
              </div>
              <div>
                <span class="text-gray-500">Cor:</span>
                <span class="ml-1 font-medium text-gray-900">{{ vehicle.color || '—' }}</span>
              </div>
            </div>
          </div>

          <div class="flex gap-2 ml-4">
            <button class="btn btn-sm btn-outline" @click="toggleActive(vehicle)">
              {{ vehicle.active ? 'Desativar' : 'Ativar' }}
            </button>
            <button class="btn btn-sm btn-outline" @click="openEditModal(vehicle)">Editar</button>
            <button
              class="btn btn-sm btn-outline btn-error"
              :disabled="deleting === vehicle.id"
              @click="deleteVehicle(vehicle)"
            >
              <span
                v-if="deleting === vehicle.id"
                class="loading loading-spinner loading-xs"
              ></span>
              <span v-else>Excluir</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Modal -->
    <div
      v-if="showFormModal"
      class="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
      @click.self="closeFormModal"
    >
      <div class="bg-white rounded-xl max-w-md w-full">
        <div class="p-6">
          <div class="flex justify-between items-start mb-6">
            <h2 class="text-xl font-bold">
              {{ editingVehicle ? 'Editar Veículo' : 'Cadastrar Veículo' }}
            </h2>
            <button class="btn btn-ghost btn-sm btn-circle" @click="closeFormModal">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="text-sm font-medium text-gray-700 mb-1 block">Categoria *</label>
              <select v-model="form.vehicleCategoryId" class="select select-bordered w-full">
                <option value="" disabled>Selecione uma categoria</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-700 mb-1 block">Modelo *</label>
              <input
                v-model="form.model"
                type="text"
                class="input input-bordered w-full"
                placeholder="Ex: Fiorino 1.3"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-gray-700 mb-1 block">Placa</label>
                <input
                  v-model="form.plate"
                  type="text"
                  class="input input-bordered w-full"
                  placeholder="ABC-1234"
                />
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700 mb-1 block">Cor</label>
                <input
                  v-model="form.color"
                  type="text"
                  class="input input-bordered w-full"
                  placeholder="Branca"
                />
              </div>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-700 mb-1 block">Capacidade (kg) *</label>
              <input
                v-model.number="form.capacityKg"
                type="number"
                class="input input-bordered w-full"
                placeholder="1000"
                min="1"
              />
            </div>
          </div>

          <div class="flex gap-3 mt-6 pt-6 border-t">
            <button class="btn btn-outline flex-1" :disabled="submitting" @click="closeFormModal">
              Cancelar
            </button>
            <button
              class="btn bg-amber-500 text-gray-900 border-none hover:bg-amber-400 flex-1"
              :disabled="submitting"
              @click="submitForm"
            >
              <span v-if="submitting" class="loading loading-spinner loading-sm"></span>
              <span v-else>{{ editingVehicle ? 'Salvar' : 'Cadastrar' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
