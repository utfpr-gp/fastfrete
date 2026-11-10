<script setup lang="ts">
import { useAuthStore } from '~~/stores/auth'

const toast = useToast()
const authStore = useAuthStore()

function logout() {
  authStore.logout()
  toast.success({ title: 'Logout realizado com sucesso!' })
}
</script>

<template>
  <div>
    <div class="navbar bg-base-100 shadow-sm">
      <div class="navbar-start">
        <a class="btn btn-ghost text-xl">FastFrete</a>
      </div>

      <div class="navbar-end">
        <a class="btn" @click="logout">Logout</a>
      </div>
    </div>
    <slot></slot>
  </div>
</template>
