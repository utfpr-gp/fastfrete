<script setup lang="ts">
import { createUserService } from '~~/domains/users/composition'
import { createReviewService } from '~~/domains/reviews/composition'
import type { PublicProfile } from '~~/domains/users/entities/public-profile.entity'
import type { Review } from '~~/domains/reviews/entities/review.entity'
import { useAuthStore } from '~~/stores/auth'
import ProfileHeader from '~/components/profile/ProfileHeader.vue'
import ProfileVehicles from '~/components/profile/ProfileVehicles.vue'
import ReviewList from '~/components/profile/ReviewList.vue'

const REVIEWS_PAGE_SIZE = 5

const route = useRoute()
const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const userService = createUserService()
const reviewService = createReviewService()

const userId = route.params.id as string

const profile = ref<PublicProfile | null>(null)
const reviews = ref<Review[]>([])
const reviewsTotal = ref(0)
const reviewsPage = ref(1)
const loading = ref(true)
const loadingReviews = ref(false)
const notFound = ref(false)

const isOwnProfile = computed(() => authStore.getUser?.id === userId)

async function loadProfile() {
  const result = await userService.getPublicProfile(userId)

  if (result.success) {
    profile.value = result.data
  } else if (result.error.code === 404) {
    notFound.value = true
  } else {
    toast.error({ title: 'Erro ao carregar perfil', message: result.error.message })
  }
}

async function loadReviews() {
  loadingReviews.value = true
  const result = await reviewService.findAll({
    reviewedId: userId,
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

onMounted(async () => {
  await loadProfile()
  if (profile.value) {
    await loadReviews()
  }
  loading.value = false
})
</script>

<template>
  <div class="max-w-4xl mx-auto flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <button class="btn btn-ghost btn-sm" @click="router.back()">← Voltar</button>
      <a v-if="isOwnProfile" href="/profile" class="btn btn-sm btn-outline">Editar meu perfil</a>
    </div>

    <div v-if="loading" class="bg-white rounded-xl p-12 flex justify-center">
      <span class="loading loading-spinner loading-lg text-amber-500"></span>
    </div>

    <div
      v-else-if="notFound || !profile"
      class="bg-white rounded-xl p-12 flex flex-col items-center gap-3"
    >
      <div class="text-6xl">👤</div>
      <div class="font-bold text-xl">Perfil não encontrado</div>
      <div class="text-gray-500">Este usuário não existe ou não está disponível.</div>
    </div>

    <template v-else>
      <ProfileHeader :profile="profile" />
      <ProfileVehicles v-if="profile.roleType === 'CARRIER'" :vehicles="profile.vehicles" />
      <ReviewList
        :reviews="reviews"
        :total="reviewsTotal"
        :loading="loadingReviews"
        @load-more="loadMoreReviews"
      />
    </template>
  </div>
</template>
