<template>
  <highcharts :options="chartOptions"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      chartOptions: {
        chart: {
          type: 'line'
        },
        title: {
          text: 'Доходы и расходы'
        },
        xAxis: {
          categories: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Нояб', 'Дек'],
          crosshair: true,
        },
        tooltip: {
          valueSuffix: 'p'
        },
        series: [
          {
            name: 'Доходы',
            data: [15000, 17000, 19000, 22000, 25000, 28000]
          },
          {
            name: 'Расходы',
            data: [50000, 45000, 47000, 42000, 39000, 44000]
          }
        ]
      }
    }
  }
})
</script>
