<template>
  <div class="main-page">
    <el-skeleton animated/>
    <el-card >
      <h1>Заработок: {{ format(70000) }}p</h1>
      <h1>Доходы: <span class="income">{{ format(20000) }}p</span></h1>
      <h1>Расходы: <span class="expenses">{{ format(50000) }}p</span></h1>
    </el-card>
    <high-chart-line/>
    <high-chart-column/>
    <router-link :to="{name:'analytics-page'}">
      <el-button>Детальная аналитика</el-button>
    </router-link>
  </div>
</template>

<script setup lang="ts">
// import {onMounted} from 'vue'
// import {supabase} from "../resources/supabase";
import HighChartLine from "@/components/HighCharts/HighChartLine.vue";
import HighChartColumn from "@/components/HighCharts/HighChartColumn.vue";

const format = (balance: number) => {
  return balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

// onMounted(async () => {
//   const { data, error } = await supabase
//       .from('countries')
//       .select('*')
//
//   if(error) {
//     console.error('Ошибка при получении данных:', error)
//   } else {
//     console.log('Данные пользователя:', data)
//   }
//
// })
</script>

<style lang="scss">
@use '../styles/variable.scss' as *;

.main-page {
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