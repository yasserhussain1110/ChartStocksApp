import {Theme, Options} from './StockChartConfig';
import Highcharts from 'highcharts/highstock';
import randomColor from 'randomcolor';
Highcharts.setOptions(Theme);

const updateStockChart = (allSeriesOptions) => {
  Options.series = allSeriesOptions.map(s => {
    s.color = randomColor();
    return s;
  });
  Highcharts.stockChart('chart', Options);
};


export default updateStockChart;
