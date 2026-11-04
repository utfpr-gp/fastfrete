<script setup lang="ts">
import CustomInput from '~/components/forms/CustomInput.vue'
import FormData from '~/components/forms/FormData.vue'
import { createAuthService } from '~~/domains/auth/composition'
import type { ResetPasswordRequestDTO } from '~~/domains/auth/dtos/reset-password-request.dto'

definePageMeta({
  layout: 'auth'
})

const authService = createAuthService()
const toast = useToast()
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const submitDisabled = ref(false)
const urlToken = useRoute().query['token'] as string

function updateIsValid(isValid: boolean) {
  submitDisabled.value = !isValid
}

async function handleFormSubmit(form: { password: string; confirmPassword: string }) {
  const formReset: ResetPasswordRequestDTO = { token: urlToken, password: form.password }
  const result = await authService.resetPassword(formReset)

  if (result.success) {
    toast.success({ title: 'Login realizado com sucesso!' })
  } else {
    toast.error({ title: 'Usuário ou senha inválidos!' })
  }
}
</script>

<template>
  <div>
    <h1 class="text-3xl text-center font-bold mb-2">Redefinir senha</h1>

    <p class="text-center text-gray-500 mb-8">Defina uma nova senha para recuperar seu acesso.</p>

    <FormData
      class="flex flex-col gap-2"
      @submit="handleFormSubmit($event.controlledValues)"
      @is-valid="updateIsValid"
    >
      <CustomInput
        id="password"
        label="Nova senha"
        :type="showPassword ? 'text' : 'password'"
        name="password"
        required
        rules="required|strongPassword"
        placeholder="Digite uma senha"
        class="input input-lg bg-white w-full rounded-xl placeholder:text-sm text-sm focus:outline-0"
      >
        <template #icon-start>
          <Icon name="uil:lock" class="absolute left-3 top-6 -translate-y-1/2 z-1 text-gray-500" />
        </template>
        <template #icon-end>
          <div
            class="absolute right-3 top-6 -translate-y-1/2 z-1 cursor-pointer h-4 text-gray-500"
            @click="showPassword = !showPassword"
          >
            <Icon v-if="showPassword" name="uil:eye" />
            <Icon v-else name="uil:eye-slash" />
          </div>
        </template>
      </CustomInput>

      <CustomInput
        id="confirm-password"
        label="Confirmar nova senha"
        :type="showConfirmPassword ? 'text' : 'password'"
        name="confirmPassword"
        rules="required|confirmed:@password"
        required
        placeholder="Confirme a senha"
        class="input input-lg bg-white w-full rounded-xl placeholder:text-sm text-sm focus:outline-0"
      >
        <template #icon-start>
          <Icon name="uil:lock" class="absolute left-3 top-6 -translate-y-1/2 z-1 text-gray-500" />
        </template>
        <template #icon-end>
          <div
            class="absolute right-3 top-6 -translate-y-1/2 z-1 cursor-pointer h-4 text-gray-500"
            @click="showConfirmPassword = !showConfirmPassword"
          >
            <Icon v-if="showConfirmPassword" name="uil:eye" />
            <Icon v-else name="uil:eye-slash" />
          </div>
        </template>
      </CustomInput>

      <button
        type="submit"
        class="btn btn-lg text-sm w-full text-white bg-amber-500 rounded-xl hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="submitDisabled"
      >
        Redefinir
      </button>
    </FormData>
  </div>
</template>
