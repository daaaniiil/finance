<template>
  <div class="transaction-page">
    <h1>Страница транзакций</h1>
    <HighChartComponent />
  </div>
</template>

<script>

import {defineComponent} from "vue";
import HighChartComponent from "@/components/HighChartComponent.vue";

export default defineComponent({
  components: {HighChartComponent}
})
</script>

<style lang="scss">

</style>