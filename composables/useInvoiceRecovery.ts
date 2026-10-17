import { ref, computed, reactive, watch } from 'vue'
import type { InvoiceViewModel, AgingBucket, CreditorInfo } from '../types/recovery'
import { useToast } from './useToast'
import { useBilling } from './useBilling'
import { calculateStatutoryDebt } from '../server/utils/statutoryRates'
import { calculateSettlementOffer } from '../server/utils/settlementCalculator'
import { generateLetterNotice, ESCALATION_STAGES } from '../server/utils/letterTemplates'

const invoices = ref<InvoiceViewModel[]>([])
const selectedInvoiceId = ref<string | null>(null)
const selectedStage = ref<number>(1)
const activeBucket = ref<AgingBucket>('ALL')

const isSettlementActive = ref<boolean>(false)
const settlementDiscountPct = ref<number>(8.0)

const creditorInfo = reactive<CreditorInfo>({
  companyName: 'Independent Studio LLC',
  signatory: 'Marcus Vance, Managing Principal',
  remittanceDetails: 'Wire Transfer: Routing 021000021 / Account 9876543210 (USD / GBP / EUR IBAN upon request)',
  creditorAddress: '100 Innovation Way, Suite 500, New York, NY 10001',
  creditorEmail: 'billing@studio.example.com'
})

const currentEscalation = ref<any | null>(null)
const currentLetterMarkdown = ref<string>('')
const currentSubjectLine = ref<string>('')
const currentPlainText = ref<string>('')

const isLoadingInvoices = ref<boolean>(false)
const isGenerating = ref<boolean>(false)
const isAddModalOpen = ref<boolean>(false)

