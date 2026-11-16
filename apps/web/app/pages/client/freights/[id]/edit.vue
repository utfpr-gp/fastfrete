<script setup lang="ts">
import CustomInput from '~/components/forms/CustomInput.vue'
import SubmitButton from '~/components/forms/SubmitButton.vue'
import { createFreightService } from '~~/domains/freights/composition'
import CustomTextArea from '~/components/forms/CustomTextArea.vue'
import VehicleCategorySelector from '~/components/freights/VehicleCategorySelector.vue'
import CustomSelect from '~/components/forms/CustomSelect.vue'
import FormData from '~/components/forms/FormData.vue'
import { vMaska } from 'maska/vue'
import type { Freight } from '~~/domains/freights/entities/freight.entity'

const route = useRoute()
const toast = useToast()
const router = useRouter()
const freightService = createFreightService()

const freightId = route.params.id as string
const freight = ref<Freight | null>(null)
const loading = ref(true)
const submitting = ref(false)
const currentStep = ref(1)
const totalSteps = 3
const formComponent = useTemplateRef('form')

async function loadFreight() {
  loading.value = true
  const result = await freightService.findOne(freightId)

  if (result.success) {
    if (result.data.status !== 'OPEN') {
      toast.error({
        title: 'Frete não pode ser editado',
        message: 'Somente fretes com status "Aguardando Propostas" podem ser editados.'
      })
      router.push(`/client/freights/${freightId}`)
      return
    }
    freight.value = result.data
  } else {
    toast.error({ title: 'Erro ao carregar frete', message: result.error.message })
    router.push('/client')
  }

  loading.value = false
}

function getInitialValues() {
  if (!freight.value) return {}
  return {
    title: freight.value.title,
    description: freight.value.description,
    vehicleCategory: freight.value.vehicleCategory,
    originCityId: freight.value.originCity.id,
    originStreet: freight.value.originStreet,
    originDistrict: freight.value.originDistrict,
    originNumber: freight.value.originNumber,
    destinationCityId: freight.value.destinationCity.id,
    destinationStreet: freight.value.destinationStreet,
    destinationDistrict: freight.value.destinationDistrict,
    destinationNumber: freight.value.destinationNumber,
    dateMode: freight.value.dateMode,
    exactDatetime: formatDatetimeForInput(freight.value.exactDatetime)
  }
}

function formatDatetimeForInput(dateString: string | null): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

async function nextStep() {
  const fieldsToValidate = getFieldsForStep(currentStep.value)
  const { valid, errors } = await formComponent.value.validate()
  const values = formComponent.value?.values
  const hasSomeErrorInTheCurrentStep = fieldsToValidate.some((val) => val in errors)

  if (!hasSomeErrorInTheCurrentStep) {
    if (currentStep.value < totalSteps) {
      currentStep.value++
      formComponent.value.resetForm({ values })
    } else if (valid) {
      await submitFreight(formComponent.value?.values)
    }
  }
}

function previousStep() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

function getFieldsForStep(step: number): string[] {
  switch (step) {
    case 1:
      return ['title', 'description', 'vehicleCategory']
    case 2:
      return [
        'originDistrict',
        'originStreet',
        'originNumber',
        'destinationDistrict',
        'destinationStreet',
        'destinationNumber'
      ]
    case 3:
      return ['dateMode']
    default:
      return []
  }
}

async function submitFreight(form) {
  submitting.value = true

  try {
    const result = await freightService.update(freightId, form)

    if (result.success) {
      toast.success({ title: 'Frete atualizado com sucesso!' })
      router.push(`/client/freights/${freightId}`)
    } else {
      toast.error({ title: 'Erro ao atualizar frete', message: result.error.message })
    }
  } catch (error) {
    toast.error({ title: 'Erro inesperado', message: 'Tente novamente mais tarde' })
  } finally {
    submitting.value = false
  }
}

function cancel() {
  router.push(`/client/freights/${freightId}`)
}

