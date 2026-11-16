<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center gap-2">
          <span class="text-2xl">🚚</span>
          <span class="text-xl font-bold text-amber-500">FastFrete</span>
        </div>

        <!-- Right side -->
        <div class="flex items-center gap-4">
          <button class="btn btn-outline btn-sm">Meus Fretes</button>

          <button class="btn btn-ghost btn-circle btn-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>

          <div class="avatar placeholder">
            <div class="bg-amber-500 text-white rounded-full w-8">
              <span class="text-xs">F</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
