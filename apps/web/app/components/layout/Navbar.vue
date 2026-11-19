<script setup lang="ts">
import { useAuthStore } from '~~/stores/auth'

const toast = useToast()
const authStore = useAuthStore()
const isClient = authStore.isClient
const isCarrier = authStore.isCarrier
const isAdmin = authStore.isAdmin

interface NavLink {
  label: string
  href: string
  match: string[]
}

const route = useRoute()

const clientLinks: NavLink[] = [
  {
    label: 'Meus fretes',
    href: '/client',
    match: ['/client', '/client/freights/']
  },
  { label: 'Fretistas', href: '/client/carrier-catalog', match: ['/client/carrier-catalog'] }
]

const carrierLinks: NavLink[] = [
  { label: 'Fretes abertos', href: '/carrier', match: ['/carrier', '/carrier/freights/'] },
  { label: 'Candidaturas', href: '/carrier/applications', match: ['/carrier/applications'] },
  { label: 'Veículos', href: '/carrier/vehicles', match: ['/carrier/vehicles'] }
]

const adminLinks: NavLink[] = [
  { label: 'Painel', href: '/admin', match: ['/admin'] },
  { label: 'Usuários', href: '/admin/users', match: ['/admin/users'] },
  { label: 'Fretes', href: '/admin/freights', match: ['/admin/freights'] }
]

const links = isAdmin ? adminLinks : isCarrier ? carrierLinks : isClient ? clientLinks : []

function isActive(link: NavLink) {
  return link.match.some((prefix) =>
    prefix.endsWith('/') ? route.path.startsWith(prefix) : route.path === prefix
  )
}

function logout() {
  authStore.logout()
  toast.success({ title: 'Logout realizado com sucesso!' })
}
</script>

<template>
  <div class="flex justify-center shadow-accent shadow-lg">
    <div class="navbar bg-base-100 max-w-350 shadow-none px-0">
      <div class="navbar-start">
        <a :href="isAdmin ? '/admin' : isCarrier ? '/carrier' : '/client'">
          <img src="~/assets/images/logo-fastfrete.png" alt="FastFrete" class="w-48 h-auto" />
        </a>
      </div>

      <nav class="navbar-center hidden md:flex gap-1">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="px-4 py-2 text-sm font-medium rounded-2xl transition-colors"
          :class="
            isActive(link)
              ? 'bg-amber-100 text-amber-700'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          "
          :aria-current="isActive(link) ? 'page' : undefined"
          >{{ link.label }}</a
        >
      </nav>

      <div class="navbar-end">
        <div class="flex gap-3">
          <a
            v-if="isClient"
            href="/client/freights/create"
            class="btn bg-amber-500 text-gray-900 rounded-2xl hover:bg-amber-400"
            >Publicar Anúncio</a
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
              <li v-for="link in links" :key="link.href" class="md:hidden">
                <a :href="link.href" :class="{ 'menu-active': isActive(link) }">{{ link.label }}</a>
              </li>
              <li v-if="!isAdmin"><a href="/profile">Perfil</a></li>
              <li><a @click="logout">Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
