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
          type: 'column'
        },
        title: {
          text: 'Доходы и расходы 2024',
          align: 'left'
        },
        xAxis: {
          categories: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Нояб', 'Дек'],
          crosshair: true,
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Money'
          }
        },
        tooltip: {
          valueSuffix: 'p'
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0,
            borderRadius: 5
          }
        },
        series: [
          {
            name: 'Доходы',
            data: [20000, 18000, 23000, 29000, 25000, 31000, 37000, 33000, 39000, 42000, 38000, 37000]
          },
          {
            name: 'Расходы',
            data: [80000, 84000, 73000, 87000, 94000, 83000, 65000, 70000, 64000, 72200, 64000, 59000]
          }
        ]
      }
    }
  }
})
</script>
