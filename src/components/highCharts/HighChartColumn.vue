<template>
  <highcharts :options="chartOptions"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      chartOptions: {
        chart: {
          type: 'area',
          marginTop: 50
        },
        // defs: {
        //   gradient0: {
        //     tagName: 'linearGradient',
        //     id: 'gradient-0',
        //     x1: 0,
        //     y1: 0,
        //     x2: 0,
        //     y2: 1,
        //     children: [{
        //       tagName: 'stop',
        //       offset: 0
        //     }, {
        //       tagName: 'stop',
        //       offset: 1
        //     }]
        //   }
        // },
        plotOptions: {
          areaspline: {
            color: '#94f893',
            fillColor: {
              linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
              stops: [
                [0, '#94f893'],
                [1, 'rgba(50,94,205,0)']
              ],
            },
            stacking: 'normal',
            threshold: null,
            marker: {
              lineWidth: 1,
              lineColor: 'white'
            }
          }
        },
        credits: {
          enabled: false
        },
        title: {
          text: ''
        },
        legend: {
          enabled: false
        },
        xAxis: {
          categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
          ]
        },
        yAxis: [{
          title: '',
          labels: {
            format: '{value} k'
          }
        }],
        series: [{
          type: 'areaspline',
          dataLabels: {
            enabled: false
          },
          marker: {
            enabled: false
          },
          name: 'Earnings',
          data: [10, 20, 30, 40, 12, 11, 10, 23, 4, 34, 50, 20]
        }]
      }
      // chartOptions: {
      //   chart: {
      //     type: 'column'
      //   },
      //   title: {
      //     text: 'Доходы и расходы 2024',
      //     align: 'left'
      //   },
      //   xAxis: {
      //     categories: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Нояб', 'Дек'],
      //     crosshair: true,
      //   },
      //   yAxis: {
      //     min: 0,
      //     title: {
      //       text: 'Money'
      //     }
      //   },
      //   tooltip: {
      //     valueSuffix: '₽'
      //   },
      //   plotOptions: {
      //     column: {
      //       pointPadding: 0.2,
      //       borderWidth: 0,
      //       borderRadius: 5
      //     }
      //   },
      //   series: [
      //     {
      //       name: 'Доходы',
      //       data: [20000, 18000, 23000, 29000, 25000, 31000, 37000, 33000, 39000, 42000, 38000, 37000]
      //     },
      //     {
      //       name: 'Расходы',
      //       data: [80000, 84000, 73000, 87000, 94000, 83000, 65000, 70000, 64000, 72200, 64000, 59000]
      //     }
      //   ]
      // }
    }
  }
})
</script>
