<script setup lang="ts">
import CustomInput from '~/components/forms/CustomInput.vue'

definePageMeta({
  layout: 'auth'
})
</script>

<template>
  <div>
    <h1 class="text-2xl text-center font-bold mb-2">Recuperar acesso</h1>

    <p class="text-center text-gray-500 mb-8">
      Digite seu email para receber um link de redefinição de senha.
    </p>

    <form class="flex flex-col gap-4">
      <CustomInput
        id="email"
        label="Email"
        type="email"
        name="email"
        class="input input-lg w-full rounded-xl placeholder:text-sm text-sm"
      />

      <button
        type="submit"
        class="btn btn-lg text-sm w-full text-white bg-amber-500 rounded-xl hover:bg-amber-600"
      >
        Enviar link
      </button>

      <a href="/auth/login" class="btn btn-ghost btn-lg text-sm w-full text-gray-800 rounded-xl"
        >Voltar para o login</a
      >
    </form>
  </div>
</template>
