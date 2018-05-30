import React from 'react';

const dustCount = (props)=>{
    return (
        <div>
            You have cleaned {props.dustCounter} dust patches in {props.moves} moves.
        </div>    
    )
}

export default dustCount;