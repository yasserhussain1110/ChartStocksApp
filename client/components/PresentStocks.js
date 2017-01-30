import React from 'react';

export default ({presentStocks, removeStock}) => (
  <div className="stock-holder">{presentStocks.map(stock=>(
    <div key={stock.code} className="stock">{stock.code}
      <button onClick={removeStock.bind(null, stock.code)} className="delete">X</button>
    </div>))}
  </div>
);
