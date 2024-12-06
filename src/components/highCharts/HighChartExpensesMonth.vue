<template>
  <highcharts :options="chartOptions"/>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue';
import {useCurrencyStore} from "../../store/currency";
import {useFinanceStore} from "../../store/index";
import {IMonths} from "../../resources/types";
import {IExpensesMonthAnalytics} from "../../resources/types";

export default defineComponent({
  name: 'ExpensesMonthChart',
  props: {
    expenses: {
      type: Array as () => IExpensesMonthAnalytics[],
      required: true
    },
    month: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const currencyStore = useCurrencyStore()
    const store = useFinanceStore()
    const currentMonth = props.month
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
        categories: props.expenses.map((e: IExpensesMonthAnalytics) => e.date),
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
        data: props.expenses.map((e: IExpensesMonthAnalytics) => e.amount),
        color: '#ef2b2b'
      }]
    }))

    return {
      chartOptions
    }
  }
})
</script>
