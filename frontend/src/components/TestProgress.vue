<template>
  <div class="progress mt-3" v-if="store.config.requestsCount > 0">
    <div
      class="progress-bar"
      :class="progressBarClass"
      :style="{ width: store.progressPercentage() + '%' }"
    >
      {{ Math.round(store.progressPercentage()) }}%
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLoadTestStore } from "../stores/loadTestStore";

const store = useLoadTestStore();

const progressBarClass = computed(() => {
  if (store.stats.errors > store.stats.success) {
    return "bg-danger";
  } else {
    return "bg-primary";
  }
});
</script>
