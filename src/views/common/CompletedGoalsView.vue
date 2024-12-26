<template>
  <div class="complete-goals">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'completed-goals-page' }">Цели</el-breadcrumb-item>
      <el-breadcrumb-item>Настройки</el-breadcrumb-item>
    </el-breadcrumb>
    <Goals :goals="completedGoals" v-if="completedGoals.length" :visible-hidden="false" title="Ваши завершенные цели"/>
    <Goals :goals="failedGoals" v-if="failedGoals.length" :visible-hidden="false" title="Ваши проваленные цели"/>
    <el-empty description="У вас пока нет завершенных целей" v-else/>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted} from "vue";
import Goals from "@/components/Goals.vue";
import {useFinanceStore} from "@/store";
import {IGoal} from "@/resources/types.ts";

const store = useFinanceStore()
const completedGoals = computed(() => store.goals.filter((goal: IGoal) => goal.status === 'completed'))
const failedGoals = computed(() => store.goals.filter((goal: IGoal) => goal.status === 'failed'))

onMounted(async () => {
  await store.getUserEarnings()
  await store.getUserExpenses()
  await store.getUserGoals()
  await store.currentBudget()
  await store.updateGoalStatus()
})
</script>

<style lang="scss">
.complete-goals {
  .el-empty {
    height: 500px;
  }
}
</style>