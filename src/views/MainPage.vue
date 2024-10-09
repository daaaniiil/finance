<template>
  <div class="main-page">
    <el-skeleton v-if="store.loading" animated/>
    <el-card v-else>
      <h1>Заработок: {{ format(store.balance) }}p</h1>
      <h1>Доходы: <span class="income">{{ format(store.income) }}p</span></h1>
      <h1>Расходы: <span class="expenses">{{ format(store.expenses) }}p</span></h1>
    </el-card>
    <high-chart-line/>
    <high-chart-column/>
    <router-link :to="{name:'analytics-page'}">
      <el-button>Детальная аналитика</el-button>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import {onMounted} from 'vue'
import HighChartLine from "@/components/HighCharts/HighChartLine.vue";
import HighChartColumn from "@/components/HighCharts/HighChartColumn.vue";
import {useFinanceStore} from '../store/index'

const store = useFinanceStore()

const format = (balance: number) => {
  return balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

const createUserData = async () => {
  await store.createUserData(50000,20000,30000)
}

onMounted(async () => {
  await store.getUserData()
})
</script>

<style lang="scss">
@use '../styles/variable.scss' as *;

.main-page {
  //.el-card {
  //  margin: 20px 0;
  //  &:nth-child(2){
  //    background-color: $color_empty_green;
  //  }
  //  &:nth-child(3){
  //    background-color: $color_red_empty;
  //  }
  //  span {
  //    font-weight: 600;
  //  }
  //}
  .el-card {
    margin: $size * 2 0;
  }

  h1:nth-child(2) {
    margin: $size * 2 0;
  }
  .income {
    color: $color_main_green;
  }

  .expenses {
    color: $color_red_main;
  }

  a {
    background-size: 0;
  }
}
</style>