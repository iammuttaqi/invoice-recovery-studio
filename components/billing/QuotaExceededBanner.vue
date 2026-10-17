<script setup lang="ts">
import { useBilling } from '../../composables/useBilling'
import { AlertTriangle, ArrowRight, Sparkles } from 'lucide-vue-next'
import BaseButton from '../ui/BaseButton.vue'

const { hasReachedQuota, triggerPaywall, toggleSandboxPro } = useBilling()
</script>

<template>
  <div
    v-if="hasReachedQuota"
    class="bg-amber-50 border border-amber-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
  >
    <div class="flex items-start gap-3">
      <AlertTriangle class="w-5 h-5 text-amber-warn mt-0.5 shrink-0" />
      <div>
        <h4 class="text-xs font-semibold text-amber-900 tracking-tight">
          Monthly Free Letter Quota Reached (3 / 3 Letters Used)
        </h4>
        <p class="text-xs text-amber-800 mt-0.5 leading-relaxed">
          You have utilized your 3 free recovery letters for this billing window. Upgrade to Pro for unlimited escalations, pre-action legal notices, and formal PDF letterhead export.
        </p>
      </div>
    </div>

    <div class="flex items-center gap-2 self-end sm:self-auto shrink-0">
      <BaseButton
        variant="outline"
        size="sm"
        class="border-amber-300 text-amber-900 hover:bg-amber-100"
        @click="toggleSandboxPro"
      >
        <Sparkles class="w-3.5 h-3.5 mr-1" />
        Simulate Pro (Demo)
      </BaseButton>

      <BaseButton
        variant="primary"
        size="sm"
        @click="() => triggerPaywall('quota_exceeded')"
      >
        <span>Upgrade to Pro</span>
        <ArrowRight class="w-3.5 h-3.5 ml-1" />
      </BaseButton>
    </div>
  </div>
</template>
