<script setup lang="ts">
import { createUserService } from '~~/domains/users/composition'
import type { User } from '~~/domains/auth/entities/user.entity'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const userService = createUserService()

const users = ref<User[]>([])
const loading = ref(false)
const total = ref(0)
const totalPages = ref(0)

const searchName = computed({
  get: () => (route.query.name as string) || '',
  set: (value) => {
    const query = { ...route.query }
    if (value) {
      query.name = value
    } else {
      delete query.name
    }
    query.page = '1'
    router.push({ query })
  }
})

const filterStatus = computed({
  get: () => (route.query.status as string) || null,
  set: (value) => {
    const query = { ...route.query }
    if (value) {
      query.status = value
    } else {
      delete query.status
    }
    query.page = '1'
    router.push({ query })
  }
})

const currentPage = computed({
  get: () => Number(route.query.page) || 1,
  set: (value) => {
    const query = { ...route.query }
    query.page = String(value)
    router.push({ query })
  }
})

const suspendModalOpen = ref(false)
const userToSuspend = ref<User | null>(null)
const suspendReason = ref('')
const suspending = ref(false)

function openSuspendModal(user: User) {
  userToSuspend.value = user
  suspendReason.value = ''
  suspendModalOpen.value = true
}

function closeSuspendModal() {
  suspendModalOpen.value = false
  userToSuspend.value = null
  suspendReason.value = ''
}

async function confirmSuspend() {
  if (!userToSuspend.value || !suspendReason.value.trim()) return

  suspending.value = true
  const result = await userService.suspendUser(userToSuspend.value.id, suspendReason.value)

  if (result.success) {
    toast.success({ title: 'Usuário suspenso com sucesso' })
    closeSuspendModal()
    await loadUsers()
  } else {
    toast.error({ title: 'Erro ao suspender usuário', message: result.error.message })
  }

  suspending.value = false
}

async function confirmReactivate(user: User) {
  const result = await userService.reactivateUser(user.id)

  if (result.success) {
    toast.success({ title: 'Usuário reativado com sucesso' })
    await loadUsers()
  } else {
    toast.error({ title: 'Erro ao reativar usuário', message: result.error.message })
  }
}

async function loadUsers() {
  loading.value = true
  const result = await userService.findAllAdmin({
    name: searchName.value || undefined,
    status: (filterStatus.value as 'ACTIVE' | 'SUSPENDED') || undefined,
    page: currentPage.value,
    limit: 10
  })

  if (result.success) {
    users.value = result.data.data
    total.value = result.data.meta.total
    totalPages.value = result.data.meta.totalPages
  } else {
    toast.error({ title: 'Erro ao carregar usuários', message: result.error.message })
  }

  loading.value = false
}

function getRoleLabel(user: User): string {
  return user.roles[0]?.name || '—'
}

watch(
  () => [route.query.name, route.query.status, route.query.page],
  () => {
    loadUsers()
  }
)

await loadUsers()
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Gestão de Usuários</h1>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl p-4 shadow-sm">
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex-1 min-w-48">
          <input
            type="text"
            placeholder="Buscar por nome..."
            class="input input-bordered w-full"
            :value="searchName"
            @input="searchName = ($event.target as HTMLInputElement).value"
          />
        </div>
        <select
          class="select select-bordered"
          :value="filterStatus || ''"
          @change="filterStatus = ($event.target as HTMLSelectElement).value || null"
        >
          <option value="">Todos os status</option>
          <option value="ACTIVE">Ativo</option>
          <option value="SUSPENDED">Suspenso</option>
        </select>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="bg-white rounded-xl p-12 flex justify-center">
      <span class="loading loading-spinner loading-lg text-amber-500"></span>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="users.length === 0"
      class="bg-white rounded-xl p-12 flex flex-col items-center gap-3"
    >
      <div class="text-6xl">👤</div>
      <div class="font-bold text-xl">Nenhum usuário encontrado</div>
      <div class="text-gray-500">Tente ajustar os filtros de busca.</div>
    </div>

    <!-- Results -->
    <div v-else>
      <div class="text-sm text-gray-500 mb-4">
        {{ total }} usuário{{ total !== 1 ? 's' : '' }} encontrado{{ total !== 1 ? 's' : '' }}
      </div>

      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <table class="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Cidade</th>
              <th>Perfil</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id" class="hover">
              <td class="font-medium">{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.phoneNumber }}</td>
              <td>{{ user.city.name }}</td>
              <td>
                <span class="badge badge-ghost badge-sm">{{ getRoleLabel(user) }}</span>
              </td>
              <td>
                <span
                  v-if="user.status === 'ACTIVE'"
                  class="badge badge-success badge-sm text-white"
                >
                  Ativo
                </span>
                <span
                  v-else
                  class="badge badge-error badge-sm text-white"
                  :title="user.suspensionReason || ''"
                >
                  Suspenso
                </span>
              </td>
              <td>
                <button
                  v-if="user.status === 'ACTIVE'"
                  class="btn btn-error btn-xs"
                  @click="openSuspendModal(user)"
                >
                  Suspender
                </button>
                <button
                  v-else
                  class="btn btn-success btn-xs text-white"
                  @click="confirmReactivate(user)"
                >
                  Reativar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center mt-4">
        <div class="join">
          <button
            class="join-item btn btn-sm"
            :disabled="currentPage <= 1"
            @click="currentPage = currentPage - 1"
          >
            «
          </button>
          <button class="join-item btn btn-sm">Página {{ currentPage }} de {{ totalPages }}</button>
          <button
            class="join-item btn btn-sm"
            :disabled="currentPage >= totalPages"
            @click="currentPage = currentPage + 1"
          >
            »
          </button>
        </div>
      </div>
    </div>

    <!-- Suspend Modal -->
    <div
      v-if="suspendModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
    >
      <div class="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h3 class="text-lg font-bold mb-1">Suspender Usuário</h3>
        <p class="text-sm text-gray-500 mb-4">
          Suspender <strong>{{ userToSuspend?.name }}</strong
          >. O usuário não poderá mais acessar o sistema.
        </p>

        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">Motivo da suspensão</span>
          </label>
          <textarea
            v-model="suspendReason"
            class="textarea textarea-bordered h-24"
            placeholder="Informe o motivo da suspensão..."
          ></textarea>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button class="btn btn-ghost" @click="closeSuspendModal">Cancelar</button>
          <button
            class="btn btn-error text-white"
            :disabled="!suspendReason.trim() || suspending"
            @click="confirmSuspend"
          >
            <span v-if="suspending" class="loading loading-spinner loading-sm"></span>
            Suspender
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
