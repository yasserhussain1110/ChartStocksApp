const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);


if (process.env.NODE_ENV === "production") {
  console.log("Running In Production");
  app.use(express.static('build'));
} else {
  console.log("Running In Development");
  require('dotenv').config();
  require('../tools/DevSetup').setupDev(app);
}

const bodyParser = require('body-parser');
const session = require('express-session');
const LokiStore = require('connect-loki')(session);

app.use(session({
  secret: 'abracadabra',
  resave: true,
  saveUninitialized: true,
  store: new LokiStore({
    autosave: false
  })
}));

app.use(bodyParser.urlencoded({
  extended: true
}));

const StockController = require('./controllers/StockController');

app.get('/api/stocks', StockController.allStocks);
app.post('/api/addStock', (req, res)=>StockController.addStock(io, req, res));
app.post('/api/removeStock', (req, res)=>StockController.removeStock(io, req, res));


http.listen(process.env.PORT || 8080, function(){
  console.log('Server Started On ' + process.env.PORT);
});

