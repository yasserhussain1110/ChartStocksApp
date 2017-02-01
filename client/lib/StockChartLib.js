import {Theme, Options} from './StockChartConfig';
import Highcharts from 'highcharts/highstock';
import randomColor from 'randomcolor';
Highcharts.setOptions(Theme);

const updateStockChart = (allSeriesOptions) => {
  allSeriesOptions.forEach(s => {
    s.color = randomColor({luminosity: 'dark'});
  });
  Options.series = allSeriesOptions;
  Highcharts.stockChart('chart', Options);
};


export default updateStockChart;
