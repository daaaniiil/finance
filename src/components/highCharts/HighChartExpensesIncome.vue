<template>
  <highcharts :options="chartOptions"/>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import {useCurrencyStore} from "@/store/currency.ts";

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
    const currencyStore = useCurrencyStore()
    const year = new Date().getFullYear()
    const chartOptions = computed(() => ({
      chart: {
        type: 'area'
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
          text: `Сумма (${currencyStore.selectedCurrency})`
        }
      },
      plotOptions:{
        area: {

        }
      },
      tooltip: {
        valueSuffix: `${currencyStore.getIcon}`
      },
      series: [
        {
          name: 'Доходы',
          data: props.income.map((value: number | null) => Math.floor((value ?? 0) / currencyStore.getRate)),
          color: '#30CA2C'
        },
        {
          name: 'Расходы',
          data: props.expenses.map((value: number | null) => Math.floor((value ?? 0) / currencyStore.getRate)),
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
