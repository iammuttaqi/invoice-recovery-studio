<script setup lang="ts">
import { computed } from 'vue'
import { Loader2 } from 'lucide-vue-next'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'navy'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  type: 'button'
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const baseClasses =
  'inline-flex items-center justify-center font-sans font-medium rounded-md transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-offset-1 select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none'

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
    case 'navy':
      return 'bg-navy-brand text-white hover:bg-blue-950 active:bg-blue-900 focus:ring-blue-600 shadow-sm'
    case 'secondary':
      return 'bg-white text-text-primary border border-border hover:bg-slate-50 active:bg-slate-100 focus:ring-slate-400 shadow-xs'
    case 'outline':
      return 'bg-transparent text-text-primary border border-border hover:bg-slate-100 active:bg-slate-200 focus:ring-slate-400'
    case 'ghost':
      return 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-slate-100 active:bg-slate-200 focus:ring-slate-400'
    case 'danger':
      return 'bg-crimson-due text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500 shadow-sm'
    default:
      return 'bg-navy-brand text-white hover:bg-blue-950 focus:ring-blue-600'
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'text-xs px-2.5 py-1.5 gap-1.5'
    case 'lg':
      return 'text-base px-5 py-2.5 gap-2.5'
    case 'md':
    default:
      return 'text-sm px-3.5 py-2 gap-2'
  }
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[baseClasses, variantClasses, sizeClasses]"
    @click="(ev) => emit('click', ev)"
  >
    <Loader2 v-if="loading" class="w-4 h-4 animate-spin shrink-0" />
    <slot />
  </button>
</template>
