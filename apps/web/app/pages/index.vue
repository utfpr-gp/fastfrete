<script setup lang="ts">
import { useAuthStore } from '~~/stores/auth'

const { isCarrier, isClient, isAdmin, isAuthenticated } = useAuthStore()

if (isAuthenticated) {
  if (isCarrier) {
    navigateTo('/carrier')
  } else if (isClient) {
    navigateTo('/client')
  } else if (isAdmin) {
    navigateTo('/admin/users')
  }
}
</script>

<template>
  <div>index page</div>
</template>
