<script setup lang="ts">
import { useBilling } from '../../composables/useBilling'
import { Sparkles, RefreshCw } from 'lucide-vue-next'

const { isPro, toggleSandboxPro, isTogglingSandbox } = useBilling()
</script>

<template>
  <div
    v-if="isPro"
    class="bg-blue-950 text-white text-xs py-2 px-4 border-b border-blue-900 no-print"
  >
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <Sparkles class="w-4 h-4 text-blue-300 shrink-0" />
        <span>
          <strong>Sandbox Pro Simulation Active:</strong> Full Stage 4 Letter Before Action, 48h prompt settlement waiver, and PDF letterhead exports are unlocked.
        </span>
      </div>

      <button
        type="button"
        :disabled="isTogglingSandbox"
        class="text-blue-200 hover:text-white underline text-[11px] flex items-center gap-1 font-mono transition-colors shrink-0"
        @click="toggleSandboxPro"
      >
        <RefreshCw :class="['w-3 h-3', isTogglingSandbox ? 'animate-spin' : '']" />
        <span>Switch to Free Tier (Test Quota Gating)</span>
      </button>
    </div>
  </div>
</template>
