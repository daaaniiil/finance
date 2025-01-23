<template>
  <div class="main-page">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'main-page' }">Главная</el-breadcrumb-item>
      <el-breadcrumb-item>Доходы & Расходы</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card v-if="!store.loading">
      <h2>Прошлый месяц «<span>{{ availableMonths }}</span>»</h2>
      <hr>
      <h1>Заработок: <span>{{ formatNumber(Number(store.earningsLastMonthAmount.toFixed())) }}{{ currencyStore.getIcon }}</span></h1>
      <h1>Доход: <span class="income">{{ formatNumber(Number(incomeLastMonthAmount.toFixed())) }}{{ currencyStore.getIcon }}</span></h1>
      <h1>Расходы: <span class="expenses">{{formatNumber(Number(store.expensesLastMonthAmount.toFixed())) }}{{ currencyStore.getIcon }}</span></h1>
    </el-card>
    <el-card v-else>
      <el-skeleton animated/>
    </el-card>

    <el-card>
      <h2>Ваш заработок по месяцам</h2>
      <el-table :data="earningsConverted" style="width: 100%" v-loading="store.loading">
        <el-table-column fixed prop="month" label="Месяц" width="100"/>
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
                  <MoreFilled/>
                </el-icon>
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :icon="Edit" @click="openEditDialog(scope.row)">Edit</el-dropdown-item>
                  <el-dropdown-item :icon="DocumentCopy" @click="copyToClipboard(scope.row)">Copy</el-dropdown-item>
                  <el-dropdown-item :icon="DeleteFilled" @click="deleteItem(scope.row)" style="color: red;">Delete
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
        title="Редактировать сумму"
        v-model="editDialogVisible"
        width="30%">
      <p>Измените сумма для месяца: {{ currentEditItem?.month }}</p>
      <el-input type="number" v-model.number="newAmount" placeholder="Введите новую сумму"/>
      <template #footer>
        <el-button type="warning" @click="editDialogVisible = false">Отменить</el-button>
        <el-button type="primary" @click="saveAmount">Сохранить</el-button>
      </template>
    </el-dialog>

    <el-card>
      <h2>Добавить заработок за месяц</h2>
      <earnings-form/>
    </el-card>

    <HighChartExpensesMonth :expenses="store.expensesDaysLastMonth" :month="lastMonthValue" v-if="store.expensesDaysLastMonth.length" />
    <el-empty v-if="monthLabel.length === 0" description="Вы еще не добавили заработок"/>
    <high-chart-earnings :months="monthLabel" :salaries="salaryValues" title="Заработок" v-else-if="monthLabel.length" />
    <router-link :to="{name:'analytics-page'}">
      <el-button type="primary">Детальная аналитика</el-button>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {useFinanceStore} from '@/store';
import {useCurrencyStore} from "@/store/currency.ts";
import EarningsForm from "@/forms/EarningsForm.vue";
import HighChartEarnings from "../components/highCharts/HighChartEarnings.vue";
import {IEarnings, IExpenses, IMonths} from "../resources/types";
import {
  DocumentCopy,
  Edit,
  MoreFilled,
  DeleteFilled
} from '@element-plus/icons-vue'
import {ElMessage} from "element-plus";
import HighChartExpensesMonth from "@/components/highCharts/HighChartExpensesMonth.vue";

const store = useFinanceStore()
const currencyStore = useCurrencyStore()

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('ru-RU').format(value)
}
let lastMonthValue = new Date().getMonth() - 1
if(lastMonthValue === -1) {
  lastMonthValue = 11
}

let lastMonth = new Date().getMonth()
if (lastMonth === 0) {
  lastMonth = 12
}

const availableMonths = store.months.find((month: IMonths) => month.value === lastMonth - 1)?.label

const incomeLastMonthAmount = computed(() => {
  return store.earningsLastMonthAmount - store.expensesLastMonthAmount
})


const sortedEarnings = computed(() => {
  return store.earnings.slice().sort((a: IEarnings, b: IEarnings) => {
    const monthA = store.months.findIndex((month: IMonths) => month.label === a.month)
    const monthB = store.months.findIndex((month: IMonths) => month.label === b.month)
    return monthB - monthA
  })
})

const earningsConverted = computed(() => {
  return sortedEarnings.value.map((e: IEarnings) => ({
    ...e,
    amount: Math.floor((e.amount ?? 0) / currencyStore.getRate)
  }))
})

const editDialogVisible = ref<boolean>(false)
const currentEditItem = ref<IEarnings>({
  id: '',
  amount: null,
  month: ''
})
const newAmount = ref<number | null>(0)

const openEditDialog = (row: IEarnings) => {
  currentEditItem.value = {...row}
  newAmount.value = row.amount
  editDialogVisible.value = true
}

const saveAmount = async () => {
  if (currentEditItem.value && newAmount.value && newAmount.value !== 0) {
    try {
      if (newAmount.value !== currentEditItem.value.amount) {
        const selectedMonth = store.months.find((m: IMonths) => m.label === currentEditItem.value.month)?.value

        const monthExpenses: number = store.expenses
            .filter((expense: IExpenses) => {
              const expenseDate = new Date(expense.date)

              return expenseDate.getMonth() === selectedMonth && expenseDate.getFullYear() === new Date().getFullYear()
            })
            .reduce((acc: number, expense: IExpenses) => acc + (expense.amount || 0), 0)

          newAmount.value *= currencyStore.getRate

        if(newAmount.value >= monthExpenses) {
          await store.updateEarningsAmount(currentEditItem.value.id, newAmount.value, currentEditItem.value.month)

          newAmount.value /= currencyStore.getRate
          const earningsDifference = newAmount.value - currentEditItem.value.amount!

          const updateType = earningsDifference < 0 ? 'expenses' : 'earnings'
          await store.updateBudget(Math.abs(earningsDifference), updateType)

          editDialogVisible.value = false
          ElMessage.success('Сумма успешно обновлена!')
        } else {
          newAmount.value *= currencyStore.getRate
          newAmount.value = currentEditItem.value.amount
          ElMessage.warning('Ваши раходы превышают заработок в выбранном месяце или заработок меньше 0')
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
  navigator.clipboard.writeText(`Месяц: ${row.month}, Заработок: ${formatNumber(row.amount)}${currencyStore.getIcon}`)
  ElMessage.success('Скопировано успешно!')
}
const deleteItem = async (row: IEarnings) => {
  await store.deleteEarningsItemData(row.id, row.month)
  await store.updateBudget(row.amount!, 'expenses')
}

const monthLabel = computed(() => sortedEarnings.value.map((e: IEarnings) => e.month).reverse())
const salaryValues = computed(() => sortedEarnings.value.map((e: IEarnings) => e.amount).reverse())


onMounted(async () => {
  await store.nowNewYear()
  await store.getUserEarnings()
  await store.getUserExpenses()
  await store.incomeExpensesEarnings()
  await store.expensesDaysMonthLast()

  await store.fetchBudget()

  if(store.budget === 0) {
    await store.initializeBudget()
  }
})
</script>

<style lang="scss">
@use '../styles/variable.scss' as *;

.main-page {

  .el-dropdown-link {
    background: none;
    border: none;
    cursor: pointer;
    color: $color_main_green;
  }

  h1 {
    font-weight: 500;
    span {
      font-weight: 700;
    }
  }
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

  a {
    background-size: 0;

    &:hover {
      padding-left: 0;
    }
  }
}
</style>