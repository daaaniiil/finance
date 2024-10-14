<template>
  <div class="form-add_earnings">
    <el-form
        :label-position="labelPosition"
        ref="form"
        :rules="rules"
        :model="model"
        status-icon
        :disabled="loading"
        @submit.prevent>
      <el-form-item prop="month" label="Месяц">
        <el-select v-model="model.month" placeholder="Выберите месяц">
          <el-option
            v-for="(month, index) in months"
            :key="index"
            :label="month.label"
            :value="month.label"
            :disabled="isMonthDisabled(month.label)"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="amount" label="Сумма">
        <el-input v-model.number="model.amount" placeholder="Введите сумму" />
      </el-form-item>
      <el-button @click="submitEarnings"  :loading="loading" type="primary">Сохранить</el-button>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import {computed, reactive, ref} from 'vue'
import {useFinanceStore} from "@/store";
import {FormRules} from "element-plus";
import {TInstanceForm} from "@/resources/auth";
import {IEarnings} from "@/resources/types.ts";

const store = useFinanceStore()
const loading = store.loading

const form = ref<TInstanceForm>()

const model = reactive<IEarnings>({
  month: '',
  amount: null,
}  as any)
const rules = computed<FormRules>(() => {
  return {
    month: {required: true, trigger: 'blur',message:'Ввыберите месяц'},
    amount:{required: true, trigger: 'blur',message:'Введите сумму'}
  }
})

const submitEarnings = async () => {
  await store.createUserData(form, model)
}

const labelPosition = computed(() => {
  return window.innerWidth < 378 ? 'top' : 'left'
})

const currentMonth = new Date().getMonth()

const months = [
  { label: 'Январь', value: 0 },
  { label: 'Февраль', value: 1 },
  { label: 'Март', value: 2 },
  { label: 'Апрель', value: 3 },
  { label: 'Май', value: 4 },
  { label: 'Июнь', value: 5 },
  { label: 'Июль', value: 6 },
  { label: 'Август', value: 7 },
  { label: 'Сентябрь', value: 8 },
  { label: 'Октябрь', value: 9 },
  { label: 'Ноябрь', value: 10 },
  { label: 'Декабрь', value: 11 },
]

const isMonthDisabled = (monthLabel: string) => {
  const addedMonths: string[] = store.earnings.map((e: IEarnings) => e.month)
  const isMonthAdded: boolean = addedMonths.includes(monthLabel)

  const foundMonth = months.find(month => month.label === monthLabel)
  const isFutureMonth: boolean = foundMonth ? foundMonth.value > currentMonth : false

  return isMonthAdded || isFutureMonth
}

</script>