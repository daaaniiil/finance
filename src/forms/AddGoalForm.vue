<template>
  <el-dialog
      title="Добавить цель"
      v-model="visibleGoalForm"
      width="30%">
    <div class="form-add_goal">
      <el-form
          :label-position="labelPosition"
          ref="form"
          :rules="rules"
          :model="model"
          status-icon
          :disabled="loading"
          @submit.prevent>
        <el-form-item prop="name" label="Название">
          <el-input type="text" v-model.number="model.name" placeholder="Введите название" />
        </el-form-item>
        <el-form-item prop="targetAmount" label="Сумма">
          <el-input type="number" v-model.number="model.targetAmount" placeholder="Введите сумму" />
        </el-form-item>
        <el-form-item label="Дата" prop="deadline">
          <el-date-picker :disabled-date="disabledDate" v-model="model.deadline" placeholder="Выберите дату"/>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button type="warning" @click="visibleGoalForm = false">Отменить</el-button>
      <el-button type="primary" @click="addGoal">Сохранить</el-button>
    </template>
  </el-dialog>
  <el-button @click="openAddGoal" type="primary">Добавить цель</el-button>
</template>

<script setup lang="ts">
import {computed, reactive, ref} from 'vue'
import {useFinanceStore} from "../../src/store";
import {ElForm, ElMessage, FormRules} from "element-plus";
import {IGoal} from "../resources/types";

const visibleGoalForm = ref(false)

const store = useFinanceStore()
const loading = store.loading

const form = ref()

const model = reactive<IGoal>({
  name: '',
  targetAmount: '',
  deadline: null
}  as any)

const rules = computed<FormRules>(() => {
  return {
    name: {required: true, trigger: 'blur',message:'Введите название'},
    targetAmount: {required: true, trigger: 'blur',message:'Введите сумму'},
    deadline: {required: true, trigger: 'blur',message:'Введите дату'}
  }
})

const addGoal = async () => {
  if (model.targetAmount > 0) {
    await store.createUserGoal(form, model)
    visibleGoalForm.value = false
  } else {
    ElMessage.warning('Введите коректную сумму')
  }
}

const labelPosition = computed(() => {
  return window.innerWidth < 378 ? 'top' : 'left'
})

const disabledDate = (date: Date) => {
  const today = new Date()
  return date.getTime() < today.getTime()
}

const openAddGoal = () => {
  visibleGoalForm.value = true
}
</script>
