<script setup lang="ts">
import { AVAILABILITY_WINDOWS } from '~/support/schedule'

interface Props {
  dateMode?: string | null
  exactDatetime?: string | null
  availabilityWindow?: string | null
}

defineProps<Props>()

const emit = defineEmits<{
  'update:dateMode': [value: string]
  'update:exactDatetime': [value: string]
  'update:availabilityWindow': [value: string]
}>()

const MODES = [
  { value: 'IMMEDIATE', label: 'O mais rápido possível' },
  { value: 'SCHEDULED', label: 'Agendar uma data e horário' },
  { value: 'FLEXIBLE', label: 'Informar uma janela de disponibilidade' }
]
</script>

<template>
  <div class="space-y-3">
    <label
      v-for="mode in MODES"
      :key="mode.value"
      class="relative flex items-center p-4 border-2 rounded-xl cursor-pointer hover:border-amber-300 transition-all"
      :class="dateMode === mode.value ? 'border-amber-500 bg-amber-50' : 'border-gray-200'"
    >
      <input
        type="radio"
        name="timeMode"
        :value="mode.value"
        :checked="dateMode === mode.value"
        class="mr-3"
        @input="emit('update:dateMode', mode.value)"
      />
      <span class="text-sm font-medium">{{ mode.label }}</span>
    </label>

    <div v-if="dateMode === 'SCHEDULED'" class="mt-4 space-y-4">
      <div class="flex flex-col space-y-1.5">
        <label for="exactDatetime" class="text-sm font-medium text-gray-700">Data e horário</label>
        <input
          id="exactDatetime"
          type="datetime-local"
          :value="exactDatetime ?? ''"
          class="input input-lg bg-white w-full rounded-xl text-sm focus:outline-0"
          @input="emit('update:exactDatetime', ($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>

    <div v-if="dateMode === 'FLEXIBLE'" class="mt-4 space-y-4">
      <div class="flex flex-col space-y-1.5">
        <label for="availabilityWindow" class="text-sm font-medium text-gray-700">
          Quando o frete pode ser realizado
        </label>
        <select
          id="availabilityWindow"
          :value="availabilityWindow ?? ''"
          class="select select-lg bg-white w-full rounded-xl text-sm focus:outline-0"
          @change="emit('update:availabilityWindow', ($event.target as HTMLSelectElement).value)"
        >
          <option value="" disabled>Selecione uma janela</option>
          <option v-for="window in AVAILABILITY_WINDOWS" :key="window.value" :value="window.value">
            {{ window.label }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>
