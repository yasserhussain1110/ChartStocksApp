import React from 'react';
import PresentStocks from './PresentStocks';
import NewStockForm from './NewStockForm';

export default ({addStock, presentStocks, removeStock}) => (
  <div className="user-interaction">
    <PresentStocks
      removeStock={removeStock}
      presentStocks={presentStocks}
    />
    <NewStockForm addStock={addStock}/>
  </div>
);
