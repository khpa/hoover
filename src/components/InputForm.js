import React, { Component } from 'react';

class InputForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomsize:'x5y5',
      hoovercoord: 'x3y3',
      dustone: 'x1y1'
    };

    this.handleRoomSize = this.handleRoomSize.bind(this);
    this.handleHooverCoord = this.handleHooverCoord.bind(this);
    this.handleChangeDust = this.handleChangeDust.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleRoomSize (event) {
    this.setState({ roomsize: event.target.value });
  }

  handleHooverCoord(event) {
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
    let hooverCoord = this.state.hoovercoord;
    let dustCoord = this.state.dustone;
    let roomSize = this.state.roomsize;
    this.props.setCoord(hooverCoord, dustCoord, roomSize);
    event.preventDefault();
  }

  render() {
    return (
      <form className={"hoover-coord-form"} onSubmit={this.handleSubmit}>
        
        <label>
        ROOM SIZE? (e.g. x5y5)
       <input type="text" value={this.state.roomsize} onChange={this.handleRoomSize} />
        <br/>
        </label>
        <label>
        COORD FOR DUST CELLS? (e.g. x2y2)
        FIRST <input type="text" value={this.state.dustone} onChange={this.handleChangeDust} />
        <br/>
        </label>
        <label>
          START COORD FOR ROBOT (e.g. x3y3)
          <input type="text" value={this.state.hoovercoord} onChange={this.handleHooverCoord} />
        </label>
        <br/>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default InputForm;