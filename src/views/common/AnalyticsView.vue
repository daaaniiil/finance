<template>
  <div class="analytics-page">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'income-expenses-page' }">Доходы & Расходы</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'analytics-page' }">Аналитика</el-breadcrumb-item>
      <el-breadcrumb-item>Настройки</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card v-if="!store.loading">
      <h2>Текущий месяц «<span>{{ availableMonths }}</span>»</h2>
      <hr>
      <h1>Заработок: {{ format(Number(store.earningsCurrentMonthAmount)) }}{{currencyStore.getIcon}}</h1>
      <h1>Доход: <span class="income">{{ format(Number(incomeCurrentMonthAmount)) }}{{currencyStore.getIcon}}</span></h1>
      <h1>Расходы: <span class="expenses">{{ format(store.expensesCurrentMonthAmount) }}{{currencyStore.getIcon}}</span></h1>
    </el-card>
    <el-card v-else>
      <el-skeleton animated/>
    </el-card>

    <HighChartComponent />
  </div>
</template>

<script setup lang="ts">
import {onMounted, computed} from "vue";
import {useFinanceStore} from "@/store";
import HighChartComponent from "@/components/highCharts/HighChartComponent.vue";
import {IMonths} from "@/resources/types.ts";
import {useCurrencyStore} from "@/store/currency.ts";

const store = useFinanceStore()
const currencyStore = useCurrencyStore()
const format = (balance: number) => {
  return balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

const currentMonth = new Date().getMonth()
const availableMonths = store.months.find((month: IMonths) => month.value === currentMonth)?.label

const incomeCurrentMonthAmount = computed(() => {
  return store.earningsCurrentMonthAmount - store.expensesCurrentMonthAmount
})

onMounted(async () => {
  await store.getUserEarnings()
  await store.getUserExpenses()
  await store.incomeExpensesEarningsCurrent()
})
</script>

<style lang="scss">
@use '../../styles/variable.scss' as *;

.analytics-page {
  h1:nth-child(4) {
    margin: $padding - 5 0;
  }

  h2 {
    margin-bottom: $padding_main;

    span {
      color: $color_main_green;
    }
  }

  hr {
    margin: 0 0 $padding 0;
  }

  .income {
    color: $color_main_green;
  }

  .expenses {
    color: $color_red_main;
  }
}
</style>