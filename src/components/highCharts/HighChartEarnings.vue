<template>
  <highcharts :options="chartOptions"/>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue';
import {useCurrencyStore} from "@/store/currency.ts";

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
    const currencyStore = useCurrencyStore()
    const chartOptions = computed(() => ({
      chart: {
        type: 'area',
      },
      title: {
        text: 'Зарплата по месяцам'
      },
      credits: {
        enabled: false
      },
      accessibility: {
        enabled: false
      },
      plotOptions: {
        area: {
          // color: 'blue',
          // fillColor: {
          //   linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          //   stops: [
          //     [0, '#0000FFFF'],
          //     [1, 'rgba(50,94,205,0)']
          //   ]
          // },
          stacking: 'normal',
          threshold: null,
          marker: {
            lineWidth: 1,
            lineColor: 'white'
          }
        }
      },
      legend: {
        enabled: false
      },
      xAxis: {
        categories: props.months,
        crosshair: true
      },
      yAxis: {
        title: {
          text: `Сумма (${currencyStore.selectedCurrency})`
        },
        labels: {
          format: `{value} ${currencyStore.getIcon}`
        }
      },
      tooltip: {
        valueSuffix: `${currencyStore.getIcon}`
      },
      series: [{
        marker: {
          enabled: false
        },
        name: 'Зарплата',
        data: props.salaries.map((value: number | null) => Math.floor((value ?? 0) / currencyStore.getRate))
      }]
    }))

    return {
      chartOptions
    }
  }
})
</script>
