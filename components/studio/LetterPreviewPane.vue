<script setup lang="ts">
import { ref } from 'vue'
import { useInvoiceRecovery } from '../../composables/useInvoiceRecovery'
import { useToast } from '../../composables/useToast'
import BaseButton from '../ui/BaseButton.vue'
import { Copy, Check, Settings2, FileText, ChevronDown, ChevronUp } from 'lucide-vue-next'

const {
  currentSubjectLine,
  currentLetterMarkdown,
  currentPlainText,
  creditorInfo,
  selectedInvoice
} = useInvoiceRecovery()

const toast = useToast()
const isEditingCreditor = ref(false)
const copiedSubject = ref(false)

async function copySubject() {
  try {
    await navigator.clipboard.writeText(currentSubjectLine.value)
    copiedSubject.value = true
    toast.success('Subject Copied', 'Email subject line copied to clipboard.')
    setTimeout(() => {
      copiedSubject.value = false
    }, 2000)
  } catch (e) {
    toast.error('Copy Failed', 'Could not copy subject line.')
  }
}
</script>

<template>
  <div class="bg-surface border border-border rounded-xl shadow-xs overflow-hidden flex flex-col">
    <!-- Header Toolbar -->
    <div class="bg-inset border-b border-border p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <FileText class="w-4 h-4 text-navy-brand" />
        <h4 class="text-xs font-bold text-text-primary uppercase tracking-wider">
          Notice Preview & Drafting Canvas
        </h4>
      </div>

      <button
        type="button"
        class="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary self-start sm:self-auto font-medium"
        @click="isEditingCreditor = !isEditingCreditor"
      >
        <Settings2 class="w-3.5 h-3.5" />
        <span>Creditor & Wire Remittance Config</span>
        <component :is="isEditingCreditor ? ChevronUp : ChevronDown" class="w-3.5 h-3.5" />
      </button>
    </div>

    <!-- Creditor Config Drawer -->
    <div
      v-if="isEditingCreditor"
      class="p-4 bg-slate-50 border-b border-border grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs animate-in slide-in-from-top-1"
    >
      <div>
        <label class="block font-semibold text-text-primary mb-1">Creditor Legal Name</label>
        <input
          v-model="creditorInfo.companyName"
          type="text"
          class="w-full px-2.5 py-1.5 border border-border rounded bg-white text-text-primary text-xs focus:ring-1 focus:ring-blue-600 outline-none"
        />
      </div>

      <div>
        <label class="block font-semibold text-text-primary mb-1">Authorized Signatory</label>
        <input
          v-model="creditorInfo.signatory"
          type="text"
          class="w-full px-2.5 py-1.5 border border-border rounded bg-white text-text-primary text-xs focus:ring-1 focus:ring-blue-600 outline-none"
        />
      </div>

      <div>
        <label class="block font-semibold text-text-primary mb-1">Direct Inquiries Email</label>
        <input
          v-model="creditorInfo.creditorEmail"
          type="email"
          class="w-full px-2.5 py-1.5 border border-border rounded bg-white text-text-primary text-xs focus:ring-1 focus:ring-blue-600 outline-none"
        />
      </div>

      <div class="sm:col-span-3">
        <label class="block font-semibold text-text-primary mb-1">Bank Wire & Remittance Details</label>
        <input
          v-model="creditorInfo.remittanceDetails"
          type="text"
          class="w-full px-2.5 py-1.5 border border-border rounded bg-white text-text-primary text-xs focus:ring-1 focus:ring-blue-600 outline-none font-mono"
        />
      </div>
    </div>

    <!-- Subject Line Bar -->
    <div class="p-3 bg-slate-50/50 border-b border-border/70 flex items-center justify-between gap-3 text-xs">
      <div class="flex items-center gap-2 overflow-hidden">
        <span class="font-bold text-text-secondary uppercase text-[10px] shrink-0 tracking-wider">
          Subject:
        </span>
        <span class="font-mono text-text-primary truncate select-all">
          {{ currentSubjectLine }}
        </span>
      </div>

      <BaseButton
        variant="ghost"
        size="sm"
        class="shrink-0 h-7 px-2"
        @click="copySubject"
      >
        <component :is="copiedSubject ? Check : Copy" class="w-3.5 h-3.5 mr-1" />
        {{ copiedSubject ? 'Copied' : 'Copy Subject' }}
      </BaseButton>
    </div>

    <!-- Letter Body (Formatted Institutional Document) -->
    <div class="p-6 overflow-y-auto max-h-[500px] bg-white font-sans text-xs text-text-primary leading-relaxed whitespace-pre-wrap select-text">
      <div
        v-if="currentLetterMarkdown"
        class="prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-text-primary prose-table:text-xs prose-th:bg-slate-100 prose-th:p-2 prose-td:p-2 prose-td:border-b"
      >
        {{ currentLetterMarkdown }}
      </div>
      <div v-else class="text-center py-12 text-text-muted">
        Select an invoice from the ledger to generate an escalation notice.
      </div>
    </div>
  </div>
</template>
