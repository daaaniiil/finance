<template>
  <div>
    <highcharts :options="chartWorld"></highcharts>
    <highcharts :options="chartOptions"></highcharts>
    <highcharts :options="chartMoose"></highcharts>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      chartOptions: {
        chart: {
          type: 'pie', // 'line', 'bar', 'column', 'scatter', 'area'
        },
        title: {
          text: 'Browser market shares in January, 2018',
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        accessibility: {
          point: {
            valueSuffix: '%'
          },
          enabled: false
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            dataLabels: {
              enabled: false
            },
            showInLegend: true
          }
        },
        series: [{
          name: 'Browsers',
          colorByPoint: true,
          data: [
            { name: 'Chrome', y: 61.41 },
            { name: 'Internet Explorer', y: 11.84 },
            { name: 'Firefox', y: 10.85 },
            { name: 'Edge', y: 4.67 },
            { name: 'Safari', y: 4.18 },
            { name: 'Other', y: 7.05 },
          ],
        }],
      },
      chartWorld: {
        chart: {
          type: 'bar'
        },
        title: {
          text: 'Historic World Population by Region',
          align: 'left'
        },
        subtitle: {
          text: 'Wikipedia.org',
          align: 'left'
        },
        xAxis: {
          categories: ['Africa', 'America', 'Asia', 'Europe'],
          title: {
            text: null
          },
          gridLineWidth: 1,
          lineWidth: 0
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Population (millions)',
            align: 'high'
          },
          labels: {
            overflow: 'justify'
          },
          gridLineWidth: 0
        },
        tooltip: {
          valueSuffix: ' millions'
        },
        plotOptions: {
          bar: {
            borderRadius: '50%',
            dataLabels: {
              enabled: true
            },
            groupPadding: 0.1
          }
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'top',
          x: -40,
          y: 80,
          floating: true,
          borderWidth: 1,
          backgroundColor: '#FFFFFF',
          shadow: true
        },
        credits: {
          enabled: false
        },
        series: [{
          name: 'Year 1990',
          data: [632, 727, 3202, 721]
        }, {
          name: 'Year 2000',
          data: [814, 841, 3714, 726]
        }, {
          name: 'Year 2021',
          data: [1393, 1031, 4695, 745]
        }]
      },
      chartMoose: {
        chart: {
          type: 'areaspline'
        },
        title: {
          text: 'Moose and deer hunting in Norway, 2000 - 2021',
          align: 'left'
        },
        subtitle: {
          text: 'Source: <a href="https://www.ssb.no/jord-skog-jakt-og-fiskeri/jakt" target="_blank">SSB</a>',
          align: 'left'
        },
        legend: {
          layout: 'vertical',
          align: 'left',
          verticalAlign: 'top',
          x: 120,
          y: 70,
          floating: true,
          borderWidth: 1,
          backgroundColor: '#FFFFFF'
        },
        xAxis: {
          plotBands: [{ // Highlight the two last years
            from: 2019,
            to: 2020,
            color: 'rgba(68, 170, 213, .2)'
          }]
        },
        yAxis: {
          title: {
            text: 'Quantity'
          }
        },
        tooltip: {
          shared: true,
          headerFormat: '<b>Hunting season starting autumn {point.x}</b><br>'
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          series: {
            pointStart: 2000
          },
          areaspline: {
            fillOpacity: 0.5
          }
        },
        series: [{
          name: 'Moose',
          data:
              [
                38000,
                34978,
                35657,
                34956,
                33199,
                30666,
                30319,
                31766
              ]
        }, {
          name: 'Deer',
          data:
              [
                16534,
                23599,
                35686,
                45709,
                39143,
                23820,
                46445,
                65048
              ]
        }]
      }
    }
  },
})
</script>
