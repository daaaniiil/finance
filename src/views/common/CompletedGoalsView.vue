<template>
  <div class="complete-goals">
    <Goals :goals="completedGoals" v-if="completedGoals.length" :visible-hidden="false" title="Ваши завершенные цели"/>
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