const massageQuandlDataForHighchart = stockData => {
  stockData.data = stockData.data.map(e => [new Date(e[0]).getTime(), e[1]]).reverse();
  return stockData;
};

module.exports = {
  massageQuandlDataForHighchart: massageQuandlDataForHighchart
};
