<script setup lang="ts">
import { computed } from 'vue'
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  Scale,
  ShieldAlert,
  Sparkles,
  FileText
} from 'lucide-vue-next'

interface Props {
  status: string
  label?: string
  size?: 'sm' | 'md'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const normalized = computed(() => (props.status || '').toUpperCase())

const config = computed(() => {
  switch (normalized.value) {
    case 'RESOLVED':
    case 'PAID':
      return {
        classes: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        icon: CheckCircle2,
        defaultLabel: 'Resolved'
      }
    case 'OVERDUE':
    case '60+':
    case 'CRITICAL':
      return {
        classes: 'bg-red-50 text-red-700 border-red-200',
        icon: AlertTriangle,
        defaultLabel: 'Critical Overdue'
      }
    case '31-60':
    case 'STATUTORY':
      return {
        classes: 'bg-amber-50 text-amber-800 border-amber-200',
        icon: Scale,
        defaultLabel: 'Statutory Notice'
      }
    case '15-30':
    case 'ADMIN':
      return {
        classes: 'bg-blue-50 text-blue-800 border-blue-200',
        icon: Clock,
        defaultLabel: 'Administrative Delay'
      }
    case '1-14':
    case 'COURTESY':
      return {
        classes: 'bg-slate-100 text-slate-700 border-slate-200',
        icon: Clock,
        defaultLabel: 'Courtesy Grace'
      }
    case 'LEGAL':
    case 'LBA':
      return {
        classes: 'bg-indigo-50 text-indigo-900 border-indigo-200',
        icon: ShieldAlert,
        defaultLabel: 'Legal Demand (LBA)'
      }
    case 'PRO':
    case 'LIFETIME':
      return {
        classes: 'bg-navy-brand text-white border-blue-900',
        icon: Sparkles,
        defaultLabel: normalized.value === 'LIFETIME' ? 'Founder Lifetime' : 'Pro Active'
      }
    case 'FREE':
      return {
        classes: 'bg-slate-100 text-slate-700 border-slate-300',
        icon: FileText,
        defaultLabel: 'Free Starter'
      }
    case 'PENDING':
    default:
      return {
        classes: 'bg-slate-100 text-slate-700 border-slate-200',
        icon: Clock,
        defaultLabel: props.status
      }
  }
})
</script>

<template>
  <span
    :class="[
      'inline-flex items-center font-sans font-medium border rounded-md select-none',
      config.classes,
      size === 'sm' ? 'px-2 py-0.5 text-xs gap-1' : 'px-2.5 py-1 text-xs gap-1.5'
    ]"
  >
    <component :is="config.icon" class="w-3.5 h-3.5 shrink-0" />
    <span>{{ label || config.defaultLabel }}</span>
  </span>
</template>
