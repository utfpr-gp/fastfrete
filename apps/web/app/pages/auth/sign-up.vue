<script setup lang="ts">
import CustomInput from '~/components/forms/CustomInput.vue'

definePageMeta({
  layout: 'auth'
})

const nameInput = ref('')
const emailInput = ref('')
const passwordInput = ref('')
const confirmPasswordInput = ref('')
</script>

<template>
  <div>
    <h1 class="text-3xl text-center font-bold mb-2">Criar conta</h1>

    <p class="text-center text-gray-500 mb-8">
      Preencha os dados para se cadastrar e começar a usar a plataforma.
    </p>

    <form class="flex flex-col gap-4">
      <CustomInputAccept
        id="name"
        v-model="nameInput"
        label="Name"
        type="text"
        class="input input-lg w-full rounded-xl placeholder:text-sm text-sm"
      />

      <CustomInput
        id="email"
        v-model="emailInput"
        label="Email"
        type="email"
        class="input input-lg w-full rounded-xl placeholder:text-sm text-sm"
      />

      <CustomInput
        id="password"
        v-model="passwordInput"
        label="Password"
        type="password"
        class="input input-lg w-full rounded-xl placeholder:text-sm text-sm"
      />

      <CustomInput
        id="confirm-password"
        v-model="confirmPasswordInput"
        label="Confirmar senha"
        type="password"
        class="input input-lg w-full rounded-xl placeholder:text-sm text-sm"
      />

      <button
        type="submit"
        class="btn btn-lg text-sm w-full text-white bg-amber-500 rounded-xl hover:bg-amber-600"
      >
        Criar
      </button>

      <a href="/auth/login" class="btn btn-ghost btn-lg text-sm w-full text-gray-800 rounded-xl"
        >Voltar para o login</a
      >
    </form>
  </div>
</template>
