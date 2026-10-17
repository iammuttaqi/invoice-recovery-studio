<script setup lang="ts">
import { onMounted } from 'vue'
import { useInvoiceRecovery } from '../composables/useInvoiceRecovery'
import { useBilling } from '../composables/useBilling'
import LedgerSummaryCards from '../components/matrix/LedgerSummaryCards.vue'
import DelinquencyMatrix from '../components/matrix/DelinquencyMatrix.vue'
import SampleLoaderBar from '../components/ledger/SampleLoaderBar.vue'
import InvoiceLedgerTable from '../components/ledger/InvoiceLedgerTable.vue'
import AddInvoiceModal from '../components/ledger/AddInvoiceModal.vue'
import RecoveryWorkbench from '../components/studio/RecoveryWorkbench.vue'
import QuotaExceededBanner from '../components/billing/QuotaExceededBanner.vue'
import PricingTable from '../components/billing/PricingTable.vue'
import UpgradeModal from '../components/billing/UpgradeModal.vue'
import PrintableLetterhead from '../components/export/PrintableLetterhead.vue'

const { fetchInvoices } = useInvoiceRecovery()
const { fetchTier } = useBilling()

onMounted(async () => {
  await fetchTier()
  await fetchInvoices()
})
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 no-print">
    <!-- Top Quota Warning if limit reached -->
    <QuotaExceededBanner />

    <!-- Section 1: Delinquency Aging Matrix & Claim Summary -->
    <section class="space-y-4">
      <LedgerSummaryCards />
      <DelinquencyMatrix />
    </section>

    <!-- Section 2: Receivables Ledger Management -->
    <section class="space-y-4">
      <SampleLoaderBar />
      <InvoiceLedgerTable />
      <AddInvoiceModal />
    </section>

    <!-- Section 3: Recovery Escalation Studio Workbench -->
    <section class="space-y-4 pt-4 border-t border-border">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-base font-bold text-text-primary tracking-tight">
            Recovery Escalation Studio
          </h2>
          <p class="text-xs text-text-secondary mt-0.5">
            4-stage progressive notices, statutory interest formulation, conditional fast settlement waivers, and legal demands.
          </p>
        </div>
      </div>

      <RecoveryWorkbench />
    </section>

    <!-- Section 4: Monetization Pricing Table -->
    <section class="pt-8 border-t border-border">
      <PricingTable />
    </section>

    <!-- Modals -->
    <UpgradeModal />
  </main>

  <!-- Printable Letterhead (Rendered only on print / PDF save) -->
  <PrintableLetterhead />
</template>
