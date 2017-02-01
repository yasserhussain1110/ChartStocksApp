const request = require('superagent');
const throttle = require('lodash.throttle');
const {massageQuandlDataForHighchart} = require('./HighchartAuxilliary');

function searchForRequestedStock(stockName, successCallBack, failureCallBack) {
  request.get("https://www.quandl.com/api/v3/datasets/WIKI/" + stockName + ".json?api_key=" + process.env.QUANDAL_API_KEY)
    .end(function (err, res) {
      if (err) {
        trySearchingStockInApiDB(stockName, successCallBack, failureCallBack);
        return;
      }

      var apiRes = res.body;


      if (apiRes.dataset && apiRes.dataset.data && apiRes.dataset.data.length > 0) {
        successCallBack(massageQuandlDataForHighchart({
          name: apiRes.dataset.name,
          code: apiRes.dataset.dataset_code,
          data: apiRes.dataset.data
        }));
      } else {
        trySearchingStockInApiDB(stockName, successCallBack, failureCallBack);
      }
    });
}

function trySearchingStockInApiDB(stockName, successCallBack, failureCallBack) {
  request.get("https://www.quandl.com/api/v3/datasets.json?query=" + stockName + "&per_page=20&database_code=WIKI&api_key=" + process.env.QUANDAL_API_KEY)
    .end(function (err, res) {
      if (err) {
        console.log(err);
        return;
      }

      var apiRes = res.body;

      if (apiRes.datasets.length === 0) {
        failureCallBack(stockName);
        return;
      }

      findUsableDataset(stockName, apiRes.datasets, successCallBack, failureCallBack);
    });
}

function findUsableDataset(stockName, datasets, successCallBack, failureCallBack) {

  var foundRelevantStock = false, counter = 0;

  datasets.forEach(throttle(function (dataset) {
    if (!foundRelevantStock) {
      request.get("https://www.quandl.com/api/v3/datasets/WIKI/" + dataset.dataset_code + ".json?api_key=" + process.env.QUANDAL_API_KEY)
        .end(function (err, res) {

          counter++;

          if (err) {
            console.log("error getting " + dataset.dataset_code);
            console.log(err);
            return;
          }

          var apiRes = res.body;

          if (apiRes.dataset && apiRes.dataset.data && apiRes.dataset.data.length > 0) {
            foundRelevantStock = true;
            successCallBack(massageQuandlDataForHighchart({
              name: apiRes.dataset.name,
              code: apiRes.dataset.dataset_code,
              data: apiRes.dataset.data
            }));
          }

          if (counter === datasets.length && !foundRelevantStock) {
            failureCallBack(stockName);
          }
        });
    }
  }), 50);
}


module.exports = {
  searchForRequestedStock: searchForRequestedStock
};
