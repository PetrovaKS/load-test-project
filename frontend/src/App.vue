<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">
            <h2 class="text-center">Нагрузочное тестирование API</h2>
          </div>
          <div class="card-body">
            <LoadTestForm />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoadTestForm from "./components/LoadTestForm.vue";
</script>

<style>
body {
  background-color: #f8f9fa;
}
</style>
