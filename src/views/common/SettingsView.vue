<template>
  <div class="settings-page">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'completed-goals-page' }">Цели</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'settings-page' }">Настройки</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <h2>Профиль</h2>
      <p>email: <strong>{{emailUser}}</strong></p>
      <p>Зарегистрирован: <span>{{ createdAt }}</span></p>

      <currency-switcher/>
      <div class="settings-page__exit">
        <el-popconfirm
            width="220"
            title="Вы уверены что вы хотите выйти?"
            @confirm="store.logout()">
          <template #reference>
            <el-button type="danger">Выход</el-button>
          </template>
          <template #actions="{ confirm, cancel }">
            <el-button type="warning" size="small" @click="cancel">Нет!</el-button>
            <el-button type="danger" size="small" @click="confirm">Да</el-button>
          </template>
        </el-popconfirm>
      </div>
    </el-card>

    <p>Бюджет: <strong>{{ formatNumber(Number(store.budget.toFixed(2))) }} {{ currencyStore.getIcon }}</strong></p>

    <high-chart-earnings :months="monthLabel" :salaries="salaryValues" title="Зарплата" v-if="monthLabel.length"/>
    <el-empty v-else-if="monthLabel.length === 0" description="Вы еще не добавили зарплату"/>

    <h3 v-if="monthLabelLastYear.length">Прошлый год</h3>
    <high-chart-earnings
        v-if="monthLabelLastYear.length"
        :months="monthLabelLastYear"
        :salaries="salaryLastYearValues"
        color="darkblue"
        :title="`Зарплата прошлого года (${new Date().getFullYear() - 1})`"/>

    <high-chart-expenses-income
        :months="monthLabelLastYear"
        :expenses="expensesAmount"
        :income="incomeAmount"
        title="Доходы и расходы прошлого года"
        v-if="monthLabelLastYear.length"
    />
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted} from 'vue'
import {useFinanceStore} from "@/store";
import CurrencySwitcher from "@/components/CurrencySwitcher.vue";
import HighChartEarnings from "@/components/highCharts/HighChartEarnings.vue";
import {IEarnings, IExpenses, IMonths} from "@/resources/types.ts";
import {useCurrencyStore} from "@/store/currency.ts";
import HighChartExpensesIncome from "@/components/highCharts/HighChartExpensesIncome.vue";

const store = useFinanceStore()
const currencyStore = useCurrencyStore()

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('ru-RU').format(value)
}

const createdAt = computed(() => store.user?.created_at?.slice(0, 10).split('-').reverse().join('.'))
const emailUser = computed(() => store.user?.email)

const sortedEarnings = computed(() => {
  return store.earnings.slice().sort((a: IEarnings, b: IEarnings) => {
    const monthA = store.months.findIndex((month: IMonths) => month.label === a.month)
    const monthB = store.months.findIndex((month: IMonths) => month.label === b.month)
    return monthB - monthA
  })
})
const monthLabel = computed(() => sortedEarnings.value.map((e: IEarnings) => e.month).reverse())
const salaryValues = computed(() => sortedEarnings.value.map((e: IEarnings) => e.amount).reverse())


const sortedLastYearEarnings = computed(() => {
  return store.lastYearEarnings.filter((e: IEarnings) => e.year === new Date().getFullYear() - 1).slice().sort((a: IEarnings, b: IEarnings) => {
    const monthA = store.months.findIndex((month: IMonths) => month.label === a.month)
    const monthB = store.months.findIndex((month: IMonths) => month.label === b.month)
    return monthB - monthA
  })
})
const monthLabelLastYear = computed(() => sortedLastYearEarnings.value.map((e: IEarnings) => e.month).reverse())
const salaryLastYearValues = computed(() => sortedLastYearEarnings.value.map((e: IEarnings) => e.amount).reverse())


const expensesAmount = computed(() => {
  const groupedExpenses = store.expenses.reduce((acc: Record<string, number>, expense: IExpenses) =>{
    const yearExpense = new Date(expense.date).getFullYear()
    const month = new Date(expense.date).toLocaleString('ru-RU', {month: 'long'}).toLowerCase()
    if(yearExpense === new Date().getFullYear() - 1){
      acc[month] = (acc[month] || 0) + (expense.amount || 0)
    }
    return acc
  }, {})

  return monthLabelLastYear.value.map((month: string) => groupedExpenses[month.toLowerCase()] || 0)
})

const incomeAmount = computed(() => {
  return sortedLastYearEarnings.value.map((earning: IEarnings) => {
    const month = earning.month.toLowerCase()
    const monthExpenses = store.expenses
        .filter((expense: IExpenses) => {
          const yearExpense = new Date(expense.date).getFullYear()
          const monthExpense = new Date(expense.date).toLocaleString('ru-RU', {month:'long'}).toLowerCase()
          if(yearExpense === new Date().getFullYear() - 1){
            return monthExpense === month
          }
        })
        .reduce((acc: number, expense: IExpenses) => acc + (expense.amount || 0), 0)

    return Number(earning.amount) - monthExpenses
  }).reverse()
})

onMounted(async () => {
  await store.authUser()
  await store.getUserEarnings()
  await store.getUserExpenses()
  await store.currentBudget()
  await store.getLastYearEarnings()
})
</script>

<style lang="scss">
@use '../../styles/variable.scss' as *;

.settings-page {
  hr {
    margin: 0 0 $padding 0;
  }

  h2 {
    border-bottom: 1px solid gray;
    padding-bottom: $padding_main;
    margin-bottom: $padding_main;

    span {
      color: $color_main_green;
    }

    &:nth-child(2) {
      margin-top: $padding_average;
      padding-bottom: $padding - 5;
      border-bottom: 1px solid black;
    }
  }

  h3 {
    margin-top: $padding_main;
  }

  &__exit {
    margin-top: $padding;
  }

  p {
    margin: $padding - 5 0;

    span {
      font-weight: 500;
    }
  }
}
</style>