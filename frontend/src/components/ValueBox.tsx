import React, { useState } from "react";
import './InputBoxes.scss';
import deleteImage from '../assets/delete.png';
import { InlineMath } from 'react-katex';

interface ValueBoxProps { // interfaces can be used as a nice packing for types 
  value: string;
  varX: string;
  errX: string | number; // error value will either be number or a variable name
  onValChange: (value: string) => void;
  onVarChange: (value: string) => void;
  onErrChange: (value: string) => void;
  del: () => void; // delete function
  errorPress: () => void; // delete function
}


function ValueBox({ value, varX, errX, onValChange, onVarChange, onErrChange, del, errorPress }: ValueBoxProps) {
  const[isHoveringOverScrollbar, setIsHoveringOverScrollbar] = useState(false);
  const[isFocused, setIsFocused] = useState(false);
  const[isConst, setIsConst] = useState(1); // keep track of whether the error is a constant or variable one

  const scrollBarHoverCheck = (event: React.MouseEvent<HTMLTextAreaElement, MouseEvent>) => {
    const { clientX, clientY } = event;
    const rect = (event.target as HTMLDivElement).getBoundingClientRect();
    
    const isInsideElement = (rect.right - 7 <= clientX && clientX <= rect.right) ||
                            (rect.bottom - 7 <= clientY && clientY <= rect.bottom - 1);

    setIsHoveringOverScrollbar(isInsideElement);
  }

  return (
    <div className="valueBoxPackage">
      <div className="valBoxHeader">
        <input 
          className="boxVar" 
          type="text" 
          maxLength={4}
          value={varX}
          onChange={(e) => onVarChange(e.target.value)}
        />
        
        <div className="errorButton" onClick={() => errorPress()}>
          { typeof(errX) == 'number' ? <InlineMath className="inline-math" math="\sigma_c" /> : <InlineMath className="inline-math" math="\sigma(x)" /> }
        </div>

        <div className="deleteButton" onClick={() => del()}>
          <img src={deleteImage} alt="delete button" />
        </div>
      </div>
      <div className={isFocused ? "focusedBox" : ""}>
        <div className="valueCase">
          <textarea
            className={isHoveringOverScrollbar ? "valueBox hoveringScrollbar" : "valueBox"}
            name="input_data"
            value={value}
            onChange={(e) => onValChange(e.target.value)}
            cols={30}
            rows={10}
            spellCheck="false"
            onMouseMove={(e) => scrollBarHoverCheck(e)}
            onFocus={() => {setIsFocused(true)}}
            onBlur={() => {setIsFocused(false)}}
          ></textarea>
        </div>
      </div>
    </div>
  );
}

export default ValueBox;