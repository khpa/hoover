import React from 'react';

const Controls = ({ onMove }) => {
  return (
    <div className={"controls"}>
      <div />
      <div className={"north myButton"} onClick={() => onMove(0, 1)}>
        UP
      </div>
      <div />
      <div className={"west myButton"} onClick={() => onMove(-1, 0)}>
        LEFT
      </div>
      <div />
      <div className={"east myButton"} onClick={() => onMove(1, 0)}>
        RIGHT
      </div>
      <div />
      <div className={"south myButton"} onClick={() => onMove(0, -1)}>
        DOWN
      </div>
      <div />
    </div>
  );
};

export default Controls;