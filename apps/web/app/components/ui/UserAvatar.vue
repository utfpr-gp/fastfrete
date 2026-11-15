<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg'
  imageUrl?: string
  alt?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  alt: 'Usuário'
})

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  }
  return sizes[props.size]
})

const iconSizeClasses = computed(() => {
  const sizes = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  }
  return sizes[props.size]
})
</script>

<template>
  <div
    class="bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
    :class="sizeClasses"
  >
    <img
      v-if="imageUrl"
      :src="imageUrl"
      :alt="alt"
      class="w-full h-full object-cover"
    />
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      class="text-gray-400"
      :class="iconSizeClasses"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  </div>
</template>
