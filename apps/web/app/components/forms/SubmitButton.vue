<script setup lang="ts">
defineProps<{
  label: string
  loading?: boolean
  disabled?: boolean
}>()
</script>

<template>
  <button
    type="submit"
    class="btn btn-lg text-sm w-full text-gray-900 bg-amber-500 rounded-xl hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-nowrap"
    :disabled="disabled || loading"
  >
    <span v-if="!loading">{{ label }}</span>
    <span v-else class="flex items-center justify-center">
      <svg
        class="mr-3 -ml-1 size-5 animate-spin text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      Carregando...
    </span>
  </button>
</template>
