<template>
  <div class="finance-goals">
    <h2>Ваши финансовые цели</h2>
    <div class="goal-list">
      <el-card v-for="goal in goalsConverted" :key="goal.id">
        <h3>{{ goal.name }}</h3>
        <p>Прогресс: <strong>{{ formatNumber(Number(goal.currentAmount)) }}{{currencyStore.getIcon}}</strong> /
          <strong>{{ formatNumber(Number(goal.targetAmount)) }}{{currencyStore.getIcon}}</strong></p>
        <el-progress :percentage="percentageLeft(goal.currentAmount, goal.targetAmount)" :color="customColors" />
        <p>Осталось: {{ daysLeft(goal.deadline) }} дней</p>

        <el-input v-model.number="amountToAdd[goal.id]" placeholder="Сумма для пополнения"/>
        <el-button type="warning" @click="addToGoal(goal.id)">Пополнить</el-button>

        <p v-if="goal.status === 'completed'" class="status success">Цель достигнута!</p>
        <p v-if="goal.status === 'failed'" class="status error">Цель провалена</p>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue'
import { IGoal} from "../resources/types";
import {useFinanceStore} from "@/store";
import {ElMessage} from "element-plus";
import {useCurrencyStore} from "@/store/currency.ts";

const props = defineProps<{
  goals: IGoal[]
}>()

const store = useFinanceStore()
const currencyStore = useCurrencyStore()
const amountToAdd = ref<Record<string, number>>({})

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('ru-RU').format(value)
}

const customColors = [
  { color: '#909399', percentage: 20 },
  { color: '#f56c6c', percentage: 30 },
  { color: '#e6a23c', percentage: 50 },
  { color: '#1989fa', percentage: 70 },
  { color: '#6f7ad3', percentage: 90 },
  { color: '#5cb87a', percentage: 100 },
]

const addToGoal = async (goalId: string) => {
  const amount = ref<number>(amountToAdd.value[goalId] || 0)
  if (amount.value > 0) {
    // при полном завершение суммы менять статус на completed
    // при истечение срока и не завершение суммы менять статус на failed
      if(store.budget) {
        amount.value *= currencyStore.getRate
        await store.updateBudget(amount.value)
        await store.updateUserGoal(goalId, amount.value)
        ElMessage.success('Цель успешно пополнена')
        amountToAdd.value[goalId] = 0
      }
  } else {
    ElMessage.warning('Введите сумму')
  }
}

const sortedGoals = computed(() => {
  return [...props.goals].sort((a,b) => a.id.localeCompare(b.id))
})

const daysLeft = (deadline: Date) => {
  const today = new Date()
  const diffTime = Number(new Date(deadline)) - Number(today)
  return Math.ceil(diffTime / (60 * 60 * 24 * 1000))
}

const percentageLeft = (current: number, target: number) => {
  return Number(((current / target) * 100).toFixed(2))
}

const goalsConverted = computed(() => {
  return sortedGoals.value.map((g: IGoal) => ({
    ...g,
    currentAmount: Math.floor((g.currentAmount ?? 0) / currencyStore.getRate),
    targetAmount:  Math.floor((g.targetAmount ?? 0) / currencyStore.getRate)
  }))
})
</script>

<style lang="scss">
@use '../styles/variable.scss' as *;

.finance-goals {
  padding: 1rem;
  h3 {
    margin-bottom: $padding;
  }

  p {
    padding: $padding - 10 0;
  }

  .el-input {
    padding: $padding - 5 0;
  }

  .status {
    padding: $padding 0 0;
  }
  .status.success{
    color: green
  }
  .status.error{
    color: red
  }
}
</style>