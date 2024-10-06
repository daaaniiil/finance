<template>
  <div>
    <highcharts :options="chartOptions"></highcharts>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      chartOptions: {
        chart: {
          type: 'pie', // 'line', 'bar', 'column', 'scatter', 'area'
        },
        title: {
          text: 'Browser market shares in January, 2018',
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        accessibility: {
          point: {
            valueSuffix: '%'
          },
          enabled: false
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            dataLabels: {
              enabled: false
            },
            showInLegend: true
          }
        },
        series: [{
          name: 'Browsers',
          colorByPoint: true,
          data: [
            { name: 'Chrome', y: 61.41 },
            { name: 'Internet Explorer', y: 11.84 },
            { name: 'Firefox', y: 10.85 },
            { name: 'Edge', y: 4.67 },
            { name: 'Safari', y: 4.18 },
            { name: 'Other', y: 7.05 },
          ],
        }],
      },
    }
  },
})
</script>
