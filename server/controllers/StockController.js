const mongo = require('mongodb').MongoClient;
const {getStockDataFromApi, searchForRequestedStock} = require('../lib/ApiLib');

const dbUrl = process.env.DATABASE_URL;

module.exports = {
  allStocks: allStocks,
  addStock: addStock
  //removeStock: removeStock
};

function allStocks(req, res) {
  mongo.connect(dbUrl, function (err, db) {
    const stocksCollection = db.collection("stocksCollection");
    stocksCollection.find({}, {_id: 0, code: 1}).toArray(function (err, results) {

      console.log(results);

      if (err) {
        console.log(err);
      } else if (results.length === 0) {
        res.json([]);
      } else {
        getStockDataFromApi(results,
          stocks=>res.status(200).json(stocks),
          stocks=>console.log(stocks)
        );
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
    (stock) =>foundStockInApi(stock, sendStockDataCallBack),
    (err) => console.log("not found " + stockName)
  );
}

function foundStockInApi(stock, sendStockDataCallBack) {
  insertStockInDatabase(stock.code, ()=>sendStockDataCallBack(stock));
}


function insertStockInDatabase(stockCode, insertionSuccessfulCallback) {
  mongo.connect(dbUrl, function (err, db) {
    const stocksCollection = db.collection("stocksCollection");
    stocksCollection.insertOne({code: stockCode}).then(insertionSuccessfulCallback).catch(function (e) {
      console.log(e);
    });
    db.close();
  });
}


/*
 function removeStock(io, req, res) {

 let stockName = req.body.stockName.toLowerCase();

 if (!stockName || !stockName.trim()) {
 res.status(400).json({
 errors: "'stockName' cannot be empty"
 });
 return;
 }

 mongo.connect(dbUrl, function (err, db) {
 const stocksCollection = db.collection("stocksCollection");

 Note: // USE FORM:- stocksCollection.deleteOne({name: stockName}).then().catch()
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

 Note: // USE FORM:- stocksCollection.deleteOne({name: stockName}).then().catch()
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
 */
