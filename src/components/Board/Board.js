import React from 'react';
import Cell from './../Cell/Cell';

const board = (props) => {

  let cells = [];
  let cellsNames = [];
  let dustCellStatus = false;
  const {xTable,yTable}=props;

  const tableWidth = xTable * 100 + (xTable * 2);
  for (let i = 0; i < yTable; i++) {
    for (let j = 0; j < xTable; j++) {
      
      let cName = "x" + j + "y" + i;

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
      border: "2px solid black",
      width: tableWidth,
      display: "flex",
      flexFlow: "row wrap-reverse"
    }}>
      {cells}
    </div>
  )
};

export default board;