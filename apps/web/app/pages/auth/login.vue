<script setup lang="ts">
import CustomInput from '~/components/forms/CustomInput.vue'
import FormData from '~/components/forms/FormData.vue'
import { createAuthService } from '~~/domains/auth/composition'
import type { LoginRequestDTO } from '~~/domains/auth/dtos/login-request.dto'

definePageMeta({
  layout: 'auth'
})

const authService = createAuthService()
const toast = useToast()
const showPassword = ref(false)
const submitDisabled = ref(false)

function updateIsValid(isValid: boolean) {
  submitDisabled.value = !isValid
}

async function handleFormSubmit(form: LoginRequestDTO) {
  const result = await authService.login(form)

  if (result.success) {
    toast.success({ title: 'Login realizado com sucesso!' })
  } else {
    toast.error({ title: 'Usuário ou senha inválidos!' })
  }
}
</script>

<template>
  <div>
    <h1 class="text-3xl text-center font-bold mb-2">Bem vindo de volta!</h1>

    <p class="text-center text-gray-500 mb-8">
      Acesse para publicar, avaliar e gerenciar seus anúncios.
    </p>

    <FormData
      class="flex flex-col gap-2"
      @submit="handleFormSubmit($event.controlledValues)"
      @is-valid="updateIsValid"
    >
      <CustomInput
        id="teste"
        label="Email"
        placeholder="Digite seu email"
        type="email"
        name="email"
        required
        rules="required|email"
        class="input input-lg bg-white w-full rounded-xl placeholder:text-sm text-sm focus:outline-0"
      >
        <template #icon-start>
          <Icon
            name="uil:envelope"
            class="absolute left-3 top-6 -translate-y-1/2 z-1 text-gray-500"
          />
        </template>
      </CustomInput>

      <CustomInput
        id="password"
        label="Senha"
        placeholder="Digite sua senha"
        :type="showPassword ? 'text' : 'password'"
        name="password"
        required
        rules="required"
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

      <div class="w-full flex justify-end">
        <a href="/auth/forgot-password" class="text-primary hover:underline text-sm"
          >Esqueceu sua senha?</a
        >
      </div>

      <button
        type="submit"
        class="btn btn-lg text-sm w-full text-white bg-amber-500 rounded-xl hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="submitDisabled"
      >
        Login
      </button>

      <p class="text-sm text-center text-gray-500">
        Ainda não tem uma conta?
        <a href="/auth/sign-up" class="text-primary hover:underline">Cadastre-se</a>
      </p>
    </FormData>
  </div>
</template>
