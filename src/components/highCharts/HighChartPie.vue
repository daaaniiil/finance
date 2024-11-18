<template>
  <div>
    <highcharts id="container" :options="chartOptions"></highcharts>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    const year =  new Date().getFullYear()

    return {
      chartOptions: {
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
                    chart.renderer.label('Сумма<br/>' + '<strong>2 877 820</strong>')
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
          }
        },
        title: {
          text: `Расходы ${year}`
        },
        credits: {
          enabled: false
        },
        subtitle: {
          text: 'Формат: Рубль'
        },
        tooltip: {
          valueSuffix: 'Br',
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
          data: [
            {name: 'Дом', y: 700, color: '#4caf50'},
            {name: 'Образование', y: 200, color: '#ff9800'},
            {name: 'Одежда', y: 350, color: '#f44336'},
            {name: 'Авто', y: 125, color: '#2196f3'},
            {name: 'Продукты', y: 460, color: '#9c27b0'},
            {name: 'Транспорт', y: 30, color: '#ffc107'},
            {name: 'Здоровье', y: 57, color: '#8bc34a'},
            {name: 'Красота', y: 86, color: '#00bcd4'},
            {name: 'Развлечение', y: 62, color: '#e91e63'},
            {name: 'Спорт', y: 54, color: '#673ab7'},
            {name: 'Подписки', y: 89, color: '#795548'},
            {name: 'Переводы', y: 47, color: '#ff5722'},
            {name: 'Прочие расходы', y: 140, color: '#607d8b'}
          ]
        }]
      }
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
