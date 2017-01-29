import React from 'react';
import StockChart from './StockChart';
import UserIO from './UserIO';
import Credits from './Credits'

export default ({addStock, presentStocks, removeStock}) => (
  <div className="index">
    <StockChart/>
    <UserIO
      removeStock={removeStock}
      presentStocks={presentStocks}
      addStock={addStock}
    />
    <Credits />
  </div>
);

