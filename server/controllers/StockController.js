const dbUrl = process.env.DATABASE_URL;
const mongo = require('mongodb').MongoClient;
const checkStockExists = require('../lib/CheckStockExists');

module.exports = {
  allStocks: allStocks,
  addStock: addStock,
  removeStock: removeStock
};

function allStocks(req, res) {
  mongo.connect(dbUrl, function (err, db) {
    const stocksCollection = db.collection("stocksCollection");
    stocksCollection.find({}, {_id: 0, name: 1}).toArray(function (err, results) {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json(results.map(stock=>stock.name));
      }
      db.close();
    });
  });
}

function addStock(io, req, res) {
  let stockName = req.body.stockName;

  if (!stockName || !stockName.trim()) {
    res.status(400).json({
      errors: "'stockName' cannot be empty"
    });
    return;
  }

  checkStockExists(stockName,
    () => {
      onStockFoundInRemoteApi(dbUrl, stockName, res, io);
    },
    () => {
      res.status(404).json({status: "Not Available"});
    });
}

function removeStock(io, req, res) {

  let stockName = req.body.stockName;

  if (!stockName || !stockName.trim()) {
    res.status(400).json({
      errors: "'stockName' cannot be empty"
    });
    return;
  }

  mongo.connect(dbUrl, function (err, db) {
    const stocksCollection = db.collection("stocksCollection");

    try {
      stocksCollection.deleteOne({name: stockName}).then(function (result) {
        if (result.deletedCount === 1) {
          res.status(200).json({status: "deleted"});
          io.emit('stockRemoved', stockName);
        } else {
          console.log(result);
          res.status(404).json({status: "not found"});
        }

      });
    } catch (e) {
      console.log(e);
      res.status(404).json({status: "not found"});
    }
    db.close();
  });
}


function onStockFoundInRemoteApi(dbUrl, stockName, res, io) {
  mongo.connect(dbUrl, function (err, db) {
    const stocksCollection = db.collection("stocksCollection");
    try {
      stocksCollection.insertOne({name: stockName});
      res.status(200).json({status: "added"});
      io.emit('stockAdded', stockName);
    } catch (e) {
      console.log(e);
      res.status(500).json({status: "error"});
    }
    db.close();
  });
}
