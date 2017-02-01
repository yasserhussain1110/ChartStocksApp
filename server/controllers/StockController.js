const mongo = require('mongodb').MongoClient;
const {searchForRequestedStock} = require('../lib/ApiLib');

const dbUrl = process.env.DATABASE_URL;


// db.chartstocks.createIndex( { "code": 1 }, { unique: true } )


module.exports = {
  allStocks: allStocks,
  addStock: addStock,
  removeStock: removeStock
};

function allStocks(req, res) {
  mongo.connect(dbUrl, function (err, db) {
    const stocksCollection = db.collection("stocksCollection");
    stocksCollection.find({}, {_id: 0}).toArray(function (err, results) {
      if (err) {
        console.log(err);
        res.status(400).json({error: "DB Error"});
      } else {
        res.status(200).json(results);
      }
      db.close();
    });
  });
}

function addStock(stockName, sendStockDataCallBack) {
  if (!stockName || !stockName.trim()) {
    console.log("stock name cannot be empty " + stockName);
    return;
  }

  searchForRequestedStock(stockName,
    (stock) =>insertStockInDatabase(stock, sendStockDataCallBack),
    (err) => console.log("not found " + stockName)
  );
}

function removeStock(code, sendStockDataCallBack) {
  if (!code || !code.trim()) {
    console.log("stock code cannot be empty " + stockName);
    return;
  }

  mongo.connect(dbUrl, function (err, db) {
    const stocksCollection = db.collection("stocksCollection");
    stocksCollection.deleteOne({code: code}).then(function () {
      sendStockDataCallBack();
    }).catch(e=> {
      console.log(e)
    });
    db.close();
  });
}


function insertStockInDatabase(stock, sendStockDataCallBack) {
  mongo.connect(dbUrl, function (err, db) {
    const stocksCollection = db.collection("stocksCollection");
    stocksCollection.insertOne(stock).then(() => sendStockDataCallBack(stock)).catch(function (e) {
      console.log(e);
    });
    db.close();
  });
}
