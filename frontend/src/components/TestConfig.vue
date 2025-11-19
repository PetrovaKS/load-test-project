<template>
  <div>
    <div class="row mb-4">
      <div class="col-md-4">
        <label for="requestsCount" class="form-label"
          >Количество запросов</label
        >
        <input
          type="number"
          class="form-control"
          id="requestsCount"
          v-model.number="store.config.requestsCount"
          min="1"
          max="10000"
          :disabled="store.isTesting"
        />
      </div>
      <div class="col-md-4">
        <label for="delayMs" class="form-label">Задержка (мс)</label>
        <input
          type="number"
          class="form-control"
          id="delayMs"
          v-model.number="store.config.delayMs"
          min="0"
          max="10000"
          :disabled="store.isTesting"
        />
      </div>
    </div>
    <div class="row mb-4">
      <div class="col-md-4">
        <label class="form-label">Режим запросов</label>
        <div class="form-check">
          <input
            class="form-check-input"
            type="radio"
            id="noPagination"
            :value="false"
            v-model="store.config.usePagination"
            :disabled="store.isTesting"
          />
          <label class="form-check-label" for="noPagination">
            Без пагинации
          </label>
        </div>
        <div class="form-check mb-2">
          <input
            class="form-check-input"
            type="radio"
            id="withPagination"
            :value="true"
            v-model="store.config.usePagination"
            :disabled="store.isTesting"
          />
          <label class="form-check-label" for="withPagination">
            С пагинацией
          </label>
        </div>
      </div>
      <div class="col-md-3" v-if="store.config.usePagination">
        <label for="pageSize" class="form-label mt-3">limit</label>
        <input
          type="number"
          class="form-control"
          id="pageSize"
          v-model.number="store.config.pageSize"
          min="1"
          max="100"
          :disabled="store.isTesting"
        />
      </div>
    </div>
    <div class="row mb-4">
      <div class="col-md-4">
        <label class="form-label">Кэширование</label>
        <div class="form-check form-switch">
          <input
            class="form-check-input"
            type="checkbox"
            id="useCache"
            v-model="store.config.useCache"
            :disabled="store.isTesting"
          />
          <label class="form-check-label" for="useCache">
            Использовать кэш
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLoadTestStore } from "../stores/loadTestStore";

const store = useLoadTestStore();
</script>
