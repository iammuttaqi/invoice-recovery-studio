<script setup lang="ts">
import { useToast } from '../../composables/useToast'
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-vue-next'

const { toasts, removeToast } = useToast()
</script>

<template>
  <div class="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="pointer-events-auto flex items-start justify-between gap-3 p-3.5 bg-surface border border-border shadow-lg rounded-lg animate-in slide-in-from-bottom-2 duration-150 text-text-primary"
    >
      <div class="flex items-start gap-2.5">
        <CheckCircle2 v-if="toast.type === 'success'" class="w-4 h-4 text-emerald-rec mt-0.5 shrink-0" />
        <AlertCircle v-else-if="toast.type === 'error'" class="w-4 h-4 text-crimson-due mt-0.5 shrink-0" />
        <AlertTriangle v-else-if="toast.type === 'warning'" class="w-4 h-4 text-amber-warn mt-0.5 shrink-0" />
        <Info v-else class="w-4 h-4 text-blue-admin mt-0.5 shrink-0" />

        <div class="flex flex-col">
          <span class="text-xs font-semibold leading-tight">{{ toast.title }}</span>
          <span v-if="toast.description" class="text-xs text-text-secondary mt-0.5 leading-normal">
            {{ toast.description }}
          </span>
        </div>
      </div>

      <button
        class="text-text-muted hover:text-text-primary p-0.5 rounded hover:bg-slate-100 transition-colors"
        aria-label="Dismiss toast"
        @click="removeToast(toast.id)"
      >
        <X class="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
</template>
