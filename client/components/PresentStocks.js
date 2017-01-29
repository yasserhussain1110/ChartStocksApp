import React from 'react';

export default ({presentStocks, removeStock}) => (
  <div className="stock-holder">{presentStocks.map(stockName=>(
    <div key={stockName} className="stock">{stockName}
      <button onClick={removeStock.bind(null, stockName)} className="delete">X</button>
    </div>))}
  </div>
);
