import { Component } from "react";
import "./App.css";
import InputForm from "./components/InputForm/InputForm";
import Board from "./components/Board/Board";
import Controls from "./components/Controls/Controls";
import Coord from "./components/Coord/Coord";
import DustCount from "./components/DustCount/DustCount";

class App extends Component {
  state = {
    x: "",
    y: "",
    dx: "",
    dy: "",
    tx: "",
    ty: "",
    dustcoord: "",
    roomdisplay: "none",
    inputform: "block",
    moves: 0
  };

  setCoord = (h, d, t) => {
    const coordX = Number(h.substr(1, 1));
    const coordY = Number(h.substr(3, 1));
    const tcoordX = Number(t.substr(1, 1));
    const tcoordY = Number(t.substr(3, 1));

    this.setState({
      x: coordX,
      y: coordY,
      tx: tcoordX,
      ty: tcoordY,
      dustcoord: d
    });
  };

  handleRoomStatus = () => {
    this.setState({ roomdisplay: "flex", inputform: "none" });
  };

  render() {
    return (
      <div className="App">
        <InputForm
          setCoord={this.setCoord}
          roomDisplay={this.handleRoomStatus}
          inputform={this.state.inputform}
        />

        <div
          className={"board-controls"}
          style={{ display: this.state.roomdisplay }}
        >
          <div className={"whole-board"}>
            <Board
              hooverCoord={"x" + this.state.x + "y" + this.state.y}
              dustCoord={this.state.dustcoord}
              xTable={this.state.tx}
              yTable={this.state.ty}
            />

            <Coord coord={"X:" + this.state.x + " Y:" + this.state.y} />
            <DustCount
              dustCounter={3 - this.state.dustcoord.length}
              moves={this.state.moves}
            />
          </div>

          <Controls
            onMove={(stepX, stepY) =>
              this.setState((state) => {
                const newX = state.x + stepX;
                const newY = state.y + stepY;
                const x = state.tx > newX && newX > -1 ? newX : state.x;
                const y = state.ty > newY && newY > -1 ? newY : state.y;
                const dustCoord = cleanCell(state.dustcoord, `x${x}y${y}`);
                const moves = state.moves + 1;
                return {
                  x,
                  y,
                  dustCoord,
                  moves
                };
              })
            }
          />
        </div>
      </div>
    );
  }
}

const cleanCell = (dustArr, cell) => {
  if (dustArr != null) {
    const pos = dustArr.indexOf(cell);
    if (pos > -1) {
      dustArr.splice(pos, 1);
    }
  }
  return dustArr;
};

export default App;
