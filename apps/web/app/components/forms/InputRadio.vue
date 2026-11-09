<script setup lang="ts">
import FormFieldError from './FormFieldError.vue'
import FormFieldLabel from './FormFieldLabel.vue'

const props = defineProps<{
  label?: string
  error?: string
  id: string
  name: string
  rules?: string
  required?: boolean
  options: { label: string; value: string; default?: boolean }[]
}>()

defineOptions({
  inheritAttrs: false
})

const { value, errorMessage } = useField(() => props.name, props.rules)

onMounted(() => {
  if (props.options.some((o) => o.default)) {
    value.value = props.options.find((o) => o.default)?.value || ''
  }
})
</script>

<template>
  <div class="flex flex-col space-y-1.5">
    <FormFieldLabel :id="id" :label="label" :required="required" />

    <div class="flex gap-4 mb-5">
      <div v-for="option in props.options" :key="option.value">
        <input
          :id="`${id}-${option.value}`"
          v-model="value"
          type="radio"
          :name="props.name"
          :value="option.value"
          v-bind="$attrs"
          class="mr-2"
        />
        <label :for="`${id}-${option.value}`" class="text-sm">{{ option.label }}</label>
      </div>
    </div>

    <FormFieldError :message="errorMessage" />
  </div>
</template>
