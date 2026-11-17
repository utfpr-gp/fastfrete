<script setup lang="ts">
import { vMaska } from 'maska/vue'
import { createUserService } from '~~/domains/users/composition'
import { createReviewService } from '~~/domains/reviews/composition'
import type { User } from '~~/domains/auth/entities/user.entity'
import type { PublicProfile } from '~~/domains/users/entities/public-profile.entity'
import type { Review } from '~~/domains/reviews/entities/review.entity'
import { useAuthStore } from '~~/stores/auth'
import { fromApiPhone, toApiPhone } from '~/support/phone'
import CustomInput from '~/components/forms/CustomInput.vue'
import FormData from '~/components/forms/FormData.vue'
import SubmitButton from '~/components/forms/SubmitButton.vue'
import ProfileHeader from '~/components/profile/ProfileHeader.vue'
import ProfileVehicles from '~/components/profile/ProfileVehicles.vue'
import ReviewList from '~/components/profile/ReviewList.vue'

const REVIEWS_PAGE_SIZE = 5
const inputClass =
  'input input-lg bg-white w-full rounded-xl placeholder:text-sm text-sm focus:outline-0'

const toast = useToast()
const authStore = useAuthStore()
const userService = createUserService()
const reviewService = createReviewService()

const user = ref<User | null>(null)
const profile = ref<PublicProfile | null>(null)
const reviews = ref<Review[]>([])
const reviewsTotal = ref(0)
const reviewsPage = ref(1)
const loading = ref(true)
const loadingReviews = ref(false)
const saving = ref(false)
const submitDisabled = ref(false)

const initialValues = computed(() => ({
  name: user.value?.name ?? '',
  email: user.value?.email ?? '',
  phoneNumber: fromApiPhone(user.value?.phoneNumber ?? '')
}))

function updateIsValid(isValid: boolean) {
  submitDisabled.value = !isValid
}

async function loadProfile() {
  if (!user.value) return
  const result = await userService.getPublicProfile(user.value.id)

  if (result.success) {
    profile.value = result.data
  } else {
    toast.error({ title: 'Erro ao carregar estatísticas', message: result.error.message })
  }
}

async function loadReviews() {
  if (!user.value) return
  loadingReviews.value = true
  const result = await reviewService.findAll({
    reviewedId: user.value.id,
    page: reviewsPage.value,
    limit: REVIEWS_PAGE_SIZE
  })

  if (result.success) {
    reviews.value = [...reviews.value, ...result.data.data]
    reviewsTotal.value = result.data.meta.total
  } else {
    toast.error({ title: 'Erro ao carregar avaliações', message: result.error.message })
  }
  loadingReviews.value = false
}

async function loadMoreReviews() {
  reviewsPage.value += 1
  await loadReviews()
}

async function handleFormSubmit(form: { name: string; email: string; phoneNumber: string }) {
  saving.value = true
  const result = await userService.updateProfile({
    name: form.name,
    email: form.email,
    phoneNumber: toApiPhone(form.phoneNumber)
  })

  if (result.success) {
    user.value = result.data
    authStore.user = result.data
    authStore.persist()
    await loadProfile()
    toast.success({ title: 'Perfil atualizado com sucesso!' })
  } else {
    toast.error({ title: 'Erro ao atualizar perfil', message: result.error.message })
  }
  saving.value = false
}

onMounted(async () => {
  const result = await userService.getProfile()

  if (result.success) {
    user.value = result.data
    await Promise.all([loadProfile(), loadReviews()])
  } else {
    toast.error({ title: 'Erro ao carregar perfil', message: result.error.message })
  }
  loading.value = false
})
</script>

<template>
  <div class="max-w-4xl mx-auto flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Meu Perfil</h1>
      <a v-if="user" :href="`/users/${user.id}`" class="btn btn-sm btn-outline">
        Ver como os outros me veem
      </a>
    </div>

    <div v-if="loading" class="bg-white rounded-xl p-12 flex justify-center">
      <span class="loading loading-spinner loading-lg text-amber-500"></span>
    </div>

    <template v-else-if="user">
      <ProfileHeader v-if="profile" :profile="profile" />

      <div class="bg-white rounded-xl p-6 shadow-sm">
        <h2 class="text-lg font-bold text-gray-900 mb-4">Dados da conta</h2>

        <FormData
          class="flex flex-col gap-2"
          :initial-values="initialValues"
          @submit="handleFormSubmit($event.controlledValues)"
          @is-valid="updateIsValid"
        >
          <CustomInput
            id="name"
            label="Nome"
            type="text"
            name="name"
            rules="required|min:3"
            required
            :class="inputClass"
          />

          <CustomInput
            id="email"
            label="Email"
            type="email"
            name="email"
            rules="required|email"
            required
            :class="inputClass"
          />

          <CustomInput
            id="phone"
            v-maska="'## #####-####'"
            label="Telefone"
            type="tel"
            name="phoneNumber"
            rules="required"
            required
            :class="inputClass"
          />

          <div class="text-sm text-gray-500 mb-2">Cidade: {{ user.city.name }}</div>

          <SubmitButton label="Salvar alterações" :loading="saving" :disabled="submitDisabled" />
        </FormData>
      </div>

      <div v-if="profile?.roleType === 'CARRIER'" class="flex flex-col gap-3">
        <ProfileVehicles :vehicles="profile.vehicles" />
        <a href="/carrier/vehicles" class="btn btn-sm btn-outline self-start">Gerenciar veículos</a>
      </div>

      <ReviewList
        :reviews="reviews"
        :total="reviewsTotal"
        :loading="loadingReviews"
        @load-more="loadMoreReviews"
      />
    </template>
  </div>
</template>
