<template>
  <div class="finance-goals">
    <h2>{{ props.title }}</h2>
    <div class="goal-list">
      <el-card v-for="goal in goalsConverted" :key="goal.id">
        <div class="goal-list__title">
          <h3>{{ goal.name }}</h3>
          <el-button @click="hideGoal(goal.id)" v-if="visibleHidden && goal.status === 'completed' || goal.status === 'failed'" type="warning">
            Скрыть
          </el-button>
        </div>
        <p>Прогресс:
          <strong>{{ formatNumber(Number(goal.currentAmount)) }}{{ currencyStore.getIcon }}</strong> /
          <strong>{{ formatNumber(Number(goal.targetAmount)) }}{{ currencyStore.getIcon }}</strong>
        </p>
        <el-progress :percentage="percentageLeft(goal.currentAmount, goal.targetAmount)" :color="customColors"/>
        <p v-if="goal.status === 'completed'"> Цель достигнута: {{ formatDate(goal.deadline) }}</p>

        <p v-else-if="goal.status === 'in_progress'">
          Осталось:
          <template v-if="timeLeft(goal.deadline).days > 0">
            {{ timeLeft(goal.deadline).days }} {{ timeLeft(goal.deadline).days > 4 ? 'дней' : 'дня' }}
            {{ timeLeft(goal.deadline).hours }} {{ timeLeft(goal.deadline).hours > 4 ? 'часов' : 'часа' }}
          </template>
          <template v-else>
            {{ timeLeft(goal.deadline).hours }} {{ timeLeft(goal.deadline).hours > 4 ? 'часов' : 'часа' }}
          </template>
        </p>

        <div v-if="goal.status === 'in_progress'">
          <el-input v-model.number="amountToAdd[goal.id]" placeholder="Сумма для пополнения"/>
          <el-button type="warning" @click="addToGoal(goal.id, goal.targetAmount, goal.currentAmount, goal.status)">
            Пополнить
          </el-button>
        </div>

        <p v-if="goal.status === 'completed'" class="status success">Цель достигнута!</p>
        <p v-if="goal.status === 'failed'" class="status error">Цель провалена</p>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue'
import {DateTime} from 'luxon'
import {IGoal} from "../resources/types";
import {useFinanceStore} from "@/store";
import {ElMessage} from "element-plus";
import {useCurrencyStore} from "@/store/currency.ts";

const props = defineProps<{
  goals: IGoal[],
  title: string,
  visibleHidden: boolean
}>()

const store = useFinanceStore()
const currencyStore = useCurrencyStore()
const amountToAdd = ref<Record<string, number>>({})

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('ru-RU').format(value)
}
const formatDate = (date: string | Date) => {
  return new Date(date).toISOString().slice(0, 10).split('-').reverse().join('.')
}

const customColors = [
  {color: '#909399', percentage: 20},
  {color: '#f56c6c', percentage: 30},
  {color: '#e6a23c', percentage: 50},
  {color: '#1989fa', percentage: 70},
  {color: '#6f7ad3', percentage: 90},
  {color: '#5cb87a', percentage: 100},
]

const addToGoal = async (goalId: string, targetAmount: number, currentAmount: number, status: string) => {
  const amount = ref<number>(amountToAdd.value[goalId] || 0)
  if (amount.value > 0) {
    if (store.budget >= amount.value && targetAmount >= (currentAmount + amount.value)) {
      amount.value *= currencyStore.getRate
      if (targetAmount === (currentAmount + amount.value)) {
        ElMessage.success('Поздравляем, Цель завершена!')
      } else {
        ElMessage.success('Цель успешно пополнена')
      }
      await store.updateBudget(amount.value)
      await store.updateUserGoal(goalId, amount.value, status)
      await store.updateGoalStatus()
      amountToAdd.value[goalId] = 0
    } else {
      ElMessage.warning('Вы ввели не верную сумму или у вас не хватает средств')
    }
  } else {
    ElMessage.warning('Введите сумму')
  }
}

const sortedGoals = computed(() => {
  return [...props.goals].sort((a, b) => a.id.localeCompare(b.id))
})

const timeLeft = (deadline: Date | string) => {
  const now = DateTime.now().setZone('Europe/Moscow')
  const deadlineDate = DateTime.fromISO(deadline.toString()).setZone('Europe/Moscow')

  const diff = deadlineDate.diff(now, ['days', 'hours', 'minutes', 'seconds'])

  return {
    days: diff.days,
    hours: diff.hours,
    minutes: diff.minutes,
    seconds: diff.seconds
  }
}

const percentageLeft = (current: number, target: number) => {
  return Number(((current / target) * 100).toFixed(2))
}

const goalsConverted = computed(() => {
  return sortedGoals.value.map((g: IGoal) => ({
    ...g,
    currentAmount: Math.floor((g.currentAmount ?? 0) / currencyStore.getRate),
    targetAmount: Math.floor((g.targetAmount ?? 0) / currencyStore.getRate)
  }))
})

const hideGoal = async (goalId: string) => {
  store.hideGoal(goalId)
  await store.getUserGoals()
}

</script>

<style lang="scss">
@use '../styles/variable.scss' as *;

.finance-goals {
  padding: 1rem;

  .goal-list {
    &__title {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .el-button--warning {
        color: $color_text;
        background-color: $color_white_text;
        border: 1px solid $color_border_gray;
        transition: 0.15s linear all;
        &:hover {
          color: $color_red_main;
          background-color: $color_red_background;
          border: 1px solid $color_red_empty;
        }
      }
    }
  }

  h3 {
    margin-bottom: $padding;
  }

  p {
    padding: $padding - 10 0;
  }

  .el-input {
    padding: $padding - 5 0;
  }

  .el-countdown {
    font-size: $size + 4;
    color: #333;
  }

  .status {
    padding: $padding 0 0;
  }

  .status.success {
    color: green
  }

  .status.error {
    color: red
  }
}
</style>