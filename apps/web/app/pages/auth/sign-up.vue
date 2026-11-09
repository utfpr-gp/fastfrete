<script setup lang="ts">
import CustomInput from '~/components/forms/CustomInput.vue'
import InputRadio from '~/components/forms/InputRadio.vue'
import FormData from '~/components/forms/FormData.vue'
import SubmitButton from '~/components/forms/SubmitButton.vue'
import { createAuthService } from '~~/domains/auth/composition'
import { vMaska } from 'maska/vue'
import CustomSelect from '~/components/forms/CustomSelect.vue'
import type { SignupRequestDTO } from '~~/domains/auth/dtos/signup-request.dto'

definePageMeta({
  layout: 'auth'
})

interface formType extends SignupRequestDTO {
  confirmPassword: string
}

const authService = createAuthService()
const toast = useToast()
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const submitDisabled = ref(false)
const requestIsPending = ref(false)

function updateIsValid(isValid: boolean) {
  submitDisabled.value = !isValid
}

function formatPhoneNumber(phoneNumber: string) {
  return '+55' + phoneNumber.replaceAll('-', '').replaceAll(' ', '').trim()
}

async function handleFormSubmit(form: formType) {
  const { confirmPassword, ...userForm } = form
  userForm.phoneNumber = formatPhoneNumber(userForm.phoneNumber)
  requestIsPending.value = true
  const result = await authService.signup(userForm)

  if (result.success) {
    toast.success({ title: 'Conta criada com sucesso!' })
  } else {
    toast.error({ title: 'Erro ao criar conta!' })
  }
  requestIsPending.value = false
}
</script>

<template>
  <div>
    <h1 class="text-3xl text-center font-bold mb-2">Criar conta</h1>

    <p class="text-center text-gray-500 mb-8">
      Preencha os dados para se cadastrar e começar a usar a plataforma.
    </p>

    <FormData
      class="flex flex-col gap-2"
      @submit="handleFormSubmit($event.controlledValues)"
      @is-valid="updateIsValid"
    >
      <CustomInput
        id="name"
        label="Nome"
        type="text"
        name="name"
        rules="required"
        required
        placeholder="Digite o seu nome"
        class="input input-lg bg-white w-full rounded-xl placeholder:text-sm text-sm focus:outline-0"
      >
        <template #icon-start>
          <Icon name="bi:person" class="absolute left-3 top-6 -translate-y-1/2 z-1 text-gray-500" />
        </template>
      </CustomInput>

      <CustomInput
        id="email"
        label="Email"
        type="email"
        name="email"
        required
        rules="required|email"
        placeholder="Digite seu email"
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
        id="phone"
        v-maska="'## #####-####'"
        label="Telefone"
        type="tel"
        name="phoneNumber"
        required
        rules="required"
        placeholder="Digite seu número de telefone"
        class="input input-lg bg-white w-full rounded-xl placeholder:text-sm text-sm focus:outline-0"
      >
        <template #icon-start>
          <Icon name="uil:phone" class="absolute left-3 top-6 -translate-y-1/2 z-1 text-gray-500" />
        </template>
      </CustomInput>

      <CustomSelect
        id="cityId"
        label="Cidade"
        name="cityId"
        required
        rules="required"
        placeholder="Selecione sua cidade"
        :options="[
          { label: 'Guarapuava', value: '8e56ef10-3815-491d-b876-511f5e3b7de4', selected: true }
        ]"
      ></CustomSelect>

      <CustomInput
        id="password"
        label="Senha"
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
        label="Confirmar senha"
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

      <InputRadio
        id="roleType"
        label="Tipo de usuário"
        name="roleType"
        rules="required"
        class="radio radio-sm"
        required
        :options="[
          { label: 'Cliente', value: 'CUSTOMER', default: true },
          { label: 'Fretista', value: 'CARRIER' }
        ]"
      ></InputRadio>

      <SubmitButton label="Criar" :loading="requestIsPending" :disabled="submitDisabled" />

      <a href="/auth/login" class="btn btn-ghost btn-lg text-sm w-full text-gray-800 rounded-xl"
        >Voltar para o login</a
      >
    </FormData>
  </div>
</template>
