<template>
  <div class="alert alert-primary">
    <h5>Статистика тестирования:</h5>
    <div class="row">
      <div class="col-md-3">
        <strong>Отправлено:</strong> {{ store.stats.sent }}
      </div>
      <div class="col-md-3">
        <strong>Успешно:</strong>
        <span class="text-success">{{ store.stats.success }}</span>
      </div>
      <div class="col-md-3">
        <strong>Ошибки:</strong>
        <span class="text-danger">{{ store.stats.errors }}</span>
      </div>
      <div class="col-md-3">
        <strong>Время:</strong> {{ store.stats.duration }} сек
      </div>
    </div>

    <TestProgress />
  </div>
</template>

<script setup lang="ts">
import { useLoadTestStore } from "../stores/loadTestStore";
import TestProgress from "./TestProgress.vue";

const store = useLoadTestStore();
</script>
