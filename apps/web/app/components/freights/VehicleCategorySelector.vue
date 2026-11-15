<script setup lang="ts">
import FormFieldLabel from '~/components/forms/FormFieldLabel.vue'
import FormFieldError from '~/components/forms/FormFieldError.vue'
import { VEHICLE_CATEGORIES } from '~/support/vehicle-categories'

const props = defineProps<{
  label?: string
  error?: string
  id: string
  name: string
  rules?: string
  required?: boolean
}>()

const { value, errorMessage } = useField(() => props.name, props.rules)
</script>

<template>
  <div class="flex flex-col space-y-1.5 mt-3">
    <FormFieldLabel :id="id" :label="label" :required="required" />

    <div class="grid grid-cols-2 md:grid-cols-4 gap-3" :class="{ 'pb-5 mb-0.5': !errorMessage }">
      <label v-for="category in VEHICLE_CATEGORIES" :key="category" class="relative">
        <input
          type="radio"
          :value="category"
          class="peer sr-only"
          :name="props.name"
          :checked="value === category"
          @input="value = category"
        />
        <div
          class="p-4 text-center border border-gray-400 rounded-xl cursor-pointer peer-checked:border-amber-500 peer-checked:bg-amber-50 hover:border-amber-300 transition-all"
        >
          {{ category }}
        </div>
      </label>
    </div>

    <FormFieldError :message="errorMessage" />
  </div>
</template>
