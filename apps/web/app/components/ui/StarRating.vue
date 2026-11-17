<script setup lang="ts">
interface Props {
  rating: number
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const rounded = computed(() => Math.round(props.rating))

const sizeClass = computed(() => {
  const sizes = { sm: 'text-sm', md: 'text-base', lg: 'text-2xl' }
  return sizes[props.size]
})
</script>

<template>
  <span
    class="inline-flex tracking-tight"
    :class="sizeClass"
    role="img"
    :aria-label="`Nota ${rating.toFixed(1)} de 5`"
  >
    <span
      v-for="star in 5"
      :key="star"
      :class="star <= rounded ? 'text-amber-500' : 'text-gray-300'"
      >★</span
    >
  </span>
</template>
