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
          data: apiRes.dataset.data,
          desc: apiRes.dataset.name.replace(/prices.*/i, "")
        }));
      } else {
        trySearchingStockInApiDB(stockName, successCallBack, failureCallBack);
      }
    });
}

function trySearchingStockInApiDB(stockName, successCallBack, failureCallBack) {
  request.get("https://www.quandl.com/api/v3/datasets.json?query=" + stockName + "&database_code=WIKI&api_key=" + process.env.QUANDAL_API_KEY)
    .end(function (err, res) {
      if (err) {
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

  let counter = 0;

  function fetchStock(stockCode) {
    request.get("https://www.quandl.com/api/v3/datasets/WIKI/" + stockCode + ".json?api_key=" + process.env.QUANDAL_API_KEY)
      .end(function (err, res) {
        counter++;

        if (err) {
          console.log("error getting " + dataset.dataset_code);
          console.log(err);

          if (counter < datasets.length) {
            fetchStock(datasets[counter].dataset_code);
          } else {
            failureCallBack(stockName);
          }

          return;
        }

        var apiRes = res.body;

        if (apiRes.dataset && apiRes.dataset.data && apiRes.dataset.data.length > 0) {
          successCallBack(massageQuandlDataForHighchart({
            name: apiRes.dataset.name,
            code: apiRes.dataset.dataset_code,
            data: apiRes.dataset.data,
            desc: apiRes.dataset.name.replace(/prices.*/i, "")
          }));
          return;
        }

        if (counter < datasets.length) {
          fetchStock(datasets[counter].dataset_code);
        } else {
          failureCallBack(stockName);
        }
      })
  }

  fetchStock(datasets[counter].dataset_code);
}


module.exports = {
  searchForRequestedStock: searchForRequestedStock
};
