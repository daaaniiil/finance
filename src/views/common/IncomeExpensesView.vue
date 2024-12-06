<template>
  <div class="income-expenses-page">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'income-expenses-page' }">Доходы & Расходы</el-breadcrumb-item>
      <el-breadcrumb-item>Аналитика</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="income-expenses-page__content">
      <el-card>
        <h2>Добавить расход</h2>
        <expenses-form/>
      </el-card>
      <el-card>
        <h2>Ваши расходы</h2>
        <el-table :data="expensesConverted" :height="500">
          <el-table-column fixed prop="date" label="Дата" width="120" />
          <el-table-column prop="category" label="Категория" width="300"/>
          <el-table-column prop="amount" label="Сумма" align="center" min-width="120">
            <template #default="scope">
              <span>{{ formatNumber(scope.row.amount) }}{{currencyStore.getIcon}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Действия" width="130">
            <template #default="scope">
              <el-dropdown trigger="click">
                <el-button class="el-dropdown-link">
                  <el-icon>
                    <MoreFilled />
                  </el-icon> <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :icon="Edit" @click="openEditDialog(scope.row)">Edit</el-dropdown-item>
                    <el-dropdown-item :icon="DocumentCopy" @click="copyToClipboard(scope.row)">Copy</el-dropdown-item>
                    <el-dropdown-item :icon="DeleteFilled" @click="deleteItem(scope.row.id)" style="color: red;">
                      Delete
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-dialog
          title="Редактировать расход"
          v-model="editDialogVisible"
          width="30%">
        <p>Измените сумму для расхода: {{ currentEditItem?.category }}</p>
        <el-input type="number" v-model.number="newAmount" placeholder="Введите новую сумму"/>
        <template #footer>
          <el-button type="warning" @click="editDialogVisible = false">Отменить</el-button>
          <el-button type="primary" @click="saveAmount">Сохранить</el-button>
        </template>
      </el-dialog>

      <el-empty v-if="monthLabel.length === 0"/>
      <high-chart-expenses-income :months="monthLabel" :expenses="expensesAmount" :income="incomeAmount" v-else />
    </div>
    <router-link :to="{name:'analytics-page'}">
      <el-button type="primary">Детальная аналитика</el-button>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import ExpensesForm from "@/forms/ExpensesForm.vue";
import {useFinanceStore} from "@/store";
import {useCurrencyStore} from "@/store/currency.ts";
import {DeleteFilled, DocumentCopy, Edit} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import {IEarnings, IExpenses, IMonths} from "@/resources/types.ts";
import HighChartExpensesIncome from "../../components/highCharts/HighChartExpensesIncome.vue";
import {
  MoreFilled
} from '@element-plus/icons-vue'

const store = useFinanceStore()
const currencyStore = useCurrencyStore()

const editDialogVisible = ref(false)

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('ru-RU').format(value)
}

const formatDate = (date: string) => {
  return new Date(date).toISOString().slice(0,10).split('-').reverse().join('.')
}

const currentEditItem = ref<IExpenses>({
  id: '',
  amount: null,
  date: '',
  category: ''
})

const newAmount = ref<number | null>(0)

const openEditDialog = (row: IExpenses) => {
  currentEditItem.value = {...row}
  newAmount.value = row.amount
  editDialogVisible.value = true
}

