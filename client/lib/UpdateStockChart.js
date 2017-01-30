import {Theme, Options} from './StockChartConfig';
import Highcharts from 'highcharts/highstock';

Highcharts.setOptions(Theme);

/*
 const updateStockChart = (stockNames) => {
 let seriesOptions = [],
 seriesCounter = 0;

 if (stockNames.length === 0) {
 createChart([]);
 return;
 }

 $.each(stockNames, function (i, name) {
 let url = `https://www.quandl.com/api/v3/datasets/XNAS/${name}.json?api_key=${process.env.QUANDAL_API_KEY}`;
 $.getJSON(url, function (res) {

 seriesOptions[i] = {
 name: name,
 data: res.data
 };

 seriesCounter += 1;

 if (seriesCounter === stockNames.length) {
 createChart(seriesOptions);
 }
 });
 });

 };


 const createChart = (seriesOptions) => {
 Options.series = seriesOptions;
 Highcharts.stockChart('chart', Options);

 };
 */


const updateStockChart = (allSeriesOptions) => {
  let highStockSeriesOpt = allSeriesOptions.map(val => ({
    name: val.name,
    data: val.data.map(
      elem => [parseInt(new Date(elem[0]).getTime(), 10),
        parseFloat(elem[1], 10)])
  }));

  Options.series = highStockSeriesOpt;
  Highcharts.stockChart('chart', Options);
};


export default updateStockChart;
