import React, { Component } from 'react';

class InputForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'A3',
      dust: 0
    };

    this.handleChangeCoord = this.handleChangeCoord.bind(this);
    this.handleChangeDust = this.handleChangeDust.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeCoord(event) {
    this.setState({ value: event.target.value });
  }

  handleChangeDust(event) {
    this.setState({ dust: event.target.value });
  }

  handleSubmit(event) {
    alert('coord are: ' + this.state.value + 'numb of dust cells'+ this.state.dust);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          START COORD FOR ROBOT
          choose from (A-E & 1-5 e.g. A3)
          <input type="text" value={this.state.value} onChange={this.handleChangeCoord} />
        </label>
        <br/>
        <label>
        HOW MANY DUST CELLS? (0-25)
        <input type="text" value={this.state.dust} onChange={this.handleChangeDust} />
        <br/>
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default InputForm;