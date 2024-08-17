import React, { useState } from "react";
import './InputBoxes.scss';
import deleteImage from '../assets/delete.png';
import { InlineMath } from 'react-katex';

interface ValueBoxProps { // interfaces can be used as a nice packing for types 
  onVarChange: (value: string) => void;
  onBoxDelete: () => void; // delete function
  variableName: string;
}


function ValueBox({ onVarChange, onBoxDelete, variableName }: ValueBoxProps) {
  /* 
    The ValueBox component is a component that represents a single box in the input section of the application.
    It contains two text areas, one for the nominal values and one for the error values.
    All the states of the component are managed here, except for the variable name which is managed by the parent component.
    The parent component, App.tsx, passes down the variable name, the function to change the variable name, and the function to delete the box.
  
  */
  const[isHoveringOverScrollbar, setIsHoveringOverScrollbar] = useState(false);
  const[isFocused, setIsFocused] = useState(false);
  const[nominalValue, setNominalValue] = useState('');
  const[errorValue, setErrorValue] = useState('');
  const[constError, setConstError] = useState(true); // keep track if we have constant or variable error

  const scrollBarHoverCheck = (event: React.MouseEvent<HTMLTextAreaElement, MouseEvent>) => {
    const { clientX, clientY } = event;
    const rect = (event.target as HTMLDivElement).getBoundingClientRect();
    
    const isInsideElement = (rect.right - 7 <= clientX && clientX <= rect.right) ||
                            (rect.bottom - 7 <= clientY && clientY <= rect.bottom - 1);

    setIsHoveringOverScrollbar(isInsideElement);
  }

  const handleValChange = (value: string) => {
    setNominalValue(value);
  };

  const handleErrChange = (error: string) => {
    setErrorValue(error);
  };

  // eslint-disable-next-line
  const errorToggle = () => { // implement error button reaction
    // when users click the error change button which swaps between constant error and variable error
    setConstError(!constError);
  }

  return (
    <div className="valueBoxPackage">
      <div className="valBoxHeader">
        <input 
          className="boxVar" 
          type="text" 
          maxLength={4}
          value={variableName}
          onChange={(e) => onVarChange(e.target.value)}
        />
        
        <div className="errorButton" onClick={() => errorToggle()}>
          { constError ? <InlineMath className="inline-math" math="\sigma_c" /> : <InlineMath className="inline-math" math="\sigma(x)" /> }
        </div>

        <div className="deleteButton" onClick={() => onBoxDelete()}>
          <img src={deleteImage} alt="delete button" />
        </div>
      </div>
      <div className={isFocused ? "focusedBox" : ""}>
        <div className="boxCase">
          <textarea
            className={isHoveringOverScrollbar ? "valueBox hoveringScrollbar" : "valueBox"}
            name="nominals"
            value={nominalValue}
            onChange={(e) => handleValChange(e.target.value)}
            cols={30}
            rows={10}
            spellCheck="false"
            onMouseMove={(e) => scrollBarHoverCheck(e)}
            onFocus={() => {setIsFocused(true)}}
            onBlur={() => {setIsFocused(false)}}
          ></textarea>
          <div className="separatingLine"></div>
          <textarea
            className={isHoveringOverScrollbar ? "errorBox hoveringScrollbar" : "errorBox"}
            name="errors"
            value={errorValue}
            onChange={(e) => handleErrChange(e.target.value)}
            cols={20}
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