const saveAmount = async () => {
  if (currentEditItem.value && newAmount.value && newAmount.value > 0 && currentEditItem.value.amount !== null) {
    try {
      if (newAmount.value !== currentEditItem.value.amount) {
        const selectedDate = new Date(currentEditItem.value.date.split('.').reverse().join('.'))
        const selectedMonth = selectedDate.getMonth()
        const availableMonthLabel = store.months.find((month: IMonths) => month.value === selectedMonth)?.label

        const monthEarnings = store.earnings
            .find((earning: IEarnings) => earning.month === availableMonthLabel)?.amount || 0

        const monthExpenses: number = store.expenses
            .filter((expense: IExpenses) => {
              const expenseDate = new Date(expense.date)
              return expenseDate.getMonth() === selectedMonth && expenseDate.getFullYear() === new Date().getFullYear()
            })
            .reduce((acc: number, expense: IExpenses) => acc + (expense.amount || 0), 0)

        newAmount.value *= currencyStore.getRate

        if(monthEarnings > newAmount.value + (monthExpenses - currentEditItem.value.amount)) {
          await store.updateEarningsExpenses(currentEditItem.value.id, newAmount.value)

          await store.getUserExpenses()
          ElMessage.success('Сумма успешно обновлена!')
          editDialogVisible.value = false
        } else {
          newAmount.value = currentEditItem.value.amount
          ElMessage.warning('Ваш расход превышает зарплату в выбранном месяце')
        }
      } else {
        ElMessage.warning('Введите новую сумму!')
      }
    } catch (e) {
      console.error(e)
    }
  } else {
    ElMessage.warning('Введите сумму!')
  }
}

const copyToClipboard = (row: any) => {
  navigator.clipboard.writeText(`${row.date}: ${row.category} | ${formatNumber(row.amount)}${currencyStore.getIcon}`)
  ElMessage.success('Скопировано успешно!')
}

const deleteItem = async (id: string) => {
  await store.deleteExpensesItem(id)
}

const sortedExpenses = computed(() => {
  return store.expenses.slice().sort((a: IExpenses, b: IExpenses) => {
    const dateA = new Date(a.date.replace(/-/g, '.'))
    const dateB = new Date(b.date.replace(/-/g, '.'))
    return dateA.getTime() - dateB.getTime()
  }).reverse().map((e: IExpenses) => {
    return {
      ...e,
      date: formatDate(e.date)
    }
  })
})

const expensesConverted = computed(() => {
  return sortedExpenses.value.map((e: IExpenses) => ({
    ...e,
    amount: Math.floor((e.amount ?? 0) / currencyStore.getRate)
  }))
})

const sortedEarnings = computed(() => {
  return store.earnings.slice().sort((a: IEarnings, b: IEarnings) => {
    const monthA = store.months.findIndex((month: IMonths) => month.label === a.month)
    const monthB = store.months.findIndex((month: IMonths) => month.label === b.month)
    return monthB - monthA
  })
})

const monthLabel = computed(() => sortedEarnings.value.map((e: IEarnings) => e.month).reverse())

const expensesAmount = computed(() => {
  const groupedExpenses = store.expenses.reduce((acc: Record<string, number>, expense: IExpenses) =>{
    const yearExpense = new Date(expense.date).getFullYear()
    const month = new Date(expense.date).toLocaleString('ru-RU', {month: 'long'}).toLowerCase()
    if(yearExpense === new Date().getFullYear()){
      acc[month] = (acc[month] || 0) + (expense.amount || 0)
    }
    return acc
  }, {})

  return monthLabel.value.map((month: string) => groupedExpenses[month.toLowerCase()] || 0)
})

const incomeAmount = computed(() => {
  return sortedEarnings.value.map((earning: IEarnings) => {
    const month = earning.month.toLowerCase()
    const monthExpenses = store.expenses
        .filter((expense: IExpenses) => {
          const yearExpense = new Date(expense.date).getFullYear()
          const monthExpense = new Date(expense.date).toLocaleString('ru-RU', {month:'long'}).toLowerCase()
          if(yearExpense === new Date().getFullYear()){
            return monthExpense === month
          }
        })
        .reduce((acc: number, expense: IExpenses) => acc + (expense.amount || 0), 0)

    return Number(earning.amount) - monthExpenses
  }).reverse()
})

onMounted(async () => {
  await store.getUserEarnings()
  await store.getUserExpenses()
  await store.incomeExpensesEarningsCurrent()
})
</script>

<style lang="scss">
@use '../../styles/variable' as *;

.income-expenses-page {
  &__content {
    margin-top: $padding;

    h2 {
      margin-bottom: $padding;
    }

    .el-dropdown-link {
      background: none;
      border: none;
      cursor: pointer;
      color: $color_main_green;
    }
  }
  a {
    background-size: 0;

    &:hover {
      padding-left: 0;
    }
  }
}
</style>