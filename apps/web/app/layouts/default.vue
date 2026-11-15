<script setup lang="ts">
import Navbar from '~/components/layout/Navbar.vue'
</script>

<template>
  <div>
    <Navbar></Navbar>
    <div class="bg-[#FFF9F5] min-h-lvh h-max p-8 flex justify-center">
      <div class="max-w-350 w-full">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
