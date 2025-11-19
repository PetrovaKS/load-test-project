<template>
  <div>
    <!-- Конфигурация теста -->
    <TestConfig />

    <!-- Блок кнопок -->
    <div class="d-grid gap-2 mb-4" style="max-width: 300px; margin: 0 auto">
      <button
        class="btn btn-primary btn-lg"
        @click="store.startTest"
        :disabled="store.isTesting"
      >
        {{ store.isTesting ? "Тестирование..." : "Старт нагрузочного теста" }}
      </button>
      <button
        class="btn btn-lg"
        :class="store.isTesting ? 'btn-danger' : 'btn-outline-secondary'"
        @click="store.stopTest"
        :disabled="!store.isTesting"
      >
        {{ store.isTesting ? "Остановить тест" : "Тест не активен" }}
      </button>
    </div>

    <!-- Статистика в реальном времени -->
    <TestStats v-if="store.stats.sent > 0" />

    <!-- История тестов -->
    <TestResults />
  </div>
</template>

<script setup lang="ts">
import { useLoadTestStore } from "../stores/loadTestStore";
import TestConfig from "./TestConfig.vue";
import TestStats from "./TestStats.vue";
import TestResults from "./TestResults.vue";

const store = useLoadTestStore();
</script>
