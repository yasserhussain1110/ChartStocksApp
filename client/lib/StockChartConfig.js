export const Theme =  {
  colors: ['#f45b5b', '#8085e9', '#8d4654', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee',
    '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
  chart: {
    backgroundColor: null,
    style: {
      fontFamily: 'Signika, serif'
    }
  },
  title: {
    style: {
      color: 'black',
      fontSize: '16px',
      fontWeight: 'bold'
    }
  },
  subtitle: {
    style: {
      color: 'black'
    }
  },
  tooltip: {
    borderWidth: 0
  },
  legend: {
    itemStyle: {
      fontWeight: 'bold',
      fontSize: '13px'
    }
  },
  xAxis: {
    labels: {
      style: {
        color: '#6e6e70'
      }
    }
  },
  yAxis: {
    labels: {
      style: {
        color: '#6e6e70'
      }
    }
  },
  plotOptions: {
    series: {
      shadow: true
    },
    candlestick: {
      lineColor: '#404048'
    },
    map: {
      shadow: false
    }
  },

  // Highstock specific
  navigator: {
    xAxis: {
      gridLineColor: '#D0D0D8'
    }
  },
  rangeSelector: {
    buttonTheme: {
      fill: 'white',
      stroke: '#C0C0C8',
      'stroke-width': 1,
      states: {
        select: {
          fill: '#D0D0D8'
        }
      }
    }
  },
  scrollbar: {
    trackBorderColor: '#C0C0C8'
  },

  // General
  background2: '#E0E0E8'

};


export const Options = {

    rangeSelector: {
      selected: 4
    },

    yAxis: {
      labels: {
        formatter: function () {
          return (this.value > 0 ? ' + ' : '') + this.value + '%';
        }
      },
      plotLines: [{
        value: 0,
        width: 2,
        color: 'silver'
      }]
    },

    plotOptions: {
      series: {
        compare: 'percent',
        showInNavigator: true
      }
    },

    tooltip: {
      pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
      valueDecimals: 2,
      split: true
    },

    series: []
  };
