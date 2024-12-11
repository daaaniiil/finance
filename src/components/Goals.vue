<template>
  <div class="finance-goals">
    <h2>Ваши финансовые цели</h2>
    <div class="goal-list">
      <el-card v-for="goal in props.goals" :key="goal.id">
        <h3>{{ goal.name }}</h3>
        <p>Прогресс: {{ goal.currentAmount }} / {{ goal.targetAmount }}</p>
        <el-progress :percentage="percentageLeft(goal.currentAmount, goal.targetAmount)" :color="customColors" />
        <p>Осталось: {{ daysLeft(goal.deadline) }} дней</p>

        <el-input v-model.number="amountToAdd" placeholder="Сумма для пополнения"/>
        <el-button type="warning" @click="addToGoal(goal.id)">Пополнить</el-button>

        <p v-if="goal.status === 'completed'" class="status success">Цель достигнута!</p>
        <p v-if="goal.status === 'failed'" class="status error">Цель провалена</p>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {IGoal} from "../resources/types";

const props = defineProps<{
  goals: IGoal[]
}>()


const amountToAdd = ref<number>(0)

const customColors = [
  { color: '#909399', percentage: 20 },
  { color: '#f56c6c', percentage: 30 },
  { color: '#e6a23c', percentage: 50 },
  { color: '#1989fa', percentage: 70 },
  { color: '#6f7ad3', percentage: 90 },
  { color: '#5cb87a', percentage: 100 },
]

const addToGoal = (goalId: string) => {
  console.log(`Добавлено ${amountToAdd.value} руб. к цели`)
}

const daysLeft = (deadline: Date) => {
  const today = new Date()
  const diffTime = Number(new Date(deadline)) - Number(today)
  return Math.ceil(diffTime / (60 * 60 * 24 * 1000))
}

const percentageLeft = (current: number, target: number) => {
  return Number(((current / target) * 100).toFixed(2))
}
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