import React, {Component} from 'react';
import Index from './Index';
import UpdateStockChart from '../lib/UpdateStockChart';
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

    this.socket = io.connect({transports: ['websocket', 'polling']});
    this.setUpSocketEvents();
  }

  setUpSocketEvents() {
    this.socket.on('stockAdded', newStockObj => {
      let allStocks = [...this.state.stocks, newStockObj];
      this.setState({
        stocks: allStocks
      });

      UpdateStockChart(allStocks);
    });
    /*
     this.socket.on('stockAdded', newStock => {
     let allStockNames = [...this.state.stockNames, newStock];
     this.setState({
     stockNames: allStockNames
     });

     UpdateStockChart(allStockNames);
     });

     this.socket.on('stockRemoved', stockRemoved => {
     let stockPosition = this.state.stockNames.indexOf(stockRemoved);
     if (stockPosition > -1) {
     let allStockNames = [...this.state.stockNames.slice(0, stockPosition),
     ...this.state.stockNames.splice(stockPosition + 1)];

     this.setState({
     stockNames: allStockNames
     });

     UpdateStockChart(allStockNames);
     }
     });
     */
  }

  fetchAvailableStocks() {
    asyncGet('/api/stocks',
      apiRes => {
        let allStockNames = apiRes;
        if (allStockNames.length > 0) {
          this.setState({stockNames: allStockNames});
          UpdateStockChart(allStockNames);
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

  removeStock(stockName) {
    this.socket.emit("removeStock", stockName);
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
