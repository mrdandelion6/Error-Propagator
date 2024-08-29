import React, { useState } from "react";
import './InputBoxes.scss';
import deleteImage from '../../assets/delete.png';
import { InlineMath } from 'react-katex';
import { validateValueBox  } from "../../utils/verifyInput";

interface ValueBoxProps { // interfaces can be used as a nice packing for types 
  variableName: string; // this prop needs to be determined by the parent component
  onBoxDelete: () => void; // delete function
  updateVariables: (value: string) => void;
  updateNominalValues: (nominalValue: string) => void;
  updateErrorValuesVariable: (errorValue: string) => void;
  updateErrorValuesConstant: (errorValue: string) => void;
  updateConstErrors: (constError: boolean) => void;
}


function ValueBox({ 
  updateVariables,
  onBoxDelete,
  variableName,
  updateNominalValues,
  updateErrorValuesVariable,
  updateErrorValuesConstant,
  updateConstErrors}: ValueBoxProps) {
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

  // bad input messages
  const[badNominalInputMessage, setBadNominalInputMessage] = useState<string>('');
  const[badErrorInputMessage, setBadErrorInputMessage] = useState<string>('');

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

  const errorToggle = () => { // implement error button reaction
    // when users click the error change button which swaps between constant error and variable error
    setConstError(!constError);
    updateConstErrors(!constError);
  }

  const handleBlur = (field: string) => {
    setIsFocused(false);
    let validation: string[] = [];x
    // TODO: add validation checks and updates for the input
    switch (field) {
      case "nominalValue": {
        validation = validateValueBox(true, nominalValue);
        break;
      }
      case "variableError": {
        validation = validateValueBox(false, variableErrorValue);
        break;
      }
      case "constantError": {
        validation = validateValueBox(true, constantErrorValue);
        break;
      }
      default:
        validation = ['', '']; // this should never happen but..
        break;
    }
  }

  return (
    <div className={constError ? "valueBoxPackage constError noMP" : "valueBoxPackage noMP"}>
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
      <div className={isFocused ? "focusedBox noMP" : "noMP"}> </div>
      {constError && (
      <input
        placeholder="Enter Error"
        spellCheck="false"
        className="constErrorField" 
        type="text"
        value={constantErrorValue}
        onChange={(e) => handleConstantErrorChange(e.target.value)}
        onFocus={() => {setIsFocused(true)}}
        onBlur={() => {handleBlur("constantError")}}
      />
      )}
      <div className="boxCase">
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
          onBlur={() => {handleBlur("nominalValue")}}
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
            onBlur={() => {handleBlur("variableError")}}
          ></textarea></>
        )}
      </div>
    </div>
  );
}

export default ValueBox;