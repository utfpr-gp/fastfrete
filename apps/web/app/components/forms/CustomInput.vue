<script setup lang="ts">
const props = defineProps<{
  label?: string
  error?: string
  id: string
  name: string
  rules?: string
}>()

defineOptions({
  inheritAttrs: false
})

const { value, errorMessage } = useField(() => props.name, props.rules)
</script>

<template>
  <div class="flex flex-col space-y-1.5">
    <label v-if="label" :for="id" class="block text-sm font-medium">
      {{ label }}
    </label>

    <div class="relative" :class="{ 'pb-5 mb-0.5': !errorMessage }">
      <slot name="icon-start"></slot>
      <input
        :id="id"
        v-model="value"
        v-bind="$attrs"
        :class="{
          'pl-10': $slots['icon-start'],
          'pr-10': $slots['icon-end']
        }"
      />
      <slot name="icon-end"></slot>
    </div>

    <span v-if="errorMessage" class="block text-xs text-red-500 font-medium">
      {{ errorMessage }}
    </span>
  </div>
</template>
