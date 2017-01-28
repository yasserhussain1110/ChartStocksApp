const express = require('express');
const app = express();

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



app.listen(process.env.PORT || 8080);


