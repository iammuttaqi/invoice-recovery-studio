<script setup lang="ts">
import { SliderRoot, SliderTrack, SliderRange, SliderThumb } from 'radix-vue'
import { computed } from 'vue'

interface Props {
  modelValue: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  min: 1,
  max: 20,
  step: 0.5,
  disabled: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', val: number): void
}>()

const sliderValues = computed({
  get: () => [props.modelValue],
  set: (val: number[]) => {
    if (val && val.length > 0) {
      emit('update:modelValue', val[0])
    }
  }
})
</script>

<template>
  <SliderRoot
    v-model="sliderValues"
    :min="min"
    :max="max"
    :step="step"
    :disabled="disabled"
    class="relative flex items-center select-none touch-none w-full h-5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <SliderTrack class="bg-slate-200 relative grow rounded-full h-2">
      <SliderRange class="absolute bg-navy-brand rounded-full h-full" />
    </SliderTrack>
    <SliderThumb
      class="block w-5 h-5 bg-white border-2 border-navy-brand shadow-sm rounded-full hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
      aria-label="Settlement Discount Percentage"
    />
  </SliderRoot>
</template>