export function useInvoiceRecovery() {
  const toast = useToast()
  const billing = useBilling()

  const selectedInvoice = computed(() => {
    if (!selectedInvoiceId.value && invoices.value.length > 0) {
      return invoices.value[0]
    }
    return invoices.value.find((inv) => inv.id === selectedInvoiceId.value) || null
  })

  const filteredInvoices = computed(() => {
    if (activeBucket.value === 'ALL') {
      return invoices.value
    }
    return invoices.value.filter((inv) => inv.agingBucket === activeBucket.value)
  })

  const ledgerTotals = computed(() => {
    let principal = 0
    let interest = 0
    let fees = 0
    let totalClaim = 0

    for (const inv of invoices.value) {
      if (inv.status !== 'RESOLVED') {
        principal += inv.principalAmount
        interest += inv.accruedInterest || 0
        fees += inv.statutoryFee || 0
        totalClaim += inv.totalClaim || inv.principalAmount
      }
    }

    return {
      principal: Number(principal.toFixed(2)),
      interest: Number(interest.toFixed(2)),
      fees: Number(fees.toFixed(2)),
      totalClaim: Number(totalClaim.toFixed(2)),
      count: invoices.value.length,
      overdueCount: invoices.value.filter((i) => i.status !== 'RESOLVED').length
    }
  })

  const bucketMetrics = computed(() => {
    const buckets: Record<
      '1-14' | '15-30' | '31-60' | '60+',
      { count: number; totalPrincipal: number; totalClaim: number }
    > = {
      '1-14': { count: 0, totalPrincipal: 0, totalClaim: 0 },
      '15-30': { count: 0, totalPrincipal: 0, totalClaim: 0 },
      '31-60': { count: 0, totalPrincipal: 0, totalClaim: 0 },
      '60+': { count: 0, totalPrincipal: 0, totalClaim: 0 }
    }

    for (const inv of invoices.value) {
      if (inv.status !== 'RESOLVED') {
        const b = inv.agingBucket as '1-14' | '15-30' | '31-60' | '60+'
        if (buckets[b]) {
          buckets[b].count++
          buckets[b].totalPrincipal += inv.principalAmount
          buckets[b].totalClaim += inv.totalClaim
        }
      }
    }

    return buckets
  })

  async function fetchInvoices() {
    isLoadingInvoices.value = true
    try {
      const data = await $fetch<InvoiceViewModel[]>('/api/invoices')
      invoices.value = data || []

      if (!selectedInvoiceId.value && invoices.value.length > 0) {
        selectedInvoiceId.value = invoices.value[0].id
      }
      regenerateClientLetter()
    } catch (err: any) {
      console.error('[useInvoiceRecovery] Failed to fetch invoices:', err)
      toast.error('Ledger Error', 'Could not retrieve invoices.')
    } finally {
      isLoadingInvoices.value = false
    }
  }

  function selectInvoice(id: string) {
    selectedInvoiceId.value = id
    // Automatically suggest stage based on invoice aging
    const inv = invoices.value.find((i) => i.id === id)
    if (inv) {
      if (inv.daysOverdue >= 61) {
        selectedStage.value = billing.isPro.value ? 4 : 3
      } else if (inv.daysOverdue >= 31) {
        selectedStage.value = 3
      } else if (inv.daysOverdue >= 15) {
        selectedStage.value = 2
      } else {
        selectedStage.value = 1
      }
    }
    regenerateClientLetter()
  }

  function selectStage(stageNumber: number) {
    if (stageNumber === 4 && !billing.isPro.value) {
      billing.triggerPaywall('stage_4_locked')
      return
    }
    selectedStage.value = stageNumber
    regenerateClientLetter()
  }

  function selectBucket(bucket: AgingBucket) {
    activeBucket.value = bucket
  }

  async function loadSampleInvoices() {
    isLoadingInvoices.value = true
    try {
      await $fetch('/api/invoices/samples?seed=true')
      await fetchInvoices()
      toast.success(
        'Sample Invoices Seeded',
        'Loaded Apex Digital ($8.5k), OmniCloud (£14.2k), and Vanguard Consulting (€4.8k).'
      )
    } catch (err: any) {
      console.error('[useInvoiceRecovery] Failed to seed samples:', err)
      toast.error('Sample Error', err.message || 'Failed to seed sample invoices.')
    } finally {
      isLoadingInvoices.value = false
    }
  }

  async function addInvoice(payload: {
    invoiceNumber: string
    clientName: string
    clientEmail?: string
    clientAddress?: string
    clientCompanyNumber?: string
    principalAmount: number
    currency: string
    jurisdiction: string
    dueDate: string
    notes?: string
  }) {
    try {
      const newInv = await $fetch<InvoiceViewModel>('/api/invoices', {
        method: 'POST',
        body: payload
      })
      await fetchInvoices()
      selectedInvoiceId.value = newInv.id
      isAddModalOpen.value = false
      toast.success('Invoice Created', `Invoice ${newInv.invoiceNumber} added to recovery ledger.`)
    } catch (err: any) {
      if (!billing.handleApiError(err)) {
        toast.error('Creation Failed', err?.data?.message || err.message || 'Could not add invoice.')
      }
    }
  }

  async function markAsResolved(id: string) {
    try {
      await $fetch(`/api/invoices/${id}`, {
        method: 'PUT',
        body: { status: 'RESOLVED' }
      })
      await fetchInvoices()
      toast.success('Invoice Resolved', 'Receivable marked as settled and cleared.')
    } catch (err: any) {
      toast.error('Update Failed', err.message)
    }
  }

  async function deleteInvoice(id: string) {
    try {
      await $fetch(`/api/invoices/${id}`, { method: 'DELETE' })
      if (selectedInvoiceId.value === id) {
        selectedInvoiceId.value = null
      }
      await fetchInvoices()
      toast.info('Invoice Removed', 'Invoice removed from active ledger.')
    } catch (err: any) {
      toast.error('Deletion Failed', err.message)
    }
  }

  function regenerateClientLetter() {
    const inv = selectedInvoice.value
    if (!inv) {
      currentLetterMarkdown.value = ''
      currentSubjectLine.value = ''
      currentPlainText.value = ''
      return
    }

    const calc = calculateStatutoryDebt({
      principalAmount: inv.principalAmount,
      currency: inv.currency,
      jurisdiction: inv.jurisdiction,
      dueDate: inv.dueDate
    })

    let settlementClause: string | null = null
    if (isSettlementActive.value) {
      const offer = calculateSettlementOffer({
        principalAmount: inv.principalAmount,
        currency: inv.currency,
        discountPct: settlementDiscountPct.value,
        windowHours: 48
      })
      settlementClause = offer.clauseMarkdown
    }

    const letter = generateLetterNotice({
      stageNumber: selectedStage.value,
      invoice: inv,
      calculation: calc,
      creditor: creditorInfo,
      settlementClauseMarkdown: settlementClause
    })

    currentLetterMarkdown.value = letter.letterMarkdown
    currentSubjectLine.value = letter.subjectLine
    currentPlainText.value = letter.plainText
  }

  async function generateNoticeServer() {
    const inv = selectedInvoice.value
    if (!inv) return

    isGenerating.value = true
    try {
      const res = await $fetch<{
        escalation: any
        subjectLine: string
        letterMarkdown: string
        plainText: string
        quotaRemaining: number
      }>('/api/recovery/generate', {
        method: 'POST',
        body: {
          invoiceId: inv.id,
          stageNumber: selectedStage.value,
          includeSettlement: isSettlementActive.value,
          settlementDiscountPct: settlementDiscountPct.value,
          creditorInfo
        }
      })

      currentEscalation.value = res.escalation
      currentLetterMarkdown.value = res.letterMarkdown
      currentSubjectLine.value = res.subjectLine
      currentPlainText.value = res.plainText

      await billing.fetchTier()
      toast.success(
        'Notice Generated & Saved',
        `Recovery snapshot saved for ${inv.invoiceNumber} (Stage ${selectedStage.value}).`
      )
    } catch (err: any) {
      if (!billing.handleApiError(err)) {
        toast.error('Generation Failed', err?.data?.message || err.message)
      }
    } finally {
      isGenerating.value = false
    }
  }

  async function copyEmailToClipboard() {
    if (!currentPlainText.value && !currentLetterMarkdown.value) {
      regenerateClientLetter()
    }

    const textToCopy = `Subject: ${currentSubjectLine.value}\n\n${currentPlainText.value || currentLetterMarkdown.value}`

    try {
      await navigator.clipboard.writeText(textToCopy)
      toast.success(
        'Copied to Clipboard',
        'Subject line and formatted notice copied for direct email transmission.'
      )
    } catch (err) {
      toast.error('Copy Failed', 'Please grant clipboard permissions or copy manually.')
    }
  }

  function printPdfLetterhead() {
    if (!billing.isPro.value) {
      billing.triggerPaywall('pdf_export_locked')
      return
    }

    // Trigger browser print dialog formatted by @media print
    window.print()
  }

  // Watch for local configuration changes to recompute preview
  watch(
    [isSettlementActive, settlementDiscountPct, () => creditorInfo.companyName, () => creditorInfo.signatory],
    () => {
      regenerateClientLetter()
    }
  )

  return {
    invoices,
    selectedInvoiceId,
    selectedInvoice,
    selectedStage,
    activeBucket,
    filteredInvoices,
    ledgerTotals,
    bucketMetrics,
    isSettlementActive,
    settlementDiscountPct,
    creditorInfo,
    currentEscalation,
    currentLetterMarkdown,
    currentSubjectLine,
    currentPlainText,
    isLoadingInvoices,
    isGenerating,
    isAddModalOpen,
    fetchInvoices,
    selectInvoice,
    selectStage,
    selectBucket,
    loadSampleInvoices,
    addInvoice,
    markAsResolved,
    deleteInvoice,
    regenerateClientLetter,
    generateNoticeServer,
    copyEmailToClipboard,
    printPdfLetterhead
  }
}
