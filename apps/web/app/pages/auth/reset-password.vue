<script setup lang="ts">
import CustomInput from '~/components/forms/CustomInput.vue'

definePageMeta({
  layout: 'auth'
})

const passwordInput = ref('')
const confirmPasswordInput = ref('')
</script>

<template>
  <div>
    <h1 class="text-3xl text-center font-bold mb-2">Redefinir senha</h1>

    <p class="text-center text-gray-500 mb-8">Defina uma nova senha para recuperar seu acesso.</p>

    <form class="flex flex-col gap-4">
      <CustomInput
        id="teste"
        v-model="passwordInput"
        label="Senha"
        placeholder="Digite sua senha"
        type="password"
        name="password"
        class="input input-lg w-full rounded-xl placeholder:text-sm text-sm"
      />

      <CustomInput
        id="password"
        v-model="confirmPasswordInput"
        label="Confirmar senha"
        placeholder="Confirme sua senha"
        type="password"
        name="confirmPassword"
        class="input input-lg w-full rounded-xl placeholder:text-sm text-sm"
      />

      <button
        type="submit"
        class="btn btn-lg text-sm w-full text-white bg-amber-500 rounded-xl hover:bg-amber-600"
      >
        Redefinir
      </button>
    </form>
  </div>
</template>
