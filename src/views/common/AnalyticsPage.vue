<template>
  <div class="transaction-page">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'income-expenses-page' }">Доходы & Расходы</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'analytics-page' }">Аналитика</el-breadcrumb-item>
      <el-breadcrumb-item>Настройки</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>Страница аналитики</h1>
    <HighChartComponent />
  </div>
</template>

<script setup lang="ts">
import HighChartComponent from "@/components/highCharts/HighChartComponent.vue";

</script>

<style lang="scss">

</style>