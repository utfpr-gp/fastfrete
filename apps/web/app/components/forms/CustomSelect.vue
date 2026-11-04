<script setup lang="ts">
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
    <label v-if="label" :for="id" class="block text-sm font-medium">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>

    <div class="relative" :class="{ 'pb-5 mb-0.5': !errorMessage }">
      <select
        :id="id"
        v-model="value"
        v-bind="$attrs"
        class="select select-lg bg-white w-full rounded-xl text-sm focus:outline-0"
        :class="{ 'text-gray-400': !value }"
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

    <span v-if="errorMessage" class="block text-xs text-red-500 font-medium">
      {{ errorMessage }}
    </span>
  </div>
</template>
