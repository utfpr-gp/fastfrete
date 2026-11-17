<script setup lang="ts">
import { useAuthStore } from '~~/stores/auth'

const toast = useToast()
const authStore = useAuthStore()
const isClient = authStore.isClient
const isCarrier = authStore.isCarrier
const isAdmin = authStore.isAdmin

function logout() {
  authStore.logout()
  toast.success({ title: 'Logout realizado com sucesso!' })
}
</script>

<template>
  <div class="flex justify-center shadow-accent shadow-lg">
    <div class="navbar bg-base-100 max-w-350 shadow-none px-0">
      <div class="navbar-start">
        <img src="~/assets/images/logo-fastfrete.png" alt="logo" class="w-48 h-auto" />
      </div>

      <div class="navbar-end">
        <div class="flex gap-3">
          <a
            v-if="isClient"
            href="/client/freights/create"
            class="btn bg-amber-500 text-white rounded-2xl"
            >Publicar Anúncio</a
          >
          <a v-if="isCarrier" class="btn btn-outline btn-primary rounded-2xl">Meus fretes</a>
          <a v-if="isAdmin" href="/admin/users" class="btn btn-outline btn-error rounded-2xl"
            >Admin</a
          >
          <!-- <div class="flex justify-center items-center w-10 h-10 bg-gray-200 rounded-full">
            <Icon name="uil:bell" class="text-gray-500" />
          </div> -->
          <div class="dropdown dropdown-end cursor-pointer">
            <div
              tabindex="0"
              class="flex justify-center items-center w-10 h-10 bg-gray-200 rounded-full"
            >
              <Icon name="bi:person" class="text-gray-500" />
            </div>
            <ul
              tabindex="-1"
              class="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
            >
              <li v-if="!isAdmin"><a href="/profile">Perfil</a></li>
              <li><a @click="logout">Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
