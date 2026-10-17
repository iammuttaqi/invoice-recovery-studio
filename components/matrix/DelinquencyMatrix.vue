<script setup lang="ts">
import { useInvoiceRecovery } from '../../composables/useInvoiceRecovery'
import type { AgingBucket } from '../../types/recovery'
import AgingBucketCard from './AgingBucketCard.vue'
import { Filter, Layers } from 'lucide-vue-next'

const { activeBucket, bucketMetrics, ledgerTotals, selectBucket } = useInvoiceRecovery()
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Layers class="w-4 h-4 text-navy-brand" />
        <h3 class="text-sm font-bold text-text-primary uppercase tracking-wider">
          Delinquency Aging Matrix
        </h3>
      </div>

      <!-- Filter Pill Bar -->
      <div class="flex items-center gap-1.5 bg-inset p-1 rounded-lg border border-border text-xs">
        <button
          type="button"
          :class="[
            'px-2.5 py-1 rounded-md font-medium transition-colors duration-150',
            activeBucket === 'ALL'
              ? 'bg-surface text-navy-brand font-semibold shadow-xs'
              : 'text-text-secondary hover:text-text-primary'
          ]"
          @click="selectBucket('ALL')"
        >
          All ({{ ledgerTotals.count }})
        </button>
        <span class="text-slate-300">|</span>
        <button
          type="button"
          :class="[
            'px-2 py-1 rounded-md transition-colors duration-150',
            activeBucket === '1-14'
              ? 'bg-surface text-navy-brand font-semibold shadow-xs'
              : 'text-text-secondary hover:text-text-primary'
          ]"
          @click="selectBucket('1-14')"
        >
          1–14d ({{ bucketMetrics['1-14'].count }})
        </button>
        <button
          type="button"
          :class="[
            'px-2 py-1 rounded-md transition-colors duration-150',
            activeBucket === '15-30'
              ? 'bg-surface text-navy-brand font-semibold shadow-xs'
              : 'text-text-secondary hover:text-text-primary'
          ]"
          @click="selectBucket('15-30')"
        >
          15–30d ({{ bucketMetrics['15-30'].count }})
        </button>
        <button
          type="button"
          :class="[
            'px-2 py-1 rounded-md transition-colors duration-150',
            activeBucket === '31-60'
              ? 'bg-surface text-navy-brand font-semibold shadow-xs'
              : 'text-text-secondary hover:text-text-primary'
          ]"
          @click="selectBucket('31-60')"
        >
          31–60d ({{ bucketMetrics['31-60'].count }})
        </button>
        <button
          type="button"
          :class="[
            'px-2 py-1 rounded-md transition-colors duration-150',
            activeBucket === '60+'
              ? 'bg-surface text-navy-brand font-semibold shadow-xs'
              : 'text-text-secondary hover:text-text-primary'
          ]"
          @click="selectBucket('60+')"
        >
          60+d ({{ bucketMetrics['60+'].count }})
        </button>
      </div>
    </div>

    <!-- 4 Aging Bucket Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <AgingBucketCard
        bucket-key="1-14"
        title="1–14 Days"
        subtitle="Courtesy & Grace Nudge"
        :count="bucketMetrics['1-14'].count"
        :total-claim="bucketMetrics['1-14'].totalClaim"
        :is-active="activeBucket === '1-14'"
        @select="selectBucket"
      />

      <AgingBucketCard
        bucket-key="15-30"
        title="15–30 Days"
        subtitle="Firm Administrative Delay"
        :count="bucketMetrics['15-30'].count"
        :total-claim="bucketMetrics['15-30'].totalClaim"
        :is-active="activeBucket === '15-30'"
        @select="selectBucket"
      />

      <AgingBucketCard
        bucket-key="31-60"
        title="31–60 Days"
        subtitle="Statutory Interest Warning"
        :count="bucketMetrics['31-60'].count"
        :total-claim="bucketMetrics['31-60'].totalClaim"
        :is-active="activeBucket === '31-60'"
        @select="selectBucket"
      />

      <AgingBucketCard
        bucket-key="60+"
        title="60+ Days"
        subtitle="Legal Demand / Letter Before Action"
        :count="bucketMetrics['60+'].count"
        :total-claim="bucketMetrics['60+'].totalClaim"
        :is-active="activeBucket === '60+''"
        @select="selectBucket"
      />
    </div>
  </div>
</template>
