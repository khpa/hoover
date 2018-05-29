import React from 'react';
import Cell from './../Cell/Cell';

const board = (props) => {

  let cells = [];
  let cellsNames = [];
  let dustCellStatus = false;
  //xtable & ytable from state
  let xtable = props.xTable;
  let ytable = props.yTable;

  let tablewidth = xtable * 100 + (xtable * 2);
  for (let i = 0; i < ytable; i++) {
    for (let j = 0; j < xtable; j++) {
      //i=y j=x
      // console.log(i, j);
      let cName = "x" + j + "y" + i;
      console.log(props.dustCoord.toString());
      props.dustCoord.toString().includes(cName) ? dustCellStatus = true : dustCellStatus = false;
      cellsNames.push(cName);
      cells.push(<Cell
        key={cName}
        dustCell={dustCellStatus}
        cellClassName={cName}
        hooverCoord={props.hooverCoord}
        dustCoord={props.dustCoord}
         />)
    }
  }

  return (
    <div style={{
      border: "1px solid red",
      width: tablewidth,
      display: "flex",
      flexFlow: "row wrap-reverse"
    }}>
      {cells}
    </div>
  )
};

export default board;