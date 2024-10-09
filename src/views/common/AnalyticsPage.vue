<template>
  <div class="transaction-page">
    <h1>Страница аналитики</h1>
    <HighChartComponent />
  </div>
</template>

<script>

import {defineComponent} from "vue";
import HighChartComponent from "@/components/highCharts/HighChartComponent.vue";

export default defineComponent({
  components: {HighChartComponent}
})
</script>

<style lang="scss">

</style>