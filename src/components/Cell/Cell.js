import React from 'react';

const cell = (props)=>{

let hooverCellBg;
props.cellClassName===props.hooverCoord ? hooverCellBg = '#87ceeb' : hooverCellBg='white';


  const cellStyle = {
    border:'1px solid blue',
    width:'100px',
    height:'100px',
    display:'flex',
    alignContent:'center',
    backgroundColor:hooverCellBg
  }
  
  
  if (props.dustCell) {
    cellStyle.backgroundColor = 'red';
  }
  
  return (
    <div className = {props.cellClassName} style = {cellStyle}>
    {/* Cell: {props.cellClassName}
    <br/> */}
    {/* {props.hooverCoord}<br/>
    {props.dustCoord}<br/>
    {props.dustCell.toString()} */}
  
    </div>
  )
}

export default cell;