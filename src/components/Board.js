import React from 'react';
import Cell from './Cell';

const board = (props) => {

let cells = [];
let cellsNames = [];
for (let i=0;i<5;i++){
  for (let j=0;j<5;j++){
    // console.log(i, j);
    let cName = "x"+j+"y"+i;
    cellsNames.push(cName);
  cells.push(<Cell key = {cName} cellClassName={cName} hooverCoord={props.hooverCoord}/>)
  }
  }
 
  return (
    <div style={{
      border: "1px solid red",
      width: "510px",
      height: "510px",
      display: "flex",
      flexFlow:"row wrap-reverse"
    }}>
    {cells}
    </div>
  )
};

export default board;