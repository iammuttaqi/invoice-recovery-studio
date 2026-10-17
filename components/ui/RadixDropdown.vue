<script setup lang="ts">
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from 'radix-vue'

export interface DropdownAction {
  id: string
  label: string
  icon?: any
  danger?: boolean
  disabled?: boolean
}

interface Props {
  actions: DropdownAction[]
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'select', actionId: string): void
}>()
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger as-child>
      <slot />
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        class="z-50 min-w-[160px] bg-surface rounded-lg p-1 shadow-lg border border-border text-xs focus:outline-none animate-in fade-in zoom-in-95 duration-100"
        :side-offset="4"
        align="end"
      >
        <DropdownMenuItem
          v-for="action in actions"
          :key="action.id"
          :disabled="action.disabled"
          :class="[
            'flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer select-none outline-none transition-colors duration-100',
            action.danger
              ? 'text-crimson-due hover:bg-red-50 focus:bg-red-50'
              : 'text-text-primary hover:bg-slate-100 focus:bg-slate-100',
            action.disabled ? 'opacity-40 pointer-events-none' : ''
          ]"
          @select="emit('select', action.id)"
        >
          <component :is="action.icon" v-if="action.icon" class="w-3.5 h-3.5 shrink-0" />
          <span>{{ action.label }}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
