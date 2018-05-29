import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import InputForm from './components/InputForm';
import Board from './components/Board';
import Controls from './components/Controls';
import Coord from './components/Coord';

class App extends Component {
  state = {
    x: '',
    y: '',
    dx: '',
    dy: '',
    tx: '',
    ty: ''
  }

  onClickUp = (event) => {
    console.log("onClickUp!");
    console.log("state", this.state);
    const yTemp = this.state.y;
    const newY = { ...this.state, y: yTemp + 1 };
    newY.y < this.state.ty ? this.setState(newY) : console.log('outside table');
    if (this.state.x === this.state.dx && this.state.y + 1 === this.state.dy) {
      console.log("hoover over dust!!")
      this.onClearDust();
    }
  }
  onClickDown = (event) => {
    console.log("onClickDown!");
    console.log("state", this.state);
    const yTemp = this.state.y;
    const newY = { ...this.state, y: yTemp - 1 };
    newY.y >= 0 ? this.setState(newY) : console.log('outside table');
    if (this.state.x === this.state.dx && this.state.y - 1 === this.state.dy) {
      console.log("hoover over dust!!")
      this.onClearDust();
    }
  }
  onClickRight = (event) => {
    console.log("onClickRight!");
    console.log("state", this.state);
    const xTemp = this.state.x;
    const newX = { ...this.state, x: xTemp + 1 };
    newX.x < this.state.tx ? this.setState(newX) : console.log('outside table');
    if (this.state.x + 1 === this.state.dx && this.state.y === this.state.dy) {
      console.log("hoover over dust!!");
      this.onClearDust();
    }
  }
  onClickLeft = (event) => {
    console.log("onClickLeft!");
    console.log("state", this.state);
    const xTemp = this.state.x;
    const newX = { ...this.state, x: xTemp - 1 };
    newX.x >= 0 ? this.setState(newX) : console.log('outside table');
    if (this.state.x - 1 === this.state.dx && this.state.y === this.state.dy) {
      console.log("hoover over dust!!")
      this.onClearDust();
    }
  }

  setCoord = (h, d, t) => {
    //console.log("x:",x);
    let coordX = Number(h.substr(1, 1));
    let coordY = Number(h.substr(3, 1));
    let dcoordX = Number(d.substr(1, 1));
    let dcoordY = Number(d.substr(3, 1));
    let tcoordX = Number(t.substr(1, 1));
    let tcoordY = Number(t.substr(3, 1));
    console.log('dust is here:', d);
    console.log("this is x, y:", coordX, coordY, typeof (coordX));
    console.log('table dimension:', tcoordX, tcoordY);
    this.setState({ x: coordX, y: coordY, dx: dcoordX, dy: dcoordY, tx: tcoordX, ty: tcoordY })
  }


  onClearDust = () => {
    console.log('dust is clear');
    this.setState({ dx: null, dy: null });
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">This is Hoover...</h1>
        </header>

        <InputForm setCoord={this.setCoord} />
        <div className={"board-controls"}>
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
              dustCoord={"x" + this.state.dx + "y" + this.state.dy}
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
