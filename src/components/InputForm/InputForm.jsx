import { Component } from "react";

class InputForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomsize: "x5y5",
      hoovercoord: "x2y1",
      dustone: "x1y1",
      dusttwo: "x2y2",
      dustthree: "x3y3"
    };

    this.handleRoomSize = this.handleRoomSize.bind(this);
    this.handleHooverCoord = this.handleHooverCoord.bind(this);
    this.handleDustOne = this.handleDustOne.bind(this);
    this.handleDustTwo = this.handleDustTwo.bind(this);
    this.handleDustThree = this.handleDustThree.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleRoomSize(event) {
    this.setState({ roomsize: event.target.value });
  }

  handleHooverCoord(event) {
    //check coord range
    this.setState({ hoovercoord: event.target.value });
  }

  handleDustOne(event) {
    //check coord range
    console.log(event.target.value);
    this.setState({ dustone: event.target.value });
  }

  handleDustTwo(event) {
    //check coord range
    this.setState({ dusttwo: event.target.value });
  }
  handleDustThree(event) {
    //check coord range
    this.setState({ dustthree: event.target.value });
  }

  handleSubmit(event) {
    // alert('coord are: ' + this.state.value + 'numb of dust cells'+ this.state.dust);
    let hooverCoord = this.state.hoovercoord;
    let dustCoord = [
      this.state.dustone,
      this.state.dusttwo,
      this.state.dustthree
    ];
    let roomSize = this.state.roomsize;
    this.props.setCoord(hooverCoord, dustCoord, roomSize);
    this.props.roomDisplay();
    event.preventDefault();
  }

  render() {
    return (
      <div style={{ display: this.props.inputform }}>
        <form className={"hoover-coord-form"} onSubmit={this.handleSubmit}>
          <label>
            ROOM SIZE? (e.g. x5y5 [max size x9y9])
            <input
              type="text"
              value={this.state.roomsize}
              onChange={this.handleRoomSize}
            />
            <br />
          </label>
          <label>
            COORD FOR DUST CELLS? (e.g. x2y2)
            <br />
            FIRST{" "}
            <input
              type="text"
              value={this.state.dustone}
              onChange={this.handleDustOne}
            />
            SECOND{" "}
            <input
              type="text"
              value={this.state.dusttwo}
              onChange={this.handleDustTwo}
            />
            THIRD{" "}
            <input
              type="text"
              value={this.state.dustthree}
              onChange={this.handleDustThree}
            />
            <br />
          </label>
          <label>
            START COORD FOR ROBOT (e.g. x3y3)
            <input
              type="text"
              value={this.state.hoovercoord}
              onChange={this.handleHooverCoord}
            />
          </label>
          <br />
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default InputForm;
