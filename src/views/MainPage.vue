<template>
  <div class="main-page">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'main-page' }">Главная</el-breadcrumb-item>
      <el-breadcrumb-item>Доходы & Расходы</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card v-if="!store.loading">
      <h2>Прошлый месяц «<span>{{ availableMonths }}</span>»</h2>
      <hr>
      <h1>Заработок: {{ format(Number(earningsLastMonth)) }}₽</h1>
      <h1>Доход: <span class="income">{{ format(15000) }}₽</span></h1>
      <h1>Расходы: <span class="expenses">{{ format(50000) }}₽</span></h1>
    </el-card>
    <el-card v-else>
      <el-skeleton animated/>
    </el-card>

    <el-card>
      <h2>Ваш заработок по месяцам</h2>
      <el-table :data="sortedEarnings" style="width: 100%">
        <el-table-column prop="month" label="Месяц"></el-table-column>
        <el-table-column prop="amount" label="Сумма"></el-table-column>
        <el-table-column label="Действия">
          <template #default="scope">
            <el-dropdown trigger="click">
              <el-button class="el-dropdown-link">
                Действия <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :icon="Edit" @click="openEditDialog(scope.row)">Edit</el-dropdown-item>
                  <el-dropdown-item :icon="DocumentCopy" @click="copyToClipboard(scope.row)">Copy</el-dropdown-item>
                  <el-dropdown-item :icon="DeleteFilled" @click="deleteItem(scope.row.id)" style="color: red;">Delete</el-dropdown-item>
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
      <add-earnings/>
    </el-card>

    <high-chart-earnings :months="monthLabel" :salaries="salaryValues" />
    <router-link :to="{name:'analytics-page'}">
      <el-button type="primary">Детальная аналитика</el-button>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {useFinanceStore} from "@/store";
import AddEarnings from "@/forms/AddEarnings.vue";
import HighChartEarnings from "@/components/HighCharts/HighChartEarnings.vue";
import {IEarnings} from "@/resources/types.ts";
import {
  DocumentCopy,
  Edit,
  DeleteFilled
} from '@element-plus/icons-vue'
import {ElMessage} from "element-plus";

const store = useFinanceStore()
const format = (balance: number) => {
  return balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

const lastMonth = new Date().getMonth() - 1

const months = [
  {label: 'Январь', value: 0},
  {label: 'Февраль', value: 1},
  {label: 'Март', value: 2},
  {label: 'Апрель', value: 3},
  {label: 'Май', value: 4},
  {label: 'Июнь', value: 5},
  {label: 'Июль', value: 6},
  {label: 'Август', value: 7},
  {label: 'Сентябрь', value: 8},
  {label: 'Октябрь', value: 9},
  {label: 'Ноябрь', value: 10},
  {label: 'Декабрь', value: 11},
]

const availableMonths = months.find(month => month.value === lastMonth)?.label

const earningsLastMonth = computed(() => {
  return store.earnings.find((e: IEarnings) => e.month === availableMonths)?.amount || 0
})

const sortedEarnings = computed(() => {
  return store.earnings.slice().sort((a: IEarnings, b: IEarnings) => {
    const monthA = months.findIndex(month => month.label === a.month)
    const monthB = months.findIndex(month => month.label === b.month)
    return monthB - monthA
  })
})


const editDialogVisible = ref<boolean>(false)
const currentEditItem = ref<IEarnings>({})
const newAmount = ref<number | string | null>(null)

const openEditDialog = (row: IEarnings) => {
  currentEditItem.value = {...row}
  newAmount.value = row.amount
  editDialogVisible.value = true
}

const saveAmount = async () => {
  if(currentEditItem.value && newAmount.value !== ''){
    try {
      if(newAmount.value !== currentEditItem.value.amount){
        const {error} = await store.updateEarningsAmount(currentEditItem.value.id, newAmount.value)

        if(error){
          ElMessage.error('Ошибка:', error)
        } else {
          await store.getUserData()
          ElMessage.success('Сумма успешно обновлена!')
          editDialogVisible.value = false
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
  navigator.clipboard.writeText(`Месяц: ${row.month}, Заработок: ${format(row.amount)}`)
  ElMessage.success('Скопировано успешно!')
}
const deleteItem = async (id: string) => {
  await store.deleteEarningsItemData(id)
}

const monthLabel = computed(() => sortedEarnings.value.map((e: IEarnings) => e.month).reverse())
const salaryValues = computed(() => sortedEarnings.value.map((e: IEarnings) => e.amount).reverse())

onMounted(async () => {
  await store.getUserData()
  await store.nowNewYear()
})
</script>

<style lang="scss">
@use '../styles/variable.scss' as *;

.main-page {
  .el-card {
    margin: $padding_main 0;
  }

  .el-dropdown-link {
    background: none;
    border: none;
    cursor: pointer;
    color: $color_main_green;
  }

  .el-dialog {
    p {
      margin-bottom: $padding;
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
  }
}
</style>