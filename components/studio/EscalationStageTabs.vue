<script setup lang="ts">
import { computed } from 'vue'
import { useInvoiceRecovery } from '../../composables/useInvoiceRecovery'
import { useBilling } from '../../composables/useBilling'
import { ESCALATION_STAGES } from '../../server/utils/letterTemplates'
import RadixTabs from '../ui/RadixTabs.vue'
import { Clock, AlertTriangle, Scale, ShieldAlert } from 'lucide-vue-next'

const { selectedStage, selectStage } = useInvoiceRecovery()
const { isPro, triggerPaywall } = useBilling()

const tabsData = computed(() => {
  return ESCALATION_STAGES.map((s) => {
    let icon = Clock
    if (s.stageNumber === 2) icon = Clock
    if (s.stageNumber === 3) icon = Scale
    if (s.stageNumber === 4) icon = ShieldAlert

    return {
      value: s.stageNumber,
      label: `Stage ${s.stageNumber}: ${s.stageName.split('(')[0].trim()}`,
      badge: `${s.minDays}${s.maxDays ? `–${s.maxDays}d` : '+d'}`,
      icon,
      isLocked: s.isLockedForFree && !isPro.value
    }
  })
})

function handleLockedClick() {
  triggerPaywall('stage_4_locked')
}
</script>

<template>
  <div class="w-full">
    <RadixTabs
      :model-value="selectedStage"
      :tabs="tabsData"
      @update:model-value="(val) => selectStage(Number(val))"
      @click-locked="handleLockedClick"
    />
  </div>
</template>
