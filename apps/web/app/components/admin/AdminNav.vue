<script setup lang="ts">
const route = useRoute()

const links = [
  { label: 'Painel', href: '/admin' },
  { label: 'Usuários', href: '/admin/users' },
  { label: 'Fretes', href: '/admin/freights' }
]

function isActive(href: string) {
  return route.path === href
}
</script>

<template>
  <nav class="flex gap-2 border-b border-gray-200">
    <a
      v-for="link in links"
      :key="link.href"
      :href="link.href"
      class="px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors"
      :class="
        isActive(link.href)
          ? 'border-amber-500 text-amber-700'
          : 'border-transparent text-gray-500 hover:text-gray-700'
      "
    >
      {{ link.label }}
    </a>
  </nav>
</template>
