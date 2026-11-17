<script setup lang="ts">
import { ref } from 'vue'
import SubmitButton from '~/components/forms/SubmitButton.vue'
import PaymentNotice from '~/components/ui/PaymentNotice.vue'

interface VehicleOption {
  id: string
  label: string
}

interface Props {
  suggestedPrice?: number
  vehicles: VehicleOption[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})
const emit = defineEmits<{
  submit: [data: { vehicleId: string; proposedValue: number; message?: string }]
}>()

const selectedVehicle = ref(props.vehicles[0]?.id || '')
const proposedValue = ref(props.suggestedPrice || 0)
const message = ref('')

function handleSubmit() {
  if (!selectedVehicle.value || !proposedValue.value) return

  emit('submit', {
    vehicleId: selectedVehicle.value,
    proposedValue: proposedValue.value,
    message: message.value || undefined
  })
}
</script>

<template>
  <div class="bg-white rounded-xl p-6 sticky top-6">
    <h2 class="text-xl font-bold text-gray-900 mb-6">Sua Proposta</h2>

    <div class="space-y-5">
      <div>
        <label class="text-xs font-semibold text-gray-500 mb-2 block">QUAL O SEU VEÍCULO?</label>
        <select
          v-model="selectedVehicle"
          class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option v-for="vehicle in vehicles" :key="vehicle.id" :value="vehicle.id">
            {{ vehicle.label }}
          </option>
        </select>
      </div>

      <div>
        <label class="text-xs font-semibold text-gray-500 mb-2 block">VALOR DA PROPOSTA</label>
        <div class="relative">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
          <input
            v-model.number="proposedValue"
            type="number"
            step="0.01"
            min="0"
            class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      <div>
        <label class="text-xs font-semibold text-gray-500 mb-2 block">MENSAGEM AO CLIENTE</label>
        <textarea
          v-model="message"
          rows="3"
          placeholder="Ex: Olá Ana, tenho ajudante e o veículo está limpo para o traslado sugerido."
          class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
        ></textarea>
      </div>

      <PaymentNotice />

      <SubmitButton
        label="Enviar Proposta"
        :loading="props.loading"
        class="w-full bg-amber-500 hover:bg-amber-600 text-white border-none"
        @click="handleSubmit"
      />
    </div>
  </div>
</template>
