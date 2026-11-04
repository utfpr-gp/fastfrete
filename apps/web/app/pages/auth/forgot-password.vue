<script setup lang="ts">
import CustomInput from '~/components/forms/CustomInput.vue'
import FormData from '~/components/forms/FormData.vue'
import { createAuthService } from '~~/domains/auth/composition'
import type { ForgotPasswordRequestDTO } from '~~/domains/auth/dtos/forgot-password-request.dto'

definePageMeta({
  layout: 'auth'
})

const authService = createAuthService()
const toast = useToast()
const submitDisabled = ref(false)

function updateIsValid(isValid: boolean) {
  submitDisabled.value = !isValid
}

async function handleFormSubmit(form: ForgotPasswordRequestDTO) {
  const result = await authService.forgotPassword(form)

  if (result.success) {
    toast.success({ title: 'Link de redefinição de senha enviado com sucesso!' })
  } else {
    toast.error({ title: 'Erro ao enviar link de redefinição de senha!' })
  }
}
</script>

<template>
  <div>
    <h1 class="text-2xl text-center font-bold mb-2">Recuperar acesso</h1>

    <p class="text-center text-gray-500 mb-8">
      Digite seu email para receber um link de redefinição de senha.
    </p>

    <FormData
      class="flex flex-col gap-2"
      @submit="handleFormSubmit($event.controlledValues)"
      @is-valid="updateIsValid"
    >
      <CustomInput
        id="email"
        label="Email"
        type="email"
        name="email"
        rules="required|email"
        required
        placeholder="Digite seu email"
        class="input input-lg w-full rounded-xl placeholder:text-sm text-sm"
      >
        <template #icon-start>
          <Icon
            name="uil:envelope"
            class="absolute left-3 top-6 -translate-y-1/2 z-1 text-gray-500"
          />
        </template>
      </CustomInput>

      <button
        type="submit"
        class="btn btn-lg text-sm w-full text-white bg-amber-500 rounded-xl hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="submitDisabled"
      >
        Enviar link
      </button>

      <a href="/auth/login" class="btn btn-ghost btn-lg text-sm w-full text-gray-800 rounded-xl"
        >Voltar para o login</a
      >
    </FormData>
  </div>
</template>
