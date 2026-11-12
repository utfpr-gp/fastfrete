<script setup lang="ts">
const emits = defineEmits(['updateUploadedPhotos'])

const uploadedPhotos = ref<File[]>([])
const photoPreviews = ref<string[]>([])

function handlePhotoUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const files = target.files

  if (!files) return

  const remainingSlots = 3 - uploadedPhotos.value.length
  const newFiles = Array.from(files).slice(0, remainingSlots)

  newFiles.forEach((file) => {
    if (uploadedPhotos.value.length < 3) {
      uploadedPhotos.value.push(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        photoPreviews.value.push(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  })

  target.value = ''
}

function removePhoto(index: number) {
  uploadedPhotos.value.splice(index, 1)
  photoPreviews.value.splice(index, 1)
}

watch(uploadedPhotos.value, (newPhoto) => {
  emits('updateUploadedPhotos', newPhoto)
})
</script>
<template>
  <div class="flex flex-col space-y-1.5">
    <label class="text-sm font-medium text-gray-700">
      Fotos do Item <span class="text-gray-400">(Opcional)</span>
    </label>
    <div
      class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center"
      :class="{ 'border-amber-500 bg-amber-50': photoPreviews.length > 0 }"
    >
      <div v-if="photoPreviews.length === 0">
        <div class="text-4xl mb-2">📷</div>
        <p class="text-sm text-gray-600 mb-3">Você pode adicionar até 3 fotos.</p>
        <label
          class="btn btn-sm bg-amber-500 text-white border-none hover:bg-amber-600 cursor-pointer"
        >
          Adicionar Fotos
          <input type="file" accept="image/*" multiple class="hidden" @change="handlePhotoUpload" />
        </label>
      </div>
      <div v-else class="grid grid-cols-3 gap-4">
        <div v-for="(preview, index) in photoPreviews" :key="index" class="relative">
          <img :src="preview" class="w-full h-32 object-cover rounded-lg" />
          <button
            type="button"
            class="absolute top-2 right-2 btn btn-xs btn-circle bg-white"
            @click="removePhoto(index)"
          >
            ✕
          </button>
        </div>
        <label
          v-if="uploadedPhotos.length < 3"
          class="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-amber-500"
        >
          <input type="file" accept="image/*" multiple class="hidden" @change="handlePhotoUpload" />
          <span class="text-2xl text-gray-400">+</span>
        </label>
      </div>
    </div>
  </div>
</template>
