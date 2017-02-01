import React from 'react';

export default ({presentStocks, removeStock}) => (
  <div className="stock-holder">{presentStocks.map(stock=>(
    <div key={stock.code} className="stock">
      <span>{stock.code}</span>
      <br/>
      <span className="stock-desc">{stock.desc}</span>
      <button onClick={removeStock.bind(null, stock.code)} className="delete">X</button>
    </div>))}
  </div>
);
