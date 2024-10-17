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
        <el-table :data="sortedExpenses">
          <el-table-column fixed prop="date" label="Дата" width="120"/>
          <el-table-column prop="category" label="Категория"/>
          <el-table-column prop="amount" label="Сумма"/>
          <el-table-column fixed="right" label="Действия">
            <template #default="scope">
              <el-dropdown trigger="click">
                <el-button class="el-dropdown-link">
                  Действия <i class="el-icon-arrow-down el-icon--right"></i>
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

    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import ExpensesForm from "@/forms/ExpensesForm.vue";
import {useFinanceStore} from "@/store";
import {DeleteFilled, DocumentCopy, Edit} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import {IExpenses} from "@/resources/types.ts";

const store = useFinanceStore()

const editDialogVisible = ref(false)

const format = (balance: number) => {
  return balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

const formatDate = (date: string) => {
  return new Date(date).toISOString().slice(0, 10).replace(/-/g, '.')
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
  if (currentEditItem.value && newAmount.value) {
    try {
      if (newAmount.value !== currentEditItem.value.amount) {
        await store.updateEarningsExpenses(currentEditItem.value.id, newAmount.value)

        await store.getUserExpenses()
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
  navigator.clipboard.writeText(`${row.date}: ${row.category} | ${format(row.amount)}`)
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

onMounted(async () => {
  await store.getUserExpenses()
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
}
</style>