await loadFreight()
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <div v-if="loading" class="flex justify-center py-12">
      <span class="loading loading-spinner loading-lg text-amber-500"></span>
    </div>

    <template v-else-if="freight">
      <div class="mb-8">
        <div class="text-sm text-gray-600 mb-2">Passo {{ currentStep }} de {{ totalSteps }}</div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-amber-500 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
          ></div>
        </div>
      </div>

      <FormData
        ref="form"
        :initial-values="getInitialValues()"
        class="bg-white rounded-xl p-8 shadow-sm"
      >
        <div v-show="currentStep === 1">
          <h2 class="text-2xl font-bold mb-6">Editar informações do frete</h2>

          <div>
            <CustomInput
              id="title"
              name="title"
              label="Dê um título para o seu frete"
              placeholder="Ex: Transporte de Geladeira Duplex"
              required
              rules="required|min:3|max:150"
              class="input input-lg bg-white w-full rounded-xl placeholder:text-sm text-sm focus:outline-0"
            />

            <CustomTextArea
              id="description"
              name="description"
              rows="4"
              required
              label="Descreva o que precisa ser transportado"
              rules="required|min:10"
              class="textarea textarea-bordered rounded-xl w-full placeholder:text-sm text-sm focus:outline-0"
              placeholder="Inclua detalhes como dimensões, peso, fragilidade e qualquer necessidade de manuseio especial."
            ></CustomTextArea>

            <VehicleCategorySelector
              id="vehicleCategory"
              name="vehicleCategory"
              required
              label="Tipo do veículo"
              rules="required"
            />
          </div>
        </div>

        <div v-show="currentStep === 2">
          <h2 class="text-2xl font-bold mb-6">Logística e Agendamento</h2>

          <div class="space-y-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Retirada</h3>

              <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <CustomSelect
                    id="originCityId"
                    label="Cidade"
                    name="originCityId"
                    required
                    rules="required"
                    placeholder="Selecione sua cidade"
                    :options="[
                      {
                        label: 'Guarapuava',
                        value: '8e56ef10-3815-491d-b876-511f5e3b7de4',
                        selected: true
                      }
                    ]"
                  />

                  <CustomInput
                    id="originStreet"
                    name="originStreet"
                    label="Rua"
                    placeholder="Digite o endereço de retirada"
                    required
                    rules="required"
                    class="input input-lg bg-white w-full rounded-xl placeholder:text-sm text-sm focus:outline-0"
                  />

                  <CustomInput
                    id="originDistrict"
                    name="originDistrict"
                    label="Bairro"
                    placeholder="Digite o bairro"
                    required
                    rules="required"
                    class="input input-lg bg-white w-full rounded-xl placeholder:text-sm text-sm focus:outline-0"
                  />

                  <CustomInput
                    id="originNumber"
                    v-maska="'#####'"
                    name="originNumber"
                    label="Número"
                    placeholder="Ex: 123"
                    required
                    rules="required"
                    class="input input-lg bg-white w-full rounded-xl placeholder:text-sm text-sm focus:outline-0"
                  />
                </div>

                <h3 class="text-lg font-semibold text-gray-900 mb-4">Entrega</h3>
                <div class="grid grid-cols-2 gap-4">
                  <CustomSelect
                    id="destinationCityId"
                    label="Cidade"
                    name="destinationCityId"
                    required
                    rules="required"
                    placeholder="Selecione sua cidade"
                    :options="[
                      {
                        label: 'Guarapuava',
                        value: '8e56ef10-3815-491d-b876-511f5e3b7de4',
                        selected: true
                      }
                    ]"
                  />

                  <CustomInput
                    id="destinationStreet"
                    name="destinationStreet"
                    label="Rua"
                    placeholder="Digite o endereço de entrega"
                    required
                    rules="required"
                    class="input input-lg bg-white w-full rounded-xl placeholder:text-sm text-sm focus:outline-0"
                  />

                  <CustomInput
                    id="destinationDistrict"
                    name="destinationDistrict"
                    label="Bairro"
                    placeholder="Digite o bairro"
                    required
                    rules="required"
                    class="input input-lg bg-white w-full rounded-xl placeholder:text-sm text-sm focus:outline-0"
                  />

                  <CustomInput
                    id="destinationNumber"
                    v-maska="'#####'"
                    name="destinationNumber"
                    label="Número"
                    placeholder="Ex: 123"
                    required
                    rules="required"
                    class="input input-lg bg-white w-full rounded-xl placeholder:text-sm text-sm focus:outline-0"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Data e Hora do Frete</h3>

              <div class="space-y-3">
                <label
                  class="relative flex items-center p-4 border-2 rounded-xl cursor-pointer hover:border-amber-300 transition-all"
                  :class="{
                    'border-amber-500 bg-amber-50': formComponent?.values?.dateMode === 'IMMEDIATE',
                    ' border-gray-200': formComponent?.values?.dateMode === 'SCHEDULED'
                  }"
                >
                  <input
                    type="radio"
                    name="timeMode"
                    value="IMMEDIATE"
                    class="mr-3"
                    :checked="formComponent?.values?.dateMode === 'IMMEDIATE'"
                    @input="formComponent.setFieldValue('dateMode', 'IMMEDIATE')"
                  />
                  <span class="text-sm font-medium">O mais rápido possível</span>
                </label>

                <label
                  class="relative flex items-center p-4 border-2 rounded-xl cursor-pointer hover:border-amber-300 transition-all"
                  :class="{
                    'border-amber-500 bg-amber-50': formComponent?.values?.dateMode === 'SCHEDULED',
                    ' border-gray-200': formComponent?.values?.dateMode === 'IMMEDIATE'
                  }"
                >
                  <input
                    type="radio"
                    name="timeMode"
                    value="SCHEDULED"
                    class="mr-3 peer"
                    :checked="formComponent?.values?.dateMode === 'SCHEDULED'"
                    @input="formComponent.setFieldValue('dateMode', 'SCHEDULED')"
                  />
                  <span class="text-sm font-medium">Agendar uma data</span>
                </label>

                <div v-if="formComponent?.values.dateMode === 'SCHEDULED'" class="mt-4 space-y-4">
                  <div class="flex flex-col space-y-1.5">
                    <label class="text-sm font-medium text-gray-700">Data</label>
                    <input
                      type="datetime-local"
                      class="input input-lg bg-white w-full rounded-xl text-sm focus:outline-0"
                      :value="formComponent?.values.exactDatetime"
                      @input="formComponent.setFieldValue('exactDatetime', $event.target?.value)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="currentStep === 3">
          <h2 class="text-2xl font-bold mb-6">Revise as alterações</h2>

          <div class="space-y-6">
            <h3 class="text-lg font-semibold text-gray-900">Resumo das Informações</h3>

            <div>
              <h4 class="text-sm font-semibold text-gray-700 mb-3">Detalhes do Item</h4>
              <div class="bg-amber-50/50 rounded-xl p-4 space-y-2">
                <div>
                  <span class="text-sm font-medium text-gray-600">Título:</span>
                  <span class="text-sm text-gray-900 ml-2">{{ formComponent?.values.title }}</span>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600">Conteúdo:</span>
                  <span class="text-sm text-gray-900 ml-2">{{
                    formComponent?.values.description
                  }}</span>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600">Tipo de Veículo:</span>
                  <span class="text-sm text-gray-900 ml-2">{{
                    formComponent?.values.vehicleCategory
                  }}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 class="text-sm font-semibold text-gray-700 mb-3">Trajetória e Prazo</h4>
              <div class="bg-amber-50/50 rounded-xl p-4 space-y-2">
                <div>
                  <span class="text-sm font-medium text-gray-600">Origem:</span>
                  <span class="text-sm text-gray-900 ml-2">
                    {{ formComponent?.values.originStreet }},
                    {{ formComponent?.values.originNumber }} -
                    {{ formComponent?.values.originDistrict }}
                  </span>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600">Destino:</span>
                  <span class="text-sm text-gray-900 ml-2">
                    {{ formComponent?.values.destinationStreet }},
                    {{ formComponent?.values.destinationNumber }} -
                    {{ formComponent?.values.destinationDistrict }}
                  </span>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600">Prazo de entrega:</span>
                  <span class="text-sm text-gray-900 ml-2">
                    {{
                      formComponent?.values.dateMode === 'IMMEDIATE'
                        ? 'O mais rápido possível'
                        : 'Agendado'
                    }}
                  </span>
                </div>
                <div
                  v-if="
                    formComponent?.values.dateMode === 'SCHEDULED' &&
                    formComponent?.values.exactDatetime
                  "
                >
                  <span class="text-sm font-medium text-gray-600">Data:</span>
                  <span class="text-sm text-gray-900 ml-2">
                    {{ new Date(formComponent?.values.exactDatetime).toLocaleDateString('pt-BR') }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FormData>

      <div class="flex justify-between items-center mt-8 pb-2">
        <button v-if="currentStep > 1" type="button" class="btn btn-outline" @click="previousStep">
          Voltar
        </button>
        <div v-else></div>

        <div
          class="flex gap-3 w-full"
          :class="{ 'justify-end': currentStep > 1, 'justify-between': currentStep === 1 }"
        >
          <button v-if="currentStep === 1" type="button" class="btn btn-outline" @click="cancel">
            Cancelar
          </button>
          <SubmitButton
            class="w-min"
            :label="currentStep === totalSteps ? 'Salvar Alterações' : 'Continuar'"
            :loading="submitting"
            @click="nextStep"
          />
        </div>
      </div>
    </template>
  </div>
</template>
