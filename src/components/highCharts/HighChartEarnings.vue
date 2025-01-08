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
    },
    title: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: false
    }
  },
  setup(props) {
    const currencyStore = useCurrencyStore()
    const chartOptions = computed(() => ({
      chart: {
        type: 'area',
      },
      title: {
        text: `${props.title}`
      },
      credits: {
        enabled: false
      },
      accessibility: {
        enabled: false
      },
      plotOptions: {
        area: {
          color: props.color || '',
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
