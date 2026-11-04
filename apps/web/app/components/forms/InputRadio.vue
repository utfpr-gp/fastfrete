<script setup lang="ts">
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
    <label v-if="label" :for="id" class="block text-sm font-medium">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>

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

    <span v-if="errorMessage" class="block text-xs text-red-500 font-medium">
      {{ errorMessage }}
    </span>
  </div>
</template>
