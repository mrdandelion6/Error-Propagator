import React, { useState, useRef, useEffect } from "react";
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
  // even if we have both bad nominal and errors values, we display the nomial issue only
  // we display error issue if there is no nominal issue
  const[badNominalInputMessage, setBadNominalInputMessage] = useState<string>('');
  const[badErrorInputMessage, setBadErrorInputMessage] = useState<string>('');
  const[hasError, setHasError] = useState<boolean>(false);

  // we want to track the height of the error message that will pop up inside the value box
  // we use a reference to the error message div to get the height
  // we also want to update the height when the window is resized
  const boxHeight = 500; // in px
  const errorRef = useRef<HTMLDivElement>(null);
  const [errorMessageHeight, setErrorMessageHeight] = useState(0);

  // references to the text areas
  const nominalRef = useRef<HTMLTextAreaElement>(null);
  const variableErrorRef = useRef<HTMLTextAreaElement>(null);
  const constErrorRef = useRef<HTMLInputElement>(null);

  const updateErrorMessageHeight = () => {
    if (errorRef.current) {
      console.log("updating error message height: ", errorRef.current.clientHeight);
      setErrorMessageHeight(errorRef.current.clientHeight);
    } else { // the errorRef.current will be null if the error message is not displayed
      setErrorMessageHeight(0);
    }
  };

  useEffect(() => {
    updateErrorMessageHeight();
    window.addEventListener('resize', updateErrorMessageHeight);
    return () => {
      window.removeEventListener('resize', updateErrorMessageHeight);
    };
  }, [badErrorInputMessage, badNominalInputMessage]);

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
    handleBlur(constError ? "variableError" : "constantError");
  }

  const handleBlur = (field: string) => {
    setIsFocused(false);
    let validation: string[] = [];
    let tempBadNominalInputMessage = badNominalInputMessage;
    let tempBadErrorInputMessage = badErrorInputMessage;
    switch (field) {
      case "nominalValue": {
        validation = validateValueBox(false, nominalValue, false);
        setBadNominalInputMessage(validation[0]);
        setNominalValue(validation[1]);
        tempBadNominalInputMessage = validation[0];
        break;
      }
      case "variableError": {
        validation = validateValueBox(false, variableErrorValue);
        setBadErrorInputMessage(validation[0]);
        setVariableErrorValue(validation[1]);
        tempBadErrorInputMessage = validation[0];
        break;
      }
      case "constantError": {
        validation = validateValueBox(true, constantErrorValue);
        setBadErrorInputMessage(validation[0]);
        setConstantErrorValue(validation[1]);
        tempBadErrorInputMessage = validation[0];
        break;
      }
      default:
        validation = ['', '']; // we should never get a default case
        break;
    }
    if (validation[0] !== '') {
      setHasError(true);
    } else if (tempBadNominalInputMessage + tempBadErrorInputMessage === '') {
      setHasError(false);
    }
  }

  const getHeight = (): number => {
    // return the height of the box as a number
    let height = boxHeight;
    if (constError) {
      height -= 40;
    }
    height -= errorMessageHeight;
    return height;
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement> | React.KeyboardEvent<HTMLInputElement>, eventLocation: string) => {
    if (event.key === 'Enter') {
      // only listening for the enter key
      if (event.ctrlKey) { // if ctrl + enter
        // should cause a blur event
        const validLocations = ["nominalValue", "variableError", "constantError"];
        if (!validLocations.includes(eventLocation)) {
          return;
        }
        event.preventDefault();
        switch (eventLocation) {
          case "nominalValue":
            nominalRef.current?.blur();
            break;
          case "variableError":
            variableErrorRef.current?.blur();
            break;
          case "constantError":
            constErrorRef.current?.blur();
            break;
          // no default case, we should never get here because of the check at the beginning
        }
      }

      else if (event.shiftKey) { // if shift + enter
        // should cause a blur event then focus on the other box.
        // pressing enter in contsantError will have same effect
        const validLocations = ["nominalValue", "variableError", "constantError"];
        if (!validLocations.includes(eventLocation)) {
          return;
        }
        event.preventDefault();
        switch (eventLocation) {
          case "nominalValue":
            nominalRef.current?.blur();
            if (!constError) {
              variableErrorRef.current?.focus();
            }
            break;
          case "variableError": // there is nothing to focus on after variable error
            variableErrorRef.current?.blur();
            break;
          case "constantError": 
            constErrorRef.current?.blur();
            nominalRef.current?.focus();
            break;
          // no default case, we should never get here because of the check at the beginning
        }
      }
    
      else {
        // only for the constant error field, should cause blur then focus on nominal value box
        const validLocations = ["constantError"];
        if (!validLocations.includes(eventLocation)) {
          return;
        }
        event.preventDefault();
        switch (eventLocation) {
          case "constantError":
            constErrorRef.current?.blur();
            nominalRef.current?.focus();
            break;
          // no default case, we should never get here because of the check at the beginning
        }
      }
    }
  }

  return (
    <div className={(() => {
        let class_name = "valueBoxPackage noMP"
        if (hasError) {
          class_name += " badInput"
        }
        if (constError) {
          class_name += " constError"
        }
        return class_name;
      })() // using an IIFE to determine the class name
    }>
      <div className="valBoxHeader">
        <input 
          className="boxVar" 
          type="text" 
          maxLength={4}
          value={variableName}
          onChange={(e) => updateVariables(e.target.value)}
          onFocus={() => {setIsFocused(true)}}
          onBlur={() => {handleBlur("variableName")}}
        />
        
        <div className="errorButton" onClick={() => errorToggle()}>
          {/* TODO: instead of doing sigma_{c} with inline math, just use an image */}
          { constError ? <InlineMath className="inline-math" math="\sigma_{c}" /> : <InlineMath className="inline-math" math="\sigma(x)" /> }
        </div>

        <div className="deleteButton" onClick={() => onBoxDelete()}>
          <img src={deleteImage} alt="delete button" />
        </div>
      </div>
      <div className={ hasError ? "invalidBox focusedBox noMP" : (isFocused ? "focusedBox noMP" : "noMP") }/>
      {badNominalInputMessage !== '' ? (<div ref={errorRef} className={!constError ? "badInputMessage inBoxMessage" : "badInputMessage inBoxMessage constError"}>{badNominalInputMessage}</div>
      ) : (
        badErrorInputMessage !== '' ? (<div ref={errorRef} className={!constError ? "badInputMessage inBoxMessage" : "badInputMessage inBoxMessage constError"}>{badErrorInputMessage}</div>
        ) : (null)
      )}
      {constError && (
      <input
        ref={constErrorRef}
        placeholder="Enter Error"
        spellCheck="false"
        className="constErrorField" 
        type="text"
        value={constantErrorValue}
        onChange={(e) => handleConstantErrorChange(e.target.value)}
        onFocus={() => {setIsFocused(true)}}
        onBlur={() => {handleBlur("constantError")}}
        style={ hasError ? {borderTop: "none"} : {}}
        onKeyDown={(e) => handleKeyDown(e, "constantError")}
      />
      )}
      <div className="boxCase">
        <textarea
          ref={nominalRef}
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
          style={{height: String(getHeight()) + "px"}}
          onKeyDown={(e) => handleKeyDown(e, "nominalValue")}
        ></textarea>
        {!constError && (
        <>
          <div className="separatingLine"></div>
          <textarea
            ref={variableErrorRef}
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
            style={{height: String(getHeight()) + "px"}}
            onKeyDown={(e) => handleKeyDown(e, "variableError")}
          ></textarea>
        </>
        )}
      </div>
    </div>
  );
}

export default ValueBox;