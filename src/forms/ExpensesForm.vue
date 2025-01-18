<template>
  <div class="expenses-form">
    <el-form
        ref="form"
        :label-position="labelPosition"
        :rules="rules"
        :model="model"
        status-icon
        :disabled="loading"
        @submit.prevent>
      <el-form-item label="Категория" prop="category">
        <el-select v-model="model.category" placeholder="Выберите категорию">
          <el-option
              v-for="(category, index) in expenseCategories"
              :key="index"
              :label="category"
              :value="category"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Сумма" prop="amount">
        <el-input v-model="model.amount" type="number" placeholder="Введите сумму"/>
      </el-form-item>

      <el-form-item label="Дата" prop="date">
        <el-date-picker :disabled-date="disabledDate" v-model="model.date" placeholder="Выберите дату"/>
      </el-form-item>

      <el-button type="primary" @click="submitExpenses" :loading="loading">Сохранить</el-button>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import {computed, reactive, ref} from "vue";
import {useFinanceStore} from "@/store";
import {IEarnings, IExpenses, IMonths} from "@/resources/types.ts";
import {ElMessage, FormRules} from "element-plus";

const store = useFinanceStore()
const loading = store.loading

const form = ref()

const model = reactive<IExpenses>({
  category: '',
  amount: null,
  date: ''
} as any)
const rules = computed<FormRules>(() => {
  return {
    category: {required: true, trigger: 'blur', message: 'Выберите категорию'},
    amount: {required: true, trigger: 'blur', message: 'Введите сумму'},
    date: {required: true, trigger: 'blur', message: 'Выберите дату'}
  }
})

const monthLabel = computed(() => store.earnings.map((e: IEarnings) => e.month))

const submitExpenses = async () => {
  if (model.date) {
    const selectedDate = new Date(model.date)
    const selectedMonth = selectedDate.getMonth() + 1
    const selectedYear = selectedDate.getFullYear()

    model.date = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`

    const availableMonthLabel = store.months.find((month: IMonths) => month.value === selectedMonth - 1)?.label

    if (availableMonthLabel && monthLabel.value.includes(availableMonthLabel)) {

      const monthExpenses = store.expenses
          .filter((expense: IExpenses) => {
            const expenseDate = new Date(expense.date)
            return expenseDate.getMonth() + 1 === selectedMonth && expenseDate.getFullYear() === selectedYear
          })
          .reduce((acc: number, expense: IExpenses) => acc + (expense.amount || 0), 0)

      const monthEarnings = store.earnings
          .find((earning: IEarnings) => earning.month === availableMonthLabel)?.amount || 0

      if (monthExpenses + Number(model.amount) > monthEarnings) {
        ElMessage.warning('У вас не достаточно средств в выбранном месяце')
      } else {
        if(model.amount !== null) {
          if (model.amount <= 0) {
            ElMessage.warning('Введите положительную сумму')
          } else {
            await store.createUserDataExpenses(form, model)
            await store.changeBudget()
          }
        } else {
            ElMessage.warning('Заполните форму')
        }
      }
    } else {
      ElMessage.warning('Вы не получили заработок в этом месяце')
    }
  } else {
    ElMessage.warning('Заполните форму')
  }
}

const labelPosition = computed(() => {
  return window.innerWidth < 378 ? 'top' : 'left'
})

const disabledDate = (date: Date) => {
  const today = new Date()
  return date.getTime() > today.getTime()
}

const expenseCategories = [
  'Дом',
  'Образование',
  'Одежда',
  'Авто',
  'Продукты',
  'Транспорт',
  'Здоровье',
  'Красота',
  'Развлечения',
  'Спорт',
  'Перевод',
  'Подписки',
  'Телефон',
  'Коммунальные услуги',
  'Кафе и рестораны',
  'Путешествия и отпуск',
  'Кредитные выплаты',
  'Подарки и благотворительность',
  'Хобби и увлечения',
  'Техника и электроника',
  'Игры и приложения',
  'Ремонт техники и гаджетов',
  'Такси и аренда авто',
  'Семейные мероприятия',
  'Парковка и штрафы',
  'Прочие расходы'
]
</script>

<style lang="scss">

</style>