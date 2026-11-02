<script setup lang="ts"></script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-[#FFF9F5]">
    <div class="flex flex-col items-center justify-center gap-4">
      <img src="../assets/images/logo-fastfrete.png" alt="logo" class="w-96 h-auto" />

      <div class="md:bg-white p-10 md:shadow-md rounded-xl max-w-md">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
