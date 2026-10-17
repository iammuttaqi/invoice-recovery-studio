<script setup lang="ts">
import { Scale, ShieldCheck } from 'lucide-vue-next'
</script>

<template>
  <footer class="border-t border-border bg-surface text-text-secondary text-xs mt-16 py-8 no-print">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <div class="p-1.5 bg-blue-50 text-navy-brand rounded-md">
            <Scale class="w-4 h-4" />
          </div>
          <span class="font-bold text-text-primary">InvoiceRecovery Studio</span>
          <span class="text-slate-300">•</span>
          <span class="text-text-muted">Standards 4.0 Autonomous Financial Infrastructure</span>
        </div>

        <div class="flex items-center gap-4 text-[11px] text-text-muted">
          <span>UK 1998 Act s.6 & s.5A</span>
          <span>•</span>
          <span>EU Directive 2011/7/EU Art.6</span>
          <span>•</span>
          <span>US Commercial UCC Terms</span>
        </div>
      </div>

      <p class="text-[11px] text-text-muted leading-relaxed border-t border-border/60 pt-4">
        Disclaimer: InvoiceRecovery Studio provides automated financial debt calculation, commercial escalation letter generation, and accounts receivable tracking tools. This software does not provide formal legal advice or substitute for licensed legal representation. Users should verify local pre-action protocols and territorial court requirements prior to formal legal filing.
      </p>

      <div class="flex items-center justify-between text-[11px] text-text-muted pt-2">
        <span>© 2026 Autonomous Software Studio. All rights reserved.</span>
        <span class="font-mono">Zero Emojis • Strict Tabular Typography</span>
      </div>
    </div>
  </footer>
</template>
