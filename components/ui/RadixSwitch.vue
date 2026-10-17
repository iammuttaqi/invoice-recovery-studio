<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from 'radix-vue'

interface Props {
  modelValue: boolean
  disabled?: boolean
  id?: string
}

withDefaults(defineProps<Props>(), {
  disabled: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>

<template>
  <SwitchRoot
    :id="id"
    :checked="modelValue"
    :disabled="disabled"
    class="w-11 h-6 rounded-full relative bg-slate-300 data-[state=checked]:bg-navy-brand transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    @update:checked="(val) => emit('update:modelValue', val)"
  >
    <SwitchThumb
      class="block w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-150 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]"
    />
  </SwitchRoot>
</template>
