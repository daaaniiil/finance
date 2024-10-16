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
        type: 'line'
      },
      title: {
        text: 'Зарплата по месяцам'
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
