<script setup lang="ts">
import { useInvoiceRecovery } from '../../composables/useInvoiceRecovery'
import { useBilling } from '../../composables/useBilling'
import BaseButton from '../ui/BaseButton.vue'
import { Copy, Printer, Lock, Sparkles, Send } from 'lucide-vue-next'

const {
  copyEmailToClipboard,
  printPdfLetterhead,
  generateNoticeServer,
  isGenerating
} = useInvoiceRecovery()

const { isPro, quotaRemaining, billingState } = useBilling()
</script>

<template>
  <div class="bg-surface border border-border rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <!-- Quota Pill -->
    <div class="flex items-center gap-2 text-xs">
      <div
        :class="[
          'px-2.5 py-1 rounded-full font-mono text-xs flex items-center gap-1.5 font-semibold',
          isPro
            ? 'bg-blue-900 text-white'
            : 'bg-slate-100 text-slate-800 border border-slate-300'
        ]"
      >
        <Sparkles v-if="isPro" class="w-3.5 h-3.5" />
        <span v-if="isPro">Pro Tier: Unlimited Generations</span>
        <span v-else>Free Quota: {{ quotaRemaining }} / {{ billingState.quotaLimit }} remaining</span>
      </div>
    </div>

    <!-- Export Action Buttons -->
    <div class="flex items-center gap-2 self-stretch sm:self-auto flex-wrap">
      <!-- Save Snapshot to DB -->
      <BaseButton
        variant="secondary"
        size="sm"
        :loading="isGenerating"
        @click="generateNoticeServer"
      >
        <Send class="w-3.5 h-3.5 mr-1" />
        Record Escalation Snapshot
      </BaseButton>

      <!-- Copy Email -->
      <BaseButton
        variant="secondary"
        size="sm"
        @click="copyEmailToClipboard"
      >
        <Copy class="w-3.5 h-3.5 mr-1" />
        Copy Email Notice
      </BaseButton>

      <!-- Print / PDF Letterhead -->
      <BaseButton
        variant="primary"
        size="sm"
        @click="printPdfLetterhead"
      >
        <Printer class="w-3.5 h-3.5 mr-1" />
        <span>Print Formal PDF Letterhead</span>
        <Lock v-if="!isPro" class="w-3 h-3 ml-1 text-amber-300" />
      </BaseButton>
    </div>
  </div>
</template>
