<script setup lang="ts">
const emit = defineEmits(['submit', 'isValid'])

const { handleSubmit, meta } = useForm()

watch(meta, (value) => {
  emit('isValid', value?.valid)
})

const onSubmit = handleSubmit((values, actions) => {
  emit('submit', { ...actions, controlledValues: values })
})
</script>

<template>
  <form novalidate v-bind="$attrs" @submit.prevent="onSubmit">
    <slot></slot>
  </form>
</template>
