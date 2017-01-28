import React, {Component} from 'react';
import Index from './Index';

class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      bars: props.bars,
      searching: props.searching
    };

    this.indicateGoing = this.indicateGoing.bind(this);
    this.tryToLogIn = this.tryToLogIn.bind(this);
    this.goerButtonClick = this.goerButtonClick.bind(this);
  }

  render() {
    return (
      <Index />
    );
  }

}

export default App;
