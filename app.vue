<script setup lang="ts">
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import SandboxStatusBar from './components/layout/SandboxStatusBar.vue'
import ToastContainer from './components/ui/ToastContainer.vue'
</script>

<template>
  <div class="min-h-screen bg-canvas text-text-primary flex flex-col font-sans selection:bg-blue-100 selection:text-navy-brand">
    <AppHeader />
    <SandboxStatusBar />

    <div class="grow">
      <NuxtPage />
    </div>

    <AppFooter />
    <ToastContainer />
  </div>
</template>
