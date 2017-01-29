import {Theme, Options} from './StockChartConfig';
import Highcharts from 'highcharts/highstock';
import $ from 'jquery';

Highcharts.setOptions(Theme);

const updateStockChart = (stockNames) => {
  let seriesOptions = [],
    seriesCounter = 0;

  if (stockNames.length === 0) {
    createChart([]);
    return;
  }

  $.each(stockNames, function (i, name) {
    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=' + name.toLowerCase() + '-c.json&callback=?',
      function (data) {

        seriesOptions[i] = {
          name: name,
          data: data
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

/*
const updateStockChart = (allSeriesOptions) => {
  Options.series = allSeriesOptions;
  Highcharts.stockChart('chart', Options);
};
*/

export default updateStockChart;
