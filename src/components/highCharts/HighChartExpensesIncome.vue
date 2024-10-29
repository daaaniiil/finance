<template>
  <highcharts :options="chartOptions"/>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  props: {
    months: {
      type: Array as () => string[],
      required: true
    },
    income: {
      type: Array as () => (number | null)[],
      required: true
    },
    expenses: {
      type: Array as () => (number | null)[],
      required: true
    }
  },
  setup(props) {
    const year = new Date().getFullYear()
    const chartOptions = computed(() => ({
      chart: {
        type: 'line'
      },
      title: {
        text: `Доходы и расходы ${year}`
      },
      accessibility: {
        enabled: false
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
          name: 'Доходы',
          data: props.income,
          color: '#30CA2C'
        },
        {
          name: 'Расходы',
          data: props.expenses,
          color: '#ef2b2b'
        }
      ]
    }))

    return {
      chartOptions
    }
  }
})
</script>
