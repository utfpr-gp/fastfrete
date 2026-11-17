<script setup lang="ts">
import FormFieldError from './FormFieldError.vue'
import FormFieldLabel from './FormFieldLabel.vue'

const props = defineProps<{
  label?: string
  id: string
  name: string
  rules?: string
  required?: boolean
  options: Array<{ label: string; value: string | number; selected?: boolean }>
  placeholder?: string
}>()

defineOptions({
  inheritAttrs: false
})

const { value, errorMessage } = useField(() => props.name, props.rules)

onMounted(() => {
  if (props.options.some((opt) => opt.selected)) {
    const selectedOption = props.options.find((opt) => opt.selected)
    if (selectedOption) {
      value.value = selectedOption.value
    }
  }
})
</script>

<template>
  <div class="flex flex-col space-y-1.5">
    <FormFieldLabel :id="id" :label="label" :required="required" />

    <div class="relative" :class="{ 'pb-5 mb-0.5': !errorMessage }">
      <select
        :id="id"
        v-model="value"
        v-bind="$attrs"
        class="select select-lg bg-white w-full rounded-xl text-sm focus:outline-0"
        :class="{ 'text-gray-500': !value }"
      >
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          class="text-gray-900"
        >
          {{ option.label }}
        </option>
      </select>
    </div>

    <FormFieldError :message="errorMessage" />
  </div>
</template>
