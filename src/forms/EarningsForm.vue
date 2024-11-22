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
            v-for="(month, index) in store.months"
            :key="index"
            :label="month.label"
            :value="month.label"
            :disabled="isMonthDisabled(month.label)"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="amount" label="Сумма">
        <el-input type="number" v-model.number="model.amount" placeholder="Введите сумму" />
      </el-form-item>
      <el-button @click="submitEarnings"  :loading="loading" type="primary">Сохранить</el-button>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import {computed, reactive, ref} from 'vue'
import {useFinanceStore} from "@/store";
import {ElForm, ElMessage, FormRules} from "element-plus";
import {IEarnings} from "../resources/types";

const store = useFinanceStore()
const loading = store.loading

const form = ref()

const model = reactive<IEarnings>({
  month: '',
  amount: null,
}  as any)
const rules = computed<FormRules>(() => {
  return {
    month: {required: true, trigger: 'blur',message:'Выберите месяц'},
    amount:{required: true, trigger: 'blur',message:'Введите сумму'}
  }
})

const submitEarnings = async () => {
  if(model.amount !== null) {
    if (model.amount <= 0) {
      ElMessage.warning('Введите положительную сумму')
    } else {
      await store.createUserDataEarnings(form, model)
    }
  } else {
    ElMessage.warning('Заполните форму')
  }
}

const labelPosition = computed(() => {
  return window.innerWidth < 378 ? 'top' : 'left'
})

const currentMonth = new Date().getMonth()

const isMonthDisabled = (monthLabel: string) => {
  const addedMonths: string[] = store.earnings.map((e: IEarnings) => e.month)
  const isMonthAdded: boolean = addedMonths.includes(monthLabel)

  const foundMonth = store.months.find(month => month.label === monthLabel)
  const isFutureMonth: boolean = foundMonth ? foundMonth.value > currentMonth : false

  return isMonthAdded || isFutureMonth
}

</script>