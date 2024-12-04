<template>
  <highcharts :options="chartOptions"/>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue';
import {useCurrencyStore} from "../../store/currency";
import {useFinanceStore} from "../../store/index";
import {IMonths} from "../../resources/types";

export default defineComponent({
  name: 'ExpensesMonthChart',
  props: {
    expenses: {
      type: Array as () => number[],
      required: true
    }
  },
  setup(props) {
    const currencyStore = useCurrencyStore()
    const store = useFinanceStore()
    const currentMonth = new Date().getMonth()
    const currentMonthName = store.months.find((m: IMonths) => m.value == currentMonth)?.label
    const chartOptions = computed(() => ({
      chart: {
        type: 'area',
      },
      title: {
        text: `Расходы ${currentMonthName}`
      },
      credits: {
        enabled: false
      },
      accessibility: {
        enabled: false
      },
      plotOptions: {
        area: {
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
        categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
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
        valueSuffix: `${currencyStore.getIcon}`,
        shared: true,
        headerFormat: '<b>День {point.x}</b><br>'
      },
      series: [{
        marker: {
          enabled: false
        },
        name: 'Расходы',
        data: props.expenses.map((value: number) => Math.floor((value ?? 0) / currencyStore.getRate)),
        color: '#ef2b2b'
      }]
    }))

    return {
      chartOptions
    }
  }
})
</script>
