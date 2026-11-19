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
}>()

defineOptions({
  inheritAttrs: false
})

const { value, errorMessage } = useField<string>(() => props.name, props.rules)
</script>

<template>
  <div class="flex flex-col space-y-1.5">
    <FormFieldLabel :id="id" :label="label" :required="required" />

    <div class="relative" :class="{ 'pb-5 mb-0.5': !errorMessage }">
      <slot name="icon-start"></slot>
      <textarea
        :id="id"
        v-model="value"
        v-bind="$attrs"
        :class="{
          'pl-10': $slots['icon-start'],
          'pr-10': $slots['icon-end']
        }"
      ></textarea>
      <slot name="icon-end"></slot>
    </div>

    <FormFieldError :message="errorMessage" />
  </div>
</template>
