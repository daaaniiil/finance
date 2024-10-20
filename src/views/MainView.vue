<template>
  <div class="main-page">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'main-page' }">Главная</el-breadcrumb-item>
      <el-breadcrumb-item>Доходы & Расходы</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card v-if="!store.loading">
      <h2>Прошлый месяц «<span>{{ availableMonths }}</span>»</h2>
      <hr>
      <h1>Заработок: {{ format(Number(store.earningsLastMonthAmount)) }}₽</h1>
      <h1>Доход: <span class="income">{{ format(Number(incomeLastMonthAmount)) }}₽</span></h1>
      <h1>Расходы: <span class="expenses">{{ format(store.expensesLastMonthAmount) }}₽</span></h1>
    </el-card>
    <el-card v-else>
      <el-skeleton animated/>
    </el-card>

    <el-card>
      <h2>Ваш заработок по месяцам</h2>
      <el-table :data="sortedEarnings" style="width: 100%">
        <el-table-column fixed prop="month" label="Месяц" width="120"/>
        <el-table-column prop="amount" label="Сумма" align="center"/>
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
                  <el-dropdown-item :icon="DeleteFilled" @click="deleteItem(scope.row.id)" style="color: red;">Delete
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

    <el-empty v-if="monthLabel.length === 0"/>
    <high-chart-earnings :months="monthLabel" :salaries="salaryValues" v-else/>
    <router-link :to="{name:'analytics-page'}">
      <el-button type="primary">Детальная аналитика</el-button>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {useFinanceStore} from '@/store';
import EarningsForm from "@/forms/EarningsForm.vue";
import HighChartEarnings from "../components/highCharts/HighChartEarnings.vue";
import {IEarnings, IMonths} from "../resources/types";
import {
  DocumentCopy,
  Edit,
  MoreFilled,
  DeleteFilled
} from '@element-plus/icons-vue'
import {ElMessage} from "element-plus";

const store = useFinanceStore()
const format = (balance: number) => {
  return balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

let lastMonth = new Date().getMonth()
if(lastMonth === 0){
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
        await store.updateEarningsAmount(currentEditItem.value.id, newAmount.value)

        await store.getUserEarnings()
        ElMessage.success('Сумма успешно обновлена!')
        editDialogVisible.value = false
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
  navigator.clipboard.writeText(`Месяц: ${row.month}, Заработок: ${format(row.amount)}`)
  ElMessage.success('Скопировано успешно!')
}
const deleteItem = async (id: string) => {
  await store.deleteEarningsItemData(id)
}

const monthLabel = computed(() => sortedEarnings.value.map((e: IEarnings) => e.month).reverse())
const salaryValues = computed(() => sortedEarnings.value.map((e: IEarnings) => e.amount).reverse())

onMounted(async () => {
  await store.nowNewYear()
  await store.incomeExpensesEarnings()
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