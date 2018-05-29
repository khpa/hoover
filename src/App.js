import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import InputForm from './components/InputForm/InputForm';
import Board from './components/Board/Board';
import Controls from './components/Controls/Controls';
import Coord from './components/Coord/Coord';

class App extends Component {
  state = {
    x: '',
    y: '',
    dx: '',
    dy: '',
    tx: '',
    ty: '',
    dustcoord:'',
    roomdisplay: 'none',
    inputform: 'block'
  }

  onClickUp = (event) => {
    console.log("onClickUp!");
    console.log("state", this.state);
    const yTemp = this.state.y;
    const newY = { ...this.state, y: yTemp + 1 };
    newY.y < this.state.ty ? this.setState(newY) : console.log('outside table');
    let checkDust = "x"+(this.state.x).toString()+"y"+(this.state.y+1).toString();
    if (this.state.dustcoord.includes(checkDust)) {
      this.onClearDust(checkDust);
    }
  }
  onClickDown = (event) => {
    console.log("onClickDown!");
    console.log("state", this.state);
    const yTemp = this.state.y;
    const newY = { ...this.state, y: yTemp - 1 };
    newY.y >= 0 ? this.setState(newY) : console.log('outside table');
    let checkDust = "x"+(this.state.x).toString()+"y"+(this.state.y-1).toString();
    if (this.state.dustcoord.includes(checkDust)) {
      console.log("hoover over dust!!")
      this.onClearDust(checkDust);
    }
  }
  onClickRight = (event) => {
    console.log("onClickRight!");
    console.log("state", this.state);
    const xTemp = this.state.x;
    const newX = { ...this.state, x: xTemp + 1 };
    newX.x < this.state.tx ? this.setState(newX) : console.log('outside table');
    let checkDust = "x"+(this.state.x +1).toString()+"y"+(this.state.y).toString();
    if (this.state.dustcoord.includes(checkDust)) {
      console.log("hoover over dust!!");
      this.onClearDust(checkDust);
    }
  }
  onClickLeft = (event) => {
    console.log("onClickLeft!");
    console.log("state", this.state);
    const xTemp = this.state.x;
    const newX = { ...this.state, x: xTemp - 1 };
    newX.x >= 0 ? this.setState(newX) : console.log('outside table');
    let checkDust = "x"+(this.state.x -1).toString()+"y"+(this.state.y).toString();
    console.log(checkDust);
    if (this.state.dustcoord.includes(checkDust)) {
      console.log("hoover over dust!!")
      this.onClearDust(checkDust);
    }
  }

  setCoord = (h, d, t) => {
  
    const coordX = Number(h.substr(1, 1));
    const coordY = Number(h.substr(3, 1));
    // const dcoordX = Number(d[0].substr(1, 1));
    // const dcoordY = Number(d[0].substr(3, 1));
    const tcoordX = Number(t.substr(1, 1));
    const tcoordY = Number(t.substr(3, 1));

    this.setState({ x: coordX, y: coordY, tx: tcoordX, ty: tcoordY, dustcoord:d})
  }


  onClearDust = (dust) => {
    console.log('dust is clear');
    let newDust = this.state.dustcoord.filter((e)=>e!==dust)
    console.log ("new dust:",newDust);
   this.setState({dustcoord:newDust});
    //this.setState({...this.state,dustcoord:newDust});
    // this.setState({ dx: '', dy: '', dustcoord:'' });
  }

  handleRoomStatus = () => {
    this.setState({ roomdisplay: 'flex', inputform: 'none' })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">This is Hoover...</h1>
        </header>

        <InputForm
          setCoord={this.setCoord}
          roomDisplay={this.handleRoomStatus}
          inputform={this.state.inputform} />

        <div className={"board-controls"} style={{ display: this.state.roomdisplay }}>
          <div className={"whole-board"}>
            {/* <div className={"y-axis"}>
              <div>4</div>
              <div>3</div>
              <div>2</div>
              <div>1</div>
              <div>Y 0</div>
            </div> */}

            <Board
              hooverCoord={"x" + this.state.x + "y" + this.state.y}

              dustCoord={this.state.dustcoord}
              //dustCoord={"x" + this.state.dx + "y" + this.state.dy}
              xTable={this.state.tx}
              yTable={this.state.ty} />

            {/* <div className={"x-axis"}>
              <div>X 0</div>
              <div>1</div>
              <div>2</div>
              <div>3</div>
              <div>4</div>
            </div> */}
            <Coord coord={"X:" + this.state.x + " Y:" + this.state.y} />
          </div>

          <Controls
            onClickUp={this.onClickUp}
            onClickDown={this.onClickDown}
            onClickLeft={this.onClickLeft}
            onClickRight={this.onClickRight} />

        </div>

      </div>
    );
  }
}

export default App;
