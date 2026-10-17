<script setup lang="ts">
import { computed } from 'vue'
import type { AgingBucket } from '../../types/recovery'
import { Clock, AlertTriangle, Scale, ShieldAlert } from 'lucide-vue-next'

interface Props {
  bucketKey: '1-14' | '15-30' | '31-60' | '60+'
  title: string
  subtitle: string
  count: number
  totalClaim: number
  isActive: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'select', key: AgingBucket): void
}>()

const iconComponent = computed(() => {
  switch (props.bucketKey) {
    case '1-14':
      return Clock
    case '15-30':
      return Clock
    case '31-60':
      return AlertTriangle
    case '60+':
    default:
      return ShieldAlert
  }
})

const badgeColorClasses = computed(() => {
  switch (props.bucketKey) {
    case '1-14':
      return 'bg-slate-100 text-slate-700 border-slate-200'
    case '15-30':
      return 'bg-blue-50 text-blue-800 border-blue-200'
    case '31-60':
      return 'bg-amber-50 text-amber-800 border-amber-200'
    case '60+':
    default:
      return 'bg-red-50 text-red-700 border-red-200'
  }
})
</script>

<template>
  <button
    type="button"
    :class="[
      'text-left p-4 rounded-xl border transition-all duration-150 ease-out flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-blue-600',
      isActive
        ? 'border-navy-brand bg-blue-50/40 shadow-sm ring-1 ring-navy-brand'
        : 'border-border bg-surface hover:border-slate-300 hover:bg-slate-50/50 shadow-xs'
    ]"
    @click="emit('select', bucketKey)"
  >
    <div class="flex items-start justify-between gap-2 mb-3">
      <div>
        <span class="text-xs font-bold text-text-primary uppercase tracking-wider block">
          {{ title }}
        </span>
        <span class="text-[11px] text-text-muted mt-0.5 block leading-tight">
          {{ subtitle }}
        </span>
      </div>

      <div :class="['p-1.5 rounded-md border shrink-0', badgeColorClasses]">
        <component :is="iconComponent" class="w-3.5 h-3.5" />
      </div>
    </div>

    <div class="flex items-baseline justify-between mt-2 pt-2 border-t border-border/60">
      <div class="text-xs font-medium text-text-secondary">
        <span class="font-mono font-bold text-text-primary tabular-nums">{{ count }}</span>
        {{ count === 1 ? 'invoice' : 'invoices' }}
      </div>

      <div class="text-sm font-bold font-mono text-text-primary tabular-nums tracking-tight">
        ${{ totalClaim.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
      </div>
    </div>
  </button>
</template>
