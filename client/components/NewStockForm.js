import React, {Component} from 'react';

class NewStockForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stockInput: ""
    };

    this.changeStockInput = this.changeStockInput.bind(this);
    this.getNewStock = this.getNewStock.bind(this);
  }

  getNewStock(e) {
    e.preventDefault();
    if (!!this.state.stockInput) {  // stockInput is not empty
      this.props.addStock(this.state.stockInput);
    }
  }

  changeStockInput(e) {
    this.setState({
      stockInput: e.target.value
    });
  }

  render() {
    return (
      <FormView
        currentStockInput={this.state.stockInput}
        changeStockInput={this.changeStockInput}
        getNewStock={this.getNewStock}
      />
    );
  }
}

const FormView = ({currentStockInput, changeStockInput, getNewStock}) => (
  <div className="new-stock">
    <form className="new-stock-form" onSubmit={getNewStock}>
      <h3>Add a new stock in Realtime!</h3>
      <input
        onChange={changeStockInput}
        type="text"
        value={currentStockInput}
        placeholder="Add a new Stock"/>
      <button>Add</button>
    </form>
  </div>
);

export default NewStockForm;


