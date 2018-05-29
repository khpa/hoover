import React from 'react';
import Cell from './Cell';

const board = (props) => {

let cells = [];
let cellsNames = [];
let dustCellStatus = false;
for (let i=0;i<5;i++){
  for (let j=0;j<5;j++){
    // console.log(i, j);
    let cName = "x"+j+"y"+i;
    cName===props.dustCoord?dustCellStatus=true:dustCellStatus=false;
    cellsNames.push(cName);
  cells.push(<Cell 
    key = {cName} 
    dustCell = {dustCellStatus} 
    cellClassName={cName} 
    hooverCoord={props.hooverCoord} 
    dustCoord={props.dustCoord}
    clearDust = {props.clearDust}/>)
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