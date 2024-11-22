<template>
  <div>
    <highcharts id="container" :options="chartOptions"></highcharts>
  </div>
</template>

<script>
import {defineComponent, watch,ref, computed, nextTick} from 'vue';
import {useCurrencyStore} from "@/store/currency";
import Highcharts from 'highcharts'

export default defineComponent({
  props: {
    expenses: {
      type: Array,
      required: true
    },
    amount: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const year =  new Date().getFullYear()
    const currencyStore = useCurrencyStore()
    const formatNumber = (value) => {
      return new Intl.NumberFormat('ru-RU').format(value)
    }
    const formattedSubTitle = () => {
      if (currencyStore.getIcon === '₽') {
        return 'Рубль'
      }else if(currencyStore.getIcon === '$') {
        return 'Доллар'
      } else if(currencyStore.getIcon === 'Br') {
        return 'Бел.рубль'
      }
    }

    const colors = [
        '#4caf50','#ff9800','#f44336', '#2196f3',
      '#9c27b0','#ffc107','#8bc34a', '#00bcd4',
      '#e91e63','#673ab7', '#795548', '#d32f00',
      '#22cbff','#ff9822','#ff2222','#3fff22',
      '#00789b','#860494','#9b0214','#ff60b7',
      '#958dff','#0035bb','#28b900','#b46c00',
      '#adff84','#fc6464']

    const dynamicAmount = ref(props.amount)

    const updateAmount = (chart) => {
      dynamicAmount.value = chart.series[0].data
          .filter((point) => point.visible)
          .reduce((sum, point) => sum + point.y, 0)

      chart.options.chart.custom.label.attr({
        text: `Сумма<br/><strong>${formatNumber(dynamicAmount.value)}</strong>`
      })
    }

    const chartOptions = computed(() => ({
      chart: {
        type: 'pie',
        custom: {},
        events: {
          render() {
            const chart = this,
                series = chart.series[0];
            let customLabel = chart.options.chart.custom.label;

            if (!customLabel) {
              customLabel = chart.options.chart.custom.label =
                  chart.renderer.label('Сумма<br/>' + `<strong>${formatNumber(dynamicAmount.value)}</strong>`)
                      .css({
                        color: '#000',
                        textAnchor: 'middle'
                      }).add();
            }

            const x = series.center[0] + chart.plotLeft,
                y = series.center[1] + chart.plotTop -
                    (customLabel.attr('height') / 2);

            customLabel.attr({x, y});
            customLabel.css({
              fontSize: `${series.center[2] / 12}px`
            });
          },
          redraw() {
            updateAmount(this)
          },
        }
      },
      title: {
        text: `Расходы ${year}`
      },
      credits: {
        enabled: false
      },
      subtitle: {
        text: `Формат: ${formattedSubTitle()}`
      },
      tooltip: {
        valueSuffix: `${currencyStore.getIcon}`,
      },
      legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'bottom',
        itemMarginBottom: 5,
        maxHeight: 150,
        symbolHeight: 10,
        navigation: {
          activeColor: '#3E576F',
          animation: true,
          arrowSize: 12,
          inactiveColor: '#CCC',
          style: {
            fontWeight: 'bold',
            color: '#333',
            fontSize: '12px'
          }
        },
        symbolPadding: 5,
        borderWidth: 1,
        backgroundColor: '#FFFFFF',
      },
      plotOptions: {
        series: {
          allowPointSelect: true,
          cursor: 'pointer',
          borderRadius: 8,
          dataLabels: [{
            enabled: false,
            distance: 20,
            format: '{point.name}'
          }, {
            enabled: true,
            distance: -18,
            format: '{point.percentage:.0f}%',
            style: {
              fontSize: '0.65em'
            }
          }],
          showInLegend: true
        }
      },
      series: [{
        type: 'pie',
        name: 'Расходы',
        colorByPoint: true,
        innerSize: '75%',
        data: props.expenses.map((e, index) => ({
          ...e,
          color: colors[index % colors.length]
        }))
      }]
    }))

    watch(() => props.amount, (newAmount) => {
      if(newAmount > 0) {
        nextTick(() => {
          const chart = Highcharts.charts.find((chart) => chart.renderTo.id === 'container')
          if(chart) {
            let label = chart.options.chart.custom.label
            if(label){
              label.attr({
                text: `Сумма<br/><strong>${formatNumber(newAmount)}</strong>`
              })
            }
          }
        })
      }
    }, {immediate: true})

    return {
      chartOptions
    }
  },
})
</script>

<style lang="scss">
#container {
  height: 500px;
  max-width: 700px;
  @media(max-width: 769px) {
    max-width: 800px;
    height: 500px;
  }
  @media(max-width: 426px) {
    height: 600px;
  }
}
</style>
