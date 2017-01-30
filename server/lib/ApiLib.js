const request = require('superagent');
const throttle = require('lodash.throttle');

function getStockDataFromApi(stockList, successCallBack, failureCallBack) {
  var allStockData = [], counter = 0;
  stockList.forEach(function (stock, i) {
    request.get("https://www.quandl.com/api/v3/datasets/WIKI/" + stock.code + ".json")
      .end(function (err, res) {
        if (err) {
          console.log("error in getting stock data. stock code " + JSON.stringify(stock.code));
          return;
        }

        var apiRes = res.body;

        allStockData[i] = {
          name: apiRes.dataset.name,
          code: apiRes.dataset.dataset_code,
          data: apiRes.dataset.data
        };

        counter++;

        if (counter == allStockData.length) {
          var successStockData = allStockData.filter(stock=>stock != undefined);
          if (successStockData.length = allStockData.length) {
            successCallBack(allStockData);
          } else {
            failureCallBack(allStockData);
          }
        }
      });
  });
}

function searchForRequestedStock(stockName, successCallBack, failureCallBack) {
  request.get("https://www.quandl.com/api/v3/datasets/WIKI/" + stockName + ".json")
    .end(function (err, res) {
      if (err) {
        console.log("Got error while trying to retrieve " + stockName);
        trySearchingStockInApiDB(stockName, successCallBack, failureCallBack);
        return;
      }

      var apiRes = res.body;


      if (apiRes.dataset && apiRes.dataset.data && apiRes.dataset.data.length > 0) {
        successCallBack({
          name: apiRes.dataset.name,
          code: apiRes.dataset.dataset_code,
          data: apiRes.dataset.data
        });
      } else {
        trySearchingStockInApiDB(stockName, successCallBack, failureCallBack);
      }
    });
}

function trySearchingStockInApiDB(stockName, successCallBack, failureCallBack) {
  request.get("https://www.quandl.com/api/v3/datasets.json?query=" + stockName + "&per_page=20&database_code=WIKI")
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

      searchForReleventDatasetAmongDatasets(stockName, apiRes.datasets, successCallBack, failureCallBack);
    });
}

function searchForReleventDatasetAmongDatasets(stockName, datasets, successCallBack, failureCallBack) {

  var foundRelevantStock = false, counter = 0;

  datasets.forEach(throttle(function (dataset) {
    if (!foundRelevantStock) {
      console.log("getting "+dataset.dataset_code);
      request.get("https://www.quandl.com/api/v3/datasets/WIKI/" + dataset.dataset_code + ".json")
        .end(function (err, res) {

          counter++;

          if (err) {
            console.log("error getting " + dataset.dataset_code);
            return;
          }

          var apiRes = res.body;

          if (apiRes.dataset && apiRes.dataset.data && apiRes.dataset.data.length > 0) {
            foundRelevantStock = true;
            console.log("successful with " + dataset.dataset_code);
            successCallBack({
              name: apiRes.dataset.name,
              code: apiRes.dataset.dataset_code,
              data: apiRes.dataset.data
            });
          }

          if (counter === datasets.length && !foundRelevantStock) {
            failureCallBack(stockName);
          }
        });
    }
  }), 100);
}


module.exports = {
  getStockDataFromApi: getStockDataFromApi,
  searchForRequestedStock: searchForRequestedStock
};
