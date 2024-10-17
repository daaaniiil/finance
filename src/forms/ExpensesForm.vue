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

      <el-form-item>
        <el-button type="primary" @click="submitExpenses" :loading="loading">Сохранить</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import {computed, reactive, ref} from "vue";
import {useFinanceStore} from "@/store";
import {IExpenses} from "@/resources/types.ts";
import {FormRules} from "element-plus";

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

const submitExpenses = async () => {
  if (model.date) {
    const selectedDate = new Date(model.date)

    const year = selectedDate.getFullYear()
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
    const day = String(selectedDate.getDate()).padStart(2, '0')

    model.date = `${year}-${month}-${day}`
  }
  await store.createUserDataExpenses(form, model)
}

const labelPosition = computed(() => {
  return window.innerWidth < 378 ? 'top' : 'left'
})

const disabledDate = (date: Date) => {
  const today = new Date()
  return date.getTime() > today.getTime()
}

const expenseCategories = [
  'Продукты питания',
  'Транспорт',
  'Жилищные расходы (аренда, ипотека)',
  'Коммунальные услуги (свет, вода, газ)',
  'Интернет и телефон',
  'Развлечения',
  'Спорт и фитнес',
  'Одежда и обувь',
  'Образование (курсы, книги)',
  'Здоровье (лекарства, лечение)',
  'Кафе и рестораны',
  'Путешествия и отпуск',
  'Косметика и личная гигиена',
  'Кредитные выплаты',
  'Автозапчасти и обслуживание автомобиля',
  'Страхование (авто, жизнь)',
  'Подарки и благотворительность',
  'Домашние животные (корм, ветеринар)',
  'Хобби и увлечения',
  'Сбережения и инвестиции',
  'Прочие расходы'
]
</script>

<style lang="scss">

</style>