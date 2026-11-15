<script setup lang="ts">
import FormFieldLabel from '~/components/forms/FormFieldLabel.vue'
import FormFieldError from '~/components/forms/FormFieldError.vue'

const props = defineProps<{
  label?: string
  error?: string
  id: string
  name: string
  rules?: string
  required?: boolean
}>()

const vehicleCategories = [
  { label: 'Moto', value: 'Moto' },
  { label: 'Van', value: 'Van' },
  { label: 'Carro', value: 'Carro' },
  { label: 'Caminhonete', value: 'Caminhonete' },
  { label: 'Caminhão 3/4', value: 'Caminhão 3/4' },
  { label: 'Caminhão Toco', value: 'Caminhão Toco' },
  { label: 'Caminhão Truck', value: 'Caminhão Truck' }
]

const { value, errorMessage } = useField(() => props.name, props.rules)
</script>

<template>
  <div class="flex flex-col space-y-1.5 mt-3">
    <FormFieldLabel :id="id" :label="label" :required="required" />

    <div class="grid grid-cols-2 md:grid-cols-4 gap-3" :class="{ 'pb-5 mb-0.5': !errorMessage }">
      <label v-for="category in vehicleCategories" :key="category.value" class="relative">
        <input
          type="radio"
          :value="category.value"
          class="peer sr-only"
          :name="props.name"
          :checked="value === category.value"
          @input="value = category.value"
        />
        <div
          class="p-4 text-center border border-gray-400 rounded-xl cursor-pointer peer-checked:border-amber-500 peer-checked:bg-amber-50 hover:border-amber-300 transition-all"
        >
          {{ category.label }}
        </div>
      </label>
    </div>

    <FormFieldError :message="errorMessage" />
  </div>
</template>
