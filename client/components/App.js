import React, {Component} from 'react';
import Index from './Index';
import updateStockChart from '../lib/StockChartLib';
import {asyncGet} from '../serverInteraction/makeServerRequest';
import io from 'socket.io-client';

class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      stocks: []
    };

    this.addStock = this.addStock.bind(this);
    this.removeStock = this.removeStock.bind(this);
    this.fetchAvailableStocks();

    this.socket = io.connect();
    this.setUpSocketEvents();
    this.findIndexOf = this.findIndexOf.bind(this);
  }

  findIndexOf(code) {
    return this.state.stocks.map(stock => stock.code).indexOf(code);
  }

  setUpSocketEvents() {
    this.socket.on('stockAdded', newStockObj => {
      let allStocks = [...this.state.stocks, newStockObj];
      this.setState({
        stocks: allStocks
      });

      updateStockChart(allStocks);
    });

    this.socket.on('stockRemoved', code => {
      console.log(code);

      let stockIndex = this.findIndexOf(code);
      let allStocks = [...this.state.stocks.slice(0, stockIndex),
        ...this.state.stocks.slice(stockIndex + 1)];

      this.setState({
        stocks: allStocks
      });

      updateStockChart(allStocks);
    });
  }

  fetchAvailableStocks() {
    asyncGet('/api/stocks',
      apiRes => {
        let stocks = apiRes;
        if (stocks.length > 0) {
          this.setState({stocks: stocks});
          updateStockChart(stocks);
        }
      },

      apiRes => {
        console.log(apiRes);
      }
    );
  }

  addStock(stockName) {
    this.socket.emit("addStock", stockName);
  }

  removeStock(code) {
    this.socket.emit("removeStock", code);
  }

  render() {
    return (
      <Index
        removeStock={this.removeStock}
        addStock={this.addStock}
        presentStocks={this.state.stocks}
      />
    );
  }

}

export default App;
