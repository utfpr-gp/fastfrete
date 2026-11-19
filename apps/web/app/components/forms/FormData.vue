<script setup lang="ts">
interface Props {
  initialValues?: Record<string, unknown>
}

const props = defineProps<Props>()
const emit = defineEmits(['submit', 'isValid'])

const { handleSubmit, meta, values, validate, resetForm, setFieldValue } = useForm({
  initialValues: props.initialValues
})

watch(meta, (value) => {
  emit('isValid', value?.valid)
})

const onSubmit = handleSubmit((values, actions) => {
  emit('submit', { ...actions, controlledValues: values })
})

defineExpose({
  values,
  validate,
  setFieldValue,
  resetForm
})
</script>

<template>
  <form novalidate v-bind="$attrs" @submit.prevent="onSubmit">
    <slot></slot>
  </form>
</template>
