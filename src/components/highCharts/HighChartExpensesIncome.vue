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
    const chartOptions = computed(() => ({
      chart: {
        type: 'line'
      },
      title: {
        text: 'Доходы и расходы'
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
          data: props.income
        },
        {
          name: 'Расходы',
          data: props.expenses
        }
      ]
    }))

    return {
      chartOptions
    }
  }
})
</script>
