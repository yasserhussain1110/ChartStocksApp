const $ = require('jquery')(require("jsdom").jsdom().defaultView);

function check(stockName, successCallBack, failureCallBack) {
  $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=' + stockName.toLowerCase() + '-c.json&callback=?',
    function (data) {
      if (data) {
        successCallBack();
      } else {
        failureCallBack();
      }
    });
}

module.exports = check;
