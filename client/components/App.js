import React, {Component} from 'react';
import Index from './Index';
import UpdateStockChart from '../lib/UpdateStockChart';
import {asyncGet, asyncPost} from '../serverInteraction/makeServerRequest';
import io from 'socket.io-client';

class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      stockNames: []
    };

    this.addStock = this.addStock.bind(this);
    this.removeStock = this.removeStock.bind(this);
    this.fetchAvailableStocks();

    this.socket = io();
    this.setUpSocketEvents();
  }

  setUpSocketEvents() {
    this.socket.on('stockAdded', newStock => {
      let allStockNames = [...this.state.stockNames, newStock];
      this.setState({
        stockNames: allStockNames
      });

      UpdateStockChart(allStockNames);
    });

    this.socket.on('stockRemoved', stockRemoved => {
      let stockPosition = this.state.stockNames.indexOf(stockRemoved);
      debugger;
      if (stockPosition > -1) {
        let allStockNames = [...this.state.stockNames.slice(0, stockPosition),
          ...this.state.stockNames.splice(stockPosition + 1)];

        this.setState({
          stockNames: allStockNames
        });

        UpdateStockChart(allStockNames);
      }
    });
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
    asyncPost('/api/addStock', {stockName},
      apiRes => {
        console.log(apiRes);
      },

      apiRes => {
        console.log(apiRes);
      }
    );
  }

  removeStock(stockName) {
    asyncPost('/api/removeStock', {stockName},
      apiRes => {
        console.log(apiRes);
      },

      apiRes => {
        console.log(apiRes);
      }
    );
  }

  render() {
    return (
      <Index
        removeStock={this.removeStock}
        addStock={this.addStock}
        presentStocks={this.state.stockNames}
      />
    );
  }

}

export default App;
