<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import SandboxStatusBar from './components/layout/SandboxStatusBar.vue'
import ToastContainer from './components/ui/ToastContainer.vue'
import { useInvoiceRecovery } from './composables/useInvoiceRecovery'

const { isAddModalOpen, selectStage } = useInvoiceRecovery()

function handleKeyDown(e: KeyboardEvent) {
  const target = e.target as HTMLElement | null
  const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable)

  if (e.key === 'Escape') {
    isAddModalOpen.value = false
    return
  }

  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    isAddModalOpen.value = !isAddModalOpen.value
    return
  }

  if (isInput) return

  if (['1', '2', '3', '4'].includes(e.key)) {
    const stageNum = parseInt(e.key, 10)
    selectStage(stageNum)
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
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
