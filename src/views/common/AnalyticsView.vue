<template>
  <div class="analytics-page">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'analytics-page' }">Аналитика</el-breadcrumb-item>
      <el-breadcrumb-item>Цели</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card v-if="!store.loading">
      <h2>Текущий месяц «<span>{{ availableMonths }}</span>»</h2>
      <hr>
      <h1>Заработок: <span>{{formatNumber(Number(store.earningsCurrentMonthAmount.toFixed())) }}{{ currencyStore.getIcon }}</span></h1>
      <h1>Доход: <span class="income">{{formatNumber(Number(incomeCurrentMonthAmount.toFixed())) }}{{ currencyStore.getIcon }}</span></h1>
      <h1>Расходы: <span class="expenses">{{formatNumber(Number(store.expensesCurrentMonthAmount.toFixed())) }}{{ currencyStore.getIcon }}</span></h1>
    </el-card>
    <el-card v-else>
      <el-skeleton animated/>
    </el-card>

    <el-row :gutter="20">
      <el-col :md="12" >
        <HighChartPie v-if="store.amountExpenses" :expenses="store.mergedExpenses" :amount="store.amountExpenses"/>
        <el-empty v-else :description="`Расходы ${new Date().getFullYear()} года`"/>
      </el-col>
      <el-col :md="12" >
        <el-card><h3>Мин.расход - <span>{{ store.minExpenses > 0 ? formatNumber(Number(store.minExpenses.toFixed())) : 0 }}{{ currencyStore.getIcon }}</span>
          {{minExpensesCategories}}</h3></el-card>

        <el-card><h3>Макс.расход - <span>{{ store.maxExpenses > 0 ? formatNumber(Number(store.maxExpenses.toFixed())) : 0 }}{{ currencyStore.getIcon }}</span>
          {{maxExpensesCategories}}</h3></el-card>

        <el-card><h3>Сред.расходы - <span>{{ formatNumber(Number(store.averageExpenses.toFixed())) }}{{ currencyStore.getIcon }}</span></h3></el-card>
      </el-col>
    </el-row>

    <HighChartExpensesMonth :expenses="store.expensesDaysCurrentMonth" :month="currentMonth" v-if="store.expensesDaysCurrentMonth.length"/>

    <Goals :goals="visibleGoals" v-if="visibleGoals.length" :visible-hidden="true" title="Ваши финансовые цели"/>
    <el-empty v-else description="У вас пока нет целей, добавьте!"/> <br>
    <add-goal-form />

    <h2 style="margin-top: 30px">Топ 10 расходов за {{ availableMonths }}</h2>

    <ul v-for="expense in topTenExpenses" :key="expense.category" class="list">
      <li class="list-item">
        {{ expense.category }} | {{ expense.amount }} {{ currencyStore.getIcon }}
      </li>
    </ul>

  </div>
</template>

<script setup lang="ts">
import {onMounted,computed} from "vue";
import {useFinanceStore} from "@/store";
import HighChartPie from "@/components/highCharts/HighChartPie.vue";
import HighChartExpensesMonth from "@/components/highCharts/HighChartExpensesMonth.vue";
import {IGoal, IMonths} from "@/resources/types.ts";
import {useCurrencyStore} from "@/store/currency.ts";
import Goals from "@/components/Goals.vue";
import AddGoalForm from "@/forms/AddGoalForm.vue";

const store = useFinanceStore()
const currencyStore = useCurrencyStore()

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('ru-RU').format(value)
}

const minExpensesCategories = computed(() => `(${store.minExpensesCategories ?? 'Нету'})`)
const maxExpensesCategories = computed(()=> `(${store.maxExpensesCategories ?? 'Нету'})`)

const currentMonth = new Date().getMonth()
const availableMonths = store.months.find((month: IMonths) => month.value === currentMonth)?.label

const incomeCurrentMonthAmount = computed(() => {
  return store.earningsCurrentMonthAmount - store.expensesCurrentMonthAmount
})

const visibleGoals = computed(() => store.goals.filter((goal: IGoal) => !store.hiddenGoals.includes(goal.id)))

const topTenExpenses = computed(() => store.expensesTenCategoryCurrentMonth.slice(0, 10))

onMounted(async () => {
  await store.getUserEarnings()
  await store.getUserExpenses()
  await store.incomeExpensesEarningsCurrent()
  await store.expensesEarningsCategories()
  await store.amountExpensesEarningsCategories()
  await store.minMaxExpensesAmount()
  await store.expensesDaysMonthCurrent()
  await store.getUserGoals()
  await store.fetchBudget()
  await store.updateGoalStatus()
})
</script>

<style lang="scss">
@use '../../styles/variable.scss' as *;

.analytics-page {
  h1:nth-child(4) {
    margin: $padding - 5 0;
  }

  h1 {
    font-weight: 500;
    span {
      font-weight: 700;
    }
  }

  h2 {
    margin-bottom: $padding_main;

    span {
      color: $color_main_green;
    }
  }
  h3{
    span {
      color: $color_red_main;
    }
  }
  .el-row {
    .el-col {
      .el-card {
        border-radius: $radius_big;
      }
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

  .list {
    list-style: none;

    &-item {
      position: relative;
      padding-bottom: $padding;
      padding-left: $radius_tiny;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>