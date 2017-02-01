import {Theme, Options} from './StockChartConfig';
import Highcharts from 'highcharts/highstock';
Highcharts.theme = Theme;
Highcharts.setOptions(Highcharts.theme);

const updateStockChart = (allSeriesOptions) => {
  Options.series = allSeriesOptions;
  Options.series.forEach((elem, i) => {
    const color = Highcharts.Color(Highcharts.getOptions().colors[i]);
    console.log('color is', color);
    elem.color = color;
  });
  Highcharts.stockChart('chart', Options);
};


export default updateStockChart;
