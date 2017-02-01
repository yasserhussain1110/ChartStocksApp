import {Theme, Options} from './StockChartConfig';
import Highcharts from 'highcharts/highstock';
Highcharts.setOptions(Theme);

const updateStockChart = (allSeriesOptions) => {
  Options.series = allSeriesOptions;
  Highcharts.stockChart('chart', Options);
};


export default updateStockChart;
