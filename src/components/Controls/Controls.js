import React from 'react';

const controls = (props)=>{
  return (
<div className={"controls"}>
<div></div>
<div className={"north myButton"} onClick={props.onClickUp}>UP</div>
<div></div>
<div className={"west myButton"} onClick={props.onClickLeft}>LEFT</div>
<div></div>
<div className={"east myButton"} onClick={props.onClickRight}>RIGHT</div>
<div></div>
<div className={"south myButton"} onClick={props.onClickDown}>DOWN</div>
<div></div>
</div>
  );
}

export default controls;