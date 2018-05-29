import React, { Component } from 'react';

class InputForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hoovercoord: 'x3y3',
      dustone: 'x1y1'
    };

    this.handleChangeCoord = this.handleChangeCoord.bind(this);
    this.handleChangeDust = this.handleChangeDust.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeCoord(event) {
    //check coord range
    this.setState({ hoovercoord: event.target.value });
  }

  handleChangeDust(event) {
    //check coord range

    console.log(event.target.value);
    this.setState({ dustone: event.target.value });
  }

  handleSubmit(event) {
    // alert('coord are: ' + this.state.value + 'numb of dust cells'+ this.state.dust);
    let coord = this.state.hoovercoord;
    let dustCoord = this.state.dustone;
    this.props.setHooverCoord(coord, dustCoord);
    event.preventDefault();
  }

  render() {
    return (
      <form className={"hoover-coord-form"} onSubmit={this.handleSubmit}>
        
        <label>
        COORD FOR DUST CELLS? (e.g. x2y2)
        FIRST <input type="text" value={this.state.dustone} onChange={this.handleChangeDust} />
        <br/>
        </label>
        <label>
          START COORD FOR ROBOT (e.g. x3y3)
          <input type="text" value={this.state.hoovercoord} onChange={this.handleChangeCoord} />
        </label>
        <br/>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default InputForm;