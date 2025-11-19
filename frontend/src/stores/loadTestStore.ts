import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import type {
  LoadTestConfig,
  LoadTestStats,
  TestResult,
} from "../types/loadTest";
import { loadTestApi } from "../api/loadTestApi";

export const useLoadTestStore = defineStore("loadTest", () => {
  // Состояние
  const isTesting = ref(false);
  const testStartTime = ref<number | null>(null);
  const durationInterval = ref<number | null>(null);
  const wasInterrupted = ref(false);
  const abortController = ref<AbortController | null>(null);

  const config = reactive<LoadTestConfig>({
    requestsCount: 100,
    delayMs: 0,
    usePagination: false,
    pageSize: 10,
    useCache: false,
  });

  const stats = reactive<LoadTestStats>({
    sent: 0,
    success: 0,
    errors: 0,
    duration: 0,
  });

  const testResults = ref<TestResult[]>([]);

  /** Возвращает состояние тестирования в % */
  const progressPercentage = () => {
    if (config.requestsCount === 0) return 0;
    return (stats.sent / config.requestsCount) * 100;
  };

  /** Функция отправки одного запроса */
  const sendSingleRequest = async (): Promise<void> => {
    if (!isTesting.value) throw new Error("Cancelled");

    const signal = abortController.value?.signal;

    if (config.usePagination) {
      // Режим с пагинацией
      const limit = config.pageSize || 10;
      const offset = 0;

      if (config.useCache) {
        // 👇 Используем закэшированный эндпоинт
        await loadTestApi.getCachedItemsPage(limit, offset, signal);
      } else {
        await loadTestApi.getItemsPage(limit, offset, signal);
      }
    } else {
      // Режим без пагинации - все данные сразу
      if (config.useCache) {
        await loadTestApi.getCachedAllItems(signal);
      } else {
        await loadTestApi.getAllItems(signal);
      }
    }
  };

  /** Функция нагрузочного тестирования с последовательными запросами */
  const sendSequentialRequests = async (): Promise<{
    success: number;
    errors: number;
  }> => {
    let success = 0;
    let errors = 0;

    for (let i = 0; i < config.requestsCount; i++) {
      if (!isTesting.value) {
        break;
      }

      try {
        await sendSingleRequest();
        success++;
      } catch {
        errors++;
      }

      stats.sent = i + 1;

      if (config.delayMs > 0 && i < config.requestsCount - 1) {
        await new Promise((resolve) => setTimeout(resolve, config.delayMs));
      }
    }

    return { success, errors };
  };

  /** Функция нагрузочного тестирования с параллельными запросами */
  const sendParallelRequests = async (): Promise<{
    success: number;
    errors: number;
  }> => {
    const requests = Array.from({ length: config.requestsCount }, () =>
      sendSingleRequest()
        .then(() => {
          if (isTesting.value) {
            stats.sent++;
          }
          return "success";
        })
        .catch(() => {
          if (isTesting.value) {
            stats.sent++;
          }
          return "error";
        })
    );

    const results = await Promise.allSettled(requests);

    const success = results.filter(
      (result) => result.status === "fulfilled" && result.value === "success"
    ).length;

    const errors = results.filter(
      (result) => result.status === "fulfilled" && result.value === "error"
    ).length;

    return { success, errors };
  };

  /** Запуск теста */
  const startTest = async (): Promise<void> => {
    isTesting.value = true;
    testStartTime.value = Date.now();
    wasInterrupted.value = false;
    abortController.value = new AbortController();

    // Сброс статистики
    Object.assign(stats, { sent: 0, success: 0, errors: 0, duration: 0 });

    // Запуск таймера
    durationInterval.value = window.setInterval(updateDuration, 100);

    try {
      let result;
      if (config.delayMs > 0) {
        // Если есть задержка - используем последовательные запросы
        result = await sendSequentialRequests();
      } else {
        // Если задержки нет - используем параллельные запросы
        result = await sendParallelRequests();
      }

      stats.success = result.success;
      stats.errors = result.errors;
    } catch (error: any) {
      console.error("Ошибка теста:", error.message);
    } finally {
      if (stats.sent > 0) {
        saveResult();
      }
      stopTest();
    }
  };

  /** Функция остановки тестирования */
  const stopTest = (): void => {
    if (isTesting.value) {
      wasInterrupted.value = true;
    }

    isTesting.value = false;

    // Отменяем все HTTP запросы
    if (abortController.value) {
      abortController.value.abort();
      abortController.value = null;
    }

    if (durationInterval.value) {
      clearInterval(durationInterval.value);
      durationInterval.value = null;
    }
  };

  /** Функция вычисляет сколько времени прошло с начала теста */
  const updateDuration = (): void => {
    if (testStartTime.value) {
      stats.duration = Number(
        ((Date.now() - testStartTime.value) / 1000).toFixed(2)
      );
    }
  };

  /** Функция сохранения результата */
  const saveResult = (): void => {
    if (stats.sent > 0) {
      const result: TestResult = {
        config: { ...config },
        stats: { ...stats },
        isInterrupted: wasInterrupted.value,
      };
      testResults.value.unshift(result);

      if (testResults.value.length > 10) {
        testResults.value.pop();
      }
    }
  };

  /** Функция сброса результатов */
  const clearResults = (): void => {
    testResults.value = [];
  };

  return {
    // Состояние
    isTesting,
    config,
    stats,
    testResults,

    // Геттеры
    progressPercentage,

    // Действия
    startTest,
    stopTest,
    clearResults,
  };
});
