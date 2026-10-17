<script setup lang="ts">
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from 'radix-vue'
import { Lock } from 'lucide-vue-next'

export interface TabItem {
  value: string | number
  label: string
  icon?: any
  badge?: string
  isLocked?: boolean
}

interface Props {
  modelValue: string | number
  tabs: TabItem[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'clickLocked', tab: TabItem): void
}>()

function onTabClick(tab: TabItem) {
  if (tab.isLocked) {
    emit('clickLocked', tab)
    return
  }
  emit('update:modelValue', tab.value)
}
</script>

<template>
  <TabsRoot
    :model-value="String(modelValue)"
    class="flex flex-col w-full"
    @update:model-value="(val) => emit('update:modelValue', val)"
  >
    <TabsList class="flex items-center gap-1.5 p-1 bg-inset border border-border rounded-lg overflow-x-auto">
      <TabsTrigger
        v-for="tab in tabs"
        :key="String(tab.value)"
        :value="String(tab.value)"
        :class="[
          'inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-all duration-150 select-none focus:outline-none focus:ring-2 focus:ring-blue-600',
          String(modelValue) === String(tab.value)
            ? 'bg-surface text-navy-brand shadow-xs font-semibold'
            : 'text-text-secondary hover:text-text-primary hover:bg-white/50',
          tab.isLocked ? 'cursor-pointer' : ''
        ]"
        @click="onTabClick(tab)"
      >
        <component :is="tab.icon" v-if="tab.icon" class="w-3.5 h-3.5 shrink-0" />
        <span>{{ tab.label }}</span>

        <span
          v-if="tab.badge"
          :class="[
            'text-[10px] font-mono px-1.5 py-0.5 rounded',
            String(modelValue) === String(tab.value)
              ? 'bg-blue-50 text-blue-800'
              : 'bg-slate-200/80 text-slate-700'
          ]"
        >
          {{ tab.badge }}
        </span>

        <span
          v-if="tab.isLocked"
          class="inline-flex items-center gap-0.5 text-[10px] uppercase font-semibold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded"
        >
          <Lock class="w-2.5 h-2.5" />
          Pro
        </span>
      </TabsTrigger>
    </TabsList>

    <div class="mt-4">
      <slot />
    </div>
  </TabsRoot>
</template>
