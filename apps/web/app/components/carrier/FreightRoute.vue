<script setup lang="ts">
interface RoutePoint {
  label: string
  address: string
  reference?: string
}

interface Props {
  origin: RoutePoint
  destination: RoutePoint
}

defineProps<Props>()
</script>

<template>
  <div class="bg-white rounded-xl p-6">
    <h2 class="text-xl font-bold text-gray-900 mb-6">Roteiro do Frete</h2>

    <div class="flex gap-6">
      <div class="flex-1 space-y-6">
        <div class="flex gap-4">
          <div class="flex flex-col items-center">
            <div
              class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-sm"
            >
              O
            </div>
            <div class="w-0.5 h-16 bg-gray-200 my-2"></div>
            <div
              class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-sm"
            >
              D
            </div>
          </div>

          <div class="flex-1 space-y-6">
            <div>
              <div class="text-xs text-gray-500 mb-1">ORIGEM</div>
              <div class="font-semibold text-gray-900">{{ origin.address }}</div>
              <div v-if="origin.reference" class="text-sm text-gray-600 mt-1">
                {{ origin.reference }}
              </div>
            </div>

            <div>
              <div class="text-xs text-gray-500 mb-1">DESTINO</div>
              <div class="font-semibold text-gray-900">{{ destination.address }}</div>
              <div v-if="destination.reference" class="text-sm text-gray-600 mt-1">
                {{ destination.reference }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
