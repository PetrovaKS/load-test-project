<template>
  <div class="mt-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5>История тестов</h5>
      <button
        v-if="store.testResults.length > 0"
        class="btn btn-outline-secondary btn-sm"
        @click="store.clearResults"
      >
        Очистить историю
      </button>
    </div>

    <div v-if="store.testResults.length === 0" class="alert alert-secondary">
      Тесты еще не проводились
    </div>

    <div v-else>
      <div
        v-for="(result, index) in store.testResults"
        :key="index"
        class="card mb-3"
        :class="{ 'border-warning': result.isInterrupted }"
      >
        <div class="card-body">
          <!-- Заголовок с пометкой о прерывании -->
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h6 class="mb-0">Результат теста</h6>
            <span
              v-if="result.isInterrupted"
              class="badge bg-warning text-dark"
            >
              Тест прерван
            </span>
            <span v-else-if="isCompletedTest(result)" class="badge bg-success">
              Завершен
            </span>
          </div>

          <div class="row">
            <div class="col-md-6">
              <ul class="list-unstyled">
                <li>
                  <strong>Запросов:</strong> {{ result.config.requestsCount }}
                </li>
                <li>
                  <strong>Задержка:</strong> {{ result.config.delayMs }} мс
                </li>
                <li>
                  <strong>Режим:</strong>
                  {{
                    result.config.usePagination
                      ? "с пагинацией"
                      : "без пагинации"
                  }}
                </li>
                <li>
                  <strong>Кэширование:</strong>
                  {{ result.config.useCache ? "включено" : "выключено" }}
                </li>
                <li>
                  <strong>Длительность:</strong> {{ result.stats.duration }} сек
                </li>
              </ul>
            </div>
            <div class="col-md-6">
              <ul class="list-unstyled" v-if="!result.isInterrupted">
                <li><strong>Отправлено:</strong> {{ result.stats.sent }}</li>
                <li>
                  <strong>Успешно:</strong>
                  <span class="text-success">{{ result.stats.success }}</span>
                </li>
                <li>
                  <strong>Ошибки:</strong>
                  <span class="text-danger">{{ result.stats.errors }}</span>
                </li>
              </ul>
              <div class="alert alert-warning mt-2 mb-0 py-2" v-else>
                <small>
                  <strong>Тест был прерван</strong><br />
                  Выполнено {{ result.stats.sent }} из
                  {{ result.config.requestsCount }} запросов ({{
                    Math.round(
                      (result.stats.sent / result.config.requestsCount) * 100
                    )
                  }}%)
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLoadTestStore } from "../stores/loadTestStore";
import type { TestResult } from "../types/loadTest";

const store = useLoadTestStore();

const isCompletedTest = (result: TestResult): boolean => {
  return (
    result.stats.sent === result.config.requestsCount && !result.isInterrupted
  );
};
</script>
