import React, { useState, useRef, useEffect } from "react";
import './InputBoxes.scss';
import deleteImage from '../assets/delete.png';
import { InlineMath } from 'react-katex';

interface ValueBoxProps { // interfaces can be used as a nice packing for types 
  variableName: string; // this prop needs to be determined by the parent component
  onBoxDelete: () => void; // delete function
  updateVariables: (value: string) => void;
  updateNominalValues: (nominalValue: string) => void;
  updateErrorValuesVariable: (errorValue: string) => void;
  updateErrorValuesConstant: (errorValue: string) => void;
  updateConstErrors: (constError: boolean) => void;
  toggle: boolean;
}


function ValueBox({ 
  updateVariables,
  onBoxDelete,
  variableName,
  updateNominalValues,
  updateErrorValuesVariable,
  updateErrorValuesConstant,
  updateConstErrors,
  toggle}: ValueBoxProps) {
  /* 
    The ValueBox component is a component that represents a single box in the input section of the application.
    It contains two text areas, one for the nominal values and one for the error values.
    All the states of the component are managed here, except for the variable name which is managed by the parent component.
    The parent component, App.tsx, passes down the variable name, the function to change the variable name, and the function to delete the box.
  */
  const[isHoveringOverScrollbar, setIsHoveringOverScrollbar] = useState(false);
  const[isFocused, setIsFocused] = useState(false);
  const[nominalValue, setNominalValue] = useState('');

  // manage two separate error values, one for constant error and one for variable error
  const[variableErrorValue, setVariableErrorValue] = useState('');
  const[constantErrorValue, setConstantErrorValue] = useState('');
  const[constError, setConstError] = useState(true); // keep track if we have constant or variable error
  
  // we use this to get the x position of the component
  // the reason we want this is for if we ever want to disable a component's right margin if it can fit on the right side of the screen
  const [rectX, setRectX] = useState(0);
  const [boxCaseWidth, setBoxCaseWidth] = useState(0);
  const [disableRightMargin, setDisableRightMargin] = useState(false);
  const boxCaseRef = useRef<HTMLDivElement>(null);

  const pageMargin = 0.15; // 15% of viewport width
  const valBoxLength = Math.max(140, 0.08 * window.innerWidth + 34); // corresponds to the css in InputBoxes.scss 
  const boxSpacing = 0.02 * window.innerWidth; // corresponds to the css in InputBoxes.scss

  useEffect(() => {
    if (boxCaseRef.current) {
      const rect = boxCaseRef.current.getBoundingClientRect();
      console.log("Component:", variableName, "rect x:", rect.x);
      console.log("Component rect width:", rect.width);
      setRectX(rect.x);
      setBoxCaseWidth(rect.width);
    }
  }, [toggle]);

  useEffect(() => {
    console.log(window.innerWidth);
    const a = (rectX + boxCaseWidth < window.innerWidth * (1 - pageMargin));
    // TODO: theres a lot of bad logic in this code, fix it later.
    // remember, the goal is that we want to try fitting 5 boxes on the screen
    const b = (rectX + boxCaseWidth + valBoxLength + boxSpacing + 8 > window.innerWidth * (1 - pageMargin));
    if (a && b) {
      setDisableRightMargin(true);
    } else {
      setDisableRightMargin(false);
    }
  }, [rectX, boxCaseWidth, valBoxLength, boxSpacing]);


  const scrollBarHoverCheck = (event: React.MouseEvent<HTMLTextAreaElement, MouseEvent>) => {
    const { clientX, clientY } = event;
    const rect = (event.target as HTMLDivElement).getBoundingClientRect();
    
    const isInsideElement = (rect.right - 7 <= clientX && clientX <= rect.right) ||
                            (rect.bottom - 7 <= clientY && clientY <= rect.bottom - 1);

    setIsHoveringOverScrollbar(isInsideElement);
  }

  const handleNominalValChange = (value: string) => {
    setNominalValue(value);
    updateNominalValues(value);
  };

  const handleVariableErrorChange = (error: string) => {
    setVariableErrorValue(error);
    updateErrorValuesVariable(error);
  };

  const handleConstantErrorChange = (error: string) => {
    setConstantErrorValue(error);
    updateErrorValuesConstant(error);
  };

  // eslint-disable-next-line
  const errorToggle = () => { // implement error button reaction
    // when users click the error change button which swaps between constant error and variable error
    setConstError(!constError);
    updateConstErrors(!constError);
  }

  return (
    <div className={constError ? "valueBoxPackage constError" : "valueBoxPackage"}>
      <div className="valBoxHeader">
        <input 
          className="boxVar" 
          type="text" 
          maxLength={4}
          value={variableName}
          onChange={(e) => updateVariables(e.target.value)}
        />
        
        <div className="errorButton" onClick={() => errorToggle()}>
          {/* TODO: instead of doing sigma_{c} with inline math, just use an image */}
          { constError ? <InlineMath className="inline-math" math="\sigma_{c}" /> : <InlineMath className="inline-math" math="\sigma(x)" /> }
        </div>

        <div className="deleteButton" onClick={() => onBoxDelete()}>
          <img src={deleteImage} alt="delete button" />
        </div>
      </div>
      <div className={isFocused ? "focusedBox" : ""}>
        {constError && (
        <input
          placeholder="Enter Error"
          spellCheck="false"
          className="constErrorField" 
          type="text"
          value={constantErrorValue}
          onChange={(e) => handleConstantErrorChange(e.target.value)}
          onFocus={() => {setIsFocused(true)}}
          onBlur={() => {setIsFocused(false)}}
        />
        )}
        <div className="boxCase" ref={boxCaseRef}>
          <textarea
            className={isHoveringOverScrollbar ? "valueBox hoveringScrollbar" : "valueBox"}
            name="nominals"
            value={nominalValue}
            onChange={(e) => handleNominalValChange(e.target.value)}
            cols={30}
            rows={10}
            spellCheck="false"
            onMouseMove={(e) => scrollBarHoverCheck(e)}
            onFocus={() => {setIsFocused(true)}}
            onBlur={() => {setIsFocused(false)}}
          ></textarea>
          {!constError && (
          <>
            <div className="separatingLine"></div>
            <textarea
              className={isHoveringOverScrollbar ? "errorBox hoveringScrollbar" : "errorBox"}
              name="errors"
              value={variableErrorValue}
              onChange={(e) => handleVariableErrorChange(e.target.value)}
              cols={20}
              rows={10}
              spellCheck="false"
              onMouseMove={(e) => scrollBarHoverCheck(e)}
              onFocus={() => {setIsFocused(true)}}
              onBlur={() => {setIsFocused(false)}}
            ></textarea>
          </>)}
        </div>
      </div>
    </div>
  );
}

export default ValueBox;