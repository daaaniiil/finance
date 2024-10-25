<template>
  <highcharts :options="chartOptions" />
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue';

export default defineComponent({
  name: 'EarningsChart',
  props: {
    months: {
      type: Array as () => string[],
      required: true
    },
    salaries: {
      type: Array as () => (number | null)[],
      required: true
    }
  },
  setup(props) {
    const chartOptions = computed(() => ({
      chart: {
        type: 'areaspline'
      },
      title: {
        text: 'Зарплата по месяцам'
      },
      plotOptions: {
        areaspline: {
          color: 'blue',
          fillColor: {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [
              [0, '#0000FFFF'],
              [1, 'rgba(50,94,205,0)']
            ]
          },
          threshold: null,
          marker: {
            lineWidth: 1,
            lineColor: null,
            fillColor: 'white'
          }
        }
      },
      xAxis: {
        categories: props.months,
        crosshair: true
      },
      yAxis: {
        title: {
          text: 'Сумма'
        }
      },
      tooltip: {
        valueSuffix: '₽'
      },
      series: [
        {
          name: 'Зарплата',
          data: props.salaries
        }
      ]
    }))

    return {
      chartOptions
    }
  }
})
</script>
