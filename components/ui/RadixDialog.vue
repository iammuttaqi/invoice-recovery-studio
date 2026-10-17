<script setup lang="ts">
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose
} from 'radix-vue'
import { X } from 'lucide-vue-next'

interface Props {
  open: boolean
  title?: string
  description?: string
  maxWidth?: string
}

const props = withDefaults(defineProps<Props>(), {
  maxWidth: 'max-w-lg'
})

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()
</script>

<template>
  <DialogRoot :open="open" @update:open="(val) => emit('update:open', val)">
    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-150 animate-in fade-in"
      />
      <DialogContent
        :class="[
          'fixed left-[50%] top-[50%] z-50 w-full translate-x-[-50%] translate-y-[-50%] bg-surface border border-border shadow-2xl rounded-xl p-6 duration-150 focus:outline-none max-h-[90vh] overflow-y-auto',
          maxWidth
        ]"
      >
        <div class="flex items-start justify-between gap-4 mb-4">
          <div>
            <DialogTitle v-if="title" class="text-lg font-semibold text-text-primary tracking-tight">
              {{ title }}
            </DialogTitle>
            <DialogDescription v-if="description" class="text-sm text-text-secondary mt-1">
              {{ description }}
            </DialogDescription>
          </div>

          <DialogClose
            class="text-text-muted hover:text-text-primary p-1 rounded-md hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
            aria-label="Close"
          >
            <X class="w-4 h-4" />
          </DialogClose>
        </div>

        <slot />
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
