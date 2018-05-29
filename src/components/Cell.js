import React from 'react';

const cell = (props)=>{

let hooverCellBg;
props.cellClassName===props.hooverCoord ? hooverCellBg = 'black' : hooverCellBg='white';

  const cellStyle = {
    border:'1px solid blue',
    width:'100px',
    height:'100px',
    display:'flex',
    alignContent:'center',
    backgroundColor:hooverCellBg
  }
  return (
    <div className = {props.cellClassName} style = {cellStyle}>
    Cell: {props.cellClassName}
    <br/>
    {props.hooverCoord}
  
    </div>
  )
}

export default cell;